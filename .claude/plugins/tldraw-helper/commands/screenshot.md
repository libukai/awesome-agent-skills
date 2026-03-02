---
description: Capture a screenshot of the current tldraw canvas
argument-hint: "[size] [output]"
---

# Take tldraw Screenshot

Capture the current tldraw canvas as an image.

## Usage

```
/tldraw:screenshot [size] [output]
```

## Examples

- `/tldraw:screenshot` - Default medium size
- `/tldraw:screenshot large` - Large screenshot
- `/tldraw:screenshot medium /tmp/my-diagram.jpg` - Custom output path

## Size Options

- **small** - 768px longest edge
- **medium** - 1536px longest edge (default)
- **large** - 3072px longest edge
- **full** - 5000px longest edge

---

## Implementation

1. Get the document ID:
   ```bash
   DOC_ID=$(curl -s http://localhost:7236/api/doc | jq -r '.docs[0].id')
   ```

2. Take screenshot:
   ```bash
   SIZE=${size:-medium}
   OUTPUT=${output:-/tmp/tldraw_screenshot.jpg}

   curl -s "http://localhost:7236/api/doc/$DOC_ID/screenshot?size=$SIZE" \
     -o "$OUTPUT"
   ```

3. Display the image to the user using the Read tool

4. Inform the user where the file was saved
