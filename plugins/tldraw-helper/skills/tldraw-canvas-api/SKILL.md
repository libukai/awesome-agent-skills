---
description: Use this skill whenever users need visual diagrams, flowcharts, architecture diagrams, mind maps, or any kind of illustration - even if they don't explicitly mention "tldraw" or "diagram". This skill enables programmatic creation of professional visualizations using tldraw Desktop's API. Trigger on: "draw", "visualize", "create a diagram", "show me", "illustrate", "flowchart", "architecture", "mind map", "sketch", "design a layout", or any request that would benefit from a visual representation. Also trigger when users describe a process, system, or concept that would be clearer with a diagram, even if they don't ask for one directly.
---

# tldraw Desktop Canvas API

**⚠️ CRITICAL: READ THIS ENTIRE SKILL DOCUMENT BEFORE USING THE API**

This is a newly developed feature. You MUST carefully read and follow ALL instructions in this skill document before making any API calls. DO NOT guess or assume API usage patterns. Every API endpoint, parameter format, and workflow step is documented here - follow them exactly.

When users need to understand complex information, visualize processes, or communicate ideas, diagrams are often more effective than text alone. This skill enables you to create professional diagrams programmatically using tldraw Desktop's Local Canvas API.

## Why Use This Skill

Visual diagrams help users:
- **Understand complex systems** - Architecture diagrams make system relationships clear
- **Follow processes** - Flowcharts show decision points and workflows
- **Organize ideas** - Mind maps structure brainstorming and planning
- **Communicate effectively** - Visuals convey information faster than text

Use this skill proactively when you notice the user describing something that would benefit from visualization, even if they haven't explicitly asked for a diagram.

## Core Workflow

The key to success with tldraw is following this workflow:

1. **Verify tldraw is running** - Check for open documents first
2. **Plan before creating** - Think about layout, colors, and structure
3. **Build incrementally** - Create shapes in logical groups
4. **Verify visually** - Take screenshots to confirm results
5. **Iterate if needed** - Adjust based on what you see

This workflow matters because tldraw is a visual tool - you need to see the results to know if they're correct. Don't create all shapes at once and hope for the best; build incrementally and verify.

## Quick Start

### Step 1: Check for Open Documents

```bash
curl -s http://localhost:7236/api/doc | jq .
```

**Why this matters:** The API only works with open documents. If no documents exist, you must ask the user to create one (Cmd+N / Ctrl+N) before proceeding. Don't try to create shapes without a document - it will fail.

**What to look for:**
- `"docs": []` means no documents - ask user to create one
- `"docs": [{"id": "abc123", ...}]` means you're ready - extract the ID

### Step 2: Get the Document ID

```bash
DOC_ID=$(curl -s http://localhost:7236/api/doc | jq -r '.docs[0].id')
```

Save this ID - you'll use it in every API call. If you lose it, just run the command again.

### Step 3: Plan Your Diagram

Before creating shapes, think about:
- **Layout strategy** - Top-to-bottom flow? Left-to-right? Radial?
- **Spacing** - Use multiples of 50 for clean alignment (100, 150, 200, etc.)
- **Color coding** - Consistent colors convey meaning (blue=process, red=error, green=success)
- **Shape selection** - Rectangles for components, diamonds for decisions, ellipses for start/end

**Why planning matters:** Random placement creates messy diagrams. A 30-second mental plan saves minutes of repositioning.

### Step 4: Create Shapes Incrementally

**⚠️ IMPORTANT API USAGE RULES:**
1. **Always use JSON files** - Never use inline JSON in curl commands due to escaping issues
2. **Use the correct endpoint** - `POST /api/doc/:id/actions` (NOT `/api/doc/:id/exec` unless specifically needed)
3. **Include all required fields** - Every shape needs `_type`, `shapeId`, position, size, and `note: ""`
4. **Use heredoc syntax** - `cat > /tmp/file.json << 'EOF'` to avoid variable expansion
5. **Reference with @filename** - `curl -d @/tmp/file.json` to send the file content

Use JSON files to avoid shell escaping issues:

```bash
cat > /tmp/shapes.json << 'EOF'
{
  "actions": [
    {
      "_type": "create",
      "shape": {
        "_type": "rectangle",
        "shapeId": "process1",
        "x": 100,
        "y": 100,
        "w": 200,
        "h": 100,
        "color": "blue",
        "fill": "solid",
        "text": "Process Data"
      }
    }
  ]
}
EOF

curl -X POST "http://localhost:7236/api/doc/$DOC_ID/actions" \
  -H 'Content-Type: application/json' \
  -d @/tmp/shapes.json
```

