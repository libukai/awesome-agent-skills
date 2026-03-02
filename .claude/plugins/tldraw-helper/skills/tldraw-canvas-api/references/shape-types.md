# Shape Types Reference

Complete reference for all shape types supported by tldraw Desktop Canvas API.

## Geometric Shapes

All geometric shapes use the same base structure:

```json
{
  "_type": "shape_type",
  "shapeId": "unique_id",
  "x": 100,
  "y": 100,
  "w": 200,
  "h": 150,
  "color": "blue",
  "fill": "solid",
  "text": "Optional text",
  "note": ""
}
```

### Available Geometric Types

**Basic Shapes:**
- `rectangle` - Rectangle with optional rounded corners
- `ellipse` - Circle or ellipse
- `triangle` - Triangle
- `diamond` - Diamond/rhombus shape

**Polygons:**
- `hexagon` - Six-sided polygon
- `pentagon` - Five-sided polygon
- `octagon` - Eight-sided polygon

**Special Shapes:**
- `star` - Five-pointed star
- `heart` - Heart shape
- `cloud` - Cloud shape
- `pill` - Rounded rectangle (pill shape)

**Boxes:**
- `x-box` - Box with X inside
- `check-box` - Box with checkmark

**Arrows (Geometric):**
- `fat-arrow-right` - Thick arrow pointing right
- `fat-arrow-left` - Thick arrow pointing left
- `fat-arrow-up` - Thick arrow pointing up
- `fat-arrow-down` - Thick arrow pointing down

**Parallelograms:**
- `trapezoid` - Trapezoid shape
- `parallelogram-right` - Parallelogram slanting right
- `parallelogram-left` - Parallelogram slanting left

## Text Shape

Text shapes for labels and annotations.

```json
{
  "_type": "text",
  "shapeId": "label1",
  "x": 100,
  "y": 100,
  "anchor": "top-left",
  "color": "black",
  "fontSize": 16,
  "maxWidth": null,
  "note": "",
  "text": "Your text here"
}
```

### Anchor Options

Controls text alignment and positioning:

- `top-left`, `top-center`, `top-right`
- `center-left`, `center`, `center-right`
- `bottom-left`, `bottom-center`, `bottom-right`

### Font Size

Default is 16. Common sizes: 12, 14, 16, 18, 20, 24, 28, 32, 36, 48

## Arrow Shape

Arrows for connecting shapes and showing flow.

```json
{
  "_type": "arrow",
  "shapeId": "arrow1",
  "x1": 100,
  "y1": 100,
  "x2": 300,
  "y2": 200,
  "color": "black",
  "bend": 0,
  "text": "Optional label",
  "note": "",
  "fromId": "optional_source_shape",
  "toId": "optional_target_shape"
}
```

### Properties

- `x1, y1` - Start point coordinates
- `x2, y2` - End point coordinates
- `bend` - Curve amount (-1 to 1, 0 is straight)
- `fromId, toId` - Optional shape IDs to bind arrow to shapes
- `text` - Optional label on the arrow

## Line Shape

Simple straight lines.

```json
{
  "_type": "line",
  "shapeId": "line1",
  "x1": 100,
  "y1": 100,
  "x2": 300,
  "y2": 100,
  "color": "black",
  "note": ""
}
```

## Sticky Note

Post-it style notes for annotations.

```json
{
  "_type": "note",
  "shapeId": "note1",
  "x": 100,
  "y": 100,
  "color": "yellow",
  "text": "Sticky note content",
  "note": ""
}
```

### Note Colors

Best colors for sticky notes:
- `yellow` - Classic sticky note
- `light-blue` - Information
- `light-green` - Success/positive
- `light-red` - Warning/important
- `orange` - Action items

## Read-Only Shapes

These shapes can be read but not created via the API:

### Pen/Draw Shape

```json
{
  "_type": "pen",
  "shapeId": "pen1",
  "color": "black",
  "fill": "none",
  "note": ""
}
```

Created by drawing with the pen tool in tldraw.

### Image Shape

```json
{
  "_type": "image",
  "shapeId": "img1",
  "x": 100,
  "y": 100,
  "w": 400,
  "h": 300,
  "altText": "Image description",
  "note": ""
}
```

Images must be added through the tldraw UI.

### Unknown Shape

```json
{
  "_type": "unknown",
  "shapeId": "unknown1",
  "subType": "custom",
  "x": 100,
  "y": 100,
  "note": ""
}
```

Represents shapes not recognized by the API.

## Common Properties

### Position and Size

- `x, y` - Top-left corner position in pixels
- `w, h` - Width and height in pixels (for geometric shapes)
- `x1, y1, x2, y2` - Start and end points (for arrows and lines)

### Styling

- `color` - Shape color (see colors-and-fills.md)
- `fill` - Fill style (see colors-and-fills.md)
- `text` - Text content displayed on the shape
- `note` - Internal note (not displayed)

### Identifiers

- `shapeId` - Unique identifier for the shape
  - Use descriptive IDs: `header`, `process1`, `decision_point`
  - Avoid special characters except underscore and hyphen
  - IDs are case-sensitive

## Usage Tips

1. **Choose the right shape** - Use rectangles for processes, diamonds for decisions, ellipses for start/end
2. **Consistent sizing** - Use standard sizes (100x80, 150x100, 200x120) for uniformity
3. **Grid alignment** - Position shapes at multiples of 50 for clean alignment
4. **Meaningful IDs** - Use descriptive shape IDs for easier reference and updates
5. **Text length** - Keep text concise (2-4 words) for readability
6. **Color coding** - Use consistent colors to convey meaning across your diagram
