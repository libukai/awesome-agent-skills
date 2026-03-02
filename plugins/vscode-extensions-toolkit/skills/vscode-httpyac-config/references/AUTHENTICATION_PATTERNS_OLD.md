# Authentication Patterns for httpYac

Complete authentication implementations for common patterns in httpYac .http files.

## Pattern 1: Bearer Token (Simple)

**Use when:** API provides a static token or pre-generated token.

```http
# Define token in variables
{{
  exports.accessToken = $processEnv.API_TOKEN;
}}

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

## Pattern 2: Auto-Fetch Token (Recommended)

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
- Token fetched automatically on first request
- Response data stored in `exports` for request chaining
- Error handling for failed authentication
- Token expiry tracked for refresh logic

---

## Pattern 3: Token Refresh with Expiry Check

**Use when:** API provides refresh tokens and tokens expire frequently.

```http
# Variables
@baseUrl = {{API_BASE_URL}}
@clientId = {{CLIENT_ID}}
@clientSecret = {{CLIENT_SECRET}}

{{
  // Utility function for token refresh
  exports.ensureValidToken = async function() {
    // Check if token exists and is not expired
    if (!accessToken || Date.now() >= expiresAt) {
      console.log('⟳ Token expired, refreshing...');

      const axios = require('axios');
      try {
        const response = await axios.post(
          `${baseUrl}/oauth/token`,
          {
            grant_type: 'refresh_token',
            refresh_token: refreshToken,
            client_id: clientId,
            client_secret: clientSecret
          }
        );

        exports.accessToken = response.data.access_token;
        exports.refreshToken = response.data.refresh_token;
        exports.expiresAt = Date.now() + (response.data.expires_in * 1000);
        console.log('✓ Token refreshed successfully');
      } catch (error) {
        console.error('✗ Token refresh failed:', error.message);
        throw error;
      }
    }
  };
}}

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

# Protected request with auto-refresh
GET {{baseUrl}}/api/protected-data

{{
  // Pre-request: Ensure token is valid
  await ensureValidToken();
}}

Authorization: Bearer {{accessToken}}

{{
  // Post-response
  console.log(`✓ Retrieved protected data:`, response.parsedBody);
}}
```

**Key points:**
- Automatic token refresh before expiry
- Utility function exported for reuse
- Both access and refresh tokens managed
- Expiry timestamp tracked
- Error handling for refresh failures

---

## Pattern 4: Basic Auth

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

**Alternative format (base64 encoded):**
```http
{{
  // Encode credentials to base64
  const credentials = `${username}:${password}`;
  const base64Credentials = Buffer.from(credentials).toString('base64');
  exports.authHeader = `Basic ${base64Credentials}`;
}}

###

GET {{baseUrl}}/api/data
Authorization: {{authHeader}}
```

**Key points:**
- Simple username:password format
- Base64 encoding handled automatically by httpYac
- Manual base64 encoding available if needed
- No token management required

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

**Multiple API keys:**
```http
@baseUrl = {{API_BASE_URL}}
@publicKey = {{PUBLIC_KEY}}
@privateKey = {{PRIVATE_KEY}}

###

GET {{baseUrl}}/api/data
X-Public-Key: {{publicKey}}
X-Private-Key: {{privateKey}}
```

**Key points:**
- Simple header-based authentication
- No expiry or refresh logic needed
- Can use multiple keys simultaneously

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

**Key points:**
- Key embedded in URL
- Less secure than header-based (visible in logs)
- Common in public APIs

---

## Pattern 7: JWT Token with Custom Claims

**Use when:** API requires JWT with specific claims or signatures.

```http
{{
  const jwt = require('jsonwebtoken');
  const secret = $processEnv.JWT_SECRET;

  // Generate JWT with custom claims
  const payload = {
    user_id: '12345',
    email: 'user@example.com',
    role: 'admin',
    exp: Math.floor(Date.now() / 1000) + (60 * 60) // 1 hour expiry
  };

  exports.jwtToken = jwt.sign(payload, secret, { algorithm: 'HS256' });
  console.log('✓ JWT generated');
}}

###

GET {{baseUrl}}/api/admin/users
Authorization: Bearer {{jwtToken}}
```

**Key points:**
- Requires `jsonwebtoken` package
- Custom claims and expiry
- Signature verification on server side
- Useful for testing JWT-based APIs

---

## Pattern 8: OAuth2 Authorization Code Flow

**Use when:** API uses OAuth2 authorization code grant (user consent required).

```http
# Step 1: Get authorization URL (manual step)
# Visit: https://auth.example.com/oauth/authorize?client_id={{clientId}}&redirect_uri={{redirectUri}}&response_type=code&scope=read write

# Step 2: Exchange code for token
# @name getToken
POST {{baseUrl}}/oauth/token
Content-Type: application/x-www-form-urlencoded

grant_type=authorization_code
&code={{authCode}}
&client_id={{clientId}}
&client_secret={{clientSecret}}
&redirect_uri={{redirectUri}}

{{
  if (response.statusCode === 200) {
    exports.accessToken = response.parsedBody.access_token;
    exports.refreshToken = response.parsedBody.refresh_token;
    console.log('✓ Token obtained from authorization code');
  }
}}

###

# Step 3: Use access token
GET {{baseUrl}}/api/user
Authorization: Bearer {{accessToken}}
```

**Key points:**
- Requires manual authorization step
- Authorization code from callback URL
- Exchange code for access token
- Suitable for user-delegated access

---

## Pattern 9: Digest Authentication

**Use when:** API uses HTTP Digest Authentication.

```http
@baseUrl = {{API_BASE_URL}}
@username = {{USERNAME}}
@password = {{PASSWORD}}

