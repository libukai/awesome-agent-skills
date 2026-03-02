# Security Configuration for httpYac

Complete security guide for protecting credentials, preventing secret leaks, and securing API testing workflows.

## Git Security

### Essential .gitignore Configuration

**Immediately add to `.gitignore`:**

```gitignore
# httpYac: Protect environment files with secrets
.env
.env.local
.env.*.local
.env.production
.env.staging
.env.test

# httpYac: Ignore cache and output files
.httpyac.log
.httpyac.cache
*.httpyac.cache
httpyac-output/
httpyac-report/

# httpYac: Ignore temporary test data
test-data-sensitive/
api-responses/

# Node.js (if using npm packages)
node_modules/
package-lock.json
```

### .env.example Template (Safe for Git)

**File: `.env.example`**
```env
# API Configuration
API_BASE_URL=http://localhost:3000
API_USER=your-email@example.com
API_TOKEN=your-token-here

# Authentication
CLIENT_ID=your-client-id
CLIENT_SECRET=your-client-secret

# Optional Settings
DEBUG=false
LOG_LEVEL=info
TIMEOUT=30000

# Feature Flags
ENABLE_EXPERIMENTAL=false
```

**Include setup instructions:**
```markdown
## Setup

1. Copy environment template:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` with your actual credentials
3. Never commit `.env` to git

## Required Variables

- `API_BASE_URL` - API endpoint URL
- `API_TOKEN` - Your API authentication token
- `API_USER` - Your API username/email
```

---

## Protecting Secrets

### Rule 1: Never Hardcode Credentials

**❌ NEVER DO THIS:**
```http
# DON'T HARDCODE SECRETS
GET https://api.example.com/data
Authorization: Bearer sk-abc123def456ghi789  # EXPOSED!

POST https://api.example.com/login
Content-Type: application/json

{
  "username": "admin@company.com",  # EXPOSED!
  "password": "SuperSecret123!"     # EXPOSED!
}
```

**✅ ALWAYS USE ENVIRONMENT VARIABLES:**
```http
# Load from environment
@baseUrl = {{API_BASE_URL}}
@token = {{API_TOKEN}}
@user = {{API_USER}}
@password = {{API_PASSWORD}}

GET {{baseUrl}}/data
Authorization: Bearer {{token}}

###

POST {{baseUrl}}/login
Content-Type: application/json

{
  "username": "{{user}}",
  "password": "{{password}}"
}
```

### Rule 2: Use $processEnv for Sensitive Data

```http
{{
  // Load from environment (not stored in file)
  exports.apiKey = $processEnv.API_KEY;
  exports.clientSecret = $processEnv.CLIENT_SECRET;
  exports.privateKey = $processEnv.PRIVATE_KEY;
  
  // Verify secrets are loaded
  if (!exports.apiKey) {
    console.error('✗ API_KEY not found in environment');
    throw new Error('Missing API_KEY');
  }
}}

###

GET {{baseUrl}}/api/data
X-API-Key: {{apiKey}}
```

### Rule 3: Minimal Logging of Secrets

```http
POST {{baseUrl}}/auth/login
Content-Type: application/json

{
  "client_id": "{{clientId}}",
  "client_secret": "{{clientSecret}}"
}

