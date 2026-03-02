# Common httpYac Mistakes

Critical errors to avoid when creating .http files.

## 1. Missing Request Separator

### ❌ WRONG
```http
GET {{baseUrl}}/users

GET {{baseUrl}}/orders
```

### ✅ CORRECT
```http
GET {{baseUrl}}/users

###

GET {{baseUrl}}/orders
```

**Error:** Requests run together, second request ignored
**Fix:** Always use `###` between requests

---

## 2. Using require() for External Modules (CRITICAL)

### ❌ WRONG - require() Not Supported
```http
{{
  // ❌ WILL FAIL in most httpYac environments
  const got = require('got');
  const axios = require('axios');
  const fetch = require('node-fetch');

  // These external HTTP libraries are NOT available:
  // - In VSCode httpYac extension (browser-based runtime)
  // - In httpYac CLI (sandboxed environment)
  // - In CI/CD runners (minimal Node.js installation)

  const response = await axios.get('https://api.example.com');
  exports.data = response.data;
}}
```

### ✅ CORRECT - Use @import and @forceRef
```http
# auth.http - Define authentication once
# @name auth
POST {{baseUrl}}/token
Content-Type: application/json

{
  "client_id": "{{clientId}}",
  "client_secret": "{{clientSecret}}"
}

{{
  exports.accessToken = response.parsedBody.access_token;
  console.log('✓ Token obtained');
}}

###

# users.http - Import and reference
# @import ./auth.http

# @name getUsers
# @forceRef auth
GET {{baseUrl}}/users
Authorization: Bearer {{accessToken}}
```

**Why this matters:**
- httpYac runtime does **NOT support Node.js require()** in most environments
- Use `@import` for cross-file dependencies
- Use `@forceRef` to ensure requests run in order
- Use `exports` for sharing data between requests

**Real-world error you'll encounter:**
```
ReferenceError: require is not defined
  at Object.<anonymous> (/path/to/file.http:5:16)
  at Script.runInContext (node:vm:144:12)
```

**What IS supported (environment-dependent):**
```http
{{
  // ✅ Built-in Node.js modules MAY work
  const crypto = require('crypto');  // Usually works
  const fs = require('fs');          // May work in CLI only

  // ✅ httpYac provides these globally (no require needed)
  // - String manipulation: normal JavaScript
  // - Date functions: Date() object
  // - JSON: JSON.parse() / JSON.stringify()
}}
```

**Decision Guide:**

| Need | Solution | Don't Use |
|------|----------|-----------|
| Make HTTP request | `@name` + `@forceRef` | `require('axios')` |
| Share access token | `exports` + `@import` | Separate function with `require('got')` |
| Hash/encrypt data | `crypto` (built-in) | `require('bcrypt')` |
| Date manipulation | `Date()` + exports function | `require('moment')` |
| Generate UUID | Write own or use timestamp | `require('uuid')` |

**Complete example - WeChat API pattern:**
```http
# 01-auth.http
# @name auth
POST {{baseUrl}}/token?grant_type=client_credentials&appid={{appId}}&secret={{appSecret}}

{{
  if (response.statusCode === 200) {
    exports.accessToken = response.parsedBody.access_token;
    exports.tokenExpiresAt = Date.now() + (response.parsedBody.expires_in * 1000);
    console.log('✓ Token obtained:', exports.accessToken.substring(0, 20) + '...');
  }
}}

###

# 02-user.http
# @import ./01-auth.http

# @name getUserList
# @forceRef auth
GET {{baseUrl}}/cgi-bin/user/get?access_token={{accessToken}}&next_openid=

{{
  if (response.statusCode === 200) {
    console.log('✓ User list retrieved:', response.parsedBody.total);
  }
}}
```

---

## 3. Wrong Script Delimiters

### ❌ WRONG
```http
<?
console.log('This will not work');
?>

GET {{baseUrl}}/users

??
console.log('This will not work either');
??
```

