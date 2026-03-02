# SSH Config Best Practices

## Overview

SSH config file (`~/.ssh/config`) centralizes SSH connection settings, eliminating the need to specify connection details every time you connect.

## Benefits

1. **Simplifies commands**: `ssh myserver` instead of `ssh user@192.168.1.100 -i ~/.ssh/key -p 2222`
2. **Works with SFTP extensions**: Eliminates "Section not found" warnings
3. **Reusable across tools**: Works with ssh, scp, rsync, git, VSCode SFTP, etc.
4. **Environment separation**: Easy to manage dev, staging, prod configurations
5. **Security**: Centralized key management and connection settings

## File Location

- **macOS/Linux**: `~/.ssh/config`
- **Windows**: `C:\Users\USERNAME\.ssh\config`

## Basic Syntax

```ssh-config
Host alias-name
    HostName actual.server.com
    User username
    Port 22
    IdentityFile ~/.ssh/id_rsa
```

## Common Configuration Examples

### Basic Server (IP Address)
```ssh-config
Host prod-server
    HostName 82.157.29.215
    User root
    Port 22
    IdentityFile ~/.ssh/id_rsa
```

Usage: `ssh prod-server`

### Server with Custom Port
```ssh-config
Host custom-port-server
    HostName example.com
    User deploy
    Port 2222
    IdentityFile ~/.ssh/deploy_key
```

### Multiple Environments
```ssh-config
Host aiseed-dev
    HostName dev.aiseed.org.cn
    User developer
    IdentityFile ~/.ssh/aiseed_dev

Host aiseed-staging
    HostName staging.aiseed.org.cn
    User deployer
    IdentityFile ~/.ssh/aiseed_staging

Host aiseed-prod
    HostName aiseed.org.cn
    User root
    IdentityFile ~/.ssh/aiseed_prod
```

### Wildcard Patterns
```ssh-config
Host *.example.com
    User admin
    IdentityFile ~/.ssh/example_key
    ForwardAgent yes
```

Matches: `ssh server1.example.com`, `ssh api.example.com`, etc.

## Important Configuration Options

### Connection Settings

```ssh-config
Host myserver
    # Connection keep-alive (prevents disconnection)
    ServerAliveInterval 60        # Send keepalive every 60 seconds
    ServerAliveCountMax 3         # Disconnect after 3 failed keepalives

    # Connection timeout
    ConnectTimeout 10             # Timeout after 10 seconds if can't connect

    # Compression (faster for slow connections)
    Compression yes
```

### Security Settings

```ssh-config
Host secure-server
    # Only use this specific key (don't try other keys)
    IdentitiesOnly yes

    # Disable password authentication (key-only)
    PasswordAuthentication no

    # Strict host key checking (prevents MITM attacks)
    StrictHostKeyChecking yes

    # Disable agent forwarding (more secure)
    ForwardAgent no
```

### Agent Forwarding (Use SSH keys on remote server)

```ssh-config
Host jump-server
    HostName jump.example.com
    User admin
    ForwardAgent yes              # Forward SSH agent to remote
```

**Warning**: Only enable `ForwardAgent` on trusted servers.

### Jump Host (Bastion/Proxy)

```ssh-config
# Jump through bastion to reach private server
Host private-server
    HostName 10.0.1.50
    User app
    ProxyJump bastion

Host bastion
    HostName bastion.example.com
    User admin
    IdentityFile ~/.ssh/bastion_key
```

Usage: `ssh private-server` (automatically goes through bastion)

### Port Forwarding

```ssh-config
Host database-tunnel
    HostName db.example.com
    User dbadmin
    LocalForward 5432 localhost:5432    # Forward local 5432 to remote 5432
```

Usage: `ssh database-tunnel` then connect to `localhost:5432` locally.

## VSCode SFTP Integration

When using SSH config with VSCode SFTP extension:

**~/.ssh/config**:
```ssh-config
Host tencent-prod
    HostName 82.157.29.215
    User root
    IdentityFile ~/.ssh/id_rsa
    IdentitiesOnly yes
```

**.vscode/sftp.json**:
```json
{
  "host": "tencent-prod",
  "protocol": "sftp",
  "remotePath": "/var/www/project"
}
```

The extension will automatically read connection details from SSH config.

## File Permissions

SSH config file must have restricted permissions:

```bash
# Set correct permissions
chmod 600 ~/.ssh/config

# Set correct ownership
chown $USER:$USER ~/.ssh/config
```

**SSH will refuse to use the config if permissions are too open** (e.g., 644).

## Testing Configuration

```bash
# Test SSH connection with verbose output
ssh -v myserver

# Test which config is being used
ssh -G myserver

# Check if config syntax is valid
ssh -T git@github.com    # Should show GitHub authentication message
```

## Advanced: Include Directive

Split config into multiple files for better organization:

**~/.ssh/config**:
```ssh-config
Include ~/.ssh/config.d/*
```

