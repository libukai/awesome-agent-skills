---
description: Check plugin integration for a skill and verify Command-Agent-Skill architecture
argument-hint: "[skill-path]"
---

# Check Plugin Integration

Verify that a skill properly integrates with its plugin's commands and agents, following the three-layer architecture pattern.

## Usage

```
/agent-skills-toolkit:check-integration [skill-path]
```

## Examples

- `/agent-skills-toolkit:check-integration` - Check current directory
- `/agent-skills-toolkit:check-integration plugins/my-plugin/skills/my-skill`
- `/agent-skills-toolkit:check-integration ~/.claude/plugins/my-plugin/skills/my-skill`

## What this command does

1. Detects if the skill is part of a plugin
2. Finds related commands and agents
3. Verifies three-layer architecture (Command → Agent → Skill)
4. Generates integration report with scoring
5. Provides actionable recommendations

## When to use

- After creating a new skill in a plugin
- After modifying an existing plugin skill
- When reviewing plugin architecture
- Before publishing a plugin
- When troubleshooting integration issues

---

## Implementation

This command acts as a **thin wrapper** that delegates to the `plugin-integration-checker` skill.

### Step 1: Determine Skill Path

```bash
# If skill-path argument is provided, use it
SKILL_PATH="${1}"

# If no argument, check if current directory is a skill
if [ -z "$SKILL_PATH" ]; then
  if [ -f "skill.md" ]; then
    SKILL_PATH=$(pwd)
    echo "📍 Using current directory: $SKILL_PATH"
  else
    echo "❌ No skill path provided and current directory is not a skill."
    echo "Usage: /agent-skills-toolkit:check-integration [skill-path]"
    exit 1
  fi
fi

# Verify skill exists
if [ ! -f "$SKILL_PATH/skill.md" ] && [ ! -f "$SKILL_PATH" ]; then
  echo "❌ Skill not found at: $SKILL_PATH"
  echo "Please provide a valid path to a skill directory or skill.md file"
  exit 1
fi

# If path points to skill.md, get the directory
if [ -f "$SKILL_PATH" ] && [[ "$SKILL_PATH" == *"skill.md" ]]; then
  SKILL_PATH=$(dirname "$SKILL_PATH")
fi

echo "✅ Found skill at: $SKILL_PATH"
```

### Step 2: Invoke plugin-integration-checker Skill

The actual integration check is performed by the `plugin-integration-checker` skill. This command simply provides a convenient entry point.

```
Use the plugin-integration-checker skill to analyze the skill at: {SKILL_PATH}

The skill will:
1. Detect plugin context (look for .claude-plugin/plugin.json)
2. Scan for related commands and agents
3. Verify three-layer architecture compliance
4. Generate integration report with scoring
5. Provide specific recommendations

Display the full report to the user.
```

### Step 3: Display Results

The skill will generate a comprehensive report. Make sure to display:

- **Plugin Information**: Name, version, skill location
- **Integration Status**: Related commands and agents
- **Architecture Analysis**: Scoring for each layer
- **Overall Score**: 0.0-1.0 with interpretation
- **Recommendations**: Specific improvements with examples

### Step 4: Offer Next Steps

After displaying the report, offer to:

```
Based on the integration report, would you like me to:

1. Fix integration issues (create/update commands or agents)
2. Generate ARCHITECTURE.md documentation
3. Update README.md with architecture section
4. Review specific components in detail
5. Nothing, the integration looks good
```

Use AskUserQuestion to present these options.

## Command Flow

```
User runs /check-integration [path]
         ↓
┌────────────────────────────────────┐
│ Step 1: Determine Skill Path       │
│ - Use argument or current dir      │
│ - Verify skill exists              │
└────────┬───────────────────────────┘
         ↓
┌────────────────────────────────────┐
│ Step 2: Invoke Skill               │
│ - Call plugin-integration-checker  │
│ - Skill performs analysis          │
└────────┬───────────────────────────┘
         ↓
┌────────────────────────────────────┐
│ Step 3: Display Report             │
│ - Plugin info                      │
│ - Integration status               │
│ - Architecture analysis            │
│ - Recommendations                  │
└────────┬───────────────────────────┘
         ↓
┌────────────────────────────────────┐
│ Step 4: Offer Next Steps           │
│ - Fix issues                       │
│ - Generate docs                    │
│ - Review components                │
└────────────────────────────────────┘
```

## Integration Report Format

The skill will generate a report like this:

