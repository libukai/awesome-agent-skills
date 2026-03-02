---
name: vscode-sftp-config
description: Configure VSCode SFTP for deploying static websites (HTML, Vue/React builds, Slidev, Hugo/Jekyll) to production servers. Provides SFTP configuration templates and optimized Nginx settings with security headers, caching strategies, and performance optimizations.
---

# VSCode SFTP Configuration

## Overview

Configure VSCode SFTP for deploying static websites to production servers. Provides complete workflow including production-ready Nginx configuration templates with security headers, caching strategies, and performance optimizations.

## When to Use This Skill

Invoke this skill when:
- Converting a project from backend-driven (Express.js/Docker) to pure static hosting
- Setting up SFTP deployment for Vue/React/Angular build outputs
- Deploying Slidev presentations or static site generators (Hugo/Jekyll/Gatsby)
- Configuring Nginx for static file serving with optimal performance
- Setting up subdomain hosting for multiple static sites

## Core Workflow

### Step 1: Analyze Project Structure

Identify the static files to deploy:
- **Pure static projects**: HTML, CSS, JS in root directory
- **Build-based projects**: Look for `dist/`, `build/`, or `public/` output directories
- **Static generators**: Check for build commands in `package.json` or documentation

Ask the user for deployment details:
1. Remote server address (IP or hostname)
2. Remote path (e.g., `/var/www/sitename`)
3. SSH authentication method (password or SSH key path)
4. Domain name(s) for Nginx configuration
5. Whether this is a main domain or subdomain

### Step 2: Generate SFTP Configuration

