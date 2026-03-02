#!/bin/bash
# Architecture Diagram Example
# Creates a microservices architecture diagram

set -e

echo "Creating architecture diagram..."

# Get document ID
DOC_ID=$(curl -s http://localhost:7236/api/doc | jq -r '.docs[0].id')

if [ -z "$DOC_ID" ] || [ "$DOC_ID" = "null" ]; then
    echo "Error: No tldraw document open. Please create a new document (Cmd+N / Ctrl+N)"
    exit 1
fi

# Create architecture diagram
curl -X POST "http://localhost:7236/api/doc/$DOC_ID/actions" \
  -H 'Content-Type: application/json' \
  -d @- << 'EOF'
{
  "actions": [
    {
      "_type": "create",
      "shape": {
        "_type": "text",
        "shapeId": "title",
        "x": 400,
        "y": 50,
        "anchor": "top-center",
        "color": "black",
        "fontSize": 28,
        "text": "Microservices Architecture",
        "note": ""
      }
    },
    {
      "_type": "create",
      "shape": {
        "_type": "rectangle",
        "shapeId": "client",
        "x": 350,
        "y": 120,
        "w": 200,
        "h": 80,
        "color": "light-blue",
        "fill": "solid",
        "text": "Web Client",
        "note": ""
      }
    },
    {
      "_type": "create",
      "shape": {
        "_type": "rectangle",
        "shapeId": "api_gateway",
        "x": 350,
        "y": 250,
        "w": 200,
        "h": 100,
        "color": "blue",
        "fill": "solid",
        "text": "API Gateway",
        "note": ""
      }
    },
    {
      "_type": "create",
      "shape": {
        "_type": "rectangle",
        "shapeId": "auth_service",
        "x": 100,
        "y": 420,
        "w": 180,
        "h": 100,
        "color": "violet",
        "fill": "solid",
        "text": "Auth Service",
        "note": ""
      }
    },
    {
      "_type": "create",
      "shape": {
        "_type": "rectangle",
        "shapeId": "user_service",
        "x": 350,
        "y": 420,
        "w": 180,
        "h": 100,
        "color": "violet",
        "fill": "solid",
        "text": "User Service",
        "note": ""
      }
    },
    {
      "_type": "create",
      "shape": {
        "_type": "rectangle",
        "shapeId": "order_service",
        "x": 600,
        "y": 420,
        "w": 180,
        "h": 100,
        "color": "violet",
        "fill": "solid",
        "text": "Order Service",
        "note": ""
      }
    },
    {
      "_type": "create",
      "shape": {
        "_type": "rectangle",
        "shapeId": "auth_db",
        "x": 100,
        "y": 580,
        "w": 180,
        "h": 80,
        "color": "green",
        "fill": "tint",
        "text": "Auth DB",
        "note": ""
      }
    },
    {
      "_type": "create",
      "shape": {
        "_type": "rectangle",
        "shapeId": "user_db",
        "x": 350,
        "y": 580,
        "w": 180,
        "h": 80,
        "color": "green",
        "fill": "tint",
        "text": "User DB",
        "note": ""
      }
    },
    {
      "_type": "create",
      "shape": {
        "_type": "rectangle",
        "shapeId": "order_db",
        "x": 600,
        "y": 580,
        "w": 180,
        "h": 80,
        "color": "green",
        "fill": "tint",
        "text": "Order DB",
        "note": ""
      }
    },
    {
      "_type": "create",
      "shape": {
        "_type": "cloud",
        "shapeId": "cache",
        "x": 850,
        "y": 420,
        "w": 150,
        "h": 100,
        "color": "orange",
        "fill": "tint",
        "text": "Redis Cache",
        "note": ""
      }
    },
    {
      "_type": "create",
      "shape": {
        "_type": "cloud",
        "shapeId": "queue",
        "x": 850,
        "y": 250,
        "w": 150,
        "h": 100,
        "color": "yellow",
        "fill": "tint",
        "text": "Message Queue",
        "note": ""
      }
    },
    {
      "_type": "create",
      "shape": {
        "_type": "arrow",
        "shapeId": "arrow1",
        "x1": 450,
        "y1": 200,
        "x2": 450,
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
        "x1": 450,
        "y1": 350,
        "x2": 190,
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
        "x1": 450,
        "y1": 350,
        "x2": 440,
        "y2": 420,
        "color": "black",
        "note": ""
      }
    },
    {
      "_type": "create",
      "shape": {
        "_type": "arrow",
        "shapeId": "arrow4",
        "x1": 450,
        "y1": 350,
        "x2": 690,
        "y2": 420,
        "color": "black",
        "note": ""
      }
    },
    {
      "_type": "create",
      "shape": {
        "_type": "arrow",
        "shapeId": "arrow5",
        "x1": 190,
        "y1": 520,
        "x2": 190,
        "y2": 580,
        "color": "green",
        "note": ""
      }
    },
    {
      "_type": "create",
      "shape": {
        "_type": "arrow",
        "shapeId": "arrow6",
        "x1": 440,
        "y1": 520,
        "x2": 440,
        "y2": 580,
        "color": "green",
        "note": ""
      }
    },
    {
      "_type": "create",
      "shape": {
        "_type": "arrow",
        "shapeId": "arrow7",
        "x1": 690,
        "y1": 520,
        "x2": 690,
        "y2": 580,
        "color": "green",
        "note": ""
      }
    },
    {
      "_type": "create",
      "shape": {
        "_type": "arrow",
        "shapeId": "arrow8",
        "x1": 780,
        "y1": 470,
        "x2": 850,
        "y2": 470,
        "color": "orange",
        "note": ""
      }
    },
    {
      "_type": "create",
      "shape": {
        "_type": "arrow",
        "shapeId": "arrow9",
        "x1": 550,
        "y1": 300,
        "x2": 850,
        "y2": 300,
        "color": "yellow",
        "note": ""
      }
    },
    {
      "_type": "create",
      "shape": {
        "_type": "note",
        "shapeId": "note1",
        "x": 100,
        "y": 700,
        "color": "light-blue",
        "text": "Each service has its own database (Database per Service pattern)",
        "note": ""
      }
    },
    {
      "_type": "create",
      "shape": {
        "_type": "note",
        "shapeId": "note2",
        "x": 600,
        "y": 700,
        "color": "yellow",
        "text": "Services communicate via message queue for async operations",
        "note": ""
      }
    }
  ]
}
EOF

echo "Architecture diagram created successfully!"

# Take screenshot
curl -s "http://localhost:7236/api/doc/$DOC_ID/screenshot?size=large" \
  -o /tmp/architecture.jpg

echo "Screenshot saved to /tmp/architecture.jpg"
