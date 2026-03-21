---
name: plugin-integration-checker
description: Check if a skill is part of a plugin and verify its integration with commands and agents. Use after creating or modifying a skill to ensure proper plugin architecture. Triggers on "check plugin integration", "verify skill integration", "is this skill in a plugin", "check command-skill-agent integration", or after skill creation/modification when the skill path contains ".claude-plugins" or "plugins/".
---

# Plugin Integration Checker

After creating or modifying a skill, this skill checks whether it's part of a Claude Code plugin and verifies proper integration with commands and agents following the three-layer architecture pattern.

## When to Use

Use this skill automatically after:
- Creating a new skill that's part of a plugin
- Modifying an existing skill in a plugin
- User asks to check plugin integration
- Skill path contains `.claude-plugins/` or `plugins/`

## Three-Layer Architecture

A well-designed plugin follows this pattern:

```
Command (Orchestration) → Agent (Execution) → Skill (Knowledge)
```

### Layer Responsibilities

| Layer | Responsibility | Contains |
|-------|---------------|----------|
| **Command** | Workflow orchestration | Prerequisites checks, user interaction, agent delegation |
| **Agent** | Autonomous execution | Task planning, API calls, iteration, error handling |
| **Skill** | Knowledge documentation | API reference, best practices, examples, troubleshooting |

## Integration Check Process

### Step 1: Detect Plugin Context

```bash
# Check if skill is in a plugin directory
SKILL_PATH="$1"  # Path to the skill directory

# Look for plugin.json in parent directories
CURRENT_DIR=$(dirname "$SKILL_PATH")
PLUGIN_ROOT=""

while [ "$CURRENT_DIR" != "/" ]; do
  if [ -f "$CURRENT_DIR/.claude-plugin/plugin.json" ]; then
    PLUGIN_ROOT="$CURRENT_DIR"
    break
  fi
  CURRENT_DIR=$(dirname "$CURRENT_DIR")
done

if [ -z "$PLUGIN_ROOT" ]; then
  echo "✅ This skill is standalone (not part of a plugin)"
  exit 0
fi

echo "🔍 Found plugin at: $PLUGIN_ROOT"
```

### Step 2: Read Plugin Metadata

```bash
# Extract plugin info
PLUGIN_NAME=$(jq -r '.name' "$PLUGIN_ROOT/.claude-plugin/plugin.json")
PLUGIN_VERSION=$(jq -r '.version' "$PLUGIN_ROOT/.claude-plugin/plugin.json")

echo "Plugin: $PLUGIN_NAME v$PLUGIN_VERSION"
```

### Step 3: Check for Related Commands

Look for commands that might use this skill:

```bash
# List all commands in the plugin
COMMANDS_DIR="$PLUGIN_ROOT/commands"

if [ -d "$COMMANDS_DIR" ]; then
  echo "📋 Checking commands..."

  # Get skill name from directory
  SKILL_NAME=$(basename "$SKILL_PATH")

  # Search for references to this skill in commands
  grep -r "$SKILL_NAME" "$COMMANDS_DIR" --include="*.md" -l
fi
```

### Step 4: Check for Related Agents

Look for agents that might reference this skill:

```bash
# List all agents in the plugin
AGENTS_DIR="$PLUGIN_ROOT/agents"

if [ -d "$AGENTS_DIR" ]; then
  echo "🤖 Checking agents..."

  # Search for references to this skill in agents
  grep -r "$SKILL_NAME" "$AGENTS_DIR" --include="*.md" -l
fi
```

### Step 5: Analyze Integration Quality

For each command/agent that references this skill, check:

#### Command Integration Checklist

Read the command file and verify:

- [ ] **Prerequisites Check**: Does it check if required services/tools are running?
- [ ] **User Interaction**: Does it use AskUserQuestion for gathering requirements?
- [ ] **Agent Delegation**: Does it delegate complex work to an agent?
- [ ] **Skill Reference**: Does it mention the skill in the implementation section?
- [ ] **Result Verification**: Does it verify the final result (screenshot, output, etc.)?

**Good Example:**
```markdown
## Implementation

### Step 1: Check Prerequisites
curl -s http://localhost:7236/api/doc | jq .

### Step 2: Gather Requirements
Use AskUserQuestion to collect user preferences.

### Step 3: Delegate to Agent
Agent({
  subagent_type: "plugin-name:agent-name",
  prompt: "Task description with context"
})

### Step 4: Verify Results
Take screenshot and display to user.
```

**Bad Example:**
```markdown
## Implementation

Use the skill to do the task.
```

#### Agent Integration Checklist

Read the agent file and verify:

- [ ] **Clear Capabilities**: Does it define what it can do?
- [ ] **Skill Reference**: Does it explicitly reference the skill for API/implementation details?
- [ ] **Workflow Steps**: Does it outline the execution workflow?
- [ ] **Error Handling**: Does it mention how to handle errors?
- [ ] **Iteration**: Does it describe how to verify and refine results?

**Good Example:**
```markdown
## Your Workflow

1. Understand requirements
2. Check prerequisites
3. Plan approach (reference Skill for best practices)
4. Execute task (reference Skill for API details)
5. Verify results
6. Iterate if needed

Reference the {skill-name} skill for:
- API endpoints and usage
- Best practices
- Examples and patterns
```

**Bad Example:**
```markdown
## Your Workflow

Create the output based on user requirements.
```

#### Skill Quality Checklist

Verify the skill itself follows best practices:

- [ ] **Clear Description**: Triggers, use cases, and contexts (under 1024 chars)
- [ ] **API Documentation**: Complete endpoint reference with examples
- [ ] **Best Practices**: Guidelines for using the API/tool effectively
- [ ] **Examples**: Working code examples
- [ ] **Troubleshooting**: Common issues and solutions
- [ ] **No Workflow Logic**: Skill documents "how", not "when" or "what"

### Step 6: Generate Integration Report

Create a report showing:

1. **Plugin Context**
   - Plugin name and version
   - Skill location within plugin

2. **Integration Status**
   - Commands that reference this skill
   - Agents that reference this skill
   - Standalone usage (if no references found)

3. **Architecture Compliance**
   - ✅ Follows three-layer pattern
   - ⚠️ Partial integration (missing command or agent)
   - ❌ Poor integration (monolithic command, no separation)

4. **Recommendations**
   - Specific improvements needed
   - Examples of correct patterns
   - Links to architecture documentation

## Report Format

```markdown
# Plugin Integration Report

## Plugin Information
- **Name**: {plugin-name}
- **Version**: {version}
- **Skill**: {skill-name}

## Integration Status

### Commands
{list of commands that reference this skill}

### Agents
{list of agents that reference this skill}

## Architecture Analysis

### Command Layer
- ✅ Prerequisites check
- ✅ User interaction
- ✅ Agent delegation
- ⚠️ Missing result verification

### Agent Layer
- ✅ Clear capabilities
- ✅ Skill reference
- ❌ No error handling mentioned

### Skill Layer
- ✅ API documentation
- ✅ Examples
- ✅ Best practices

## Recommendations

1. **Command Improvements**
   - Add result verification step
   - Example: Take screenshot after agent completes

2. **Agent Improvements**
   - Add error handling section
   - Example: "If API call fails, retry with exponential backoff"

3. **Overall Architecture**
   - ✅ Follows three-layer pattern
   - Consider adding more examples to skill

## Reference Documentation

See PLUGIN_ARCHITECTURE.md for detailed guidance on:
- Three-layer architecture pattern
- Command orchestration best practices
- Agent execution patterns
- Skill documentation standards
```

## Implementation Details

### Detecting Integration Patterns

**Good Command Pattern:**
```bash
# Look for these patterns in command files
grep -E "(Agent\(|subagent_type|AskUserQuestion)" command.md
```

**Good Agent Pattern:**
```bash
# Look for skill references in agent files
grep -E "(reference.*skill|see.*skill|skill.*for)" agent.md -i
```

**Good Skill Pattern:**
```bash
# Check skill has API docs and examples
grep -E "(## API|### Endpoint|```bash|## Example)" skill.md
```

### Integration Scoring

Calculate an integration score:

```
Score = (Command Quality × 0.4) + (Agent Quality × 0.3) + (Skill Quality × 0.3)

Where each quality score is:
- 1.0 = Excellent (all checklist items passed)
- 0.7 = Good (most items passed)
- 0.4 = Fair (some items passed)
- 0.0 = Poor (few or no items passed)
```

**Interpretation:**
- 0.8-1.0: ✅ Excellent integration
- 0.6-0.8: ⚠️ Good but needs improvement
- 0.4-0.6: ⚠️ Fair, significant improvements needed
- 0.0-0.4: ❌ Poor integration, major refactoring needed

## Common Anti-Patterns to Detect

### ❌ Monolithic Command

```markdown
## Implementation

curl -X POST http://api/endpoint ...
# Command tries to do everything
```

**Fix:** Delegate to agent

### ❌ Agent Without Skill Reference

```markdown
## Your Workflow

1. Do the task
2. Return results
```

**Fix:** Add explicit skill references

### ❌ Skill With Workflow Logic

```markdown
## When to Use

First check if the service is running, then gather user requirements...
```

**Fix:** Move workflow to command, keep only "how to use API" in skill

## After Generating Report

1. **Display the report** to the user
2. **Offer to fix issues** if any are found
3. **Create/update ARCHITECTURE.md** in plugin root if it doesn't exist
4. **Update README.md** to include architecture section if missing

## Example Usage

```bash
# After creating a skill
/check-integration ~/.claude/plugins/my-plugin/skills/my-skill

# Output:
# 🔍 Found plugin at: ~/.claude/plugins/my-plugin
# Plugin: my-plugin v1.0.0
#
# 📋 Checking commands...
# Found: commands/do-task.md
#
# 🤖 Checking agents...
# Found: agents/task-executor.md
#
# ✅ Integration Analysis Complete
# Score: 0.85 (Excellent)
#
# See full report: my-plugin-integration-report.md
```

## Key Principles

1. **Automatic Detection**: Run automatically when skill path indicates plugin context
2. **Comprehensive Analysis**: Check all three layers (command, agent, skill)
3. **Actionable Feedback**: Provide specific recommendations with examples
4. **Architecture Enforcement**: Ensure plugins follow the three-layer pattern
5. **Documentation**: Generate reports and update plugin documentation

## Reference Files

For detailed architecture guidance, refer to:
- `PLUGIN_ARCHITECTURE.md` - Three-layer architecture pattern
- `tldraw-helper/ARCHITECTURE.md` - Reference implementation
- `tldraw-helper/commands/draw.md` - Example command with proper integration

---

**Remember:** The goal is to ensure skills, commands, and agents work together seamlessly, with clear separation of concerns and proper delegation patterns.
