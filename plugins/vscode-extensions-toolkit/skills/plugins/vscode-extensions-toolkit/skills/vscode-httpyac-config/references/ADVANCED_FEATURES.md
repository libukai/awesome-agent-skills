# Advanced Features in httpYac

Advanced httpYac capabilities beyond basic HTTP requests.

## Dynamic Variables

### Built-in Variables

```http
{{
  // UUID generation
  exports.requestId = $uuid;           // UUID v4
  exports.correlationId = $guid;       // GUID (alias for UUID)

  // Timestamps
  exports.timestamp = $timestamp;      // Unix timestamp (seconds)
  exports.timestampMs = $timestampMs;  // Unix timestamp (milliseconds)
  exports.datetime = $datetime;        // ISO 8601 datetime
  exports.date = $date;                // Current date (YYYY-MM-DD)
  exports.time = $time;                // Current time (HH:mm:ss)

  // Random values
  exports.randomInt = $randomInt;      // Random integer (0-1000)
  exports.randomFloat = $randomFloat;  // Random float (0.0-1.0)
  exports.randomUUID = $randomUUID;    // Random UUID v4

  console.log('Request ID:', exports.requestId);
  console.log('Timestamp:', exports.datetime);
}}

###

GET {{baseUrl}}/api/data
X-Request-ID: {{requestId}}
X-Timestamp: {{datetime}}
```

### User Input Variables

```http
{{
  // Text input
  exports.apiKey = $input "Enter your API key";

  // Password input (hidden)
  exports.password = $password "Enter your password";

  // Dropdown selection
  exports.environment = $pick "dev" "test" "production";

  // Multiple selection
  exports.features = $multipick "feature1" "feature2" "feature3";

  // Number input
  exports.timeout = $number "Enter timeout (ms)" 30000;

  // Confirmation
  exports.confirmed = $confirm "Are you sure?";
}}
```

### Custom Random Data

```http
{{
  const faker = require('@faker-js/faker').faker;

  // Generate fake data
  exports.userName = faker.person.fullName();
  exports.userEmail = faker.internet.email();
  exports.userPhone = faker.phone.number();
  exports.userAddress = faker.location.streetAddress();
  exports.companyName = faker.company.name();

  console.log('Generated user:', exports.userName, exports.userEmail);
}}

###

POST {{baseUrl}}/users
Content-Type: application/json

{
  "name": "{{userName}}",
  "email": "{{userEmail}}",
  "phone": "{{userPhone}}"
}
```

---

## File Operations

### File Upload (Multipart Form Data)

```http
POST {{baseUrl}}/upload
Content-Type: multipart/form-data; boundary=----Boundary

------Boundary
Content-Disposition: form-data; name="file"; filename="document.pdf"
Content-Type: application/pdf

< ./files/document.pdf
------Boundary
Content-Disposition: form-data; name="description"

This is a document upload
------Boundary--

{{
  if (response.statusCode === 200) {
    console.log('✓ File uploaded:', response.parsedBody.fileId);
    exports.uploadedFileId = response.parsedBody.fileId;
  }
}}
```

### Multiple File Upload

```http
POST {{baseUrl}}/upload-multiple
Content-Type: multipart/form-data; boundary=----Boundary

------Boundary
Content-Disposition: form-data; name="files"; filename="file1.pdf"
Content-Type: application/pdf

< ./files/file1.pdf
------Boundary
Content-Disposition: form-data; name="files"; filename="file2.jpg"
Content-Type: image/jpeg

< ./files/file2.jpg
------Boundary
Content-Disposition: form-data; name="metadata"
Content-Type: application/json

{
  "category": "documents",
  "tags": ["important", "urgent"]
}
------Boundary--
```

### File Download

```http
GET {{baseUrl}}/download/{{fileId}}
Authorization: Bearer {{accessToken}}

{{
  if (response.statusCode === 200) {
    const fs = require('fs');
    const path = require('path');

    // Save response body to file
    const filename = response.headers['content-disposition']
      ?.split('filename=')[1]
      ?.replace(/"/g, '') || 'downloaded-file';

    const filepath = path.join(__dirname, 'downloads', filename);
    fs.writeFileSync(filepath, response.body);

    console.log('✓ File saved:', filepath);
  }
}}
```

### Read File Content into Request