{{
  if (response.statusCode === 200) {
    exports.accessToken = response.parsedBody.access_token;
    
    // ✅ Safe logging (truncated)
    console.log('✓ Token obtained:', exports.accessToken.substring(0, 10) + '...');
    
    // ❌ NEVER log full token
    // console.log('Token:', exports.accessToken);  // DON'T DO THIS!
  }
}}
```

---

## Environment-Specific Security

### Development Environment

**File: `.env`**
```env
# Development - Less strict security
API_BASE_URL=http://localhost:3000
API_TOKEN=dev_token_12345
REJECT_UNAUTHORIZED=false  # Allow self-signed certs
DEBUG=true
LOG_LEVEL=debug
```

**Configuration: `.httpyac.json`**
```json
{
  "environments": {
    "dev": {
      "logLevel": "debug"
    }
  },
  "request": {
    "rejectUnauthorized": false
  }
}
}
```

### Production Environment

**File: `.env.production` (NEVER commit)**
```env
# Production - Maximum security
API_BASE_URL=https://api.production.com
API_TOKEN=prod_secure_token_abc123xyz789
REJECT_UNAUTHORIZED=true  # Strict SSL verification
DEBUG=false
LOG_LEVEL=error
```

**Configuration: `httpyac.config.js`**
```javascript
module.exports = {
  environments: {
    production: {
      logLevel: 'error'
    }
  },
  request: {
    rejectUnauthorized: true,  // Always verify SSL in production
    timeout: 60000
  },
  log: {
    level: 'error',
    // Don't log request/response bodies in production
    options: {
      requestOutput: false,
      responseOutput: false
    }
  }
};
```

---

## SSL/TLS Configuration

### Trust Custom Certificates

**For development with self-signed certificates:**

```javascript
// httpyac.config.js
const fs = require('fs');
const path = require('path');

module.exports = {
  request: {
    // Development: Allow self-signed certs
    rejectUnauthorized: process.env.NODE_ENV !== 'production',
    
    // Custom CA certificate
    ca: fs.readFileSync(path.join(__dirname, 'certs', 'ca.crt')),
    
    // Client certificate authentication
    cert: fs.readFileSync(path.join(__dirname, 'certs', 'client.crt')),
    key: fs.readFileSync(path.join(__dirname, 'certs', 'client.key'))
  }
};
```

**⚠️ Security Warning:**
- **NEVER** disable SSL verification in production
- **NEVER** commit certificate files to git
- **ALWAYS** use proper SSL certificates in production

### Environment-Based SSL Configuration

```http
{{
  const isProd = $processEnv.NODE_ENV === 'production';
  
  if (!isProd) {
    console.warn('⚠️  SSL verification disabled (development only)');
  } else {
    console.log('✓ SSL verification enabled (production)');
  }
}}
```

---

## Credential Management Strategies

### Strategy 1: Environment Variables (Recommended)

**Best for:** Most use cases, team collaboration, CI/CD

```env
# .env
API_TOKEN=your_token_here
```

```http
@token = {{API_TOKEN}}

GET {{baseUrl}}/api/data
Authorization: Bearer {{token}}
```

**Pros:**
- Standard approach
- Easy to manage
- Works with CI/CD
- .gitignore protection

**Cons:**
- Visible in process environment
- Needs setup for each team member

### Strategy 2: Secret Management Services

**Best for:** Enterprise, production environments, regulated industries

**Using AWS Secrets Manager:**
```http
{{
  const AWS = require('aws-sdk');
  const secretsManager = new AWS.SecretsManager();
  
  async function getSecret(secretName) {
    const data = await secretsManager.getSecretValue({ 
      SecretId: secretName 
    }).promise();
    
    return JSON.parse(data.SecretString);
  }
  
  const secrets = await getSecret('api-credentials');
  exports.apiToken = secrets.API_TOKEN;
  exports.clientSecret = secrets.CLIENT_SECRET;
}}
```

**Using HashiCorp Vault:**
```http
{{
  const axios = require('axios');
  
  async function getVaultSecret(path) {
    const vaultToken = $processEnv.VAULT_TOKEN;
    const vaultAddr = $processEnv.VAULT_ADDR;
    
    const response = await axios.get(`${vaultAddr}/v1/secret/data/${path}`, {
      headers: { 'X-Vault-Token': vaultToken }
    });
    
    return response.data.data.data;
  }
  
  const secrets = await getVaultSecret('api-credentials');
  exports.apiToken = secrets.token;
}}
```

### Strategy 3: Encrypted Configuration Files

**Best for:** Local development, single-user environments

**Using git-crypt:**
```bash
# Install git-crypt
brew install git-crypt  # macOS
apt install git-crypt   # Linux

# Initialize in repository
git-crypt init

# Create .gitattributes
echo ".env filter=git-crypt diff=git-crypt" >> .gitattributes
echo "secrets/** filter=git-crypt diff=git-crypt" >> .gitattributes