###

GET {{baseUrl}}/api/data
Authorization: Digest {{username}}:{{password}}

{{
  // httpYac handles digest challenge/response automatically
  if (response.statusCode === 200) {
    console.log('✓ Digest auth successful');
  }
}}
```

**Key points:**
- More secure than Basic Auth
- httpYac handles challenge/response
- No manual nonce/hash calculation needed

---

## Pattern 10: AWS Signature V4

**Use when:** Accessing AWS APIs or services requiring SigV4.

```http
{{
  const aws4 = require('aws4');

  const options = {
    host: 's3.amazonaws.com',
    path: '/my-bucket/my-file.txt',
    service: 's3',
    region: 'us-east-1'
  };

  const credentials = {
    accessKeyId: $processEnv.AWS_ACCESS_KEY_ID,
    secretAccessKey: $processEnv.AWS_SECRET_ACCESS_KEY
  };

  const signed = aws4.sign(options, credentials);
  exports.awsHeaders = signed.headers;
}}

###

GET https://s3.amazonaws.com/my-bucket/my-file.txt
Authorization: {{awsHeaders.Authorization}}
X-Amz-Date: {{awsHeaders['X-Amz-Date']}}
X-Amz-Content-SHA256: {{awsHeaders['X-Amz-Content-SHA256']}}
```

**Key points:**
- Requires `aws4` package
- Automatic signature calculation
- Headers generated dynamically
- Suitable for AWS service testing

---

## Pattern Selection Guide

| API Type | Pattern | Complexity | Use Case |
|----------|---------|------------|----------|
| Static token | Pattern 1 | Low | Development, testing |
| OAuth2 client credentials | Pattern 2 | Medium | Machine-to-machine |
| OAuth2 with refresh | Pattern 3 | High | Long-running sessions |
| Username/password | Pattern 4 | Low | Legacy APIs |
| API key (header) | Pattern 5 | Low | Public APIs, webhooks |
| API key (query) | Pattern 6 | Low | Public APIs (less secure) |
| JWT | Pattern 7 | Medium | Modern web APIs |
| OAuth2 user consent | Pattern 8 | High | User-delegated access |
| Digest | Pattern 9 | Medium | Secure legacy APIs |
| AWS SigV4 | Pattern 10 | High | AWS services |

---

## Common Authentication Issues

### Issue 1: Token Not Persisting

**Symptom:** Token works in one request but not in next.

**Cause:** Using local variable instead of `exports`.

**Fix:**
```http
# ❌ Wrong
{{
  const token = response.parsedBody.access_token; // Lost after request
}}

# ✅ Correct
{{
  exports.accessToken = response.parsedBody.access_token; // Persists
}}
```

### Issue 2: Token Expired

**Symptom:** 401 Unauthorized on subsequent requests.

**Solution:** Implement Pattern 3 with expiry checking.

### Issue 3: CORS Issues in Browser

**Note:** httpYac runs in Node.js context, no CORS issues. If testing browser-based auth flows, use Pattern 8 (OAuth2 with redirect).

### Issue 4: Credentials Not Loading from .env

**Symptom:** Variables undefined.

**Fix:**
- Ensure `.env` file in project root
- Verify variable names match exactly (case-sensitive)
- Check `.env` syntax (no quotes needed for values)

```env
# ✅ Correct
API_TOKEN=abc123

# ❌ Wrong
API_TOKEN="abc123"  # Quotes included in value
```

---

## Security Best Practices

1. **Never hardcode credentials** in .http files
2. **Use environment variables** via `$processEnv` or .env files
3. **Add .env to .gitignore** to prevent secret leaks
4. **Use .env.example** with placeholder values for team members
5. **Rotate tokens regularly** in production environments
6. **Limit token scopes** to minimum required permissions
7. **Use refresh tokens** for long-running sessions (Pattern 3)
8. **Log carefully** - don't log full tokens (use `.substring(0, 20)`)

---

## Testing Authentication Flows

```http
# Test sequence: Login → Use Token → Verify

# 1. Login
# @name login
POST {{baseUrl}}/auth/login
Content-Type: application/json

{
  "username": "{{username}}",
  "password": "{{password}}"
}

{{
  exports.accessToken = response.parsedBody.access_token;
  
  // Assertion
  test("Login successful", () => {
    expect(response.statusCode).to.equal(200);
    expect(exports.accessToken).to.exist;
  });
}}

###

# 2. Use token
GET {{baseUrl}}/api/protected
Authorization: Bearer {{accessToken}}

{{
  test("Protected resource accessible", () => {
    expect(response.statusCode).to.equal(200);
  });
}}

###

# 3. Verify token expiry handling
GET {{baseUrl}}/api/protected
Authorization: Bearer invalid_token

{{
  test("Invalid token rejected", () => {
    expect(response.statusCode).to.equal(401);
  });
}}
```

---

## Quick Reference: Variable Usage

```http
# Environment variables (from .env)
@baseUrl = {{API_BASE_URL}}
@token = {{API_TOKEN}}

# Dynamic variables (in scripts)
{{
  exports.timestamp = Date.now();
  exports.nonce = require('uuid').v4();
}}

# Use in requests
GET {{baseUrl}}/api/data
Authorization: Bearer {{token}}
X-Timestamp: {{timestamp}}
X-Nonce: {{nonce}}
```

**Rules:**
- `@variable = {{ENV_VAR}}` for environment variables
- `exports.variable = value` for dynamic/response data
- `{{variable}}` to use in requests
- Never use `process.env` directly in request headers
