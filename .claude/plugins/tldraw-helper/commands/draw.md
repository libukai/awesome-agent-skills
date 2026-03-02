---
description: Draw shapes and diagrams on tldraw canvas
argument-hint: "[diagram_type] [description]"
---

# Draw with tldraw

Create visual diagrams and illustrations using tldraw Desktop's Canvas API.

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

Check for open documents:

```bash
curl -s http://localhost:7236/api/doc | jq .
```

If no documents found, ask the user to create one in tldraw Desktop (Cmd+N).

If diagram_type and description are not provided, use AskUserQuestion to gather requirements:
- What type of diagram do they want?
- What should it contain?
- Any specific style preferences?

Then use the tldraw-canvas-api skill to create the diagram programmatically.

Always take a screenshot at the end to show the result.
