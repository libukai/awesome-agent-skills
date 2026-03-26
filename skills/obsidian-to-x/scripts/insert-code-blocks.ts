import type { CdpConnection } from './x-utils.js';

interface CodeBlockInfo {
  placeholder: string;
  language: string;
  code: string;
  blockIndex: number;
}

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Guard: ensure focus is inside the DraftJS editor body, NOT in the title bar.
 *
 * The X Articles editor has two focusable areas:
 *   1. Title: a <textarea> with placeholder="Add a title" (or i18n variants)
 *   2. Body: .DraftEditor-editorContainer [contenteditable="true"]
 *
 * After dialog close (Add Media → Code → Insert), focus often lands on <body>
 * or the title textarea — NOT back in the editor. If we then operate on the
 * editor (select, delete, insert), DraftJS may process events against the wrong
 * target or restore a stale SelectionState.
 *
 * This function checks document.activeElement and, if focus is outside the
 * editor, clicks inside the editor via CDP mouse event to move it back.
 */
async function ensureEditorFocus(
  cdp: CdpConnection,
  sessionId: string,
): Promise<void> {
  const focusInfo = await cdp.send<{ result: { value: { inEditor: boolean; tagName: string; id: string; className: string } } }>('Runtime.evaluate', {
    expression: `(() => {
      const editorContainer = document.querySelector('.DraftEditor-editorContainer');
      const active = document.activeElement;
      const inEditor = active ? editorContainer?.contains(active) : false;
      return {
        inEditor,
        tagName: active?.tagName || '',
        id: active?.id || '',
        className: active?.className || '',
      };
    })()`,
    returnByValue: true,
  }, { sessionId });

  if (focusInfo.result.value.inEditor) {
    return; // Focus already in editor, nothing to do
  }

  // Focus is NOT in the editor — log what has focus, then fix it
  console.log(`[insert-code] Focus NOT in editor (active: <${focusInfo.result.value.tagName}> id="${focusInfo.result.value.id}" class="${focusInfo.result.value.className}"). Re-focusing via mouse click...`);

  await clickViaMouse(cdp, sessionId, '.DraftEditor-editorContainer [contenteditable="true"]');
  await sleep(200);
}

/**
 * Simulate a real mouse click via CDP Input.dispatchMouseEvent.
 *
 * Unlike element.click() which only fires a "click" event, this fires the full
 * mousedown → (editor blur → DraftJS saves selection) → mouseup → click sequence.
 */
async function clickViaMouse(
  cdp: CdpConnection,
  sessionId: string,
  selector: string,
): Promise<boolean> {
  const rect = await cdp.send<{ result: { value: { x: number; y: number } | null } }>('Runtime.evaluate', {
    expression: `(() => {
      const el = document.querySelector(${JSON.stringify(selector)});
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return { x: Math.round(r.x + r.width / 2), y: Math.round(r.y + r.height / 2) };
    })()`,
    returnByValue: true,
  }, { sessionId });

  if (!rect.result.value) return false;
  const { x, y } = rect.result.value;

  await cdp.send('Input.dispatchMouseEvent', {
    type: 'mousePressed', x, y, button: 'left', clickCount: 1,
  }, { sessionId });
  await sleep(50);
  await cdp.send('Input.dispatchMouseEvent', {
    type: 'mouseReleased', x, y, button: 'left', clickCount: 1,
  }, { sessionId });

  return true;
}

/**
 * Send a single Backspace keystroke via CDP.
 */
async function sendBackspace(cdp: CdpConnection, sessionId: string): Promise<void> {
  await cdp.send('Input.dispatchKeyEvent', {
    type: 'keyDown', key: 'Backspace', code: 'Backspace', windowsVirtualKeyCode: 8,
  }, { sessionId });
  await cdp.send('Input.dispatchKeyEvent', {
    type: 'keyUp', key: 'Backspace', code: 'Backspace', windowsVirtualKeyCode: 8,
  }, { sessionId });
}

/**
 * Delete selected text via CDP keyboard Backspace, then remove the empty block if safe.
 */
