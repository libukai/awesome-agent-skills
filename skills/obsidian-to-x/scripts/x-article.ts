import { spawn } from 'node:child_process';
import fs from 'node:fs';
import { mkdir, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import process from 'node:process';

import { parseMarkdown } from './md-to-article.js';
import {
  CHROME_CANDIDATES_BASIC,
  CdpConnection,
  cdpPasteImage,
  copyHtmlToClipboard,
  copyImageToClipboard,
  findChromeExecutable,
  getDefaultProfileDir,
  getFreePort,
  grantClipboardPermissions,
  normalDelay,
  pasteFromClipboard,
  sleep,
  thinkDelay,
  waitForChromeDebugPort,
} from './x-utils.js';
import { insertCodeBlocks } from './insert-code-blocks.js';

const X_ARTICLES_URL = 'https://x.com/compose/articles';

const I18N_SELECTORS = {
  titleInput: [
    'textarea[placeholder="Add a title"]',
    'textarea[placeholder="添加标题"]',
    'textarea[placeholder="タイトルを追加"]',
    'textarea[placeholder="제목 추가"]',
    'textarea[name="Article Title"]',
  ],
  addPhotosButton: [
    '[aria-label="Add photos or video"]',
    '[aria-label="添加照片或视频"]',
    '[aria-label="写真や動画を追加"]',
    '[aria-label="사진 또는 동영상 추가"]',
  ],
  previewButton: [
    'a[href*="/preview"]',
    '[data-testid="previewButton"]',
    'button[aria-label*="preview" i]',
    'button[aria-label*="预览" i]',
    'button[aria-label*="プレビュー" i]',
    'button[aria-label*="미리보기" i]',
  ],
  publishButton: [
    '[data-testid="publishButton"]',
    'button[aria-label*="publish" i]',
    'button[aria-label*="发布" i]',
    'button[aria-label*="公開" i]',
    'button[aria-label*="게시" i]',
  ],
};

interface ArticleOptions {
  markdownPath: string;
  coverImage?: string;
  title?: string;
  submit?: boolean;
  profileDir?: string;
  chromePath?: string;
}

async function findExistingDebugPort(profileDir: string): Promise<number | null> {
  const portFile = path.join(profileDir, 'DevToolsActivePort');
  if (!fs.existsSync(portFile)) return null;

  try {
    const content = fs.readFileSync(portFile, 'utf-8').trim();
    if (!content) return null;
    const [portLine] = content.split(/\r?\n/);
    const port = Number(portLine);
    if (!Number.isFinite(port) || port <= 0) return null;

    // Verify the port is actually active.
    await waitForChromeDebugPort(port, 1500, { includeLastError: true });
    return port;
  } catch {
    return null;
  }
}

export async function publishArticle(options: ArticleOptions): Promise<void> {
  const { markdownPath, submit = false, profileDir = getDefaultProfileDir() } = options;

  console.log('[x-article] Parsing markdown...');
  const parsed = await parseMarkdown(markdownPath, {
    title: options.title,
    coverImage: options.coverImage,
    projectRoot: process.cwd(),
  });

  console.log(`[x-article] Title: ${parsed.title}`);
  console.log(`[x-article] Cover: ${parsed.coverImage ?? 'none'}`);
  console.log(`[x-article] Content images: ${parsed.contentImages.length}`);

  // Save HTML to system temp directory to avoid cross-device link errors
  const tempDir = os.tmpdir();
  const htmlPath = path.join(tempDir, 'x-article-content.html');
  await writeFile(htmlPath, parsed.html, 'utf-8');
  console.log(`[x-article] HTML saved to: ${htmlPath}`);

  const chromePath = options.chromePath ?? findChromeExecutable(CHROME_CANDIDATES_BASIC);
  if (!chromePath) throw new Error('Chrome not found');

  await mkdir(profileDir, { recursive: true });
  const existingPort = await findExistingDebugPort(profileDir);
  const port = existingPort ?? await getFreePort();

  if (existingPort) {
    console.log(`[x-article] Reusing existing Chrome instance on port ${port}`);
  } else {
    console.log(`[x-article] Launching Chrome...`);
    const chromeArgs = [
      `--remote-debugging-port=${port}`,
      `--user-data-dir=${profileDir}`,
      '--no-first-run',
      '--no-default-browser-check',
      '--disable-blink-features=AutomationControlled',
      '--start-maximized',
      X_ARTICLES_URL,
    ];
    if (process.platform === 'darwin') {
      const appPath = chromePath.replace(/\/Contents\/MacOS\/Google Chrome$/, '');
      spawn('open', ['-na', appPath, '--args', ...chromeArgs], { stdio: 'ignore' });
    } else {
      spawn(chromePath, chromeArgs, { stdio: 'ignore' });
    }
  }

  let cdp: CdpConnection | null = null;

  try {
    const wsUrl = await waitForChromeDebugPort(port, 30_000, { includeLastError: true });
    cdp = await CdpConnection.connect(wsUrl, 30_000, { defaultTimeoutMs: 60_000 });

    // Get page target
    const targets = await cdp.send<{ targetInfos: Array<{ targetId: string; url: string; type: string }> }>('Target.getTargets');
    let pageTarget = targets.targetInfos.find((t) => t.type === 'page' && t.url.startsWith(X_ARTICLES_URL));

    if (!pageTarget) {
      const { targetId } = await cdp.send<{ targetId: string }>('Target.createTarget', { url: X_ARTICLES_URL });
      pageTarget = { targetId, url: X_ARTICLES_URL, type: 'page' };
    }

    const { sessionId } = await cdp.send<{ sessionId: string }>('Target.attachToTarget', { targetId: pageTarget.targetId, flatten: true });

    await cdp.send('Page.enable', {}, { sessionId });
    await cdp.send('Runtime.enable', {}, { sessionId });
    await cdp.send('DOM.enable', {}, { sessionId });

    // Grant clipboard permissions so CDP paste works even when Chrome is in background
    const clipboardGranted = await grantClipboardPermissions(cdp);

    console.log('[x-article] Waiting for articles page...');
    await thinkDelay(); // non-critical: human-like pause after navigation

    // Wait for and click "create" button
    const waitForElement = async (selector: string, timeoutMs = 60_000): Promise<boolean> => {
      const start = Date.now();
      while (Date.now() - start < timeoutMs) {
        const result = await cdp!.send<{ result: { value: boolean } }>('Runtime.evaluate', {
          expression: `!!document.querySelector('${selector}')`,
          returnByValue: true,
        }, { sessionId });
        if (result.result.value) return true;
        await sleep(500);
      }
      return false;
    };

    const clickElement = async (selector: string): Promise<boolean> => {
      const result = await cdp!.send<{ result: { value: boolean } }>('Runtime.evaluate', {
        expression: `(() => { const el = document.querySelector('${selector}'); if (el) { el.click(); return true; } return false; })()`,
        returnByValue: true,
      }, { sessionId });
      return result.result.value;
    };

    const typeText = async (selector: string, text: string): Promise<void> => {
      await cdp!.send('Runtime.evaluate', {
        expression: `(() => {
          const el = document.querySelector('${selector}');
          if (el) {
            el.focus();
            document.execCommand('insertText', false, ${JSON.stringify(text)});
          }
        })()`,
      }, { sessionId });
    };

    const pressKey = async (key: string, modifiers = 0): Promise<void> => {
      await cdp!.send('Input.dispatchKeyEvent', {
        type: 'keyDown',
        key,
        code: `Key${key.toUpperCase()}`,
        modifiers,
        windowsVirtualKeyCode: key.toUpperCase().charCodeAt(0),
      }, { sessionId });
      await cdp!.send('Input.dispatchKeyEvent', {
        type: 'keyUp',
        key,
        code: `Key${key.toUpperCase()}`,
        modifiers,
        windowsVirtualKeyCode: key.toUpperCase().charCodeAt(0),
      }, { sessionId });
    };

    // Check if we're on the articles list page (has Write button)
    console.log('[x-article] Looking for Write button...');
    const writeButtonFound = await waitForElement('[data-testid="empty_state_button_text"]', 10_000);

    if (writeButtonFound) {
      console.log('[x-article] Clicking Write button...');
      await cdp.send('Runtime.evaluate', {
        expression: `document.querySelector('[data-testid="empty_state_button_text"]')?.click()`,
      }, { sessionId });
      await sleep(2000);
    }

    // Wait for editor (title textarea)
    const titleSelectors = I18N_SELECTORS.titleInput.join(', ');
    console.log('[x-article] Waiting for editor...');
    const editorFound = await waitForElement(titleSelectors, 30_000);
    if (!editorFound) {
      console.log('[x-article] Editor not found. Please ensure you have X Premium and are logged in.');
      await sleep(60_000);
      throw new Error('Editor not found');
    }

    // Upload cover image
    if (parsed.coverImage) {
      console.log('[x-article] Uploading cover image...');

      // Click "Add photos or video" button
      const addPhotosSelectors = JSON.stringify(I18N_SELECTORS.addPhotosButton);
      await cdp.send('Runtime.evaluate', {
        expression: `(() => {
          const selectors = ${addPhotosSelectors};
          for (const sel of selectors) {
            const el = document.querySelector(sel);
            if (el) { el.click(); return true; }
          }
          return false;
        })()`,
      }, { sessionId });
      await sleep(500);

      // Use file input directly
      const { root } = await cdp.send<{ root: { nodeId: number } }>('DOM.getDocument', {}, { sessionId });
      const { nodeId } = await cdp.send<{ nodeId: number }>('DOM.querySelector', {
        nodeId: root.nodeId,
        selector: '[data-testid="fileInput"], input[type="file"][accept*="image"]',
      }, { sessionId });

      if (nodeId) {
        await cdp.send('DOM.setFileInputFiles', {
          nodeId,
          files: [parsed.coverImage],
        }, { sessionId });
        console.log('[x-article] Cover image file set');

        // Wait for Apply button to appear and click it
        console.log('[x-article] Waiting for Apply button...');
        const applyFound = await waitForElement('[data-testid="applyButton"]', 15_000);
        if (applyFound) {
          // Check if modal is present
          const isModalOpen = async (): Promise<boolean> => {
            const result = await cdp!.send<{ result: { value: boolean } }>('Runtime.evaluate', {
              expression: `!!document.querySelector('[role="dialog"][aria-modal="true"]')`,
              returnByValue: true,
            }, { sessionId });
            return result.result.value;
          };

          // Click Apply button with retry logic
          const maxRetries = 3;
          for (let attempt = 1; attempt <= maxRetries; attempt++) {
            console.log(`[x-article] Clicking Apply button (attempt ${attempt}/${maxRetries})...`);

            await cdp.send('Runtime.evaluate', {
              expression: `document.querySelector('[data-testid="applyButton"]')?.click()`,
            }, { sessionId });

            // Wait for modal to close (up to 5 seconds per attempt)
            const closeTimeout = 5000;
            const checkInterval = 300;
            const startTime = Date.now();
            let modalClosed = false;

            while (Date.now() - startTime < closeTimeout) {
              await sleep(checkInterval);
              const stillOpen = await isModalOpen();
              if (!stillOpen) {
                modalClosed = true;
                break;
              }
            }

            if (modalClosed) {
              console.log('[x-article] Cover image applied, modal closed');
              await sleep(500);
              break;
            }

            if (attempt < maxRetries) {
              console.log('[x-article] Modal still open, retrying...');
            } else {
              console.log('[x-article] Modal did not close after all attempts, continuing anyway...');
            }
          }
        } else {
          console.log('[x-article] Apply button not found, continuing...');
        }
      }
    }

    // Fill title using keyboard input
    if (parsed.title) {
      console.log('[x-article] Filling title...');

      // Focus title input
      const titleInputSelectors = JSON.stringify(I18N_SELECTORS.titleInput);
      await cdp.send('Runtime.evaluate', {
        expression: `(() => {
          const selectors = ${titleInputSelectors};
          for (const sel of selectors) {
            const el = document.querySelector(sel);
            if (el) { el.focus(); return true; }
          }
          return false;
        })()`,
      }, { sessionId });
      await sleep(200);

      // Type title character by character using insertText
      await cdp.send('Input.insertText', { text: parsed.title }, { sessionId });
      await sleep(300);

      // Tab out to trigger save
      await cdp.send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Tab', code: 'Tab', windowsVirtualKeyCode: 9 }, { sessionId });
      await cdp.send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Tab', code: 'Tab', windowsVirtualKeyCode: 9 }, { sessionId });
      await normalDelay(); // non-critical: human-like pause after tabbing out of title
    }

    // Insert HTML content
    console.log('[x-article] Inserting content...');

    // Read HTML content
    const htmlContent = fs.readFileSync(htmlPath, 'utf-8');

    // Focus on DraftEditor body
    await cdp.send('Runtime.evaluate', {
      expression: `(() => {
        const editor = document.querySelector('.DraftEditor-editorContainer [contenteditable="true"]');
        if (editor) {
          editor.focus();
          editor.click();
          return true;
        }
        return false;
      })()`,
    }, { sessionId });
    await sleep(300);

    // Method 1: Simulate paste event with HTML data
    console.log('[x-article] Attempting to insert HTML via paste event...');
    const pasteResult = await cdp.send<{ result: { value: boolean } }>('Runtime.evaluate', {
      expression: `(() => {
        const editor = document.querySelector('.DraftEditor-editorContainer [contenteditable="true"]');
        if (!editor) return false;

        const html = ${JSON.stringify(htmlContent)};

        // Create a paste event with HTML data
        const dt = new DataTransfer();
        dt.setData('text/html', html);
        dt.setData('text/plain', html.replace(/<[^>]*>/g, ''));

        const pasteEvent = new ClipboardEvent('paste', {
          bubbles: true,
          cancelable: true,
          clipboardData: dt
        });

        editor.dispatchEvent(pasteEvent);
        return true;
      })()`,
      returnByValue: true,
    }, { sessionId });

    await thinkDelay(); // non-critical: human-like pause after HTML paste (method 1)

    // Check if content was inserted
    const contentCheck = await cdp.send<{ result: { value: number } }>('Runtime.evaluate', {
      expression: `document.querySelector('.DraftEditor-editorContainer [data-contents="true"]')?.innerText?.length || 0`,
      returnByValue: true,
    }, { sessionId });

    if (contentCheck.result.value > 50) {
      console.log(`[x-article] Content inserted successfully (${contentCheck.result.value} chars)`);
    } else {
      console.log('[x-article] Paste event may not have worked, trying insertHTML...');

      // Method 2: Use execCommand insertHTML
      await cdp.send('Runtime.evaluate', {
        expression: `(() => {
          const editor = document.querySelector('.DraftEditor-editorContainer [contenteditable="true"]');
          if (!editor) return false;
          editor.focus();
          document.execCommand('insertHTML', false, ${JSON.stringify(htmlContent)});
          return true;
        })()`,
      }, { sessionId });

      await thinkDelay(); // non-critical: human-like pause after HTML paste (method 2 fallback)

      // Check again
      const check2 = await cdp.send<{ result: { value: number } }>('Runtime.evaluate', {
        expression: `document.querySelector('.DraftEditor-editorContainer [data-contents="true"]')?.innerText?.length || 0`,
        returnByValue: true,
      }, { sessionId });

      if (check2.result.value > 50) {
        console.log(`[x-article] Content inserted via execCommand (${check2.result.value} chars)`);
      } else {
        console.log('[x-article] Auto-insert failed. HTML copied to clipboard - please paste manually (Cmd+V)');
        copyHtmlToClipboard(htmlPath);
        // Wait for manual paste
        console.log('[x-article] Waiting 30s for manual paste...');
        await sleep(30_000);
      }
    }

    // Insert content images (reverse order to maintain positions)
    if (parsed.contentImages.length > 0) {
      console.log('[x-article] Inserting content images...');

      // First, check what placeholders exist in the editor
      const editorContent = await cdp.send<{ result: { value: string } }>('Runtime.evaluate', {
        expression: `document.querySelector('.DraftEditor-editorContainer [data-contents="true"]')?.innerText || ''`,
        returnByValue: true,
      }, { sessionId });

      console.log('[x-article] Checking for placeholders in content...');
      for (const img of parsed.contentImages) {
        // Use regex for exact match (not followed by digit, e.g., XIMGPH_1 should not match XIMGPH_10)
        const regex = new RegExp(img.placeholder + '(?!\\d)');
        if (regex.test(editorContent.result.value)) {
          console.log(`[x-article] Found: ${img.placeholder}`);
        } else {
          console.log(`[x-article] NOT found: ${img.placeholder}`);
        }
      }

      // Process images in XIMGPH order (1, 2, 3, ...) regardless of blockIndex
      const getPlaceholderIndex = (placeholder: string): number => {
        const match = placeholder.match(/XIMGPH_(\d+)/);
        return match ? Number(match[1]) : Number.POSITIVE_INFINITY;
      };
      const sortedImages = [...parsed.contentImages].sort(
        (a, b) => getPlaceholderIndex(a.placeholder) - getPlaceholderIndex(b.placeholder),
      );

      for (let i = 0; i < sortedImages.length; i++) {
        const img = sortedImages[i]!;
        console.log(`[x-article] [${i + 1}/${sortedImages.length}] Inserting image at placeholder: ${img.placeholder}`);

        // Helper to select placeholder via mouse drag (same approach as code blocks).
        // WHY: DOM Range API selection + editor.focus() causes DraftJS to restore a stale
        // internal SelectionState, placing images at the wrong position.
        // Mouse drag lets DraftJS process its own onMouseDown/Move/Up events and keep
        // its internal SelectionState in sync with the DOM.
        const selectPlaceholder = async (maxRetries = 3): Promise<boolean> => {
          for (let attempt = 1; attempt <= maxRetries; attempt++) {
            // Find placeholder coordinates via DOM (for positioning only, NOT for selection).
            // Uses double rAF + awaitPromise: first rAF lets the browser process
            // scrollIntoView, second rAF ensures layout is computed so getClientRects()
            // returns accurate coordinates — critical after DOM reflow caused by
            // a previous image insertion shifting subsequent placeholders.
            const coords = await cdp!.send<{ result: { value: { startX: number; endX: number; y: number } | null } }>('Runtime.evaluate', {
              expression: `new Promise(resolve => {
                requestAnimationFrame(() => requestAnimationFrame(() => {
                  const editor = document.querySelector('.DraftEditor-editorContainer [data-contents="true"]');
                  if (!editor) { resolve(null); return; }
                  const ph = ${JSON.stringify(img.placeholder)};
                  const walker = document.createTreeWalker(editor, NodeFilter.SHOW_TEXT, null, false);
                  let node;
                  while ((node = walker.nextNode())) {
                    const text = node.textContent || '';
                    let searchStart = 0;
                    let idx;
                    while ((idx = text.indexOf(ph, searchStart)) !== -1) {
                      const afterIdx = idx + ph.length;
                      const charAfter = text[afterIdx];
                      if (charAfter === undefined || !/\d/.test(charAfter)) {
                        const parent = node.parentElement;
                        if (parent) parent.scrollIntoView({ behavior: 'instant', block: 'center' });
                        const range = document.createRange();
                        range.setStart(node, idx);
                        range.setEnd(node, idx + ph.length);
                        const rects = range.getClientRects();
                        if (rects.length > 0) {
                          const first = rects[0];
                          const last = rects[rects.length - 1];
                          resolve({ startX: Math.round(first.left + 2), endX: Math.round(last.right - 2), y: Math.round(first.top + first.height / 2) });
                          return;
                        }
                        if (parent) {
                          const r = parent.getBoundingClientRect();
                          resolve({ startX: Math.round(r.left + 2), endX: Math.round(r.right - 2), y: Math.round(r.top + r.height / 2) });
                          return;
                        }
                        resolve(null);
                        return;
                      }
                      searchStart = afterIdx;
                    }
                  }
                  resolve(null);
                }));
              })`,
              returnByValue: true,
              awaitPromise: true,
            }, { sessionId });

            if (!coords.result.value) {
              console.warn(`[x-article] Placeholder coords not found (attempt ${attempt})`);
              await sleep(500);
              continue;
            }

            const { startX, endX, y } = coords.result.value;

            // Mouse drag to select placeholder (DraftJS handles via its own event handlers)
            await cdp!.send('Input.dispatchMouseEvent', { type: 'mousePressed', x: startX, y, button: 'left', clickCount: 1 }, { sessionId });
            await sleep(80);
            await cdp!.send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: endX, y, button: 'left', clickCount: 0 }, { sessionId });
            await sleep(80);
            await cdp!.send('Input.dispatchMouseEvent', { type: 'mouseReleased', x: endX, y, button: 'left', clickCount: 1 }, { sessionId });
            await sleep(500);

            // Verify selection
            const selectionCheck = await cdp!.send<{ result: { value: string } }>('Runtime.evaluate', {
              expression: `window.getSelection()?.toString() || ''`,
              returnByValue: true,
            }, { sessionId });

            const selectedText = selectionCheck.result.value.trim();
            if (selectedText === img.placeholder) {
              console.log(`[x-article] Mouse selection verified: "${selectedText}"`);
              return true;
            }

            if (attempt < maxRetries) {
              console.log(`[x-article] Selection attempt ${attempt} got "${selectedText}", retrying...`);
              await sleep(500);
              // Before retry, ensure focus is in the editor (not title bar).
              // Get editor coords, then click inside to reset cleanly.
              const retryCoords = await cdp!.send<{ result: { value: { x: number; y: number } | null } }>('Runtime.evaluate', {
                expression: `(() => {
                  const el = document.querySelector('.DraftEditor-editorContainer [contenteditable="true"]');
                  if (!el) return null;
                  const r = el.getBoundingClientRect();
                  return { x: Math.round(r.left + r.width / 2), y: Math.round(r.top + r.height / 2) };
                })()`,
                returnByValue: true,
              }, { sessionId });
              if (retryCoords.result.value) {
                await cdp!.send('Input.dispatchMouseEvent', {
                  type: 'mousePressed', x: retryCoords.result.value.x, y: retryCoords.result.value.y, button: 'left', clickCount: 1,
                }, { sessionId });
                await cdp!.send('Input.dispatchMouseEvent', {
                  type: 'mouseReleased', x: retryCoords.result.value.x, y: retryCoords.result.value.y, button: 'left', clickCount: 1,
                }, { sessionId });
              }
            } else {
              console.warn(`[x-article] Selection failed after ${maxRetries} attempts, got: "${selectedText}"`);
            }
          }
          return false;
        };

        // Guard: ensure focus is in the editor body, NOT in the title bar.
        // After previous image paste, focus may have drifted.
        const focusGuard = await cdp.send<{ result: { value: { inEditor: boolean; tagName: string } } }>('Runtime.evaluate', {
          expression: `(() => {
            const container = document.querySelector('.DraftEditor-editorContainer');
            const active = document.activeElement;
            return { inEditor: active ? container?.contains(active) : false, tagName: active?.tagName || '' };
          })()`,
          returnByValue: true,
        }, { sessionId });
        if (!focusGuard.result.value.inEditor) {
          console.log(`[x-article] Focus NOT in editor (active: <${focusGuard.result.value.tagName}>), clicking editor...`);
          const guardCoords = await cdp.send<{ result: { value: { x: number; y: number } | null } }>('Runtime.evaluate', {
            expression: `(() => {
              const el = document.querySelector('.DraftEditor-editorContainer [contenteditable="true"]');
              if (!el) return null;
              const r = el.getBoundingClientRect();
              return { x: Math.round(r.left + r.width / 2), y: Math.round(r.top + r.height / 2) };
            })()`,
            returnByValue: true,
          }, { sessionId });
          if (guardCoords.result.value) {
            await cdp.send('Input.dispatchMouseEvent', {
              type: 'mousePressed', x: guardCoords.result.value.x, y: guardCoords.result.value.y, button: 'left', clickCount: 1,
            }, { sessionId });
            await cdp.send('Input.dispatchMouseEvent', {
              type: 'mouseReleased', x: guardCoords.result.value.x, y: guardCoords.result.value.y, button: 'left', clickCount: 1,
            }, { sessionId });
            await sleep(300);
          }
        }

        // Try to select the placeholder
        const selected = await selectPlaceholder(3);
        if (!selected) {
          console.warn(`[x-article] Skipping image - could not select placeholder: ${img.placeholder}`);
          continue;
        }

        console.log(`[x-article] Copying image: ${path.basename(img.localPath)}`);

        // Count existing image blocks before paste
        const imgCountBefore = await cdp.send<{ result: { value: number } }>('Runtime.evaluate', {
          expression: `document.querySelectorAll('section[data-block="true"][contenteditable="false"] img[src^="blob:"]').length`,
          returnByValue: true,
        }, { sessionId });
        const expectedImgCount = imgCountBefore.result.value + 1;

        // Step 1: Delete placeholder via keyboard Backspace
        // Mouse drag already focused the editor and set DraftJS's internal SelectionState correctly.
        // NO explicit editor.focus() — it would restore a stale DraftJS selection.
        console.log(`[x-article] Deleting placeholder "${img.placeholder}" via keyboard...`);

        // Backspace to delete selected placeholder text (updates ContentState)
        await cdp.send('Input.dispatchKeyEvent', {
          type: 'keyDown', key: 'Backspace', code: 'Backspace', windowsVirtualKeyCode: 8,
        }, { sessionId });
        await cdp.send('Input.dispatchKeyEvent', {
          type: 'keyUp', key: 'Backspace', code: 'Backspace', windowsVirtualKeyCode: 8,
        }, { sessionId });
        await sleep(200);

        // Placeholder occupied an entire DraftJS block — check if an empty block remains.
        // If the previous sibling is an atomic block (e.g. a previously inserted image),
        // do NOT remove the empty block (a second Backspace could select/delete the atomic).
        const emptyBlockInfo = await cdp.send<{ result: { value: { empty: boolean; prevAtomic: boolean } } }>('Runtime.evaluate', {
          expression: `(() => {
            const sel = window.getSelection();
            if (!sel || !sel.focusNode) return { empty: false, prevAtomic: false };
            let node = sel.focusNode;
            if (node.nodeType === 3) node = node.parentElement;
            const block = node?.closest?.('[data-block="true"]');
            if (!block) return { empty: false, prevAtomic: false };
            const empty = (block.textContent || '').trim() === '';
            // Check if previous sibling block is atomic (image/embed)
            const prevBlock = block.previousElementSibling?.closest?.('[data-block="true"]')
              || block.parentElement?.previousElementSibling?.querySelector?.('[data-block="true"]');
            const prevAtomic = prevBlock?.getAttribute('contenteditable') === 'false';
            // Treat "no previous block" (first block) same as prevAtomic:
            // Backspace on the first empty block in X Articles jumps focus to the title input.
            const unsafe = !prevBlock || !!prevAtomic;
            return { empty, prevAtomic: unsafe };
          })()`,
          returnByValue: true,
        }, { sessionId });

        if (emptyBlockInfo.result.value.empty && !emptyBlockInfo.result.value.prevAtomic) {
          // Safe to remove — previous block is text, not atomic
          await cdp.send('Input.dispatchKeyEvent', {
            type: 'keyDown', key: 'Backspace', code: 'Backspace', windowsVirtualKeyCode: 8,
          }, { sessionId });
          await cdp.send('Input.dispatchKeyEvent', {
            type: 'keyUp', key: 'Backspace', code: 'Backspace', windowsVirtualKeyCode: 8,
          }, { sessionId });
        }
        // If prevAtomic, leave the empty block as a safe insertion point for the image paste

        // Verify placeholder was removed from ContentState
        const placeholderDeleted = await cdp.send<{ result: { value: boolean } }>('Runtime.evaluate', {
          expression: `(() => {
            const editor = document.querySelector('.DraftEditor-editorContainer [data-contents="true"]');
            if (!editor) return true;
            const text = editor.innerText;
            const placeholder = ${JSON.stringify(img.placeholder)};
            const regex = new RegExp(placeholder + '(?!\\\\d)');
            return !regex.test(text);
          })()`,
          returnByValue: true,
        }, { sessionId });

        if (!placeholderDeleted.result.value) {
          console.warn(`[x-article] Placeholder still present after delete, retrying...`);
          const reselected = await selectPlaceholder(2);
          if (reselected) {
            // Mouse drag in selectPlaceholder already focused the editor correctly.
            // NO editor.focus() — it would restore a stale DraftJS selection.
            await sleep(200);
            await cdp.send('Input.dispatchKeyEvent', {
              type: 'keyDown', key: 'Backspace', code: 'Backspace', windowsVirtualKeyCode: 8,
            }, { sessionId });
            await cdp.send('Input.dispatchKeyEvent', {
              type: 'keyUp', key: 'Backspace', code: 'Backspace', windowsVirtualKeyCode: 8,
            }, { sessionId });
            await sleep(500);
          } else {
            console.error(`[x-article] ❌ Could not reselect placeholder, skipping: ${img.placeholder}`);
            continue;
          }
        }

        // CRITICAL: Ensure editor has focus before pasting image.
        // Mouse drag already set DraftJS's internal SelectionState. After deletion,
        // DraftJS should have moved cursor to the correct position.
        // We do NOT call editor.focus() — it would restore a stale DraftJS selection.
        // Instead, use a CDP mouse click inside the editor to re-focus without
        // disturbing DraftJS's internal state (a mousePressed at current cursor pos
        // is a no-op for DraftJS selection if the coordinates are near the caret).
        console.log(`[x-article] Ensuring editor focus before image paste...`);
        const editorCoords = await cdp.send<{ result: { value: { x: number; y: number } | null } }>('Runtime.evaluate', {
          expression: `(() => {
            const sel = window.getSelection();
            if (!sel || !sel.focusNode) return null;
            let node = sel.focusNode;
            if (node.nodeType === 3) node = node.parentElement;
            const block = node?.closest?.('[data-block="true"]');
            if (!block) return null;
            const r = block.getBoundingClientRect();
            // Click in the middle of the current block (where the caret should be after deletion)
            return { x: Math.round(r.left + r.width / 2), y: Math.round(r.top + r.height / 2) };
          })()`,
          returnByValue: true,
        }, { sessionId });
        if (editorCoords.result.value) {
          await cdp.send('Input.dispatchMouseEvent', {
            type: 'mousePressed', x: editorCoords.result.value.x, y: editorCoords.result.value.y,
            button: 'left', clickCount: 1,
          }, { sessionId });
          await cdp.send('Input.dispatchMouseEvent', {
            type: 'mouseReleased', x: editorCoords.result.value.x, y: editorCoords.result.value.y,
            button: 'left', clickCount: 1,
          }, { sessionId });
        }
        await sleep(200);

        console.log(`[x-article] Placeholder deleted. Pasting image at cursor...`);

        // Step 2: Paste image at current cursor position
        let pasteWorked = false;

        // Method 1: Synthetic paste event via CDP (no window focus required)
        console.log(`[x-article] Trying CDP synthetic paste (background-safe)...`);
        const cdpPasteOk = await cdpPasteImage(cdp, sessionId, img.localPath);
        if (cdpPasteOk) {
          // Check if image appeared within 5s
          const cdpCheckStart = Date.now();
          while (Date.now() - cdpCheckStart < 5_000) {
            const r = await cdp!.send<{ result: { value: number } }>('Runtime.evaluate', {
              expression: `document.querySelectorAll('section[data-block="true"][contenteditable="false"] img[src^="blob:"]').length`,
              returnByValue: true,
            }, { sessionId });
            if (r.result.value >= expectedImgCount) {
              pasteWorked = true;
              console.log(`[x-article] Image pasted via CDP: ${path.basename(img.localPath)}`);
              break;
            }
            await sleep(500);
          }
        }

        // Method 2: System clipboard + system paste fallback (requires Chrome in foreground)
        if (!pasteWorked) {
          console.log(`[x-article] CDP paste did not work, falling back to system paste...`);
          if (!copyImageToClipboard(img.localPath)) {
            console.warn(`[x-article] Failed to copy image to clipboard`);
          } else {
            await sleep(1000);
            if (pasteFromClipboard('Google Chrome', 5, 1000)) {
              console.log(`[x-article] Image pasted via system: ${path.basename(img.localPath)}`);
            } else {
              console.warn(`[x-article] Failed to paste image after retries`);
            }
          }
        }

        // Verify image appeared in editor
        console.log(`[x-article] Verifying image upload...`);
        let imgUploadOk = pasteWorked;
        if (!imgUploadOk) {
          const imgWaitStart = Date.now();
          while (Date.now() - imgWaitStart < 15_000) {
            const r = await cdp!.send<{ result: { value: number } }>('Runtime.evaluate', {
              expression: `document.querySelectorAll('section[data-block="true"][contenteditable="false"] img[src^="blob:"]').length`,
              returnByValue: true,
            }, { sessionId });
            if (r.result.value >= expectedImgCount) {
              imgUploadOk = true;
              break;
            }
            await sleep(1000);
          }
        }

        if (imgUploadOk) {
          console.log(`[x-article] Image upload verified (${expectedImgCount} image block(s))`);

          // CRITICAL: Verify placeholder didn't reappear after paste (DraftJS ContentState race)
          // If it did, clean it up immediately before moving to next image
          const reappearCheck = await cdp.send<{ result: { value: boolean } }>('Runtime.evaluate', {
            expression: `(() => {
              const editor = document.querySelector('.DraftEditor-editorContainer [data-contents="true"]');
              if (!editor) return false;
              const text = editor.innerText;
              const placeholder = ${JSON.stringify(img.placeholder)};
              const regex = new RegExp(placeholder + '(?!\\\\d)');
              return regex.test(text);
            })()`,
            returnByValue: true,
          }, { sessionId });

          if (reappearCheck.result.value) {
            console.warn(`[x-article] Placeholder "${img.placeholder}" reappeared after paste, cleaning up...`);
            // Try to select and delete the reappeared placeholder
            const reselected = await selectPlaceholder(2);
            if (reselected) {
              // Mouse drag in selectPlaceholder already focused editor correctly.
              // NO editor.focus() — it would restore a stale DraftJS selection.
              await sleep(200);
              await cdp.send('Input.dispatchKeyEvent', {
                type: 'keyDown', key: 'Backspace', code: 'Backspace', windowsVirtualKeyCode: 8,
              }, { sessionId });
              await cdp.send('Input.dispatchKeyEvent', {
                type: 'keyUp', key: 'Backspace', code: 'Backspace', windowsVirtualKeyCode: 8,
              }, { sessionId });
              await sleep(300);
              console.log(`[x-article] Reappeared placeholder cleaned up: ${img.placeholder}`);
            } else {
              console.warn(`[x-article] Could not clean up reappeared placeholder: ${img.placeholder}`);
            }
          }
        } else {
          console.warn(`[x-article] Image upload not detected after 15s`);
          if (i === 0) {
            console.error('[x-article] First image paste failed. Run check-paste-permissions.ts to diagnose.');
          }
        }

        // Wait for DraftEditor DOM to stabilize before next image
        await sleep(2000);

        // Force DraftJS reconciliation: blur editor so it commits ContentState.
        // Without this, subsequent image insertions can fail because DraftJS's
        // internal SelectionState is stale after the previous image's atomic block
        // was inserted, causing mouse-based selection to silently fail.
        await cdp.send('Runtime.evaluate', {
          expression: `document.querySelector('.DraftEditor-editorContainer [contenteditable="true"]')?.blur()`,
        }, { sessionId });
        await sleep(500);
      }

      console.log('[x-article] All images processed.');

      // Final verification: check placeholder residue and image count
      console.log('[x-article] Running post-composition verification...');
      const finalEditorContent = await cdp.send<{ result: { value: string } }>('Runtime.evaluate', {
        expression: `document.querySelector('.DraftEditor-editorContainer [data-contents="true"]')?.innerText || ''`,
        returnByValue: true,
      }, { sessionId });

      const remainingPlaceholders: string[] = [];
      for (const img of parsed.contentImages) {
        const regex = new RegExp(img.placeholder + '(?!\\d)');
        if (regex.test(finalEditorContent.result.value)) {
          remainingPlaceholders.push(img.placeholder);
        }
      }

      const finalImgCount = await cdp.send<{ result: { value: number } }>('Runtime.evaluate', {
        expression: `document.querySelectorAll('section[data-block="true"][contenteditable="false"] img[src^="blob:"]').length`,
        returnByValue: true,
      }, { sessionId });

      const expectedCount = parsed.contentImages.length;
      const actualCount = finalImgCount.result.value;

      if (remainingPlaceholders.length > 0 || actualCount < expectedCount) {
        console.warn('[x-article] ⚠ POST-COMPOSITION CHECK FAILED:');
        if (remainingPlaceholders.length > 0) {
          console.warn(`[x-article]   Remaining placeholders: ${remainingPlaceholders.join(', ')}`);
        }
        if (actualCount < expectedCount) {
          console.warn(`[x-article]   Image count: expected ${expectedCount}, found ${actualCount}`);
        }
        console.warn('[x-article]   Please check the article before publishing.');
      } else {
        console.log(`[x-article] ✓ Verification passed: ${actualCount} image(s), no remaining placeholders.`);
      }
    }

    // Insert code blocks
    if (parsed.codeBlocks.length > 0) {
      console.log(`[x-article] Inserting ${parsed.codeBlocks.length} code blocks...`);
      await insertCodeBlocks(cdp, sessionId, parsed.codeBlocks);
      console.log('[x-article] Code blocks insertion completed.');
    }

    // Before preview: blur editor to trigger save
    console.log('[x-article] Triggering content save...');
    await cdp.send('Runtime.evaluate', {
      expression: `(() => {
        // Blur editor to trigger any pending saves
        const editor = document.querySelector('.DraftEditor-editorContainer [contenteditable="true"]');
        if (editor) {
          editor.blur();
        }
        // Also click elsewhere to ensure focus is lost
        document.body.click();
      })()`,
    }, { sessionId });
    await sleep(1500);

    // Click Preview button
    console.log('[x-article] Opening preview...');
    const previewSelectors = JSON.stringify(I18N_SELECTORS.previewButton);
    const previewClicked = await cdp.send<{ result: { value: boolean } }>('Runtime.evaluate', {
      expression: `(() => {
        const selectors = ${previewSelectors};
        for (const sel of selectors) {
          const el = document.querySelector(sel);
          if (el) { el.click(); return true; }
        }
        return false;
      })()`,
      returnByValue: true,
    }, { sessionId });

    if (previewClicked.result.value) {
      console.log('[x-article] Preview opened');
      await sleep(3000);
    } else {
      console.log('[x-article] Preview button not found');
    }

    // Check for publish button
    if (submit) {
      console.log('[x-article] Publishing...');
      const publishSelectors = JSON.stringify(I18N_SELECTORS.publishButton);
      await cdp.send('Runtime.evaluate', {
        expression: `(() => {
          const selectors = ${publishSelectors};
          for (const sel of selectors) {
            const el = document.querySelector(sel);
            if (el && !el.disabled) { el.click(); return true; }
          }
          return false;
        })()`,
      }, { sessionId });
      await sleep(3000);
      console.log('[x-article] Article published!');
    } else {
      console.log('[x-article] Article composed (draft mode).');
      console.log('[x-article] Browser remains open for manual review.');
    }

  } finally {
    // Disconnect CDP but keep browser open
    if (cdp) {
      cdp.close();
    }
    // Don't kill Chrome - let user review and close manually
  }
}

