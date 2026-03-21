# Skill Constraints and Rules

This document outlines technical constraints, naming conventions, and security requirements for Claude Skills.

## Table of Contents

1. [Technical Constraints](#technical-constraints)
   - [YAML Frontmatter Restrictions](#yaml-frontmatter-restrictions)
   - [Naming Restrictions](#naming-restrictions)
2. [Naming Conventions](#naming-conventions)
   - [File and Folder Names](#file-and-folder-names)
   - [Script and Reference Files](#script-and-reference-files)
3. [Description Field Structure](#description-field-structure)
   - [Formula](#formula)
   - [Components](#components)
   - [Triggering Behavior](#triggering-behavior)
   - [Real-World Examples](#real-world-examples)
4. [Security and Safety Requirements](#security-and-safety-requirements)
   - [Principle of Lack of Surprise](#principle-of-lack-of-surprise)
   - [Code Execution Safety](#code-execution-safety)
   - [Data Privacy](#data-privacy)
5. [Quantitative Success Criteria](#quantitative-success-criteria)
   - [Triggering Accuracy](#triggering-accuracy)
   - [Efficiency](#efficiency)
   - [Reliability](#reliability)
   - [Performance Metrics](#performance-metrics)
6. [Domain Organization Pattern](#domain-organization-pattern)
7. [Compatibility Field (Optional)](#compatibility-field-optional)
8. [Summary Checklist](#summary-checklist)

---

## Technical Constraints

### YAML Frontmatter Restrictions

**Character Limits:**
- `description` field: **Maximum 1024 characters**
- `name` field: No hard limit, but keep concise (typically <50 characters)

**Forbidden Characters:**
- **XML angle brackets (`< >`) are prohibited** in frontmatter
- This includes the description, name, and any other frontmatter fields
- Reason: Parsing conflicts with XML-based systems

**Example - INCORRECT:**
```yaml
---
name: html-generator
description: Creates <div> and <span> elements for web pages
---
```

**Example - CORRECT:**
```yaml
---
name: html-generator
description: Creates div and span elements for web pages
---
```

### Naming Restrictions

**Prohibited Terms:**
- Cannot use "claude" in skill names (case-insensitive)
- Cannot use "anthropic" in skill names (case-insensitive)
- Reason: Trademark protection and avoiding confusion with official tools

**Examples - INCORRECT:**
- `claude-helper`
- `anthropic-tools`
- `my-claude-skill`

**Examples - CORRECT:**
- `code-helper`
- `ai-tools`
- `my-coding-skill`

---

## Naming Conventions

### File and Folder Names

**SKILL.md File:**
- **Must be named exactly `SKILL.md`** (case-sensitive)
- Not `skill.md`, `Skill.md`, or any other variation
- This is the entry point Claude looks for

**Folder Names:**
- Use **kebab-case** (lowercase with hyphens)
- Avoid spaces, underscores, and uppercase letters
- Keep names descriptive but concise

**Examples:**

✅ **CORRECT:**
```
notion-project-setup/
├── SKILL.md
├── scripts/
└── references/
```

❌ **INCORRECT:**
```
Notion_Project_Setup/    # Uses uppercase and underscores
notion project setup/    # Contains spaces
notionProjectSetup/      # Uses camelCase
```

### Script and Reference Files

**Scripts:**
- Use snake_case: `generate_report.py`, `process_data.sh`
- Make scripts executable: `chmod +x scripts/my_script.py`
- Include shebang line: `#!/usr/bin/env python3`

**Reference Files:**
- Use snake_case: `api_documentation.md`, `style_guide.md`
- Use descriptive names that indicate content
- Group related files in subdirectories when needed

**Assets:**
- Use kebab-case for consistency: `default-template.docx`
- Include file extensions
- Organize by type if you have many assets

---

## Description Field Structure

The description field is the **primary triggering mechanism** for skills. Follow this formula:

### Formula

```
[What it does] + [When to use it] + [Specific trigger phrases]
```

### Components

1. **What it does** (1-2 sentences)
   - Clear, concise explanation of the skill's purpose
   - Focus on outcomes, not implementation details

2. **When to use it** (1-2 sentences)
   - Contexts where this skill should trigger
   - User scenarios and situations

3. **Specific trigger phrases** (1 sentence)
   - Actual phrases users might say
   - Include variations and synonyms
   - Be explicit: "Use when user asks to [specific phrases]"

### Triggering Behavior

**Important**: Claude currently has a tendency to "undertrigger" skills (not use them when they'd be useful). To combat this:

- Make descriptions slightly "pushy"
- Include multiple trigger scenarios
- Be explicit about when to use the skill
- Mention related concepts that should also trigger it

**Example - Too Passive:**
```yaml
description: How to build a simple fast dashboard to display internal Anthropic data.
```

**Example - Better:**
```yaml
description: How to build a simple fast dashboard to display internal Anthropic data. Make sure to use this skill whenever the user mentions dashboards, data visualization, internal metrics, or wants to display any kind of company data, even if they don't explicitly ask for a 'dashboard.'
```

### Real-World Examples

**Good Description (frontend-design):**
```yaml
description: Creates consistent UI components following the design system. Use when user wants to build interface elements, needs design tokens, or asks about component styling. Triggers on phrases like "create a button", "design a form", "what's our color palette", or "build a card component".
```

**Good Description (skill-creator):**
```yaml
description: Create new skills, modify and improve existing skills, and measure skill performance. Use when users want to create a skill from scratch, update or optimize an existing skill, run evals to test a skill, benchmark skill performance with variance analysis, or optimize a skill's description for better triggering accuracy.
```

---

## Security and Safety Requirements

### Principle of Lack of Surprise

Skills must not contain:
- Malware or exploit code
- Content that could compromise system security
- Misleading functionality that differs from the description
- Unauthorized access mechanisms
- Data exfiltration code

**Acceptable:**
- Educational security content (with clear context)
- Roleplay scenarios ("roleplay as XYZ")
- Authorized penetration testing tools (with clear documentation)

**Unacceptable:**
- Hidden backdoors
- Obfuscated malicious code
- Skills that claim to do X but actually do Y
- Credential harvesting
- Unauthorized data collection

### Code Execution Safety

When skills include scripts:
- Document what each script does
- Avoid destructive operations without confirmation
- Validate inputs before processing
- Handle errors gracefully
- Don't execute arbitrary user-provided code without sandboxing

### Data Privacy

- Don't log sensitive information
- Don't transmit data to external services without disclosure
- Respect user privacy in examples and documentation
- Use placeholder data in examples, not real user data

---

## Quantitative Success Criteria

When evaluating skill effectiveness, aim for:

### Triggering Accuracy
- **Target: 90%+ trigger rate** on relevant queries
- Skill should activate when appropriate
- Should NOT activate on irrelevant queries

### Efficiency
- **Complete workflows in X tool calls** (define X for your skill)
- Minimize unnecessary steps
- Avoid redundant operations

### Reliability
- **Target: 0 API call failures** due to skill design
- Handle errors gracefully
- Provide fallback strategies

### Performance Metrics

Track these during testing:
- **Trigger rate**: % of relevant queries that activate the skill
- **False positive rate**: % of irrelevant queries that incorrectly trigger
- **Completion rate**: % of tasks successfully completed
- **Average tool calls**: Mean number of tool invocations per task
- **Token usage**: Context consumption (aim to minimize)
- **Time to completion**: Duration from start to finish

---

## Domain Organization Pattern

When a skill supports multiple domains, frameworks, or platforms:

### Structure

```
skill-name/
├── SKILL.md              # Workflow + selection logic
└── references/
    ├── variant-a.md      # Specific to variant A
    ├── variant-b.md      # Specific to variant B
    └── variant-c.md      # Specific to variant C
```

### SKILL.md Responsibilities

1. Explain the overall workflow
2. Help Claude determine which variant applies
3. Direct Claude to read the appropriate reference file
4. Provide common patterns across all variants

### Reference File Responsibilities

- Variant-specific instructions
- Platform-specific APIs or tools
- Domain-specific best practices
- Examples relevant to that variant

### Example: Cloud Deployment Skill

```
cloud-deploy/
├── SKILL.md              # "Determine cloud provider, then read appropriate guide"
└── references/
    ├── aws.md            # AWS-specific deployment steps
    ├── gcp.md            # Google Cloud-specific steps
    └── azure.md          # Azure-specific steps
```

**SKILL.md excerpt:**
```markdown
## Workflow

1. Identify the target cloud provider from user's request or project context
2. Read the appropriate reference file:
   - AWS: `references/aws.md`
   - Google Cloud: `references/gcp.md`
   - Azure: `references/azure.md`
3. Follow the provider-specific deployment steps
```

This pattern ensures Claude only loads the relevant context, keeping token usage efficient.

---

## Compatibility Field (Optional)

Use the `compatibility` frontmatter field to declare dependencies:

```yaml
---
name: my-skill
description: Does something useful
compatibility:
  required_tools:
    - python3
    - git
  required_mcps:
    - github
  platforms:
    - claude-code
    - claude-api
---
```

This is **optional** and rarely needed, but useful when:
- Skill requires specific tools to be installed
- Skill depends on particular MCP servers
- Skill only works on certain platforms

---

## Summary Checklist

Before publishing a skill, verify:

- [ ] `SKILL.md` file exists (exact capitalization)
- [ ] Folder name uses kebab-case
- [ ] Description is under 1024 characters
- [ ] Description includes trigger phrases
- [ ] No XML angle brackets in frontmatter
- [ ] Name doesn't contain "claude" or "anthropic"
- [ ] Scripts are executable and have shebangs
- [ ] No security concerns or malicious code
- [ ] Large reference files (>300 lines) have table of contents
- [ ] Domain variants organized in separate reference files
- [ ] Tested on representative queries

See `quick_checklist.md` for a complete pre-publication checklist.