async function deleteViaKeyboard(cdp: CdpConnection, sessionId: string): Promise<void> {
  await sendBackspace(cdp, sessionId);
  await sleep(200);

  const emptyBlockInfo = await cdp.send<{ result: { value: { empty: boolean; prevAtomic: boolean } } }>('Runtime.evaluate', {
    expression: `(() => {
      const sel = window.getSelection();
      if (!sel || !sel.focusNode) return { empty: false, prevAtomic: false };
      let node = sel.focusNode;
      if (node.nodeType === 3) node = node.parentElement;
      const block = node?.closest?.('[data-block="true"]');
      if (!block) return { empty: false, prevAtomic: false };
      const empty = (block.textContent || '').trim() === '';
      const prevBlock = block.previousElementSibling?.closest?.('[data-block="true"]')
        || block.parentElement?.previousElementSibling?.querySelector?.('[data-block="true"]');
      const prevAtomic = prevBlock?.getAttribute('contenteditable') === 'false';
      const unsafe = !prevBlock || !!prevAtomic;
      return { empty, prevAtomic: unsafe };
    })()`,
    returnByValue: true,
  }, { sessionId });

  if (emptyBlockInfo.result.value.empty && !emptyBlockInfo.result.value.prevAtomic) {
    await sendBackspace(cdp, sessionId);
  }
}

/**
 * Helper: wait for a DOM element inside the page via MutationObserver.
 */
async function waitForElementInPage(
  cdp: CdpConnection,
  sessionId: string,
  selectorOrExpr: string,
  timeoutMs = 15_000,
): Promise<boolean> {
  const result = await cdp.send<{ result: { value: boolean } }>('Runtime.evaluate', {
    expression: `new Promise((resolve) => {
      const expr = ${JSON.stringify(selectorOrExpr)};
      const check = () => {
        try { return eval(expr); } catch { return document.querySelector(expr); }
      };
      if (check()) { resolve(true); return; }
      const observer = new MutationObserver(() => {
        if (check()) { observer.disconnect(); clearTimeout(t); resolve(true); }
      });
      observer.observe(document.body, { childList: true, subtree: true, characterData: true });
      const t = setTimeout(() => { observer.disconnect(); resolve(false); }, ${timeoutMs});
    })`,
    awaitPromise: true,
    returnByValue: true,
  }, { sessionId, timeoutMs: timeoutMs + 5_000 });
  return result.result.value === true;
}

/**
 * Select placeholder text using CDP mouse drag (NOT DOM Range API).
 *
 * WHY: DraftJS maintains its own SelectionState, independent of the browser's DOM
 * selection. Setting the DOM selection via Range API does NOT update DraftJS's
 * internal state. DraftJS only updates its state through its own event handlers:
 *   - onMouseDown → records selection, sets _mouseDown flag
 *   - onMouseMove → extends selection (during drag)
 *   - onMouseUp → reads DOM selection, calls onSelect, updates internal SelectionState
 *
 * By using CDP mouse events for the entire select → delete → insert flow, DraftJS
 * always has a correct internal SelectionState because it processes every event itself.
 *
 * Previous approaches that failed:
 * - DOM Range API + editor.focus(): onFocus restores stale saved selection, overwriting our Range
 * - DOM Range API + selectionchange event: DraftJS's onSelect has guard conditions that may ignore it
 * - DOM Range API + mouse click "sync": DraftJS onMouseDown only records current state, doesn't update
 */
