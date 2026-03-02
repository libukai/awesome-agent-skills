---
name: vscode-httpyac-config
description: Configure VSCode with httpYac for API testing and automation. This skill should be used specifically when converting API documentation to executable .http files (10+ endpoints), setting up authentication flows with pre-request scripts, implementing request chaining with response data, organizing multi-file collections with environment management, or establishing Git-based API testing workflows with CI/CD integration.
license: Complete terms in LICENSE.txt
---

# VSCode httpYac Configuration

## About This Skill

Transform API documentation into executable, testable .http files with httpYac. This skill provides workflow guidance for creating production-ready API collections with scripting, authentication, environment management, and CI/CD integration.

### When to Use This Skill

-   **API Documentation → Executable Files**: Converting API specs (Swagger, Postman, docs) to httpYac format
-   **Authentication Implementation**: Setting up OAuth2, Bearer tokens, or complex auth flows
-   **Large Collections**: Organizing 10+ endpoints with multi-file structure
-   **Request Chaining**: Passing data between requests (login → use token → create → update)
-   **Environment Management**: Dev/test/production environment switching
-   **Team Workflows**: Git-based collaboration with secure credential handling
-   **CI/CD Integration**: Automated testing in GitHub Actions, GitLab CI, etc.

### Expected Outcomes

-   ✅ Working .http files with correct httpYac syntax
-   ✅ Environment-based configuration (.env files, .httpyac.json)
-   ✅ Secure credential management (no secrets in git)
-   ✅ Request chaining and response validation
-   ✅ Team-ready structure with documentation
-   ✅ CI/CD pipeline integration (optional)

---

## Core Workflow

### Phase 1: Discovery and Planning

**Objective**: Understand API structure and propose file organization.

**Key Questions:**

1. How many endpoints? (< 20 = single file, 20+ = multi-file)
2. Authentication method? (Bearer, OAuth2, API Key, Basic Auth)
3. Environments needed? (dev, test, staging, production)
4. Existing docs? (Swagger, Postman collection, documentation URL)

**Propose Structure to User:**

```
Identified API modules:
- Authentication (2 endpoints)
- Users (5 endpoints)
- Articles (3 endpoints)

Recommended: Multi-file structure
- auth.http
- users.http
- articles.http

Proceed with this structure?
```

**📖 Detailed Guide**: `references/WORKFLOW_GUIDE.md`

---

### Phase 2: Template-Based File Creation

**🚨 MANDATORY: Always start with templates from `assets/` directory.**

**Template Usage Sequence:**

1. Read `assets/http-file.template`
2. Copy structure to target file
3. Replace {{PLACEHOLDER}} variables
4. Add API-specific requests
5. Verify syntax against `references/SYNTAX.md`

**Available Templates:**

-   `assets/http-file.template` → Complete .http file structure
-   `assets/httpyac-config.template` → Configuration file
-   `assets/env.template` → Environment variables

**Key Files to Create:**

-   `.http` files → API requests
-   `.env` → Environment variables (gitignored)
-   `.env.example` → Template with placeholders (committed)
-   `.httpyac.json` → Configuration (optional)

**📖 File Structure Guide**: `references/WORKFLOW_GUIDE.md#phase-2`

---

### Phase 3: Implement Authentication

**Select Pattern Based on API Type:**

| API Type           | Pattern          | Reference Location                                  |
| ------------------ | ---------------- | --------------------------------------------------- |
| Static token       | Simple Bearer    | `references/AUTHENTICATION_PATTERNS.md#pattern-1`   |
| OAuth2 credentials | Auto-fetch token | `references/AUTHENTICATION_PATTERNS.md#pattern-2`   |
| Token refresh      | Auto-refresh     | `references/AUTHENTICATION_PATTERNS.md#pattern-3`   |
| API Key            | Header or query  | `references/AUTHENTICATION_PATTERNS.md#pattern-5-6` |

**Quick Example:**

```http
# @name login
POST {{baseUrl}}/auth/login
Content-Type: application/json

{
  "email": "{{user}}",
  "password": "{{password}}"
}

{{
  // Store token for subsequent requests
  if (response.statusCode === 200) {
    exports.accessToken = response.parsedBody.access_token;
    console.log('✓ Token obtained');
  }
}}

###

# Use token in protected request
GET {{baseUrl}}/api/data
Authorization: Bearer {{accessToken}}
```

**📖 Complete Patterns**: `references/AUTHENTICATION_PATTERNS.md`
**Search Pattern**: `grep -n "Pattern [0-9]:" references/AUTHENTICATION_PATTERNS.md`

---

## ⚠️ CRITICAL SYNTAX RULES

