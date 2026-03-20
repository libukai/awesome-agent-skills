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

本项目致力于遵循少而精的原则，收集和分享最优质的 Skill 资源、教程、实践案例，帮助更多人轻松迈出搭建 Agent 的第一步。

> 欢迎关注我的 𝕏 账号 [@李不凯正在研究](https://x.com/libukai) ，以及 💬 微信公众号 [@李不凯正在研究](https://mp.weixin.qq.com/s/uer7HvD2Z9ZbJSPEZWHKRA?scene=0&subscene=90) ，即时获取 Skills 的最新资源和实战教程！

## 快速入门

Skill 是一种轻量级的通用标准，通过打包工作流程和专业知识，为 AI 提升执行特定任务的能力。

当你需要执行可重复的任务时，你无需在每次和 AI 的对话中重复输入相关信息。只需安装对应的 Skill，AI 便能掌握相应的技能。

经过半年的发展和迭代，Skill 已成为 Agent 框架中增强 AI 个性化能力的标准方案，并得到了各类 AI 产品的广泛支持。

## 标准结构

根据标准定义，每个 Skill 都是一个规范化命名的文件夹，包含了流程、资料、脚本等各类资源。AI 通过在上下文中渐进式导入这些内容，来学习和掌握相关技能。

```markdown
my-skill/
├── SKILL.md          # 必需：说明和元数据
├── scripts/          # 可选：可执行代码
├── references/       # 可选：文档参考资料
└── assets/           # 可选：模板、资源
```

## 安装技能

Skill 可以在 Claude 和 ChatGPT 的 App 中使用，也可以在 IDE 及 TUI 编程工具中使用，还可以在 OpenClaw 等 Agent Harness 上使用。

### 类 Claude Code 生态

![](assets/media/skills_mp.png)

推荐使用 [skillsmp](https://skillsmp.com/zh) 商店，该商店中自动抓取了 Github 上的所有的 Skill 项目，并按照分类、更新时间、星标数量等标签进行了分类整理。

可辅助使用 Vercel 出品的 [skills.sh](https://skills.sh/) 排行榜，直观查看当前最受欢迎的 Skills 仓库和单个 Skill 的使用情况。

对于特定的 skill，使用 `npx skills` 命令行工具可快速发现、添加和管理 skill，具体参数详见 [vercel-labs/skills](https://github.com/vercel-labs/skills)。

```bash
npx skills find [query]                          # 搜索相关技能
npx skills add <owner/repo>                      # 安装技能（支持 GitHub 简写、完整 URL、本地路径）
npx skills list                                  # 列出已安装的技能
npx skills check                                 # 检查可用更新
npx skills update                                # 升级所有技能
npx skills remove [skill-name]                   # 卸载技能
```

### 类 OpenClaw 生态

![](assets/media/clawhub.png)

如果有科学上网的能力，且使用官方版本 OpeClaw，推荐使用官方的 [ClawHub](https://clawhub.com/) 商店，提供的技能更偏技术向且包含了大量海外产品的整合。

```bash
npx clawhub search [query]          # 搜索相关技能
npx clawhub explore                 # 浏览技能市场
npx clawhub install <slug>          # 安装技能
npx clawhub uninstall <slug>        # 卸载技能
npx clawhub list                    # 列出已安装的技能
npx clawhub update --all            # 升级所有技能
npx clawhub inspect <slug>          # 查看技能详情（不安装）
```

![](assets/media/skillshub.png)

对于主要在国内网络环境下使用，或者是使用国内定制版的 OpenClaw，推荐使用腾讯推出的 [SkillHub](https://skillhub.tencent.com/) 商店，提供了大量更符合中国用户使用需求的技能。

首先，需要安装 Skill Hub CLI 工具，可以通过以下命令进行安装：

```bash
curl -fsSL https://skillhub-1251783334.cos.ap-guangzhou.myqcloud.com/install/install.sh | bash
```

安装完成后，可以使用以下命令来安装和管理技能：

```bash
skillhub search [query] # 搜索相关技能
skillhub install <skill-name> # 使用 skill name 添加技能
skillhub list # 列出已安装的技能
skillhub upgrade # 升级已安装的技能
```

## 优质教程

### 官方文档

- @Anthropic：[Claude Skill 完全构建指南](docs/Claude-Skills-完全构建指南.md) 
- @Anthropic：[Claude Agent Skills 实战经验](docs/Claude-Code-Skills-实战经验.md)
- @Google：[Agent Skills 五种设计模式](docs/Agent-Skill-五种设计模式.md)

### 图文教程

  - @李不凯正在研究：[Agent Skills 简要介绍 PPT](/assets/docs/Agent%20Skills%20终极指南.pdf)
-   @一泽 Eze：[Agent Skills 终极指南：入门、精通、预测](https://mp.weixin.qq.com/s/jUylk813LYbKw0sLiIttTQ)
-   @deeptoai：[Claude Agent Skills 第一性原理深度解析](https://skills.deeptoai.com/zh/docs/ai-ml/claude-agent-skills-first-principles-deep-dive)


### 视频教程

-   @马克的技术工作坊：[Agent Skill 从使用到原理，一次讲清](https://www.youtube.com/watch?v=yDc0_8emz7M)
-   @白白说大模型：[别再造 Agent 了，未来是Skills的](https://www.youtube.com/watch?v=xeoWgfkxADI)
-   @01Coder：[OpenCode + 智谱GLM + Agent Skills打造高质量智能开发环境](https://www.youtube.com/watch?v=mGzY2bCoVhU)

## 官方技能

<table>
<tr>
<td><a href="https://github.com/vercel-labs/agent-browser/tree/main/skills">agent-browser</a></td>
<td><a href="https://github.com/anthropics/skills">anthropics</a></td>
<td><a href="https://github.com/better-auth/skills">better-auth</a></td>
<td><a href="https://github.com/black-forest-labs/skills">black-forest-labs</a></td>
<td><a href="https://github.com/browser-use/browser-use/tree/main/skills">browser-use</a></td>
</tr>
<tr>
<td><a href="https://github.com/ClickHouse/agent-skills">clickhouse</a></td>
<td><a href="https://github.com/cloudflare/skills">cloudflare</a></td>
<td><a href="https://github.com/langgenius/dify/tree/main/.claude/skills">dify</a></td>
<td><a href="https://github.com/expo/skills">expo</a></td>
<td><a href="https://github.com/firecrawl/cli">firecrawl</a></td>
</tr>
<tr>
<td><a href="https://github.com/google-gemini/gemini-skills">gemini</a></td>
<td><a href="https://github.com/huggingface/skills">huggingface</a></td>
<td><a href="https://github.com/microsoft/agent-skills">microsoft</a></td>
<td><a href="https://github.com/kepano/obsidian-skills">obsidian</a></td>
<td><a href="https://github.com/openclaw/openclaw/tree/main/skills">openclaw</a></td>
</tr>
<tr>
<td><a href="https://github.com/openai/skills">openai</a></td>
<td><a href="https://github.com/remotion-dev/skills">remotion</a></td>
<td><a href="https://github.com/replicate/skills">replicates</a></td>
<td><a href="https://github.com/sanity-io/agent-toolkit/tree/main/skills">sanity</a></td>
<td><a href="https://github.com/slidevjs/slidev/tree/main/skills/slidev">slidev</a></td>
</tr>
<tr>
<td><a href="https://github.com/stripe/ai">stripe</a></td>
<td><a href="https://github.com/supabase/agent-skills">supabase</a></td>
<td><a href="https://github.com/vercel-labs/agent-skills">vercel</a></td>
<td><a href="https://github.com/WordPress/agent-skills">wordpress</a></td>
<td></td>
</tr>
</table>

## 精选技能

### 编程开发

-   [superpowers](https://github.com/obra/superpowers/tree/main/skills)：涵盖完整编程项目工作流程
-   [ui-ux-pro-max-skill](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill)：更精致和个性化的 UI/UX 设计

### 内容创作

-   [baoyu-skills](https://github.com/JimLiu/baoyu-skills)：宝玉的自用 SKills 集合，包括公众号写作、PPT 制作等
-   [libukai](https://github.com/libukai/awesome-agent-skills/tree/main/skills): 李不凯发布 Obsidian 相关工具 Skill
-   [op7418](https://github.com/op7418)：歸藏制作的一系列 Skills 集合，包括 PPT 制作、Youtube 分析等
-   [cclank](https://github.com/cclank/news-aggregator-skill)：cclank 制作的新闻聚合 Skill，能够自动抓取和总结指定领域的最新资讯
-   [huangserva](https://github.com/huangserva/skill-prompt-generator)：huangserva 使用 Skill 生成和优化 AI 人像文生图提示词的 Skill

### 产品使用

-   [wps](https://github.com/wpsnote/wpsnote-skills)：操控 WPS 办公软件
-   [notebooklm](https://github.com/teng-lin/notebooklm-py)：操控 NotebookLM 
-   [n8n](https://github.com/czlonkowski/n8n-skills)：创建 n8n 工作流
-   [threejs](https://github.com/cloudai-x/threejs-skills)： 辅助开发 Three.js 项目

### 其他类型

-  [pua](https://github.com/tanweai/pua)：以 PUA 的方式驱动 Agent 更卖力的干活
-   [office-hours](https://github.com/garrytan/gstack/tree/main/office-hours)：使用 YC 的视角提供各种建议
-   [marketingskills](https://github.com/coreyhaines31/marketingskills)：强化市场营销的能力领域
-   [scientific-skills](https://github.com/K-Dense-AI/claude-scientific-skills)： 提升科研工作者的技能水平


## 创建技能

虽然可以通过技能商店直接安装他人创建的技能，但是为了提升技能的适配度和个性化，强烈建议根据需要自己动手创建技能，或者在其他人的基础上进行微调。

### 官方插件

通过官方出品的  [skill-creator](https://github.com/anthropics/skills/tree/main/skills/skill-creator) 插件可快速创建和迭代个人专属的 skill。


![](assets/media/skill-creator.png)

### 增强插件

在官方 skill-creator plugin 的基础上，本项目整合来自 Anthropic 和 Google 团队的最佳实践，构建了一个更为强大的 Agent Skills Toolkit，帮助你快速创建和改进 Agent Skills。（**注意：该插件目前仅支持 Claude Code**）

#### 添加市场

启动 Claude Code，进入插件市场，添加 `libukai/awesome-agent-skills` 市场，也可以直接在输入框中使用以下指令添加市场：

```bash
/plugin marketplace add libukai/awesome-agent-skills
```

#### 安装插件

成功安装市场之后，选择安装 `agent-skills-toolkit` 插件

![](assets/media/skill-creator-pro.png)

#### 快捷指令

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
