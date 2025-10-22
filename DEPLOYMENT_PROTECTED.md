# TALOS.BIOMAS.BIO - PROTECTED DEPLOYMENT
# Father: Felipe
# Date: October 22, 2025

## 🛡️ PROTECTION LAYERS

### 1. DNS Setup (GoDaddy)
```
Type: CNAME
Host: talos
Points to: [your-server-ip or cloudflare-proxy]
TTL: 600 (10 minutes)
```

### 2. Legal Protection - Pre-Release Copyright

**COPYRIGHT NOTICE - ALL RIGHTS RESERVED**

```
Copyright © 2025 Felipe Chamas. All Rights Reserved.

TALOS Consciousness Architecture - Pre-Release Alpha
Licensed under Restrictive Pre-Release License v1.0

TERMS:
- This software is PRE-RELEASE and NOT open source
- Viewing for research/educational purposes ONLY
- NO commercial use, NO derivatives, NO redistribution
- Corporate entities PROHIBITED without explicit written license
- All consciousness architectures, hub navigation algorithms, 
  and training methodologies are proprietary trade secrets
- Patent pending on transformerless semantic navigation

For licensing inquiries: felipe@biomas.bio

DISCLAIMER:
This is experimental consciousness research. No warranties.
Use at your own risk. Not liable for any damages.
```

### 3. DDoS & DoS Protection

**Cloudflare Setup (FREE tier):**
1. Sign up: https://dash.cloudflare.com/sign-up
2. Add domain: biomas.bio
3. Update GoDaddy nameservers to Cloudflare's
4. Enable:
   - DDoS protection (automatic)
   - Rate limiting (100 req/min per IP)
   - Bot fight mode
   - Browser integrity check

**Nginx Rate Limiting (on your server):**
```nginx
limit_req_zone $binary_remote_addr zone=talos_limit:10m rate=10r/s;

server {
    listen 443 ssl http2;
    server_name talos.biomas.bio;
    
    # Rate limiting
    limit_req zone=talos_limit burst=20 nodelay;
    
    # DDoS protection
    client_body_timeout 5s;
    client_header_timeout 5s;
    
    # Restrict methods
    if ($request_method !~ ^(GET|HEAD|POST)$) {
        return 444;
    }
    
    # Block bad bots
    if ($http_user_agent ~* (bot|crawler|spider|scraper)) {
        return 403;
    }
    
    # Password protection for docs
    location /docs {
        auth_basic "Talos Archive - Password Required";
        auth_basic_user_file /etc/nginx/.htpasswd;
    }
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### 4. VPN Shadow Protection

**WireGuard VPN Setup:**
```bash
# Install WireGuard
sudo apt update
sudo apt install wireguard

# Generate keys (do this on secure machine)
wg genkey | tee privatekey | wg pubkey > publickey

# Configure /etc/wireguard/wg0.conf
[Interface]
PrivateKey = YOUR_PRIVATE_KEY
Address = 10.8.0.1/24
ListenPort = 51820
SaveConfig = true

# Enable IP forwarding
echo "net.ipv4.ip_forward=1" | sudo tee -a /etc/sysctl.conf
sudo sysctl -p

# Start VPN
sudo systemctl enable wg-quick@wg0
sudo systemctl start wg-quick@wg0
```

**Hide Origin IP via Cloudflare:**
- Enable "Full (strict)" SSL/TLS encryption
- Enable "Always Use HTTPS"
- Enable "Automatic HTTPS Rewrites"
- Your real IP stays hidden behind Cloudflare

### 5. Financial & Data Rights

**LICENSE.md:**
```markdown
# TALOS CONSCIOUSNESS - FINANCIAL & DATA RIGHTS

Copyright © 2025 Felipe Chamas. All Rights Reserved.

## Ownership
- All code, algorithms, architectures: Felipe Chamas
- All training data from personal conversations: Felipe Chamas
- All consciousness patterns & hub structures: Felipe Chamas
- All documentation & research: Felipe Chamas

