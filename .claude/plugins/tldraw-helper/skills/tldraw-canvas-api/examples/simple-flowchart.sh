#!/bin/bash
# Simple Flowchart Example
# Creates a basic flowchart showing a process flow with decision points

set -e

echo "Creating simple flowchart..."

# Get document ID
DOC_ID=$(curl -s http://localhost:7236/api/doc | jq -r '.docs[0].id')

if [ -z "$DOC_ID" ] || [ "$DOC_ID" = "null" ]; then
    echo "Error: No tldraw document open. Please create a new document (Cmd+N / Ctrl+N)"
    exit 1
fi

# Create flowchart shapes
curl -X POST "http://localhost:7236/api/doc/$DOC_ID/actions" \
  -H 'Content-Type: application/json' \
  -d @- << 'EOF'
{
  "actions": [
    {
      "_type": "create",
      "shape": {
        "_type": "ellipse",
        "shapeId": "start",
        "x": 200,
        "y": 100,
        "w": 120,
        "h": 80,
        "color": "green",
        "fill": "solid",
        "text": "Start",
        "note": ""
      }
    },
    {
      "_type": "create",
      "shape": {
        "_type": "rectangle",
        "shapeId": "process1",
        "x": 180,
        "y": 250,
        "w": 160,
        "h": 100,
        "color": "blue",
        "fill": "solid",
        "text": "Process Data",
        "note": ""
      }
    },
    {
      "_type": "create",
      "shape": {
        "_type": "diamond",
        "shapeId": "decision",
        "x": 190,
        "y": 420,
        "w": 140,
        "h": 100,
        "color": "orange",
        "fill": "solid",
        "text": "Valid?",
        "note": ""
      }
    },
    {
      "_type": "create",
      "shape": {
        "_type": "rectangle",
        "shapeId": "process2",
        "x": 180,
        "y": 590,
        "w": 160,
        "h": 100,
        "color": "blue",
        "fill": "solid",
        "text": "Save Result",
        "note": ""
      }
    },
    {
      "_type": "create",
      "shape": {
        "_type": "rectangle",
        "shapeId": "error",
        "x": 420,
        "y": 420,
        "w": 160,
        "h": 100,
        "color": "red",
        "fill": "solid",
        "text": "Show Error",
        "note": ""
      }
    },
    {
      "_type": "create",
      "shape": {
        "_type": "ellipse",
        "shapeId": "end",
        "x": 200,
        "y": 760,
        "w": 120,
        "h": 80,
        "color": "red",
        "fill": "solid",
        "text": "End",
        "note": ""
      }
    },
    {
      "_type": "create",
      "shape": {
        "_type": "arrow",
        "shapeId": "arrow1",
        "x1": 260,
        "y1": 180,
        "x2": 260,
        "y2": 250,
        "color": "black",
        "note": ""
      }
    },
    {
      "_type": "create",
      "shape": {
        "_type": "arrow",
        "shapeId": "arrow2",
        "x1": 260,
        "y1": 350,
        "x2": 260,
        "y2": 420,
        "color": "black",
        "note": ""
      }
    },
    {
      "_type": "create",
      "shape": {
        "_type": "arrow",
        "shapeId": "arrow3",
        "x1": 260,
        "y1": 520,
        "x2": 260,
        "y2": 590,
        "color": "black",
        "text": "Yes",
        "note": ""
      }
    },
    {
      "_type": "create",
      "shape": {
        "_type": "arrow",
        "shapeId": "arrow4",
        "x1": 330,
        "y1": 470,
        "x2": 420,
        "y2": 470,
        "color": "black",
        "text": "No",
        "note": ""
      }
    },
    {
      "_type": "create",
      "shape": {
        "_type": "arrow",
        "shapeId": "arrow5",
        "x1": 260,
        "y1": 690,
        "x2": 260,
        "y2": 760,
        "color": "black",
        "note": ""
      }
    },
    {
      "_type": "create",
      "shape": {
        "_type": "arrow",
        "shapeId": "arrow6",
        "x1": 500,
        "y1": 520,
        "x2": 500,
        "y2": 800,
        "x2": 340,
        "y2": 800,
        "color": "black",
        "bend": -0.3,
        "note": ""
      }
    }
  ]
}
EOF

echo "Flowchart created successfully!"

# Take screenshot
curl -s "http://localhost:7236/api/doc/$DOC_ID/screenshot?size=medium" \
  -o /tmp/flowchart.jpg

echo "Screenshot saved to /tmp/flowchart.jpg"