```http
{{
  const fs = require('fs');
  const path = require('path');

  // Read JSON file
  const dataPath = path.join(__dirname, 'test-data.json');
  const testData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

  exports.testUserId = testData.users[0].id;
  exports.testUserData = JSON.stringify(testData.users[0]);
}}

###

POST {{baseUrl}}/users
Content-Type: application/json

{{testUserData}}
```

---

## GraphQL Support

### Basic GraphQL Query

```http
POST {{baseUrl}}/graphql
Content-Type: application/json
Authorization: Bearer {{accessToken}}

{
  "query": "query { users { id name email } }"
}

{{
  if (response.statusCode === 200) {
    const users = response.parsedBody.data.users;
    console.log('✓ Retrieved', users.length, 'users');
  }
}}
```

### GraphQL with Variables

```http
POST {{baseUrl}}/graphql
Content-Type: application/json

{
  "query": "query GetUser($id: ID!) { user(id: $id) { id name email createdAt } }",
  "variables": {
    "id": "{{userId}}"
  }
}

{{
  if (response.parsedBody.data) {
    const user = response.parsedBody.data.user;
    console.log('📄 User:', user.name, user.email);
  }

  if (response.parsedBody.errors) {
    console.error('✗ GraphQL errors:', response.parsedBody.errors);
  }
}}
```

### GraphQL Mutation

```http
POST {{baseUrl}}/graphql
Content-Type: application/json

{
  "query": "mutation CreateUser($input: UserInput!) { createUser(input: $input) { id name email } }",
  "variables": {
    "input": {
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user"
    }
  }
}

{{
  if (response.parsedBody.data?.createUser) {
    exports.newUserId = response.parsedBody.data.createUser.id;
    console.log('✓ User created:', exports.newUserId);
  }
}}
```

### GraphQL Fragments

```http
POST {{baseUrl}}/graphql
Content-Type: application/json

{
  "query": "fragment UserFields on User { id name email createdAt } query GetUsers { users { ...UserFields } } query GetUser($id: ID!) { user(id: $id) { ...UserFields posts { id title } } }",
  "variables": {
    "id": "123"
  },
  "operationName": "GetUser"
}
```

---

## gRPC Support

### Basic gRPC Request

```http
GRPC {{grpcHost}}:{{grpcPort}}
grpc-service: myapp.UserService
grpc-method: GetUser

{
  "id": "{{userId}}"
}

{{
  if (response.statusCode === 0) {  // gRPC success code
    console.log('✓ User retrieved:', response.parsedBody.name);
  }
}}
```

### gRPC Streaming

```http
# Server streaming
GRPC {{grpcHost}}:{{grpcPort}}
grpc-service: myapp.ChatService
grpc-method: SubscribeMessages

{
  "room_id": "general"
}

{{
  // Handle streaming responses
  response.stream.on('data', (message) => {
    console.log('📨 Message:', message.text);
  });

  response.stream.on('end', () => {
    console.log('✓ Stream ended');
  });
}}
```

### gRPC Metadata

```http
GRPC {{grpcHost}}:{{grpcPort}}
grpc-service: myapp.UserService
grpc-method: GetUser
authorization: Bearer {{accessToken}}
x-request-id: {{requestId}}

{
  "id": "{{userId}}"
}
```

---

## WebSocket Support

### WebSocket Connection

```http
WS {{wsUrl}}/socket
Content-Type: application/json

{
  "action": "subscribe",
  "channel": "updates"
}

{{
  // Handle incoming messages
  connection.on('message', (data) => {
    console.log('📨 Received:', data);
  });

  connection.on('close', () => {
    console.log('🔌 Connection closed');
  });

  // Send additional messages
  setTimeout(() => {
    connection.send(JSON.stringify({
      action: 'ping',
      timestamp: Date.now()
    }));
  }, 5000);
}}
```

### WebSocket with Authentication

```http
WS {{wsUrl}}/socket?token={{accessToken}}

{
  "action": "authenticate",
  "token": "{{accessToken}}"
}

{{
  connection.on('open', () => {
    console.log('✓ WebSocket connected');
  });

  connection.on('message', (data) => {
    const message = JSON.parse(data);

    if (message.type === 'auth_success') {
      console.log('✓ Authentication successful');

      // Subscribe to channels
      connection.send(JSON.stringify({
        action: 'subscribe',
        channels: ['notifications', 'messages']
      }));
    }
  });
}}
```

