# Skill Creation Quick Checklist

Use this checklist before publishing or sharing your skill. Each section corresponds to a critical aspect of skill quality.

## Pre-Flight Checklist

### ✅ File Structure

- [ ] `SKILL.md` file exists with exact capitalization (not `skill.md` or `Skill.md`)
- [ ] Folder name uses kebab-case (e.g., `my-skill-name`, not `My_Skill_Name`)
- [ ] Scripts directory exists if needed: `scripts/`
- [ ] References directory exists if needed: `references/`
- [ ] Assets directory exists if needed: `assets/`

### ✅ YAML Frontmatter

- [ ] `name` field present and uses kebab-case
- [ ] `name` doesn't contain "claude" or "anthropic"
- [ ] `description` field present and under 1024 characters
- [ ] No XML angle brackets (`< >`) in any frontmatter field
- [ ] `compatibility` field included if skill has dependencies (optional)

### ✅ Description Quality

- [ ] Describes what the skill does (1-2 sentences)
- [ ] Specifies when to use it (contexts and scenarios)
- [ ] Includes specific trigger phrases users might say
- [ ] Is "pushy" enough to overcome undertriggering
- [ ] Mentions related concepts that should also trigger the skill

**Formula**: `[What it does] + [When to use] + [Trigger phrases]`

### ✅ Instructions Quality

- [ ] Instructions are specific and actionable (not vague)
- [ ] Explains the "why" behind requirements, not just "what"
- [ ] Includes examples where helpful
- [ ] Defines output formats clearly if applicable
- [ ] Handles error cases and edge conditions
- [ ] Uses imperative form ("Do X", not "You should do X")
- [ ] Avoids excessive use of MUST/NEVER in all caps

### ✅ Progressive Disclosure

- [ ] SKILL.md body is under 500 lines (or has clear hierarchy if longer)
- [ ] Large reference files (>300 lines) include table of contents
- [ ] References are clearly linked from SKILL.md with usage guidance
- [ ] Scripts are in `scripts/` directory and don't need to be read into context
- [ ] Domain-specific variants organized in separate reference files

### ✅ Scripts and Executables

- [ ] All scripts are executable (`chmod +x`)
- [ ] Scripts include shebang line (e.g., `#!/usr/bin/env python3`)
- [ ] Script filenames use snake_case
- [ ] Scripts are documented (what they do, inputs, outputs)
- [ ] Scripts handle errors gracefully
- [ ] No hardcoded sensitive data (API keys, passwords)

### ✅ Security and Safety

- [ ] No malware or exploit code
- [ ] No misleading functionality (does what description says)
- [ ] No unauthorized data collection or exfiltration
- [ ] Destructive operations require confirmation
- [ ] User data privacy respected in examples
- [ ] No hardcoded credentials or secrets

### ✅ Testing and Validation

- [ ] Tested with 3+ realistic user queries
- [ ] Triggers correctly on relevant queries (target: 90%+)
- [ ] Doesn't trigger on irrelevant queries
- [ ] Produces expected outputs consistently
- [ ] Completes workflows efficiently (minimal tool calls)
- [ ] Handles edge cases without breaking

### ✅ Documentation

- [ ] README or comments explain skill's purpose (optional but recommended)
- [ ] Examples show realistic use cases
- [ ] Any platform-specific limitations documented
- [ ] Dependencies clearly stated if any
- [ ] License file included if distributing publicly

---

## Design Principles Checklist

### Progressive Disclosure
- [ ] Metadata (name + description) is concise and always-loaded
- [ ] SKILL.md body contains core instructions
- [ ] Additional details moved to reference files
- [ ] Scripts execute without loading into context

### Composability
- [ ] Doesn't conflict with other common skills
- [ ] Clear boundaries of what skill does/doesn't do
- [ ] Can work alongside other skills when needed

### Portability
- [ ] Works on Claude.ai (or limitations documented)
- [ ] Works on Claude Code (or limitations documented)
- [ ] Works via API (or limitations documented)
- [ ] No platform-specific assumptions unless necessary

---

## Use Case Pattern Checklist

Identify which category your skill falls into and verify relevant criteria:

### Category 1: Document & Asset Creation
- [ ] Templates or style guides embedded or referenced
- [ ] Output format clearly defined
- [ ] Quality criteria specified
- [ ] Examples show expected output structure
- [ ] Consistency mechanisms in place