# Encrypt files
git-crypt lock
```

---

## Token Rotation Best Practices

### Automatic Token Refresh

```http
{{
  // Check token expiry and refresh if needed
  exports.ensureValidToken = async function() {
    const now = Date.now();
    const expiryBuffer = 5 * 60 * 1000; // 5 minutes
    
    // Check if token will expire soon
    if (!accessToken || !expiresAt || (now + expiryBuffer) >= expiresAt) {
      console.log('⟳ Token expired or expiring soon, refreshing...');
      
      const axios = require('axios');
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
      exports.expiresAt = now + (response.data.expires_in * 1000);
      
      console.log('✓ Token refreshed, expires in', response.data.expires_in, 'seconds');
    } else {
      const timeLeft = Math.floor((expiresAt - now) / 1000);
      console.log('✓ Token valid for', timeLeft, 'more seconds');
    }
  };
}}

###

# Protected request with auto-refresh
{{
  await ensureValidToken();
}}

GET {{baseUrl}}/api/protected
Authorization: Bearer {{accessToken}}
```

### Token Expiry Notifications

```http
{{
  // Check token expiry and warn if expiring soon
  if (expiresAt) {
    const now = Date.now();
    const timeLeft = Math.floor((expiresAt - now) / 1000);
    const hoursLeft = Math.floor(timeLeft / 3600);
    
    if (timeLeft < 0) {
      console.error('✗ Token expired', Math.abs(timeLeft), 'seconds ago');
    } else if (timeLeft < 300) {  // Less than 5 minutes
      console.warn('⚠️  Token expires in', timeLeft, 'seconds!');
    } else if (hoursLeft < 1) {  // Less than 1 hour
      console.log('⏰ Token expires in', Math.floor(timeLeft / 60), 'minutes');
    } else {
      console.log('✓ Token valid for', hoursLeft, 'hours');
    }
  }
}}
```

---

## Security Checklist

### Before Committing

- [ ] No hardcoded credentials in .http files
- [ ] All secrets in .env files
- [ ] .env added to .gitignore
- [ ] .env.example created without real secrets
- [ ] No API tokens in commit history
- [ ] No passwords in script comments
- [ ] Certificate files not committed

### Development Setup

- [ ] .env file created locally
- [ ] Environment variables loaded correctly
- [ ] SSL verification appropriate for environment
- [ ] Debug logging reviewed (no secret leaks)
- [ ] Test data anonymized

### Production Deployment

- [ ] .env.production created with secure credentials
- [ ] SSL certificate verification enabled
- [ ] Token refresh implemented
- [ ] Minimal logging (error level only)
- [ ] Secrets stored in secure vault
- [ ] Access logs reviewed
- [ ] Regular security audits scheduled

### Team Collaboration

- [ ] Setup instructions documented
- [ ] .env.example provided
- [ ] Secret rotation process defined
- [ ] Access control policies established
- [ ] Security training completed

---

## Common Security Issues

### Issue 1: Secrets Committed to Git

**Detection:**
```bash
# Search git history for potential secrets
git log -p | grep -i "password\|token\|secret\|api_key"

# Use tools like truffleHog or git-secrets
truffleHog --regex --entropy=False .
```

**Removal:**
```bash
# Remove file from git history
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch .env" \
  --prune-empty --tag-name-filter cat -- --all

# Alternative: Use BFG Repo-Cleaner (faster)
bfg --delete-files .env
git reflog expire --expire=now --all
git gc --prune=now --aggressive

# Force push to remote
git push origin --force --all
```

**After removal:**
1. Rotate all exposed credentials immediately
2. Add to .gitignore
3. Audit access logs for unauthorized usage

### Issue 2: Environment Variables Exposed in Logs

**Problem:**
```http
{{
  console.log('Config:', {
    baseUrl,
    apiToken,    // ❌ Token exposed in logs!
    clientSecret // ❌ Secret exposed in logs!
  });
}}
```

**Solution:**
```http
{{
  // Redact sensitive values in logs
  function redactSensitive(obj) {
    const redacted = { ...obj };
    const sensitiveKeys = ['token', 'secret', 'password', 'key'];
    
    for (const key of Object.keys(redacted)) {
      if (sensitiveKeys.some(s => key.toLowerCase().includes(s))) {
        const value = redacted[key];
        if (value && typeof value === 'string') {
          redacted[key] = value.substring(0, 4) + '***';
        }
      }
    }
    return redacted;
  }
  
  console.log('Config:', redactSensitive({
    baseUrl,
    apiToken,
    clientSecret
  }));
  // Output: Config: { baseUrl: '...', apiToken: 'sk-a***', clientSecret: 'cs_1***' }
}}
```

### Issue 3: Insecure File Permissions

**Check permissions:**
```bash
# .env should be readable only by owner
chmod 600 .env

