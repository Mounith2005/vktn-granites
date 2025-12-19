import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Register from './pages/Register';
import LoginSelection from './pages/LoginSelection';
import AdminLogin from './pages/AdminLogin';
import PlaceOrder from './pages/PlaceOrder';
import MyOrders from './pages/MyOrders';
import AdminDashboard from './pages/AdminDashboard';
import UserProfile from './pages/UserProfile';
import AdminProfile from './pages/AdminProfile';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login-select" element={<LoginSelection />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/admin-login" element={<AdminLogin />} />
            <Route path="/place-order" element={<PlaceOrder />} />
            <Route path="/my-orders" element={<MyOrders />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/profile" element={<UserProfile />} />
            <Route path="/admin-profile" element={<AdminProfile />} />
          </Routes>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
