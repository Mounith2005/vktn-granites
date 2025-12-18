# 🚀 VKTN Granites - Deployment Checklist

## ✅ Pre-Deployment Checklist

### 1. Code Preparation
- [ ] All code committed to Git
- [ ] `.env` file NOT committed (in .gitignore)
- [ ] Dependencies up to date
- [ ] No console.logs in production code
- [ ] Error handling implemented
- [ ] CORS configured for production domain

### 2. Environment Variables
- [ ] MongoDB Atlas connection string ready
- [ ] JWT_SECRET changed from default
- [ ] PORT configured (5000)
- [ ] NODE_ENV set to 'production'
- [ ] Frontend URL configured for CORS

### 3. Database
- [ ] MongoDB Atlas cluster created
- [ ] Database user created
- [ ] Network access configured (0.0.0.0/0 or specific IPs)
- [ ] Connection string tested
- [ ] Collections indexed if needed

### 4. Security
- [ ] Strong JWT_SECRET generated
- [ ] Passwords not hardcoded
- [ ] HTTPS/SSL ready
- [ ] CORS properly configured
- [ ] Rate limiting considered
- [ ] Input validation in place

---

## 🎯 Quick Deployment Options

### Option A: Free Hosting (Fastest - 15 minutes)

#### Backend: Render.com
1. [ ] Create Render account
2. [ ] Push code to GitHub
3. [ ] Create new Web Service on Render
4. [ ] Connect GitHub repository
5. [ ] Add environment variables
6. [ ] Deploy and get URL

#### Frontend: Vercel
1. [ ] Install Vercel CLI: `npm i -g vercel`
2. [ ] Update API URL in `frontend/.env.production`
3. [ ] Run `vercel` in frontend folder
4. [ ] Follow prompts
5. [ ] Get deployment URL

**Total Cost**: FREE ✨

---

### Option B: VPS Hosting (Full Control - 1-2 hours)

#### Choose Provider
- [ ] DigitalOcean ($6/month)
- [ ] AWS Lightsail ($5/month)
- [ ] Linode ($5/month)
- [ ] Vultr ($5/month)

#### Server Setup
1. [ ] Create Ubuntu 22.04 droplet
2. [ ] SSH into server
3. [ ] Update system: `apt update && apt upgrade -y`
4. [ ] Install Node.js 18
5. [ ] Install Nginx
6. [ ] Install PM2: `npm i -g pm2`
7. [ ] Configure firewall (UFW)

#### Deploy Application
1. [ ] Clone repository to `/var/www/vktn-granites`
2. [ ] Install backend dependencies
3. [ ] Build frontend: `cd frontend && npm run build`
4. [ ] Create `.env` file with production values
5. [ ] Start with PM2: `pm2 start ecosystem.config.js`
6. [ ] Configure Nginx (use provided nginx.conf)
7. [ ] Test Nginx config: `nginx -t`
8. [ ] Restart Nginx: `systemctl restart nginx`

#### SSL Certificate
1. [ ] Install Certbot
2. [ ] Run: `certbot --nginx -d yourdomain.com`
3. [ ] Test auto-renewal: `certbot renew --dry-run`

**Total Cost**: $5-10/month 💰

---

### Option C: Docker Deployment (Advanced)

1. [ ] Install Docker on server
2. [ ] Copy `.env.production.example` to `.env`
3. [ ] Update environment variables
4. [ ] Build: `docker-compose build`
5. [ ] Start: `docker-compose up -d`
6. [ ] Check logs: `docker-compose logs -f`

**Total Cost**: VPS cost ($5-10/month)

---

## 📋 Post-Deployment Checklist

### Testing
- [ ] Backend health check: `https://your-api.com/api/health`
- [ ] Frontend loads correctly
- [ ] User registration works
- [ ] User login works
- [ ] Products page displays
- [ ] Contact form submits
- [ ] MongoDB connection stable
- [ ] All API endpoints responding