**Why JSON files:** Inline JSON in bash requires complex escaping. Files are cleaner and easier to debug.

### Step 5: Take Screenshots to Verify

```bash
curl -s "http://localhost:7236/api/doc/$DOC_ID/screenshot?size=medium" \
  -o /tmp/diagram.jpg
```

**Critical:** Always take screenshots after creating shapes. The API returns success even if shapes are off-screen or overlapping. Visual verification catches these issues immediately.

## API Endpoints

### List Documents
```bash
GET http://localhost:7236/api/doc
```
Returns all open documents with IDs, file paths, and shape counts.

### Get Shapes
```bash
GET http://localhost:7236/api/doc/:id/shapes
```
Returns all shapes on the current page. Use this to see what's already on the canvas before adding more.

### Create/Update/Delete Shapes
```bash
POST http://localhost:7236/api/doc/:id/actions
Content-Type: application/json

{"actions": [...]}
```
Execute multiple actions in one request. All actions succeed or fail together.

### Take Screenshot
```bash
GET http://localhost:7236/api/doc/:id/screenshot?size=medium
```
Captures the canvas as JPEG. Sizes: `small` (768px), `medium` (1536px), `large` (3072px), `full` (5000px).

## Shape Types

For complete shape specifications, see [references/shape-types.md](references/shape-types.md).

### Common Shapes

**Geometric:** rectangle, ellipse, diamond, triangle, hexagon, cloud, star, heart
**Connectors:** arrow, line
**Content:** text, note

All geometric shapes use: `{ _type, shapeId, x, y, w, h, color, fill, text?, note }`

### Quick Reference

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

For complete reference, see [references/colors-and-fills.md](references/colors-and-fills.md).

**Colors:** red, green, blue, orange, yellow, violet, grey, black, white (and light- variants)
**Fills:** none, tint, background, solid, pattern

**Color coding best practices:**
- Blue - Primary processes/components
- Green - Success states, databases
- Red - Errors, critical items
- Orange - Warnings, decisions
- Yellow - Notes, highlights
- Violet - Special components, APIs

## Actions

### Create
```json
{"_type": "create", "shape": { /* shape properties */ }}
```

### Update
```json
{"_type": "update", "shape": {"shapeId": "box1", "color": "red", "text": "Updated"}}
```
Only include properties you want to change.

### Delete
```json
{"_type": "delete", "shapeId": "box1"}
```

### Move
```json
{"_type": "move", "shapeId": "box1", "x": 200, "y": 300}
```

### Align
```json
{"_type": "align", "shapeIds": ["box1", "box2"], "axis": "horizontal", "position": "center"}
```

## Common Patterns

### Flowchart
- **Ellipses** for start/end points (green for start, red for end)
- **Rectangles** for processes (blue)
- **Diamonds** for decisions (orange)
- **Arrows** to connect steps
- **Spacing:** 150-200px between nodes vertically

**Why this works:** These conventions are universally recognized, making your flowcharts immediately understandable.

### Architecture Diagram
- **Rectangles** for components (blue for frontend, violet for backend)
- **Clouds** for external services (orange)
- **Rectangles with tint fill** for databases (green)
- **Arrows** for data flow
- **Notes** for annotations

**Layout tip:** Group related components together, use layers (frontend top, backend middle, data bottom).

### Mind Map
- **Ellipse** for central idea (violet, larger size)
- **Rectangles** for main branches (different colors per category)
- **Smaller rectangles** for sub-topics
- **Lines** to connect (not arrows - mind maps show relationships, not flow)

**Layout tip:** Radial layout with central node in the middle, branches radiating outward.

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
  -d '{\"actions\":[{\"_type\":\"create\",\"shape\":{\"_type\":\"rectangle\",\"shapeId\":\"box1\",\"x\":100,\"y\":100,\"w\":200,\"h\":150,\"color\":\"blue\",\"fill\":\"solid\",\"text\":\"Hello\"}}]}'

