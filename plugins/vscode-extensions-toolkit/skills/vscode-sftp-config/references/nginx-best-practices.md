# Nginx Best Practices for Static Sites

## Caching Strategy

### Static Assets (Long-term Cache)
```nginx
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot|webp|avif)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
    access_log off;
}
```

**Rationale**: Static assets with content hashes can be cached indefinitely. The `immutable` directive tells browsers not to revalidate.

### HTML Files (Short Cache)
```nginx
location ~* \.html$ {
    expires 1h;
    add_header Cache-Control "public, must-revalidate";
}
```

**Rationale**: HTML should have short cache to allow quick content updates while still benefiting from caching.

### Dynamic Content (No Cache)
```nginx
location ~* \.(json|xml)$ {
    expires -1;
    add_header Cache-Control "no-store, no-cache, must-revalidate, proxy-revalidate";
}
```

## Gzip Compression

```nginx
gzip on;
gzip_vary on;
gzip_comp_level 6;
gzip_min_length 1024;
gzip_proxied any;
gzip_types
    text/plain
    text/css
    text/xml
    text/javascript
    application/javascript
    application/x-javascript
    application/json
    application/xml
    application/rss+xml
    application/atom+xml
    font/truetype
    font/opentype
    image/svg+xml;
```

**Compression levels**:
- Level 1-3: Fast compression, lower ratio
- Level 4-6: Balanced (recommended)
- Level 7-9: Maximum compression, slower

**Tip**: `gzip_vary on` ensures proper caching with proxies.

## Brotli Compression (Optional, Better than Gzip)

```nginx
brotli on;
brotli_comp_level 6;
brotli_types
    text/plain
    text/css
    text/xml
    text/javascript
    application/javascript
    application/json
    application/xml
    image/svg+xml;
```

**Note**: Requires `ngx_brotli` module. Brotli provides 15-25% better compression than gzip.

## Security Headers

### Essential Headers
```nginx
# Prevent clickjacking
add_header X-Frame-Options "SAMEORIGIN" always;

# Prevent MIME type sniffing
add_header X-Content-Type-Options "nosniff" always;

# Enable XSS protection (legacy browsers)
add_header X-XSS-Protection "1; mode=block" always;

# Control referrer information
add_header Referrer-Policy "no-referrer-when-downgrade" always;

# Force HTTPS for 1 year
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;
```

### Content Security Policy (Strict)
```nginx
add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' cdn.example.com; style-src 'self' 'unsafe-inline' cdn.example.com; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self'; frame-ancestors 'self';" always;
```

**Adjust based on requirements**:
- Remove `'unsafe-inline'` and `'unsafe-eval'` for stricter security
- Add CDN domains to `script-src` and `style-src`
- Use `report-uri` directive for CSP violation reporting

### Permissions Policy (formerly Feature Policy)
```nginx
add_header Permissions-Policy "geolocation=(), microphone=(), camera=()" always;
```

## HTTP/2 Optimization

```nginx
listen 443 ssl http2;
listen [::]:443 ssl http2;

# HTTP/2 push (optional, use sparingly)
http2_push_preload on;
```

**HTTP/2 Push Example**:
```nginx
location = /index.html {
    http2_push /style.css;
    http2_push /script.js;
}
```

**Caution**: HTTP/2 push can hurt performance if overused. Modern browsers with preload links are often better.

## SSL/TLS Configuration

### Modern Configuration (2024)
```nginx
ssl_protocols TLSv1.2 TLSv1.3;
ssl_ciphers 'ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:DHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA384';
ssl_prefer_server_ciphers off;

# SSL session caching
ssl_session_cache shared:SSL:10m;
ssl_session_timeout 10m;
ssl_session_tickets off;

# OCSP stapling
ssl_stapling on;
ssl_stapling_verify on;
resolver 8.8.8.8 8.8.4.4 valid=300s;
resolver_timeout 5s;
```