### 🎯 Variable Management (Most Common Mistake)

**1. Environment Variables** (from .env file)

```http
@baseUrl = {{API_BASE_URL}}
@token = {{API_TOKEN}}
```

✅ Use `@variable = {{ENV_VAR}}` syntax at file top

**2. Utility Functions** (in script blocks)

```http
{{
  // ✅ CORRECT: Export with exports.
  exports.validateResponse = function(response, actionName) {
    return response.statusCode === 200;
  };
}}

###

GET {{baseUrl}}/api/test

{{
  // ✅ CORRECT: Call WITHOUT exports.
  if (validateResponse(response, 'Test')) {
    console.log('Success');
  }
}}
```

**3. Response Data** (post-response only)

```http
GET {{baseUrl}}/users

{{
  // ✅ Store for next request
  exports.userId = response.parsedBody.id;
}}
```

### ❌ FORBIDDEN

```http
{{
  // ❌ WRONG: Don't use exports/process.env for env vars
  exports.baseUrl = process.env.API_BASE_URL;  // NO!

  // ❌ WRONG: Don't use exports when calling
  if (exports.validateResponse(response)) { }  // NO!
}}
```

### 🔍 Post-Creation Checklist

-   [ ] Template used as base
-   [ ] `###` delimiter between requests
-   [ ] Variables: `@variable = {{ENV_VAR}}`
-   [ ] Functions exported: `exports.func = function() {}`
-   [ ] Functions called without exports
-   [ ] `.env.example` created
-   [ ] No secrets in .http files

**📖 Complete Syntax**: `references/SYNTAX.md`
**📖 Common Mistakes**: `references/COMMON_MISTAKES.md`
**📖 Cheatsheet**: `references/SYNTAX_CHEATSHEET.md`

---

## Format Optimization for httpbook UI

### Clean, Scannable Structure

```http
# ============================================================
# Article Endpoints - API Name
# ============================================================
# V1-Basic | V2-Metadata | V3-Full Content⭐
# Docs: https://api.example.com/docs
# ============================================================

@baseUrl = {{API_BASE_URL}}

### Get Articles V3 ⭐

# @name getArticlesV3
# @description Full content + Base64 HTML | Requires auth | Auto-decode
GET {{baseUrl}}/articles?page=1
Authorization: Bearer {{accessToken}}
```

### Format Guidelines

**DO:**

-   ✅ Use 60-character separators: `# =============`
-   ✅ Inline descriptions with `|`: `Detail 1 | Detail 2`
-   ✅ `@description` for hover details
-   ✅ Emoji for visual cues: ⭐⚠️📄

**DON'T:**

-   ❌ 80+ character separators
-   ❌ HTML comments `<!-- -->` (visible in UI)
-   ❌ Multi-line documentation blocks
-   ❌ Excessive `###` decorations

**📖 Complete Guide**: See SKILL.md Phase 3.5 for before/after examples

---

## Security Configuration

### Essential .gitignore

```gitignore
# httpYac: Protect secrets
.env
.env.local
.env.*.local
.env.production

# httpYac: Ignore cache
.httpyac.cache
*.httpyac.cache
httpyac-output/
```

### Security Rules

**ALWAYS:**

-   ✅ Environment variables for secrets
-   ✅ `.env` in .gitignore
-   ✅ `.env.example` without real secrets
-   ✅ Truncate tokens in logs: `token.substring(0, 10) + '...'`

**NEVER:**

-   ❌ Hardcode credentials in .http files
-   ❌ Commit .env files
-   ❌ Log full tokens/secrets
-   ❌ Disable SSL in production

**📖 Complete Guide**: `references/SECURITY.md`
**Search Pattern**: `grep -n "gitignore\|secrets" references/SECURITY.md`

---

## Reference Materials Loading Guide

**Load references when:**

| Situation                 | File to Load                            | grep Search Pattern                        |
| ------------------------- | --------------------------------------- | ------------------------------------------ |
| Setting up authentication | `references/AUTHENTICATION_PATTERNS.md` | `grep -n "Pattern [0-9]"`                  |
| Script execution errors   | `references/SCRIPTING_TESTING.md`       | `grep -n "Pre-Request\|Post-Response"`     |
| Environment switching     | `references/ENVIRONMENT_MANAGEMENT.md`  | `grep -n "\.env\|\.httpyac"`               |
| Security configuration    | `references/SECURITY.md`                | `grep -n "gitignore\|secrets"`             |
| Team documentation        | `references/DOCUMENTATION.md`           | `grep -n "README\|CHANGELOG"`              |
| Advanced features         | `references/ADVANCED_FEATURES.md`       | `grep -n "GraphQL\|WebSocket\|gRPC"`       |
| CI/CD integration         | `references/CLI_CICD.md`                | `grep -n "GitHub Actions\|GitLab"`         |
| Complete syntax reference | `references/SYNTAX.md`                  | `grep -n "@\|??\|{{" references/SYNTAX.md` |