# Verify
ls -la .env
# Should show: -rw------- (600)
```

**Set secure permissions:**
```bash
# .env files
chmod 600 .env*

# httpYac config files
chmod 644 .httpyac.json
chmod 644 httpyac.config.js

# .http files
chmod 644 *.http
```

---

## Security Scanning Tools

### git-secrets (Prevent Secret Commits)

```bash
# Install
brew install git-secrets  # macOS
apt install git-secrets   # Linux

# Setup for repository
git secrets --install
git secrets --register-aws

# Add custom patterns
git secrets --add 'API_TOKEN=[A-Za-z0-9]+'
git secrets --add 'password\s*=\s*.+'

# Scan repository
git secrets --scan
git secrets --scan-history
```

### truffleHog (Detect Secrets in History)

```bash
# Install
pip install truffleHog

# Scan repository
truffleHog --regex --entropy=True .

# Scan specific branch
truffleHog --regex https://github.com/user/repo.git
```

### detect-secrets (Pre-commit Hook)

```bash
# Install
pip install detect-secrets

# Create baseline
detect-secrets scan > .secrets.baseline

# Pre-commit hook (.pre-commit-config.yaml)
repos:
  - repo: https://github.com/Yelp/detect-secrets
    rev: v1.4.0
    hooks:
      - id: detect-secrets
        args: ['--baseline', '.secrets.baseline']
```

---

## Secure Credential Storage on Different Platforms

### macOS Keychain

```http
{{
  const { exec } = require('child_process');
  const util = require('util');
  const execPromise = util.promisify(exec);
  
  async function getKeychainSecret(service, account) {
    try {
      const { stdout } = await execPromise(
        `security find-generic-password -s "${service}" -a "${account}" -w`
      );
      return stdout.trim();
    } catch (error) {
      console.error('Failed to retrieve from keychain:', error.message);
      return null;
    }
  }
  
  exports.apiToken = await getKeychainSecret('api-service', 'token');
}}
```

### Linux Secret Service

```http
{{
  const keytar = require('keytar');
  
  async function getSecret(service, account) {
    try {
      return await keytar.getPassword(service, account);
    } catch (error) {
      console.error('Failed to retrieve secret:', error.message);
      return null;
    }
  }
  
  exports.apiToken = await getSecret('api-service', 'token');
}}
```

### Windows Credential Manager

```http
{{
  const credentialManager = require('node-credential-manager');
  
  function getWindowsCredential(target) {
    try {
      return credentialManager.getCredential(target);
    } catch (error) {
      console.error('Failed to retrieve credential:', error.message);
      return null;
    }
  }
  
  const cred = getWindowsCredential('api-service-token');
  exports.apiToken = cred ? cred.password : null;
}}
```

---

## Quick Security Reference

**Always:**
- ✅ Use environment variables for secrets
- ✅ Add .env to .gitignore
- ✅ Provide .env.example template
- ✅ Verify SSL certificates in production
- ✅ Rotate tokens regularly
- ✅ Use minimal logging in production
- ✅ Implement token refresh logic

**Never:**
- ❌ Hardcode credentials in .http files
- ❌ Commit .env files to git
- ❌ Log full tokens or secrets
- ❌ Disable SSL verification in production
- ❌ Share .env files via email/Slack
- ❌ Use production credentials in development
- ❌ Store secrets in .httpyac.json

**Emergency Response (Leaked Secret):**
1. Rotate credential immediately
2. Audit access logs
3. Remove from git history
4. Update .gitignore
5. Notify security team
6. Review access policies
