#!/bin/bash

# tldraw-helper Plugin Test Script
# This script tests the basic functionality of the tldraw-helper plugin

set -e

echo "🧪 Testing tldraw-helper plugin..."
echo ""

# Test 1: Check plugin structure
echo "✅ Test 1: Plugin structure"
if [ -f ".claude/plugins/tldraw-helper/plugin.json" ]; then
    echo "   ✓ plugin.json exists"
else
    echo "   ✗ plugin.json missing"
    exit 1
fi

# Test 2: Validate plugin.json
echo "✅ Test 2: Validate plugin.json"
if jq empty .claude/plugins/tldraw-helper/plugin.json 2>/dev/null; then
    echo "   ✓ Valid JSON format"
else
    echo "   ✗ Invalid JSON format"
    exit 1
fi

# Test 3: Check required files
echo "✅ Test 3: Required files"
required_files=(
    "README.md"
    "skills/tldraw-canvas-api/SKILL.md"
    "commands/draw.md"
    "commands/screenshot.md"
    "commands/list.md"
    "commands/clear.md"
    "agents/diagram-creator.md"
)

for file in "${required_files[@]}"; do
    if [ -f ".claude/plugins/tldraw-helper/$file" ]; then
        echo "   ✓ $file exists"
    else
        echo "   ✗ $file missing"
        exit 1
    fi
done

# Test 4: Check frontmatter format
echo "✅ Test 4: Frontmatter format"
for file in .claude/plugins/tldraw-helper/skills/*/SKILL.md .claude/plugins/tldraw-helper/{commands,agents}/*.md; do
    if head -1 "$file" | grep -q "^---$"; then
        echo "   ✓ $(basename $file) has valid frontmatter"
    else
        echo "   ✗ $(basename $file) missing frontmatter"
        exit 1
    fi
done

# Test 5: Check tldraw API availability (optional)
echo "✅ Test 5: tldraw API availability"
if curl -s --connect-timeout 2 http://localhost:7236/api/doc > /dev/null 2>&1; then
    echo "   ✓ tldraw Desktop API is accessible"
    DOC_COUNT=$(curl -s http://localhost:7236/api/doc | jq '.docs | length')
    echo "   ℹ️  Open documents: $DOC_COUNT"
else
    echo "   ⚠️  tldraw Desktop not running (this is optional)"
fi

echo ""
echo "🎉 All tests passed!"
echo ""
echo "Plugin is ready to use. Install with:"
echo "  /plugin marketplace add likai/awesome-agent-skills"
echo "  /plugin install tldraw-helper"
