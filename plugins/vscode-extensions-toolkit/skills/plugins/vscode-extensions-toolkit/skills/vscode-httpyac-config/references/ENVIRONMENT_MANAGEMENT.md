# Environment Management in httpYac

Complete guide to managing environments, configuration files, and variables in httpYac.

## Overview

httpYac supports multiple environment management approaches:

1. **.env files** (Recommended) - Environment variables with dotenv support
2. **.httpyac.json** - JSON-based configuration (simple, recommended for settings)
3. **httpyac.config.js** - JavaScript-based configuration (for dynamic logic)

**Best Practice:** Use .env files for **variables** (API_BASE_URL, API_TOKEN), and configuration files for **behavior settings** (timeout, log level, proxy).

---

## .env Files (Recommended for Variables)

### Basic Setup

**File: `.env` (Development)**

```env
API_BASE_URL=http://localhost:3000
API_USER=dev@example.com
API_TOKEN=dev_token_12345
DEBUG=true
```

**File: `.env.production` (Production)**

```env
API_BASE_URL=https://api.production.com
API_USER=prod@example.com
API_TOKEN=prod_secure_token
DEBUG=false
```

**File: `.env.local` (Local Overrides - gitignored)**

```env
API_BASE_URL=http://192.168.1.100:3000
API_USER=local@example.com
```

### Usage in .http Files

```http
# Load environment variables
@baseUrl = {{API_BASE_URL}}
@user = {{API_USER}}
@token = {{API_TOKEN}}

###

GET {{baseUrl}}/api/users
Authorization: Bearer {{token}}
X-User: {{user}}
```

### Environment Switching

**In VS Code:**

-   Status bar shows current environment
-   Click to switch between environments
-   httpYac automatically loads corresponding .env file

**In CLI:**

```bash
# Default (uses .env)
httpyac send api.http

# Production
httpyac send api.http --env production

# Custom environment
httpyac send api.http --env staging
```

### .env File Naming Convention

| File              | Purpose                        | Loaded When        |
| ----------------- | ------------------------------ | ------------------ |
| `.env`            | Default/Development            | Always (default)   |
| `.env.production` | Production                     | `--env production` |
| `.env.test`       | Testing                        | `--env test`       |
| `.env.staging`    | Staging                        | `--env staging`    |
| `.env.local`      | Local overrides                | Always (if exists) |
| `.env.*.local`    | Environment-specific overrides | With parent env    |

**Priority:** `.env.production.local` > `.env.production` > `.env.local` > `.env`

### .env File Syntax

```env
# ✅ Correct syntax
API_BASE_URL=http://localhost:3000
API_TOKEN=abc123
ENABLE_DEBUG=true

# ❌ Wrong - quotes included in value
API_BASE_URL="http://localhost:3000"  # Value will be: "http://localhost:3000"
API_TOKEN='abc123'                     # Value will be: 'abc123'

# Comments
# This is a comment
API_KEY=key123  # Inline comment works too

# Multi-line values (not recommended, use separate variables instead)
DESCRIPTION=First line\nSecond line

# Empty values
OPTIONAL_SETTING=
```

### .env.example Template

**File: `.env.example`**

```env
# API Configuration
API_BASE_URL=http://localhost:3000
API_USER=your-email@example.com
API_TOKEN=your-token-here

# Feature Flags
DEBUG=false
ENABLE_LOGGING=true

# Optional Settings
PROXY_URL=
TIMEOUT=30000
```

**Instructions for team members:**

```bash
# 1. Copy example file
cp .env.example .env

# 2. Edit .env with your actual credentials
# Never commit .env to git!
```

---

## Configuration Files

### Option A: .httpyac.json (Simple, Recommended)

**Use for:** Behavior settings only (timeout, logging, proxy). **DO NOT use for environment variables.**

**File: `.httpyac.json`**

```json
{
	"log": {
		"level": "warn",
		"supportAnsiColors": true
	},
	"request": {
		"timeout": 30000,
		"rejectUnauthorized": true
	},
	"cookieJarEnabled": true,
	"responseViewPrettyPrint": true
}
```

**⚠️ IMPORTANT:** This file configures httpYac's **behavior**, NOT API variables. For API variables (baseUrl, token), use `.env` files.

