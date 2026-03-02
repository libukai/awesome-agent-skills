# Static Site Deployment Checklist

## Pre-Deployment

- [ ] Build project (if applicable): `npm run build` / `yarn build`
- [ ] Verify build output directory exists (`dist/`, `build/`, etc.)
- [ ] Test build locally with a static server
- [ ] Review `.vscode/sftp.json` configuration
- [ ] Verify SSH access to production server
- [ ] Confirm remote directory exists: `ssh user@server "ls -la /var/www/sitename"`

## File Upload

- [ ] Open VSCode SFTP extension
- [ ] Right-click project folder → "Upload Folder" or "Sync Local → Remote"
- [ ] Verify no upload errors in VSCode Output panel
- [ ] SSH to server and verify files: `ls -la /var/www/sitename`
- [ ] Check file permissions: `chmod -R 755 /var/www/sitename`

## Nginx Configuration

- [ ] Upload Nginx config to `/etc/nginx/sites-available/sitename.conf`
- [ ] Create symlink: `sudo ln -s /etc/nginx/sites-available/sitename.conf /etc/nginx/sites-enabled/`
- [ ] Test configuration syntax: `sudo nginx -t`
- [ ] Reload Nginx: `sudo systemctl reload nginx`
- [ ] Check Nginx status: `sudo systemctl status nginx`

## SSL/TLS (if not configured)

- [ ] Install Certbot: `sudo apt install certbot python3-certbot-nginx`
- [ ] Obtain certificate: `sudo certbot --nginx -d example.com -d www.example.com`
- [ ] Verify auto-renewal: `sudo certbot renew --dry-run`
- [ ] Check certificate expiry: `sudo certbot certificates`

## Verification

- [ ] Test HTTP → HTTPS redirect: `curl -I http://example.com`
- [ ] Test HTTPS response: `curl -I https://example.com`
- [ ] Verify security headers: `curl -I https://example.com | grep -E 'X-Frame|Strict-Transport|X-Content'`
- [ ] Test in browser (Chrome/Firefox/Safari)
- [ ] Check browser console for errors (F12)
- [ ] Test mobile responsiveness
- [ ] Verify all static assets load correctly (images, CSS, JS)

## Performance Check

- [ ] Test Gzip compression: `curl -H "Accept-Encoding: gzip" -I https://example.com`
- [ ] Verify caching headers: `curl -I https://example.com/style.css | grep Cache-Control`
- [ ] Run PageSpeed Insights: https://pagespeed.web.dev/
- [ ] Run WebPageTest: https://www.webpagetest.org/
- [ ] Check security score: https://securityheaders.com/

## Post-Deployment

- [ ] Monitor Nginx logs: `sudo tail -f /var/log/nginx/sitename-access.log`
- [ ] Check for errors: `sudo tail -f /var/log/nginx/sitename-error.log`
- [ ] Test all critical user flows
- [ ] Update project documentation with deployment details
- [ ] Create backup: `sudo tar -czf /backup/sitename-$(date +%Y%m%d).tar.gz /var/www/sitename`

## Troubleshooting

**Issue: 403 Forbidden**
- Check file permissions: `sudo chmod -R 755 /var/www/sitename`
- Check Nginx user: `ps aux | grep nginx`
- Verify directory ownership: `sudo chown -R www-data:www-data /var/www/sitename`

**Issue: 502 Bad Gateway**
- Not applicable for static sites (only affects reverse proxies)
- If you see this, check if Nginx is trying to proxy instead of serving static files

**Issue: Files not updating**
- Clear browser cache: Ctrl+Shift+R (Chrome/Firefox)
- Check if old files still on server: `ls -la /var/www/sitename`
- Verify SFTP uploaded correctly: Check VSCode Output panel

**Issue: SSL certificate errors**
- Renew certificate: `sudo certbot renew`
- Check certificate paths in Nginx config
- Verify certificate validity: `sudo certbot certificates`