**VSCode Extension**: This skill uses the [code-sftp](https://marketplace.visualstudio.com/items?itemName=satiromarra.code-sftp) extension by Satiro Marra.

#### Step 2A: Configure SSH Config (Recommended Best Practice)

Before creating `sftp.json`, set up SSH host alias in `~/.ssh/config` for better management:

```ssh-config
Host project-prod
    HostName 82.157.29.215
    User root
    Port 22
    IdentityFile ~/.ssh/id_rsa
    IdentitiesOnly yes
    ServerAliveInterval 60
    ServerAliveCountMax 3
```

**Benefits of SSH config**:
- ✅ Eliminates SFTP extension warnings (`Section for 'IP' not found`)
- ✅ Use host alias in terminal: `ssh project-prod`
- ✅ Centralized SSH settings (connection keep-alive, compression, etc.)
- ✅ Easier to manage multiple environments (dev, staging, prod)

Check if `~/.ssh/config` already has the server:
```bash
cat ~/.ssh/config | grep -A 5 "82.157.29.215"
```

If found, use that existing host alias. If not, add a new entry.

#### Step 2B: Create SFTP Configuration

Create `.vscode/sftp.json` using the template from `assets/sftp.json.template`.

**Essential configuration fields**:
- `name`: Profile name for easy identification
- `host`: **SSH host alias** (e.g., `"Tencent_Pro"`) or IP address
- `protocol`: "sftp" for SFTP (secure) or "ftp" for FTP
- `port`: 22 for SFTP, 21 for FTP
- `username`: SSH/FTP username
- `privateKeyPath`: Path to SSH private key (e.g., `/Users/username/.ssh/id_rsa`)
- `remotePath`: Remote directory path (e.g., `/var/www/sitename`)
- `uploadOnSave`: `false` recommended (manual sync is safer)

**Optional advanced fields**:
- `ignore`: Array of files/folders to exclude from upload
- `watcher`: File watching configuration for auto-upload
- `syncOption`: Sync behavior (delete, update, skip existing files)
- `useTempFile`: Use temporary files during upload
- `downloadOnOpen`: Auto-download files when opened

Customize for the project:
- Replace `{{HOST_ALIAS}}` with SSH config alias (recommended) or IP address
- Replace other `{{PLACEHOLDERS}}` with actual values
- Add project-specific files to `ignore` array (`.claude`, `nginx.conf`, build artifacts, etc.)
- For build-based projects: Keep `uploadOnSave: false`, sync manually after build
- For pure static projects: Optionally enable `uploadOnSave: true` for instant deployment

### Step 3: Generate Nginx Configuration

Choose the appropriate template:
- **Main domain**: Use `assets/nginx-static.conf.template` for primary website
- **Subdomain**: Use `assets/nginx-subdomain.conf.template` for subdomains like `slides.example.com`

Customize the configuration:
1. Replace `{{DOMAIN}}` with actual domain name
2. Replace `{{DOCUMENT_ROOT}}` with remote path (e.g., `/var/www/aiseed`)
3. Adjust SSL certificate paths if using custom certificates
4. Configure subdomain-specific settings if needed

Include essential features from `references/nginx-best-practices.md`:
- HTTP → HTTPS redirect
- HTTP/2 support
- Gzip compression
- Static resource caching (1 year for JS/CSS/images, 1 hour for HTML)
- Security headers (HSTS, X-Frame-Options, CSP, etc.)
- Access and error logs

### Step 4: Provide Deployment Instructions

Generate a deployment checklist based on `assets/deploy-checklist.md`:

1. **Initial setup** (one-time):
   - Install VSCode extension: [code-sftp by Satiro Marra](https://marketplace.visualstudio.com/items?itemName=satiromarra.code-sftp)
   - Open Command Palette (Cmd/Ctrl+Shift+P) → `SFTP: Config` to create `.vscode/sftp.json`
   - Verify SSH access to server: `ssh user@host`
   - Ensure remote directory exists: `ssh user@host "mkdir -p /var/www/sitename"`
   - Set proper permissions: `ssh user@host "chmod 755 /var/www/sitename"`

2. **File deployment**:
   - For build projects: Run build command first (e.g., `npm run build`)
   - Open VSCode Command Palette → `SFTP: Sync Local → Remote` to upload all files
   - Or right-click folder in Explorer → "Upload Folder"
   - Monitor upload progress in VSCode Output panel (View → Output → SFTP)
   - Verify files uploaded: `ssh user@host "ls -la /var/www/sitename"`

3. **Nginx configuration**:
   - Upload generated config to `/etc/nginx/sites-available/`
   - Create symlink: `ln -s /etc/nginx/sites-available/site.conf /etc/nginx/sites-enabled/`
   - Test config: `sudo nginx -t`
   - Reload: `sudo systemctl reload nginx`

4. **SSL/TLS setup** (if not configured):
   - Refer to `references/ssl-security.md` for certificate setup
   - Use Let's Encrypt for free certificates: `certbot --nginx -d example.com`

5. **Verification**:
   - Test HTTPS: `curl -I https://example.com`
   - Check security headers: Use securityheaders.com
   - Test performance: Use PageSpeed Insights

### Step 5: Document the Setup

Update project documentation (README.md or CLAUDE.md) with:
- Deployment method (SFTP to `/var/www/path`)
- SFTP configuration location (`.vscode/sftp.json`)
- Nginx configuration reference
- Build commands (if applicable)
- Deployment workflow for future updates

## Benefits of This Architecture

Explain to users why static + SFTP deployment is advantageous:

1. **Simplicity**: Edit → Upload → Live (no build pipelines, no containers)
2. **Performance**: Nginx serves static files faster than Node.js/Python backends
3. **Reliability**: No backend processes to crash or hang
4. **Resource efficiency**: Lower server memory and CPU usage
5. **Cost effective**: Can host on minimal VPS or shared hosting
6. **Easy rollback**: Copy previous version from backup directory

## When NOT to Use This Architecture

Static + SFTP deployment is not appropriate when:
- Backend API endpoints are required
- Server-side form processing is needed (unless using external services like n8n, FormSpree)
- User authentication/sessions are required
- Database interactions are needed
- Server-side rendering (SSR) is required

## Resources

### references/
- `ssh-config.md` - SSH config file setup and best practices (host aliases, jump hosts, security)
- `nginx-best-practices.md` - Comprehensive Nginx optimization guide for static sites
- `ssl-security.md` - SSL/TLS certificate setup and security configuration

### assets/
- `sftp.json.template` - VSCode SFTP configuration template (array format, uses SSH host alias)
- `nginx-static.conf.template` - Main domain Nginx configuration template
- `nginx-subdomain.conf.template` - Subdomain Nginx configuration template
- `deploy-checklist.md` - Step-by-step deployment verification checklist