### Monitoring
- [ ] Set up PM2 monitoring (if using PM2)
- [ ] Configure MongoDB Atlas alerts
- [ ] Set up uptime monitoring (UptimeRobot, Pingdom)
- [ ] Check server logs regularly
- [ ] Monitor database usage

### Security
- [ ] HTTPS enabled (SSL certificate)
- [ ] Firewall configured
- [ ] fail2ban installed (optional)
- [ ] Regular backups scheduled
- [ ] MongoDB backups enabled

### Documentation
- [ ] Update README with live URLs
- [ ] Document deployment process
- [ ] Save server credentials securely
- [ ] Note any custom configurations

---

## 🔧 Quick Commands Reference

### PM2 Commands
```bash
pm2 start ecosystem.config.js  # Start app
pm2 status                      # Check status
pm2 logs                        # View logs
pm2 restart vktn-granites-api   # Restart
pm2 stop vktn-granites-api      # Stop
pm2 save                        # Save config
pm2 startup                     # Auto-start on boot
```

### Nginx Commands
```bash
nginx -t                        # Test config
systemctl restart nginx         # Restart
systemctl status nginx          # Check status
tail -f /var/log/nginx/error.log  # View errors
```

### Git Deployment
```bash
git pull origin main            # Update code
npm install                     # Update dependencies
cd frontend && npm run build    # Rebuild frontend
pm2 restart vktn-granites-api   # Restart app
```

---

## 🌐 Domain Configuration

### DNS Settings (at your domain registrar)
```
Type    Name    Value               TTL
A       @       your-server-ip      3600
A       www     your-server-ip      3600
```

### Update These Files After Getting Domain
1. `backend/server.js` - Update CORS origins
2. `nginx.conf` - Replace `your-domain.com`
3. `frontend/.env.production` - Update API URL

---

## 📊 Deployment URLs Template

After deployment, update these:

```
Production URLs:
- Frontend: https://vktn-granites.vercel.app
- Backend API: https://vktn-granites-api.onrender.com
- Database: MongoDB Atlas (already configured)

Admin Access:
- MongoDB Atlas: https://cloud.mongodb.com
- Render Dashboard: https://dashboard.render.com
- Vercel Dashboard: https://vercel.com/dashboard

Server Details (if VPS):
- IP Address: xxx.xxx.xxx.xxx
- SSH: ssh root@xxx.xxx.xxx.xxx
- Domain: https://www.vktngranites.com
```

---

## 🆘 Troubleshooting

### Backend not starting
```bash
pm2 logs vktn-granites-api  # Check logs
pm2 restart vktn-granites-api  # Restart
```

### Frontend not loading
- Check if build folder exists
- Verify Nginx configuration
- Check Nginx error logs

### Database connection failed
- Verify MongoDB Atlas network access
- Check connection string in .env
- Whitelist server IP in MongoDB Atlas

### 502 Bad Gateway
- Backend not running: `pm2 status`
- Wrong port in Nginx config
- Firewall blocking port 5000

---

## 📞 Support Resources

- **Render**: https://render.com/docs
- **Vercel**: https://vercel.com/docs
- **DigitalOcean**: https://www.digitalocean.com/community
- **MongoDB Atlas**: https://docs.atlas.mongodb.com
- **PM2**: https://pm2.keymetrics.io/docs
- **Nginx**: https://nginx.org/en/docs

---

## ✨ Recommended: Start with Free Hosting

**For your first deployment, I recommend:**

1. **Backend**: Deploy to Render.com (Free)
2. **Frontend**: Deploy to Vercel (Free)
3. **Database**: MongoDB Atlas (Already set up)

**Why?**
- ✅ Free to start
- ✅ Quick setup (15 minutes)
- ✅ Automatic HTTPS
- ✅ Easy to manage
- ✅ Can upgrade later

**Once you're comfortable, migrate to VPS for:**
- Full control
- Better performance
- Custom domain
- Lower long-term costs

---

**Ready to deploy?** Follow the DEPLOYMENT_GUIDE.md for detailed steps!

**Company**: VKTN Granites  
**Version**: 1.0.0  
**Last Updated**: December 2025
