---
description: This skill should be used when users want to programmatically create diagrams, flowcharts, illustrations, or visual content using tldraw Desktop's API. Triggers include "draw a diagram", "create a flowchart", "visualize this process", "make an illustration", "sketch a diagram", "build a flowchart", "design a diagram in tldraw", "use tldraw to draw", "create shapes in tldraw", or any mention of tldraw Desktop canvas operations.
---

# tldraw Desktop Canvas API

To create visual diagrams and illustrations, use the tldraw Desktop Local Canvas API.

## Overview

tldraw Desktop runs a local HTTP server (default port 7236) that provides programmatic access to open tldraw documents. You can create, read, update, and delete shapes on the canvas using simple HTTP requests.

## Quick Start Workflow

1. **Check for open documents**
   ```bash
   curl -s http://localhost:7236/api/doc | jq .
   ```

2. **If no documents exist**, ask the user to create a new document in tldraw Desktop (Cmd+N / Ctrl+N)

3. **Get the document ID** from the response (e.g., `"id": "abc123"`)

4. **Create shapes** using the Structured API

5. **Take screenshots** to verify your work

## API Endpoints

### List Documents
```bash
GET http://localhost:7236/api/doc
```

Returns all open documents with their IDs, file paths, and shape counts.

### Get Shapes
```bash
GET http://localhost:7236/api/doc/:id/shapes
```

Returns all shapes on the current page.

### Create/Update/Delete Shapes
```bash
POST http://localhost:7236/api/doc/:id/actions
Content-Type: application/json

{
  "actions": [
    {
      "_type": "create",
      "shape": {
        "_type": "rectangle",
        "shapeId": "box1",
        "x": 100,
        "y": 100,
        "w": 200,
        "h": 150,
        "color": "blue",
        "fill": "solid",
        "text": "Hello",
        "note": ""
      }
    }
  ]
}
```

### Take Screenshot
```bash
GET http://localhost:7236/api/doc/:id/screenshot?size=medium
```

Captures the canvas as a JPEG image. Size options: `small` (768px), `medium` (1536px), `large` (3072px), `full` (5000px).

## Shape Types

tldraw supports geometric shapes, text, arrows, lines, and sticky notes. For complete shape specifications, see [references/shape-types.md](references/shape-types.md).

### Common Shapes

**Geometric:** rectangle, ellipse, diamond, triangle, hexagon, cloud, star, heart
**Connectors:** arrow, line
**Content:** text, note

All geometric shapes use: `{ _type, shapeId, x, y, w, h, color, fill, text?, note }`

### Quick Examples

**Rectangle:**
```json
{"_type": "rectangle", "shapeId": "box1", "x": 100, "y": 100, "w": 200, "h": 150, "color": "blue", "fill": "solid", "text": "Hello"}
```

**Text:**
```json
{"_type": "text", "shapeId": "label1", "x": 100, "y": 100, "anchor": "top-left", "color": "black", "text": "Label"}
```

**Arrow:**
```json
{"_type": "arrow", "shapeId": "arrow1", "x1": 100, "y1": 100, "x2": 300, "y2": 200, "color": "black"}
```

**Sticky Note:**
```json
{"_type": "note", "shapeId": "note1", "x": 100, "y": 100, "color": "yellow", "text": "Note content"}
```

## Colors and Fills

For complete color and fill style reference, see [references/colors-and-fills.md](references/colors-and-fills.md).

**Colors:** red, green, blue, orange, yellow, violet, grey, black, white (and light- variants)
**Fills:** none, tint, background, solid, pattern

## Actions

### Create
```json
{
  "_type": "create",
  "shape": { /* shape properties */ }
}
```

### Update
```json
{
  "_type": "update",
  "shape": {
    "shapeId": "box1",
    "color": "red",
    "text": "Updated text"
  }
}
```

### Delete
```json
{
  "_type": "delete",
  "shapeId": "box1"
}
```

### Move
```json
{
  "_type": "move",
  "shapeId": "box1",
  "x": 200,
  "y": 300
}
```

### Align
```json
{
  "_type": "align",
  "shapeIds": ["box1", "box2"],
  "axis": "horizontal",
  "position": "center"
}
```

## Best Practices

1. **Use JSON files for complex requests** to avoid shell escaping issues:
   ```bash
   # Create a JSON file
   cat > /tmp/shapes.json << 'EOF'
   {"actions": [...]}
   EOF

   # Use it in curl
   curl -X POST "http://localhost:7236/api/doc/DOC_ID/actions" \
     -H 'Content-Type: application/json' \
     -d @/tmp/shapes.json
   ```

2. **Make incremental changes** - Create a few shapes, take a screenshot to verify, then continue

3. **Clear old shapes** before creating new diagrams:
   ```json
   {"actions": [
     {"_type": "delete", "shapeId": "shape1"},
     {"_type": "delete", "shapeId": "shape2"}
   ]}
   ```

4. **Use meaningful shape IDs** - Makes it easier to reference and update shapes later

5. **Take screenshots frequently** to verify your work visually

## Common Diagram Patterns

### Flowchart
- Use **rectangles** for processes
- Use **diamonds** for decisions
- Use **arrows** to connect steps
- Use **ellipses** for start/end points

### Architecture Diagram
- Use **rectangles** for components
- Use **clouds** for external services
- Use **arrows** for data flow
- Use **notes** for annotations

### Mind Map
- Use **ellipses** for central ideas
- Use **rectangles** for sub-topics
- Use **arrows** or **lines** to connect
- Use different **colors** for categories

## Examples

Complete working examples are available in the `examples/` directory:

- **[examples/simple-flowchart.sh](examples/simple-flowchart.sh)** - Basic flowchart with decision points
- **[examples/architecture-diagram.sh](examples/architecture-diagram.sh)** - Microservices architecture diagram

### Quick Example: Create a Rectangle

```bash
# Get document ID
DOC_ID=$(curl -s http://localhost:7236/api/doc | jq -r '.docs[0].id')

# Create a blue rectangle
curl -X POST "http://localhost:7236/api/doc/$DOC_ID/actions" \
  -H 'Content-Type: application/json' \
  -d '{"actions":[{"_type":"create","shape":{"_type":"rectangle","shapeId":"box1","x":100,"y":100,"w":200,"h":150,"color":"blue","fill":"solid","text":"Hello"}}]}'

# Take screenshot
curl -s "http://localhost:7236/api/doc/$DOC_ID/screenshot?size=medium" -o /tmp/result.jpg
```

## Troubleshooting

### No documents found
- Ask the user to create a new document in tldraw Desktop (Cmd+N / Ctrl+N)
- Or ask them to open an existing .tldr file

### Connection refused
- Verify tldraw Desktop is running
- Check if the server is on port 7236: `cat ~/Library/Application\ Support/tldraw/server.json`

### JSON parsing errors
- Use JSON files instead of inline JSON to avoid shell escaping issues
- Validate JSON syntax before sending

### Shapes not appearing
- Check the response for error messages
- Verify shape coordinates are within reasonable bounds
- Take a screenshot to see the current canvas state

## Advanced: Exec API

For advanced operations, you can execute arbitrary JavaScript against the tldraw Editor instance:

```bash
curl -X POST "http://localhost:7236/api/doc/$DOC_ID/exec" \
  -H 'Content-Type: application/json' \
  -d '{"code": "return editor.getCurrentPageShapes().length"}'
```

This gives you full access to the tldraw SDK, but requires knowledge of the tldraw API.

---

Remember: Always start by checking for open documents, create shapes incrementally, and verify your work with screenshots!
