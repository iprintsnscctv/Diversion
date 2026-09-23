# Hostinger PHP & public_html Deployment Guide

Deploying your web app via PHP on Hostinger requires **no Node.js background process** or terminal commands running 24/7. Hostinger's web server handles PHP automatically.

---

### Step 1: Build the Production Files
On your computer (or terminal), run:
```bash
npm run build
```
This compiles your entire React application and automatically places the HTML, CSS, JavaScript, `.htaccess`, and `backend.php` inside the **`dist/`** folder.

---

### Step 2: Configure Your Gemini API Key in `backend.php`
Open `dist/backend.php` (or edit it directly inside Hostinger File Manager after uploading):
Locate line 19:
```php
$GEMINI_API_KEY = getenv('GEMINI_API_KEY') ?: getenv('VITE_GEMINI_API_KEY') ?: 'YOUR_GEMINI_API_KEY_HERE';
```
Replace `'YOUR_GEMINI_API_KEY_HERE'` with your actual Google Gemini API key:
```php
$GEMINI_API_KEY = 'AIzaSy...your_actual_key_here';
```
*(Your API key remains 100% hidden on the server and is never exposed to visitors in the browser)*.

---

### Step 3: Open Hostinger File Manager
1. Log in to your **[Hostinger hPanel](https://hpanel.hostinger.com)**.
2. Under **Websites** (or **Hosting**), find your domain and click **Dashboard** (or **Manage**).
3. In the sidebar, click **File Manager** (Files -> File Manager).
4. Click **Access files of [your-domain.com]**.
5. Double-click the **`public_html`** folder to open it.

---

### Step 4: Upload Your Files into `public_html`
1. If there is a default placeholder file like `default.php`, delete it.
2. Select all files and folders inside your local **`dist/`** folder:
   * `index.html`
   * `backend.php`
   * `.htaccess` (make sure hidden files are enabled if uploading manually)
   * `assets/` (folder containing compiled `.js` and `.css`)
3. Drag and drop them directly into the **`public_html`** directory in Hostinger.

> **💡 Quick Tip:** You can also zip the contents of `dist/` into a `dist.zip` file, upload `dist.zip` to `public_html`, right-click it in Hostinger File Manager, and click **Extract**.

---

### Step 5: Verify Your Live Website
1. Visit your domain: `https://yourdomain.com`
   - Your hotel booking interface, room matrix, and front desk dashboard will load instantly.
2. Test the PHP backend: `https://yourdomain.com/backend.php`
   - Should return `{"status":"healthy","service":"Diversion Vigan Transient PHP Backend",...}`
3. Click the **Ask Gemini** button in the bottom right corner:
   - Your frontend `fetch('/backend.php')` calls PHP securely, and Gemini AI will answer guest inquiries in real-time.
