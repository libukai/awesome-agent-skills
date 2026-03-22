---
name: improve-skill
description: Improve and optimize an existing Agent Skill, including content, workflow, and description triggering accuracy
argument-hint: "[skill-name or path]"
---

# Improve Existing Skill

You are helping the user improve an existing Agent Skill. This covers both content improvements (workflow, instructions, examples) and description optimization (triggering accuracy).

**IMPORTANT**: First invoke `/agent-skills-toolkit:skill-creator-pro` to load the complete skill improvement context, including evaluation tools and best practices.

Once skill-creator-pro is loaded, focus on the **iterative improvement** workflow:

## Quick Improvement Process

1. **Identify the Skill**
   - Ask which skill to improve (or if the user only wants to optimize the description, jump to step 5)
   - Read the current SKILL.md file
   - Understand current functionality

2. **Analyze Issues** (use skill-creator-pro's evaluation framework)
   - Review test results if available
   - Check against `references/quick_checklist.md`
   - Identify pain points or limitations
   - Use `scripts/quick_validate.py` for validation

3. **Propose Improvements** (follow skill-creator-pro's principles)
   - Reference `references/content-patterns.md` — does the skill use the right content pattern?
   - Reference `references/design_principles.md` for the 5 design principles
   - Reference `references/patterns.md` — is config.json, gotchas, script reuse needed?
   - Check `references/constraints_and_rules.md` for compliance
   - Suggest specific enhancements
   - Prioritize based on impact

4. **Implement Changes**
   - Update the SKILL.md file
   - Refine description and workflow
   - Add or update examples
   - Follow progressive disclosure principles

5. **Validate Changes**
   - Run `scripts/quick_validate.py` if available
   - Run test cases
   - Compare before/after performance

6. **Optimize Description** (follow skill-creator-pro's Phase 6)
   - If the skill isn't triggering correctly, or after content improvements are done, run description optimization
   - Follow the formula: `[What it does] + [When to use] + [Trigger phrases]`
   - Keep under 1024 characters, no XML angle brackets
   - Use `scripts/run_loop.py` for automated optimization

## Available Resources from skill-creator-pro

- `references/content-patterns.md` - 5 content structure patterns (Tool Wrapper, Generator, Reviewer, Inversion, Pipeline)
- `references/design_principles.md` - 5 design principles
- `references/patterns.md` - Implementation patterns (config.json, gotchas, script reuse, etc.)
- `references/constraints_and_rules.md` - Technical constraints
- `references/quick_checklist.md` - Validation checklist
- `scripts/quick_validate.py` - Validation script
- `scripts/run_loop.py` - Description optimization loop

## Common Improvements

- Clarify triggering phrases (check description field)
- Add more detailed instructions
- Include better examples
- Improve error handling
- Optimize workflow steps
- Enhance progressive disclosure

## Next Steps

After improving the skill:
- Run `/agent-skills-toolkit:test-skill` to validate changes
