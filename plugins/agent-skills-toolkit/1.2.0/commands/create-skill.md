---
name: create-skill
description: Create a new Agent Skill from scratch with guided workflow
argument-hint: "[optional: skill-name]"
---

# Create New Skill

You are helping the user create a new Agent Skill from scratch.

**IMPORTANT**: First invoke `/agent-skills-toolkit:skill-creator-pro` to load the complete skill creation context, including all references, scripts, and best practices.

Once skill-creator-pro is loaded, focus specifically on the **Creating a skill** section and follow this streamlined workflow:

## Quick Start Process

1. **Capture Intent** (from skill-creator-pro context)
   - What should this skill enable Claude to do?
   - When should this skill trigger?
   - What's the expected output format?
   - Should we set up test cases?

2. **Interview and Research** (use skill-creator-pro's guidance)
   - Ask about edge cases, input/output formats
   - Check available MCPs if useful
   - Review `references/content-patterns.md` for content structure patterns
   - Review `references/design_principles.md` for design principles

3. **Write the SKILL.md** (follow skill-creator-pro's templates)
   - Use the anatomy and structure from skill-creator-pro
   - Apply the chosen content pattern from `references/content-patterns.md`
   - Check `references/patterns.md` for implementation patterns (config.json, gotchas, etc.)
   - Reference `references/constraints_and_rules.md` for naming

4. **Create Test Cases** (if applicable)
   - Generate 3-5 test prompts
   - Cover different use cases

5. **Run Initial Tests**
   - Execute test prompts
   - Gather feedback

## Available Resources from skill-creator-pro

- `references/content-patterns.md` - 5 content structure patterns (Tool Wrapper, Generator, Reviewer, Inversion, Pipeline)
- `references/design_principles.md` - 5 design principles
- `references/patterns.md` - Implementation patterns (config.json, gotchas, script reuse, etc.)
- `references/constraints_and_rules.md` - Technical constraints
- `references/quick_checklist.md` - Pre-publication checklist
- `references/schemas.md` - Skill schema reference
- `scripts/quick_validate.py` - Validation script

## Next Steps

After creating the skill:
- Run `/agent-skills-toolkit:test-skill` to evaluate performance
- Run `/agent-skills-toolkit:optimize-description` to improve triggering

