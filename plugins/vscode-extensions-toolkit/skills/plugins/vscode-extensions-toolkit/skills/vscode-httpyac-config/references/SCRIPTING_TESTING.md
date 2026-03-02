# Scripting and Testing in httpYac

Complete guide to JavaScript scripting and test assertions in httpYac .http files.

## Pre-Request Scripts

Execute JavaScript **before** request is sent. Use `{{ }}` block positioned before the request.

### Basic Pre-Request Script

```http
{{
  // Set dynamic variables
  exports.timestamp = Date.now();
  exports.requestId = require('uuid').v4();
  
  console.log('🚀 Sending request:', exports.requestId);
}}

GET {{baseUrl}}/api/endpoint?timestamp={{timestamp}}
X-Request-ID: {{requestId}}
```

### External Data Loading

```http
{{
  const axios = require('axios');
  
  // Fetch configuration from external service
  const config = await axios.get('https://config-service.com/api-config');
  exports.baseUrl = config.data.apiUrl;
  exports.apiVersion = config.data.version;
  
  console.log('✓ Configuration loaded:', exports.baseUrl);
}}

GET {{baseUrl}}/v{{apiVersion}}/users
```

### Conditional Logic

```http
{{
  const environment = $processEnv.NODE_ENV || 'development';
  
  if (environment === 'production') {
    console.log('⚠️  WARNING: Running against production!');
    exports.baseUrl = 'https://api.production.com';
  } else {
    exports.baseUrl = 'http://localhost:3000';
  }
  
  console.log('📍 Environment:', environment, '| Base URL:', exports.baseUrl);
}}

GET {{baseUrl}}/api/data
```

### File Reading

```http
{{
  const fs = require('fs');
  const path = require('path');
  
  // Read test data from file
  const dataPath = path.join(__dirname, 'test-data.json');
  const testData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
  
  exports.userId = testData.users[0].id;
  exports.userName = testData.users[0].name;
  
  console.log('✓ Test data loaded:', exports.userName);
}}

GET {{baseUrl}}/users/{{userId}}
```

### Token Expiry Check

```http
{{
  // Check if token exists and is valid
  if (!accessToken || Date.now() >= expiresAt) {
    console.log('⟳ Token expired, fetching new token...');
    
    const axios = require('axios');
    const response = await axios.post(`${baseUrl}/oauth/token`, {
      grant_type: 'client_credentials',
      client_id: clientId,
      client_secret: clientSecret
    });
    
    exports.accessToken = response.data.access_token;
    exports.expiresAt = Date.now() + (response.data.expires_in * 1000);
    console.log('✓ New token obtained');
  } else {
    console.log('✓ Using existing token');
  }
}}

GET {{baseUrl}}/api/protected
Authorization: Bearer {{accessToken}}
```

---

## Post-Response Scripts

Execute JavaScript **after** receiving response. Use `{{ }}` block positioned after the request.

### Basic Post-Response Script

```http
GET {{baseUrl}}/users

{{
  // Log response details
  console.log('📊 Status:', response.statusCode);
  console.log('⏱️  Duration:', response.duration, 'ms');
  console.log('📦 Body:', JSON.stringify(response.parsedBody, null, 2));
}}
```

### Extract Data for Next Request

```http
# @name createUser
POST {{baseUrl}}/users
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com"
}

{{
  // Store user ID for subsequent requests
  if (response.statusCode === 201) {
    exports.userId = response.parsedBody.id;
    exports.userName = response.parsedBody.name;
    exports.userEmail = response.parsedBody.email;
    
    console.log('✓ User created:', exports.userId);
    console.log('  Name:', exports.userName);
    console.log('  Email:', exports.userEmail);
  } else {
    console.error('✗ User creation failed:', response.statusCode);
  }
}}

###

# Use extracted user ID
GET {{baseUrl}}/users/{{userId}}
```

### Response Validation