---

## Server-Sent Events (SSE)

```http
GET {{baseUrl}}/events
Accept: text/event-stream
Authorization: Bearer {{accessToken}}

{{
  response.stream.on('data', (chunk) => {
    const data = chunk.toString();

    // Parse SSE format
    const lines = data.split('\n');
    lines.forEach(line => {
      if (line.startsWith('data: ')) {
        const eventData = JSON.parse(line.substring(6));
        console.log('📡 Event:', eventData);
      }
    });
  });

  response.stream.on('end', () => {
    console.log('✓ Stream ended');
  });
}}
```

---

## Cookie Management

### Send Cookies

```http
GET {{baseUrl}}/api/data
Cookie: session_id={{sessionId}}; user_pref=dark_mode
```

### Auto-Manage Cookies (Cookie Jar)

**Enable in .httpyac.json:**

```json
{
	"cookieJarEnabled": true
}
```

**Cookies automatically stored and sent:**

```http
# Step 1: Login (receives Set-Cookie header)
POST {{baseUrl}}/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}

{{
  // Cookies automatically stored
  console.log('✓ Login successful, cookies stored');
}}

###

# Step 2: Subsequent requests use stored cookies automatically
GET {{baseUrl}}/api/profile
# Cookies sent automatically - no need to specify
```

### Manual Cookie Access

```http
GET {{baseUrl}}/api/data

{{
  // Access response cookies
  const cookies = response.headers['set-cookie'];

  if (cookies) {
    cookies.forEach(cookie => {
      console.log('🍪 Cookie:', cookie);

      // Parse specific cookie
      if (cookie.startsWith('session_id=')) {
        exports.sessionId = cookie.split(';')[0].split('=')[1];
      }
    });
  }
}}
```

---

## Request/Response Hooks

### Global Hooks (httpyac.config.js)

```javascript
module.exports = {
	hooks: {
		// Before request is sent
		onRequest: (request) => {
			console.log("🚀 Sending:", request.method, request.url);

			// Add custom headers to all requests
			request.headers["X-App-Version"] = "1.0.0";
			request.headers["X-Request-Time"] = new Date().toISOString();

			return request;
		},

		// After response is received
		onResponse: (response) => {
			console.log("📥 Received:", response.statusCode, response.duration + "ms");

			// Log rate limit headers
			if (response.headers["x-ratelimit-remaining"]) {
				console.log("⏱️  Rate limit:", response.headers["x-ratelimit-remaining"], "remaining");
			}

			return response;
		},

		// On request error
		onError: (error) => {
			console.error("✗ Request failed:", error.message);
			return error;
		},
	},
};
```

### Per-Request Middleware

```http
{{
  // Pre-request middleware
  exports.addRequestHeaders = function(request) {
    request.headers['X-Custom-Header'] = 'custom-value';
    request.headers['X-Timestamp'] = Date.now().toString();
    return request;
  };

  exports.processResponse = function(response) {
    // Custom response processing
    if (response.statusCode === 429) {
      const retryAfter = response.headers['retry-after'];
      console.warn('⚠️  Rate limited, retry after', retryAfter, 'seconds');
    }
    return response;
  };
}}

###

GET {{baseUrl}}/api/data

{{
  // Apply middleware
  const processedRequest = addRequestHeaders(request);
  const processedResponse = processResponse(response);
}}
```

---

## Performance Monitoring

### Request Timing

```http
{{
  exports.startTime = Date.now();
}}

GET {{baseUrl}}/api/large-dataset

{{
  const endTime = Date.now();
  const duration = endTime - startTime;

  console.log('⏱️  Request duration:', duration, 'ms');
  console.log('📦 Response size:', response.body.length, 'bytes');
  console.log('🚀 Transfer rate:', (response.body.length / duration * 1000 / 1024).toFixed(2), 'KB/s');

  // Store metrics
  exports.lastRequestDuration = duration;
  exports.lastResponseSize = response.body.length;
}}
```

### Performance Assertions

```http
GET {{baseUrl}}/api/data

?? status == 200
?? duration < 2000              # Response in less than 2 seconds
?? js response.body.length < 1048576  # Less than 1MB

{{
  if (response.duration > 1000) {
    console.warn('⚠️  Slow response:', response.duration, 'ms');
  }
}}
```

---

## Batch Operations

