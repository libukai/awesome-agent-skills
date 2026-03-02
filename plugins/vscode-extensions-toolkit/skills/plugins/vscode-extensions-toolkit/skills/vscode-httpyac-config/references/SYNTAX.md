# httpYac Syntax Reference

Complete syntax guide for .http files in httpYac.

## Table of Contents

1. [Request Basics](#request-basics)
2. [Variables](#variables)
3. [Headers](#headers)
4. [Request Body](#request-body)
5. [Scripts](#scripts)
6. [Authentication](#authentication)
7. [Comments and Metadata](#comments-and-metadata)
8. [Environment Configuration](#environment-configuration)

---

## Request Basics

### Request Separator

**CRITICAL:** All requests MUST be separated by `###`:

```http
GET https://api.example.com/users

###

POST https://api.example.com/users
```

### Request Line Format

```http
METHOD URL [HTTP/VERSION]
```

**Examples:**
```http
GET https://api.example.com/users
POST https://api.example.com/users HTTP/1.1
PUT {{baseUrl}}/users/123
DELETE {{baseUrl}}/users/{{userId}}
```

### Request Naming

Use `# @name` to name requests for reference chaining:

```http
# @name login
POST {{baseUrl}}/auth/login

###

# @name getUsers
GET {{baseUrl}}/users
Authorization: Bearer {{login.response.parsedBody.token}}
```

---

## Variables

### Variable Declaration Syntax

**Option 1: Inline Variables (@ syntax)**
```http
@baseUrl = https://api.example.com
@token = abc123
```

**Option 2: JavaScript Block ({{ }} syntax)**
```http
{{
  baseUrl = "https://api.example.com";
  token = "abc123";
  userId = 123;
}}
```

**DO NOT MIX BOTH STYLES IN SAME FILE**

### Variable Interpolation

Use `{{variableName}}` to interpolate:

```http
GET {{baseUrl}}/users/{{userId}}
Authorization: Bearer {{token}}
```

### Variable Types

#### 1. Process Environment Variables
```http
{{
  baseUrl = $processEnv.API_BASE_URL;
  token = $processEnv.API_TOKEN;
}}
```

#### 2. Global Variables (Cross-Request)
```http
# First request - set variable via exports
POST {{baseUrl}}/auth/login

{{
  if (response.statusCode === 200) {
    exports.accessToken = response.parsedBody.token;
    exports.userId = response.parsedBody.id;
  }
}}

###

# Use in next request - variables persist across requests
GET {{baseUrl}}/users/{{userId}}
Authorization: Bearer {{accessToken}}
```

**Note:** Variables set via `exports` in scripts are available globally to all subsequent requests.

#### 3. Dynamic Variables
```http
{{
  uuid = $uuid;                    // UUID v4
  timestamp = $timestamp;          // Unix timestamp
  randomInt = $randomInt;          // Random 0-1000
  datetime = $datetime;            // ISO datetime
  guid = $guid;                    // GUID
}}
```

#### 4. User Input Variables
```http
{{
  apiKey = $input "Enter API Key";
  password = $password "Enter Password";
  env = $pick "dev" "test" "prod";
}}
```

---

## Headers

### Basic Headers

```http
GET {{baseUrl}}/users
Content-Type: application/json
Accept: application/json
User-Agent: httpYac/1.0
X-Custom-Header: value
```

### Headers with Variables

```http
GET {{baseUrl}}/users
Authorization: Bearer {{accessToken}}
X-Request-ID: {{$uuid}}
X-Timestamp: {{$timestamp}}
```

### Multiline Header Values

```http
GET {{baseUrl}}/users
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9
  .eyJzdWIiOiIxMjM0NTY3ODkwIn0
  .SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
```

---

## Request Body

### No Body

```http
GET {{baseUrl}}/users
```

### JSON Body

```http
POST {{baseUrl}}/users
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "age": 30
}
```

### JSON with Variables

```http
POST {{baseUrl}}/users
Content-Type: application/json

{
  "name": "{{userName}}",
  "email": "{{userEmail}}",
  "timestamp": {{$timestamp}}
}
```

### Form Data

```http
POST {{baseUrl}}/upload
Content-Type: application/x-www-form-urlencoded

name=John+Doe&email=john@example.com
```

### Multipart Form Data

```http
POST {{baseUrl}}/upload
Content-Type: multipart/form-data; boundary=----Boundary

------Boundary
Content-Disposition: form-data; name="field1"

value1
------Boundary
Content-Disposition: form-data; name="file"; filename="test.txt"
Content-Type: text/plain

< ./files/test.txt
------Boundary--
```

### GraphQL

```http
POST {{baseUrl}}/graphql
Content-Type: application/json

{
  "query": "query GetUser($id: ID!) { user(id: $id) { id name email } }",
  "variables": {
    "id": "{{userId}}"
  }
}
```

---

## Scripts

### Script Execution Timing

httpYac provides multiple script execution contexts with different timing:

#### 1. Standard Script Blocks `{{ }}`

Position determines when the script executes:

**Pre-request (before request line):**
```http
{{
  // Executes BEFORE sending request
  exports.timestamp = Date.now();
}}

GET {{baseUrl}}/users?timestamp={{timestamp}}
```

**Post-response (after request line):**
```http
GET {{baseUrl}}/users

{{
  // Executes AFTER receiving response
  console.log('Status:', response.statusCode);
  exports.userId = response.parsedBody.id;
}}
```

#### 2. Event-Based Scripts `{{@event}}`

Explicit control over execution timing in the request pipeline:

| Event | Timing | Use Case |
|-------|--------|----------|
| `{{@request}}` | Before every request (post-variable replacement) | Modify request headers, inject auth tokens |
| `{{@streaming}}` | During client streaming | Send streaming data to server |
| `{{@response}}` | Upon receiving response | Process response data |
| `{{@responseLogging}}` | During response output | Alter response display format |
| `{{@after}}` | After all processing completes | Cleanup, final logging |

**Example:**
```http
{{@request
  // Runs right before sending request
  request.headers['X-Request-Time'] = new Date().toISOString();
  console.log('→ Sending request to', request.url);
}}

GET {{baseUrl}}/users

{{@response
  // Runs immediately upon receiving response
  console.log('← Response received:', response.statusCode);
}}

{{@after
  // Runs after all processing
  console.log('✓ Request completed');
}}
```

#### 3. Global Scripts `{{+}}` or `{{+event}}`

Execute for ALL requests in the file:

```http
{{+
  // Runs for every request in this file
  exports.globalHeader = 'my-app-v1.0';
  console.log('🌍 Global script executed');
}}

###

GET {{baseUrl}}/users
X-App-Version: {{globalHeader}}

###

GET {{baseUrl}}/orders
X-App-Version: {{globalHeader}}
```

**With events:**
```http
{{+@request
  // Runs before EVERY request in this file
  request.headers['X-Timestamp'] = Date.now().toString();
}}

{{+@response
  // Runs after EVERY response in this file
  console.log('Duration:', response.duration, 'ms');
}}
```

#### Script Execution Order

For a single request, scripts execute in this order:
1. Global pre-request scripts (`{{+}}` or `{{+@request}}`)
2. Request-specific pre-request scripts (`{{}}` before request)
3. `{{@request}}` event scripts
4. **HTTP request sent**
5. `{{@streaming}}` (if applicable)
6. **HTTP response received**
7. `{{@response}}` event scripts
8. Request-specific post-response scripts (`{{}}` after request)
9. `{{@responseLogging}}` event scripts
10. Global post-response scripts (`{{+@response}}`)
11. `{{@after}}` event scripts

### Pre-Request Scripts

Execute BEFORE request is sent. Place `{{ }}` block **before** the request line:

```http
{{
  // Set dynamic variables
  exports.timestamp = Date.now();
  exports.requestId = require('uuid').v4();

  // Fetch external data
  const axios = require('axios');
  const config = await axios.get('https://config.example.com');
  exports.baseUrl = config.data.url;

  // Conditional logic
  if (environment === 'production') {
    console.log('⚠️  Running against production');
  }
}}

GET {{baseUrl}}/users?timestamp={{timestamp}}
X-Request-ID: {{requestId}}
```

**Note:** Use `exports.variableName` to make variables available in the request.

### Post-Response Scripts

Execute AFTER receiving response. Place `{{ }}` block **after** the request:

```http
GET {{baseUrl}}/users

{{
  // Log response
  console.log('Status:', response.statusCode);
  console.log('Duration:', response.duration, 'ms');

  // Extract data for next request (using exports for global scope)
  if (response.statusCode === 200) {
    exports.userId = response.parsedBody.data[0].id;
    exports.userName = response.parsedBody.data[0].name;
  }

  // Error handling
  if (response.statusCode >= 400) {
    console.error('Error:', response.parsedBody.message);
  }
}}
```

**Note:** Variables set via `exports` in response scripts are available in subsequent requests.

### Available Objects in Scripts

**Pre-Request Scripts ({{ }} before request or {{@request}}):**
- `request` - Upcoming request object (can be modified)
- `exports` - Export variables for use in request/later requests
- `$global` - Persistent global object across all requests
- `httpFile` - Current HTTP file metadata
- `httpRegion` - Current request region details
- All declared variables
- Node.js modules via `require()`

**Post-Response Scripts ({{ }} after request or {{@response}}):**
- `response` - Response object
  - `response.statusCode` - HTTP status code
  - `response.headers` - Response headers
  - `response.parsedBody` - Parsed response body (JSON, XML, etc.)
  - `response.body` - Raw response body
  - `response.duration` - Request duration in ms
  - `response.timings` - Detailed timing breakdown
- `request` - Original request object
- `exports` - Export variables for use in later requests
- `$global` - Persistent global object
- All declared variables
- Node.js modules via `require()`

**Special Variables:**
- `$global` - Persistent storage across requests (critical for `@loop`)
- `__dirname` and `__filename` - Module path information
- `console` - Custom console object (output to httpYac panel)

### Cancelling Request Execution

Export `$cancel` to stop execution:

```http
{{
  // Check if API is available
  const axios = require('axios');
  try {
    await axios.get('{{baseUrl}}/health');
  } catch (error) {
    console.error('❌ API is down, cancelling request');
    exports.$cancel = true;  // Stops execution
  }
}}

GET {{baseUrl}}/users
# This request won't execute if health check fails
```

### Test Assertions

```http
GET {{baseUrl}}/users

{{
  // Using Node's assert module
  const assert = require('assert');
  assert.strictEqual(response.statusCode, 200);
  assert.ok(response.parsedBody.data);

  // Using test() helper with Chai expect
  const { expect } = require('chai');

  test("Status is 200", () => {
    expect(response.statusCode).to.equal(200);
  });

  test("Response has users array", () => {
    expect(response.parsedBody.data).to.be.an('array');
    expect(response.parsedBody.data).to.have.length.greaterThan(0);
  });

  test("First user has required fields", () => {
    const user = response.parsedBody.data[0];
    expect(user).to.have.property('id');
    expect(user).to.have.property('name');
    expect(user).to.have.property('email');
  });
}}
```

---

## Authentication

### Bearer Token

```http
GET {{baseUrl}}/protected
Authorization: Bearer {{accessToken}}
```

### Basic Auth

```http
GET {{baseUrl}}/protected
Authorization: Basic {{username}}:{{password}}
```

### OAuth2 (Built-in)

Configure in `.httpyac.json`, then:

```http
GET {{baseUrl}}/protected
Authorization: Bearer {{$oauth2 myFlow access_token}}
```

### Auto-Fetch Token Pattern

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
  if (response.statusCode === 200) {
    exports.accessToken = response.parsedBody.access_token;
    exports.expiresAt = Date.now() + (response.parsedBody.expires_in * 1000);
    console.log('✓ Token obtained');
  }
}}

###

# All subsequent requests use the token
GET {{baseUrl}}/protected
Authorization: Bearer {{accessToken}}
```

### Token Refresh Pattern

```http
{{
  async function ensureValidToken() {
    if (!accessToken || Date.now() >= expiresAt) {
      const axios = require('axios');
      const response = await axios.post(`${baseUrl}/oauth/refresh`, {
        refresh_token: refreshToken
      });
      exports.accessToken = response.data.access_token;
      exports.expiresAt = Date.now() + (response.data.expires_in * 1000);
      console.log('✓ Token refreshed');
    }
  }
  await ensureValidToken();
}}

GET {{baseUrl}}/protected
Authorization: Bearer {{accessToken}}
```

---

## Comments and Metadata

### Single-Line Comments

```http
# This is a comment
// This is also a comment
```

### Multi-Line Comments

```http
###
# This is a multi-line comment
# Describing the API endpoint
###
```

### Request Metadata

```http
# @name requestName
# @description Request description
# @forceEnv production
# @ref otherRequestName
# @import ./other-file.http
```

**Available Metadata:**
- `@name` - Name the request for chaining
- `@description` - Describe the request
- `@forceEnv` - Force specific environment
- `@ref` - Reference other request (for request chaining)
- `@import` - Import external file (to access its functions/variables)
- `@disabled` - Disable request
- `@loop` - Loop execution
- `@timeout` - Request timeout (ms)

---

## Environment Configuration

### .env File

```env
API_BASE_URL=http://localhost:3000
API_USER=dev@example.com
API_TOKEN=dev_token_123
DEBUG=true
```

### .httpyac.json

```json
{
  "environments": {
    "$shared": {
      "userAgent": "httpYac/1.0"
    },
    "dev": {
      "baseUrl": "http://localhost:3000"
    },
    "production": {
      "baseUrl": "https://api.production.com"
    }
  },
  "log": {
    "level": 10
  }
}

<!-- Log levels: 1=trace, 2=debug, 5=warn, 10=info, 100=error, 1000=none -->
```

### Environment Selection

**In File:**
```http
# @forceEnv dev

GET {{baseUrl}}/users
```

**In CLI:**
```bash
httpyac send api.http --env production
```

---

## Complete Example

```http
###############################################################################
# User Management API
###############################################################################

{{
  exports.baseUrl = $processEnv.API_BASE_URL || "http://localhost:3000";
  exports.clientId = $processEnv.CLIENT_ID;
  exports.clientSecret = $processEnv.CLIENT_SECRET;
}}

###

# @name login
# @description Authenticate and get access token
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
    console.log('✓ Authenticated successfully');
  }
}}

###

# @name getUsers
# @description Get all users
GET {{baseUrl}}/users
Authorization: Bearer {{accessToken}}
Accept: application/json

{{
  const { expect } = require('chai');

  test("Status is 200", () => {
    expect(response.statusCode).to.equal(200);
  });

  test("Returns user array", () => {
    expect(response.parsedBody.data).to.be.an('array');
  });

  if (response.parsedBody.data.length > 0) {
    exports.userId = response.parsedBody.data[0].id;
    console.log(`✓ Retrieved ${response.parsedBody.data.length} users`);
  }
}}

###

# @name createUser
# @description Create a new user
POST {{baseUrl}}/users
Authorization: Bearer {{accessToken}}
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com"
}

{{
  if (response.statusCode === 201) {
    exports.newUserId = response.parsedBody.id;
    console.log('✓ Created user:', exports.newUserId);
  }
}}

###

# @name updateUser
# @description Update existing user
PUT {{baseUrl}}/users/{{newUserId}}
Authorization: Bearer {{accessToken}}
Content-Type: application/json

{
  "name": "John Smith"
}

{{
  const { expect } = require('chai');
  test("Update successful", () => {
    expect(response.statusCode).to.equal(200);
  });
}}

###
```

---

## Complete Metadata Directives Reference

httpYac supports metadata directives to control request behavior. Most common directives cover 80% of use cases.

### Request Control

| Directive | Purpose | Example |
|-----------|---------|---------|
| `@name` | Name request for chaining | `# @name login` |
| `@ref` | Reference other request (cached) | `# @ref login` |
| `@forceRef` | Force execute referenced request | `# @forceRef getToken` |
| `@disabled` | Disable request | `# @disabled` |
| `@loop` | Loop execution (⚠️ use `$global` not `exports` for accumulation) | `# @loop for 3` |
| `@sleep` | Pause execution (ms) | `# @sleep 1000` |
| `@import` | Import external file | `# @import ./auth.http` |

### Documentation

| Directive | Purpose | Example |
|-----------|---------|---------|
| `@title` | Custom title for UI | `# @title User Management` |
| `@description` | Request description | `# @description Get user list` |

### Network & Security

| Directive | Purpose | Example |
|-----------|---------|---------|
| `@proxy` | Set HTTP proxy | `# @proxy http://proxy:8080` |
| `@no-proxy` | Ignore proxy settings | `# @no-proxy` |
| `@no-redirect` | Disable HTTP redirects | `# @no-redirect` |
| `@no-reject-unauthorized` | Ignore SSL certificate errors | `# @no-reject-unauthorized` |
| `@no-cookie-jar` | Disable cookie jar | `# @no-cookie-jar` |
| `@no-client-cert` | Disable client certificates | `# @no-client-cert` |

### Response Handling

| Directive | Purpose | Example |
|-----------|---------|---------|
| `@save` | Save response without display | `# @save` |
| `@openWith` | Open with custom editor | `# @openWith vscode.markdown` |
| `@extension` | Set file extension for save | `# @extension .json` |
| `@no-response-view` | Hide response in editor | `# @no-response-view` |

### Logging

| Directive | Purpose | Example |
|-----------|---------|---------|
| `@debug` | Enable debug logging | `# @debug` |
| `@verbose` | Enable trace logging | `# @verbose` |
| `@no-log` | Disable request logging | `# @no-log` |
| `@noStreamingLog` | Disable streaming logs | `# @noStreamingLog` |

### Advanced

| Directive | Purpose | Example |
|-----------|---------|---------|
| `@jwt` | Auto-decode JWT token | `# @jwt accessToken` |
| `@ratelimit` | Rate limiting | `# @ratelimit 10 1000` |
| `@keepStreaming` | Keep streaming connection | `# @keepStreaming` |
| `@note` | Show confirmation dialog | `# @note Confirm deletion?` |
| `@grpc-reflection` | Enable gRPC reflection | `# @grpc-reflection` |
| `@injectVariables` | Inject vars into body | `# @injectVariables` |

**Most Common (80% of use cases):**
- `@name` - Request chaining
- `@description` - Documentation
- `@disabled` - Conditional execution
- `@sleep` - Rate limiting
- `@no-reject-unauthorized` - Testing with self-signed certs

**Example Usage:**
```http
# @name login
# @description Authenticate user and get token
# @sleep 100
POST {{baseUrl}}/auth/login
Content-Type: application/json

{
  "email": "{{user}}",
  "password": "{{password}}"
}

{{
  exports.accessToken = response.parsedBody.token;
}}

###

# @name getUsers
# @ref login
# @disabled process.env.SKIP_TESTS === 'true'
GET {{baseUrl}}/api/users
Authorization: Bearer {{accessToken}}
```

---

## Complete Assertion Operators

Assertions use `??` operator for validation. Common operators cover 90% of use cases.

### Basic Comparison

```http
?? status == 200           # Equal
?? status != 201           # Not equal
?? status > 199            # Greater than
?? status >= 200           # Greater than or equal
?? status < 300            # Less than
?? status <= 299           # Less than or equal
```

### String Operations

```http
?? status startsWith 20            # Prefix match
?? status endsWith 00              # Suffix match
?? header content-type includes json      # Substring
?? header content-type contains application  # Substring (alias)
```

### Type Checking

```http
?? js response.parsedBody.data isArray     # Array type
?? js response.parsedBody.count isNumber   # Number type
?? js response.parsedBody.name isString    # String type
?? js response.parsedBody.active isBoolean # Boolean type
?? js response.parsedBody.name exists      # Property exists
?? js response.parsedBody.optional isFalse # Falsy check
```

### Advanced (Less Common)

```http
# Regex matching
?? js response.parsedBody.email matches ^[\w\.-]+@[\w\.-]+\.\w+$

# Hash validation
?? body sha256 eji/gfOD9pQzrW6QDTWz4jhVk/dqe3q11DVbi6Qe4ks=
?? body md5 5d41402abc4b2a76b9719d911017c592
?? body sha512 <hash>

# XPath for XML responses
?? xpath /root/element exists
?? xpath /root/element == "value"
```

**Most Common (90% of use cases):**
- Comparison: `==`, `!=`, `>`, `<`
- Existence: `exists`, `isFalse`
- Type checking: `isArray`, `isNumber`, `isString`
- String matching: `includes`, `startsWith`

**Example Usage:**
```http
GET {{baseUrl}}/api/articles

?? status == 200
?? js response.parsedBody.status == success
?? js response.parsedBody.data isArray
?? js response.parsedBody.data.length > 0
?? js response.parsedBody.count isNumber
?? duration < 1000

{{
  console.log(`✓ Retrieved ${response.parsedBody.data.length} articles`);
}}
```

---

## Quick Reference

| Feature | Syntax |
|---------|--------|
| Request separator | `###` |
| Request naming | `# @name myRequest` |
| Variable declaration | `{{ exports.var = "value" }}` or `@var = value` |
| Variable interpolation | `{{variableName}}` |
| Environment variables | `$processEnv.VAR_NAME` |
| Pre-request script | `{{ }}` before request |
| Post-response script | `{{ }}` after request |
| Export variables | `exports.variableName` |
| Comments | `#` or `//` |
| Dynamic UUID | `{{$uuid}}` |
| Dynamic timestamp | `{{$timestamp}}` |
| Bearer auth | `Authorization: Bearer {{token}}` |
| Basic auth | `Authorization: Basic {{user}}:{{pass}}` |

---

**Last Updated:** 2025-12-13
**Version:** 1.0.0