```http
GET {{baseUrl}}/api/articles

{{
  const articles = response.parsedBody.data;
  
  // Validation logic
  if (response.statusCode === 200) {
    console.log('✓ Request successful');
    console.log('📄 Retrieved', articles.length, 'articles');
    
    // Validate data structure
    const hasRequiredFields = articles.every(article => 
      article.id && article.title && article.author
    );
    
    if (hasRequiredFields) {
      console.log('✓ All articles have required fields');
    } else {
      console.warn('⚠️  Some articles missing required fields');
    }
    
  } else {
    console.error('✗ Request failed:', response.statusCode);
    console.error('   Message:', response.parsedBody.message);
  }
}}
```

### Store Token from Login Response

```http
# @name login
POST {{baseUrl}}/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}

{{
  if (response.statusCode === 200) {
    // Store authentication data
    exports.accessToken = response.parsedBody.access_token;
    exports.refreshToken = response.parsedBody.refresh_token;
    exports.userId = response.parsedBody.user.id;
    exports.expiresAt = Date.now() + (response.parsedBody.expires_in * 1000);
    
    console.log('✓ Login successful');
    console.log('  User ID:', exports.userId);
    console.log('  Token expires in:', response.parsedBody.expires_in, 'seconds');
    console.log('  Token preview:', exports.accessToken.substring(0, 20) + '...');
    
  } else if (response.statusCode === 401) {
    console.error('✗ Invalid credentials');
  } else {
    console.error('✗ Login failed:', response.statusCode);
  }
}}
```

### Error Handling

```http
GET {{baseUrl}}/api/data

{{
  if (response.statusCode >= 200 && response.statusCode < 300) {
    console.log('✓ Success:', response.statusCode);
    exports.lastSuccess = Date.now();
    
  } else if (response.statusCode === 401) {
    console.error('✗ Unauthorized - check credentials');
    console.log('💡 Hint: Run the login request first');
    
  } else if (response.statusCode === 404) {
    console.error('✗ Resource not found');
    
  } else if (response.statusCode >= 500) {
    console.error('✗ Server error:', response.statusCode);
    console.error('   Message:', response.parsedBody?.message || 'Unknown error');
    
  } else {
    console.error('✗ Request failed:', response.statusCode);
  }
}}
```

---

## Utility Functions

Create reusable functions for common operations.

### Response Validation Function

```http
{{
  // Export utility function for response validation
  exports.validateResponse = function(response, actionName) {
    if (response.statusCode >= 200 && response.statusCode < 300) {
      console.log(`✓ ${actionName} 成功 (${response.statusCode})`);
      return true;
    } else {
      console.error(`✗ ${actionName} 失败 (${response.statusCode})`);
      if (response.parsedBody?.message) {
        console.error(`  错误: ${response.parsedBody.message}`);
      }
      return false;
    }
  };
  
  console.log('✓ Utility functions loaded');
}}

###

# Use the utility function
GET {{baseUrl}}/users

{{
  // Call the function (without exports.)
  if (validateResponse(response, '获取用户列表')) {
    console.log('📊 Retrieved', response.parsedBody.length, 'users');
  }
}}
```

### Base64 Content Decoder

```http
{{
  // Export utility function for Base64 decoding
  exports.decodeBase64Content = function(base64String) {
    if (!base64String) return null;
    return Buffer.from(base64String, 'base64').toString('utf8');
  };
}}

###

GET {{baseUrl}}/api/article/123

{{
  if (validateResponse(response, '获取文章')) {
    const article = response.parsedBody;
    
    // Decode Base64 content
    if (article.content) {
      const decodedContent = decodeBase64Content(article.content);
      console.log('📄 Title:', article.title);
      console.log('📝 Content preview:', decodedContent.substring(0, 100) + '...');
      
      exports.articleContent = decodedContent;
    }
  }
}}
```

### Multiple Utility Functions

```http
{{
  // Response validator
  exports.validateResponse = function(response, actionName) {
    const isSuccess = response.statusCode >= 200 && response.statusCode < 300;
    console.log(isSuccess ? '✓' : '✗', actionName, `(${response.statusCode})`);
    return isSuccess;
  };
  
  // Base64 decoder
  exports.decodeBase64 = function(encoded) {
    return Buffer.from(encoded, 'base64').toString('utf8');
  };
  
  // Timestamp formatter
  exports.formatTimestamp = function(timestamp) {
    return new Date(timestamp * 1000).toISOString();
  };
  
  // Safe JSON parser
  exports.safeJsonParse = function(str, fallback = {}) {
    try {
      return JSON.parse(str);
    } catch (e) {
      console.warn('⚠️  JSON parse failed, using fallback');
      return fallback;
    }
  };
  
  console.log('✓ All utility functions loaded');
}}
```

