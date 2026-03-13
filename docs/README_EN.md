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

This project is dedicated to following the principle of quality over quantity, collecting and sharing the finest Skills tutorials, case studies, and best practices, helping more people easily take their first step in building Agents.

> Follow me on 𝕏 [@libukai](https://x.com/libukai) and 💬 WeChat Official Account [@李不凯正在研究](https://mp.weixin.qq.com/s/uer7HvD2Z9ZbJSPEZWHKRA?scene=0&subscene=90) for the latest Skills resources and practical tutorials!

## Basic Introduction

Skill is a lightweight universal open standard that extends AI's specific capabilities by packaging professional knowledge and workflows.

When you need to execute repeatable tasks, you no longer need to repeatedly provide your processes, knowledge, and preferences in every conversation with AI. Simply convert the relevant content into a Skill, and AI can learn the related skills on its own.

After half a year of development and iteration, the Skill standard has been widely supported by various AI products and has become the standard solution for enhancing personalized AI capabilities in Claude Code-like ecosystems and OpenClaw-like ecosystems.

## Standard Structure

According to the standard definition, each Skill is a standardized named folder that combines instructions, scripts, and resources. AI progressively imports these contents in context to understand and learn related skills.

```markdown
my-skill/
├── SKILL.md          # Required: description and metadata
├── scripts/          # Optional: executable code
├── references/       # Optional: documentation references
└── assets/           # Optional: templates, resources
```

## Quick Installation

### Claude Code Ecosystem

![](../assets/media/skills_mp.png)

It is recommended to use the [skillsmp](https://skillsmp.com/zh) marketplace, which automatically indexes all Skills projects on GitHub and organizes them by category, update time, star count, and other tags.

You can also use Vercel's [skills.sh](https://skills.sh/) leaderboard to intuitively view the most popular Skills repositories and individual Skill usage.

For specific skills, use the `npx skills` command-line tool to quickly discover, add, and manage skills. For detailed parameters, see [vercel-labs/skills](https://github.com/vercel-labs/skills).

```bash
npx skills find [query] # Search for related skills
npx skills add <owner/repo> # Add skills from specified git or local path
npx skills list # List installed skills
npx skills update # Upgrade skills
npx skills remove [skill-name] # Uninstall skills
```

### OpenClaw Ecosystem

![](../assets/media/clawhub.png)

If you have access to international networks and use the official OpenClaw version, it is recommended to use the official [ClawHub](https://clawhub.com/) marketplace, which provides more technical-oriented skills and includes integration with many overseas products.

```bash
npx clawhub search "postgres backups"  # Search for related skills
npx clawhub install <skill-name> # Install skill by name
npx clawhub update --all # Upgrade skills
npx clawhub update --all --no-input --force # Force upgrade skills
```

![](../assets/media/skillshub.png)

For users primarily in Chinese network environments or using customized versions of OpenClaw in China, it is recommended to use Tencent's [SkillHub](https://skillhub.tencent.com/) marketplace, which provides many skills more suitable for Chinese users' needs.

First, you need to install the Skill Hub CLI tool, which can be installed with the following command:

```bash
curl -fsSL https://skillhub-1251783334.cos.ap-guangzhou.myqcloud.com/install/install.sh | bash
```

After installation, you can use the following commands to install and manage skills:

```bash
skillhub search [query] # Search for related skills
skillhub install <skill-name> # Add skills using skill name
skillhub list # List installed skills
skillhub upgrade # Upgrade installed skills
```

## Skill Creation

Although you can directly install and use skills created by others through skill marketplaces, it is recommended to create your own skills or fine-tune others' skills based on your needs to improve adaptability and personalization.

Here are some quality skill creation resources to help you quickly get started with skill creation.

### Official Tutorial

-   @Anthropic: [Complete Guide to Building Claude Skills (Chinese)](../docs/Claude-Skills-完全构建指南.md)

### Skill Creation

-   [skill-creator](https://github.com/anthropics/skills/tree/main/skills/skill-creator): Official meta-skill from Anthropic for creating and optimizing skills, enabling rapid creation and iteration of personal custom skills.

## Quality Tutorials

### Graphic Tutorials

-   [@一泽 Eze: Ultimate Guide to Agent Skills: Getting Started, Mastering, and Predictions](https://mp.weixin.qq.com/s/jUylk813LYbKw0sLiIttTQ)
-   [@deeptoai: First Principles Deep Dive into Claude Agent Skills](https://skills.deeptoai.com/zh/docs/ai-ml/claude-agent-skills-first-principles-deep-dive)
-   [@歸藏: Animated PPT Generation Agent! Tutorial & Creative Ideas](https://x.com/op7418/status/2010979152284041401)

### Video Tutorials

-   [@马克的技术工作坊: Agent Skills from Usage to Principles, Explained Once and For All](https://www.youtube.com/watch?v=yDc0_8emz7M)
-   [@白白说大模型: Stop Building Agents, The Future is Skills](https://www.youtube.com/watch?v=xeoWgfkxADI)
-   [@01Coder: Building a High-Quality Intelligent Dev Environment with OpenCode + GLM + Agent Skills](https://www.youtube.com/watch?v=mGzY2bCoVhU)

## Featured Skills

### Skill Creation

-   [anthropics/skill-creator](https://github.com/anthropics/skills/tree/main/skills/skill-creator): Official meta-skill from Anthropic for creating skills, enabling rapid creation of personal custom skills

### Official Projects

-   [agent-browser](https://github.com/vercel-labs/agent-browser/tree/main/skills): Skills collection for controlling browsers and applications from Vercel
-   [anthropics](https://github.com/anthropics/skills): Official example Skills collection from Anthropic
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
-   [openclaw](https://github.com/openclaw/openclaw/tree/main/skills): Official Skills collection from OpenClaw
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
-   [libukai](https://github.com/libukai/awesome-agent-skills/tree/main/skills): Libukai's Obsidian-related tool Skills
-   [op7418](https://github.com/op7418): A series of Skills collections by Guizang, including PPT creation, YouTube analysis, etc.
-   [cclank](https://github.com/cclank/news-aggregator-skill): News aggregator Skill by cclank that automatically fetches and summarizes the latest information in specified fields
-   [huangserva](https://github.com/huangserva/skill-prompt-generator): Skill by huangserva for generating and optimizing AI portrait text-to-image prompts

### Programming Assistance

-   [superpowers](https://github.com/obra/superpowers/tree/main/skills): Skills collection covering complete programming project workflows
-   [ui-ux-pro-max-skill](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill): Skills collection for UI/UX design

### Product Usage

-   [teng-lin/notebooklm-py](https://github.com/teng-lin/notebooklm-py): Skill for controlling NotebookLM
-   [czlonkowski/n8n-skills](https://github.com/czlonkowski/n8n-skills): Skills collection for creating n8n workflows
-   [cloudai-x/threejs-skills](https://github.com/cloudai-x/threejs-skills): Skills collection for Three.js development
-   [Xquik-dev/tweetclaw](https://github.com/Xquik-dev/tweetclaw): X/Twitter automation plugin — post, reply, like, retweet, follow, DM & more (40+ endpoints via Xquik)

### Other Types

-   [coreyhaines31/marketingskills](https://github.com/coreyhaines31/marketingskills): Skills collection for marketing
-   [K-Dense-AI/claude-scientific-skills](https://github.com/K-Dense-AI/claude-scientific-skills): Skills collection for scientific researchers


## Enhanced Plugin

This project builds upon the official skill-creator plugin by incorporating best practices from the [Complete Guide to Building Claude Skills](../docs/Claude-Skills-完全构建指南.md), creating a more powerful Agent Skills Toolkit to help you quickly create and improve Agent Skills.

**Note: This plugin currently only supports Claude Code**

### Add Marketplace

Launch Claude Code, enter the plugin marketplace, and add the `libukai/awesome-agent-skills` marketplace. You can also directly use the following command in the input box to add the marketplace:

```bash
/plugin marketplace add libukai/awesome-agent-skills
```

### Install Plugin

After successfully installing the marketplace, select and install the `agent-skills-toolkit` plugin.

![](../assets/media/skill-creator-pro.png)

### Quick Commands

The plugin includes multiple quick commands covering the complete workflow from creation, improvement, testing to optimizing skill descriptions:

- `/agent-skills-toolkit:skill-creator-pro` - Complete workflow (Enhanced)
- `/agent-skills-toolkit:create-skill` - Create new skill
- `/agent-skills-toolkit:improve-skill` - Improve existing skill
- `/agent-skills-toolkit:test-skill` - Test and evaluate skill
- `/agent-skills-toolkit:optimize-description` - Optimize description

## Acknowledgments

![](../assets/media/talk_is_cheap.jpg)

## Project History

[![Star History Chart](https://api.star-history.com/svg?repos=libukai/awesome-agent-skills&type=date&legend=top-left)](https://www.star-history.com/#libukai/awesome-agent-skills&type=date&legend=top-left)

