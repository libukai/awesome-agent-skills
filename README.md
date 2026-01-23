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

简体中文 | [English](README_EN.md) | [日本語](README_JA.md) 

</div>

本项目致力于遵守少而精的原则，收集和分享最优质的 Skills 教程、案例和实践，帮助更多人轻松迈出搭建 Agent 的第一步。

> 欢迎关注我的 𝕏 账号 [@李不凯正在研究](https://x.com/libukai) ，即时获取 Agent Skills 的最新资源和实战教程！

## 快速入门

Agent Skills 是一个由 Anthropic 牵头维护的 [开放标准](https://agentskills.io/home)，通过定义特定任务执行规范，能便捷地将个人经验转化为技能，快速构建轻量级的智能体。

根据标准定义，每个 Skill 都是一个规范化命名的文件夹，其中组合了 Markdown 文档、可执行脚本和其他类型素材文件。

![](assets/skills-sketch.png)

## 教程合集

### 图文教程

-   [@一泽 Eze：Agent Skills 终极指南：入门、精通、预测](https://mp.weixin.qq.com/s/jUylk813LYbKw0sLiIttTQ)
-   [@deeptoai：Claude Agent Skills 第一性原理深度解析](https://skills.deeptoai.com/zh/docs/ai-ml/claude-agent-skills-first-principles-deep-dive)
-   [@歸藏：带动效的 PPT 生成 Agent！使用教学&创作思路](https://x.com/op7418/status/2010979152284041401)

### 视频教程

-   [@马克的技术工作坊：Agent Skill 从使用到原理，一次讲清](https://www.youtube.com/watch?v=yDc0_8emz7M)
-   [@白白说大模型：别再造 Agent 了，未来是Skills的](https://www.youtube.com/watch?v=xeoWgfkxADI)
-   [@01Coder：OpenCode + 智谱GLM + Agent Skills打造高质量智能开发环境](https://www.youtube.com/watch?v=mGzY2bCoVhU)

## 编程工具

Agent Skills 开放标准已得到 OpenAI/Google/Microsoft/Cursor 等多家 AI 行业领军公司的支持，迅速成为各大主流 AI 编程工具的标配。

安装 Agent Skills，只需要将 Skill 文件夹放入对应的路径即可。也可以使用 Vercel 官方出品的 `npx skills add <owner/repo>` 命令行工具快速添加，具体参数参见 [npmjs/skills](https://www.npmjs.com/package/skills)。


| 工具               | 项目路径             | 全局路径                        | 官方文档                                                                                    |
| ------------------ | -------------------- | ------------------------------- | ------------------------------------------------------------------------------------------- |
| **Amp**            | `.agents/skills/`    | `~/.config/agents/skills/`      | [Amp Skills](https://ampcode.com/manual#agent-skills)                                       |
| **Antigravity**    | `.agent/skills/`     | `~/.gemini/antigravity/skills/` | [Antigravity Skills](https://antigravity.google/docs/skills)                                |
| **Claude Code**    | `.claude/skills/`    | `~/.claude/skills/`             | [Claude Code Skills](https://code.claude.com/docs/en/skills)                                |
| **Codex**          | `.codex/skills/`     | `~/.codex/skills/`              | [Codex Skills](https://developers.openai.com/codex/skills)                                  |
| **Cursor**         | `.cursor/skills/`    | `~/.cursor/skills/`             | [Cursor Skills](https://cursor.com/docs/context/skills)                                     |
| **CodeBuddy**      | `.codebuddy/skills/` | `~/.codebuddy/skills/`          | [Codebuddy Skills](https://copilot.tencent.com/docs/cli/skills)                             |
| **Droid/Factory**  | `.factory/skills/`   | `~/.factory/skills/`            | [Factory Droid Skills](https://docs.factory.ai/cli/configuration/skills)                    |
| **Gemini CLI**     | `.gemini/skills/`    | `~/.gemini/skills/`             | [Gemini CLI Skills](https://geminicli.com/docs/cli/skills/)                                 |
| **GitHub Copilot** | `.github/skills/`    | `~/.copilot/skills/`            | [Copilot Skills](https://docs.github.com/en/copilot/concepts/agents/about-agent-skills)     |
| **Goose**          | `.goose/skills/`     | `~/.config/goose/skills/`       | [Goose Skills](https://block.github.io/goose/docs/guides/context-engineering/using-skills/) |
| **Kilo Code**      | `.kilocode/skills/`  | `~/.kilocode/skills/`           | [Kilo Skills](https://kilo.ai/docs/agent-behavior/skills)                                   |
| **Kimi CLI**       | `.kimi/skills/`      | `~/.kimi/skills`                | [Kimi CLI Skills](https://moonshotai.github.io/kimi-cli/zh/customization/skills.html)       |
| **OpenCode**       | `.opencode/skills/`  | `~/.config/opencode/skills/`    | [OpenCode Skills](https://opencode.ai/docs/skills)                                          |
| **Qwen Code**      | `.qwen/skills/`      | `~/.qwen/skills/`               | [Qwen Code Skills](https://qwenlm.github.io/qwen-code-docs/zh/users/features/skills/)       |
| **Roo Code**       | `.roo/skills/`       | `~/.roo/skills/`                | [Roo Code Skills](https://docs.roocode.com/features/skills)                                 |
| **Trae**           | `.trae/skills/`      | ---                             | [Trae Skills](https://docs.trae.ai/ide/skills?_lang=zh)                                     |
| **Windsurf**       | `.windsurf/skills/`  | `~/.codeium/windsurf/skills/`   | [Windsurf Skills](https://docs.windsurf.com/windsurf/cascade/skills)                        |

## 对话工具

随着 Agent Skills 标准的普及，越来越多的对话式 AI 工具也开始支持 Skill 的安装和使用。用户可以通过添加 Skill 来扩展助手/智能体的能力，实现更复杂的任务处理流程。

-   [Coze/扣子](https://www.coze.cn/open/docs/cozespace/what_is_skill)： Coze 2.0 新增技能功能使用说明
-   [Cherry Studio](https://mp.weixin.qq.com/s/nqBMW9QaTcagohzy2gXaZA)：在 Cherry Studio 中通过 Agent 使用 Skill 最佳实践

## 技能商店

[![skillsmp](assets/skillsmp.png)](https://skillsmp.com/zh)

推荐使用 Vercel 出品的 [skills.sh](https://skills.sh/) 排行榜，可以直观查看当前最受欢迎的 Skills 仓库和单个 Skill 的使用情况。

还可以辅助使用 [skillsmp](https://skillsmp.com/zh) 商店，该商店中自动抓取了 Github 上的所有的 Skills 项目，并按照分类、更新时间、Star 数量等标签进行了整理。

其他特色 Agent Skills 商店还有：

-   [skillstore.io](https://skillstore.io/zh-hans)：对 Skill 进行了安全审计的中文商店
-   [agentskills.me](https://agentskills.me/)：提供了云端 Skill 运行环境的商店
-   [skills.rest](https://skills.rest/)：提供 Skill 分析和安全审查的商店

## 精选技能

### 技能创建

-   [anthropics/skill-creator](https://github.com/anthropics/skills/tree/main/skills/skill-creator): Anthropic 官方出品用于创建 skill 的元技能，可快速创建个人专属的 skill

### 文档处理

-   [docx](https://github.com/anthropics/skills/tree/main/skills/docx)：创建和编辑 Word 文档的 Skill
-   [pptx](https://github.com/anthropics/skills/tree/main/skills/pptx)：创建和编辑 PowerPoint 的 Skill
-   [xlsx](https://github.com/anthropics/skills/tree/main/skills/xlsx)：创建和编辑 Excel 的 Skill
-   [pdf](https://github.com/anthropics/skills/tree/main/skills/pdf)：创建和编辑 PDF 的 Skill

### 内容创作

-   [JimLiu/baoyu-skills](https://github.com/JimLiu/baoyu-skills)：宝玉老师的自用 SKills 集合，包括公众号写作、PPT 制作等功能
-   [op7418/NanoBanana-PPT-Skills)](https://github.com/op7418/NanoBanana-PPT-Skills)：歸藏制作的基于 NanoBanana 生成 PPT 的 Skill
-   [wshuyi/x-article-publisher-skill](https://github.com/wshuyi/x-article-publisher-skill): 王树义老师发布 X 文章的 Skill
-   [huangserva/skill-prompt-generator](https://github.com/huangserva/skill-prompt-generator)：黄佬使用 Skill 生成和优化文生图提示词

### 编程辅助

-   [anthropics/skills](https://github.com/anthropics/skills)：Anthropic 官方 Skills 集合
-   [vercel-labs/agent-skills](https://github.com/vercel-labs/agent-skills)：Vercel 官方出品的编程 React Skills 集合
-   [hyf0/vue-skills](https://github.com/hyf0/vue-skills)：面向 Vue.js 开发的 Skills 集合
-   [obra/superpowers](https://github.com/obra/superpowers/tree/main/skills)：涵盖完整编程项目工作流程的 Skills 集合
-   [ComposioHQ/awesome-claude-skills](https://github.com/ComposioHQ/awesome-claude-skills)：涵盖多个编程类任务的优质 Skills 集合
-   [nextlevelbuilder/ui-ux-pro-max-skill](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill)：面向 UI/UX 设计的 Skills 集合
-   [OthmanAdi/planning-with-files](https://github.com/OthmanAdi/planning-with-files)：使用文件规划实现长期 Plan 效果的 Skill

### 产品使用

-   [teng-lin/notebooklm-py](https://github.com/teng-lin/notebooklm-py)：操控 NotebookLM 的 Skill
-   [langgenius/dify](https://github.com/langgenius/dify/tree/main/.claude/skills)：Dify 官方出品的多功能 Skills 集合
-   [czlonkowski/n8n-skills](https://github.com/czlonkowski/n8n-skills)：创建 n8n 工作流的 Skills 集合
-   [kepano/obsidian-skills](https://github.com/kepano/obsidian-skills)：增强 Obsidian 功能的 Skills 集合
-   [huggingface/skills](https://github.com/huggingface/skills)：使用 Skill 在 HuggingFace 训练大模型

### 其他类型

-   [K-Dense-AI/claude-scientific-skills](https://github.com/K-Dense-AI/claude-scientific-skills)： 面向科研工作者的 Skills 集合

## 配套工具

-   [Skill_Seekers](https://github.com/yusufkaraaslan/Skill_Seekers): 自动化抓取文档网站、GitHub 仓库和 PDF 文件转换为 Agent Skills
-   [openskills](https://github.com/numman-ali/openskills): Skills 全局加载工具，支持多种 Agent 工具
-   [skild.sh](https://skild.sh/)：在多个工具中安装、管理和同步 Skills 的命令行工具
-   [agent-skills-guard](https://github.com/brucevanfdm/agent-skills-guard)：Agent skills 可视化管理+精选仓库+安全扫描
-   [skillmaster](https://github.com/davidyangcool/agent-skill)：通过终端管理、安装和使用 Agent Skills
  
## 权威资料

Anthropic 在官方博客中提供了丰富的 Agent Skills 相关教程，推荐有余力者阅读以下文章以深入了解 Agent Skills 的概念、创建方法和应用场景：

-   [Introducing Agent Skills: Improve how it performs specific tasks](https://claude.com/blog/skills)
-   [Skills explained: How Skills compares to prompts, Projects, MCP, and subagents](https://claude.com/blog/skills-explained)
-   [Extending Claude’s capabilities with skills and MCP servers](https://claude.com/blog/extending-claude-capabilities-with-skills-mcp-servers)
-   [Equipping agents for the real world with Agent Skills](https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills)
-   [How to create Skills: Key steps, limitations, and examples](https://claude.com/blog/how-to-create-skills-key-steps-limitations-and-examples)
-   [Building Skills for Claude Code: Automating your procedural knowledge](https://claude.com/blog/building-skills-for-claude-code)
-   [Code execution with MCP: Building more efficient agents](https://www.anthropic.com/engineering/code-execution-with-mcp)
-   [Improving frontend design through Skills](https://claude.com/blog/improving-frontend-design-through-skills#real-world-skills-examples)
-   [Don't Build Agents, Build Skills Instead](https://x.com/iamzhihui/status/2005883147305500681/photo/1)

## 致谢

![](assets/talk_is_cheap.jpg)

## 项目历史

[![Star History Chart](https://api.star-history.com/svg?repos=libukai/awesome-agent-skills&type=date&legend=top-left)](https://www.star-history.com/#libukai/awesome-agent-skills&type=date&legend=top-left)
