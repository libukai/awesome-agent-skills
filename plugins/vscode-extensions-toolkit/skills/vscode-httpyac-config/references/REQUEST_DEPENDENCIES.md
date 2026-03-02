# Request Dependencies and Chaining

Complete guide for managing dependencies between HTTP requests using httpYac's native patterns: `@import`, `@forceRef`, and `exports`.

## Overview

httpYac provides three mechanisms for request dependencies:
1. **`@import`** - Include definitions from other .http files
2. **`@forceRef`** - Force execution of a named request before current request
3. **`exports`** - Share variables between requests and templates

**Why NOT use require()?** See COMMON_MISTAKES.md #2 - require() is not supported in most httpYac environments.

---

## Decision Guide: When to Use What

| Scenario | Pattern | Example Use Case |
|----------|---------|------------------|
| Shared resource (all requests need it) | Separate request + @forceRef | Access token, API configuration |
| Request-specific parameter | Inline calculation + exports | Different date ranges, page sizes, filters |
| One-time transformation | File-level function | Date formatting, signature generation |
| Cross-file shared logic | @import + file-level function | Validation functions, formatters |

### Decision Tree

```
Need to share data between requests?
├─ YES → Data is same for ALL requests?
│   ├─ YES → Use separate request + @forceRef
│   │        Example: Access token, API version
│   └─ NO → Data varies per request?
│       └─ YES → Use inline calculation + exports
│                Example: Different date ranges (7 days, 3 days, 30 days)
└─ NO → Data only needed in current request?
    └─ YES → Use exports in pre-request script
             Example: Temporary variables for request body
```

---

## Pattern 1: Shared Resources (@import + @forceRef)

**Use when:** All requests need the SAME resource (e.g., access token).

### Example: Authentication Token

**File: 01-auth.http**
```http
@baseUrl = {{WECHAT_BASE_URL}}
@appId = {{WECHAT_APP_ID}}
@appSecret = {{WECHAT_APP_SECRET}}

# @name auth
# @description Fetch access token | Valid for 7200 seconds
POST {{baseUrl}}/cgi-bin/token?grant_type=client_credentials&appid={{appId}}&secret={{appSecret}}

{{
  if (response.statusCode === 200) {
    const data = response.parsedBody;

    // Export for use in all subsequent requests
    exports.accessToken = data.access_token;
    exports.tokenExpiresIn = data.expires_in;
    exports.tokenExpiresAt = Date.now() + (data.expires_in * 1000);

    console.log('✓ Token obtained:', exports.accessToken.substring(0, 20) + '...');
    console.log('  Expires in:', exports.tokenExpiresIn, 'seconds');
  } else {
    console.error('✗ Failed to get token:', response.parsedBody);
  }
}}
```

**File: 02-user.http**
```http
@baseUrl = {{WECHAT_BASE_URL}}

# @import ./01-auth.http

###

# @name getUserList
# @description Get follower list | Max 10,000 per request
# @forceRef auth
GET {{baseUrl}}/cgi-bin/user/get?access_token={{accessToken}}&next_openid=

{{
  if (response.statusCode === 200) {
    const data = response.parsedBody;
    console.log('✓ Follower list retrieved');
    console.log('  Total followers:', data.total);
    console.log('  Returned in this page:', data.count);
  }
}}
```

**Key Points:**
- `@import ./01-auth.http` - Makes auth request definition available
- `@forceRef auth` - Ensures auth request runs first
- `{{accessToken}}` - Uses token from auth request
- Token is fetched ONCE and reused by all requests

---

## Pattern 2: Request-Specific Parameters (Inline Calculation)

**Use when:** Each request needs DIFFERENT values for the same parameter.

### Example: Date Range Analytics