```markdown
# Plugin Integration Report

## Plugin Information
- **Name**: tldraw-helper
- **Version**: 1.0.0
- **Skill**: tldraw-canvas-api
- **Location**: plugins/tldraw-helper/skills/tldraw-canvas-api

## Integration Status

### Commands
✅ commands/draw.md
   - Checks prerequisites
   - Gathers requirements with AskUserQuestion
   - Delegates to diagram-creator agent
   - Verifies results with screenshot

✅ commands/screenshot.md
   - Simple direct API usage (appropriate for simple task)

### Agents
✅ agents/diagram-creator.md
   - References skill for API details
   - Clear workflow steps
   - Handles errors and iteration

## Architecture Analysis

### Command Layer (Score: 0.9/1.0)
✅ Prerequisites check
✅ User interaction (AskUserQuestion)
✅ Agent delegation
✅ Result verification
⚠️ Could add more error handling examples

### Agent Layer (Score: 0.85/1.0)
✅ Clear capabilities defined
✅ Explicit skill references
✅ Workflow steps outlined
⚠️ Error handling could be more detailed

### Skill Layer (Score: 0.95/1.0)
✅ Complete API documentation
✅ Best practices included
✅ Working examples provided
✅ Troubleshooting guide
✅ No workflow logic (correct)

## Overall Integration Score: 0.9/1.0 (Excellent)

## Recommendations

### Minor Improvements

1. **Command: draw.md**
   - Add example of handling API errors
   - Example: "If tldraw is not running, show clear message"

2. **Agent: diagram-creator.md**
   - Add more specific error recovery examples
   - Example: "If shape creation fails, retry with adjusted coordinates"

### Architecture Compliance
✅ Follows three-layer pattern correctly
✅ Clear separation of concerns
✅ Proper delegation and references

## Reference Documentation
- See PLUGIN_ARCHITECTURE.md for detailed guidance
- See tldraw-helper/ARCHITECTURE.md for this implementation
```

## Example Usage

### Check Current Directory

```bash
cd plugins/my-plugin/skills/my-skill
/agent-skills-toolkit:check-integration

# Output:
# 📍 Using current directory: /path/to/my-skill
# ✅ Found skill at: /path/to/my-skill
# 🔍 Analyzing plugin integration...
# [Full report displayed]
```

### Check Specific Skill

```bash
/agent-skills-toolkit:check-integration plugins/tldraw-helper/skills/tldraw-canvas-api

# Output:
# ✅ Found skill at: plugins/tldraw-helper/skills/tldraw-canvas-api
# 🔍 Analyzing plugin integration...
# [Full report displayed]
```

### Standalone Skill (Not in Plugin)

```bash
/agent-skills-toolkit:check-integration ~/.claude/skills/my-standalone-skill

# Output:
# ✅ Found skill at: ~/.claude/skills/my-standalone-skill
# ℹ️ This skill is standalone (not part of a plugin)
# No integration check needed.
```

## Key Design Principles

### 1. Command as Thin Wrapper

This command doesn't implement the checking logic itself. It:
- Validates input (skill path)
- Delegates to the skill (plugin-integration-checker)
- Displays results
- Offers next steps

**Why:** Keeps command simple and focused on orchestration.

### 2. Skill Does the Work

The `plugin-integration-checker` skill contains all the logic:
- Plugin detection
- Component scanning
- Architecture verification
- Report generation

**Why:** Reusable logic, can be called from other contexts.

### 3. User-Friendly Interface

The command provides:
- Clear error messages
- Progress indicators
- Formatted output
- Actionable next steps

**Why:** Great user experience.

## Error Handling

### Skill Not Found

```
❌ Skill not found at: /invalid/path
Please provide a valid path to a skill directory or skill.md file

Usage: /agent-skills-toolkit:check-integration [skill-path]
```

### Not a Skill Directory

```
❌ No skill path provided and current directory is not a skill.
Usage: /agent-skills-toolkit:check-integration [skill-path]

Tip: Navigate to a skill directory or provide the path as an argument.
```

### Permission Issues

```
❌ Cannot read skill at: /path/to/skill
Permission denied. Please check file permissions.
```

## Integration with Other Commands

This command complements other agent-skills-toolkit commands:

- **After `/create-skill`**: Automatically check integration
- **After `/improve-skill`**: Verify improvements didn't break integration
- **Before publishing**: Final integration check

## Summary

This command provides a **convenient entry point** for checking plugin integration:

1. ✅ Simple to use (just provide skill path)
2. ✅ Delegates to specialized skill
3. ✅ Provides comprehensive report
4. ✅ Offers actionable next steps
5. ✅ Follows command-as-orchestrator pattern

**Remember:** The command orchestrates, the skill executes, following our three-layer architecture!
