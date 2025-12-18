# VKTN Granites - Deployment Guide

## 🌐 Deployment Options

### Option 1: Free Hosting (Recommended for Testing)
- **Backend**: Render.com (Free tier)
- **Frontend**: Vercel or Netlify (Free tier)
- **Database**: MongoDB Atlas (Already set up)

### Option 2: VPS Hosting (Production)
- **Server**: DigitalOcean, AWS EC2, or any VPS
- **Cost**: $5-10/month
- **Full Control**: Deploy both frontend and backend on same server

---

## 🚀 Option 1: Free Hosting (Render + Vercel)

### Part A: Deploy Backend to Render.com

#### Step 1: Prepare Backend for Deployment

1. **Add a start script** - Already done in `package.json`

2. **Create `.gitignore`** - Already exists

3. **Add environment variables to Render**

#### Step 2: Deploy to Render

1. **Create Render Account**
   - Go to [https://render.com](https://render.com)
   - Sign up with GitHub/GitLab/Email

2. **Push Code to GitHub**
   ```bash
   cd "f:/SEM 6/granite company"
   git init
   git add .
   git commit -m "Initial commit - VKTN Granites"
   # Create a new repository on GitHub first
   git remote add origin https://github.com/yourusername/vktn-granites.git
   git push -u origin main
   ```

3. **Create New Web Service on Render**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Configure:
     - **Name**: `vktn-granites-api`
     - **Environment**: `Node`
     - **Build Command**: `npm install`
     - **Start Command**: `npm start`
     - **Plan**: Free

4. **Add Environment Variables**
   In Render dashboard, add:
   ```
   MONGODB_URI=mongodb+srv://granite:mounith2005@cluster0.ap5ps3t.mongodb.net/?appName=Cluster0
   PORT=5000
   NODE_ENV=production
   JWT_SECRET=vktn-granites-secret-key-2024-production
   ```

5. **Deploy**
   - Click "Create Web Service"
   - Wait 5-10 minutes for deployment
   - Your API will be at: `https://vktn-granites-api.onrender.com`

### Part B: Deploy Frontend to Vercel

#### Step 1: Prepare Frontend

1. **Update API URL in frontend**
   Create `frontend/.env.production`:
   ```env
   REACT_APP_API_URL=https://vktn-granites-api.onrender.com
   ```

2. **Update axios baseURL** (if needed)
   Create `frontend/src/config.js`:
   ```javascript
   export const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
   ```

#### Step 2: Deploy to Vercel

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Deploy Frontend**
   ```bash
   cd frontend
   vercel
   ```

3. **Follow Prompts**
   - Login to Vercel
   - Set up project
   - Choose settings:
     - Build Command: `npm run build`
     - Output Directory: `build`
     - Install Command: `npm install`

4. **Your site will be live at**: `https://vktn-granites.vercel.app`

---

## 🖥️ Option 2: VPS Hosting (Full Control)

### Recommended VPS Providers:
- **DigitalOcean**: $6/month droplet
- **AWS Lightsail**: $5/month
- **Linode**: $5/month
- **Vultr**: $5/month

### Step 1: Set Up VPS

1. **Create Ubuntu 22.04 Server**
2. **SSH into server**
   ```bash
   ssh root@your-server-ip
   ```

3. **Update System**
   ```bash
   apt update && apt upgrade -y
   ```

4. **Install Node.js**
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   apt install -y nodejs
   node --version
   npm --version
   ```

5. **Install Nginx**
   ```bash
   apt install -y nginx
   systemctl start nginx
   systemctl enable nginx
   ```

6. **Install PM2 (Process Manager)**
   ```bash
   npm install -g pm2
   ```

### Step 2: Deploy Application

1. **Clone Your Repository**
   ```bash
   cd /var/www
   git clone https://github.com/yourusername/vktn-granites.git
   cd vktn-granites
   ```

2. **Install Dependencies**
   ```bash
   # Backend
   npm install
   
   # Frontend
   cd frontend
   npm install
   npm run build
   cd ..
   ```

3. **Create .env File**
   ```bash
   nano .env
   ```
   Add:
   ```env
   MONGODB_URI=mongodb+srv://granite:mounith2005@cluster0.ap5ps3t.mongodb.net/?appName=Cluster0
   PORT=5000
   NODE_ENV=production
   JWT_SECRET=vktn-granites-secret-key-2024-production
   ```

4. **Start Backend with PM2**
   ```bash
   pm2 start backend/server.js --name vktn-api
   pm2 save
   pm2 startup
   ```

### Step 3: Configure Nginx

1. **Create Nginx Configuration**
   ```bash
   nano /etc/nginx/sites-available/vktn-granites
   ```

2. **Add Configuration**
   ```nginx
   server {
       listen 80;
       server_name your-domain.com www.your-domain.com;

       # Frontend
       location / {
           root /var/www/vktn-granites/frontend/build;
           try_files $uri $uri/ /index.html;
       }

       # Backend API
       location /api {
           proxy_pass http://localhost:5000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
       }
   }
   ```

3. **Enable Site**
   ```bash
   ln -s /etc/nginx/sites-available/vktn-granites /etc/nginx/sites-enabled/
   nginx -t
   systemctl restart nginx
   ```

### Step 4: Set Up SSL (HTTPS)

1. **Install Certbot**
   ```bash
   apt install -y certbot python3-certbot-nginx
   ```

2. **Get SSL Certificate**
   ```bash
   certbot --nginx -d your-domain.com -d www.your-domain.com
   ```

3. **Auto-renewal**
   ```bash
   certbot renew --dry-run
   ```

---

## 🔧 Option 3: Simple VPS Setup Script

Create `deploy.sh` in your project root:

```bash
#!/bin/bash

echo "🚀 Deploying VKTN Granites..."

# Update code
git pull origin main

# Install backend dependencies
npm install

# Install frontend dependencies and build
cd frontend
npm install
npm run build
cd ..

# Restart backend
pm2 restart vktn-api

# Restart Nginx
systemctl restart nginx

echo "✅ Deployment complete!"
```

Make it executable:
```bash
chmod +x deploy.sh
```

Run deployment:
```bash
./deploy.sh
```

---

## 🌍 Domain Setup

### If You Have a Domain:

1. **Point Domain to Server**
   - Go to your domain registrar (GoDaddy, Namecheap, etc.)
   - Add A Record: `@` → `your-server-ip`
   - Add A Record: `www` → `your-server-ip`

2. **Update Nginx Config**
   - Replace `your-domain.com` with actual domain
   - Restart Nginx

3. **Get SSL Certificate**
   ```bash
   certbot --nginx -d yourdomain.com -d www.yourdomain.com
   ```

---

## 📊 Monitoring & Maintenance

### PM2 Commands
```bash
pm2 status              # Check status
pm2 logs vktn-api       # View logs
pm2 restart vktn-api    # Restart app
pm2 stop vktn-api       # Stop app
pm2 delete vktn-api     # Remove app
```

### Nginx Commands
```bash
systemctl status nginx   # Check status
systemctl restart nginx  # Restart
nginx -t                 # Test config
tail -f /var/log/nginx/error.log  # View errors
```

### MongoDB Atlas
- Monitor from MongoDB Atlas dashboard
- Set up alerts for connection issues
- Check database size and performance

---

## 🔐 Security Checklist

- [ ] Change JWT_SECRET to strong random string
- [ ] Enable firewall (UFW)
- [ ] Set up fail2ban
- [ ] Regular backups of MongoDB
- [ ] Keep Node.js and packages updated
- [ ] Use environment variables for secrets
- [ ] Enable HTTPS/SSL
- [ ] Set up monitoring and alerts

### Enable Firewall
```bash
ufw allow 22
ufw allow 80
ufw allow 443
ufw enable
```

---

## 🎯 Quick Deployment Comparison

| Feature | Render + Vercel | VPS Hosting |
|---------|----------------|-------------|
| **Cost** | Free | $5-10/month |
| **Setup Time** | 15 minutes | 1-2 hours |
| **Control** | Limited | Full |
| **Scaling** | Automatic | Manual |
| **SSL** | Automatic | Manual setup |
| **Best For** | Testing/Demo | Production |

---

## 📞 Support & Resources

- **Render Docs**: https://render.com/docs
- **Vercel Docs**: https://vercel.com/docs
- **DigitalOcean Tutorials**: https://www.digitalocean.com/community/tutorials
- **PM2 Docs**: https://pm2.keymetrics.io/docs
- **Nginx Docs**: https://nginx.org/en/docs/

---

## 🐛 Common Issues

### Issue: Backend not connecting to MongoDB
**Solution**: Check MongoDB Atlas network access, whitelist server IP

### Issue: Frontend can't reach backend
**Solution**: Update CORS settings in backend, check API URL

### Issue: PM2 app crashes
**Solution**: Check logs with `pm2 logs`, verify .env file

### Issue: Nginx 502 Bad Gateway
**Solution**: Check if backend is running with `pm2 status`

---

**Need help?** Contact: info@vktngranites.com

**Version**: 1.0.0  
**Last Updated**: December 2025