### Parallel Requests

```http
# Request 1
# @name getUsers
GET {{baseUrl}}/users

###

# Request 2
# @name getArticles
GET {{baseUrl}}/articles

###

# Request 3
# @name getComments
GET {{baseUrl}}/comments

###

# Aggregate results
# @name aggregateData
GET {{baseUrl}}/noop

{{
  console.log('📊 Aggregated data:');
  console.log('  Users:', getUsers.response.parsedBody.length);
  console.log('  Articles:', getArticles.response.parsedBody.length);
  console.log('  Comments:', getComments.response.parsedBody.length);
}}
```

### Loop Requests (Script-Based)

```http
{{
  const userIds = [1, 2, 3, 4, 5];
  const axios = require('axios');
  const results = [];

  for (const userId of userIds) {
    const response = await axios.get(`${baseUrl}/users/${userId}`, {
      headers: { 'Authorization': `Bearer ${accessToken}` }
    });

    results.push(response.data);
    console.log('✓ Fetched user:', userId);
  }

  exports.allUsers = results;
  console.log('📊 Total users fetched:', results.length);
}}
```

### @loop Directive (Metadata-Based)

The `@loop` directive repeats the same HTTP request multiple times. **Critical**: Variable persistence differs from script-based loops.

#### Basic Usage

```http
# @loop for 3
GET {{baseUrl}}/api/data?page={{$index + 1}}

{{
  console.log(`Page ${$index + 1} fetched`);
}}
```

#### ⚠️ Variable Persistence in @loop

**CRITICAL ISSUE**: `exports` object is **reset on each iteration** in `@loop` context!

```http
# ❌ WRONG: exports is reset each iteration
# @loop for 3
GET {{baseUrl}}/api/articles?page={{$index + 1}}

{{
  exports.articles = exports.articles || [];
  exports.articles.push(...response.parsedBody.data);
  console.log(`Accumulated: ${exports.articles.length}`);
  // Output: 5, 5, 5 (NOT 5, 10, 15) ❌
}}
```

