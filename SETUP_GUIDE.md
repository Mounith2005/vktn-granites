# VKTN Granites - Quick Setup Guide

## ✅ What's Been Completed

### 1. **Company Rebranding**
- Changed from "Temple Granites" to "VKTN Granites" throughout the application
- Updated all pages, components, and documentation

### 2. **User Authentication System**
- ✅ User registration and login functionality
- ✅ JWT token-based authentication
- ✅ Password hashing with bcryptjs
- ✅ Protected routes and middleware
- ✅ User profile management
- ✅ Login/Logout functionality in navbar

### 3. **Backend Features**
- **User Model**: Complete user schema with authentication
- **Auth Routes**: `/api/auth/register`, `/api/auth/login`, `/api/auth/me`, `/api/auth/profile`
- **Middleware**: JWT verification and admin-only access
- **Security**: Password hashing, token generation, secure authentication

### 4. **Frontend Features**
- **Login Page**: `/login` - User authentication
- **Register Page**: `/register` - New user registration
- **Auth Context**: Global authentication state management
- **Protected UI**: Dynamic navbar showing user info and logout
- **Beautiful UI**: Modern, responsive design with animations

## 🚀 How to Run the Project

### Step 1: Install Dependencies (Already Done ✅)
```bash
# Backend dependencies installed
# Frontend dependencies installed
# Auth packages (bcryptjs, jsonwebtoken) installed
```

### Step 2: Configure Environment Variables
Make sure your `.env` file has:
```env
MONGODB_URI=mongodb+srv://granite:mounith2005@cluster0.ap5ps3t.mongodb.net/?appName=Cluster0
PORT=5000
NODE_ENV=development
JWT_SECRET=vktn-granites-secret-key-2024
```

### Step 3: Start the Backend Server
```bash
# In the root directory
npm start
# Server will run on http://localhost:5000
```

### Step 4: Start the Frontend Server
```bash
# In a new terminal
cd frontend
npm start
# Frontend will run on http://localhost:3000
```

## 📱 Using the Authentication System

### Register a New User
1. Go to `http://localhost:3000/register`
2. Fill in the registration form:
   - Full Name
   - Email
   - Password (min 6 characters)
   - Confirm Password
   - Phone (optional)
   - Address (optional)
3. Click "Register"
4. You'll be automatically logged in and redirected to home

### Login
1. Go to `http://localhost:3000/login`
2. Enter your email and password
3. Click "Login"
4. You'll be redirected to home with your name shown in navbar

### Logout
- Click the "Logout" button in the navbar
- You'll be logged out and redirected to home

## 🔐 API Endpoints

### Authentication Endpoints
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (requires token)
- `PUT /api/auth/profile` - Update user profile (requires token)

### Product Endpoints
- `GET /api/products` - Get all products
- `POST /api/products` - Create product (can be protected)
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### Inquiry Endpoints
- `GET /api/inquiries` - Get all inquiries
- `POST /api/inquiries` - Create inquiry
- `PATCH /api/inquiries/:id/status` - Update inquiry status

## 🎨 Pages Available

1. **Home** (`/`) - Landing page with hero, features, products
2. **Products** (`/products`) - Browse and filter granite products
3. **About** (`/about`) - Company information and values
4. **Contact** (`/contact`) - Contact form and information
5. **Login** (`/login`) - User login page
6. **Register** (`/register`) - User registration page

## 🔧 Testing the Authentication

### Test User Registration
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@vktngranites.com",
    "password": "test123",
    "phone": "+91 98765 43210"
  }'
```

### Test User Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@vktngranites.com",
    "password": "test123"
  }'
```

## 📊 Database Collections

Your MongoDB database will have:
1. **users** - User accounts with authentication
2. **products** - Granite products catalog
3. **inquiries** - Customer inquiries and messages

## 🎯 Next Steps (Optional Enhancements)

- [ ] Add admin dashboard for managing products
- [ ] Email verification for new users
- [ ] Password reset functionality
- [ ] User order history
- [ ] Product reviews and ratings
- [ ] Image upload for products
- [ ] Advanced search and filters
- [ ] Shopping cart functionality

## 💡 Tips

1. **First Time Setup**: Register a new account to test the system
2. **MongoDB**: Make sure your MongoDB Atlas connection is working
3. **Ports**: Backend on 5000, Frontend on 3000
4. **Tokens**: JWT tokens are stored in localStorage
5. **Security**: Change JWT_SECRET in production

## 🐛 Troubleshooting

### Backend won't start
- Check if port 5000 is available
- Verify MongoDB connection string in `.env`
- Make sure all dependencies are installed

### Frontend won't connect
- Check if backend is running on port 5000
- Verify proxy setting in `frontend/package.json`
- Clear browser cache and localStorage

### Authentication not working
- Check if JWT_SECRET is set in `.env`
- Verify MongoDB is connected
- Check browser console for errors

---

**Company**: VKTN Granites  
**Contact**: info@vktngranites.com  
**Version**: 1.0.0 with Authentication
