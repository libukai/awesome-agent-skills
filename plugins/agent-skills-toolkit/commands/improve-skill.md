---
name: improve-skill
description: Improve and optimize an existing Agent Skill
argument-hint: "[skill-name or path]"
---

# Improve Existing Skill

You are helping the user improve an existing Agent Skill.

**IMPORTANT**: First invoke `/agent-skills-toolkit:skill-creator-pro` to load the complete skill improvement context, including evaluation tools and best practices.

Once skill-creator-pro is loaded, focus on the **iterative improvement** workflow:

## Quick Improvement Process

1. **Identify the Skill**
   - Ask which skill to improve
   - Read the current SKILL.md file
   - Understand current functionality

2. **Analyze Issues** (use skill-creator-pro's evaluation framework)
   - Review test results if available
   - Check against `references/quick_checklist.md`
   - Identify pain points or limitations
   - Use `scripts/quick_validate.py` for validation

3. **Propose Improvements** (follow skill-creator-pro's principles)
   - Reference `references/design_principles.md` for patterns
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

## Available Resources from skill-creator-pro

- `references/design_principles.md` - Design patterns
- `references/constraints_and_rules.md` - Technical constraints
- `references/quick_checklist.md` - Validation checklist
- `scripts/quick_validate.py` - Validation script
- `scripts/generate_report.py` - Report generation

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
- Run `/agent-skills-toolkit:optimize-description` if needed