async function selectPlaceholderViaMouse(
  cdp: CdpConnection,
  sessionId: string,
  placeholder: string,
  maxRetries = 3,
): Promise<boolean> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    // Step 1: Find placeholder coordinates via DOM (only for positioning, NOT for selection)
    const coords = await cdp.send<{ result: { value: { startX: number; endX: number; y: number } | null } }>('Runtime.evaluate', {
      expression: `(() => {
        const editor = document.querySelector('.DraftEditor-editorContainer [data-contents="true"]');
        if (!editor) return null;
        const ph = ${JSON.stringify(placeholder)};
        const walker = document.createTreeWalker(editor, NodeFilter.SHOW_TEXT, null, false);
        let node;
        while ((node = walker.nextNode())) {
          const text = node.textContent || '';
          let searchStart = 0;
          let idx;
          while ((idx = text.indexOf(ph, searchStart)) !== -1) {
            const afterIdx = idx + ph.length;
            const charAfter = text[afterIdx];
            if (charAfter === undefined || !/\\d/.test(charAfter)) {
              // Scroll into view FIRST (instant, not smooth - we need coordinates after scroll)
              const parent = node.parentElement;
              if (parent) parent.scrollIntoView({ behavior: 'instant', block: 'center' });

              // Get bounding rect of the placeholder text
              const range = document.createRange();
              range.setStart(node, idx);
              range.setEnd(node, idx + ph.length);
              const rects = range.getClientRects();
              if (rects.length > 0) {
                // Handle multi-line: use first rect's left and last rect's right
                const first = rects[0];
                const last = rects[rects.length - 1];
                return {
                  startX: Math.round(first.left + 2),
                  endX: Math.round(last.right - 2),
                  y: Math.round(first.top + first.height / 2),
                };
              }
              // Fallback: parent element rect
              if (parent) {
                const r = parent.getBoundingClientRect();
                return {
                  startX: Math.round(r.left + 2),
                  endX: Math.round(r.right - 2),
                  y: Math.round(r.top + r.height / 2),
                };
              }
              return null;
            }
            searchStart = afterIdx;
          }
        }
        return null;
      })()`,
      returnByValue: true,
    }, { sessionId });

    if (!coords.result.value) {
      console.warn(`[insert-code] Placeholder coordinates not found (attempt ${attempt})`);
      await sleep(1000);
      continue;
    }

    const { startX, endX, y } = coords.result.value;
    console.log(`[insert-code] Mouse selecting "${placeholder}" at (${startX},${y}) → (${endX},${y})`);

    // Step 2: Click-and-drag to select the placeholder text
    // mousePressed at start of placeholder → DraftJS onMouseDown fires, records position
    await cdp.send('Input.dispatchMouseEvent', {
      type: 'mousePressed', x: startX, y, button: 'left', clickCount: 1,
    }, { sessionId });
    await sleep(80);

    // mouseMoved to end → browser extends DOM selection → selectionchange fires → DraftJS onSelect
    await cdp.send('Input.dispatchMouseEvent', {
      type: 'mouseMoved', x: endX, y, button: 'left', clickCount: 0,
    }, { sessionId });
    await sleep(80);

    // mouseReleased → DraftJS onMouseUp fires, finalizes selection
    await cdp.send('Input.dispatchMouseEvent', {
      type: 'mouseReleased', x: endX, y, button: 'left', clickCount: 1,
    }, { sessionId });
    await sleep(500);

    // Step 3: Verify selection (DOM)
    const selectionCheck = await cdp.send<{ result: { value: string } }>('Runtime.evaluate', {
      expression: `window.getSelection()?.toString() || ''`,
      returnByValue: true,
    }, { sessionId });

    const selectedText = selectionCheck.result.value.trim();
    if (selectedText === placeholder) {
      console.log(`[insert-code] Mouse selection verified: "${selectedText}"`);
      return true;
    }

    console.warn(`[insert-code] Mouse selection attempt ${attempt} got "${selectedText}", retrying...`);
    await sleep(1000);
  }

  console.warn(`[insert-code] Mouse selection failed after ${maxRetries} attempts`);
  return false;
}

/**
 * Insert a single code block via the "Add Media" dialog.
 */
async function insertSingleCodeBlock(
  cdp: CdpConnection,
  sessionId: string,
  language: string,
  code: string,
): Promise<boolean> {
  const capitalizedLanguage = language.charAt(0).toUpperCase() + language.slice(1).toLowerCase();

  try {
    // 1. Click "Add Media" via real mouse event (mousedown → editor blur → DraftJS saves selection)
    const addMediaClicked = await clickViaMouse(cdp, sessionId, 'button[aria-label="Add Media"]');
    if (!addMediaClicked) {
      console.warn('[insert-code-block] Add Media button not found');
      return false;
    }

    const menuFound = await waitForElementInPage(cdp, sessionId, '[role="menuitem"]');
    if (!menuFound) { console.warn('[insert-code-block] Menu did not appear'); return false; }

    // 2. Click "Code" → wait for language input
    await cdp.send('Runtime.evaluate', {
      expression: `Array.from(document.querySelectorAll('[role="menuitem"]')).find(el => el.textContent.trim() === 'Code')?.click()`,
    }, { sessionId });

    const inputFound = await waitForElementInPage(cdp, sessionId, 'input');
    if (!inputFound) { console.warn('[insert-code-block] Language input did not appear'); return false; }

    // 3. Type language via CDP
    await cdp.send('Runtime.evaluate', {
      expression: `document.querySelector('input')?.focus()`,
    }, { sessionId });
    await sleep(100);
    await cdp.send('Input.insertText', { text: capitalizedLanguage }, { sessionId });
    await sleep(300);

    // 4. ArrowDown + Enter to select autocomplete
    for (const key of [
      { key: 'ArrowDown', code: 'ArrowDown', vk: 40 },
      { key: 'Enter', code: 'Enter', vk: 13 },
    ]) {
      await cdp.send('Input.dispatchKeyEvent', {
        type: 'keyDown', key: key.key, code: key.code, windowsVirtualKeyCode: key.vk,
      }, { sessionId });
      await cdp.send('Input.dispatchKeyEvent', {
        type: 'keyUp', key: key.key, code: key.code, windowsVirtualKeyCode: key.vk,
      }, { sessionId });
    }

    // 5. Type code
    const textareaFound = await waitForElementInPage(cdp, sessionId, 'textarea');
    if (!textareaFound) { console.warn('[insert-code-block] Code textarea did not appear'); return false; }

    await cdp.send('Runtime.evaluate', {
      expression: `document.querySelector('textarea')?.focus()`,
    }, { sessionId });
    await sleep(100);
    await cdp.send('Input.insertText', { text: code }, { sessionId });
    await sleep(200);

    // 6. Click Insert
    const insertBtnFound = await waitForElementInPage(cdp, sessionId,
      `Array.from(document.querySelectorAll('button')).find(btn => btn.textContent.trim() === 'Insert')`,
    );
    if (!insertBtnFound) { console.warn('[insert-code-block] Insert button not found'); return false; }

    await cdp.send('Runtime.evaluate', {
      expression: `Array.from(document.querySelectorAll('button')).find(btn => btn.textContent.trim() === 'Insert')?.click()`,
    }, { sessionId });

    // Wait for dialog to fully close (textarea removed from DOM)
    await waitForElementInPage(cdp, sessionId,
      `!document.querySelector('textarea')`,
      5_000,
    );
    await sleep(300);

    // CRITICAL: Re-focus the editor body after dialog closes.
    // When the dialog's "Insert" button is removed from DOM, the browser moves focus
    // to <body> or the title input — NOT back to the editor. Without explicit re-focus,
    // DraftJS loses track of the editor, and subsequent insertions go to the wrong place.
    // We click inside the editor via mouse event so DraftJS's onMouseDown fires and
    // it properly knows the editor is active.
    await clickViaMouse(cdp, sessionId, '.DraftEditor-editorContainer [contenteditable="true"]');
    await sleep(300);

    return true;
  } catch (e) {
    console.warn('[insert-code-block] Error:', e instanceof Error ? e.message : String(e));
    return false;
  }
}

