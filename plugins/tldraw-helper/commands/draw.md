---
description: Draw shapes and diagrams on tldraw canvas
argument-hint: "[diagram_type] [description]"
---

# Draw with tldraw

Create visual diagrams and illustrations using tldraw Desktop's Canvas API.

**⚠️ CRITICAL: Before executing this command:**
1. **Read the tldraw-canvas-api skill documentation COMPLETELY**
2. **Follow ALL API usage rules exactly as documented**
3. **Never guess API endpoints or parameter formats**
4. **Always use JSON files (not inline JSON) for API calls**
5. **This is a new feature - do not assume anything about the API**

## Usage

```
/tldraw:draw [diagram_type] [description]
```

## Examples

- `/tldraw:draw flowchart user authentication process`
- `/tldraw:draw architecture microservices system`
- `/tldraw:draw mindmap project planning`
- `/tldraw:draw` - Interactive mode, will ask what to draw

## What this command does

1. Checks if tldraw Desktop is running and has an open document
2. If no document exists, prompts the user to create one
3. Clears the canvas (optional, will ask first)
4. Creates the requested diagram based on the description
5. Takes a screenshot to show the result

## Supported Diagram Types

- **flowchart** - Process flows with decision points
- **architecture** - System architecture diagrams
- **mindmap** - Mind maps and concept maps
- **sequence** - Sequence diagrams
- **er** - Entity-relationship diagrams
- **network** - Network topology diagrams
- **timeline** - Timeline visualizations
- **custom** - Custom shapes and layouts

---

## Implementation

**⚠️ MANDATORY STEPS - Follow in order:**

1. **Check for open documents:**

```bash
curl -s http://localhost:7236/api/doc | jq .
```

If no documents found, ask the user to create one in tldraw Desktop (Cmd+N).

2. **If diagram_type and description are not provided**, use AskUserQuestion to gather:
   - What type of diagram do they want?
   - What should it contain?
   - Any specific style preferences?

3. **Invoke the tldraw-canvas-api skill** using the Skill tool:

```
Skill(skill: "tldraw-helper:tldraw-canvas-api", args: "[diagram_type] [description]")
```

**The skill will handle all diagram creation logic programmatically.**

4. **Always take a screenshot at the end** to show the result.

**IMPORTANT REMINDERS:**
- The skill documentation contains ALL necessary API information
- Do NOT make direct API calls without reading the skill first
- Do NOT guess API formats - they are all documented
- Use JSON files for all API requests (never inline JSON)
