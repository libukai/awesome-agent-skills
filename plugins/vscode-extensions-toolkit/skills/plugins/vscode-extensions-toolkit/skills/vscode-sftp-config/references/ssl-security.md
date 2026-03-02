# SSL/TLS Security Configuration

## Let's Encrypt Certificate (Free, Recommended)

### Installation

```bash
# Ubuntu/Debian
sudo apt update
sudo apt install certbot python3-certbot-nginx

# CentOS/RHEL
sudo yum install certbot python3-certbot-nginx

# Verify installation
certbot --version
```

### Obtain Certificate

#### For Single Domain
```bash
sudo certbot --nginx -d example.com
```

#### For Domain with www
```bash
sudo certbot --nginx -d example.com -d www.example.com
```

#### For Wildcard Certificate (requires DNS validation)
```bash
sudo certbot certonly --manual --preferred-challenges dns -d *.example.com -d example.com
```

**Follow prompts**:
1. Enter email for renewal notifications
2. Agree to Terms of Service
3. Choose whether to share email with EFF
4. For wildcard: Add TXT record to DNS as instructed

### Auto-Renewal

Certbot installs a cron job/systemd timer automatically. Verify:

```bash
# Check renewal status
sudo certbot renew --dry-run

# View systemd timer (Ubuntu 20.04+)
sudo systemctl list-timers | grep certbot

# Manual renewal (if needed)
sudo certbot renew
```

Certificates expire after 90 days. Auto-renewal runs twice daily.

## SSL Configuration File (Shared Parameters)

Create `/etc/nginx/conf.d/ssl_params.conf`:

```nginx
# Modern SSL/TLS configuration (2024)
ssl_protocols TLSv1.2 TLSv1.3;
ssl_ciphers 'ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:DHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA384';
ssl_prefer_server_ciphers off;

# SSL session caching (improves performance)
ssl_session_cache shared:SSL:10m;
ssl_session_timeout 10m;
ssl_session_tickets off;

# OCSP stapling (improves SSL handshake speed)
ssl_stapling on;
ssl_stapling_verify on;
resolver 8.8.8.8 8.8.4.4 valid=300s;
resolver_timeout 5s;

# Diffie-Hellman parameter (generate with: openssl dhparam -out /etc/nginx/dhparam.pem 2048)
ssl_dhparam /etc/nginx/dhparam.pem;
```

**Include in site config**:
```nginx
server {
    listen 443 ssl http2;
    server_name example.com;

    ssl_certificate /etc/letsencrypt/live/example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/example.com/privkey.pem;

    include /etc/nginx/conf.d/ssl_params.conf;  # Include shared SSL config

    # ... rest of config
}
```

## Generate Diffie-Hellman Parameters

```bash
sudo openssl dhparam -out /etc/nginx/dhparam.pem 2048
```

**Note**: This takes 5-10 minutes. Use 4096 bits for higher security (takes longer).

## Certificate Locations (Let's Encrypt)

```
/etc/letsencrypt/live/example.com/
├── fullchain.pem   → Use for ssl_certificate
├── privkey.pem     → Use for ssl_certificate_key
├── chain.pem       → Intermediate certificates only
└── cert.pem        → Your certificate only
```

**Always use `fullchain.pem`** (includes intermediate certificates).

## HTTP to HTTPS Redirect

### Redirect All HTTP to HTTPS
```nginx
server {
    listen 80;
    listen [::]:80;
    server_name example.com www.example.com;
    return 301 https://$host$request_uri;
}
```

### Redirect HTTP to HTTPS (non-www)
```nginx
server {
    listen 80;
    listen [::]:80;
    server_name example.com www.example.com;
    return 301 https://example.com$request_uri;
}
```

## www to non-www Redirect (HTTPS)

```nginx
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name www.example.com;

    ssl_certificate /etc/letsencrypt/live/example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/example.com/privkey.pem;
    include /etc/nginx/conf.d/ssl_params.conf;

    return 301 https://example.com$request_uri;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name example.com;

    ssl_certificate /etc/letsencrypt/live/example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/example.com/privkey.pem;
    include /etc/nginx/conf.d/ssl_params.conf;

    # Main site configuration
    root /var/www/example;
    # ...
}
```

## HSTS (HTTP Strict Transport Security)

```nginx
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;
```