---

## Test Assertions

### Simple Assertions (Recommended)

Use `??` syntax for direct field assertions (no `js` prefix needed).

```http
GET {{baseUrl}}/api/articles

# Direct field assertions (no js prefix)
?? status == 200
?? duration < 1000

# Response object access (requires js prefix)
?? js response.parsedBody.status == success
?? js response.parsedBody.data isArray
?? js response.parsedBody.data.length > 0

{{
  console.log('✓ All assertions passed');
}}
```

### Assertion Operators

```http
GET {{baseUrl}}/users/123

# Equality
?? js response.parsedBody.id == 123
?? js response.parsedBody.name == John Doe

# Inequality
?? js response.parsedBody.age != 0

# Type checking
?? js response.parsedBody.id isNumber
?? js response.parsedBody.name isString
?? js response.parsedBody.active isBoolean
?? js response.parsedBody.tags isArray

# Existence
?? js response.parsedBody.email exists
?? js response.parsedBody.phone exists

# Comparison
?? js response.parsedBody.age > 18
?? js response.parsedBody.score >= 75
?? js response.parsedBody.price < 100
?? js response.parsedBody.discount <= 50

# Contains (for arrays)
?? js response.parsedBody.tags includes admin
```

**⚠️ CRITICAL RULES:**
1. Direct fields (`status`, `duration`) → No `js` prefix
2. `response` object access → **MUST use `js` prefix**
3. String comparisons → **NO quotes needed**
   - ✅ `?? js response.parsedBody.status == success`
   - ❌ `?? js response.parsedBody.status == "success"`

### Script-Based Assertions (Complex Logic)

```http
GET {{baseUrl}}/api/users

{{
  const assert = require('assert');
  const users = response.parsedBody.data;
  
  // Assertion 1: Status code
  assert.strictEqual(response.statusCode, 200, 'Expected 200 status');
  console.log('✓ Status code is 200');
  
  // Assertion 2: Response has data
  assert.ok(users, 'Response should have users data');
  console.log('✓ Users data exists');
  
  // Assertion 3: Array is not empty
  assert.ok(users.length > 0, 'Users array should not be empty');
  console.log('✓ Users array contains', users.length, 'items');
  
  // Assertion 4: Each user has required fields
  users.forEach((user, index) => {
    assert.ok(user.id, `User ${index} should have ID`);
    assert.ok(user.email, `User ${index} should have email`);
    assert.ok(user.name, `User ${index} should have name`);
  });
  console.log('✓ All users have required fields');
}}
```

### Chai Assertions (Fluent API)

```http
GET {{baseUrl}}/api/articles

{{
  const { expect } = require('chai');
  
  test("Response is successful", () => {
    expect(response.statusCode).to.equal(200);
  });
  
  test("Response contains articles array", () => {
    expect(response.parsedBody).to.have.property('data');
    expect(response.parsedBody.data).to.be.an('array');
    expect(response.parsedBody.data.length).to.be.greaterThan(0);
  });
  
  test("First article has required structure", () => {
    const article = response.parsedBody.data[0];
    expect(article).to.have.property('id');
    expect(article).to.have.property('title');
    expect(article).to.have.property('author');
    expect(article).to.have.property('created_at');
  });
  
  test("Article title is not empty", () => {
    const article = response.parsedBody.data[0];
    expect(article.title).to.be.a('string');
    expect(article.title).to.not.be.empty;
  });
  
  test("Response time is acceptable", () => {
    expect(response.duration).to.be.below(2000); // Less than 2 seconds
  });
}}
```

### JSON Schema Validation

