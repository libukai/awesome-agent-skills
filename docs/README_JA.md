<div>
  <p align="center">
    <a href="https://platform.composio.dev/?utm_source=Github&utm_medium=Youtube&utm_campaign=2025-11&utm_content=AwesomeSkills">
    <img width="1280" height="640" alt="Composio banner" src="../assets/media/awesome-agent-skills.png">
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

[English](README_EN.md) | 日本語 | [简体中文](../README.md)

</div>

このプロジェクトは、最高品質の Skills チュートリアル、ケーススタディ、ベストプラクティスの収集と共有を目的とし、より多くの人が Agent 構築の第一歩を簡単に踏み出せるよう支援します。

> 𝕏 アカウント [@libukai](https://x.com/libukai) をフォローして、Agent Skills の最新情報と実用的なチュートリアルをいち早く入手してください!

## クイックスタート

Agent Skills は Anthropic が主導的に維持する[オープン標準](https://agentskills.io/home)で、AI に特定のタスクやワークフローの処理方法を教えるためのものです。

これはあなたの特定のニーズに合わせて AI をカスタマイズする最も強力な方法の一つです。反復可能なワークフローを実行する必要がある時、毎回の AI との会話で自分の好み、プロセス、領域知識を繰り返し説明する必要はありません。Skills を使えば AI に一度教えるだけで、毎回その恩恵を受けられます。

Skill は AI の組み込み機能（コード実行やドキュメント作成など）とうまく連携します。MCP を構築・使用しているユーザーには、さらに強力な機能層も提供します――AI が外部ツールへのアクセスを信頼性の高い、最適化されたワークフローに変換するのを支援します。

この標準は現在、Anthropic、OpenAI、Google、Microsoft、Cursor などの業界をリードする企業に採用され、主流の AI ツールの標準機能となっています。

標準の定義によれば、各 Skill は標準化された命名のフォルダで、Markdown ドキュメント、実行可能スクリプト、その他の素材ファイルを組み合わせたものです。

![](../assets/media/skills-sketch.png)

## チュートリアル集

### 公式ガイド

-   [@Anthropic: Claude Skills 完全構築ガイド（中国語）](assets/docs/Claude-Skills-完全構建指南.md)

### 図文チュートリアル

-   [@一泽 Eze: Agent Skills 究極ガイド: 入門、マスター、予測](https://mp.weixin.qq.com/s/jUylk813LYbKw0sLiIttTQ)
-   [@deeptoai: Claude Agent Skills 第一原理による詳細解析](https://skills.deeptoai.com/zh/docs/ai-ml/claude-agent-skills-first-principles-deep-dive)
-   [@歸藏: アニメーション付き PPT 生成 Agent! 使い方とクリエイティブアイデア](https://x.com/op7418/status/2010979152284041401)

### ビデオチュートリアル

-   [@马克的技术工作坊: Agent Skill の使い方から原理まで一度に解説](https://www.youtube.com/watch?v=yDc0_8emz7M)
-   [@白白说大模型: Agent を作るのはやめよう、未来は Skills だ](https://www.youtube.com/watch?v=xeoWgfkxADI)
-   [@01Coder: OpenCode + GLM + Agent Skills で高品質な知的開発環境を構築](https://www.youtube.com/watch?v=mGzY2bCoVhU)

## Skills マーケットプレイス

[![](../assets/media/skills_sh.png)](https://skills.sh/)

Vercel 公式の [skills.sh](https://skills.sh/) ランキングボードの使用を推奨します。最も人気のある Skills リポジトリと個別 Skill の使用状況を直感的に確認できます。

[![skillsmp](../assets/media/skills_smp.png)](https://skillsmp.com/zh)

また、[skillsmp](https://skillsmp.com/zh) マーケットプレイスを補助的に使用できます。このマーケットプレイスは GitHub 上のすべての Skills プロジェクトを自動的にインデックス化し、カテゴリ、更新時間、スター数などのタグで整理しています。

その他の特徴的な Agent Skills マーケットプレイス:

-   [context7](https://context7.com/?tab=skills): Context7 ベースの Skill マーケットプレイス
-   [skillstore.io](https://skillstore.io/zh-hans): セキュリティ監査済み Skill を提供する中国語マーケットプレイス
-   [agentskills.me](https://agentskills.me/): クラウドベースの Skill 実行環境を提供するマーケットプレイス
-   [skills.rest](https://skills.rest/): Skill 分析とセキュリティレビューを提供するマーケットプレイス

## 製品利用

Agent Skills はファイルシステムベースのクロスプラットフォーム標準として、様々な製品に柔軟に組み込むことができます。

現在、ますます多くのプログラミングツールと対話ツールが Agent Skills 標準をサポートし始めており、今後さらに多様な利用方法が登場すると考えられます。

### プログラミングツール

プログラミングツールに Agent Skills をインストールするには、Skill フォルダを適切なパスに配置するだけです。

Vercel 公式の `npx skills find <query>` / `npx skills add <owner/repo>` コマンドラインツールを使用して迅速に発見・インストールすることを推奨します。パラメータについては [npmjs/skills](https://www.npmjs.com/package/skills) を参照してください。


| ツール             | プロジェクトパス     | グローバルパス                  | ドキュメント                                                                                |
| ------------------ | -------------------- | ------------------------------- | ------------------------------------------------------------------------------------------- |
| **Amp**            | `.agents/skills/`    | `~/.config/agents/skills/`      | [Amp Skills](https://ampcode.com/manual#agent-skills)                                       |
| **Antigravity**    | `.agent/skills/`     | `~/.gemini/antigravity/skills/` | [Antigravity Skills](https://antigravity.google/docs/skills)                                |
| **Claude Code**    | `.claude/skills/`    | `~/.claude/skills/`             | [Claude Code Skills](https://code.claude.com/docs/en/skills)                                |
| **Codex**          | `.codex/skills/`     | `~/.codex/skills/`              | [Codex Skills](https://developers.openai.com/codex/skills)                                  |
| **Cursor**         | `.cursor/skills/`    | `~/.cursor/skills/`             | [Cursor Skills](https://cursor.com/cn/docs/context/skills)                                  |
| **CodeBuddy**      | `.codebuddy/skills/` | `~/.codebuddy/skills/`          | [Codebuddy Skills](https://copilot.tencent.com/docs/cli/skills)                             |
| **Droid/Factory**  | `.factory/skills/`   | `~/.factory/skills/`            | [Factory Droid Skills](https://docs.factory.ai/cli/configuration/skills)                    |
| **Gemini CLI**     | `.gemini/skills/`    | `~/.gemini/skills/`             | [Gemini CLI Skills](https://geminicli.com/docs/cli/skills/)                                 |
| **GitHub Copilot** | `.github/skills/`    | `~/.copilot/skills/`            | [Copilot Skills](https://docs.github.com/en/copilot/concepts/agents/about-agent-skills)     |
| **VS Code**        | `.github/skills/`    | `~/.copilot/skills/`            | [VS Code Skills](https://code.visualstudio.com/docs/copilot/customization/agent-skills)     |
| **Goose**          | `.goose/skills/`     | `~/.config/goose/skills/`       | [Goose Skills](https://block.github.io/goose/docs/guides/context-engineering/using-skills/) |
| **Kilo Code**      | `.kilocode/skills/`  | `~/.kilocode/skills/`           | [Kilo Skills](https://kilo.ai/docs/agent-behavior/skills)                                   |
| **Kimi CLI**       | `.kimi/skills/`      | `~/.kimi/skills`                | [Kimi CLI Skills](https://moonshotai.github.io/kimi-cli/zh/customization/skills.html)       |
| **OpenCode**       | `.opencode/skills/`  | `~/.config/opencode/skills/`    | [OpenCode Skills](https://opencode.ai/docs/skills)                                          |
| **Qwen Code**      | `.qwen/skills/`      | `~/.qwen/skills/`               | [Qwen Code Skills](https://qwenlm.github.io/qwen-code-docs/zh/users/features/skills/)       |
| **Roo Code**       | `.roo/skills/`       | `~/.roo/skills/`                | [Roo Code Skills](https://docs.roocode.com/features/skills)                                 |
| **Trae**           | `.trae/skills/`      | ---                             | [Trae Skills](https://docs.trae.ai/ide/skills?_lang=zh)                                     |
| **Windsurf**       | `.windsurf/skills/`  | `~/.codeium/windsurf/skills/`   | [Windsurf Skills](https://docs.windsurf.com/windsurf/cascade/skills)                        |

### 対話ツール

Agent Skills 標準の普及に伴い、対話式 AI ツールも Skill のインストールと使用をサポートするようになってきました。ユーザーは Skill を追加することでアシスタント/エージェントの機能を拡張し、より複雑なタスク処理を実現できます。

-   [Coze/扣子](https://www.coze.cn/open/docs/cozespace/what_is_skill): Coze 2.0 新しいスキル機能の使用説明
-   [Cherry Studio](https://mp.weixin.qq.com/s/nqBMW9QaTcagohzy2gXaZA): Cherry Studio で Agent を通じて Skill を使用するベストプラクティス

## 厳選 Skills

### Skill 作成

-   [anthropics/skill-creator](https://github.com/anthropics/skills/tree/main/skills/skill-creator): Anthropic 公式の Skill 作成用メタスキル。個人カスタム Skill を迅速に作成可能

### ドキュメント処理

-   [docx](https://github.com/anthropics/skills/tree/main/skills/docx): Word ドキュメントを作成・編集する Skill
-   [pptx](https://github.com/anthropics/skills/tree/main/skills/pptx): PowerPoint プレゼンテーションを作成・編集する Skill
-   [xlsx](https://github.com/anthropics/skills/tree/main/skills/xlsx): Excel スプレッドシートを作成・編集する Skill
-   [pdf](https://github.com/anthropics/skills/tree/main/skills/pdf): PDF を作成・編集する Skill

### 公式プロジェクト

-   [anthropics/skills](https://github.com/anthropics/skills): Anthropic 公式 Skills コレクション
-   [better-auth/skills](https://github.com/better-auth/skills): Better Auth 公式の認証ツール Skills コレクション
-   [black-forest-labs/skills](https://github.com/black-forest-labs/skills): Black Forest Labs 公式の FLUX モデル制御用 Skills コレクション
-   [browser-use/browser-use](https://github.com/browser-use/browser-use/tree/main/skills): Browser Use 公式のブラウザ自動化 Skills コレクション
-   [cloudflare/skills](https://github.com/cloudflare/skills): Cloudflare 公式の API 統合 Skills コレクション
-   [ClickHouse/agent-skills](https://github.com/ClickHouse/agent-skills): ClickHouse 公式のデータベースクエリ・分析 Skills コレクション
-   [expo/skills](https://github.com/expo/skills): Expo 公式 React Native Skills コレクション
-   [firecrawl/cli](https://github.com/firecrawl/cli): Firecrawl 公式の CLI ツール Skills
-   [google-gemini/gemini-skills](https://github.com/google-gemini/gemini-skills): Google Gemini 公式の API/SDK Skills コレクション
-   [huggingface/skills](https://github.com/huggingface/skills): HuggingFace 公式 Skill を使用した大規模モデルのトレーニング
-   [kepano/obsidian-skills](https://github.com/kepano/obsidian-skills): Obsidian CEO 公式 Obsidian 機能拡張用 Skills コレクション
-   [langgenius/dify](https://github.com/langgenius/dify/tree/main/.claude/skills): Dify 公式の多機能 Skills コレクション
-   [microsoft/agent-skills](https://github.com/microsoft/agent-skills): Microsoft 公式の Azure サービス向け Agent Skills コレクション
-   [openai/skills](https://github.com/openai/skills): OpenAI 公式 Skills コレクション
-   [remotion-dev/skills](https://github.com/remotion-dev/skills): Remotion 公式 Remotion を使用した動画コンテンツ作成
-   [replicate/skills](https://github.com/replicate/skills): Replicate 公式の AI モデル呼び出し Skills コレクション
-   [slidevjs/slidev](https://github.com/slidevjs/slidev/tree/main/skills/slidev): Slidev 公式のプレゼンテーション作成 Skills コレクション
-   [google-labs-code/stitch-skills](https://github.com/google-labs-code/stitch-skills): Google Labs 公式の Stitch Skills コレクション
-   [stripe/ai](https://github.com/stripe/ai): Stripe 公式の金融決済関連 Skills コレクション
-   [sanity-io/agent-toolkit](https://github.com/sanity-io/agent-toolkit/tree/main/skills): Sanity 公式のコンテンツ管理プラットフォーム Skills コレクション
-   [supabase/agent-skills](https://github.com/supabase/agent-skills): Supabase 公式 PostgreSQL ベストプラクティス
-   [WordPress/agent-skills](https://github.com/WordPress/agent-skills): WordPress 公式のコンテンツ管理プラットフォーム Skills コレクション
-   [vercel-labs/agent-skills](https://github.com/vercel-labs/agent-skills): Vercel 公式 React/Next.js Skills コレクション


### コンテンツ作成

-   [JimLiu/baoyu-skills](https://github.com/JimLiu/baoyu-skills): Baoyu 個人用 Skills コレクション。WeChat 公式アカウント執筆、PPT 作成などを含む
-   [github.com/op7418)](https://github.com/op7418?tab=repositories): Guizang 制作の一連の Skills コレクション。PPT 作成、YouTube 分析などを含む
-   [wshuyi/x-article-publisher-skill](https://github.com/wshuyi/x-article-publisher-skill): Wang Shuyi の X 記事公開用 Skill
-   [huangserva/skill-prompt-generator](https://github.com/huangserva/skill-prompt-generator): Huangserva の AI ポートレートテキスト to 画像プロンプトの生成と最適化 Skill

### プログラミング補助

-   [obra/superpowers](https://github.com/obra/superpowers/tree/main/skills): 完全なプログラミングプロジェクトワークフローをカバーする Skills コレクション
-   [ComposioHQ/awesome-claude-skills](https://github.com/ComposioHQ/awesome-claude-skills): 複数のプログラミングタスクをカバーする高品質 Skills コレクション
-   [nextlevelbuilder/ui-ux-pro-max-skill](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill): UI/UX デザイン向け Skills コレクション
-   [OthmanAdi/planning-with-files](https://github.com/OthmanAdi/planning-with-files): ファイル計画を使用した長期 Plan 効果を実現する Skill
-   [hyf0/vue-skills](https://github.com/hyf0/vue-skills): Vue.js 開発向け Skills コレクション

### プロダクト利用

-   [teng-lin/notebooklm-py](https://github.com/teng-lin/notebooklm-py): NotebookLM 制御用 Skill
-   [czlonkowski/n8n-skills](https://github.com/czlonkowski/n8n-skills): n8n ワークフロー作成用 Skills コレクション
-   [cloudai-x/threejs-skills](https://github.com/cloudai-x/threejs-skills): Three.js 開発向け Skills コレクション

### その他のタイプ

-   [coreyhaines31/marketingskills](https://github.com/coreyhaines31/marketingskills): マーケティング向け Skills コレクション
-   [K-Dense-AI/claude-scientific-skills](https://github.com/K-Dense-AI/claude-scientific-skills): 科学研究者向け Skills コレクション

## Plugin Marketplace

本プロジェクトは、Skill 作成に特化した Claude Code Plugin Marketplace を提供し、高品質な Agent Skills の迅速な作成と改善を支援します。

### Marketplace の追加

```bash
/plugin marketplace add likai/awesome-agentskills
```

### 利用可能な Plugins

#### Agent Skills Toolkit

強化版 skill-creator-pro とクイックコマンドを含む完全な Agent Skills ツールキット:

- ✨ **新しい Skills の作成**: ゼロからプロフェッショナルな skills を構築
- 🔧 **既存 Skills の改善**: skills の最適化と更新
- 📊 **パフォーマンステスト**: 評価テストとパフォーマンスベンチマークの実行
- 🎯 **説明の最適化**: トリガー精度向上のための skill 説明の最適化

### インストールと使用方法

1. Marketplace を追加後、`/plugin` コマンドを開く
2. Discover タブで「Agent Skills Toolkit」を見つける
3. インストール範囲（User/Project/Local）を選択してインストール
利用可能なコマンド：
   - `/agent-skills-toolkit:skill-creator-pro` - 完全なワークフロー（強化版）
   - `/agent-skills-toolkit:create-skill` - 新しい skill を作成
   - `/agent-skills-toolkit:improve-skill` - 既存の skill を改善
   - `/agent-skills-toolkit:test-skill` - skill をテストして評価
   - `/agent-skills-toolkit:optimize-description` - 説明を最適化

詳細は [plugins ディレクトリ](plugins/) をご覧ください。

## サポートツール

-   [yusufkaraaslan/Skill_Seekers](https://github.com/yusufkaraaslan/Skill_Seekers): ドキュメントサイト、GitHub リポジトリ、PDF ファイルを Agent Skills に自動変換
-   [context7 cli](https://context7.com/docs/skills#skills): context7 cli コマンドラインツールを使用して Agent Skills を管理・使用
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

![](../assets/media/talk_is_cheap.jpg)

## プロジェクト履歴

[![Star History Chart](https://api.star-history.com/svg?repos=libukai/awesome-agent-skills&type=date&legend=top-left)](https://www.star-history.com/#libukai/awesome-agent-skills&type=date&legend=top-left)
