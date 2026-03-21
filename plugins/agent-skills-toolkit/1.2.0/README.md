# Agent Skills Toolkit

A comprehensive toolkit for creating, improving, and testing high-quality Agent Skills for Claude Code.

## Overview

Agent Skills Toolkit is an enhanced plugin based on Anthropic's official skill-creator, featuring:

- 🎯 **skill-creator-pro**: Enhanced version of the official skill creator with additional features
- ⚡ **Quick Commands**: 4 focused commands for specific workflows
- 📚 **Comprehensive Tools**: Scripts, references, and evaluation frameworks
- 🌏 **Optimized Documentation**: Clear guidance for skill development

## Installation

### From Marketplace

Add the marketplace to Claude Code:

```bash
/plugin marketplace add likai/awesome-agentskills
```

Then install the plugin through the `/plugin` UI or:

```bash
/plugin install agent-skills-toolkit
```

### From Local Directory

```bash
/plugin install /path/to/awesome-agentskills/plugins/agent-skills-toolkit
```

## Quick Start

### Using Commands (Recommended for Quick Tasks)

**Create a new skill:**
```bash
/agent-skills-toolkit:create-skill my-skill-name
```

**Improve an existing skill:**
```bash
/agent-skills-toolkit:improve-skill path/to/skill
```

**Test a skill:**
```bash
/agent-skills-toolkit:test-skill my-skill
```

**Optimize skill description:**
```bash
/agent-skills-toolkit:optimize-description my-skill
```

**Check plugin integration:**
```bash
/agent-skills-toolkit:check-integration path/to/skill
```

### Using the Full Skill (Recommended for Complex Workflows)

For complete skill creation with all features:

```bash
/agent-skills-toolkit:skill-creator-pro
```

This loads the full context including:
- Design principles and best practices
- Validation scripts and tools
- Evaluation framework
- Reference documentation

## Features

### skill-creator-pro

The core skill provides:

- **Progressive Disclosure**: Organized references loaded as needed
- **Automation Scripts**: Python tools for validation, testing, and reporting
- **Evaluation Framework**: Qualitative and quantitative assessment tools
- **Subagents**: Specialized agents for grading, analysis, and comparison
- **Best Practices**: Comprehensive guidelines for skill development
- **Plugin Integration Check**: Automatic verification of Command-Agent-Skill architecture

### plugin-integration-checker

New skill that automatically checks plugin integration:

- **Automatic Detection**: Runs when skill is part of a plugin
- **Three-Layer Verification**: Ensures Command → Agent → Skill pattern
- **Architecture Scoring**: Rates integration quality (0.0-1.0)
- **Actionable Recommendations**: Specific fixes with examples
- **Documentation Generation**: Creates integration reports

### Quick Commands

Each command focuses on a specific task while leveraging skill-creator-pro's capabilities:

| Command | Purpose | When to Use |
|---------|---------|-------------|
| `create-skill` | Create new skill from scratch | Starting a new skill |
| `improve-skill` | Enhance existing skill | Refining or updating |
| `test-skill` | Run evaluations and benchmarks | Validating functionality |
| `optimize-description` | Improve triggering accuracy | Fine-tuning skill activation |
| `check-integration` | Verify plugin architecture | After creating plugin skills |

## What's Enhanced in Pro Version

Compared to the official skill-creator:

- ✨ **Quick Commands**: Fast access to specific workflows
- 📝 **Better Documentation**: Clearer instructions and examples
- 🎯 **Focused Workflows**: Streamlined processes for common tasks
- 🌏 **Multilingual Support**: Documentation in multiple languages
- 🔍 **Plugin Integration Check**: Automatic architecture verification

## Resources

### Bundled References

- `references/design_principles.md` - Core design patterns
- `references/constraints_and_rules.md` - Technical requirements
- `references/quick_checklist.md` - Pre-publication validation
- `references/schemas.md` - Skill schema reference
- `PLUGIN_ARCHITECTURE.md` - Three-layer architecture guide for plugins

### Automation Scripts

- `scripts/quick_validate.py` - Fast validation
- `scripts/run_eval.py` - Run evaluations
- `scripts/improve_description.py` - Optimize descriptions
- `scripts/generate_report.py` - Create reports
- And more...

### Evaluation Tools

- `eval-viewer/generate_review.py` - Visualize test results
- `agents/grader.md` - Automated grading
- `agents/analyzer.md` - Performance analysis
- `agents/comparator.md` - Compare versions

## Workflow Examples

### Creating a New Skill

1. Run `/agent-skills-toolkit:create-skill`
2. Answer questions about intent and functionality
3. Review generated SKILL.md
4. **Automatic plugin integration check** (if skill is in a plugin)
5. Test with sample prompts
6. Iterate based on feedback

### Creating a Plugin Skill

When creating a skill that's part of a plugin:

1. Create the skill in `plugins/my-plugin/skills/my-skill/`
2. **Integration check runs automatically**:
   - Detects plugin context
   - Checks for related commands and agents
   - Verifies three-layer architecture
   - Generates integration report
3. Review integration recommendations
4. Create/fix commands and agents if needed
5. Test the complete workflow

**Example Integration Check Output:**
```
🔍 Found plugin: my-plugin v1.0.0

📋 Checking commands...
Found: commands/do-task.md

🤖 Checking agents...
Found: agents/task-executor.md

✅ Architecture Analysis
- Command orchestrates workflow ✅
- Agent executes autonomously ✅
- Skill documents knowledge ✅

Integration Score: 0.9 (Excellent)
```

### Improving an Existing Skill

1. Run `/agent-skills-toolkit:improve-skill path/to/skill`
2. Review current implementation
3. Get improvement suggestions
4. Apply changes
5. Validate with tests

### Testing and Evaluation

1. Run `/agent-skills-toolkit:test-skill my-skill`
2. Review qualitative results
3. Check quantitative metrics
4. Generate comprehensive report
5. Identify areas for improvement

## Best Practices

- **Start Simple**: Begin with core functionality, add complexity later
- **Test Early**: Create test cases before full implementation
- **Iterate Often**: Refine based on real usage feedback
- **Follow Guidelines**: Use bundled references for best practices
- **Optimize Descriptions**: Make skills easy to trigger correctly
- **Check Plugin Integration**: Ensure proper Command-Agent-Skill architecture
- **Separate Concerns**: Commands orchestrate, Agents execute, Skills document

## Support

- **Issues**: Report at [GitHub Issues](https://github.com/likai/awesome-agentskills/issues)
- **Documentation**: See main [README](../../README.md)
- **Examples**: Check official Anthropic skills for inspiration

## License

Apache 2.0 - Based on Anthropic's official skill-creator

## Version

1.0.0
