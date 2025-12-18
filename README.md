# VKTN Granites - Premium Granite Company Website

A full-stack web application for VKTN Granites, featuring a modern React frontend and Express.js backend with MongoDB Atlas database integration.

## 🌟 Features

- **User Authentication**: Secure login and registration with JWT tokens
- **Modern UI/UX**: Beautiful, responsive design with smooth animations
- **Product Catalog**: Browse and filter granite products by category
- **Contact System**: Submit inquiries that are stored in MongoDB
- **User Profiles**: Manage user information and preferences
- **MongoDB Atlas Integration**: Cloud database for scalable data storage
- **RESTful API**: Well-structured backend with Express.js
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices

## 📁 Project Structure

```
granite-company/
├── backend/
│   ├── models/
│   │   ├── Product.js          # Product schema
│   │   ├── Inquiry.js          # Inquiry schema
│   │   └── User.js             # User schema
│   ├── routes/
│   │   ├── products.js         # Product routes
│   │   ├── inquiries.js        # Inquiry routes
│   │   └── auth.js             # Authentication routes
│   ├── middleware/
│   │   └── auth.js             # JWT authentication middleware
│   └── server.js               # Express server
├── frontend/
│   ├── public/
│   │   └── index.html
│   └── src/
│       ├── components/
│       │   ├── Navbar.js       # Navigation component
│       │   └── Footer.js       # Footer component
│       ├── context/
│       │   └── AuthContext.js  # Authentication context
│       ├── pages/
│       │   ├── Home.js         # Homepage
│       │   ├── Products.js     # Products page
│       │   ├── About.js        # About page
│       │   ├── Contact.js      # Contact page
│       │   ├── Login.js        # Login page
│       │   └── Register.js     # Registration page
│       ├── App.js
│       └── index.js
├── package.json
├── .env.example
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MongoDB Atlas account (free tier available)

### MongoDB Atlas Setup

1. **Create a MongoDB Atlas Account**
   - Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Sign up for a free account

2. **Create a Cluster**
   - Click "Build a Database"
   - Choose the FREE tier (M0)
   - Select your preferred cloud provider and region
   - Click "Create Cluster"

3. **Create Database User**
   - Go to "Database Access" in the left sidebar
   - Click "Add New Database User"
   - Choose "Password" authentication
   - Create a username and password (save these!)
   - Set user privileges to "Read and write to any database"

4. **Configure Network Access**
   - Go to "Network Access" in the left sidebar
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (for development)
   - Click "Confirm"

5. **Get Connection String**
   - Go to "Database" in the left sidebar
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - It looks like: `mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/`

### Installation

1. **Clone or navigate to the project directory**
   ```bash
   cd "f:/SEM 6/granite company"
   ```

2. **Install backend dependencies**
   ```bash
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd frontend
   npm install
   cd ..
   ```

4. **Configure Environment Variables**
   - Copy `.env.example` to `.env`
   ```bash
   copy .env.example .env
   ```
   
   - Edit `.env` and add your MongoDB Atlas connection string:
   ```
   MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/temple-granites?retryWrites=true&w=majority
   PORT=5000
   NODE_ENV=development
   ```
   
   **Important**: Replace `<username>` and `<password>` with your actual MongoDB Atlas credentials!

### Running the Application

#### Option 1: Run Backend and Frontend Separately

**Terminal 1 - Backend:**
```bash
npm start
```
The backend will run on `http://localhost:5000`

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```
The frontend will run on `http://localhost:3000`

#### Option 2: Development Mode with Auto-Reload

**Backend (with nodemon):**
```bash
npm run dev
```

**Frontend:**
```bash
npm run client
```

## 📊 Database Schema

### Product Schema
```javascript
{
  name: String,
  category: String,
  description: String,
  color: String,
  origin: String,
  price: Number,
  priceUnit: String,
  imageUrl: String,
  specifications: {
    thickness: String,
    finish: String,
    density: String,
    waterAbsorption: String
  },
  inStock: Boolean,
  featured: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Inquiry Schema
```javascript
{
  name: String,
  email: String,
  phone: String,
  subject: String,
  message: String,
  productInterest: String,
  status: String,
  createdAt: Date
}
```

## 🔌 API Endpoints

### Products
- `GET /api/products` - Get all products
- `GET /api/products?category=Temple Granite` - Filter by category
- `GET /api/products?featured=true` - Get featured products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create new product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### Inquiries
- `GET /api/inquiries` - Get all inquiries
- `GET /api/inquiries/:id` - Get single inquiry
- `POST /api/inquiries` - Create new inquiry
- `PATCH /api/inquiries/:id/status` - Update inquiry status
- `DELETE /api/inquiries/:id` - Delete inquiry

### Health Check
- `GET /api/health` - Check API and database status

## 🎨 Adding Sample Products

You can add products using the API. Here's an example using curl or Postman:

```bash
curl -X POST http://localhost:5000/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Premium Black Granite",
    "category": "Temple Granite",
    "description": "High-quality black granite perfect for temple construction",
    "color": "Black",
    "origin": "India",
    "price": 150,
    "priceUnit": "per sq ft",
    "imageUrl": "https://images.unsplash.com/photo-1615971677499-5467cbab01c0?w=800",
    "specifications": {
      "thickness": "20mm",
      "finish": "Polished",
      "density": "2.7 g/cm³",
      "waterAbsorption": "< 0.4%"
    },
    "inStock": true,
    "featured": true
  }'
```

## 🛠️ Technologies Used

### Backend
- **Express.js** - Web framework
- **MongoDB & Mongoose** - Database and ODM
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variables
- **body-parser** - Request body parsing

### Frontend
- **React** - UI library
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Lucide React** - Icon library
- **CSS3** - Styling with modern features

## 🌐 Deployment

### Backend Deployment (Heroku/Railway/Render)
1. Push code to GitHub
2. Connect to your deployment platform
3. Add environment variables (MONGODB_URI, PORT)
4. Deploy

### Frontend Deployment (Vercel/Netlify)
1. Build the frontend: `cd frontend && npm run build`
2. Deploy the `build` folder
3. Configure API URL in production

## 📝 Environment Variables

Create a `.env` file in the root directory:

```env
MONGODB_URI=your_mongodb_atlas_connection_string
PORT=5000
NODE_ENV=development
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the ISC License.

## 📧 Contact

For any queries, please contact:
- Email: info@templegranites.com
- Phone: +91 98765 43210

## 🎯 Future Enhancements

- [ ] Admin dashboard for managing products
- [ ] User authentication and authorization
- [ ] Image upload functionality
- [ ] Payment gateway integration
- [ ] Order management system
- [ ] Email notifications
- [ ] Product reviews and ratings
- [ ] Advanced search and filters
- [ ] Multi-language support

---

**Made with ❤️ for Temple Granites**
