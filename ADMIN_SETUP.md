# 🔐 Admin Portal - Professional Setup Guide

## Overview
VKTN Granites has a **separate, professional admin portal** for managing temple granite orders. The admin system is completely isolated from the customer-facing website, similar to enterprise business applications.

---

## 🚀 Quick Setup

### Step 1: Create Admin User

Run this command to create the admin account:

```bash
npm run create-admin
```

This will create an admin user with:
- **Email**: `admin@vktngranites.com`
- **Password**: `admin123`
- **Role**: `admin`

⚠️ **IMPORTANT**: Store these credentials securely. They are not displayed anywhere on the website.

### Step 2: Access Admin Portal

**Direct URL Access Only:**
- Local: `http://localhost:3000/admin-login`
- Production: `https://vktn-granites.vercel.app/admin-login`

**Note**: There are NO links to the admin portal on the public website. This is intentional for security.

---

## 📱 Admin Features

### Admin Login Page (`/admin-login`)
- Dedicated admin authentication
- Shows default credentials on the page
- Validates admin role after login
- Redirects to admin dashboard

### Admin Dashboard (`/admin`)
- View all orders from all customers
- Order statistics (total, pending, completed)
- Update order status
- View detailed order information
- Admin-only access (protected route)

---

## 🔑 Default Admin Credentials

```
Email: admin@vktngranites.com
Password: admin123
```

⚠️ **IMPORTANT**: Change these credentials after first login!

---

## 🛡️ Security Features

1. **Role-Based Access Control**
   - Only users with `role: 'admin'` can access admin routes
   - Regular users cannot access admin dashboard
   - Admin login validates role after authentication

2. **Protected Routes**
   - `/admin` - Admin dashboard (admin only)
   - `/api/orders` - View all orders (admin sees all, users see own)
   - `/api/orders/:id/status` - Update order status (admin only)

3. **JWT Authentication**
   - Secure token-based authentication
   - Tokens stored in localStorage
   - Auto-logout on invalid tokens

---

## 📋 How to Use Admin System

### For First Time Setup:

1. **Create Admin User**
   ```bash
   npm run create-admin
   ```

2. **Start Backend**
   ```bash
   npm start
   ```

3. **Start Frontend** (in another terminal)
   ```bash
   cd frontend
   npm start
   ```

4. **Login as Admin**
   - Go to `http://localhost:3000/admin-login`
   - Use default credentials
   - You'll be redirected to admin dashboard

### For Regular Use:

1. **Admin Login**: Click "Admin Login" link in footer or go to `/admin-login`
2. **View Orders**: See all customer orders in the dashboard
3. **Manage Orders**: Click "View" to see details and update status
4. **Update Status**: Change order status (Pending → Confirmed → Processing → Completed)

---

## 🔄 Order Status Flow

```
Pending → Confirmed → Processing → Completed
                    ↓
                Cancelled
```

**Status Meanings:**
- **Pending**: New order, awaiting confirmation
- **Confirmed**: Order confirmed, preparing materials
- **Processing**: Order in production
- **Completed**: Order finished and delivered
- **Cancelled**: Order cancelled

---

## 👥 User vs Admin Access

### Regular Users Can:
- ✅ Register and login
- ✅ Place orders
- ✅ View their own orders
- ✅ See order status
- ❌ Cannot access admin dashboard
- ❌ Cannot see other users' orders
- ❌ Cannot update order status

### Admin Can:
- ✅ All user features
- ✅ Access admin dashboard
- ✅ View all orders from all customers
- ✅ Update order status
- ✅ View order statistics
- ✅ Manage all orders

---

## 🌐 Navigation

### Admin Portal Access:
**The admin portal is intentionally hidden from public view.**

1. **No Public Links** - Admin login is not linked anywhere on the customer website
2. **Direct URL Only** - Access via `/admin-login` URL directly
3. **Bookmark Recommended** - Admin users should bookmark the admin login page

### After Admin Login:
- **Navbar** shows "Admin" link (only visible to logged-in admin users)
- Click "Admin" to access dashboard
- Regular navigation links still available
- Admin can browse the public site while logged in

---

## 🔧 Troubleshooting

### "Access denied. Admin credentials required"
- The account you're using is not an admin
- Make sure you created the admin user with `npm run create-admin`
- Check MongoDB to verify user has `role: 'admin'`

### Admin link not showing in navbar
- Make sure you're logged in as admin
- Check localStorage for user data
- Logout and login again

### Cannot create admin user
- Check MongoDB connection
- Verify `.env` file has correct `MONGODB_URI`
- Make sure backend dependencies are installed

---

## 📊 Admin Dashboard Features

### Statistics Cards
- **Total Orders**: All orders in system
- **Pending Orders**: Orders awaiting confirmation
- **Completed Orders**: Finished orders

### Orders Table
- Order number
- Customer name and phone
- Temple name
- Number of items
- Total running feet
- Current status
- Order date
- View/Edit actions

### Order Details Modal
- Full customer information
- Complete item list with dimensions
- Running feet calculations
- Status update dropdown
- Additional notes

---

## 🔒 Security Best Practices

### Professional Admin Setup (Like Real Websites):
1. ✅ **Hidden Access** - No public links to admin portal
2. ✅ **Direct URL Only** - Admin must know the exact URL
3. ✅ **Separate Authentication** - Admin login is independent from user login
4. ✅ **Role Validation** - System verifies admin role on every request
5. ✅ **Secure Credentials** - Passwords are hashed with bcrypt

### Recommended Security Measures:
- 📌 **Bookmark the admin URL** - Don't share it publicly
- 🔑 **Change default password** - Update admin credentials after first login
- 🚫 **Don't share credentials** - Keep admin access restricted
- 📱 **Use strong passwords** - Minimum 8 characters with special characters
- 🔄 **Regular password updates** - Change admin password periodically

---

## 🔐 Changing Admin Password

### Method 1: Via MongoDB Atlas
1. Go to https://cloud.mongodb.com
2. Browse Collections → `vktn-granites` → `users`
3. Find admin user
4. Update password field (will be hashed on next login)

### Method 2: Via API (Future Enhancement)
- Add password change endpoint
- Implement in admin settings page

---

## 📝 Production Deployment

### Before Deploying:
1. ✅ Create admin user locally
2. ✅ Test admin login
3. ✅ Test order management
4. ✅ Verify role-based access

### After Deploying:
1. Run `npm run create-admin` on production server OR
2. Manually create admin user in MongoDB Atlas:
   ```json
   {
     "name": "Admin",
     "email": "admin@vktngranites.com",
     "password": "$2a$10$...", // Use bcrypt to hash "admin123"
     "role": "admin",
     "phone": "+91 9876543210",
     "address": "VKTN Granites Head Office"
   }
   ```

---

## 🎯 Quick Reference

| Feature | URL | Access |
|---------|-----|--------|
| Admin Login | `/admin-login` | Public |
| Admin Dashboard | `/admin` | Admin Only |
| Place Order | `/place-order` | Logged-in Users |
| My Orders | `/my-orders` | Logged-in Users |
| User Login | `/login` | Public |
| Register | `/register` | Public |

---

## 📞 Support

For issues or questions:
- Email: info@vktngranites.com
- Phone: +91 9876543210

---

**Last Updated**: December 2025  
**Version**: 1.0.0 with Admin System