**File: 12-analytics.http**
```http
@baseUrl = {{WECHAT_BASE_URL}}
@appId = {{WECHAT_APP_ID}}
@appSecret = {{WECHAT_APP_SECRET}}

# @import ./01-auth.http

{{
  // Helper: Get date range for last N days
  // Note: WeChat Analytics API has 1-3 days data delay
  exports.getDateRange = function(days = 7) {
    const end = new Date();
    end.setDate(end.getDate() - 1);  // End date = yesterday (to avoid data delay)

    const start = new Date(end);
    start.setDate(start.getDate() - days + 1);  // Start date = (end - days + 1)

    const formatDate = (d) => {
      return d.toISOString().split('T')[0];  // YYYY-MM-DD
    };

    return {
      begin_date: formatDate(start),
      end_date: formatDate(end)
    };
  };
}}

###

# @name getUserSummary
# @description Daily user analytics | New followers, unfollows, net growth
# @forceRef auth
{{
  // Calculate 7-day range for this request
  exports.dates = getDateRange(7);
}}

POST {{baseUrl}}/datacube/getusersummary?access_token={{accessToken}}
Content-Type: application/json

{
  "begin_date": "{{dates.begin_date}}",
  "end_date": "{{dates.end_date}}"
}

{{
  if (response.statusCode === 200) {
    const data = response.parsedBody;
    if (data.list) {
      console.log('✓ User summary retrieved (7 days)');
      data.list.forEach(item => {
        console.log(`  ${item.ref_date}: +${item.new_user} / -${item.cancel_user}`);
      });
    }
  }
}}

###

# @name getArticleSummary
# @description Article analytics | Views, shares, favorites per day
# @forceRef auth
{{
  // Calculate 3-day range for this request (different from above!)
  exports.dates = getDateRange(3);
}}

POST {{baseUrl}}/datacube/getarticlesummary?access_token={{accessToken}}
Content-Type: application/json

{
  "begin_date": "{{dates.begin_date}}",
  "end_date": "{{dates.end_date}}"
}

{{
  if (response.statusCode === 200) {
    const data = response.parsedBody;
    if (data.list) {
      console.log('✓ Article summary retrieved (3 days)');
      data.list.forEach(item => {
        console.log(`  ${item.ref_date}: ${item.int_page_read_count} views`);
      });
    }
  }
}}
```

**Key Points:**
- `exports.getDateRange` - File-level function, callable in all requests
- `exports.dates = getDateRange(7)` - Calculate 7-day range for request 1
- `exports.dates = getDateRange(3)` - Calculate 3-day range for request 2 (overwrites previous value)
- Each request gets its own date range without affecting others

**Why NOT use separate dateRange requests?**
- Would need `dateRange7`, `dateRange3`, `dateRange30` - inflexible
- Inline calculation is more flexible and clearer
- Shared resources (token) vs. request-specific parameters (dates)

---

## Pattern 3: API Constraints Handling

**Use when:** API has business constraints (data delay, timezone, rate limits).

### Example 1: Analytics APIs with Data Delay

Many analytics APIs have data processing delays:

| API | Data Delay | Solution |
|-----|------------|----------|
| WeChat Analytics | 1-3 days | End date = yesterday |
| Google Analytics | 24-48 hours | End date = 2 days ago |
| Twitter Analytics | 1 day | End date = yesterday |
| Facebook Insights | Real-time but incomplete | End date = yesterday for complete data |

**Implementation:**
```http
{{
  exports.getDateRange = function(days) {
    // ❌ WRONG: Query today's data
    // const end = new Date();  // No data available yet!

    // ✅ CORRECT: Account for API delay
    const end = new Date();
    end.setDate(end.getDate() - 1);  // End at yesterday

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

POST {{baseUrl}}/datacube/getusersummary?access_token={{accessToken}}
Content-Type: application/json

{
  "begin_date": "{{dates.begin_date}}",
  "end_date": "{{dates.end_date}}"
}

{{
  // Handle API-specific error codes
  if (response.parsedBody.errcode === 61501) {
    console.error('✗ Date range error - data not available for this period');
    console.error('  Tip: WeChat Analytics has 1-3 day data delay');
    console.error('  Try querying older dates or reduce the end_date');
  }
}}
```