**Parameters**:
- `max-age=31536000`: 1 year in seconds
- `includeSubDomains`: Apply to all subdomains
- `preload`: Submit to HSTS preload list (https://hstspreload.org/)

**Warning**: Before using `preload`:
1. Ensure all subdomains support HTTPS
2. Test thoroughly (preload is permanent)
3. Submit to https://hstspreload.org/ after deployment

## Certificate Verification

```bash
# Check certificate expiry
sudo certbot certificates

# Check certificate details
openssl x509 -in /etc/letsencrypt/live/example.com/fullchain.pem -text -noout

# Test SSL configuration (online)
# Visit: https://www.ssllabs.com/ssltest/

# Check OCSP stapling
echo | openssl s_client -connect example.com:443 -status 2>&1 | grep -A 17 'OCSP response:'
```

## Wildcard Certificate Setup

### Step 1: Request Certificate
```bash
sudo certbot certonly --manual --preferred-challenges dns -d *.example.com -d example.com
```

### Step 2: Add DNS TXT Record
Certbot will provide instructions like:
```
Please deploy a DNS TXT record under the name:
_acme-challenge.example.com

with the following value:
abc123def456ghi789jkl012mno345pqr678stu901vwx234yz
```

Add this TXT record to your DNS provider.

### Step 3: Verify DNS Propagation
```bash
# Check TXT record
dig _acme-challenge.example.com TXT +short

# Or use online tool: https://mxtoolbox.com/TXTLookup.aspx
```

### Step 4: Continue with Certbot
Press Enter in Certbot prompt after DNS record is live.

### Step 5: Use in Nginx Config
```nginx
ssl_certificate /etc/letsencrypt/live/example.com/fullchain.pem;
ssl_certificate_key /etc/letsencrypt/live/example.com/privkey.pem;
```

Works for `*.example.com` (any subdomain).

## Renewal Hooks (Run Commands After Renewal)

### Deploy Hook (Run after successful renewal)
```bash
# /etc/letsencrypt/renewal-hooks/deploy/01-reload-nginx.sh
#!/bin/bash
systemctl reload nginx
```

Make executable:
```bash
sudo chmod +x /etc/letsencrypt/renewal-hooks/deploy/01-reload-nginx.sh
```

### Pre/Post Hooks
```bash
# Pre-hook (before renewal)
/etc/letsencrypt/renewal-hooks/pre/

# Post-hook (after renewal attempt)
/etc/letsencrypt/renewal-hooks/post/
```

## Custom Certificate (Not Let's Encrypt)

If using custom certificate (purchased SSL):

```nginx
server {
    listen 443 ssl http2;
    server_name example.com;

    ssl_certificate /etc/nginx/ssl/example.com.crt;        # Your certificate + intermediate
    ssl_certificate_key /etc/nginx/ssl/example.com.key;    # Private key
    ssl_trusted_certificate /etc/nginx/ssl/ca-bundle.crt;  # For OCSP stapling

    include /etc/nginx/conf.d/ssl_params.conf;
}
```

**Certificate format**: PEM (Base64 encoded)

## Security Best Practices

1. **Use modern protocols**: TLSv1.2 minimum, prefer TLSv1.3
2. **Strong ciphers**: Prioritize ECDHE and AEAD ciphers
3. **Enable HSTS**: Force HTTPS for returning visitors
4. **OCSP stapling**: Improve SSL handshake performance
5. **Session tickets off**: Better privacy (forward secrecy)
6. **DH parameters**: Generate custom 2048-bit or 4096-bit
7. **Regular updates**: Keep Nginx and OpenSSL updated
8. **Monitor expiry**: Set up alerts 30 days before expiry

## Testing SSL Configuration

### Online Tools
- **SSL Labs**: https://www.ssllabs.com/ssltest/ (Detailed analysis, A+ rating)
- **SSL Checker**: https://www.sslshopper.com/ssl-checker.html
- **Security Headers**: https://securityheaders.com/

### Command Line
```bash
# Test SSL handshake
openssl s_client -connect example.com:443 -servername example.com

# Test specific protocol
openssl s_client -connect example.com:443 -tls1_2
openssl s_client -connect example.com:443 -tls1_3

# Check cipher suites
nmap --script ssl-enum-ciphers -p 443 example.com
```

## Common SSL Issues

### Issue: ERR_CERT_COMMON_NAME_INVALID
**Cause**: Certificate doesn't match domain name
**Fix**: Ensure certificate includes all necessary domains (example.com and www.example.com)

### Issue: Certificate chain incomplete
**Cause**: Using `cert.pem` instead of `fullchain.pem`
**Fix**: Use `fullchain.pem` in `ssl_certificate` directive

### Issue: OCSP stapling not working
**Cause**: Missing `ssl_trusted_certificate` or DNS resolver
**Fix**: Add `resolver 8.8.8.8 8.8.4.4;` and verify `fullchain.pem` is used

### Issue: Auto-renewal fails
**Cause**: Nginx blocking `.well-known/acme-challenge/`
**Fix**: Add to Nginx config:
```nginx
location ^~ /.well-known/acme-challenge/ {
    allow all;
    root /var/www/html;
    default_type "text/plain";
}
```

## Certificate Backup

```bash
# Backup entire Let's Encrypt directory
sudo tar -czf letsencrypt-backup-$(date +%Y%m%d).tar.gz /etc/letsencrypt

# Restore from backup
sudo tar -xzf letsencrypt-backup-YYYYMMDD.tar.gz -C /
```

## Multi-Domain Certificate (SAN)

Let's Encrypt supports up to 100 domains in one certificate:

```bash
sudo certbot --nginx \
  -d example.com \
  -d www.example.com \
  -d blog.example.com \
  -d shop.example.com
```

All domains will share the same certificate (Subject Alternative Names).
