# Documentation for httpYac Collections

Guide to creating clear, maintainable documentation for httpYac API collections.

## README.md Template

### Basic Template

```markdown
# API Collection Name - httpYac

Brief description of the API collection and its purpose.

## Quick Start

1. **Install httpYac Extension**
   - **VS Code**: Install "httpYac" extension from marketplace
   - **CLI**: `npm install -g httpyac`

2. **Configure Environment**
   ```bash
   cp .env.example .env
   # Edit .env with your credentials
   ```

3. **Run Requests**
   - **VS Code**: Open `.http` file → Click "Send Request" above any request
   - **CLI**: `httpyac send api-collection.http`

## File Structure

```
.
├── api-collection.http      # Main API requests
├── auth.http                # Authentication endpoints
├── users.http               # User management endpoints
├── .env                     # Local environment (gitignored)
├── .env.example             # Environment template
├── .httpyac.json            # Configuration
└── README.md                # This file
```

## Environment Variables

| Variable | Description | Example | Required |
|----------|-------------|---------|----------|
| `API_BASE_URL` | API base endpoint | `http://localhost:3000` | Yes |
| `API_TOKEN` | Authentication token | `your-token-here` | Yes |
| `API_USER` | API username/email | `user@example.com` | Yes |
| `DEBUG` | Enable debug logging | `true` / `false` | No |

## Available Endpoints

### Authentication
- `login` - Obtain access token
- `refresh` - Refresh expired token
- `logout` - Invalidate token

### Users
- `getUsers` - List all users
- `getUser` - Get user by ID
- `createUser` - Create new user
- `updateUser` - Update user details
- `deleteUser` - Delete user

### Articles
- `getArticles` - List articles
- `getArticle` - Get article by ID
- `createArticle` - Create new article

## Request Chaining

Requests automatically pass data between each other:

1. Run `login` → Stores access token
2. Run `getUsers` → Uses stored token automatically
3. Run `createUser` → Returns user ID
4. Run `getUser` → Uses created user ID

## Testing

### Run All Requests
```bash
httpyac send api-collection.http --all
```

### Run Specific Request
```bash
httpyac send api-collection.http --name getUsers
```

### Run with Different Environment
```bash
httpyac send api-collection.http --env production
```

## CI/CD Integration

### GitHub Actions

```yaml
name: API Tests
on: [push]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Run API Tests
        run: |
          npm install -g httpyac
          httpyac send tests/*.http --all
        env:
          API_BASE_URL: ${{ secrets.API_BASE_URL }}
          API_TOKEN: ${{ secrets.API_TOKEN }}
```

### GitLab CI

```yaml
test:
  script:
    - npm install -g httpyac
    - httpyac send tests/*.http --all
  variables:
    API_BASE_URL: ${API_BASE_URL}
    API_TOKEN: ${API_TOKEN}
```

## Troubleshooting

### Variables Not Loaded
- Ensure `.env` file exists in project root
- Check variable names match exactly (case-sensitive)
- Reload VS Code window

### Authentication Failed
- Run `login` request first
- Check credentials in `.env` file
- Verify token hasn't expired

### Request Timeout
- Increase timeout in `.httpyac.json`:
  ```json
  {
    "request": {
      "timeout": 60000
    }
  }
  ```

## Additional Resources

