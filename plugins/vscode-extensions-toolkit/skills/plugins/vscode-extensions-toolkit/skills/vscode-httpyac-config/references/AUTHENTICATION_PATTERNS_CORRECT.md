# Authentication Patterns for httpYac (CORRECTED)

Complete authentication implementations for common patterns in httpYac .http files.

## ⚠️ CRITICAL: httpYac Authentication Philosophy

httpYac uses **request references (`@name`, `@ref`, `@forceRef`)** instead of sending HTTP requests in scripts.

**✅ CORRECT:**
- Use `# @name` to name authentication requests
- Use `# @ref` or `# @forceRef` to reference them
- Access response data via `{{requestName.response.parsedBody.field}}`

**❌ WRONG:**
- Do NOT use `require('axios')` or `require('got')` in scripts
- These are NOT available or should NOT be used directly

---

## Pattern 1: Simple Bearer Token

**Use when:** API provides a static token or pre-generated token.

```http
# Define token in variables
@accessToken = {{API_TOKEN}}

###

# Use in requests
GET {{baseUrl}}/protected/resource
Authorization: Bearer {{accessToken}}
```

**Key points:**
- Token loaded from environment variable
- No expiry handling
- Suitable for development/testing

---

## Pattern 2: Auto-Fetch Token (Recommended) ⭐

**Use when:** API uses OAuth2 client credentials or password grant.

```http
# @name login
POST {{baseUrl}}/oauth/token
Content-Type: application/json

{
  "grant_type": "client_credentials",
  "client_id": "{{clientId}}",
  "client_secret": "{{clientSecret}}"
}

{{
  // Store token for subsequent requests
  if (response.statusCode === 200) {
    exports.accessToken = response.parsedBody.access_token;
    exports.refreshToken = response.parsedBody.refresh_token;
    exports.expiresAt = Date.now() + (response.parsedBody.expires_in * 1000);
    console.log('✓ Token obtained:', exports.accessToken.substring(0, 20) + '...');
  } else {
    console.error('✗ Login failed:', response.statusCode);
  }
}}

###

# Use token in authenticated requests
GET {{baseUrl}}/api/data
Authorization: Bearer {{accessToken}}

{{
  if (response.statusCode === 200) {
    console.log('✓ Data retrieved successfully');
  } else if (response.statusCode === 401) {
    console.error('✗ Token expired or invalid');
  }
}}
```

**Key points:**
- Token fetched automatically from named request
- Response data stored in `exports` for request chaining
- Error handling for failed authentication
- Token expiry tracked for refresh logic

---

## Pattern 3: Token Refresh with Request Reference ⭐

**Use when:** API provides refresh tokens and tokens expire frequently.

```http
# Variables
@baseUrl = {{API_BASE_URL}}
@clientId = {{CLIENT_ID}}
@clientSecret = {{CLIENT_SECRET}}

###

# Initial login
# @name login
POST {{baseUrl}}/oauth/token
Content-Type: application/json

{
  "grant_type": "password",
  "username": "{{username}}",
  "password": "{{password}}",
  "client_id": "{{clientId}}",
  "client_secret": "{{clientSecret}}"
}

{{
  if (response.statusCode === 200) {
    exports.accessToken = response.parsedBody.access_token;
    exports.refreshToken = response.parsedBody.refresh_token;
    exports.expiresAt = Date.now() + (response.parsedBody.expires_in * 1000);
    console.log('✓ Initial login successful');
  }
}}

###

# Token refresh request
# @name refresh
POST {{baseUrl}}/oauth/token
Content-Type: application/json

{
  "grant_type": "refresh_token",
  "refresh_token": "{{refreshToken}}",
  "client_id": "{{clientId}}",
  "client_secret": "{{clientSecret}}"
}

{{
  if (response.statusCode === 200) {
    exports.accessToken = response.parsedBody.access_token;
    exports.refreshToken = response.parsedBody.refresh_token;
    exports.expiresAt = Date.now() + (response.parsedBody.expires_in * 1000);
    console.log('✓ Token refreshed');
  }
}}

###

# Protected request - references login/refresh as needed
# @forceRef login
GET {{baseUrl}}/api/protected-data
Authorization: Bearer {{accessToken}}

{{
  console.log('✓ Retrieved protected data');
}}
```