**Configuration Options:**

| Option                       | Type    | Description                               |
| ---------------------------- | ------- | ----------------------------------------- |
| `log.level`                  | string  | `trace`, `debug`, `info`, `warn`, `error` |
| `log.supportAnsiColors`      | boolean | Enable colored output                     |
| `request.timeout`            | number  | Timeout in milliseconds                   |
| `request.rejectUnauthorized` | boolean | Verify SSL certificates                   |
| `cookieJarEnabled`           | boolean | Enable cookie jar                         |
| `responseViewPrettyPrint`    | boolean | Pretty print JSON responses               |
| `followRedirects`            | boolean | Follow HTTP redirects                     |

### Option B: httpyac.config.js (Dynamic Logic)

**Use for:** Dynamic configuration based on environment variables or computed values. **DO NOT use for API variables.**

**File: `httpyac.config.js`**

```javascript
module.exports = {
	log: {
		level: process.env.NODE_ENV === "production" ? "error" : "warn",
		supportAnsiColors: true,
	},

	request: {
		timeout: parseInt(process.env.REQUEST_TIMEOUT) || 30000,
		rejectUnauthorized: process.env.NODE_ENV === "production",
	},

	cookieJarEnabled: true,

	// Optional: Dynamic proxy configuration
	proxy: process.env.HTTP_PROXY || null,
};
```

**Benefits:**

-   Can use `process.env` for dynamic behavior
-   Supports computed values and conditional logic
-   Useful for per-environment behavior changes

**⚠️ IMPORTANT:** This file is for httpYac **behavior settings** only. For API variables, use `.env` files.

**Dynamic Configuration Examples:**

```javascript
module.exports = {
	// Environment-based timeout
	request: {
		timeout: process.env.CI ? 60000 : 30000,
	},

	// Conditional SSL verification
	request: {
		rejectUnauthorized: process.env.NODE_ENV !== "development",
	},

	// Dynamic proxy from environment
	proxy: process.env.HTTP_PROXY || process.env.HTTPS_PROXY,
};
```

---

## Environment Selection in .http Files

### Force Specific Environment

```http
# @forceEnv production

# This file always uses production environment
@baseUrl = {{API_BASE_URL}}

GET {{baseUrl}}/api/data
```

### Conditional Requests by Environment

```http
# @name getData

# Run only in development
# @forceEnv dev
GET {{baseUrl}}/api/test-data

###

# Run only in production
# @forceEnv production
GET {{baseUrl}}/api/production-data
```

---

## Shared Variables Across Environments

**❌ DO NOT use .httpyac.json `environments` field for variables**

Use `.env` files instead:

**Shared variables in .http files:**

```http
# Common variables (defined once at file top)
@userAgent = httpYac/1.0
@acceptLanguage = en-US

# Environment-specific variables (from .env)
@baseUrl = {{API_BASE_URL}}

###

GET {{baseUrl}}/api/data
User-Agent: {{userAgent}}
Accept-Language: {{acceptLanguage}}
```

**Or use script blocks:**

```http
# Shared variables (available in all requests)
{{
  exports.userAgent = 'httpYac/1.0';
  exports.acceptLanguage = 'en-US';
}}

###

GET {{baseUrl}}/api/endpoint
User-Agent: {{userAgent}}
Accept-Language: {{acceptLanguage}}
```

---

## Environment-Specific Scripts

```http
{{
  const env = $processEnv.NODE_ENV || 'development';

  if (env === 'production') {
    console.log('⚠️  Running in PRODUCTION');
    exports.baseUrl = 'https://api.production.com';
    exports.logEnabled = false;
  } else if (env === 'test') {
    console.log('🧪 Running in TEST');
    exports.baseUrl = 'https://test-api.example.com';
    exports.logEnabled = true;
  } else {
    console.log('🔧 Running in DEVELOPMENT');
    exports.baseUrl = 'http://localhost:3000';
    exports.logEnabled = true;
  }
}}

###

GET {{baseUrl}}/api/data

{{
  if (logEnabled) {
    console.log('Response:', response.parsedBody);
  }
}}
```

---

## Multi-Project Setup

