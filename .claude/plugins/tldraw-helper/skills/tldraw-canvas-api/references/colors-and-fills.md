# Colors and Fill Styles Reference

Complete reference for colors and fill styles in tldraw Desktop.

## Available Colors

### Primary Colors

- `red` - Bright red
- `green` - Bright green
- `blue` - Bright blue

### Light Variants

- `light-red` - Soft pink/light red
- `light-green` - Soft mint/light green
- `light-blue` - Soft sky blue
- `light-violet` - Soft lavender

### Additional Colors

- `orange` - Bright orange
- `yellow` - Bright yellow
- `violet` - Purple/violet
- `grey` - Medium grey
- `black` - Black
- `white` - White

## Fill Styles

### none

No fill - only the outline is visible.

```json
{
  "color": "blue",
  "fill": "none"
}
```

**Use for:**
- Wireframes
- Minimal designs
- Emphasizing outlines

### tint

Light transparent fill with visible outline.

```json
{
  "color": "blue",
  "fill": "tint"
}
```

**Use for:**
- Subtle backgrounds
- Layered diagrams
- Secondary elements

### background

Solid background color fill, slightly lighter than the outline.

```json
{
  "color": "blue",
  "fill": "background"
}
```

**Use for:**
- Standard shapes
- Balanced appearance
- General purpose

### solid

Solid fill matching the outline color.

```json
{
  "color": "blue",
  "fill": "solid"
}
```

**Use for:**
- Emphasis
- Primary elements
- High contrast

### pattern

Diagonal line pattern fill.

```json
{
  "color": "blue",
  "fill": "pattern"
}
```

**Use for:**
- Texture
- Distinguishing similar shapes
- Special states (disabled, draft, etc.)

## Color Coding Best Practices

### By Function

- **Blue** - Primary processes, main components
- **Green** - Success states, completed items, databases
- **Red** - Error states, critical items, alerts
- **Orange** - Warning states, decisions, pending items
- **Yellow** - Notes, highlights, important information
- **Violet** - Special components, services, APIs
- **Grey** - Inactive, disabled, or secondary items
- **Black** - Text, labels, neutral elements

### By Layer

- **Light colors** - Background layers, supporting elements
- **Bright colors** - Foreground layers, primary elements
- **Grey/Black** - Text and annotations

### By Status

- **Green** - Active, running, healthy
- **Yellow** - Warning, attention needed
- **Red** - Error, stopped, critical
- **Grey** - Inactive, disabled

### By Type

- **Blue** - User-facing components
- **Violet** - Backend services
- **Green** - Data storage
- **Orange** - External services
- **Yellow** - Queues and messaging

## Combination Examples

### Flowchart

```json
{
  "start": {"color": "green", "fill": "solid"},
  "process": {"color": "blue", "fill": "solid"},
  "decision": {"color": "orange", "fill": "solid"},
  "end": {"color": "red", "fill": "solid"}
}
```

### Architecture Diagram

```json
{
  "frontend": {"color": "blue", "fill": "solid"},
  "backend": {"color": "violet", "fill": "solid"},
  "database": {"color": "green", "fill": "tint"},
  "external": {"color": "orange", "fill": "pattern"}
}
```

### Mind Map

```json
{
  "central": {"color": "violet", "fill": "solid"},
  "category1": {"color": "blue", "fill": "tint"},
  "category2": {"color": "green", "fill": "tint"},
  "category3": {"color": "orange", "fill": "tint"},
  "details": {"color": "grey", "fill": "none"}
}
```

### Status Indicators

```json
{
  "healthy": {"color": "green", "fill": "solid"},
  "warning": {"color": "yellow", "fill": "solid"},
  "error": {"color": "red", "fill": "solid"},
  "unknown": {"color": "grey", "fill": "pattern"}
}
```

## Accessibility Considerations

1. **Contrast** - Ensure sufficient contrast between fill and text
2. **Color blindness** - Don't rely solely on color; use shapes and labels too
3. **Patterns** - Use fill patterns as an additional differentiator
4. **Text color** - Use black text on light fills, white on dark fills

## Tips

1. **Consistency** - Use the same color for the same meaning throughout
2. **Limit palette** - Use 3-5 colors maximum for clarity
3. **Hierarchy** - Use brighter/darker colors for more important elements
4. **Test combinations** - Preview your diagram to ensure colors work together
5. **Cultural context** - Be aware that colors have different meanings in different cultures
