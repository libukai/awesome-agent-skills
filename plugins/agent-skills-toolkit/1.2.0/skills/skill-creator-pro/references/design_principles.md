# Skill Design Principles

This document outlines the core design principles for creating effective Claude Skills. Skills apply to any domain — engineering, content creation, research, personal productivity, and beyond.

## Five Core Design Principles

### 1. Progressive Disclosure

Skills use a three-level loading system to manage context efficiently:

**Level 1: Metadata (Always in Context)**
- Name + description (~100 words)
- Always loaded, visible to Claude
- Primary triggering mechanism

**Level 2: SKILL.md Body (Loaded When Triggered)**
- Main instructions and workflow
- Ideal: <500 lines
- Loaded when skill is invoked

**Level 3: Bundled Resources (Loaded As Needed)**
- Scripts execute without loading into context
- Reference files loaded only when explicitly needed
- Unlimited size potential

**Key Implementation Patterns:**
- Keep SKILL.md under 500 lines; if approaching this limit, add hierarchy with clear navigation pointers
- Reference files clearly from SKILL.md with guidance on when to read them
- For large reference files (>300 lines), include a table of contents
- Scripts in `scripts/` directory don't consume context when executed

### 2. Composability

Skills should work harmoniously with other skills and tools:

- **Avoid conflicts**: Don't override or duplicate functionality from other skills
- **Clear boundaries**: Define what your skill does and doesn't do
- **Interoperability**: Design workflows that can incorporate other skills when needed
- **Modular design**: Break complex capabilities into focused, reusable components

**Example**: A `frontend-design` skill might reference a `color-palette` skill rather than reimplementing color theory.

### 3. Portability

Skills should work consistently across different Claude platforms:

- **Claude.ai**: Web interface with Projects
- **Claude Code**: CLI tool with full filesystem access
- **API integrations**: Programmatic access

**Design for portability:**
- Avoid platform-specific assumptions
- Use conditional instructions when platform differences matter
- Test across environments if possible
- Document any platform-specific limitations in frontmatter

---

### 4. Don't Over-constrain

Skills work best when they give Claude knowledge and intent, not rigid scripts. Claude is smart — explain the *why* behind requirements and let it adapt to the specific situation.

- Prefer explaining reasoning over stacking MUST/NEVER
- Avoid overly specific instructions unless the format is a hard requirement
- If you find yourself writing many ALWAYS/NEVER, stop and ask: can I explain the reason instead?
- Give Claude the information it needs, but leave room for it to handle edge cases intelligently

**Example**: Instead of "ALWAYS output exactly 3 bullet points", write "Use bullet points to keep the output scannable — 3 is usually right, but adjust based on content complexity."

### 5. Accumulate from Usage

Good skills aren't written once — they grow. Every time Claude hits an edge case or makes a recurring mistake, update the skill. The Gotchas section is the highest-information-density part of any skill.

- Every skill should have a `## Gotchas` or `## Common Pitfalls` section
- Append to it whenever Claude makes a repeatable mistake
- Treat the skill as a living document, not a one-time deliverable
- The best gotchas come from real usage, not speculation

---

## Cross-Cutting Concerns

Regardless of domain or pattern, all skills should:

- **Be specific and actionable**: Vague instructions lead to inconsistent results
- **Include error handling**: Anticipate what can go wrong
- **Provide examples**: Show, don't just tell
- **Explain the why**: Help Claude understand reasoning, not just rules
- **Stay focused**: One skill, one clear purpose
- **Enable iteration**: Support refinement and improvement

---

## Further Reading

- `content-patterns.md` - 5 content structure patterns (Tool Wrapper, Generator, Reviewer, Inversion, Pipeline)
- `patterns.md` - Implementation patterns (config.json, gotchas, script reuse, data storage, on-demand hooks)
- `constraints_and_rules.md` - Technical constraints and naming conventions
- `quick_checklist.md` - Pre-publication checklist
- `schemas.md` - JSON structures for evals and benchmarks
