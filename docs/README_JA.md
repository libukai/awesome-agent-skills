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

このプロジェクトは、少数精鋭の原則に従い、最高品質の Skills チュートリアル、ケーススタディ、ベストプラクティスの収集と共有を目的とし、より多くの人が Agent 構築の第一歩を簡単に踏み出せるよう支援します。

> 𝕏 アカウント [@libukai](https://x.com/libukai) および 💬 WeChat 公式アカウント [@李不凯正在研究](https://mp.weixin.qq.com/s/uer7HvD2Z9ZbJSPEZWHKRA?scene=0&subscene=90) をフォローして、Skills の最新リソースと実用的なチュートリアルをいち早く入手してください!

## 基本紹介

Skill は軽量な汎用オープン標準で、専門知識とワークフローをパッケージ化することで AI の特定の能力を拡張します。

反復可能なタスクを実行する必要がある時、毎回の AI との会話で自分のプロセス、知識、好みを繰り返し提供する必要はありません。関連コンテンツを Skill に変換するだけで、AI は関連スキルを自ら学習できます。

半年間の開発と反復を経て、Skill 標準は様々な AI 製品に広くサポートされ、Claude Code 系エコシステムや OpenClaw 系エコシステムにおいてパーソナライズされた AI 能力を強化する標準ソリューションとなりました。

## 標準構造

標準の定義によれば、各 Skill は標準化された命名のフォルダで、指示、スクリプト、リソースを集約したものです。AI はこれらのコンテンツをコンテキスト内で段階的にインポートし、関連スキルを理解・学習します。

```markdown
my-skill/
├── SKILL.md          # 必須：説明とメタデータ
├── scripts/          # オプション：実行可能コード
├── references/       # オプション：ドキュメント参考資料
└── assets/           # オプション：テンプレート、リソース
```

## クイックインストール

### Claude Code エコシステム

![](../assets/media/skills_mp.png)

[skillsmp](https://skillsmp.com/zh) マーケットプレイスの使用を推奨します。このマーケットプレイスは GitHub 上のすべての Skills プロジェクトを自動的にインデックス化し、カテゴリ、更新時間、スター数などのタグで整理しています。

また、Vercel の [skills.sh](https://skills.sh/) ランキングボードを補助的に使用できます。最も人気のある Skills リポジトリと個別 Skill の使用状況を直感的に確認できます。

特定の skill については、`npx skills` コマンドラインツールを使用して迅速に発見、追加、管理できます。詳細なパラメータについては [vercel-labs/skills](https://github.com/vercel-labs/skills) を参照してください。

```bash
npx skills find [query] # 関連スキルを検索
npx skills add <owner/repo> # 指定された git またはローカルパスからスキルを追加
npx skills list # インストール済みスキルをリスト表示
npx skills update # スキルをアップグレード
npx skills remove [skill-name] # スキルをアンインストール
```

### OpenClaw エコシステム

![](../assets/media/clawhub.png)

国際的なネットワークにアクセスでき、公式版 OpenClaw を使用している場合は、公式の [ClawHub](https://clawhub.com/) マーケットプレイスの使用を推奨します。より技術志向のスキルを提供し、多くの海外製品との統合が含まれています。

```bash
npx clawhub search "postgres backups"  # 関連スキルを検索
npx clawhub install <skill-name> # 名前でスキルをインストール
npx clawhub update --all # スキルをアップグレード
npx clawhub update --all --no-input --force # 強制的にスキルをアップグレード
```

![](../assets/media/skillshub.png)

主に中国のネットワーク環境で使用する場合、または中国のカスタマイズ版 OpenClaw を使用している場合は、Tencent の [SkillHub](https://skillhub.tencent.com/) マーケットプレイスの使用を推奨します。中国ユーザーのニーズにより適した多くのスキルを提供しています。

まず、Skill Hub CLI ツールをインストールする必要があります。以下のコマンドでインストールできます：

```bash
curl -fsSL https://skillhub-1251783334.cos.ap-guangzhou.myqcloud.com/install/install.sh | bash
```

インストール完了後、以下のコマンドを使用してスキルをインストールおよび管理できます：

```bash
skillhub search [query] # 関連スキルを検索
skillhub install <skill-name> # スキル名を使用してスキルを追加
skillhub list # インストール済みスキルをリスト表示
skillhub upgrade # インストール済みスキルをアップグレード
```

## スキル作成

スキルマーケットプレイスを通じて他人が作成したスキルを直接インストールして使用することもできますが、適合性とパーソナライゼーションを向上させるために、必要に応じて自分でスキルを作成するか、他人のスキルを微調整することをお勧めします。

以下は、スキル作成を迅速に開始するための優れたスキル作成リソースです。

### 公式チュートリアル

-   @Anthropic: [Claude Skill 完全構築ガイド（中国語版）](../docs/Claude-Skills-完全構建指南.md)

### スキル作成

-   [skill-creator](https://github.com/anthropics/skills/tree/main/skills/skill-creator): Anthropic 公式の skill 作成・最適化用メタスキル。個人専用の skill を迅速に作成・反復可能。

## 優良チュートリアル

### 図文チュートリアル

-   [@一泽 Eze: Agent Skills 究極ガイド: 入門、マスター、予測](https://mp.weixin.qq.com/s/jUylk813LYbKw0sLiIttTQ)
-   [@deeptoai: Claude Agent Skills 第一原理による詳細解析](https://skills.deeptoai.com/zh/docs/ai-ml/claude-agent-skills-first-principles-deep-dive)
-   [@歸藏: アニメーション付き PPT 生成 Agent! 使い方とクリエイティブアイデア](https://x.com/op7418/status/2010979152284041401)

### ビデオチュートリアル

-   [@马克的技术工作坊: Agent Skill の使い方から原理まで一度に解説](https://www.youtube.com/watch?v=yDc0_8emz7M)
-   [@白白说大模型: Agent を作るのはやめよう、未来は Skills だ](https://www.youtube.com/watch?v=xeoWgfkxADI)
-   [@01Coder: OpenCode + GLM + Agent Skills で高品質な知的開発環境を構築](https://www.youtube.com/watch?v=mGzY2bCoVhU)

## 厳選 Skills

### Skill 作成

-   [anthropics/skill-creator](https://github.com/anthropics/skills/tree/main/skills/skill-creator): Anthropic 公式の Skill 作成用メタスキル。個人カスタム Skill を迅速に作成可能

### 公式プロジェクト

-   [agent-browser](https://github.com/vercel-labs/agent-browser/tree/main/skills): Vercel 公式のブラウザとアプリケーション制御用 Skills コレクション
-   [anthropics](https://github.com/anthropics/skills): Anthropic 公式サンプル Skills コレクション
-   [better-auth](https://github.com/better-auth/skills): Better Auth 公式の認証ツール Skills コレクション
-   [black-forest-labs](https://github.com/black-forest-labs/skills): Black Forest Labs 公式の FLUX モデル制御用 Skills コレクション
-   [browser-use](https://github.com/browser-use/browser-use/tree/main/skills): Browser Use 公式のブラウザ自動化 Skills コレクション
-   [cloudflare](https://github.com/cloudflare/skills): Cloudflare 公式の API 統合 Skills コレクション
-   [clickhouse](https://github.com/ClickHouse/agent-skills): ClickHouse 公式のデータベースクエリ・分析 Skills コレクション
-   [expo](https://github.com/expo/skills): Expo 公式 React Native Skills コレクション
-   [firecrawl](https://github.com/firecrawl/cli): Firecrawl 公式の CLI ツール Skills
-   [gemini](https://github.com/google-gemini/gemini-skills): Google Gemini 公式の API/SDK Skills コレクション
-   [huggingface](https://github.com/huggingface/skills): HuggingFace 公式 Skill を使用した大規模モデルのトレーニング
-   [obsidian](https://github.com/kepano/obsidian-skills): Obsidian CEO 公式 Obsidian 機能拡張用 Skills コレクション
-   [dify](https://github.com/langgenius/dify/tree/main/.claude/skills): Dify 公式の多機能 Skills コレクション
-   [microsoft](https://github.com/microsoft/agent-skills): Microsoft 公式の Azure サービス向け Agent Skills コレクション
-   [openclaw](https://github.com/openclaw/openclaw/tree/main/skills): OpenClaw 公式 Skills コレクション
-   [openai](https://github.com/openai/skills): OpenAI 公式 Skills コレクション
-   [remotion](https://github.com/remotion-dev/skills): Remotion 公式 Remotion を使用した動画コンテンツ作成
-   [replicates](https://github.com/replicate/skills): Replicate 公式の AI モデル呼び出し Skills コレクション
-   [slidev](https://github.com/slidevjs/slidev/tree/main/skills/slidev): Slidev 公式のプレゼンテーション作成 Skills コレクション
-   [stripe](https://github.com/stripe/ai): Stripe 公式の金融決済関連 Skills コレクション
-   [sanity](https://github.com/sanity-io/agent-toolkit/tree/main/skills): Sanity 公式のコンテンツ管理プラットフォーム Skills コレクション
-   [supabase](https://github.com/supabase/agent-skills): Supabase 公式 PostgreSQL ベストプラクティス
-   [wordpress](https://github.com/WordPress/agent-skills): WordPress 公式のコンテンツ管理プラットフォーム Skills コレクション
-   [vercel](https://github.com/vercel-labs/agent-skills): Vercel 公式 React/Next.js Skills コレクション


### コンテンツ作成

-   [baoyu-skills](https://github.com/JimLiu/baoyu-skills): Baoyu 個人用 Skills コレクション。WeChat 公式アカウント執筆、PPT 作成などを含む
-   [libukai](https://github.com/libukai/awesome-agent-skills/tree/main/skills): Libukai の Obsidian 関連ツール Skill
-   [op7418](https://github.com/op7418): Guizang 制作の一連の Skills コレクション。PPT 作成、YouTube 分析などを含む
-   [cclank](https://github.com/cclank/news-aggregator-skill): cclank 制作のニュース集約 Skill。指定分野の最新情報を自動取得・要約
-   [huangserva](https://github.com/huangserva/skill-prompt-generator): huangserva の AI ポートレートテキスト to 画像プロンプトの生成と最適化 Skill

### プログラミング補助

-   [superpowers](https://github.com/obra/superpowers/tree/main/skills): 完全なプログラミングプロジェクトワークフローをカバーする Skills コレクション
-   [ui-ux-pro-max-skill](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill): UI/UX デザイン向け Skills コレクション

### プロダクト利用

-   [teng-lin/notebooklm-py](https://github.com/teng-lin/notebooklm-py): NotebookLM 制御用 Skill
-   [czlonkowski/n8n-skills](https://github.com/czlonkowski/n8n-skills): n8n ワークフロー作成用 Skills コレクション
-   [cloudai-x/threejs-skills](https://github.com/cloudai-x/threejs-skills): Three.js 開発向け Skills コレクション

### その他のタイプ

-   [coreyhaines31/marketingskills](https://github.com/coreyhaines31/marketingskills): マーケティング向け Skills コレクション
-   [K-Dense-AI/claude-scientific-skills](https://github.com/K-Dense-AI/claude-scientific-skills): 科学研究者向け Skills コレクション
-   [shmlkv/dna-claude-analysis](https://github.com/shmlkv/dna-claude-analysis): Claude Code で構築された個人ゲノム解析ツールキット、17 カテゴリのゲノムデータ分析をカバー


## 強化プラグイン

本プロジェクトは公式 skill-creator plugin を基に、[《Claude Skill 完全構築ガイド》](../docs/Claude-Skills-完全構建指南.md)のベストプラクティスを組み込み、Agent Skills を迅速に作成・改善するためのより強力な Agent Skills Toolkit を構築しました。

**注意：このプラグインは現在 Claude Code のみをサポートしています**

### マーケットプレイスの追加

Claude Code を起動し、プラグインマーケットプレイスに入り、`libukai/awesome-agent-skills` マーケットプレイスを追加します。入力ボックスで以下のコマンドを直接使用してマーケットプレイスを追加することもできます：

```bash
/plugin marketplace add libukai/awesome-agent-skills
```

### プラグインのインストール

マーケットプレイスのインストールに成功したら、`agent-skills-toolkit` プラグインを選択してインストールします。

![](../assets/media/skill-creator-pro.png)

### クイックコマンド

プラグインには複数のクイックコマンドが組み込まれており、作成、改善、テストからスキル説明の最適化まで、完全なワークフローをカバーしています：

- `/agent-skills-toolkit:skill-creator-pro` - 完全なワークフロー（強化版）
- `/agent-skills-toolkit:create-skill` - 新しい skill を作成
- `/agent-skills-toolkit:improve-skill` - 既存の skill を改善
- `/agent-skills-toolkit:test-skill` - skill をテストして評価
- `/agent-skills-toolkit:optimize-description` - 説明を最適化

## 謝辞

![](../assets/media/talk_is_cheap.jpg)

## プロジェクト履歴

[![Star History Chart](https://api.star-history.com/svg?repos=libukai/awesome-agent-skills&type=date&legend=top-left)](https://www.star-history.com/#libukai/awesome-agent-skills&type=date&legend=top-left)