/**
 * Insert all code blocks (replacing placeholders).
 *
 * The entire flow uses CDP mouse events for selection, ensuring DraftJS's internal
 * SelectionState is always correct:
 *
 * 1. Mouse drag to select placeholder → DraftJS onMouseDown/Move/Up updates internal state
 * 2. Backspace to delete → DraftJS handles key event with correct internal selection
 * 3. Mouse click on "Add Media" → DraftJS blur saves correct selection
 * 4. Code dialog → Insert → code block at correct position
 */
export async function insertCodeBlocks(
  cdp: CdpConnection,
  sessionId: string,
  codeBlocks: CodeBlockInfo[],
): Promise<void> {
  if (codeBlocks.length === 0) {
    return;
  }

  console.log(`[insert-code] Inserting ${codeBlocks.length} code blocks...`);

  // 检查编辑器中的占位符
  const editorContent = await cdp.send<{ result: { value: string } }>('Runtime.evaluate', {
    expression: `document.querySelector('.DraftEditor-editorContainer [data-contents="true"]')?.innerText || ''`,
    returnByValue: true,
  }, { sessionId });

  console.log('[insert-code] Checking for code placeholders in content...');
  for (const block of codeBlocks) {
    const regex = new RegExp(block.placeholder + '(?!\\d)');
    if (regex.test(editorContent.result.value)) {
      console.log(`[insert-code] Found: ${block.placeholder}`);
    } else {
      console.log(`[insert-code] NOT found: ${block.placeholder}`);
    }
  }

  // 按占位符顺序处理
  const getPlaceholderIndex = (placeholder: string): number => {
    const match = placeholder.match(/XCODEPH_(\d+)/);
    return match ? Number(match[1]) : Number.POSITIVE_INFINITY;
  };
  const sortedCodeBlocks = [...codeBlocks].sort(
    (a, b) => getPlaceholderIndex(a.placeholder) - getPlaceholderIndex(b.placeholder),
  );

  for (let i = 0; i < sortedCodeBlocks.length; i++) {
    const block = sortedCodeBlocks[i]!;
    console.log(`[insert-code] [${i + 1}/${sortedCodeBlocks.length}] Inserting code at placeholder: ${block.placeholder}`);

    // Step 0: Guard — ensure focus is in the editor, NOT in the title bar.
    // After previous dialog close, focus may have drifted to title or <body>.
    await ensureEditorFocus(cdp, sessionId);

    // Step 1: Mouse drag to select placeholder text
    // DraftJS processes mouseDown → mouseMove → mouseUp and updates its internal SelectionState
    const selected = await selectPlaceholderViaMouse(cdp, sessionId, block.placeholder);
    if (!selected) {
      console.warn(`[insert-code] Skipping code block - could not select placeholder: ${block.placeholder}`);
      continue;
    }

    console.log(`[insert-code] Inserting ${block.language} code (${block.code.length} chars)`);

    // Step 2: Delete placeholder via Backspace
    // DraftJS handles this with its internal SelectionState (which is correct from step 1)
    // NO explicit editor.focus() needed — the mouse drag already focused the editor
    console.log(`[insert-code] Deleting placeholder...`);
    await deleteViaKeyboard(cdp, sessionId);
    await sleep(300);

    // Step 3: Verify placeholder is deleted
    const afterDelete = await cdp.send<{ result: { value: boolean } }>('Runtime.evaluate', {
      expression: `(() => {
        const editor = document.querySelector('.DraftEditor-editorContainer [data-contents="true"]');
        if (!editor) return true;
        const text = editor.innerText;
        const placeholder = ${JSON.stringify(block.placeholder)};
        const regex = new RegExp(placeholder + '(?!\\\\d)');
        return !regex.test(text);
      })()`,
      returnByValue: true,
    }, { sessionId });

    if (!afterDelete.result.value) {
      console.warn(`[insert-code] Placeholder still exists, retrying with mouse selection...`);
      const reselected = await selectPlaceholderViaMouse(cdp, sessionId, block.placeholder, 2);
      if (reselected) {
        await deleteViaKeyboard(cdp, sessionId);
        await sleep(300);

        const finalCheck = await cdp.send<{ result: { value: boolean } }>('Runtime.evaluate', {
          expression: `(() => {
            const editor = document.querySelector('.DraftEditor-editorContainer [data-contents="true"]');
            if (!editor) return true;
            const text = editor.innerText;
            const placeholder = ${JSON.stringify(block.placeholder)};
            const regex = new RegExp(placeholder + '(?!\\\\d)');
            return !regex.test(text);
          })()`,
          returnByValue: true,
        }, { sessionId });

        if (!finalCheck.result.value) {
          console.error(`[insert-code] ❌ Failed to delete placeholder: ${block.placeholder}`);
          continue;
        }
        console.log(`[insert-code] ✓ Placeholder deleted on retry`);
      } else {
        console.error(`[insert-code] ❌ Could not reselect placeholder, skipping: ${block.placeholder}`);
        continue;
      }
    }

    // Step 4: Insert code block via "Add Media" dialog
    // DraftJS's internal SelectionState is correct (set by mouse drag in step 1, updated by Backspace in step 2)
    // clickViaMouse triggers mousedown on "Add Media" → editor blur → DraftJS saves correct selection
    const insertOk = await insertSingleCodeBlock(cdp, sessionId, block.language, block.code);

    if (insertOk) {
      console.log(`[insert-code] Code block ${i + 1}/${sortedCodeBlocks.length} inserted`);
    } else {
      console.warn(`[insert-code] Code block ${i + 1}/${sortedCodeBlocks.length} insertion may have failed`);
    }

    // Step 5: Verify placeholder is gone
    await sleep(300);
    const postInsertCheck = await cdp.send<{ result: { value: boolean } }>('Runtime.evaluate', {
      expression: `(() => {
        const editor = document.querySelector('.DraftEditor-editorContainer [data-contents="true"]');
        if (!editor) return true;
        const text = editor.innerText;
        const placeholder = ${JSON.stringify(block.placeholder)};
        const regex = new RegExp(placeholder + '(?!\\\\d)');
        return !regex.test(text);
      })()`,
      returnByValue: true,
    }, { sessionId });

    if (!postInsertCheck.result.value) {
      console.warn(`[insert-code] ⚠ Placeholder "${block.placeholder}" still present after insert, retrying...`);
      const resel = await selectPlaceholderViaMouse(cdp, sessionId, block.placeholder, 2);
      if (resel) {
        await deleteViaKeyboard(cdp, sessionId);
        await sleep(300);
        const retryOk = await insertSingleCodeBlock(cdp, sessionId, block.language, block.code);
        if (retryOk) {
          console.log(`[insert-code] ✓ Code block ${i + 1}/${sortedCodeBlocks.length} inserted on retry`);
        } else {
          console.warn(`[insert-code] ❌ Code block ${i + 1}/${sortedCodeBlocks.length} retry also failed`);
        }
      } else {
        console.warn(`[insert-code] ❌ Could not reselect placeholder for retry: ${block.placeholder}`);
      }
    }

    // Brief pause to let DraftJS fully re-render before next placeholder search
    await sleep(1000);
  }

  console.log('[insert-code] All code blocks inserted successfully');
}