### ✅ CORRECT
```http
{{
  // Pre-request script (before request line)
  console.log('Pre-request script');
  exports.timestamp = Date.now();
}}

GET {{baseUrl}}/users

{{
  // Post-response script (after request)
  console.log('Post-response script');
  console.log('Status:', response.statusCode);
}}
```

**Error:** Scripts not executing, treated as request body
**Fix:** Use `{{ }}` for all scripts. Position determines when it runs (before or after request)

---

## 4. Variable Used Before Declaration

### ❌ WRONG
```http
GET {{baseUrl}}/users

{{
  baseUrl = "http://localhost:3000";
}}
```

### ✅ CORRECT
```http
{{
  baseUrl = "http://localhost:3000";
}}

###

GET {{baseUrl}}/users
```

**Error:** "Variable baseUrl not defined"
**Fix:** Declare variables at top of file or before first usage

---

## 5. Mixing Variable Syntax Styles

### ❌ WRONG
```http
@baseUrl = http://localhost:3000

{{
  token = "abc123";
}}

GET {{baseUrl}}/users
Authorization: Bearer {{token}}
```

### ✅ CORRECT (Option A)
```http
@baseUrl = http://localhost:3000
@token = abc123

GET {{baseUrl}}/users
Authorization: Bearer {{token}}
```

### ✅ CORRECT (Option B)
```http
{{
  baseUrl = "http://localhost:3000";
  token = "abc123";
}}

GET {{baseUrl}}/users
Authorization: Bearer {{token}}
```

**Error:** Inconsistent variable resolution
**Fix:** Choose one style and stick to it throughout the file

---

## 6. Using Local Variable Instead of Global

### ❌ WRONG
```http
# @name login
POST {{baseUrl}}/auth/login

{{
  // Local variable - lost after this request
  const accessToken = response.parsedBody.token;
}}

###

GET {{baseUrl}}/protected
Authorization: Bearer {{accessToken}}  // accessToken is undefined!
```

### ✅ CORRECT
```http
# @name login
POST {{baseUrl}}/auth/login

{{
  // Export to make it global - persists across requests
  exports.accessToken = response.parsedBody.token;
}}

###

GET {{baseUrl}}/protected
Authorization: Bearer {{accessToken}}  // Works!
```

**Error:** Variable not available in next request
**Fix:** Use `exports.variableName` to make variables available globally

---

## 6.5. Pre-Request Variable Scope (Template Access)

### ❌ WRONG - Local Variable in Pre-Request
```http
{{
  // ❌ Local variable - NOT accessible in request template
  const dates = getDateRange(7);
}}

POST {{baseUrl}}/analytics
Content-Type: application/json

{
  "begin_date": "{{dates.begin_date}}",  // ❌ undefined!
  "end_date": "{{dates.end_date}}"       // ❌ undefined!
}
```

### ✅ CORRECT - Export Variable in Pre-Request
```http
{{
  // Define helper function once (file-level)
  exports.getDateRange = function(days) {
    const end = new Date();
    end.setDate(end.getDate() - 1);  // End at yesterday (data delay)
    const start = new Date(end);
    start.setDate(start.getDate() - days + 1);

    const formatDate = (d) => d.toISOString().split('T')[0];

    return {
      begin_date: formatDate(start),
      end_date: formatDate(end)
    };
  };
}}

###

# @name analytics7days
{{
  // ✅ Export before request - accessible in template
  exports.dates = getDateRange(7);
}}

POST {{baseUrl}}/analytics
Content-Type: application/json

{
  "begin_date": "{{dates.begin_date}}",  // ✅ Works!
  "end_date": "{{dates.end_date}}"       // ✅ Works!
}

###

# @name analytics3days
{{
  // Different parameter for different request
  exports.dates = getDateRange(3);  // 3 days
}}

POST {{baseUrl}}/analytics
Content-Type: application/json

{
  "begin_date": "{{dates.begin_date}}",  // ✅ Works with 3-day range!
  "end_date": "{{dates.end_date}}"
}
```

