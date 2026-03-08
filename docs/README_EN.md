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

English | [日本語](README_JA.md) | [简体中文](../README.md)

</div>

This project is dedicated to collecting and sharing the finest Skills tutorials, case studies, and best practices, helping more people easily take their first step in building Agents.

> Follow me on 𝕏 [@libukai](https://x.com/libukai) for the latest news and practical tutorials about Agent Skills!

## Quick Start

Agent Skills is an [open standard](https://agentskills.io/home) maintained by Anthropic, designed to teach AI how to handle specific tasks and workflows.

It is one of the most powerful ways to customize AI for your specific needs. When you need to execute repeatable workflows, you no longer need to explain your preferences, processes, and domain knowledge in every conversation with AI. Skills let you teach the AI once and benefit every time.

Skills work seamlessly with AI's built-in capabilities (such as code execution and document creation). For users building and using MCP, it also provides another powerful layer of functionality — helping AI transform external tool access into reliable, optimized workflows.

This standard has been adopted by leading AI companies including Anthropic, OpenAI, Google, Microsoft, and Cursor, quickly becoming standard in mainstream AI tools.

According to the standard, each Skill is a standardized named folder that combines Markdown documents, executable scripts, and other material files.

![](../assets/media/skills-sketch.png)

## Tutorial Collection

### Official Guide

-   [@Anthropic: Complete Guide to Building Claude Skills (Chinese)](docs/Claude-Skills-完全构建指南.md)

### Graphic Tutorials

-   [@一泽 Eze: Ultimate Guide to Agent Skills: Getting Started, Mastering, and Predictions](https://mp.weixin.qq.com/s/jUylk813LYbKw0sLiIttTQ)
-   [@deeptoai: First Principles Deep Dive into Claude Agent Skills](https://skills.deeptoai.com/zh/docs/ai-ml/claude-agent-skills-first-principles-deep-dive)
-   [@歸藏: Animated PPT Generation Agent! Tutorial & Creative Ideas](https://x.com/op7418/status/2010979152284041401)

### Video Tutorials

-   [@马克的技术工作坊: Agent Skills from Usage to Principles, Explained Once and For All](https://www.youtube.com/watch?v=yDc0_8emz7M)
-   [@白白说大模型: Stop Building Agents, The Future is Skills](https://www.youtube.com/watch?v=xeoWgfkxADI)
-   [@01Coder: Building a High-Quality Intelligent Dev Environment with OpenCode + GLM + Agent Skills](https://www.youtube.com/watch?v=mGzY2bCoVhU)

## Skills Marketplace

[![](../assets/media/skills_sh.png)](https://skills.sh/)

It is recommended to use Vercel's [skills.sh](https://skills.sh/) leaderboard, which provides an intuitive view of the most popular Skills repositories and individual Skill usage.

[![skillsmp](../assets/media/skills_smp.png)](https://skillsmp.com/zh)

Additionally, you can use the [skillsmp](https://skillsmp.com/zh) marketplace, which automatically indexes all Skills projects on GitHub and organizes them by category, update time, star count, and other tags.

## Product Usage

Agent Skills is a cross-platform standard based on the file system, allowing flexible integration into various products.

An increasing number of programming tools and conversational tools are now supporting the Agent Skills standard, with more usage scenarios expected to emerge.

### Programming Tools

To install Agent Skills in programming tools, simply place the Skill folder in the appropriate path.

It is recommended to use Vercel's official `npx skills find <query>` / `npx skills add <owner/repo>` CLI tool for quick discovery and installation. For parameters, see [npmjs/skills](https://www.npmjs.com/package/skills).


| Tool               | Project Path         | Global Path                     | Documentation                                                                               |
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

### Conversational Tools

As the Agent Skills standard becomes more widespread, an increasing number of conversational AI tools are starting to support Skill installation and usage. Users can expand the capabilities of assistants/agents by adding Skills to handle more complex tasks.

-   [Coze/扣子](https://www.coze.cn/open/docs/cozespace/what_is_skill): Coze 2.0 new skill function usage instructions
-   [Cherry Studio](https://mp.weixin.qq.com/s/nqBMW9QaTcagohzy2gXaZA): Best practices for using Skills through Agents in Cherry Studio

## Featured Skills

### Skill Creation

-   [anthropics/skill-creator](https://github.com/anthropics/skills/tree/main/skills/skill-creator): Official meta-skill from Anthropic for creating skills, enabling rapid creation of personal custom skills

### Official Projects

-   [anthropics](https://github.com/anthropics/skills): Skills collection from Anthropic
-   [better-auth](https://github.com/better-auth/skills): Authentication tools Skills collection from Better Auth
-   [black-forest-labs](https://github.com/black-forest-labs/skills): Skills collection for controlling FLUX models from Black Forest Labs
-   [browser-use](https://github.com/browser-use/browser-use/tree/main/skills): Browser automation Skills collection from Browser Use
-   [cloudflare](https://github.com/cloudflare/skills): API integration Skills collection from Cloudflare
-   [clickhouse](https://github.com/ClickHouse/agent-skills): Database query and analytics Skills collection from ClickHouse
-   [expo](https://github.com/expo/skills): React Native Skills collection from Expo
-   [firecrawl](https://github.com/firecrawl/cli): CLI tool Skills from Firecrawl
-   [gemini](https://github.com/google-gemini/gemini-skills): API/SDK Skills collection from Google Gemini
-   [huggingface](https://github.com/huggingface/skills): Skills for training large models from HuggingFace
-   [obsidian](https://github.com/kepano/obsidian-skills): Skills collection for enhancing Obsidian functionality from Obsidian CEO
-   [dify](https://github.com/langgenius/dify/tree/main/.claude/skills): Multi-functional Skills collection from Dify
-   [microsoft](https://github.com/microsoft/agent-skills): Agent Skills collection for Azure services from Microsoft
-   [openai](https://github.com/openai/skills): Official Skills collection from OpenAI
-   [remotion](https://github.com/remotion-dev/skills): Create video content using Remotion
-   [replicates](https://github.com/replicate/skills): AI model invocation Skills collection from Replicate
-   [slidev](https://github.com/slidevjs/slidev/tree/main/skills/slidev): Presentation creation Skills collection from Slidev
-   [stripe](https://github.com/stripe/ai): Financial payment related Skills collection from Stripe
-   [sanity](https://github.com/sanity-io/agent-toolkit/tree/main/skills): Content management platform Skills collection from Sanity
-   [supabase](https://github.com/supabase/agent-skills): PostgreSQL best practices from Supabase
-   [wordpress](https://github.com/WordPress/agent-skills): Content management platform Skills collection from WordPress
-   [vercel](https://github.com/vercel-labs/agent-skills): React/Next.js Skills collection from Vercel


### Content Creation

-   [baoyu-skills](https://github.com/JimLiu/baoyu-skills): Baoyu's personal Skills collection, including WeChat Official Account writing, PPT creation, etc.
-   [op7418)](https://github.com/op7418?tab=repositories): A series of Skills collections by Guizang, including PPT creation, YouTube analysis, etc.
-   [wshuyi](https://github.com/wshuyi/x-article-publisher-skill): Wang Shuyi's Skill for publishing X articles
-   [huangserva](https://github.com/huangserva/skill-prompt-generator): Huangserva's Skill for generating and optimizing AI portrait text-to-image prompts

### Programming Assistance

-   [superpowers](https://github.com/obra/superpowers/tree/main/skills): Skills collection covering complete programming project workflows
-   [ui-ux-pro-max-skill](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill): Skills collection for UI/UX design

### Product Usage

-   [teng-lin/notebooklm-py](https://github.com/teng-lin/notebooklm-py): Skill for controlling NotebookLM
-   [czlonkowski/n8n-skills](https://github.com/czlonkowski/n8n-skills): Skills collection for creating n8n workflows
-   [cloudai-x/threejs-skills](https://github.com/cloudai-x/threejs-skills): Skills collection for Three.js development

### Other Types

-   [coreyhaines31/marketingskills](https://github.com/coreyhaines31/marketingskills): Skills collection for marketing
-   [K-Dense-AI/claude-scientific-skills](https://github.com/K-Dense-AI/claude-scientific-skills): Skills collection for scientific researchers

### Supporting Tools

-   [yusufkaraaslan/Skill_Seekers](https://github.com/yusufkaraaslan/Skill_Seekers): Automated scraping of documentation sites, GitHub repositories, and PDF files for conversion into Agent Skills
-   [context7 cli](https://context7.com/docs/skills#skills): Manage and use Agent Skills with context7 cli command-line tool
-   [openskills](https://github.com/numman-ali/openskills): Global Skills loading tool supporting multiple Agent platforms
-   [skild.sh](https://skild.sh/): CLI tool for installing, managing, and syncing Skills across multiple tools
-   [agent-skills-guard](https://github.com/brucevanfdm/agent-skills-guard): Agent Skills visualization management + curated repo + security scanning
-   [agentskill.sh](https://agentskill.sh): Browse and install 69,000+ AI agent skills for Claude Code, Cursor, Copilot, Windsurf, Zed, and 20+ AI tools

## Enhanced Plugin

This project builds upon the official skill-creator plugin by incorporating best practices from the [Complete Guide to Building Claude Skills](docs/Claude-Skills-完全构建指南.md), creating a Pro version Plugin to help you quickly create and improve Agent Skills.

### Add Marketplace
```bash
/plugin marketplace add likai/awesome-agent-skills
```

### Install Plugin

Select and install the `agent-skills-toolkit` plugin. Once installed, you can use it in conversations.

![](../assets/media/skill-creator-pro.png)

### Quick Commands

The plugin includes an enhanced skill-creator-pro skill and corresponding command shortcuts:

- `/agent-skills-toolkit:skill-creator-pro` - Complete workflow (Enhanced)
- `/agent-skills-toolkit:create-skill` - Create new skill
- `/agent-skills-toolkit:improve-skill` - Improve existing skill
- `/agent-skills-toolkit:test-skill` - Test and evaluate skill
- `/agent-skills-toolkit:optimize-description` - Optimize description

## Acknowledgments

![](../assets/media/talk_is_cheap.jpg)

## Project History

[![Star History Chart](https://api.star-history.com/svg?repos=libukai/awesome-agent-skills&type=date&legend=top-left)](https://www.star-history.com/#libukai/awesome-agent-skills&type=date&legend=top-left)