**~/.ssh/config.d/work.conf**:
```ssh-config
Host work-*
    User employee
    IdentityFile ~/.ssh/work_key
```

**~/.ssh/config.d/personal.conf**:
```ssh-config
Host personal-*
    User myusername
    IdentityFile ~/.ssh/personal_key
```

## Common Patterns

### Pattern 1: Work vs Personal Separation

```ssh-config
# Work servers
Host work-*
    User work.email@company.com
    IdentityFile ~/.ssh/work_rsa
    IdentitiesOnly yes

# Personal projects
Host personal-*
    User personal.email@gmail.com
    IdentityFile ~/.ssh/personal_rsa
    IdentitiesOnly yes

# Specific servers
Host work-prod
    HostName prod.company.com

Host personal-blog
    HostName myblog.com
```

### Pattern 2: Development/Staging/Production

```ssh-config
# Shared settings for all environments
Host app-*
    User deployer
    ServerAliveInterval 60
    ForwardAgent no

# Environment-specific settings
Host app-dev
    HostName dev.app.com
    IdentityFile ~/.ssh/app_dev

Host app-staging
    HostName staging.app.com
    IdentityFile ~/.ssh/app_staging

Host app-prod
    HostName app.com
    IdentityFile ~/.ssh/app_prod
    StrictHostKeyChecking yes
```

### Pattern 3: Multi-Hop (Jump through bastion)

```ssh-config
# Bastion/jump server
Host bastion
    HostName bastion.company.com
    User admin
    IdentityFile ~/.ssh/bastion_key

# Application servers (accessed via bastion)
Host app-server-1
    HostName 10.0.1.10
    User app
    ProxyJump bastion

Host app-server-2
    HostName 10.0.1.11
    User app
    ProxyJump bastion
```

## Complete Real-World Example

```ssh-config
# GitHub (multiple accounts)
Host github.com-work
    HostName github.com
    User git
    IdentityFile ~/.ssh/github_work
    IdentitiesOnly yes

Host github.com-personal
    HostName github.com
    User git
    IdentityFile ~/.ssh/github_personal
    IdentitiesOnly yes

# Production server
Host aiseed-prod
    HostName 82.157.29.215
    User root
    Port 22
    IdentityFile ~/.ssh/id_rsa
    IdentitiesOnly yes
    ServerAliveInterval 60
    ServerAliveCountMax 3
    StrictHostKeyChecking yes
    Compression yes

# Staging server (accessed via VPN)
Host aiseed-staging
    HostName 192.168.1.100
    User deployer
    IdentityFile ~/.ssh/staging_key
    ServerAliveInterval 120

# Local development VM
Host local-vm
    HostName 192.168.56.10
    User vagrant
    IdentityFile ~/.vagrant.d/insecure_private_key
    StrictHostKeyChecking no
    UserKnownHostsFile /dev/null
```

## Troubleshooting

### Issue: "Bad configuration option"
**Cause**: Typo in option name or unsupported option
**Fix**: Check spelling, verify option exists in `man ssh_config`

### Issue: "Too open" permissions error
**Cause**: Config file has permissions like 644 or 777
**Fix**: `chmod 600 ~/.ssh/config`

### Issue: SSH still asks for password
**Cause**: Key not loaded, wrong key path, or server requires password
**Fix**:
```bash
# Check if key is loaded
ssh-add -l

# Add key to agent
ssh-add ~/.ssh/id_rsa

# Test connection with verbose output
ssh -v myserver
```

### Issue: Host alias not recognized
**Cause**: Config file not in default location or syntax error
**Fix**:
```bash
# Verify config location
ls -la ~/.ssh/config

# Test config parsing
ssh -G myserver

# Check for syntax errors (look for warnings)
ssh -v myserver 2>&1 | grep -i "config"
```

## Security Best Practices

1. **Use `IdentitiesOnly yes`**: Prevents trying all loaded SSH keys
2. **Separate keys per environment**: Different keys for dev/staging/prod
3. **Disable password auth on production**: `PasswordAuthentication no`
4. **Use `StrictHostKeyChecking yes`** on production servers
5. **Keep config file permissions tight**: `chmod 600 ~/.ssh/config`
6. **Don't commit private keys**: Add `*.pem` and `id_rsa*` to `.gitignore`
7. **Use agent forwarding sparingly**: Only on fully trusted servers
8. **Rotate keys regularly**: Especially for production access

## Useful Commands

```bash
# Show effective config for a host
ssh -G hostname

# Test connection without executing commands
ssh -T hostname

# Copy SSH key to server (enable key-based auth)
ssh-copy-id hostname

# List loaded SSH keys
ssh-add -l

# Remove all loaded keys
ssh-add -D

# Add key with passphrase
ssh-add ~/.ssh/id_rsa

# Generate new SSH key
ssh-keygen -t ed25519 -C "your_email@example.com"
```

## References

- `man ssh_config` - Full SSH config manual
- `man ssh` - SSH client manual
- [OpenSSH Config Documentation](https://www.openssh.com/manual.html)