**Key Principle:**
- **Pre-request scripts**: Use `exports.var` to make variables accessible in the **SAME request template**
- **Post-response scripts**: Use `exports.var` to make variables accessible in **SUBSEQUENT requests**

**Variable Scope Flow:**
```
┌─────────────────────────────────────────────────────────────┐
│ File-level script                                            │
│   exports.getDateRange = function() {...}                   │
│   → Callable in all requests in this file                   │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ Request 1 - Pre-request script                              │
│   exports.dates = getDateRange(7)                           │
│   → Accessible in Request 1 template: {{dates.begin_date}}  │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ Request 1 - Execution                                       │
│   POST /api                                                 │
│   { "begin_date": "{{dates.begin_date}}" }                  │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ Request 1 - Post-response script                            │
│   exports.token = response.parsedBody.access_token          │
│   → Accessible in Request 2+ templates: {{token}}           │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ Request 2 - Pre-request script                              │
│   Can use: {{token}} (from Request 1 post-response)         │
│   Can use: {{dates}} (if set in this request's pre-script)  │
└─────────────────────────────────────────────────────────────┘
```

**Common Mistake - Trying to use const:**
```http
{{
  const apiKey = "abc123";  // ❌ NOT accessible in template
}}

GET {{baseUrl}}/data?key={{apiKey}}  // ❌ apiKey is undefined
```

**Fix:**
```http
{{
  exports.apiKey = "abc123";  // ✅ Accessible in template
}}

GET {{baseUrl}}/data?key={{apiKey}}  // ✅ Works!
```

**Error:** Variable undefined in template
**Fix:** Use `exports.variableName` in pre-request script for template access

---

## 7. Forgetting Request Name for Chaining

### ❌ WRONG
```http
POST {{baseUrl}}/users

{{
  exports.userId = response.parsedBody.id;
}}

###

GET {{baseUrl}}/users/{{userId}}
```

**This works but is harder to reference**

### ✅ CORRECT
```http
# @name createUser
POST {{baseUrl}}/users

{{
  exports.userId = response.parsedBody.id;
}}

###

# @name getUser
GET {{baseUrl}}/users/{{userId}}
```

**Error:** Difficult to reference specific requests
**Fix:** Always name requests with `# @name`

---

## 8. Incorrect Environment Variable Access

### ❌ WRONG
```http
{{
  baseUrl = process.env.API_BASE_URL;  // Wrong
  token = process.env.API_TOKEN;       // Wrong
}}
```

### ✅ CORRECT
```http
{{
  baseUrl = $processEnv.API_BASE_URL;  // Correct
  token = $processEnv.API_TOKEN;       // Correct
}}
```

**Error:** "process is not defined"
**Fix:** Use `$processEnv.VAR_NAME` to access environment variables

---

## 9. Missing Content-Type for JSON

### ❌ WRONG
```http
POST {{baseUrl}}/users

{
  "name": "John Doe"
}
```

### ✅ CORRECT
```http
POST {{baseUrl}}/users
Content-Type: application/json

{
  "name": "John Doe"
}
```

**Error:** Server may not parse JSON correctly
**Fix:** Always include `Content-Type: application/json` for JSON bodies

---

## 10. Not Handling Response Errors

### ❌ WRONG
```http
GET {{baseUrl}}/users

{{
  // Crashes if response is error or data is missing
  exports.userId = response.parsedBody.data[0].id;
}}
```

### ✅ CORRECT
```http
GET {{baseUrl}}/users

{{
  if (response.statusCode === 200 && response.parsedBody.data) {
    exports.userId = response.parsedBody.data[0].id;
    console.log('✓ User ID:', exports.userId);
  } else {
    console.error('❌ Error:', response.statusCode, response.parsedBody);
  }
}}
```

**Error:** Script crashes on API errors
**Fix:** Always check response.statusCode before accessing data

---

## 11. Incorrect .env File Location

### ❌ WRONG
```
project/
├── api/
│   ├── .env           # Wrong location
│   └── users.http
```

