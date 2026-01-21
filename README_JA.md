<div>
  <p align="center">
    <a href="https://platform.composio.dev/?utm_source=Github&utm_medium=Youtube&utm_campaign=2025-11&utm_content=AwesomeSkills">
    <img width="1280" height="640" alt="Composio banner" src="assets/awesome-agent-skills.png">
    </a>
  </p>
</div>

<div>
  <p align="center">
    <a href="https://awesome.re">
      <img src="https://awesome.re/badge.svg" alt="Awesome" />
    </a>
    <a href="https://makeapullrequest.com">
      <img src="https://img.shields.io/badge/Issues-welcome-brightgreen.svg?style=flat-square" alt="Issues Welcome" />
    </a>
    <a href="https://www.apache.org/licenses/LICENSE-2.0">
      <img src="https://img.shields.io/badge/License-Apache_2.0-blue.svg?style=flat-square" alt="License: Apache-2.0" />
    </a>
  </p>
</div>

<div align="center">

[English](README_EN.md) | 日本語 | [简体中文](README.md)

</div>

このプロジェクトは、最高品質の Skills チュートリアル、ケーススタディ、ベストプラクティスの収集と共有を目的とし、より多くの人が Agent 構築の第一歩を簡単に踏み出せるよう支援します。

> 𝕏 アカウント [@libukai](https://x.com/libukai) をフォローして、Agent Skills の最新情報と実用的なチュートリアルをいち早く入手してください!

## クイックスタート

Agent Skills は Anthropic が維持する[オープン標準](https://agentskills.io/home)です。タスク固有の実行仕様を定義することで、個人の経験を AI Skills に簡単に変換し、軽量な Personal Agent を迅速に構築できます。

標準の定義によれば、各 Skill は標準化された命名のフォルダで、Markdown ドキュメント、実行可能スクリプト、その他の素材ファイルを組み合わせたものです。

![](assets/skills-sketch.png)

## チュートリアル集

### 初心者向けチュートリアル

-   [@一泽 Eze: Agent Skills 究極ガイド: 入門、マスター、予測](https://mp.weixin.qq.com/s/jUylk813LYbKw0sLiIttTQ)
-   [@数字生命卡兹克: ネット上で話題の Skills を完全理解する](https://x.com/Khazix0918/status/2010940910083940382)
-   [@王树义: AI が「代弁者」から「労働者」へアップグレードする方法](https://x.com/wshuyi/status/2009451186039214388)

### 上級チュートリアル

-   [@宝玉: Workflow を進化可能な Skill に変える 5 ステップフレームワーク](https://x.com/dotey/status/2010176124450484638)
-   [@歸藏: アニメーション付き PPT 生成 Agent! 使い方とクリエイティブアイデア](https://x.com/op7418/status/2010979152284041401)
-   [@李不凯正在研究: Cherry Studio での Agent Skills 活用のベストプラクティス](https://mp.weixin.qq.com/s/nqBMW9QaTcagohzy2gXaZA)

### 詳細分析

-   [@凡人小北: みんな Skill の書き方を教えているが、MCP の間違いを繰り返しているかもしれない](https://x.com/frxiaobei/status/2011075599083995566)
-   [@deeptoai: Claude Agent Skills 第一原理による詳細解析](https://skills.deeptoai.com/zh/docs/ai-ml/claude-agent-skills-first-principles-deep-dive)
-   [@宝玉: Claude Code の「遅延ロード」アップデート: AI がついに「オンデマンド」を学習](https://x.com/dotey/status/2011660434516873264)

### ビデオチュートリアル

- [@马克的技术工作坊: Agent Skill の使い方から原理まで一度に解説](https://www.youtube.com/watch?v=yDc0_8emz7M)
- [@白白说大模型: Agent を作るのはやめよう、未来は Skills だ](https://www.youtube.com/watch?v=xeoWgfkxADI)
- [@01Coder: OpenCode + GLM + Agent Skills で高品質な知的開発環境を構築](https://www.youtube.com/watch?v=mGzY2bCoVhU)

## プログラミングツール

Agent Skills オープン標準は、OpenAI、Google、Microsoft、Cursor などの主要な AI 企業に採用され、主流の AI プログラミングツールの標準機能となっています。

Agent Skills をインストールするには、Skill フォルダを適切なパスに配置するだけです。Vercel 公式の `npx skills add <owner/repo>` コマンドラインツールを使用して迅速にインストールすることもできます。パラメータについては [npmjs/skills](https://www.npmjs.com/package/skills) を参照してください。

同時に、Vercel は配套の [skills.sh](https://skills.sh/) Skills 精選ストアをリリースしました。高品質なプログラミング Skills を網羅しています。


| ツール             | プロジェクトパス    | グローバルパス                  | ドキュメント                                                                                |
| ------------------ | ------------------- | ------------------------------- | ------------------------------------------------------------------------------------------- |
| **Amp**            | `.agents/skills/`   | `~/.config/agents/skills/`      | [Amp Skills](https://ampcode.com/manual#agent-skills)                                       |
| **Antigravity**    | `.agent/skills/`    | `~/.gemini/antigravity/skills/` | [Antigravity Skills](https://antigravity.google/docs/skills)                                |
| **Clawdbot**       | `./skills/`         | `~/.clawdbot/skills/`           | [Clawdbot Skills](https://docs.clawd.bot/tools/skills)                                      |
| **Claude Code**    | `.claude/skills/`   | `~/.claude/skills/`             | [Claude Code Skills](https://code.claude.com/docs/en/skills)                                |
| **Codex**          | `.codex/skills/`    | `~/.codex/skills/`              | [Codex Skills](https://developers.openai.com/codex/skills)                                  |
| **Cursor**         | `.cursor/skills/`   | `~/.cursor/skills/`             | [Cursor Skills](https://cursor.com/docs/context/skills)                                     |
| **Droid/Factory**  | `.factory/skills/`  | `~/.factory/skills/`            | [Factory Droid Skills](https://docs.factory.ai/cli/configuration/skills)                    |
| **Gemini CLI**     | `.gemini/skills/`   | `~/.gemini/skills/`             | [Gemini CLI Skills](https://geminicli.com/docs/cli/skills/)                                 |
| **GitHub Copilot** | `.github/skills/`   | `~/.copilot/skills/`            | [Copilot Skills](https://docs.github.com/en/copilot/concepts/agents/about-agent-skills)     |
| **Goose**          | `.goose/skills/`    | `~/.config/goose/skills/`       | [Goose Skills](https://block.github.io/goose/docs/guides/context-engineering/using-skills/) |
| **Kilo Code**      | `.kilocode/skills/` | `~/.kilocode/skills/`           | [Kilo Skills](https://kilo.ai/docs/agent-behavior/skills)                                   |
| **OpenCode**       | `.opencode/skills/` | `~/.config/opencode/skills/`    | [OpenCode Skills](https://opencode.ai/docs/skills)                                          |
| **Roo Code**       | `.roo/skills/`      | `~/.roo/skills/`                | [Roo Code Skills](https://docs.roocode.com/features/skills)                                 |
| **Windsurf**       | `.windsurf/skills/` | `~/.codeium/windsurf/skills/`   | [Windsurf Cascade Skills](https://docs.windsurf.com/windsurf/cascade/skills)                |

## 対話ツール

Agent Skills 標準の普及に伴い、対話式 AI ツールも Skill のインストールと使用をサポートするようになってきました。ユーザーは Skill を追加することでアシスタント/エージェントの機能を拡張し、より複雑なタスク処理を実現できます。

-   [Coze/扣子](https://www.coze.cn/open/docs/cozespace/what_is_skill): Skills 使用ガイド
-   [Cherry Studio](https://mp.weixin.qq.com/s/nqBMW9QaTcagohzy2gXaZA): Agent Skills ベストプラクティス
-   [Alma](https://alma.now/docs/zh/features/skills.html): Skills 使用ガイド

## Skills マーケットプレイス

[![skillsmp](assets/skillsmp.png)](https://skillsmp.com/zh)

[skillsmp](https://skillsmp.com/zh) は、現在最も包括的で頻繁に更新される Skills マーケットプレイスです。GitHub 上のすべての Skills プロジェクトを自動的にインデックス化し、カテゴリ、更新時間、スター数などのタグで整理しています。

その他の特徴的な Agent Skills マーケットプレイス:

-   [skills.sh](https://skills.sh/): Vercel 公式の Skills 精選ストア
-   [SkillStore](https://skillstore.io/zh-hans): セキュリティ監査済み Skill を提供する中国語マーケットプレイス
-   [agentskills.me](https://agentskills.me/): 開発者への収益分配機能を提供するマーケットプレイス
-   [skills.rest](https://skills.rest/): Skill 評価システムを備えたマーケットプレイス

## 厳選 Skills

### Skill 作成

-   [anthropics/skill-creator](https://github.com/anthropics/skills/tree/main/skills/skill-creator): Anthropic 公式の Skill 作成用メタスキル。個人カスタム Skill を迅速に作成可能

### ドキュメント処理

-   [docx](https://github.com/anthropics/skills/tree/main/skills/docx): 変更履歴、コメント、書式保持、テキスト抽出をサポートした Word ドキュメントの作成、編集、分析
-   [pptx](https://github.com/anthropics/skills/tree/main/skills/pptx): レイアウト、テンプレート、グラフ、自動スライド生成をサポートした PowerPoint プレゼンテーションの作成、編集、分析
-   [xlsx](https://github.com/anthropics/skills/tree/main/skills/xlsx): 数式、書式、データ分析、可視化をサポートした Excel スプレッドシートの作成、編集、分析
-   [pdf](https://github.com/anthropics/skills/tree/main/skills/pdf): テキストと表の抽出、新規 PDF 作成、ドキュメントの結合/分割、フォーム処理のための包括的な PDF ツールキット

### コンテンツ作成

-   [JimLiu/baoyu-skills](https://github.com/JimLiu/baoyu-skills): Baoyu 個人用 Skills コレクション。WeChat 公式アカウント執筆、PPT 作成などを含む
-   [op7418/NanoBanana-PPT-Skills)](https://github.com/op7418/NanoBanana-PPT-Skills): Guizang 制作の NanoBanana ベース PPT 生成 Skill
-   [wshuyi/x-article-publisher-skill](https://github.com/wshuyi/x-article-publisher-skill): X 記事公開用 Skill
-   [huangserva/skill-prompt-generator](https://github.com/huangserva/skill-prompt-generator): Skills を使用したテキスト to 画像プロンプトの生成と最適化

### プログラミング支援

-   [anthropics/skills](https://github.com/anthropics/skills): Anthropic 公式 Skills コレクション
-   [vercel-labs/agent-skills](https://github.com/vercel-labs/agent-skills): Vercel 公式プログラミング Skills コレクション
-   [obra/superpowers](https://github.com/obra/superpowers/tree/main/skills): 完全なプログラミングプロジェクトワークフローをカバーする Skills コレクション
-   [ComposioHQ/awesome-claude-skills](https://github.com/ComposioHQ/awesome-claude-skills): 様々なプログラミングタスク向けの高品質 Skills コレクション
-   [nextlevelbuilder/ui-ux-pro-max-skill](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill): UI/UX デザイン向け Skills コレクション
-   [OthmanAdi/planning-with-files](https://github.com/OthmanAdi/planning-with-files): ファイルベースの計画で長期プランニングを実現する Skill

### プロダクト利用

-   [teng-lin/notebooklm-py](https://github.com/teng-lin/notebooklm-py): NotebookLM 制御用 Skill
-   [langgenius/dify](https://github.com/langgenius/dify/tree/main/.claude/skills): Dify 公式の多機能 Skills コレクション
-   [czlonkowski/n8n-skills](https://github.com/czlonkowski/n8n-skills): n8n ワークフロー作成用 Skills コレクション
-   [kepano/obsidian-skills](https://github.com/kepano/obsidian-skills): Obsidian 機能拡張用 Skills コレクション
-   [huggingface/skills](https://github.com/huggingface/skills): HuggingFace で大規模モデルをトレーニングするための Skills

### その他のタイプ

-   [K-Dense-AI/claude-scientific-skills](https://github.com/K-Dense-AI/claude-scientific-skills): 科学研究者向け Skills コレクション

## サポートツール

-   [Skill_Seekers](https://github.com/yusufkaraaslan/Skill_Seekers): ドキュメントサイト、GitHub リポジトリ、PDF ファイルを Agent Skills に自動変換
-   [openskills](https://github.com/numman-ali/openskills): 複数の Agent プラットフォームをサポートするグローバル Skills ローディングツール
-   [skild.sh](https://skild.sh/): 複数のツールで Skills をインストール、管理、同期するための CLI ツール
-   [agent-skills-guard](https://github.com/brucevanfdm/agent-skills-guard): Agent Skills の視覚的管理 + 厳選リポジトリ + セキュリティスキャン
-   [skillmaster](https://github.com/davidyangcool/agent-skill): ターミナル経由で Agent Skills を管理、インストール、使用

## 権威ある資料

Anthropic は公式ブログで豊富な Agent Skills 関連チュートリアルを提供しています。Agent Skills の概念、作成方法、応用シナリオを深く理解するため、以下の記事を読むことをお勧めします:

-   [Introducing Agent Skills: Improve how it performs specific tasks](https://claude.com/blog/skills)
-   [Skills explained: How Skills compares to prompts, Projects, MCP, and subagents](https://claude.com/blog/skills-explained)
-   [Extending Claude's capabilities with skills and MCP servers](https://claude.com/blog/extending-claude-capabilities-with-skills-mcp-servers)
-   [Equipping agents for the real world with Agent Skills](https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills)
-   [How to create Skills: Key steps, limitations, and examples](https://claude.com/blog/how-to-create-skills-key-steps-limitations-and-examples)
-   [Building Skills for Claude Code: Automating your procedural knowledge](https://claude.com/blog/building-skills-for-claude-code)
-   [Code execution with MCP: Building more efficient agents](https://www.anthropic.com/engineering/code-execution-with-mcp)
-   [Improving frontend design through Skills](https://claude.com/blog/improving-frontend-design-through-skills#real-world-skills-examples)
-   [Don't Build Agents, Build Skills Instead](https://x.com/iamzhihui/status/2005883147305500681/photo/1)

## 謝辞

![](assets/talk_is_cheap.jpg)

## プロジェクト履歴

[![Star History Chart](https://api.star-history.com/svg?repos=libukai/awesome-agent-skills&type=date&legend=top-left)](https://www.star-history.com/#libukai/awesome-agent-skills&type=date&legend=top-left)
