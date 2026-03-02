# VSCode Extensions Toolkit

A comprehensive plugin for configuring and using popular VSCode extensions for development workflows.

## Overview

This plugin bundles three essential VSCode extension configuration skills:

- 🔌 **httpYac Config**: API testing and automation
- 📊 **Port Monitor Config**: Development server monitoring
- 🚀 **SFTP Config**: Static website deployment

## Installation

```bash
/plugin install ./plugins/vscode-extensions-toolkit
```

## Included Skills

### vscode-httpyac-config
Configure httpYac for API testing with authentication, request chaining, and CI/CD integration.

### vscode-port-monitor-config
Set up port monitoring for Vite, Next.js, Node.js and other development servers.

### vscode-sftp-config
Configure SFTP deployment with Nginx optimization for static websites.

## Usage

Skills will auto-trigger based on context, or invoke manually:

```bash
/vscode-extensions-toolkit:vscode-httpyac-config
/vscode-extensions-toolkit:vscode-port-monitor-config
/vscode-extensions-toolkit:vscode-sftp-config
```

## License

Apache 2.0