**Key points:**
- Separate requests for login and refresh
- Use `@forceRef` to ensure authentication runs first
- Manually call refresh request when needed
- No external HTTP libraries required

---

## Pattern 4: Cross-File Token Import ⭐

**Use when:** Multiple API files need the same authentication.

**File: auth.http**
```http
@baseUrl = {{API_BASE_URL}}

###

# @name auth
POST {{baseUrl}}/oauth/token
Content-Type: application/json

{
  "grant_type": "client_credentials",
  "client_id": "{{clientId}}",
  "client_secret": "{{clientSecret}}"
}

{{
  if (response.statusCode === 200) {
    exports.accessToken = response.parsedBody.access_token;
    console.log('✓ Token obtained');
  }
}}
```

**File: users.http**
```http
@baseUrl = {{API_BASE_URL}}

# Import authentication from another file
# @import ./auth.http

###

# This request will automatically run auth first
# @forceRef auth
GET {{baseUrl}}/users
Authorization: Bearer {{auth.response.parsedBody.access_token}}
```

**Key points:**
- `# @import` loads external .http file
- `# @forceRef` ensures auth runs before this request
- Access token via `{{auth.response.parsedBody.access_token}}`
- Clean separation of concerns

---

## Pattern 5: API Key (Header)

**Use when:** API uses API key in custom header.

```http
@baseUrl = {{API_BASE_URL}}
@apiKey = {{API_KEY}}

###

GET {{baseUrl}}/api/data
X-API-Key: {{apiKey}}

{{
  console.log('✓ Request sent with API key');
}}
```

---

## Pattern 6: API Key (Query Parameter)

**Use when:** API requires API key in URL query string.

```http
@baseUrl = {{API_BASE_URL}}
@apiKey = {{API_KEY}}

###

GET {{baseUrl}}/api/data?api_key={{apiKey}}

###

# Alternative: Multiple parameters
GET {{baseUrl}}/api/data?api_key={{apiKey}}&format=json&limit=10
```

---

## Pattern 7: Basic Auth

**Use when:** API uses HTTP Basic Authentication (username + password).

```http
@baseUrl = {{API_BASE_URL}}
@username = {{API_USERNAME}}
@password = {{API_PASSWORD}}

###

GET {{baseUrl}}/api/data
Authorization: Basic {{username}}:{{password}}

{{
  if (response.statusCode === 200) {
    console.log('✓ Basic auth successful');
  } else if (response.statusCode === 401) {
    console.error('✗ Invalid credentials');
  }
}}
```

---

## Pattern Selection Guide

| API Type | Pattern | Use Case |
|----------|---------|----------|
| Static token | Pattern 1 | Development, testing |
| OAuth2 client credentials | Pattern 2 | Machine-to-machine |
| OAuth2 with refresh | Pattern 3 | Long-running sessions |
| Cross-file auth | Pattern 4 | Multiple API modules |
| API key (header) | Pattern 5 | Public APIs, webhooks |
| API key (query) | Pattern 6 | Public APIs (less secure) |
| Basic Auth | Pattern 7 | Legacy APIs |

---

## Common Mistakes

### ❌ WRONG: Using axios/got in Scripts

```http
{{
  const axios = require('axios');  // ❌ NOT AVAILABLE
  const response = await axios.post(...);
}}
```

### ✅ CORRECT: Using Request References

```http
# @name auth
POST {{baseUrl}}/auth/login
{ ... }

###

# @forceRef auth
GET {{baseUrl}}/api/data
Authorization: Bearer {{auth.response.parsedBody.token}}
```

---

## Official Documentation

- [Request References](https://httpyac.github.io/guide/request.html)
- [Meta Data (@ref, @import)](https://httpyac.github.io/guide/metaData.html)
- [Examples (ArgoCD auth)](https://httpyac.github.io/guide/examples.html)
