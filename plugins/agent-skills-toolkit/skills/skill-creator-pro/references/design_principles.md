# Skill Design Principles and Use Case Patterns

This document outlines the core design principles for creating effective Claude Skills and provides a framework for understanding different skill use cases.

## Three Core Design Principles

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

## Three Common Use Case Categories

Understanding which category your skill falls into helps guide design decisions.

### Category 1: Document & Asset Creation

**Purpose**: Create consistent, high-quality outputs following specific formats or styles.

**Characteristics:**
- Emphasis on templates and style guides
- Quality control and consistency checks
- Often produces files (documents, images, code)
- Repeatable with predictable structure

**Design Techniques:**
- Embed style guides directly in SKILL.md
- Provide template structures in `assets/`
- Include quality checklists
- Show before/after examples
- Define exact output formats

**Example Skills:**
- `frontend-design` - Creates UI components following design system
- `technical-writer` - Generates documentation with consistent structure
- `slide-deck-generator` - Converts content to presentation format

**When to use this pattern:**
- User needs consistent formatting across multiple outputs
- There's an established style guide or template to follow
- Quality can be objectively measured against criteria

---

### Category 2: Workflow Automation

**Purpose**: Automate multi-step processes that require coordination and decision-making.

**Characteristics:**
- Sequential or branching workflows
- Multiple tool invocations
- Decision points and validation steps
- Iterative refinement loops

**Design Techniques:**
- Map out the complete workflow with clear steps
- Include validation checkpoints
- Handle error cases and edge conditions
- Provide progress indicators
- Enable iteration and refinement

**Example Skills:**
- `skill-creator` - Guides through skill creation, testing, and iteration
- `code-reviewer` - Analyzes code, identifies issues, suggests improvements
- `data-pipeline` - Extracts, transforms, validates, and loads data

**When to use this pattern:**
- Task requires 3+ distinct steps
- Steps depend on outputs from previous steps
- Human review or approval needed at certain points
- Process benefits from automation but needs flexibility

---

### Category 3: MCP Enhancement

**Purpose**: Provide workflow guidance and domain expertise for MCP (Model Context Protocol) servers.

**Analogy**:
> "MCP provides the professional kitchen: access to tools, ingredients, and equipment. Skills provide the recipe: step-by-step instructions on how to create valuable outcomes."

**Characteristics:**
- Coordinates multiple MCP tool calls
- Embeds domain-specific knowledge
- Interprets MCP outputs for users
- Handles MCP-specific error cases

**Design Techniques:**
- Document the MCP server's capabilities
- Provide workflow patterns for common tasks
- Include domain expertise (e.g., Sentry error analysis patterns)
- Handle API rate limits and errors gracefully
- Translate technical outputs into user-friendly insights

**Example Skills:**
- `sentry-code-review` - Uses Sentry MCP to analyze errors and suggest fixes
- `github-workflow` - Orchestrates GitHub MCP for PR reviews and issue management
- `database-query` - Guides safe and efficient database operations via DB MCP

**When to use this pattern:**
- You have an MCP server that provides raw capabilities
- Users need guidance on how to use those capabilities effectively
- Domain expertise adds significant value
- Workflow patterns emerge from repeated use

**Key Insight**: Skills teach Claude **how to use** MCP tools effectively, while MCP defines **what tools are available**.

---

## Choosing the Right Pattern

Ask yourself:

1. **What's the primary output?**
   - Consistent document/asset → Category 1
   - Completed multi-step process → Category 2
   - Insights from external tools → Category 3

2. **What's the main challenge?**
   - Maintaining consistency → Category 1
   - Coordinating complex steps → Category 2
   - Using specialized tools effectively → Category 3

3. **Where does the value come from?**
   - Templates and style guides → Category 1
   - Workflow automation → Category 2
   - Domain expertise + tool orchestration → Category 3

Many skills combine elements from multiple categories. Use this framework as a starting point, not a rigid constraint.

---

## Cross-Cutting Concerns

Regardless of category, all skills should:

- **Be specific and actionable**: Vague instructions lead to inconsistent results
- **Include error handling**: Anticipate what can go wrong
- **Provide examples**: Show, don't just tell
- **Explain the why**: Help Claude understand reasoning, not just rules
- **Stay focused**: One skill, one clear purpose
- **Enable iteration**: Support refinement and improvement

---

## Further Reading

- `constraints_and_rules.md` - Technical constraints and naming conventions
- `quick_checklist.md` - Pre-publication checklist
- `schemas.md` - JSON structures for evals and benchmarks