### Example 2: Timezone Handling

```http
{{
  exports.getDateRangeUTC8 = function(days) {
    // WeChat API uses UTC+8 (Beijing Time)
    const now = new Date();
    const utc8Offset = 8 * 60 * 60 * 1000;  // 8 hours in milliseconds

    // Convert to UTC+8
    const utc8Now = new Date(now.getTime() + utc8Offset);

    const end = new Date(utc8Now);
    end.setDate(end.getDate() - 1);  // Yesterday in UTC+8

    const start = new Date(end);
    start.setDate(start.getDate() - days + 1);

    const formatDate = (d) => {
      const year = d.getUTCFullYear();
      const month = String(d.getUTCMonth() + 1).padStart(2, '0');
      const day = String(d.getUTCDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    return {
      begin_date: formatDate(start),
      end_date: formatDate(end)
    };
  };
}}
```

### Example 3: Rate Limiting

```http
{{
  // Track request timestamps to avoid rate limits
  exports.requestHistory = exports.requestHistory || [];

  exports.checkRateLimit = function(maxRequests, windowSeconds) {
    const now = Date.now();
    const windowStart = now - (windowSeconds * 1000);

    // Remove old requests outside the window
    exports.requestHistory = exports.requestHistory.filter(t => t > windowStart);

    if (exports.requestHistory.length >= maxRequests) {
      const oldestRequest = exports.requestHistory[0];
      const waitMs = oldestRequest + (windowSeconds * 1000) - now;
      console.warn(`⚠️ Rate limit: wait ${Math.ceil(waitMs / 1000)}s`);
      return false;
    }

    exports.requestHistory.push(now);
    return true;
  };
}}

###

{{
  // GitHub API: 60 requests per hour for unauthenticated
  if (!checkRateLimit(60, 3600)) {
    throw new Error('Rate limit exceeded');
  }
}}

GET https://api.github.com/repos/anthropics/claude-code
```

---

## Pattern 4: Cross-File Function Sharing

**Use when:** Multiple .http files need the same utility functions.

**File: common/utils.http**
```http
{{
  // Validation functions
  exports.validateEmail = function(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  exports.validatePhone = function(phone) {
    return /^1[3-9]\d{9}$/.test(phone);  // Chinese mobile
  };

  // Formatters
  exports.formatTimestamp = function(timestamp) {
    return new Date(timestamp * 1000).toISOString();
  };

  // Signature generation
  exports.generateSignature = function(params, secret) {
    const crypto = require('crypto');  // May work in CLI only
    const sorted = Object.keys(params).sort().map(k => `${k}=${params[k]}`).join('&');
    return crypto.createHash('sha256').update(sorted + secret).digest('hex');
  };
}}
```

**File: api/users.http**
```http
# @import ../common/utils.http

{{
  const email = "user@example.com";
  if (!validateEmail(email)) {
    throw new Error('Invalid email');
  }
}}

POST {{baseUrl}}/users
Content-Type: application/json

{
  "email": "user@example.com"
}
```

---

## Common Patterns Comparison

### Pattern A: Sequential Requests (Data Chaining)

```http
# Request 1: Create user
# @name createUser
POST {{baseUrl}}/users
Content-Type: application/json
{ "name": "John" }

{{
  exports.userId = response.parsedBody.id;
}}

###

# Request 2: Update user (uses data from Request 1)
# @name updateUser
PUT {{baseUrl}}/users/{{userId}}
Content-Type: application/json
{ "email": "john@example.com" }

{{
  exports.userEmail = response.parsedBody.email;
}}

###

# Request 3: Get user (uses data from Request 1)
GET {{baseUrl}}/users/{{userId}}
```

### Pattern B: Parallel Requests (Independent)

```http
# These can run in parallel (no dependencies)

# @name getUsers
GET {{baseUrl}}/users

###

# @name getProducts
GET {{baseUrl}}/products

###

# @name getOrders
GET {{baseUrl}}/orders
```

### Pattern C: Conditional Execution