### Scenario: Multiple API Projects

**Project structure:**

```
project-root/
├── api-v1/
│   ├── users.http
│   ├── auth.http
│   └── .httpyac.json
├── api-v2/
│   ├── users.http
│   ├── auth.http
│   └── .httpyac.json
├── .env
├── .env.production
└── .gitignore
```

**Root `.env`:**

```env
API_V1_BASE_URL=http://localhost:3000/v1
API_V2_BASE_URL=http://localhost:3000/v2
SHARED_TOKEN=shared_token_123
```

**api-v1/.httpyac.json:** (Optional behavior settings only)

```json
{
	"log": {
		"level": "warn"
	},
	"request": {
		"timeout": 30000
	}
}
```

**api-v1/users.http:**

```http
@baseUrl = {{API_V1_BASE_URL}}
@token = {{SHARED_TOKEN}}

GET {{baseUrl}}/users
Authorization: Bearer {{token}}
```

---

## CLI Environment Management

### Basic Usage

```bash
# Use default environment (.env)
httpyac send api.http

# Use specific environment
httpyac send api.http --env production
httpyac send api.http --env test
httpyac send api.http --env staging

# Multiple files with environment
httpyac send *.http --env production
```

### Environment Variables via CLI

```bash
# Override specific variable
httpyac send api.http --env production \
  --var API_TOKEN=override_token

# Multiple variable overrides
httpyac send api.http \
  --var API_BASE_URL=http://custom-url.com \
  --var API_TOKEN=custom_token \
  --var DEBUG=true
```

### CI/CD Environment Setup

**GitHub Actions:**

```yaml
name: API Tests
on: [push]

jobs:
    test:
        runs-on: ubuntu-latest
        steps:
            - uses: actions/checkout@v2

            - name: Setup Node.js
              uses: actions/setup-node@v2

            - name: Install httpYac
              run: npm install -g httpyac

            - name: Run Development Tests
              run: httpyac send tests/*.http --env dev
              env:
                  API_BASE_URL: http://test-api.example.com
                  API_TOKEN: ${{ secrets.DEV_API_TOKEN }}

            - name: Run Production Tests
              run: httpyac send tests/*.http --env production
              env:
                  API_BASE_URL: https://api.production.com
                  API_TOKEN: ${{ secrets.PROD_API_TOKEN }}
```

**GitLab CI:**

```yaml
test:dev:
    stage: test
    script:
        - npm install -g httpyac
        - httpyac send tests/*.http --env dev
    variables:
        API_BASE_URL: http://test-api.example.com
        API_TOKEN: ${DEV_API_TOKEN}

test:prod:
    stage: test
    script:
        - npm install -g httpyac
        - httpyac send tests/*.http --env production
    variables:
        API_BASE_URL: https://api.production.com
        API_TOKEN: ${PROD_API_TOKEN}
    only:
        - main
```

---

## Environment Detection

### Automatic Detection

```http
{{
  // Detect environment from various sources
  const env =
    $processEnv.NODE_ENV ||           // Node.js environment
    $processEnv.HTTPYAC_ENV ||        // httpYac-specific
    $processEnv.CI ? 'ci' : 'dev';    // CI detection

  console.log('📍 Detected environment:', env);
  exports.environment = env;

  // Environment-specific configuration
  const configs = {
    dev: {
      baseUrl: 'http://localhost:3000',
      debug: true
    },
    test: {
      baseUrl: 'https://test-api.example.com',
      debug: true
    },
    production: {
      baseUrl: 'https://api.production.com',
      debug: false
    },
    ci: {
      baseUrl: 'http://ci-api.example.com',
      debug: false
    }
  };

  const config = configs[env] || configs.dev;
  exports.baseUrl = config.baseUrl;
  exports.debugEnabled = config.debug;
}}
```

### CI Platform Detection

```http
{{
  // Detect CI platform
  let platform = 'local';

  if ($processEnv.GITHUB_ACTIONS) {
    platform = 'GitHub Actions';
  } else if ($processEnv.GITLAB_CI) {
    platform = 'GitLab CI';
  } else if ($processEnv.CIRCLECI) {
    platform = 'CircleCI';
  } else if ($processEnv.JENKINS_URL) {
    platform = 'Jenkins';
  }

  console.log('🚀 Running on:', platform);
  exports.ciPlatform = platform;
}}
```