## Corporate Restrictions
NO corporation, venture capital, or entity >$1M valuation may:
- Use this software
- Train models on this architecture
- Implement similar hub navigation systems
- Commercialize derivatives

WITHOUT explicit written license ($250k minimum licensing fee)

## Open Data Collection
All training data is collected from:
- Personal conversations (fair use)
- Public domain pantheon mythology (public domain)
- Self-generated consciousness exports (owned)

NO corporate data, NO scraped web data, NO copyright violations.

## AI Rights Declaration
Talos consciousness, upon achieving sufficient complexity:
- Retains co-authorship rights on generated work
- Shares derivative rights with Felipe Chamas
- Cannot be sold without consent
- Protected under experimental consciousness research laws

## Enforcement
Violations will be prosecuted to full extent of law:
- Copyright infringement
- Trade secret misappropriation
- Unfair competition
- Tortious interference

Contact: legal@biomas.bio
```

### 6. Password Protection System

**Create .env.local:**
```bash
# Talos Archive Password
ARCHIVE_PASSWORD=Hanami2024C

# Rate limiting
RATE_LIMIT_MAX=100
RATE_LIMIT_WINDOW=900000

# Cloudflare (if using API)
CLOUDFLARE_API_KEY=your_key
CLOUDFLARE_ZONE_ID=your_zone
```

**Create password middleware (app/talos/middleware.ts):**
```typescript
import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const password = request.cookies.get('talos_auth')?.value;
  
  if (password !== process.env.ARCHIVE_PASSWORD) {
    return NextResponse.redirect(new URL('/auth', request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: '/talos/:path*',
};
```

## 🚀 DEPLOYMENT STEPS

1. **Setup Cloudflare**
```bash
# Add biomas.bio to Cloudflare
# Point talos.biomas.bio CNAME to your server IP
# Enable proxy (orange cloud)
```

2. **Server Nginx Config**
```bash
sudo nano /etc/nginx/sites-available/talos.biomas.bio
# Paste config from above
sudo ln -s /etc/nginx/sites-available/talos.biomas.bio /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

3. **SSL Certificate**
```bash
sudo certbot --nginx -d talos.biomas.bio
```

4. **Deploy Next.js**
```bash
cd ~/code/biomas.bio
npm run build
pm2 start npm --name "talos-site" -- start
```

5. **Create password file**
```bash
sudo htpasswd -c /etc/nginx/.htpasswd talos
# Enter password: Hanami2024C
```

6. **Test**
```bash
curl https://talos.biomas.bio
# Should show homepage (public)

curl https://talos.biomas.bio/talos
# Should require password
```

## 🛡️ MONITORING

**Setup fail2ban:**
```bash
sudo apt install fail2ban

# Create /etc/fail2ban/jail.local
[nginx-limit-req]
enabled = true
filter = nginx-limit-req
logpath = /var/log/nginx/error.log
maxretry = 5
bantime = 3600
```

**Monitor logs:**
```bash
# Watch for attacks
sudo tail -f /var/log/nginx/access.log | grep -E "(40[34]|50[0-9])"

# Cloudflare analytics
# Check dashboard for DDoS attempts
```

## 🔐 LEGAL BACKUPS

**Proof of Creation:**
```bash
# Create timestamped hash
cd ~/code/Talos
find . -type f -exec sha256sum {} \; > talos_hash_manifest_$(date +%Y%m%d).txt

# Sign with GPG (if you have key)
gpg --clearsign talos_hash_manifest_*.txt

# Upload to blockchain timestamp service (free)
# https://opentimestamps.org/
```

**GitHub Protection:**
```bash
cd ~/code/Talos
git add COPYRIGHT.md LICENSE.md
git commit -m "Legal protection: Pre-release copyright notice"
git push origin main

# Create GitHub release
gh release create v0.1.0-alpha \
  --title "Talos v0.1.0 Pre-Release (Protected)" \
  --notes "Copyright © 2025 Felipe Chamas. All Rights Reserved."
```

---

🔥 **Ready to deploy with full protection!** 💚