```http
# @name checkStatus
GET {{baseUrl}}/status

{{
  if (response.parsedBody.status === 'ready') {
    exports.canProceed = true;
  } else {
    exports.canProceed = false;
    console.warn('⚠️ System not ready');
  }
}}

###

{{
  if (!canProceed) {
    throw new Error('Cannot proceed - system not ready');
  }
}}

POST {{baseUrl}}/process
```

---

## Best Practices

### 1. Name Requests Meaningfully
```http
# ✅ GOOD
# @name auth
# @name getUserList
# @name createDraft

# ❌ BAD
# @name req1
# @name test
# @name api
```

### 2. Use Descriptive Variable Names
```http
{{
  // ✅ GOOD
  exports.accessToken = response.parsedBody.access_token;
  exports.userEmailList = response.parsedBody.data.map(u => u.email);

  // ❌ BAD
  exports.token = response.parsedBody.access_token;  // Which token?
  exports.data = response.parsedBody.data;  // What data?
}}
```

### 3. Add Validation and Error Handling
```http
{{
  if (response.statusCode === 200) {
    exports.accessToken = response.parsedBody.access_token;
    console.log('✓ Token obtained');
  } else {
    console.error('✗ Failed:', response.parsedBody);
    throw new Error('Authentication failed');
  }
}}
```

### 4. Document Complex Dependencies
```http
# @name getUserAnalytics
# @description Requires: @forceRef auth (for token), @forceRef dateRange (for dates)
# @forceRef auth
# @forceRef dateRange
GET {{baseUrl}}/analytics?access_token={{accessToken}}&start={{startDate}}&end={{endDate}}
```

### 5. Keep File-Level Functions Pure
```http
{{
  // ✅ GOOD: Pure function (no side effects)
  exports.formatDate = function(date) {
    return date.toISOString().split('T')[0];
  };

  // ❌ BAD: Side effects (modifies global state)
  exports.formatDate = function(date) {
    exports.lastFormatted = date;  // Side effect!
    return date.toISOString().split('T')[0];
  };
}}
```

---

## Troubleshooting

### Issue 1: Variable Undefined in Template

**Error:** `{{accessToken}}` is undefined

**Causes:**
1. Forgot to use `exports`: `const token = ...` instead of `exports.token = ...`
2. Request with the variable didn't run first (missing `@forceRef`)
3. Variable defined in post-response but used in same request template

**Fix:**
```http
# @name auth
POST {{baseUrl}}/token

{{
  exports.accessToken = response.parsedBody.access_token;  // Use exports
}}

###

# @forceRef auth  // Ensure auth runs first
GET {{baseUrl}}/data?token={{accessToken}}
```

### Issue 2: @forceRef Not Working

**Error:** Request runs but referenced request didn't execute

**Causes:**
1. Request name mismatch: `@name auth` but `@forceRef authenticate`
2. Missing `@import` when request is in different file
3. Circular dependency

**Fix:**
```http
# @import ./01-auth.http  // Add import if cross-file

# @name getUserData
# @forceRef auth  // Ensure name matches @name
GET {{baseUrl}}/users
```

### Issue 3: Request Runs Multiple Times

**Cause:** Multiple requests use `@forceRef` to the same request

**Expected Behavior:** httpYac caches results, request only runs once per session

**To Force Re-run:** Clear httpYac cache or restart

---

## Summary

| Need | Pattern | Key Tools |
|------|---------|-----------|
| Share token across files | Separate auth request | `@import`, `@forceRef`, `exports` |
| Different parameters per request | Inline calculation | File-level function + `exports` |
| Handle API constraints | Custom date/time logic | `exports` functions with validation |
| Reuse utility functions | Cross-file import | `@import` + file-level functions |
| Sequential data flow | Request chaining | `@name`, `exports` for data passing |

**Remember:**
- Use `@import` for cross-file definitions
- Use `@forceRef` to ensure execution order
- Use `exports` to share data between requests and templates
- Avoid `require()` - it's not supported in most httpYac environments
