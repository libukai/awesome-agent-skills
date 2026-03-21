---
name: optimize-description
description: Optimize skill description for better triggering accuracy
argument-hint: "[skill-name or path]"
---

# Optimize Skill Description

You are helping the user optimize a skill's description to improve triggering accuracy.

**IMPORTANT**: First invoke `/agent-skills-toolkit:skill-creator-pro` to load the description optimization tools and best practices.

Once skill-creator-pro is loaded, use the `scripts/improve_description.py` script and follow the optimization workflow:

## Quick Optimization Process

1. **Analyze Current Description**
   - Read the skill's description field in SKILL.md
   - Review triggering phrases
   - Check against `references/constraints_and_rules.md` requirements
   - Identify ambiguities

2. **Run Description Improver** (use skill-creator-pro's script)
   - Use `scripts/improve_description.py` for automated optimization
   - The script will test various user prompts
   - It identifies false positives/negatives
   - It suggests improved descriptions

3. **Test Triggering**
   - Try various user prompts
   - Check if skill triggers correctly
   - Note false positives/negatives
   - Test edge cases

4. **Improve Description** (follow skill-creator-pro's guidelines)
   - Make description more specific
   - Add relevant triggering phrases
   - Remove ambiguous language
   - Include key use cases
   - Follow the formula: `[What it does] + [When to use] + [Trigger phrases]`
   - Keep under 1024 characters
   - Avoid XML angle brackets

5. **Optimize Triggering Phrases**
   - Add common user expressions
   - Include domain-specific terms
   - Cover different phrasings
   - Make it slightly "pushy" to combat undertriggering

6. **Validate Changes**
   - Run `scripts/improve_description.py` again
   - Test with sample prompts
   - Verify improved accuracy
   - Iterate as needed

## Available Tools from skill-creator-pro

- `scripts/improve_description.py` - Automated description optimization
- `references/constraints_and_rules.md` - Description requirements
- `references/design_principles.md` - Triggering best practices

## Best Practices (from skill-creator-pro)

- **Be Specific**: Clearly state what the skill does
- **Use Keywords**: Include terms users naturally use
- **Avoid Overlap**: Distinguish from similar skills
- **Cover Variations**: Include different ways to ask
- **Stay Concise**: Keep description focused (under 1024 chars)
- **Be Pushy**: Combat undertriggering with explicit use cases

## Example Improvements

Before:
```
description: Help with coding tasks
```

After:
```
description: Review code for bugs, suggest improvements, and refactor for better performance. Use when users ask to "review my code", "find bugs", "improve this function", or "refactor this class". Make sure to use this skill whenever code quality or optimization is mentioned.
```

## Next Steps

After optimization:
- Run `/agent-skills-toolkit:test-skill` to verify improvements
- Monitor real-world usage patterns
- Continue refining based on feedback
