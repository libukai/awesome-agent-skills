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

This standard has been adopted by leading AI companies including Anthropic, OpenAI, Google, Microsoft, and Cursor, quickly becoming standard in mainstream AI tools.

According to the standard, each Skill is a standardized named folder that combines Markdown documents, executable scripts, and other material files.

![](assets/skills-sketch.png)

## Tutorial Collection

### Graphic Tutorials

-   [@一泽 Eze: Ultimate Guide to Agent Skills: Getting Started, Mastering, and Predictions](https://mp.weixin.qq.com/s/jUylk813LYbKw0sLiIttTQ)
-   [@deeptoai: First Principles Deep Dive into Claude Agent Skills](https://skills.deeptoai.com/zh/docs/ai-ml/claude-agent-skills-first-principles-deep-dive)
-   [@歸藏: Animated PPT Generation Agent! Tutorial & Creative Ideas](https://x.com/op7418/status/2010979152284041401)

### Video Tutorials

-   [@马克的技术工作坊: Agent Skills from Usage to Principles, Explained Once and For All](https://www.youtube.com/watch?v=yDc0_8emz7M)
-   [@白白说大模型: Stop Building Agents, The Future is Skills](https://www.youtube.com/watch?v=xeoWgfkxADI)
-   [@01Coder: Building a High-Quality Intelligent Dev Environment with OpenCode + GLM + Agent Skills](https://www.youtube.com/watch?v=mGzY2bCoVhU)

## Skills Marketplace

[![skillsmp](assets/skillsmp.png)](https://skillsmp.com/zh)

It is recommended to use Vercel's [skills.sh](https://skills.sh/) leaderboard, which provides an intuitive view of the most popular Skills repositories and individual Skill usage.

Additionally, you can use the [skillsmp](https://skillsmp.com/zh) marketplace, which automatically indexes all Skills projects on GitHub and organizes them by category, update time, star count, and other tags.

Other featured Agent Skills marketplaces:

-   [context7](https://context7.com/?tab=skills): Skill marketplace based on Context7
-   [skillstore.io](https://skillstore.io/zh-hans): Chinese marketplace with security-audited Skills
-   [agentskills.me](https://agentskills.me/): Marketplace offering cloud-based Skill runtime environments
-   [skills.rest](https://skills.rest/): Marketplace providing Skill analysis and security reviews

## Product Usage

Agent Skills is a cross-platform standard based on the file system, allowing flexible integration into various products.

An increasing number of programming tools and conversational tools are now supporting the Agent Skills standard, with more usage scenarios expected to emerge.

### Programming Tools

To install Agent Skills in programming tools, simply place the Skill folder in the appropriate path.

It is recommended to use Vercel's official `npx skills add <owner/repo>` CLI tool for quick installation. For parameters, see [npmjs/skills](https://www.npmjs.com/package/skills).


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
-   [yusufkaraaslan/Skill_Seekers](https://github.com/yusufkaraaslan/Skill_Seekers): Automated conversion of documentation sites, GitHub repos, and PDFs into Agent Skills

### Document Processing

-   [docx](https://github.com/anthropics/skills/tree/main/skills/docx): Skill for creating and editing Word documents
-   [pptx](https://github.com/anthropics/skills/tree/main/skills/pptx): Skill for creating and editing PowerPoint presentations
-   [xlsx](https://github.com/anthropics/skills/tree/main/skills/xlsx): Skill for creating and editing Excel spreadsheets
-   [pdf](https://github.com/anthropics/skills/tree/main/skills/pdf): Skill for creating and editing PDFs

### Official Projects

-   [anthropics/skills](https://github.com/anthropics/skills): Skills collection from Anthropic
-   [better-auth/skills](https://github.com/better-auth/skills): Authentication tools Skills collection from Better Auth
-   [black-forest-labs/skills](https://github.com/black-forest-labs/skills): Skills collection for controlling FLUX models from Black Forest Labs
-   [expo/skills](https://github.com/expo/skills): React Native Skills collection from Expo
-   [huggingface/skills](https://github.com/huggingface/skills): Skills for training large models from HuggingFace
-   [kepano/obsidian-skills](https://github.com/kepano/obsidian-skills): Skills collection for enhancing Obsidian functionality from Obsidian CEO
-   [langgenius/dify](https://github.com/langgenius/dify/tree/main/.claude/skills): Multi-functional Skills collection from Dify
-   [microsoft/agent-skills](https://github.com/microsoft/agent-skills): Agent Skills collection for Azure services from Microsoft
-   [remotion-dev/skills](https://github.com/remotion-dev/skills): Create video content using Remotion
-   [google-labs-code/stitch-skills](https://github.com/google-labs-code/stitch-skills): Stitch Skills collection from Google Labs
-   [stripe/ai](https://github.com/stripe/ai): Financial payment related Skills collection from Stripe
-   [sanity-io/agent-toolkit](https://github.com/sanity-io/agent-toolkit/tree/main/skills): Content management platform Skills collection from Sanity
-   [supabase/agent-skills](https://github.com/supabase/agent-skills): PostgreSQL best practices from Supabase
-   [vercel-labs/agent-skills](https://github.com/vercel-labs/agent-skills): React Skills collection from Vercel


### Content Creation

-   [JimLiu/baoyu-skills](https://github.com/JimLiu/baoyu-skills): Baoyu's personal Skills collection, including WeChat Official Account writing, PPT creation, etc.
-   [github.com/op7418)](https://github.com/op7418?tab=repositories): A series of Skills collections by Guizang, including PPT creation, YouTube analysis, etc.
-   [wshuyi/x-article-publisher-skill](https://github.com/wshuyi/x-article-publisher-skill): Wang Shuyi's Skill for publishing X articles
-   [huangserva/skill-prompt-generator](https://github.com/huangserva/skill-prompt-generator): Huangserva's Skill for generating and optimizing AI portrait text-to-image prompts

### Programming Assistance

-   [obra/superpowers](https://github.com/obra/superpowers/tree/main/skills): Skills collection covering complete programming project workflows
-   [ComposioHQ/awesome-claude-skills](https://github.com/ComposioHQ/awesome-claude-skills): Quality Skills collection covering multiple programming tasks
-   [nextlevelbuilder/ui-ux-pro-max-skill](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill): Skills collection for UI/UX design
-   [OthmanAdi/planning-with-files](https://github.com/OthmanAdi/planning-with-files): Skill for achieving long-term Plan effects using file planning
-   [hyf0/vue-skills](https://github.com/hyf0/vue-skills): Skills collection for Vue.js development

### Product Usage

-   [teng-lin/notebooklm-py](https://github.com/teng-lin/notebooklm-py): Skill for controlling NotebookLM
-   [czlonkowski/n8n-skills](https://github.com/czlonkowski/n8n-skills): Skills collection for creating n8n workflows
-   [cloudai-x/threejs-skills](https://github.com/cloudai-x/threejs-skills): Skills collection for Three.js development

### Other Types

-   [coreyhaines31/marketingskills](https://github.com/coreyhaines31/marketingskills): Skills collection for marketing
-   [K-Dense-AI/claude-scientific-skills](https://github.com/K-Dense-AI/claude-scientific-skills): Skills collection for scientific researchers

## Supporting Tools

-   [context7 cli](https://context7.com/docs/skills#skills): Manage and use Agent Skills with context7 cli command-line tool
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