### Category 2: Workflow Automation
- [ ] Workflow steps clearly sequenced
- [ ] Validation checkpoints included
- [ ] Error handling at each step
- [ ] Iteration and refinement supported
- [ ] Progress indicators for multi-step processes

### Category 3: MCP Enhancement
- [ ] MCP server capabilities documented
- [ ] Workflow patterns for common tasks provided
- [ ] Domain expertise embedded in instructions
- [ ] API errors and rate limits handled
- [ ] Technical outputs translated for users

---

## Quantitative Success Criteria

After testing, verify your skill meets these targets:

### Triggering
- [ ] **90%+ trigger rate** on relevant queries
- [ ] **<10% false positive rate** on irrelevant queries

### Efficiency
- [ ] Completes tasks in reasonable number of tool calls
- [ ] No unnecessary or redundant operations
- [ ] Context usage minimized (SKILL.md <500 lines)

### Reliability
- [ ] **0 API failures** due to skill design
- [ ] Graceful error handling
- [ ] Fallback strategies for common failures

### Performance
- [ ] Token usage tracked and optimized
- [ ] Time to completion acceptable for use case
- [ ] Consistent results across multiple runs

---

## Pre-Publication Final Checks

### Code Review
- [ ] Read through SKILL.md with fresh eyes
- [ ] Check for typos and grammatical errors
- [ ] Verify all file paths are correct
- [ ] Test all example commands actually work

### User Perspective
- [ ] Description makes sense to target audience
- [ ] Instructions are clear without insider knowledge
- [ ] Examples are realistic and helpful
- [ ] Error messages are user-friendly

### Maintenance
- [ ] Version number or date included (optional)
- [ ] Contact info or issue tracker provided (optional)
- [ ] Update plan considered for future changes

---

## Common Pitfalls to Avoid

❌ **Don't:**
- Use vague instructions like "make it good"
- Overuse MUST/NEVER in all caps
- Create overly rigid structures that don't generalize
- Include unnecessary files or bloat
- Hardcode values that should be parameters
- Assume specific directory structures
- Forget to test on realistic queries
- Make description too passive (undertriggering)

✅ **Do:**
- Explain reasoning behind requirements
- Use examples to clarify expectations
- Keep instructions focused and actionable
- Test with real user queries
- Handle errors gracefully
- Make description explicit about when to trigger
- Optimize for the 1000th use, not just the test cases

---

## Skill Quality Tiers

### Tier 1: Functional
- Meets all technical requirements
- Works for basic use cases
- No security issues

### Tier 2: Good
- Clear, well-documented instructions
- Handles edge cases
- Efficient context usage
- Good triggering accuracy

### Tier 3: Excellent
- Explains reasoning, not just rules
- Generalizes beyond test cases
- Optimized for repeated use
- Delightful user experience
- Comprehensive error handling

**Aim for Tier 3.** The difference between a functional skill and an excellent skill is often just thoughtful refinement.

---

## Post-Publication

After publishing:
- [ ] Monitor usage and gather feedback
- [ ] Track common failure modes
- [ ] Iterate based on real-world use
- [ ] Update description if triggering issues arise
- [ ] Refine instructions based on user confusion
- [ ] Add examples for newly discovered use cases

---

## Quick Reference: File Naming

| Item | Convention | Example |
|------|-----------|---------|
| Skill folder | kebab-case | `my-skill-name/` |
| Main file | Exact case | `SKILL.md` |
| Scripts | snake_case | `generate_report.py` |
| References | snake_case | `api_docs.md` |
| Assets | kebab-case | `default-template.docx` |

---

## Quick Reference: Description Formula

```
[What it does] + [When to use] + [Trigger phrases]
```

**Example:**
```yaml
description: Creates consistent UI components following the design system. Use when user wants to build interface elements, needs design tokens, or asks about component styling. Triggers on phrases like "create a button", "design a form", "what's our color palette", or "build a card component".
```

---

## Need Help?

- Review `design_principles.md` for conceptual guidance
- Check `constraints_and_rules.md` for technical requirements
- Read `schemas.md` for eval and benchmark structures
- Use the skill-creator skill itself for guided creation

---

**Remember**: A skill is successful when it works reliably for the 1000th user, not just your test cases. Generalize, explain reasoning, and keep it simple.
