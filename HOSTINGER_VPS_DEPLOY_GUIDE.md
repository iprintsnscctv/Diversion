# Hostinger VPS Deployment Guide

Follow these steps to deploy this full-stack web app onto your Hostinger VPS.

---

### Step 1: Connect to your Hostinger VPS via SSH
Open your terminal (PowerShell, Command Prompt, or Terminal on Mac/Linux) and connect:
```bash
ssh root@YOUR_VPS_IP_ADDRESS
```

---

### Step 2: Upload or Clone Your Code
Create an application directory and navigate into it:
```bash
mkdir -p /var/www/hotel-app
cd /var/www/hotel-app
```
*(You can upload your files via FileZilla / SFTP or `git clone` into `/var/www/hotel-app`)*

---

### Step 3: Install Node.js, Dependencies & Build
Run these commands inside `/var/www/hotel-app`:
```bash
# 1. Install all dependencies
npm install

# 2. Build the production frontend and backend bundle
npm run build
```

---

### Step 4: Start the Server with PM2 (24/7 Uptime)
PM2 ensures the web app runs continuously, auto-restarts on crash or server reboot:
```bash
# Install PM2 globally if not already installed
npm install -g pm2

# Start the app using the included ecosystem config
pm2 start ecosystem.config.cjs

# Save PM2 state and enable auto-start on server boot
pm2 save
pm2 startup
```

To view app status or logs:
```bash
pm2 status
pm2 logs diversion-hotel-app
```

---

### Step 5: (Optional) Point Your Domain with Nginx & Free SSL

1. Install Nginx:
```bash
apt update && apt install -y nginx certbot python3-certbot-nginx
```

2. Create an Nginx site configuration:
```bash
nano /etc/nginx/sites-available/yourdomain.com
```

Paste the following configuration (replace `yourdomain.com` with your actual domain):
```nginx
server {
    server_name yourdomain.com www.yourdomain.com;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

3. Enable the site and restart Nginx:
```bash
ln -s /etc/nginx/sites-available/yourdomain.com /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx
```

4. Issue free HTTPS SSL certificate with Let's Encrypt:
```bash
certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

Your web app is now live with full frontend, backend, database persistence, and SSL!