# Take screenshot
curl -s "http://localhost:7236/api/doc/$DOC_ID/screenshot?size=medium\" -o /tmp/result.jpg
```

## Common Mistakes to Avoid

**⚠️ READ THIS SECTION CAREFULLY - These are the most common errors:**

1. **Creating shapes without checking for documents first**
   - Always run `GET /api/doc` before creating shapes
   - If no documents exist, ask the user to create one
   - **Why it fails:** API returns "Not found" if no document is open

2. **Not taking screenshots to verify**
   - The API returns success even if shapes are off-screen
   - Always take a screenshot after creating shapes
   - **Why it matters:** Visual verification catches positioning issues immediately

3. **Using inline JSON in bash (CRITICAL ERROR)**
   - Shell escaping is error-prone and causes API failures
   - **ALWAYS use JSON files** with `cat > /tmp/file.json << 'EOF'` and `curl -d @/tmp/file.json`
   - **Never use:** `-d '{"actions": [...]}'` with inline JSON
   - **Why it fails:** Special characters, quotes, and emojis break shell escaping

4. **Using wrong API endpoints**
   - **Correct:** `POST /api/doc/:id/actions` for creating shapes
   - **Wrong:** `POST /api/doc/:id/exec` (only for advanced JavaScript execution)
   - **Why it matters:** The `/actions` endpoint is designed for structured shape creation

5. **Missing required fields in shape definitions**
   - Every shape MUST include: `_type`, `shapeId`, position/size, `note: ""`
   - Arrows need: `x1, y1, x2, y2` (NOT `start/end` objects)
   - **Why it fails:** API rejects incomplete shape definitions

6. **Random positioning**
   - Use multiples of 50 for x/y coordinates (100, 150, 200, etc.)
   - This creates clean alignment and professional-looking diagrams
   - **Why it matters:** Consistent spacing makes diagrams readable

7. **Forgetting to save the document ID**
   - Extract and save `DOC_ID` at the start: `DOC_ID=$(curl -s http://localhost:7236/api/doc | jq -r '.docs[0].id')`
   - Reuse it for all subsequent API calls
   - **Why it fails:** Using wrong or missing ID causes "Not found" errors

8. **Creating all shapes at once without verification**
   - Build incrementally: create a few shapes, verify with screenshot, continue
   - This catches layout issues early
   - **Why it matters:** Easier to debug and adjust when working in small batches

## Troubleshooting

### No documents found
**Symptom:** `{"docs": []}`
**Solution:** Ask the user to create a new document in tldraw Desktop (Cmd+N / Ctrl+N)
**Why:** The API requires an open document to work with

### Connection refused
**Symptom:** `curl: (7) Failed to connect to localhost port 7236`
**Solution:** Verify tldraw Desktop is running
**Check:** `cat ~/Library/Application\ Support/tldraw/server.json`
**Why:** The API server only runs when tldraw Desktop is open

### JSON parsing errors
**Symptom:** `Bad escaped character in JSON`
**Solution:** Use JSON files instead of inline JSON
**Why:** Bash escaping is complex and error-prone

### Shapes not appearing
**Symptom:** API returns success but shapes aren't visible
**Solution:** Take a screenshot to see the current canvas state
**Common causes:**
- Shapes are off-screen (coordinates too large or negative)
- Shapes are overlapping (same x/y coordinates)
- Wrong document ID (using ID from a closed document)

### Shapes in wrong positions
**Symptom:** Diagram looks messy or crowded
**Solution:** Use grid-based positioning (multiples of 50)
**Why:** Consistent spacing creates professional-looking diagrams

## Advanced: Exec API

For advanced operations, execute arbitrary JavaScript against the tldraw Editor instance:

```bash
curl -X POST "http://localhost:7236/api/doc/$DOC_ID/exec" \
  -H 'Content-Type: application/json' \
  -d '{\"code\": \"return editor.getCurrentPageShapes().length\"}'
```

This gives you full access to the tldraw SDK, but requires knowledge of the tldraw API. Use the Structured API (create/update/delete actions) for most tasks - it's simpler and more reliable.

---

## Key Takeaways

1. **Always check for documents first** - The API requires an open document
2. **Plan before creating** - Think about layout, colors, and structure
3. **Build incrementally** - Create a few shapes, verify, continue
4. **Take screenshots** - Visual verification catches issues immediately
5. **Use JSON files** - Avoid shell escaping headaches
6. **Follow conventions** - Standard patterns make diagrams understandable

Remember: The goal is to create clear, professional diagrams that help users understand complex information. Take your time, plan the layout, and verify your work visually.