**Quick References (Always Available):**

-   `references/SYNTAX_CHEATSHEET.md` - Common syntax patterns
-   `references/COMMON_MISTAKES.md` - Error prevention
-   `references/WORKFLOW_GUIDE.md` - Complete workflow

---

## Complete Workflow Phases

This skill follows a 7-phase workflow. Phases 1-3 covered above. Remaining phases:

**Phase 4: Scripting and Testing**

-   Pre/post-request scripts
-   Test assertions
-   Request chaining
-   **📖 Reference**: `references/SCRIPTING_TESTING.md`

**Phase 5: Environment Management**

-   .env files for variables
-   .httpyac.json for configuration
-   Multi-environment setup
-   **📖 Reference**: `references/ENVIRONMENT_MANAGEMENT.md`

**Phase 6: Documentation**

-   README.md creation
-   In-file comments
-   API reference
-   **📖 Reference**: `references/DOCUMENTATION.md`

**Phase 7: CI/CD Integration** (Optional)

-   GitHub Actions setup
-   GitLab CI configuration
-   Docker integration
-   **📖 Reference**: `references/CLI_CICD.md`

---

## Quality Checklist

Before completion, verify:

**Structure:**

-   [ ] File structure appropriate for collection size
-   [ ] Templates used as base
-   [ ] Requests separated by `###`

**Syntax:**

-   [ ] Variables: `@var = {{ENV_VAR}}`
-   [ ] Functions exported and called correctly
-   [ ] No syntax errors (validated against references)

**Security:**

-   [ ] `.env` in .gitignore
-   [ ] `.env.example` has placeholders
-   [ ] No hardcoded credentials

**Functionality:**

-   [ ] All requests execute successfully
-   [ ] Authentication flow works
-   [ ] Request chaining passes data correctly

**Documentation:**

-   [ ] README.md with quick start
-   [ ] Environment variables documented
-   [ ] Comments clear and concise

---

## Common Issues

| Symptom                 | Likely Cause          | Solution                           |
| ----------------------- | --------------------- | ---------------------------------- |
| "Variable not defined"  | Not declared with `@` | Add `@var = {{ENV_VAR}}` at top    |
| "Function not defined"  | Not exported          | Use `exports.func = function() {}` |
| Scripts not executing   | Wrong syntax/position | Verify `{{ }}` placement           |
| Token not persisting    | Using local variable  | Use `exports.token` instead        |
| Environment not loading | Wrong file location   | Place .env in project root         |

**📖 Complete Troubleshooting**: `references/TROUBLESHOOTING.md`

---

## Success Criteria

Collection is production-ready when:

1. ✅ All .http files execute without errors
2. ✅ Authentication flow works automatically
3. ✅ Environment switching tested (dev/production)
4. ✅ Secrets protected (.env gitignored)
5. ✅ Team member can clone and run in < 5 minutes
6. ✅ Requests include assertions
7. ✅ Documentation complete

---

## Implementation Notes

**Before Generating Files:**

-   Confirm structure with user
-   Validate API docs completeness
-   Verify authentication requirements

**While Generating:**

-   Always use templates from `assets/`
-   Validate syntax before writing
-   Include authentication where needed
-   Add assertions for critical endpoints

**After Generation:**

-   Show created structure to user
-   Test at least one request
-   Highlight next steps (credentials, testing)
-   Offer to add more endpoints

**Common User Requests:**

-   "Add authentication" → Load `references/AUTHENTICATION_PATTERNS.md` → Choose pattern
-   "Not working" → Check: variables defined, `{{ }}` syntax, .env loaded
-   "Chain requests" → Use `# @name` and `exports` variables
-   "Add tests" → Add `{{ }}` block with assertions
-   "CI/CD setup" → Load `references/CLI_CICD.md` → Provide examples

---

## Version

**Version**: 2.0.0 (Refactored)
**Last Updated**: 2025-12-15
**Based on**: httpYac v6.x

**Key Changes from v1.x:**

-   Refactored into modular references (7 files)
-   Focused on workflow guidance and decision points
-   Progressive disclosure design (load details as needed)
-   grep patterns for quick reference navigation
-   Reduced SKILL.md from 1289 to ~400 lines

**Features:**

-   Template-based file generation
-   10 authentication patterns
-   Multi-environment management
-   Security best practices
-   CI/CD integration examples
-   Advanced features (GraphQL, WebSocket, gRPC)
