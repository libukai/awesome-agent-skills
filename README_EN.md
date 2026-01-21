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

English | [日本語](README_JA.md) | [简体中文](README.md)

</div>

This project is dedicated to collecting and sharing the finest Skills tutorials, case studies, and best practices, helping more people easily take their first step in building Agents.

> Follow me on 𝕏 [@libukai](https://x.com/libukai) for the latest news and practical tutorials about Agent Skills!

## Quick Start

Agent Skills is an [open standard](https://agentskills.io/home) maintained by Anthropic. By defining task-specific execution specifications, it enables convenient transformation of personal experience into AI Skills, allowing rapid construction of lightweight Personal Agents.

According to the standard, each Skill is a standardized named folder that combines Markdown documents, executable scripts, and other material files.

![](assets/skills-sketch.png)

## Tutorial Collection

### Beginner Tutorials

-   [@一泽 Eze: Ultimate Guide to Agent Skills: Getting Started, Mastering, and Predictions](https://mp.weixin.qq.com/s/jUylk813LYbKw0sLiIttTQ)
-   [@数字生命卡兹克: A Complete Guide to Understanding What Skills Really Are](https://x.com/Khazix0918/status/2010940910083940382)
-   [@王树义: How AI Upgrades from "Mouthpiece" to "Worker"](https://x.com/wshuyi/status/2009451186039214388)

### Advanced Tutorials

-   [@宝玉: Five-Step Framework to Transform Workflows into Evolvable Skills](https://x.com/dotey/status/2010176124450484638)
-   [@歸藏: Animated PPT Generation Agent! Tutorial & Creative Ideas](https://x.com/op7418/status/2010979152284041401)
-   [@李不凯正在研究: Best Practices for Using Agent Skills in Cherry Studio](https://mp.weixin.qq.com/s/nqBMW9QaTcagohzy2gXaZA)

### In-Depth Analysis

-   [@凡人小北: Everyone's Teaching How to Write Skills, But You Might Be Repeating MCP's Mistakes](https://x.com/frxiaobei/status/2011075599083995566)
-   [@deeptoai: First Principles Deep Dive into Claude Agent Skills](https://skills.deeptoai.com/zh/docs/ai-ml/claude-agent-skills-first-principles-deep-dive)
-   [@宝玉: Claude Code's "Lazy Loading" Update: AI Finally Learns "On-Demand"](https://x.com/dotey/status/2011660434516873264)

### Video Tutorials

- [@马克的技术工作坊: Agent Skills from Usage to Principles, Explained Once and For All](https://www.youtube.com/watch?v=yDc0_8emz7M)
- [@白白说大模型: Stop Building Agents, The Future is Skills](https://www.youtube.com/watch?v=xeoWgfkxADI)
- [@01Coder: Building a High-Quality Intelligent Dev Environment with OpenCode + GLM + Agent Skills](https://www.youtube.com/watch?v=mGzY2bCoVhU)

## Programming Tools

The Agent Skills open standard has been adopted by leading AI companies including OpenAI, Google, Microsoft, and Cursor, quickly becoming standard in mainstream AI programming tools.

To install Agent Skills, simply place the Skill folder in the appropriate path. You can also use the `npx skills add <owner/repo>` CLI tool from Vercel for quick installation. For parameters, see [npmjs/skills](https://www.npmjs.com/package/skills).

Meanwhile, Vercel has released the companion [skills.sh](https://skills.sh/) Skills marketplace, featuring a comprehensive collection of quality programming Skills.


| Tool               | Project Path        | Global Path                     | Documentation                                                                               |
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

## Conversational Tools

As the Agent Skills standard becomes more widespread, an increasing number of conversational AI tools are starting to support Skill installation and usage. Users can expand the capabilities of assistants/agents by adding Skills to handle more complex tasks.

-   [Coze](https://www.coze.cn/open/docs/cozespace/what_is_skill): Skills Usage Guide
-   [Cherry Studio](https://mp.weixin.qq.com/s/nqBMW9QaTcagohzy2gXaZA): Agent Skills Best Practices
-   [Alma](https://alma.now/docs/zh/features/skills.html): Skills Usage Guide

## Skills Marketplace

[![skillsmp](assets/skillsmp.png)](https://skillsmp.com/zh)

[skillsmp](https://skillsmp.com/zh) is currently the most comprehensive and frequently updated Skills marketplace. It automatically indexes all Skills projects on GitHub and organizes them by category, update time, star count, and other tags.

Other featured Agent Skills marketplaces:

-   [skills.sh](https://skills.sh/): Curated Skills marketplace from Vercel
-   [SkillStore](https://skillstore.io/zh-hans): Chinese marketplace with security-audited Skills
-   [agentskills.me](https://agentskills.me/): Marketplace offering developer revenue sharing
-   [skills.rest](https://skills.rest/): Marketplace with Skill rating system

## Featured Skills

### Skill Creation

-   [anthropics/skill-creator](https://github.com/anthropics/skills/tree/main/skills/skill-creator): Official meta-skill from Anthropic for creating skills, enabling rapid creation of personal custom skills

### Document Processing

-   [docx](https://github.com/anthropics/skills/tree/main/skills/docx): Create, edit, and analyze Word documents with support for revisions, comments, format preservation, and text extraction
-   [pptx](https://github.com/anthropics/skills/tree/main/skills/pptx): Create, edit, and analyze PowerPoint presentations with support for layouts, templates, charts, and automatic slide generation
-   [xlsx](https://github.com/anthropics/skills/tree/main/skills/xlsx): Create, edit, and analyze Excel spreadsheets with support for formulas, formatting, data analysis, and visualization
-   [pdf](https://github.com/anthropics/skills/tree/main/skills/pdf): Comprehensive PDF toolkit for extracting text and tables, creating new PDFs, merging/splitting documents, and handling forms

### Content Creation

-   [JimLiu/baoyu-skills](https://github.com/JimLiu/baoyu-skills): Personal Skills collection from Baoyu, including WeChat Official Account writing, PPT creation, and more
-   [op7418/NanoBanana-PPT-Skills)](https://github.com/op7418/NanoBanana-PPT-Skills): NanoBanana-based PPT generation Skill by Guizang
-   [wshuyi/x-article-publisher-skill](https://github.com/wshuyi/x-article-publisher-skill): Skill for publishing X articles
-   [huangserva/skill-prompt-generator](https://github.com/huangserva/skill-prompt-generator): Generate and optimize text-to-image prompts using Skills

### Programming Assistance

-   [anthropics/skills](https://github.com/anthropics/skills): Official Skills collection from Anthropic
-   [vercel-labs/agent-skills](https://github.com/vercel-labs/agent-skills): Official programming Skills collection from Vercel
-   [obra/superpowers](https://github.com/obra/superpowers/tree/main/skills): Skills collection covering complete programming project workflows
-   [ComposioHQ/awesome-claude-skills](https://github.com/ComposioHQ/awesome-claude-skills): Quality Skills collection for various programming tasks
-   [nextlevelbuilder/ui-ux-pro-max-skill](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill): Skills collection for UI/UX design
-   [OthmanAdi/planning-with-files](https://github.com/OthmanAdi/planning-with-files): Skill for achieving long-term planning with file-based planning

### Product Usage

-   [teng-lin/notebooklm-py](https://github.com/teng-lin/notebooklm-py): Skill for controlling NotebookLM
-   [langgenius/dify](https://github.com/langgenius/dify/tree/main/.claude/skills): Official multi-functional Skills collection from Dify
-   [czlonkowski/n8n-skills](https://github.com/czlonkowski/n8n-skills): Skills collection for creating n8n workflows
-   [kepano/obsidian-skills](https://github.com/kepano/obsidian-skills): Skills collection for enhancing Obsidian functionality
-   [huggingface/skills](https://github.com/huggingface/skills): Use Skills to train large models on HuggingFace

### Other Types

-   [K-Dense-AI/claude-scientific-skills](https://github.com/K-Dense-AI/claude-scientific-skills): Skills collection for scientific researchers

## Supporting Tools

-   [Skill_Seekers](https://github.com/yusufkaraaslan/Skill_Seekers): Automated conversion of documentation sites, GitHub repos, and PDFs into Agent Skills
-   [openskills](https://github.com/numman-ali/openskills): Global Skills loading tool supporting multiple Agent platforms
-   [skild.sh](https://skild.sh/): CLI tool for installing, managing, and syncing Skills across multiple tools
-   [agent-skills-guard](https://github.com/brucevanfdm/agent-skills-guard): Agent Skills visualization management + curated repo + security scanning
-   [skillmaster](https://github.com/davidyangcool/agent-skill): Manage, install, and use Agent Skills via terminal

## Authoritative Resources

Anthropic provides extensive Agent Skills tutorials in their official blog. The following articles are recommended for in-depth understanding of Agent Skills concepts, creation methods, and application scenarios:

-   [Introducing Agent Skills: Improve how it performs specific tasks](https://claude.com/blog/skills)
-   [Skills explained: How Skills compares to prompts, Projects, MCP, and subagents](https://claude.com/blog/skills-explained)
-   [Extending Claude's capabilities with skills and MCP servers](https://claude.com/blog/extending-claude-capabilities-with-skills-mcp-servers)
-   [Equipping agents for the real world with Agent Skills](https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills)
-   [How to create Skills: Key steps, limitations, and examples](https://claude.com/blog/how-to-create-skills-key-steps-limitations-and-examples)
-   [Building Skills for Claude Code: Automating your procedural knowledge](https://claude.com/blog/building-skills-for-claude-code)
-   [Code execution with MCP: Building more efficient agents](https://www.anthropic.com/engineering/code-execution-with-mcp)
-   [Improving frontend design through Skills](https://claude.com/blog/improving-frontend-design-through-skills#real-world-skills-examples)
-   [Don't Build Agents, Build Skills Instead](https://x.com/iamzhihui/status/2005883147305500681/photo/1)

## Acknowledgments

![](assets/talk_is_cheap.jpg)

## Project History

[![Star History Chart](https://api.star-history.com/svg?repos=libukai/awesome-agent-skills&type=date&legend=top-left)](https://www.star-history.com/#libukai/awesome-agent-skills&type=date&legend=top-left)