- [httpYac Documentation](https://httpyac.github.io/)
- [API Documentation](https://api.example.com/docs)
- Internal Wiki: [Link to wiki]

## Support

For issues or questions:
- Create an issue in this repository
- Contact: api-team@example.com
- Slack: #api-support
```

---

## In-File Documentation

### Header Section

```http
# ============================================================
# Article Endpoints - Example API
# ============================================================
# V1-Basic | V2-Metadata | V3-Full Content⭐
# Documentation: https://api.example.com/docs
# ============================================================

@baseUrl = {{API_BASE_URL}}
@token = {{API_TOKEN}}

{{
  // Utility functions
  exports.validateResponse = function(response, actionName) {
    if (response.statusCode >= 200 && response.statusCode < 300) {
      console.log(`✓ ${actionName} successful`);
      return true;
    }
    console.error(`✗ ${actionName} failed:`, response.statusCode);
    return false;
  };
}}
```

### Request Documentation

```http
### Get Article by ID

# @name getArticle
# @description Retrieve article with full content | Requires authentication | Returns Base64-encoded HTML
GET {{baseUrl}}/articles/{{articleId}}
Authorization: Bearer {{token}}
Accept: application/json

{{
  if (validateResponse(response, 'Get Article')) {
    const article = response.parsedBody;
    console.log('📄 Title:', article.title);
    console.log('👤 Author:', article.author);
    console.log('📅 Published:', article.published_at);
  }
}}
```

### Section Separators

```http
# ============================================================
# Authentication Endpoints
# ============================================================

### Login

# @name login
POST {{baseUrl}}/auth/login
...

###

### Refresh Token

# @name refresh
POST {{baseUrl}}/auth/refresh
...

# ============================================================
# User Management
# ============================================================

### Get Users

# @name getUsers
GET {{baseUrl}}/users
...
```

---

## CHANGELOG.md

Track API collection changes:

```markdown
# Changelog

All notable changes to this API collection will be documented in this file.

## [Unreleased]

### Added
- New endpoint: `getArticleComments`
- Support for pagination parameters

### Changed
- Updated authentication to OAuth2
- Improved error handling in utility functions

### Fixed
- Token refresh logic bug
- Request timeout issues

## [1.1.0] - 2024-01-15

### Added
- Article management endpoints
- Batch operations support
- CI/CD integration examples

### Changed
- Migrated from Basic Auth to Bearer tokens
- Updated base URL structure

### Deprecated
- V1 endpoints (use V2 instead)

## [1.0.0] - 2023-12-01

### Added
- Initial release
- Authentication flow
- User management endpoints
- Basic CRUD operations

[Unreleased]: https://github.com/user/repo/compare/v1.1.0...HEAD
[1.1.0]: https://github.com/user/repo/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/user/repo/releases/tag/v1.0.0
```

---

## API_REFERENCE.md

Detailed endpoint documentation:

```markdown
# API Reference

## Authentication

### Login

**Endpoint:** `POST /auth/login`

**Description:** Authenticate user and obtain access token.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "access_token": "eyJhbGc...",
  "refresh_token": "eyJhbGc...",
  "expires_in": 3600,
  "token_type": "Bearer"
}
```

**Status Codes:**
- `200` - Success
- `401` - Invalid credentials
- `429` - Too many requests

**httpYac Request:**
```http
# @name login
POST {{baseUrl}}/auth/login
Content-Type: application/json

{
  "email": "{{email}}",
  "password": "{{password}}"
}
```

---

### Refresh Token

**Endpoint:** `POST /auth/refresh`

**Description:** Refresh expired access token using refresh token.

**Request:**
```json
{
  "refresh_token": "eyJhbGc..."
}
```

**Response:**
```json
{
  "access_token": "eyJhbGc...",
  "refresh_token": "eyJhbGc...",
  "expires_in": 3600
}
```

**httpYac Request:**
```http
# @name refresh
POST {{baseUrl}}/auth/refresh
Content-Type: application/json

{
  "refresh_token": "{{refreshToken}}"
}
```

---

## Users

### List Users

**Endpoint:** `GET /users`

**Description:** Retrieve paginated list of users.

**Query Parameters:**
- `page` (integer) - Page number (default: 1)
- `limit` (integer) - Items per page (default: 10, max: 100)
- `sort` (string) - Sort field (default: created_at)
- `order` (string) - Sort order: `asc` or `desc` (default: desc)

**Response:**
```json
{
  "data": [
    {
      "id": 123,
      "name": "John Doe",
      "email": "john@example.com",
      "created_at": "2024-01-01T00:00:00Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 45
  }
}
```

**httpYac Request:**
```http
# @name getUsers
GET {{baseUrl}}/users?page=1&limit=10
Authorization: Bearer {{accessToken}}
```
```

---

## CONTRIBUTING.md

Guide for team contributions:

```markdown
# Contributing to API Collection

## Setup

1. Clone repository
2. Copy `.env.example` to `.env`
3. Install VS Code httpYac extension
4. Configure your credentials in `.env`

## Before Adding Endpoints

- [ ] Check if endpoint already exists
- [ ] Review API documentation
- [ ] Understand authentication requirements
- [ ] Plan request/response structure

## Adding New Endpoints

1. **Choose appropriate file**
   - Authentication → `auth.http`
   - User management → `users.http`
   - New module → Create new file

2. **Follow naming conventions**
   ```http
   # @name actionResource
   # Examples:
   # @name getUsers
   # @name createArticle
   # @name deleteComment
   ```

3. **Add documentation**
   ```http
   ### Descriptive Title
   
   # @name requestName
   # @description Brief description | Key details | Special notes
   ```

4. **Include assertions**
   ```http
   ?? status == 200
   ?? js response.parsedBody.data exists
   ```

5. **Add error handling**
   ```http
   {{
     if (validateResponse(response, 'Action Name')) {
       // Success logic
     } else {
       // Error handling
     }
   }}
   ```

## Code Style

### Variables
```http
# ✅ Use descriptive names
@baseUrl = {{API_BASE_URL}}
@userId = {{USER_ID}}

# ❌ Avoid abbreviations
@url = {{BASE}}
@id = {{ID}}
```

### Scripts
```http
{{
  // ✅ Export functions for reuse
  exports.functionName = function() { };
  
  // ✅ Add comments for complex logic
  // Calculate expiry time accounting for server offset
  exports.expiresAt = Date.now() + (response.parsedBody.expires_in * 1000);
  
  // ✅ Use descriptive variable names
  const articleId = response.parsedBody.id;
  
  // ❌ Avoid single-letter variables
  const a = response.parsedBody.id;
}}
```

### Logging
```http
{{
  // ✅ Use emoji for visual distinction
  console.log('✓ Success');
  console.warn('⚠️  Warning');
  console.error('✗ Error');
  
  // ✅ Include context
  console.log('📄 Retrieved', articles.length, 'articles');
  
  // ❌ Avoid generic messages
  console.log('Done');
}}
```

## Testing Your Changes

### Before Committing

1. **Run all requests in file**
   ```bash
   httpyac send your-file.http --all
   ```

2. **Test in different environments**
   ```bash
   httpyac send your-file.http --env dev
   httpyac send your-file.http --env test
   ```

3. **Verify assertions pass**
   - Check console output for test results
   - Ensure no errors logged

4. **Check security**
   - No hardcoded credentials
   - Secrets in .env file
   - .env not committed

### Pull Request Checklist

- [ ] All requests execute successfully
- [ ] Assertions added and passing
- [ ] Documentation updated (README, comments)
- [ ] No hardcoded credentials
- [ ] Code follows style guide
- [ ] Environment variables documented
- [ ] Tested in dev and test environments

## Common Issues

### "Variable not defined"
- Define variable at file top: `@variable = {{ENV_VAR}}`
- Or in script: `exports.variable = value`

### "Function not defined"
- Export function: `exports.functionName = function() {}`
- Call without exports: `functionName()`

### "Token expired"
- Implement token refresh logic
- See `auth.http` for examples

## Getting Help

- Check documentation: `README.md`, `API_REFERENCE.md`
- Review existing requests for examples
- Ask in #api-support Slack channel
- Tag @api-team in pull requests
```

---

## Comments Best Practices

### Section Headers

```http
# ============================================================
# Section Name
# ============================================================
# Key Point 1 | Key Point 2 | Key Point 3
# Documentation: https://...
# ============================================================
```

### Request Comments

```http
### Request Title

# @name requestName
# @description Purpose | Important details | Special notes
# @deprecated Use V2 endpoint instead
# @since v1.2.0
```

### Inline Comments

```http
{{
  // Explain complex logic
  // This calculates the HMAC signature for request verification
  const crypto = require('crypto');
  const signature = crypto
    .createHmac('sha256', secretKey)
    .update(payload)
    .digest('hex');
  
  exports.signature = signature;
}}
```

### Warning Comments

```http
# ⚠️  WARNING: This endpoint costs credits
# ⚠️  Rate limit: 100 requests/hour
# ⚠️  Requires admin role
# ⚠️  Experimental feature, may change
```

---

## Documentation Checklist

### Project Documentation

- [ ] README.md with quick start guide
- [ ] Environment variables documented
- [ ] Setup instructions clear (≤5 steps)
- [ ] File structure explained
- [ ] Troubleshooting section included
- [ ] Contact information provided

### In-File Documentation

- [ ] File headers with purpose and links
- [ ] Request names (`@name`) defined
- [ ] Descriptions (`@description`) added
- [ ] Important notes highlighted
- [ ] Section separators used
- [ ] Complex logic commented

### API Reference

- [ ] All endpoints documented
- [ ] Request/response examples provided
- [ ] Status codes listed
- [ ] Authentication requirements clear
- [ ] Rate limits documented
- [ ] Error handling explained

### Team Resources

- [ ] CONTRIBUTING.md created
- [ ] Code style guide defined
- [ ] PR template provided
- [ ] Issue templates available
- [ ] CHANGELOG.md maintained

---

## Documentation Templates

### New Endpoint Template

```http
### [Endpoint Name]

# @name [requestName]
# @description [Brief description] | [Key details] | [Special notes]
# @since v[version]

[METHOD] {{baseUrl}}/[path]
Authorization: Bearer {{accessToken}}
Content-Type: application/json

[Request body if applicable]

{{
  // Validation and logging
  if (validateResponse(response, '[Action Name]')) {
    // Extract important data
    exports.[variable] = response.parsedBody.[field];
    
    // Log key information
    console.log('[Emoji] [Description]:', [value]);
  }
}}

# Test assertions
?? status == [expected_status]
?? js response.parsedBody.[field] exists
?? js response.parsedBody.[field] [operator] [value]
```

### New File Template

```http
# ============================================================
# [Module Name] - [API Name]
# ============================================================
# [Feature 1] | [Feature 2] | [Feature 3]
# Documentation: [URL]
# ============================================================

@baseUrl = {{API_BASE_URL}}
@token = {{API_TOKEN}}

{{
  // Utility functions
  exports.validateResponse = function(response, actionName) {
    // Implementation
  };
  
  console.log('✓ [Module Name] utilities loaded');
}}

# ============================================================
# [Section 1]
# ============================================================

### [First Endpoint]

# @name [requestName]
...

###

### [Second Endpoint]

# @name [requestName]
...

# ============================================================
# [Section 2]
# ============================================================

...
```

---

## Quick Reference

**Project documentation:**
- README.md - Quick start, setup, troubleshooting
- API_REFERENCE.md - Detailed endpoint documentation
- CONTRIBUTING.md - Development guidelines
- CHANGELOG.md - Version history

**In-file documentation:**
- File headers - Purpose and overview
- Section separators - Group related requests
- `@name` - Request identifier for chaining
- `@description` - Hover-visible details
- Inline comments - Explain complex logic

**Documentation quality:**
- Clear and concise
- Examples provided
- Up-to-date with code
- Easily scannable
- Searchable (good structure)