function printUsage(): never {
  console.log(`Publish Markdown article to X (Twitter) Articles

Usage:
  npx -y bun x-article.ts <markdown_file> [options]

Options:
  --title <title>     Override title
  --cover <image>     Override cover image
  --submit            Actually publish (default: draft only)
  --profile <dir>     Chrome profile directory
  --help              Show this help

Markdown frontmatter:
  ---
  title: My Article Title
  标题: My Article Title (Chinese)
  cover_image: /path/to/cover.jpg
  封面: /path/to/cover.jpg (Chinese)
  ---

Example:
  npx -y bun x-article.ts article.md
  npx -y bun x-article.ts article.md --cover ./hero.png
  npx -y bun x-article.ts article.md --submit
`);
  process.exit(0);
}

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
    printUsage();
  }

  let markdownPath: string | undefined;
  let title: string | undefined;
  let coverImage: string | undefined;
  let submit = false;
  let profileDir: string | undefined;

  for (let i = 0; i < args.length; i++) {
    const arg = args[i]!;
    if (arg === '--title' && args[i + 1]) {
      title = args[++i];
    } else if (arg === '--cover' && args[i + 1]) {
      const raw = args[++i]!;
      coverImage = path.isAbsolute(raw) ? raw : path.resolve(process.cwd(), raw);
    } else if (arg === '--submit') {
      submit = true;
    } else if (arg === '--profile' && args[i + 1]) {
      profileDir = args[++i];
    } else if (!arg.startsWith('-')) {
      markdownPath = arg;
    }
  }

  if (!markdownPath) {
    console.error('Error: Markdown file path required');
    process.exit(1);
  }

  if (!fs.existsSync(markdownPath)) {
    console.error(`Error: File not found: ${markdownPath}`);
    process.exit(1);
  }

  await publishArticle({ markdownPath, title, coverImage, submit, profileDir });
}

await main().catch((err) => {
  console.error(`Error: ${err instanceof Error ? err.message : String(err)}`);
  process.exit(1);
});