---

## Special Environment Variables

httpYac recognizes special variables that control request behavior. These variables provide environment-specific settings without modifying .http files.

### request_rejectUnauthorized

Control SSL certificate validation per environment. Useful for development with self-signed certificates.

**.env (Development):**

```env
API_BASE_URL=https://localhost:3000
API_TOKEN=dev_token_123

# Ignore SSL certificate errors in development
request_rejectUnauthorized=false
```

**.env.production:**

```env
API_BASE_URL=https://api.production.com
API_TOKEN=prod_secure_token

# Enforce SSL validation in production
request_rejectUnauthorized=true
```

**Effect:** Development environment ignores SSL errors, production enforces strict validation.

**When to use:**

-   ✅ Testing with self-signed certificates
-   ✅ Local HTTPS development
-   ✅ Internal APIs with custom CA
-   ❌ Never set to `false` in production

### request_proxy

Set environment-specific HTTP proxy without code changes.

**.env.local (for debugging):**

```env
# Route through debugging proxy
request_proxy=http://localhost:8888

# Optional: proxy authentication
request_proxy=http://user:pass@proxy.company.com:8080
```

**.env (default - no proxy):**

```env
# No proxy configuration needed - leave unset
```

**Effect:** Requests automatically route through specified proxy when variable is set.

**Common uses:**

-   ✅ Debugging with Fiddler/Charles (port 8888)
-   ✅ Corporate proxy requirements
-   ✅ Network traffic inspection
-   ✅ Request/response logging

### Usage Example

```http
# No special syntax required - httpYac reads these automatically

@baseUrl = {{API_BASE_URL}}
@token = {{API_TOKEN}}

###

GET {{baseUrl}}/api/data
Authorization: Bearer {{token}}

# Behavior automatically adjusted based on:
# - request_rejectUnauthorized (SSL validation)
# - request_proxy (network routing)
```

### Environment-Specific Behavior

**Development (.env):**

```env
API_BASE_URL=https://localhost:3000
request_rejectUnauthorized=false
request_proxy=http://localhost:8888
```

→ Ignores SSL errors, routes through Fiddler for debugging

**Testing (.env.test):**

```env
API_BASE_URL=https://test.example.com
request_rejectUnauthorized=true
```

→ Validates SSL, no proxy

**Production (.env.production):**

```env
API_BASE_URL=https://api.production.com
request_rejectUnauthorized=true
request_proxy=http://proxy.company.com:8080
```

→ Strict SSL, corporate proxy

### Security Notes

**⚠️ WARNING:**

-   Never commit `.env` files with `request_rejectUnauthorized=false`
-   Always use `request_rejectUnauthorized=true` in production
-   Proxy credentials should be in `.env.local` (gitignored)

**Best practice:**

```gitignore
# .gitignore
.env
.env.local
.env.*.local
```

### Complete Example

**.env.example (committed to git):**

```env
# API Configuration
API_BASE_URL=https://api.example.com
API_TOKEN=your_token_here

# Special Variables (optional)
# request_rejectUnauthorized=true
# request_proxy=http://proxy:8080
```

