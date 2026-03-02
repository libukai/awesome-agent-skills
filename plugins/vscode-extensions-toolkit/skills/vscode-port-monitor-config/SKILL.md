---
name: vscode-port-monitor-config
description: Configure VS Code Port Monitor extension (dkurokawa.vscode-port-monitor) for real-time port status monitoring. Provides configuration templates for Vite, Next.js, Node.js, and other development environments with best practices and troubleshooting guides.
---

# VS Code Port Monitor Configuration

## Overview

Configure the VS Code Port Monitor extension to monitor development server ports in real-time. This skill provides complete configuration guidance, templates for common development scenarios, and troubleshooting solutions.

**Extension**: [dkurokawa.vscode-port-monitor](https://github.com/dkurokawa/vscode-port-monitor)

## When to Use This Skill

Invoke this skill when:
- Setting up port monitoring for development servers
- Configuring multi-port monitoring for microservices
- Need to track Vite, Next.js, or other dev server status
- Want to manage processes using specific ports
- Troubleshooting port conflicts

## Quick Start

| Task | Example |
|------|---------|
| Configure for Vite project | "配置 Port Monitor 监控 Vite 开发服务器" |
| Add multiple ports | "监控 3000, 3001, 8080 端口" |
| Configure with groups | "为前端和后端服务器分组监控端口" |

---

## Core Concepts

### Port Monitor Features

- 🔍 **Real-time monitoring** - Live status bar display
- 🏷️ **Intelligent configuration** - Supports arrays, ranges, well-known ports
- 🛑 **Process management** - Kill processes using ports
- 🎨 **Customizable display** - Icons, colors, positioning
- 📊 **Multiple groups** - Organize ports by service/project

### Status Icons

- 🟢 = Port is in use (service running)
- ⚪️ = Port is free (service stopped)

---

## Configuration Format

### Location

Port Monitor configuration goes in `.vscode/settings.json`:

```json
{
  "portMonitor.hosts": { ... },
  "portMonitor.statusIcons": { ... },
  "portMonitor.intervalMs": 3000,
  ...
}
```

### Basic Structure

```json
{
  "portMonitor.hosts": {
    "GroupName": {
      "port": "label",
      "__CONFIG": {
        "compact": true,
        "bgcolor": "blue",
        "show_title": true
      }
    }
  }
}
```

---

## Configuration Templates

### Template 1: Vite Project (Single Dev Server)

```json
{
  "portMonitor.hosts": {
    "Development": {
      "5173": "dev",
      "__CONFIG": {
        "compact": true,
        "bgcolor": "blue",
        "show_title": true
      }
    }
  },
  "portMonitor.statusIcons": {
    "inUse": "🟢 ",
    "free": "⚪️ "
  },
  "portMonitor.intervalMs": 3000,
  "portMonitor.statusBarPosition": "right",
  "portMonitor.enableProcessKill": true
}
```

**Display**: `Development: [🟢 dev:5173]`

### Template 2: Vite with Preview Server

```json
{
  "portMonitor.hosts": {
    "Project": {
      "5173": "dev",
      "4173": "preview",
      "__CONFIG": {
        "compact": true,
        "bgcolor": "blue",
        "show_title": true,
        "separator": " | "
      }
    }
  },
  "portMonitor.statusIcons": {
    "inUse": "🟢 ",
    "free": "⚪️ "
  },
  "portMonitor.intervalMs": 3000,
  "portMonitor.statusBarPosition": "right"
}
```

**Display**: `Project: [🟢 dev:5173 | ⚪️ preview:4173]`

### Template 3: Full Stack (Frontend + Backend + AI)

```json
{
  "portMonitor.hosts": {
    "MyProject": {
      "5173": "dev",
      "4173": "preview",
      "3200": "ai",
      "__CONFIG": {
        "compact": true,
        "bgcolor": "blue",
        "show_title": true,
        "separator": " | "
      }
    }
  },
  "portMonitor.statusIcons": {
    "inUse": "🟢 ",
    "free": "⚪️ "
  },
  "portMonitor.intervalMs": 3000,
  "portMonitor.statusBarPosition": "right",
  "portMonitor.enableProcessKill": true,
  "portMonitor.displayOptions.showFullPortNumber": true
}
```

**Display**: `MyProject: [🟢 dev:5173 | ⚪️ preview:4173 | 🟢 ai:3200]`


### Template 4: Next.js Project

```json
{
  "portMonitor.hosts": {
    "Next.js": {
      "3000": "app",
      "3001": "api",
      "__CONFIG": {
        "compact": true,
        "bgcolor": "green",
        "show_title": true
      }
    }
  },
  "portMonitor.statusIcons": {
    "inUse": "🟢 ",
    "free": "⚪️ "
  }
}
```

### Template 5: Microservices (Multiple Groups)

```json
{
  "portMonitor.hosts": {
    "Frontend": {
      "3000": "react",
      "8080": "webpack",
      "__CONFIG": {
        "compact": true,
        "bgcolor": "blue",
        "show_title": true
      }
    },
    "Backend": {
      "3001": "api",
      "5432": "postgres",
      "6379": "redis",
      "__CONFIG": {
        "compact": true,
        "bgcolor": "yellow",
        "show_title": true
      }
    }
  },
  "portMonitor.statusIcons": {
    "inUse": "🟢 ",
    "free": "⚪️ "
  }
}
```

**Display**: `Frontend: [🟢 react:3000 | 🟢 webpack:8080]  Backend: [🟢 api:3001 | 🟢 postgres:5432 | ⚪️ redis:6379]`

### Template 6: Port Range Expansion

```json
{
  "portMonitor.hosts": {
    "Development": ["3000-3003", "8080"]
  }
}
```

Automatically expands to: 3000, 3001, 3002, 3003, 8080

---

## Configuration Options Reference

### portMonitor.hosts

Main configuration object for monitored ports.

**Format**:
```json
{
  "GroupName": {
    "port": "label",
    "__CONFIG": { ... }
  }
}
```

**Supported formats**:
- Simple array: `["3000", "3001"]`
- Port range: `["3000-3009"]`
- Object with labels: `{"3000": "dev", "3001": "api"}`
- Well-known ports: `["http", "https", "postgresql"]`

### __CONFIG Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `compact` | boolean | false | Compact display mode |
| `bgcolor` | string | none | Background color |
| `show_title` | boolean | false | Show group title |
| `separator` | string | "\|" | Port separator |

**Background colors**:
- Simple: `"red"`, `"yellow"`, `"blue"`, `"green"`
- VS Code theme: `"statusBarItem.errorBackground"`, `"statusBarItem.warningBackground"`

### portMonitor.statusIcons

Customize status icons.

```json
{
  "inUse": "🟢 ",
  "free": "⚪️ "
}
```

**Tip**: Add space after emoji for better readability: `"🟢 "` instead of `"🟢"`

### portMonitor.intervalMs

Monitoring refresh interval in milliseconds.

- **Default**: 3000 (3 seconds)
- **Minimum**: 1000 (1 second)
- **Recommended**: 3000-5000 for balance between responsiveness and performance

### portMonitor.statusBarPosition

Status bar display position.

- `"left"` - Left side of status bar
- `"right"` - Right side of status bar (default)

### portMonitor.enableProcessKill

Enable process termination feature.

- `true` - Allow killing processes via status bar (default)
- `false` - Disable process management

### portMonitor.displayOptions.showFullPortNumber

Show full port numbers in display.

- `true` - Show complete port numbers
- `false` - May abbreviate in compact mode

---

## Common Scenarios

### Scenario 1: Vite + Shadcn Studio

**Use case**: Monitor Vite dev server and Shadcn Studio AI service

```json
{
  "portMonitor.hosts": {
    "NorthBorder": {
      "5173": "dev",
      "4173": "preview",
      "3200": "ai",
      "__CONFIG": {
        "compact": true,
        "bgcolor": "blue",
        "show_title": true,
        "separator": " | "
      }
    }
  },
  "portMonitor.statusIcons": {
    "inUse": "🟢 ",
    "free": "⚪️ "
  },
  "portMonitor.intervalMs": 3000,
  "portMonitor.statusBarPosition": "right",
  "portMonitor.enableProcessKill": true,
  "portMonitor.displayOptions.showFullPortNumber": true
}
```

### Scenario 2: Full Stack Development

**Use case**: Frontend (React), Backend (Node.js), Database (PostgreSQL)

```json
{
  "portMonitor.hosts": {
    "Frontend": {
      "3000": "react",
      "__CONFIG": {
        "compact": true,
        "bgcolor": "blue"
      }
    },
    "Backend": {
      "3001": "api",
      "5432": "db",
      "__CONFIG": {
        "compact": true,
        "bgcolor": "green"
      }
    }
  }
}
```

### Scenario 3: Multiple Environments

**Use case**: Dev, Staging, Production ports

```json
{
  "portMonitor.hosts": {
    "Environments": {
      "3000": "dev",
      "3001": "staging",
      "3002": "prod",
      "__CONFIG": {
        "compact": true,
        "show_title": true
      }
    }
  }
}
```

---

## Best Practices

### 1. Use Descriptive Labels

✅ Good:
```json
{
  "5173": "dev",
  "4173": "preview",
  "3200": "ai"
}
```

❌ Bad:
```json
{
  "5173": "1",
  "4173": "2",
  "3200": "3"
}
```

### 2. Group Related Services

```json
{
  "Frontend": { ... },
  "Backend": { ... },
  "Database": { ... }
}
```

### 3. Add Space After Emoji

```json
{
  "inUse": "🟢 ",   // ✅ Good - space after emoji
  "free": "⚪️ "     // ✅ Good
}
```

### 4. Use Appropriate Refresh Interval

- **Fast-changing services**: 2000-3000ms
- **Stable services**: 5000-10000ms
- **Battery-conscious**: 5000ms+

### 5. Enable Process Kill for Development

```json
{
  "portMonitor.enableProcessKill": true
}
```

Allows quick termination of stuck processes.

---

## Troubleshooting

### Issue 1: Port Monitor Not Showing

**Symptoms**: Status bar doesn't show port status

**Solutions**:
1. Check if extension is installed:
   ```bash
   code --list-extensions | grep port-monitor
   ```

2. Verify configuration in `.vscode/settings.json`

3. Reload VS Code window: `Cmd+Shift+P` → "Reload Window"

### Issue 2: Configuration Errors

**Symptoms**: "Port Monitor: Configuration Error" in status bar

**Common causes**:
- Reversed port-label format
- Empty host name
- Invalid JSON syntax

**Fix**: Check configuration format:
```json
// ❌ Wrong
{
  "localhost": {
    "dev": 5173  // Reversed!
  }
}

// ✅ Correct
{
  "localhost": {
    "5173": "dev"
  }
}
```

### Issue 3: Ports Not Detected

**Symptoms**: All ports show as ⚪️ (free) when they're actually in use

**Solutions**:
1. Check if ports are actually in use:
   ```bash
   lsof -i :5173
   ```

2. Increase refresh interval:
   ```json
   {
     "portMonitor.intervalMs": 5000
   }
   ```

3. Check port permissions (some ports require sudo)

### Issue 4: Process Kill Not Working

**Symptoms**: "Kill Process" option doesn't terminate process

**Solutions**:
1. Ensure feature is enabled:
   ```json
   {
     "portMonitor.enableProcessKill": true
   }
   ```

2. Check process permissions (may need sudo for system processes)

3. Use manual kill:
   ```bash
   lsof -ti :5173 | xargs kill -9
   ```

---

## Integration with Other Tools

### With Vite

Vite uses port 5173 for dev, 4173 for preview:

```json
{
  "portMonitor.hosts": {
    "Vite": {
      "5173": "dev",
      "4173": "preview"
    }
  }
}
```

### With Next.js

Next.js typically uses port 3000:

```json
{
  "portMonitor.hosts": {
    "Next.js": {
      "3000": "app"
    }
  }
}
```

### With Docker Compose

Monitor exposed ports from docker-compose.yml:

```json
{
  "portMonitor.hosts": {
    "Docker": {
      "8080": "web",
      "5432": "postgres",
      "6379": "redis"
    }
  }
}
```

---

## Advanced Configuration

### Pattern Match Labels

Use wildcards for dynamic labeling:

```json
{
  "portMonitor.portLabels": {
    "3000": "main-app",
    "300*": "dev-env",
    "8080": "proxy",
    "*": "service"
  }
}
```

### Custom Port Emojis

```json
{
  "portMonitor.portEmojis": {
    "dev": "🚀",
    "api": "⚡",
    "db": "🗄️"
  }
}
```

### Multiple Separators

```json
{
  "__CONFIG": {
    "separator": " → "
  }
}
```

**Display**: `Project: [🟢 dev:5173 → ⚪️ preview:4173]`

---

## Quick Reference

### Common Ports

| Port | Service | Label Suggestion |
|------|---------|------------------|
| 3000 | Next.js / React | `"app"` or `"dev"` |
| 3001 | API Server | `"api"` |
| 3200 | Shadcn Studio | `"ai"` |
| 4173 | Vite Preview | `"preview"` |
| 5173 | Vite Dev | `"dev"` |
| 5432 | PostgreSQL | `"postgres"` or `"db"` |
| 6379 | Redis | `"redis"` |
| 8080 | HTTP Proxy | `"proxy"` |

### Keyboard Shortcuts

- Click status bar → Select port → View/Kill process
- `Cmd+Shift+P` → "Port Monitor" → Access commands

---

## Related Resources

- [Port Monitor GitHub](https://github.com/dkurokawa/vscode-port-monitor)
- [VS Code Extension Marketplace](https://marketplace.visualstudio.com/items?itemName=dkurokawa.vscode-port-monitor)
- [Configuration Examples](https://github.com/dkurokawa/vscode-port-monitor/tree/main/examples)

---

## Workflow Example

### Step 1: Install Extension

```bash
code --install-extension dkurokawa.vscode-port-monitor
```

### Step 2: Create Configuration

Add to `.vscode/settings.json`:

```json
{
  "portMonitor.hosts": {
    "MyProject": {
      "5173": "dev",
      "4173": "preview"
    }
  },
  "portMonitor.statusIcons": {
    "inUse": "🟢 ",
    "free": "⚪️ "
  }
}
```

### Step 3: Start Development Server

```bash
pnpm run dev
```

### Step 4: Monitor Status

Check status bar: `MyProject: [🟢 dev:5173 | ⚪️ preview:4173]`

### Step 5: Manage Processes

Click status bar → Select port → Kill process if needed

---

## Summary

Port Monitor provides real-time visibility into development server status directly in VS Code's status bar. Key benefits:

- ✅ Instant port status visibility
- ✅ Quick process management
- ✅ Organized multi-service monitoring
- ✅ Customizable display
- ✅ Zero external dependencies

**Recommended for**: Vite, Next.js, React, Node.js, microservices, full-stack development.