```http
GET {{baseUrl}}/api/user/123

{{
  const Ajv = require('ajv');
  const ajv = new Ajv();
  
  // Define JSON schema
  const userSchema = {
    type: 'object',
    required: ['id', 'name', 'email'],
    properties: {
      id: { type: 'number' },
      name: { type: 'string', minLength: 1 },
      email: { type: 'string', format: 'email' },
      age: { type: 'number', minimum: 0 },
      roles: { 
        type: 'array',
        items: { type: 'string' }
      }
    }
  };
  
  // Validate response against schema
  const validate = ajv.compile(userSchema);
  const valid = validate(response.parsedBody);
  
  if (valid) {
    console.log('✓ Response matches schema');
  } else {
    console.error('✗ Schema validation failed:');
    console.error(validate.errors);
  }
}}
```

---

## test() Convenience Methods

httpYac provides shorthand methods for common assertions, simplifying test code without chai/assert libraries.

### Quick Assertions

```http
GET {{baseUrl}}/api/users

{{
  // Status code check
  test.status(200);

  // Response time check (milliseconds)
  test.totalTime(300);

  // Exact header match
  test.header("content-type", "application/json");

  // Partial header match
  test.headerContains("content-type", "json");

  // Body content match
  test.responseBody('{"status":"success"}');

  // Body existence checks
  test.hasResponseBody();
  // test.hasNoResponseBody();  // Uncomment for empty response check
}}
```

### Method Reference

| Method | Purpose | Example |
|--------|---------|---------|
| `test.status(code)` | Verify HTTP status code | `test.status(200)` |
| `test.totalTime(ms)` | Max response time check | `test.totalTime(500)` |
| `test.header(name, value)` | Exact header match | `test.header("content-type", "application/json")` |
| `test.headerContains(name, substr)` | Partial header match | `test.headerContains("content-type", "json")` |
| `test.responseBody(content)` | Exact body content match | `test.responseBody('{}')` |
| `test.hasResponseBody()` | Verify body exists | `test.hasResponseBody()` |
| `test.hasNoResponseBody()` | Verify body is empty | `test.hasNoResponseBody()` |

### Usage Patterns

**Basic validation (most common):**
```http
POST {{baseUrl}}/api/login
Content-Type: application/json

{
  "email": "{{user}}",
  "password": "{{password}}"
}

{{
  test.status(200);
  test.totalTime(1000);
  test.headerContains("content-type", "json");
  test.hasResponseBody();

  // Additional validation
  if (response.parsedBody.token) {
    exports.accessToken = response.parsedBody.token;
    console.log('✓ Login successful');
  }
}}
```

**Performance monitoring:**
```http
GET {{baseUrl}}/api/heavy-computation

{{
  test.status(200);
  test.totalTime(2000);  // Must complete within 2 seconds
  console.log(`⏱️  Response time: ${response.timings.total}ms`);
}}
```

**API contract validation:**
```http
GET {{baseUrl}}/api/users

{{
  test.status(200);
  test.header("content-type", "application/json; charset=utf-8");
  test.header("x-api-version", "2.0");
  test.hasResponseBody();
}}
```

### When to Use

**Use test() convenience methods when:**
- ✅ Quick validation without external libraries
- ✅ Simple status/header/body checks
- ✅ Performance thresholds
- ✅ Existence checks

**Use test() with chai/assert when:**
- ✅ Complex data structure validation
- ✅ Custom error messages needed
- ✅ Multiple related assertions
- ✅ JSON schema validation

**Example combining both:**
```http
GET {{baseUrl}}/api/articles

{{
  // Quick checks
  test.status(200);
  test.totalTime(500);
  test.hasResponseBody();

  // Complex validation with chai
  const { expect } = require('chai');

  test('Response structure', () => {
    expect(response.parsedBody).to.have.property('data');
    expect(response.parsedBody.data).to.be.an('array');
    expect(response.parsedBody.data.length).to.be.greaterThan(0);
  });

  test('Article properties', () => {
    const article = response.parsedBody.data[0];
    expect(article).to.have.all.keys('id', 'title', 'content', 'author');
  });
}}
```

---

## Request Chaining

Pass data between requests using `exports` variables.

### Sequential Workflow

