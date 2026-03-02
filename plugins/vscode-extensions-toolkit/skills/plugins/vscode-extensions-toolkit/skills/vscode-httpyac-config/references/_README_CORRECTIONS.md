# ⚠️ IMPORTANT CORRECTIONS

## Files with Corrected Information

The following files contain **CORRECTED** versions with proper httpYac patterns:

1. **`AUTHENTICATION_PATTERNS_CORRECT.md`** ⭐ (Use this instead of AUTHENTICATION_PATTERNS.md)
   - Correct: Uses `@name`, `@ref`, `@forceRef` for authentication
   - Wrong in old file: Uses `require('axios')` which is not recommended

2. **`COMMON_MISTAKES.md`** ✅ (Updated)
   - Section 2 corrected to use request references instead of axios

## Key Corrections

### ❌ WRONG (Old Skill Documentation)
```http
{{
  const axios = require('axios');
  const response = await axios.post(`${baseUrl}/auth/login`, {...});
  exports.token = response.data.access_token;
}}
```

### ✅ CORRECT (httpYac Official Pattern)
```http
# @name login
POST {{baseUrl}}/auth/login
Content-Type: application/json
{ ... }

{{
  if (response.statusCode === 200) {
    exports.accessToken = response.parsedBody.access_token;
  }
}}

###

# @forceRef login
GET {{baseUrl}}/api/data
Authorization: Bearer {{accessToken}}
```

## Why This Matters

- `require('axios')`, `require('got')`, `require('node-fetch')` are **NOT supported** in most httpYac environments
- httpYac does NOT run in a full Node.js environment in many cases:
  - **VSCode httpYac extension**: Browser-based runtime (no Node.js require)
  - **httpYac CLI**: Sandboxed environment (limited modules)
  - **CI/CD runners**: Minimal installation (external packages unavailable)
- httpYac's design philosophy uses request references (`@name`, `@ref`, `@forceRef`), not HTTP calls in scripts
- Request references provide better caching, dependency management, and cross-environment compatibility

## Environment Compatibility

### ❌ NOT Supported (Will Fail)
- `require('axios')` - External HTTP client
- `require('got')` - External HTTP client
- `require('node-fetch')` - External fetch implementation
- `require('bcrypt')` - Native addons
- `require('moment')` - Large external libraries

### ⚠️ Environment-Dependent (May Work in CLI Only)
- `require('crypto')` - Usually works (built-in Node.js)
- `require('fs')` - May work in CLI, not in VSCode extension
- `require('path')` - May work in CLI, not in VSCode extension
- `require('uuid')` - External package (depends on installation)

### ✅ Always Supported
- JavaScript built-ins: `Date()`, `JSON.parse()`, `String`, `Array`, etc.
- httpYac request references: `@name`, `@ref`, `@forceRef`, `@import`
- httpYac variables: `exports`, template variables `{{var}}`

## Files Still Containing Old Patterns

**⚠️ WARNING**: These files contain `require()` examples that may NOT work in your environment:

- `AUTHENTICATION_PATTERNS_OLD.md` (renamed, DO NOT USE - use AUTHENTICATION_PATTERNS_CORRECT.md instead)
- `ADVANCED_FEATURES.md` - Contains advanced examples with `require('fs')`, `require('cheerio')`, etc.
  - These examples are for **full Node.js CLI environment only**
  - Most will NOT work in VSCode extension or CI/CD
  - Use at your own risk, test in your specific environment first
- `SCRIPTING_TESTING.md` - Some examples use `require()`
- `SYNTAX.md` - Some examples use `require('uuid')`
- `SECURITY.md` - Some examples use `require('aws-sdk')`

**Recommendation**: For standard API testing, always use:
1. `AUTHENTICATION_PATTERNS_CORRECT.md` for authentication patterns
2. `COMMON_MISTAKES.md` for error prevention
3. Request chaining with `@import` and `@forceRef` instead of `require()`

**Advanced Users**: If you need features from ADVANCED_FEATURES.md:
- Test in your specific httpYac environment first
- Expect failures in VSCode extension and browser-based environments
- Consider using httpYac CLI with full Node.js if you need `require()` support

When using the skill, prefer:
1. `AUTHENTICATION_PATTERNS_CORRECT.md` for authentication
2. Updated sections in `COMMON_MISTAKES.md`
3. Official httpYac documentation: https://httpyac.github.io/
