# VSCode httpYac Configuration Skill

Configure VSCode with httpYac for powerful API testing, automation, and CI/CD integration.

## Overview

This skill helps you:
- Convert API documentation to executable .http files
- Set up authentication flows with scripting
- Implement request chaining and response validation
- Configure environment-based testing (dev/test/production)
- Establish Git-based API testing workflows
- Integrate with CI/CD pipelines

## When to Use This Skill

**Ideal scenarios:**
- Setting up new API testing collection
- Converting from Postman/Insomnia/Bruno to httpYac
- Implementing complex authentication flows
- Creating automated API test suites
- Configuring multi-environment testing

**Not recommended for:**
- Quick one-off API requests (use REST Client extension instead)
- Non-HTTP protocols without scripting needs
- Simple curl-style requests

## Skill Structure

```
vscode-httpyac-config/
├── skill.md                      # Main skill definition
├── assets/
│   ├── http-file.template       # Complete .http file template
│   ├── env.template             # .env file template
│   └── httpyac-config.template  # .httpyac.json template
├── references/
│   ├── SYNTAX.md                # Complete syntax reference
│   ├── COMMON_MISTAKES.md       # Common errors to avoid
│   ├── EXAMPLES.md              # Real-world examples
│   └── TROUBLESHOOTING.md       # Error solutions
└── README.md                    # This file
```

## Key Features

### 1. Complete File Structure
- Single-file or multi-file organization
- Environment configuration (.env, .httpyac.json)
- Secure credential management

### 2. Authentication Patterns
- Bearer token (simple and auto-fetch)
- OAuth2 with auto-refresh
- Basic authentication
- Custom authentication flows

### 3. Scripting Capabilities
- Pre-request scripts for dynamic data
- Post-response scripts for validation
- Request chaining with $shared variables
- Test assertions

### 4. Environment Management
- .env file support for secrets (API credentials, tokens)
- .httpyac.json for behavior configuration and environment variables
- Multi-environment switching (dev/test/prod)
- Variables and functions belong in .env files or .http scripts, NOT in httpyac.config.js

### 5. CI/CD Integration
- httpYac CLI support
- GitHub Actions examples
- GitLab CI examples
- Automated testing

## Usage Example

**User request:**
> "Help me set up httpYac for the Jintiankansha API"

**Skill activation:**
```
Skill matched: vscode-httpyac-config - activating now
```

**Skill will:**
1. Analyze API documentation
2. Propose file structure
3. Generate .http files with templates
4. Set up environment configuration
5. Implement authentication scripts
6. Add test assertions
7. Create documentation

## Templates Included

### 1. Complete HTTP File (`http-file.template`)
- Variable declarations
- Authentication flow
- CRUD operations
- Request chaining
- Test assertions
- Error handling

### 2. Environment File (`env.template`)
- API credentials (email, token, API keys)
- Base URLs (baseUrl, apiUrl)
- Configuration options
- **Note**: This is where API variables belong, NOT in httpyac.config.js

### 3. httpYac Configuration (`httpyac-config.template`)
- Logging configuration (log level, colors)
- HTTP request behavior (timeout, proxy)
- Cookie and SSL certificate management
- **Note**: This file configures httpYac's behavior parameters, NOT API variables or functions

## Reference Materials

### SYNTAX.md
Complete syntax guide covering:
- Request basics and separators
- Variable declaration and interpolation (in .http files)
- Headers and body formats
- Scripts (pre-request and post-response)
- Authentication methods
- Environment configuration (.env files and .httpyac.json environments section)

### COMMON_MISTAKES.md
Critical errors to avoid:
- Missing request separators (`###`)
- Using fetch() instead of axios
- Wrong script delimiters
- Variable scope issues
- Environment variable access

### EXAMPLES.md (Coming Soon)
Real-world examples:
- RESTful API collections
- GraphQL queries
- OAuth2 flows
- Request chaining patterns
- Test suites