```http
# Step 1: Create resource
# @name createArticle
POST {{baseUrl}}/articles
Content-Type: application/json

{
  "title": "Test Article",
  "content": "Article content here"
}

{{
  if (validateResponse(response, 'Create Article')) {
    exports.articleId = response.parsedBody.id;
    exports.articleSlug = response.parsedBody.slug;
    console.log('📝 Article created with ID:', exports.articleId);
  }
}}

###

# Step 2: Retrieve created resource
# @name getArticle
GET {{baseUrl}}/articles/{{articleId}}

{{
  if (validateResponse(response, 'Get Article')) {
    console.log('📄 Retrieved article:', response.parsedBody.title);
  }
}}

###

# Step 3: Update resource
# @name updateArticle
PATCH {{baseUrl}}/articles/{{articleId}}
Content-Type: application/json

{
  "title": "Updated Article Title"
}

{{
  if (validateResponse(response, 'Update Article')) {
    console.log('✏️  Article updated successfully');
  }
}}

###

# Step 4: Delete resource
# @name deleteArticle
DELETE {{baseUrl}}/articles/{{articleId}}

{{
  if (validateResponse(response, 'Delete Article')) {
    console.log('🗑️  Article deleted successfully');
  }
}}
```

### Parallel Data Collection

```http
# Collect data from multiple endpoints

# Request 1: Get user info
# @name getUser
GET {{baseUrl}}/users/123

{{
  if (response.statusCode === 200) {
    exports.userName = response.parsedBody.name;
    exports.userEmail = response.parsedBody.email;
  }
}}

###

# Request 2: Get user's posts
# @name getUserPosts
GET {{baseUrl}}/users/123/posts

{{
  if (response.statusCode === 200) {
    exports.postCount = response.parsedBody.length;
  }
}}

###

# Request 3: Aggregate results
# @name aggregateData
GET {{baseUrl}}/users/123/summary

{{
  console.log('👤 User Summary:');
  console.log('   Name:', userName);
  console.log('   Email:', userEmail);
  console.log('   Posts:', postCount);
}}
```

---

## Available Response Object

Access these properties in post-response scripts:

```javascript
response.statusCode        // HTTP status code (200, 404, etc.)
response.statusMessage     // Status message ("OK", "Not Found", etc.)
response.duration          // Request duration in milliseconds
response.headers           // Response headers object
response.body              // Raw response body (string/buffer)
response.parsedBody        // Parsed JSON response (if Content-Type is JSON)
response.contentType       // Content-Type header
response.request           // Original request object
```

### Example Usage

```http
GET {{baseUrl}}/api/data

{{
  console.log('Status:', response.statusCode, response.statusMessage);
  console.log('Duration:', response.duration, 'ms');
  console.log('Content-Type:', response.contentType);
  console.log('Headers:', JSON.stringify(response.headers, null, 2));
  
  // Access specific header
  const rateLimit = response.headers['x-ratelimit-remaining'];
  console.log('Rate limit remaining:', rateLimit);
  
  // Work with parsed body
  if (response.parsedBody) {
    console.log('Data:', JSON.stringify(response.parsedBody, null, 2));
  }
}}
```

---

## Available Request Object

Access request details in both pre and post-request scripts:

```javascript
request.url                // Full request URL
request.method             // HTTP method (GET, POST, etc.)
request.headers            // Request headers
request.body               // Request body
```

### Example Usage

```http
{{
  console.log('About to send:');
  console.log('  Method:', request.method);
  console.log('  URL:', request.url);
  console.log('  Headers:', JSON.stringify(request.headers, null, 2));
}}

POST {{baseUrl}}/api/data
Content-Type: application/json

{
  "name": "test"
}

{{
  console.log('Request completed in', response.duration, 'ms');
}}
```

---

## Node.js Modules

httpYac scripts run in Node.js context. You can use any built-in or installed modules.

### Built-in Modules

```http
{{
  const fs = require('fs');
  const path = require('path');
  const crypto = require('crypto');
  const os = require('os');
  
  // File operations
  const data = fs.readFileSync('./config.json', 'utf8');
  
  // Path operations
  const filePath = path.join(__dirname, 'data', 'test.json');
  
  // Crypto operations
  const hash = crypto.createHash('sha256').update('data').digest('hex');
  
  // System info
  console.log('Platform:', os.platform());
  console.log('Hostname:', os.hostname());
}}
```

### External Modules (require package installation)