**Solution**: Use `$global` object (httpYac's persistent global object) for persistent state across iterations:

```http
# ✅ CORRECT: $global persists across iterations
# @loop for 3
GET {{baseUrl}}/api/articles?page={{$index + 1}}

{{
  // Initialize once
  if (typeof $global.articles === 'undefined') {
    $global.articles = [];
  }

  // Accumulate data
  $global.articles.push(...response.parsedBody.data);
  console.log(`Accumulated: ${$global.articles.length}`);
  // Output: 5, 10, 15 ✅

  // Save to exports on last iteration
  if ($index === 2) {  // for @loop for 3
    exports.articles = $global.articles;
  }
}}
```

#### Variable Scope Summary

| Variable Type | Persistence in @loop          | Use Case                      |
| ------------- | ----------------------------- | ----------------------------- |
| `exports.*`   | ❌ Reset each iteration       | NOT suitable for accumulation |
| `$global.*`   | ✅ Persists across iterations | Accumulating data across loop |
| `const/let`   | ❌ Local to script block      | Temporary calculations        |
| `$index`      | ✅ Built-in loop counter      | Accessing iteration number    |

#### Pre-Request Scripts in @loop

Use `{{@request}}` for pre-request initialization:

```http
# @loop for 3

{{@request
  // Runs BEFORE each HTTP request
  console.log(`Preparing request ${$index + 1}`);
}}

GET {{baseUrl}}/api/data?page={{$index + 1}}

{{
  // Runs AFTER receiving response
  console.log(`Received response ${$index + 1}`);
}}
```

**Note**: Combining `{{@request}}` with `@loop` may cause compatibility issues in some httpYac versions. Prefer `$global` variables when possible.

#### Best Practices

1. **Use `$global` for accumulation**: Never rely on `exports` to persist data across loop iterations
2. **Initialize on first iteration**: Check `$index === 0` or `typeof $global.var === 'undefined'`
3. **Export on last iteration**: Save `$global.*` to `exports.*` when `$index === (loopCount - 1)`
4. **Avoid hardcoded indices**: If using `$index` checks, document the loop count dependency

```http
# Best practice example
# @loop for 5
GET {{baseUrl}}/api/page/{{$index + 1}}

{{
  // Initialize once using $global
  if (typeof $global.allData === 'undefined') {
    $global.allData = [];
  }

  if (validateResponse(response, `Page ${$index + 1}`)) {
    const pageData = response.parsedBody.items;
    $global.allData.push(...pageData);

    // Real-time progress
    console.log(`Page ${$index + 1}: ${pageData.length} items | Total: ${$global.allData.length}`);

    // Rate limiting
    await sleep(100);
  }

  // Export on last iteration (adjust for loop count)
  if ($index === 4) {  // Note: 4 for @loop for 5
    exports.allData = $global.allData;
    console.log(`✓ Complete: ${exports.allData.length} total items`);
  }
}}
```

---

## Data Transformation

### JSON Manipulation

```http
GET {{baseUrl}}/api/users

{{
  const users = response.parsedBody.data;

  // Transform data
  const transformed = users.map(user => ({
    id: user.id,
    fullName: `${user.first_name} ${user.last_name}`,
    emailDomain: user.email.split('@')[1],
    isActive: user.status === 'active'
  }));

  // Filter data
  const activeUsers = transformed.filter(u => u.isActive);

  // Sort data
  const sorted = activeUsers.sort((a, b) =>
    a.fullName.localeCompare(b.fullName)
  );

  exports.processedUsers = sorted;
  console.log('✓ Processed', sorted.length, 'active users');
}}
```

### XML/HTML Parsing

```http
GET {{baseUrl}}/api/rss-feed
Accept: application/xml

{{
  const cheerio = require('cheerio');
  const $ = cheerio.load(response.body);

  // Parse XML/HTML
  const articles = [];
  $('item').each((i, elem) => {
    articles.push({
      title: $(elem).find('title').text(),
      link: $(elem).find('link').text(),
      pubDate: $(elem).find('pubDate').text()
    });
  });

  exports.rssArticles = articles;
  console.log('✓ Parsed', articles.length, 'articles from RSS feed');
}}
```

### CSV Parsing

```http
GET {{baseUrl}}/api/export/users.csv
Accept: text/csv

{{
  const parse = require('csv-parse/sync');

  // Parse CSV
  const records = parse.parse(response.body, {
    columns: true,
    skip_empty_lines: true
  });

  exports.csvUsers = records;
  console.log('✓ Parsed', records.length, 'records from CSV');
  console.log('📄 Sample:', records[0]);
}}
```

---

## Retry Logic

### Simple Retry

```http
{{
  const axios = require('axios');
  const maxRetries = 3;
  let attempt = 0;
  let success = false;

  while (attempt < maxRetries && !success) {
    attempt++;
    console.log(`🔄 Attempt ${attempt}/${maxRetries}...`);

    try {
      const response = await axios.get(`${baseUrl}/api/unstable`);

      if (response.status === 200) {
        success = true;
        exports.data = response.data;
        console.log('✓ Request successful on attempt', attempt);
      }
    } catch (error) {
      console.warn(`⚠️  Attempt ${attempt} failed:`, error.message);

      if (attempt < maxRetries) {
        // Exponential backoff
        const delay = Math.pow(2, attempt) * 1000;
        console.log(`⏳ Waiting ${delay}ms before retry...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  if (!success) {
    console.error('✗ All retry attempts failed');
  }
}}
```

### Conditional Retry

```http
GET {{baseUrl}}/api/data

{{
  if (response.statusCode === 429) {  // Rate limited
    const retryAfter = parseInt(response.headers['retry-after']) || 60;
    console.warn(`⚠️  Rate limited, retry after ${retryAfter} seconds`);

    // Store retry info
    exports.shouldRetry = true;
    exports.retryAfter = retryAfter;
  } else if (response.statusCode >= 500) {  // Server error
    console.error('✗ Server error, retry recommended');
    exports.shouldRetry = true;
    exports.retryAfter = 5;  // Retry after 5 seconds
  } else {
    exports.shouldRetry = false;
  }
}}
```

---

## Advanced Authentication

### PKCE OAuth2 Flow

```http
{{
  const crypto = require('crypto');

  // Generate code verifier and challenge for PKCE
  function generatePKCE() {
    const verifier = crypto.randomBytes(32).toString('base64url');
    const challenge = crypto
      .createHash('sha256')
      .update(verifier)
      .digest('base64url');

    return { verifier, challenge };
  }

  const pkce = generatePKCE();
  exports.codeVerifier = pkce.verifier;
  exports.codeChallenge = pkce.challenge;

  console.log('✓ PKCE generated');
  console.log('  Verifier:', exports.codeVerifier.substring(0, 10) + '...');
  console.log('  Challenge:', exports.codeChallenge.substring(0, 10) + '...');
}}