### ✅ CORRECT
```
project/
├── .env               # Correct location (project root)
├── api/
│   └── users.http
```

**Error:** Environment variables not loading
**Fix:** Place .env in project root or same directory as .http files

---

## 12. Forgetting to Gitignore .env

### ❌ WRONG
No .gitignore entry for .env

### ✅ CORRECT
```gitignore
# .gitignore
.env
.env.local
.env.production
.env.*.local
```

**Error:** Secrets committed to Git
**Fix:** Always add .env to .gitignore

---

## 13. Using Synchronous Code in Async Context

### ❌ WRONG
```http
{{
  const axios = require('axios');
  const response = axios.get('https://api.example.com');  // Missing await
  const data = response.data;  // Won't work - response is a Promise
  exports.data = data;
}}

GET {{baseUrl}}/endpoint
```

### ✅ CORRECT
```http
{{
  const axios = require('axios');
  const response = await axios.get('https://api.example.com');
  const data = response.data;
  exports.data = data;
}}

GET {{baseUrl}}/endpoint
```

**Error:** Data not available when request runs
**Fix:** Always use `await` with async operations

---

## 14. Incorrect Test Syntax

### ❌ WRONG
```http
GET {{baseUrl}}/users

{{
  test("Status is 200", function() {
    assert(response.statusCode === 200);  // Wrong assertion
  });
}}
```

### ✅ CORRECT
```http
GET {{baseUrl}}/users

{{
  const { expect } = require('chai');

  test("Status is 200", () => {
    expect(response.statusCode).to.equal(200);  // Chai assertion
  });

  // Or using Node's assert
  const assert = require('assert');
  assert.strictEqual(response.statusCode, 200);
}}
```

**Error:** Test not recognized or fails incorrectly
**Fix:** Use Chai's `expect().to.equal()` or Node's `assert.strictEqual()`

---

## 15. Not Separating Concerns

### ❌ WRONG (Everything in one file with no organization)
```http
GET {{baseUrl}}/users
###
POST {{baseUrl}}/auth/login
###
GET {{baseUrl}}/orders
###
PUT {{baseUrl}}/users/123
###
GET {{baseUrl}}/products
```

### ✅ CORRECT (Organized by feature)
```
api/
├── _common.http      # Shared variables, auth
├── users.http        # User endpoints
├── orders.http       # Order endpoints
├── products.http     # Product endpoints
```

**Error:** Hard to maintain, difficult to find requests
**Fix:** Split into multiple files by feature/resource

---

## 16. Using exports in @loop for Accumulation

### ❌ WRONG
```http
# @loop for 3
GET {{baseUrl}}/api/articles?page={{$index + 1}}

{{
  exports.articles = exports.articles || [];
  exports.articles.push(...response.parsedBody.data);
  console.log(`Accumulated: ${exports.articles.length}`);
  // Output: 5, 5, 5 (exports resets each iteration!)
}}
```

### ✅ CORRECT
```http
# @loop for 3
GET {{baseUrl}}/api/articles?page={{$index + 1}}

{{
  // Use $global for persistent state in @loop
  if (typeof $global.articles === 'undefined') {
    $global.articles = [];
  }

  $global.articles.push(...response.parsedBody.data);
  console.log(`Accumulated: ${$global.articles.length}`);
  // Output: 5, 10, 15 ✅

  // Save to exports on last iteration
  if ($index === 2) {
    exports.articles = $global.articles;
  }
}}
```