```http
{{
  const axios = require('axios');        // HTTP client
  const uuid = require('uuid');          // UUID generator
  const moment = require('moment');      // Date manipulation
  const lodash = require('lodash');      // Utility functions
  const jwt = require('jsonwebtoken');   // JWT operations
  
  // Generate UUID
  exports.requestId = uuid.v4();
  
  // Format date
  exports.timestamp = moment().format('YYYY-MM-DD HH:mm:ss');
  
  // Use lodash
  const sorted = lodash.sortBy([3, 1, 2]);
}}
```

**Note:** Install packages in your project:
```bash
npm install axios uuid moment lodash jsonwebtoken
```

---

## Best Practices

### 1. Function Naming

```http
{{
  // ✅ Export functions for use in later requests
  exports.validateResponse = function(response, actionName) { };
  exports.decodeBase64 = function(encoded) { };
  
  // ❌ Don't use exports when calling
  // exports.validateResponse(response, 'Test');  // WRONG
  
  // ✅ Call without exports
  validateResponse(response, 'Test');  // CORRECT
}}
```

### 2. Error Handling

```http
{{
  try {
    const data = JSON.parse(someString);
    exports.parsedData = data;
  } catch (error) {
    console.error('✗ Parse error:', error.message);
    exports.parsedData = null;
  }
}}
```

### 3. Logging

```http
{{
  // Use emoji for visual distinction
  console.log('✓ Success message');
  console.warn('⚠️  Warning message');
  console.error('✗ Error message');
  console.log('📊 Data:', data);
  console.log('⏱️  Time:', duration);
  console.log('🚀 Starting...');
}}
```

### 4. Variable Management

```http
# ✅ Environment variables at top
@baseUrl = {{API_BASE_URL}}
@apiKey = {{API_KEY}}

{{
  // ✅ Dynamic variables in scripts
  exports.timestamp = Date.now();
  exports.nonce = require('uuid').v4();
}}

###

GET {{baseUrl}}/api/data
X-API-Key: {{apiKey}}
X-Timestamp: {{timestamp}}
```

### 5. Reusable Utilities

Put common functions at the top of file for reuse:

```http
# ============================================================
# Utility Functions
# ============================================================

{{
  exports.validateResponse = function(response, actionName) {
    // Implementation
  };
  
  exports.decodeBase64 = function(encoded) {
    // Implementation
  };
  
  console.log('✓ Utilities loaded');
}}

###

# ============================================================
# API Requests
# ============================================================

# All requests below can use utility functions
```

---

## Common Issues

### Issue 1: Function Not Defined

**Symptom:** `ReferenceError: functionName is not defined`

**Cause:** Function not exported or called with `exports.` prefix

**Fix:**
```http
{{
  // Define with exports.
  exports.myFunction = function() { };
}}

###

GET {{baseUrl}}/api/test

{{
  // Call WITHOUT exports.
  myFunction();  // ✅ Correct
  // exports.myFunction();  // ❌ Wrong
}}
```

### Issue 2: Variable Not Persisting

**Symptom:** Variable works in one request but undefined in next

**Cause:** Using `const`/`let` instead of `exports`

**Fix:**
```http
{{
  // ❌ Wrong - local variable
  const token = response.parsedBody.token;
  
  // ✅ Correct - persists across requests
  exports.token = response.parsedBody.token;
}}
```

### Issue 3: Assertion Syntax Error

**Symptom:** Assertion fails unexpectedly

**Fix:** Check `js` prefix usage
```http
# ✅ Direct fields - no js prefix
?? status == 200
?? duration < 1000

# ✅ Response object - js prefix required
?? js response.parsedBody.status == success
?? js response.parsedBody.data isArray
```

---

## Quick Reference

**Pre-request script:**
```http
{{ /* JavaScript before request */ }}
GET {{baseUrl}}/endpoint
```

**Post-response script:**
```http
GET {{baseUrl}}/endpoint
{{ /* JavaScript after response */ }}
```

**Export variables:**
```javascript
exports.variableName = value;  // Persists across requests
```

**Call exported functions:**
```javascript
functionName();  // NO exports. prefix
```

**Simple assertions:**
```http
?? status == 200
?? js response.parsedBody.field == value
```

**Complex assertions:**
```javascript
const { expect } = require('chai');
test("Description", () => {
  expect(response.statusCode).to.equal(200);
});
```