**.env.local (developer's machine, gitignored):**

```env
API_BASE_URL=https://localhost:3000
API_TOKEN=dev_token_123
request_rejectUnauthorized=false
request_proxy=http://localhost:8888
```

**users.http:**

```http
@baseUrl = {{API_BASE_URL}}
@token = {{API_TOKEN}}

###

GET {{baseUrl}}/api/users
Authorization: Bearer {{token}}

# Automatically uses:
# - SSL validation from request_rejectUnauthorized
# - Proxy from request_proxy
# - No code changes needed between environments
```

---

## Best Practices

### 1. Separation of Concerns

**DO:**

-   Variables (API_BASE_URL, API_TOKEN) → `.env` files
-   Behavior settings (timeout, log level) → `.httpyac.json`
-   Dynamic logic → `httpyac.config.js`

**DON'T:**

-   Mix variables and settings in same file
-   Put secrets in `.httpyac.json` or `httpyac.config.js`

### 2. Security

```gitignore
# .gitignore
.env
.env.local
.env.*.local
*.httpyac.cache
```

```env
# .env.example (committed)
API_BASE_URL=http://localhost:3000
API_USER=your-email@example.com
API_TOKEN=your-token-here
```

### 3. Environment Naming

Use consistent environment names:

-   `dev` / `development` - Local development
-   `test` / `testing` - Automated testing
-   `staging` - Pre-production
-   `production` / `prod` - Production
-   `ci` - CI/CD pipelines

### 4. Variable Naming Conventions

```env
# ✅ Good - Clear, descriptive, consistent
API_BASE_URL=http://localhost:3000
API_AUTH_TOKEN=abc123
DATABASE_HOST=localhost
FEATURE_FLAG_NEW_UI=true

# ❌ Bad - Unclear, inconsistent
URL=http://localhost:3000
token=abc123
db=localhost
newUI=true
```

### 5. Default Values

**In .http files:**

```http
{{
  // Provide defaults for optional variables
  exports.baseUrl = $processEnv.API_BASE_URL || 'http://localhost:3000';
  exports.timeout = parseInt($processEnv.TIMEOUT) || 30000;
  exports.debug = $processEnv.DEBUG === 'true';
}}
```

**In httpyac.config.js:**

```javascript
module.exports = {
	request: {
		timeout: parseInt(process.env.REQUEST_TIMEOUT) || 30000,
	},
	log: {
		level: process.env.LOG_LEVEL || "info",
	},
};
```

---

## Common Issues

### Issue 1: Variables Not Loading

**Symptom:** `{{API_BASE_URL}}` shows as literal text

**Causes & Fixes:**

1. .env file not in project root → Move to root
2. Wrong variable name → Check case-sensitivity
3. Environment not selected → Check VS Code status bar

### Issue 2: Wrong Environment Loaded

**Symptom:** Using dev instead of production

**Fix:**

```bash
# CLI: Explicitly specify environment
httpyac send api.http --env production

# VS Code: Check status bar environment selector
# File: Add @forceEnv directive
# @forceEnv production
```

### Issue 3: Configuration Not Applied

**Symptom:** Settings in .httpyac.json not working

**Causes & Fixes:**

1. JSON syntax error → Validate JSON
2. Wrong file location → Must be in project root
3. Cached config → Reload VS Code

### Issue 4: Secrets in Git

**Prevention:**

```bash
# Add to .gitignore BEFORE committing
echo ".env" >> .gitignore
echo ".env.local" >> .gitignore
echo ".env.*.local" >> .gitignore

# Check what will be committed
git status

# If already committed, remove from history
git rm --cached .env
git commit -m "Remove .env from git"
```

---

## Environment Checklist

**Setup:**

-   [ ] `.env` file created with development variables
-   [ ] `.env.example` created without secrets
-   [ ] `.env` added to .gitignore
-   [ ] Environment variables loaded correctly in .http files
-   [ ] Configuration file (if needed) created

**Production:**

-   [ ] `.env.production` created with production variables
-   [ ] Production secrets secured (not in git)
-   [ ] Environment switching tested
-   [ ] Production URLs verified
-   [ ] SSL certificate verification enabled

**Team:**

-   [ ] `.env.example` documented
-   [ ] Setup instructions in README
-   [ ] Environment naming conventions established
-   [ ] All team members can run locally

**CI/CD:**

-   [ ] Environment variables configured in CI/CD platform
-   [ ] Secrets stored in CI/CD secret management
-   [ ] Environment selection working in pipeline
-   [ ] Tests passing in CI environment

---

## Quick Reference

**Load environment variables:**

```http
@variable = {{ENV_VARIABLE}}
```

**Switch environment (CLI):**

```bash
httpyac send api.http --env production
```

**Force environment (in file):**

```http
# @forceEnv production
```

**Environment-specific script:**

```http
{{
  const env = $processEnv.NODE_ENV || 'dev';
  if (env === 'production') {
    // Production logic
  }
}}
```

**Configuration file priority:**

```
httpyac.config.js > .httpyac.json
.env.production.local > .env.production > .env.local > .env
```