**Security notes**:
- TLSv1.2 minimum (TLSv1.0/1.1 deprecated)
- Prefer TLSv1.3 when possible (faster, more secure)
- Disable SSL session tickets (privacy concern)

## Performance Tuning

### Worker Configuration
```nginx
# /etc/nginx/nginx.conf
worker_processes auto;
worker_connections 1024;
multi_accept on;
use epoll;
```

### Buffers and Timeouts
```nginx
client_body_buffer_size 128k;
client_max_body_size 10m;
client_header_buffer_size 1k;
large_client_header_buffers 4 4k;

keepalive_timeout 65;
keepalive_requests 100;

send_timeout 30;
sendfile on;
tcp_nopush on;
tcp_nodelay on;
```

## Logging

### Custom Log Format (with request time)
```nginx
log_format main_ext '$remote_addr - $remote_user [$time_local] "$request" '
                    '$status $body_bytes_sent "$http_referer" '
                    '"$http_user_agent" "$http_x_forwarded_for" '
                    'rt=$request_time uct="$upstream_connect_time" '
                    'uht="$upstream_header_time" urt="$upstream_response_time"';

access_log /var/log/nginx/access.log main_ext;
```

### Conditional Logging (skip static assets)
```nginx
map $request_uri $loggable {
    ~*\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ 0;
    default 1;
}

access_log /var/log/nginx/access.log combined if=$loggable;
```

## Security: Deny Access to Sensitive Files

```nginx
# Deny access to hidden files (except Let's Encrypt)
location ~ /\.(?!well-known) {
    deny all;
    access_log off;
    log_not_found off;
}

# Deny access to backup files
location ~* \.(bak|backup|old|orig|save|swp|~)$ {
    deny all;
}

# Deny access to version control
location ~ /\.(git|svn|hg|bzr) {
    deny all;
}
```

## SPA (Single Page Application) Support

```nginx
location / {
    try_files $uri $uri/ /index.html;
}
```

**Explanation**: Fallback to `index.html` for client-side routing (Vue Router, React Router, etc.)

## Rate Limiting (Optional)

```nginx
# Define rate limit zone in http block
limit_req_zone $binary_remote_addr zone=general:10m rate=10r/s;

# Apply in server/location block
location / {
    limit_req zone=general burst=20 nodelay;
    try_files $uri $uri/ /index.html;
}
```

**Parameters**:
- `rate=10r/s`: 10 requests per second
- `burst=20`: Allow burst of 20 requests
- `nodelay`: Process burst requests immediately

## Testing Configuration

```bash
# Test syntax
sudo nginx -t

# Reload configuration
sudo systemctl reload nginx

# Check if Nginx is running
sudo systemctl status nginx

# View error log
sudo tail -f /var/log/nginx/error.log
```

## Performance Testing

```bash
# Test Gzip compression
curl -H "Accept-Encoding: gzip" -I https://example.com

# Test HTTP/2
curl -I --http2 https://example.com

# Check response headers
curl -I https://example.com

# Benchmark (simple)
ab -n 1000 -c 10 https://example.com/
```

## Monitoring

```bash
# Active connections
sudo nginx -V 2>&1 | grep -o with-http_stub_status_module

# Add to Nginx config
location /nginx_status {
    stub_status on;
    access_log off;
    allow 127.0.0.1;
    deny all;
}

# Check status
curl http://localhost/nginx_status
```

## Common Pitfalls

1. **Using `if` for URL rewriting**: Avoid `if` blocks in location context. Use `try_files` or `rewrite` instead.

2. **Not enabling HTTP/2**: Major performance gain with minimal effort.

3. **Over-aggressive caching**: HTML should have short cache to allow updates.

4. **Missing `gzip_vary`**: Can cause issues with cached compressed/uncompressed responses.

5. **Not testing with `nginx -t`**: Always test before reloading.

6. **Forgetting IPv6**: Always include `listen [::]:443 ssl http2;`

7. **Weak SSL configuration**: Use modern ciphers and protocols.

8. **Not using HSTS**: Leave site vulnerable to downgrade attacks.