### TROUBLESHOOTING.md (Coming Soon)
Common issues and solutions:
- Variable not defined
- Scripts not executing
- Environment not loading
- Authentication failures

## Comparison: httpYac vs Bruno

| Feature | httpYac | Bruno |
|---------|---------|-------|
| File Format | .http (plain text) | .bru (custom format) |
| Scripting | Full JavaScript (ES6+) | JavaScript (sandboxed) |
| Pre-request | `<? script ?>` | `script:pre-request {}` |
| Post-response | `?? script ??` | `script:post-response {}` |
| Variables | `{{ var }}` or `@var` | `{{var}}` |
| Shared Vars | `$shared.var` | `bru.setVar()` |
| Environment | .env + .httpyac.json | .bru environment files |
| CLI | `httpyac send` | `bru run` |
| VS Code | Extension | Extension |
| GUI | No | Yes |
| Request Chain | `$shared` variables | Named requests |
| Tests | `test()` + `expect()` | `tests {}` block |
| Multi-protocol | HTTP, GraphQL, gRPC, WS | HTTP, GraphQL |

**httpYac Advantages:**
- ✅ Standard .http format (portable)
- ✅ More powerful scripting
- ✅ Better CI/CD integration
- ✅ Multi-protocol support
- ✅ No GUI dependency

**Bruno Advantages:**
- ✅ User-friendly GUI
- ✅ Built-in collections
- ✅ Easier for beginners
- ✅ Visual request builder

## Installation

### VS Code Extension
```
Extensions → Search "httpYac" → Install
```

### CLI
```bash
npm install -g httpyac
```

## Quick Start

1. **Activate Skill**
   ```
   User: "Help me set up httpYac for my API"
   ```

2. **Follow Prompts**
   - Provide API documentation
   - Choose file structure
   - Confirm authentication method

3. **Review Generated Files**
   - .http files with requests
   - .env.example for credentials
   - .httpyac.json for environments
   - README.md for documentation

4. **Test Setup**
   - Copy .env.example to .env
   - Add real credentials
   - Click "Send Request" in VS Code

## Best Practices

1. **File Organization**
   - Single file for <20 endpoints
   - Multi-file for 20+ endpoints
   - Use `_common.http` for shared setup

2. **Security**
   - Always gitignore .env files
   - Use $processEnv for secrets from .env files
   - Never hardcode credentials
   - Remember: httpyac.config.js is for behavior settings, not credentials

3. **Scripting**
   - Use pre-request for dynamic data
   - Use post-response for validation
   - Store reusable data in $shared

4. **Testing**
   - Add assertions to critical endpoints
   - Test error scenarios
   - Validate response structure

5. **Documentation**
   - Name requests with # @name
   - Add comments for complex logic
   - Document environment variables

## Common Workflows

### Converting from Bruno
1. Export Bruno collection
2. Analyze .bru files structure
3. Generate equivalent .http files
4. Migrate environment variables
5. Convert scripts syntax
6. Test and validate

### Setting up New API
1. Gather API documentation
2. Analyze endpoints and auth
3. Propose file structure
4. Generate templates
5. Configure environments
6. Implement authentication
7. Add test assertions

### CI/CD Integration
1. Set up httpYac CLI
2. Create test suite
3. Configure environment
4. Add GitHub Actions workflow
5. Run automated tests

## Version History

**v1.0.0** (2025-12-13)
- Initial release
- Complete skill structure
- Templates and references
- Based on httpYac v6.x

## Related Skills

- **vscode-bruno-config** - For Bruno-based API testing
- **n8n-workflow-generator** - For n8n workflow creation
- **rsshub-route-creator** - For RSSHub route development

## Support

For issues or questions:
1. Check `references/TROUBLESHOOTING.md`
2. Review `references/COMMON_MISTAKES.md`
3. Consult httpYac documentation: https://httpyac.github.io
4. Ask Claude Code for help

## License

This skill is part of Claude Code's skill ecosystem.

---

**Maintained by:** Claude Code Skill System
**Last Updated:** 2025-12-13