**Error:** `exports` object is reset on each `@loop` iteration, making accumulation impossible
**Fix:** Use `$global.*` (httpYac's persistent global object) for persistent state across loop iterations, then save to `exports` at the end

**Why:** httpYac's `@loop` creates a new script context for each iteration, resetting `exports` but preserving `$global`

---

## 17. Response Content-Type Not application/json

### ❌ WRONG
```http
POST {{baseUrl}}/api/upload

{{
  // Assumes response is always application/json
  const data = response.parsedBody;
  if (data.media_id) {
    exports.mediaId = data.media_id;  // Crash: Cannot read properties of undefined
  }
}}
```

**Problem:** API returns `Content-Type: text/plain` but body is JSON, so `response.parsedBody` is `undefined`.

### ✅ CORRECT
```http
POST {{baseUrl}}/api/upload

{{
  // Fallback to manual parsing if parsedBody is undefined
  const data = response.parsedBody || JSON.parse(response.body);
  if (data.media_id) {
    exports.mediaId = data.media_id;
  }
}}
```

**Real-world example:** WeChat API returns `Content-Type: text/plain; charset=utf-8` even though body is JSON.

**Error:** `TypeError: Cannot read properties of undefined (reading 'field_name')`
**Fix:** Use `response.parsedBody || JSON.parse(response.body)` for APIs with incorrect Content-Type

**Alternative (for debugging):**
```http
{{
  console.log('Content-Type:', response.headers['content-type']);
  console.log('parsedBody:', response.parsedBody);
  console.log('body:', response.body);

  const data = response.parsedBody || JSON.parse(response.body);
  console.log('Response:', data);
}}
```

---

## 18. Incorrect multipart/form-data Boundary Format

### ❌ WRONG
```http
POST {{baseUrl}}/upload
Content-Type: multipart/form-data; boundary=----FormBoundary

------FormBoundary
Content-Disposition: form-data; name="file"; filename="test.jpg"

< ./test.jpg
------FormBoundary--
```

**Problem:** Boundary in Content-Type header has `----` prefix, which is incorrect.

### ✅ CORRECT
```http
POST {{baseUrl}}/upload
Content-Type: multipart/form-data; boundary=FormBoundary

--FormBoundary
Content-Disposition: form-data; name="file"; filename="test.jpg"
Content-Type: image/jpeg

< ./test.jpg
--FormBoundary--
```

**RFC 2046 Rules:**
1. **Header**: `boundary=BoundaryName` (no dashes)
2. **Separator**: `--BoundaryName` (two dashes prefix)
3. **End marker**: `--BoundaryName--` (two dashes prefix + suffix)

**Common patterns:**
- ✅ `boundary=WebKitFormBoundary`
- ✅ `boundary=FormBoundary`
- ❌ `boundary=----FormBoundary` (don't include dashes in boundary name)

**Error:** File upload fails or returns "400 Bad Request"
**Fix:** Remove dashes from boundary name in Content-Type header

**Complete example (matching curl -F):**
```http
# Equivalent to: curl -F "media=@test.jpg" URL
POST {{baseUrl}}/upload?type=image
Content-Type: multipart/form-data; boundary=WebKitFormBoundary

--WebKitFormBoundary
Content-Disposition: form-data; name="media"; filename="test.jpg"
Content-Type: image/jpeg

< ./path/to/test.jpg
--WebKitFormBoundary--
```

**Key point:** The `name="media"` corresponds to `-F media=@file` in curl.

---

## Quick Checklist

Before finalizing .http files, verify:

- [ ] All requests separated by `###`
- [ ] Variables declared before usage
- [ ] Scripts use `{{ }}` delimiters only
- [ ] Global variables use `exports.` prefix (except in `@loop` - use `$global`)
- [ ] Environment variables use `$processEnv.` prefix
- [ ] Content-Type header included for JSON bodies
- [ ] Response errors handled in post-response scripts
- [ ] .env file in correct location (project root)
- [ ] .env added to .gitignore
- [ ] Requests named with `# @name` for chaining
- [ ] Built-in packages used (axios, not fetch)
- [ ] Async operations use `await`
- [ ] In `@loop` directives, use `$global.*` for data accumulation
- [ ] Response parsing handles non-JSON Content-Type (use `parsedBody || JSON.parse(body)`)
- [ ] multipart/form-data boundary format is correct (no dashes in boundary name)
- [ ] File upload field names match API requirements (e.g., `name="media"`)

---

**Last Updated:** 2025-12-25
**Version:** 1.2.0