###

# Step 1: Authorization request
# Open this URL in browser:
# {{authUrl}}/authorize?client_id={{clientId}}&redirect_uri={{redirectUri}}&response_type=code&code_challenge={{codeChallenge}}&code_challenge_method=S256

###

# Step 2: Exchange code for token (with PKCE)
POST {{authUrl}}/token
Content-Type: application/x-www-form-urlencoded

grant_type=authorization_code
&code={{authCode}}
&client_id={{clientId}}
&redirect_uri={{redirectUri}}
&code_verifier={{codeVerifier}}

{{
  if (response.statusCode === 200) {
    exports.accessToken = response.parsedBody.access_token;
    console.log('✓ Token obtained with PKCE');
  }
}}
```

---

## Other Supported Protocols

httpYac supports additional protocols beyond REST APIs. These are **outside the scope of this skill**, which focuses on REST API testing workflows.

### Supported Protocols (Beyond Scope)

| Protocol | Purpose                    | Use Case                    |
| -------- | -------------------------- | --------------------------- |
| **GRPC** | gRPC with Protocol Buffers | Microservices communication |
| **SSE**  | Server-Sent Events         | Real-time server push       |
| **WS**   | WebSocket                  | Bidirectional streaming     |
| **MQTT** | Message broker             | IoT device communication    |
| **AMQP** | Advanced Message Queue     | RabbitMQ integration        |

### Quick Reference

**REST API (this skill's focus):**

```http
GET {{baseUrl}}/api/users
Authorization: Bearer {{token}}
```

**GraphQL (covered in this skill):**

```graphql
query GetUsers {
	users {
		id
		name
		email
	}
}
```

**Other protocols (consult official docs):**

-   GRPC: `GRPC {{baseUrl}}/service.Method`
-   SSE: `SSE {{baseUrl}}/events`
-   WS: `WS {{baseUrl}}/websocket`
-   MQTT: `MQTT mqtt://broker.example.com`
-   AMQP: `AMQP amqp://localhost:5672`

### When to Use This Skill

**✅ Covered by this skill (95% of users):**

-   REST APIs (GET, POST, PUT, DELETE, PATCH)
-   GraphQL queries and mutations
-   Authentication (Bearer, OAuth2, API Key, Basic Auth)
-   Request chaining and scripting
-   Environment management
-   CI/CD integration

**❌ Beyond this skill's scope:**

-   gRPC service definitions and reflection
-   WebSocket bidirectional messaging
-   MQTT pub/sub patterns
-   AMQP queue management
-   SSE event streaming

### Official Documentation

For protocols beyond REST/GraphQL, consult:

-   **Official Guide**: https://httpyac.github.io/guide/request.html
-   **GRPC Support**: https://httpyac.github.io/guide/request.html#grpc
-   **WebSocket**: https://httpyac.github.io/guide/request.html#websocket
-   **MQTT**: https://httpyac.github.io/guide/request.html#mqtt
-   **AMQP**: https://httpyac.github.io/guide/request.html#amqp

**Note:** REST API testing covers the vast majority of use cases. Only consult protocol-specific documentation if your project specifically requires gRPC, WebSocket, MQTT, or AMQP.

---

## Quick Reference

**Dynamic variables:**

```http
{{
  exports.uuid = $uuid;
  exports.timestamp = $timestamp;
  exports.input = $input "Prompt";
}}
```

**File upload:**

```http
POST {{baseUrl}}/upload
Content-Type: multipart/form-data; boundary=----Boundary

------Boundary
Content-Disposition: form-data; name="file"; filename="file.pdf"
< ./file.pdf
------Boundary--
```

**GraphQL:**

```http
POST {{baseUrl}}/graphql
{ "query": "{ users { id name } }" }
```

**WebSocket:**

```http
WS {{wsUrl}}/socket
{ "action": "subscribe" }
```

**Hooks (httpyac.config.js):**

```javascript
module.exports = {
	hooks: {
		onRequest: (request) => {
			/* modify */ return request;
		},
		onResponse: (response) => {
			/* process */ return response;
		},
	},
};
```
