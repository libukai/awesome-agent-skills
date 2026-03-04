<div>
  <p align="center">
    <a href="https://platform.composio.dev/?utm_source=Github&utm_medium=Youtube&utm_campaign=2025-11&utm_content=AwesomeSkills">
    <img width="1280" height="640" alt="Composio banner" src="assets/media/awesome-agent-skills.png">
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

简体中文 | [English](docs/README_EN.md) | [日本語](docs/README_JA.md) 

</div>

本项目致力于遵循少而精的原则，收集和分享最优质的 Skills 教程、案例和实践，帮助更多人轻松迈出搭建 Agent 的第一步。

> 欢迎关注我的 𝕏 账号 [@李不凯正在研究](https://x.com/libukai) ，即时获取 Agent Skills 的最新资源和实战教程！

## 基本介绍

Agent Skills （智能体技能）是一种轻量级的开放标准，用于通过专业知识和工作流程来扩展 AI Agent 的能力。

当你需要执行可重复的工作流程时，你无需在每次和 AI 的对话中重复解释自己的流程、知识和偏好，Skills 让你只需教导一次，便能让 AI 学会相关的技能。

## 标准结构

根据标准定义，每个 Skill 都是一个规范化命名的文件夹，其中集合了指令、脚本和资源，AI 通过在上下文中渐进式导入这些内容来理解和学习相关技能。

```markdown
my-skill/
├── SKILL.md          # 必需：说明和元数据
├── scripts/          # 可选：可执行代码
├── references/       # 可选：文档参考资料
└── assets/           # 可选：模板、资源
```

## 快速安装

使用 `npx skills` 命令行工具可快速发现、添加和管理 skill，具体参数详见 [vercel-labs/skills](https://github.com/vercel-labs/skills)。

```bash
npx skills find [query] # 搜索相关技能
npx skills add <owner/repo> # 从指定 git 或本地路径添加技能
npx skills list # 列出已安装的技能
npx skills update # 升级技能
npx skills remove [skill-name] # 卸载技能
```

## 技能商店

![](assets/media/skills_mp.png)

推荐使用 [skillsmp](https://skillsmp.com/zh) 商店，该商店中自动抓取了 Github 上的所有的 Skills 项目，并按照分类、更新时间、Star 数量等标签进行了整理。

可辅助使用 Vercel 出品的 [skills.sh](https://skills.sh/) 排行榜，直观查看当前最受欢迎的 Skills 仓库和单个 Skill 的使用情况。

## 教程合集

### 官方指南

-  @Anthropic: [Claude Skill 完整构建指南(中文版)](docs/Claude-Skills-完全构建指南.md)

### 图文教程

-   @一泽 Eze：[Agent Skills 终极指南：入门、精通、预测](https://mp.weixin.qq.com/s/jUylk813LYbKw0sLiIttTQ)
-   @deeptoai：[Claude Agent Skills 第一性原理深度解析](https://skills.deeptoai.com/zh/docs/ai-ml/claude-agent-skills-first-principles-deep-dive)
-   @歸藏：[带动效的 PPT 生成 Agent！使用教学&创作思路](https://x.com/op7418/status/2010979152284041401)

### 视频教程

-   @马克的技术工作坊：[Agent Skill 从使用到原理，一次讲清](https://www.youtube.com/watch?v=yDc0_8emz7M)
-   @白白说大模型：[别再造 Agent 了，未来是Skills的](https://www.youtube.com/watch?v=xeoWgfkxADI)
-   @01Coder：[OpenCode + 智谱GLM + Agent Skills打造高质量智能开发环境](https://www.youtube.com/watch?v=mGzY2bCoVhU)

## 产品使用

Agent Skills 作为一套基于文件系统的跨平台标准，可以灵活地被嵌入到各种产品中使用。

### 编程工具

该标准目前已得到 Anthropic/OpenAI/Google/Microsoft/Cursor 等多家行业领军公司的支持，迅速成为各大主流 AI 工具的标配。

要在编程工具中安装 Agent Skills，只需要将 Skill 文件夹放入对应的路径即可。

| 工具            | 项目路径            | 全局路径                     | 官方文档                                                                                |
| --------------- | ------------------- | ---------------------------- | --------------------------------------------------------------------------------------- |
| **Claude Code** | `.claude/skills/`   | `~/.claude/skills/`          | [Claude Code Skills](https://code.claude.com/docs/en/skills)                            |
| **Codex**       | `.codex/skills/`    | `~/.codex/skills/`           | [Codex Skills](https://developers.openai.com/codex/skills)                              |
| **Gemini CLI**  | `.gemini/skills/`   | `~/.gemini/skills/`          | [Gemini CLI Skills](https://geminicli.com/docs/cli/skills/)                             |
| **OpenCode**    | `.opencode/skills/` | `~/.config/opencode/skills/` | [OpenCode Skills](https://opencode.ai/docs/skills)                                      |
| **Cursor**      | `.cursor/skills/`   | `~/.cursor/skills/`          | [Cursor Skills](https://cursor.com/cn/docs/context/skills)                              |
| **VS Code**     | `.github/skills/`   | `~/.copilot/skills/`         | [VS Code Skills](https://code.visualstudio.com/docs/copilot/customization/agent-skills) |

更详细的列表参见：[编程工具 Skills 路径列表](https://github.com/vercel-labs/skills?tab=readme-ov-file#supported-agents)

### 对话工具

随着 Agent Skills 标准的普及，越来越多的对话式 AI 工具也开始支持 Skill 的安装和使用。

用户可以通过添加 Skill 来扩展助手/智能体的能力，实现更复杂的任务处理流程。

-   [Coze/扣子](https://www.coze.cn/open/docs/cozespace/what_is_skill)： Coze 2.0 新增技能功能使用说明
-   [Cherry Studio](https://mp.weixin.qq.com/s/nqBMW9QaTcagohzy2gXaZA)：在 Cherry Studio 中通过 Agent 使用 Skill 最佳实践

## 精选技能

### 技能创建

-   [skill-creator](https://github.com/anthropics/skills/tree/main/skills/skill-creator): Anthropic 官方出品用于创建 skill 的元技能，可快速创建和迭代个人专属的 skill

### 官方项目

-   [agent-browser](https://github.com/vercel-labs/agent-browser/tree/main/skills): Vercel 出品的操控浏览器及应用的 Skills 集合
-   [anthropics](https://github.com/anthropics/skills)：Anthropic 出品的官方示例 Skills 集合
-   [better-auth](https://github.com/better-auth/skills)：Better Auth 出品的认证工具 Skills 集合
-   [black-forest-labs](https://github.com/black-forest-labs/skills)：Black Forest Labs 出品的操控 FLUX 模型的 Skills 集合
-   [browser-use](https://github.com/browser-use/browser-use/tree/main/skills)：Browser Use 出品的浏览器操作 Skills 集合
-   [cloudflare](https://github.com/cloudflare/skills)：Cloudflare 出品的 API 调用 Skills 集合
-   [clickhouse](https://github.com/ClickHouse/agent-skills)：ClickHouse 出品的数据库查询和分析 Skills 集合
-   [expo](https://github.com/expo/skills)：Expo 出品的 React Native Skills 集合
-   [firecrawl](https://github.com/firecrawl/cli)：Firecrawl 出品的 CLI 工具调用 Skills
-   [gemini](https://github.com/google-gemini/gemini-skills): Google Gemini 出品的 API/SDK 调用 Skills 集合
-   [huggingface](https://github.com/huggingface/skills)：HuggingFace 出品使用 Skill 训练大模型
-   [obsidian](https://github.com/kepano/obsidian-skills)：Obsidian CEO 出品增强 Obsidian 功能的 Skills 集合
-   [dify](https://github.com/langgenius/dify/tree/main/.claude/skills)：Dify 出品的多功能 Skills 集合
-   [microsoft](https://github.com/microsoft/agent-skills)：Microsoft 出品用于 Azure 服务的 Agent Skills 集合
-   [openclaw](https://github.com/openclaw/openclaw/tree/main/skills)：OpenClaw 官方 Skills 集合
-   [openai](https://github.com/openai/skills)：OpenAI 出品的官方 Skills 集合
-   [remotion](https://github.com/remotion-dev/skills)：Remotion 出品的使用 Remotion 创建视频内容
-   [replicates](https://github.com/replicate/skills)：Replicates 出品的调用 AI 模型的 Skills 集合
-   [slidev](https://github.com/slidevjs/slidev/tree/main/skills/slidev)：Slidev 出品的幻灯片制作 Skills 集合
-   [stripe](https://github.com/stripe/ai)：Stripe 出品的金融支付相关 Skills 集合
-   [sanity](https://github.com/sanity-io/agent-toolkit/tree/main/skills)：Sanity 出品的内容管理平台 Skills 集合
-   [supabase](https://github.com/supabase/agent-skills)：Supabase 出品的 PostgreSQL 最佳实践
-   [wordpress](https://github.com/WordPress/agent-skills)：WordPress 出品的内容管理平台 Skills 集合
-   [vercel](https://github.com/vercel-labs/agent-skills)：Vercel 出品的 React/Next Skills 集合


### 内容创作

-   [baoyu-skills](https://github.com/JimLiu/baoyu-skills)：宝玉的自用 SKills 集合，包括公众号写作、PPT 制作等
-   [op7418](https://github.com/op7418?tab=repositories)：歸藏制作的一系列 Skills 集合，包括 PPT 制作、Youtube 分析等
-   [wshuyi](https://github.com/wshuyi/x-article-publisher-skill): 王树义发布 X 文章的 Skill
-   [huangserva](https://github.com/huangserva/skill-prompt-generator)：huangserva 使用 Skill 生成和优化 AI 人像文生图提示词的 Skill

### 编程辅助

-   [superpowers](https://github.com/obra/superpowers/tree/main/skills)：涵盖完整编程项目工作流程的 Skills 集合
-   [ui-ux-pro-max-skill](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill)：面向 UI/UX 设计的 Skills 集合

### 产品使用

-   [teng-lin/notebooklm-py](https://github.com/teng-lin/notebooklm-py)：操控 NotebookLM 的 Skill
-   [czlonkowski/n8n-skills](https://github.com/czlonkowski/n8n-skills)：创建 n8n 工作流的 Skills 集合
-   [cloudai-x/threejs-skills](https://github.com/cloudai-x/threejs-skills)： 面向 Three.js 开发的 Skills 集合

### 其他类型

-   [coreyhaines31/marketingskills](https://github.com/coreyhaines31/marketingskills)：面向市场营销领域的 Skills 集合
-   [K-Dense-AI/claude-scientific-skills](https://github.com/K-Dense-AI/claude-scientific-skills)： 面向科研工作者的 Skills 集合
-   [shmlkv/dna-claude-analysis](https://github.com/shmlkv/dna-claude-analysis)：基于 Claude Code 的个人基因组分析工具包，涵盖 17 个类别的基因数据分析

## 配套工具

-   [Skill_Seekers](https://github.com/yusufkaraaslan/Skill_Seekers): 自动化抓取文档网站、GitHub 仓库和 PDF 文件转换为 Agent Skills
-   [context7 cli](https://context7.com/docs/skills#skills)：使用 context7 cli 命令行工具管理和使用 Agent Skills
-   [openskills](https://github.com/numman-ali/openskills): Skills 全局加载工具，支持多种 Agent 工具
-   [skild.sh](https://skild.sh/)：在多个工具中安装、管理和同步 Skills 的命令行工具
-   [agent-skills-guard](https://github.com/brucevanfdm/agent-skills-guard)：Agent skills 可视化管理+精选仓库+安全扫描

## 增强插件

在官方 skill-creator plugin 的基础上，本项目整合 [Claude Skill 完整构建指南](docs/Claude-Skills-完全构建指南.md) 中的最佳实践，构建了一个更为强大的 Agent Skills Toolkit ，帮助你快速创建和改进 Agent Skills。

**注意：该插件目前仅支持 Claude Code**

### 添加市场

启动 Claude Code，进入插件市场，添加 `libukai/awesome-agent-skills` 市场，也可以直接在输入框中使用以下指令添加市场：

```bash
/plugin marketplace add libukai/awesome-agent-skills
```

### 安装插件

成功安装市场之后，选择安装 `agent-skills-toolkit` 插件

![](assets/media/skill-creator-pro.png)

### 快捷指令

插件中置入了多个快捷指令，覆盖了从创建、改进、测试到优化技能描述的完整工作流程：

- `/agent-skills-toolkit:skill-creator-pro` - 完整工作流程（增强版）
- `/agent-skills-toolkit:create-skill` - 创建新 skill
- `/agent-skills-toolkit:improve-skill` - 改进现有 skill
- `/agent-skills-toolkit:test-skill` - 测试评估 skill
- `/agent-skills-toolkit:optimize-description` - 优化描述

## 致谢

![](assets/media/talk_is_cheap.jpg)

## 项目历史

[![Star History Chart](https://api.star-history.com/svg?repos=libukai/awesome-agent-skills&type=date&legend=top-left)](https://www.star-history.com/#libukai/awesome-agent-skills&type=date&legend=top-left)
