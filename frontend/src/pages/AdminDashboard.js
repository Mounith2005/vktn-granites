import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from '../api/axios';
import { Package, Clock, CheckCircle, XCircle, Eye, Edit, Calendar } from 'lucide-react';
import { formatDimension } from '../utils/unitConverter';
import './AdminDashboard.css';

function AdminDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0
  });
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [statusUpdate, setStatusUpdate] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('');

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
      return;
    }
    fetchOrders();
    fetchStats();
  }, [user, navigate]);

  const fetchOrders = async () => {
    try {
      const response = await axios.get('/api/orders');
      setOrders(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await axios.get('/api/orders/stats/summary');
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setStatusUpdate(order.status);
    // Format delivery date for input (YYYY-MM-DD)
    if (order.deliveryDate) {
      const date = new Date(order.deliveryDate);
      setDeliveryDate(date.toISOString().split('T')[0]);
    } else {
      setDeliveryDate('');
    }
    setShowModal(true);
  };

  const handleUpdateStatus = async () => {
    try {
      const updateData = {
        status: statusUpdate
      };
      
      if (deliveryDate) {
        updateData.deliveryDate = deliveryDate;
      }
      
      await axios.put(`/api/orders/${selectedOrder._id}/status`, updateData);
      setShowModal(false);
      fetchOrders();
      fetchStats();
    } catch (error) {
      console.error('Error updating order:', error);
      alert('Failed to update order status');
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: { color: '#ffc107', icon: Clock, text: 'Pending' },
      confirmed: { color: '#17a2b8', icon: CheckCircle, text: 'Confirmed' },
      processing: { color: '#007bff', icon: Package, text: 'Processing' },
      completed: { color: '#28a745', icon: CheckCircle, text: 'Completed' },
      cancelled: { color: '#dc3545', icon: XCircle, text: 'Cancelled' }
    };
    const badge = badges[status] || badges.pending;
    const Icon = badge.icon;
    
    return (
      <span className="status-badge" style={{ background: badge.color }}>
        <Icon size={14} />
        {badge.text}
      </span>
    );
  };

  if (!user || user.role !== 'admin') {
    return null;
  }

  return (
    <div className="admin-dashboard">
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1>Admin Dashboard</h1>
          <p>Manage temple granite orders</p>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon" style={{ background: '#007bff' }}>
              <Package size={32} />
            </div>
            <div className="stat-info">
              <h3>{stats.totalOrders}</h3>
              <p>Total Orders</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ background: '#ffc107' }}>
              <Clock size={32} />
            </div>
            <div className="stat-info">
              <h3>{stats.pendingOrders}</h3>
              <p>Pending Orders</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ background: '#28a745' }}>
              <CheckCircle size={32} />
            </div>
            <div className="stat-info">
              <h3>{stats.completedOrders}</h3>
              <p>Completed Orders</p>
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="orders-section">
          <h2>All Orders</h2>
          
          {loading ? (
            <div className="loading">Loading orders...</div>
          ) : orders.length === 0 ? (
            <div className="no-orders">
              <Package size={48} />
              <p>No orders yet</p>
            </div>
          ) : (
            <div className="orders-table">
              <table>
                <thead>
                  <tr>
                    <th>Order #</th>
                    <th>Customer</th>
                    <th>Temple Name</th>
                    <th>Items</th>
                    <th>Total Running Feet</th>
                    <th>Status</th>
                    <th>Order Date</th>
                    <th>Delivery Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order._id}>
                      <td className="order-number">{order.orderNumber}</td>
                      <td>
                        <div className="customer-info">
                          <strong>{order.customerName}</strong>
                          <small>{order.customerPhone}</small>
                        </div>
                      </td>
                      <td>{order.templeName}</td>
                      <td>{order.items.length} items</td>
                      <td className="running-feet">{order.totalRunningFeet} ft</td>
                      <td>{getStatusBadge(order.status)}</td>
                      <td>{new Date(order.orderDate).toLocaleDateString()}</td>
                      <td>
                        {order.deliveryDate ? (
                          <span className="delivery-date">
                            <Calendar size={14} />
                            {new Date(order.deliveryDate).toLocaleDateString()}
                          </span>
                        ) : (
                          <span className="no-delivery-date">Not set</span>
                        )}
                      </td>
                      <td>
                        <button
                          onClick={() => handleViewOrder(order)}
                          className="btn-action btn-view"
                        >
                          <Eye size={16} />
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Order Details Modal */}
      {showModal && selectedOrder && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Order Details - {selectedOrder.orderNumber}</h2>
              <button onClick={() => setShowModal(false)} className="btn-close">×</button>
            </div>

            <div className="modal-body">
              {/* Customer Info */}
              <div className="detail-section">
                <h3>Customer Information</h3>
                <div className="detail-grid">
                  <div><strong>Name:</strong> {selectedOrder.customerName}</div>
                  <div><strong>Phone:</strong> {selectedOrder.customerPhone}</div>
                  <div><strong>Address:</strong> {selectedOrder.customerAddress}</div>
                  <div><strong>Temple:</strong> {selectedOrder.templeName}</div>
                </div>
              </div>

              {/* Order Items */}
              <div className="detail-section">
                <h3>Order Items</h3>
                <div className="items-detail-table">
                  <table>
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Item Name</th>
                        <th>Tamil Name</th>
                        <th>Length</th>
                        <th>Width</th>
                        <th>Running Feet</th>
                        <th>Notes</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedOrder.items.map((item, index) => {
                        const lengthUnit = item.lengthUnit || 'in';
                        const widthUnit = item.widthUnit || 'in';
                        return (
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{item.itemName}</td>
                            <td>{item.itemNameTamil || '-'}</td>
                            <td>{formatDimension(item.length, lengthUnit)}</td>
                            <td>{formatDimension(item.width, widthUnit)}</td>
                            <td>{item.runningFeet.toFixed(2)} ft</td>
                            <td>{item.notes || '-'}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                  <div className="items-total">
                    <strong>Total Running Feet: {selectedOrder.totalRunningFeet}</strong>
                  </div>
                </div>
              </div>

              {/* Order Status & Delivery Date */}
              <div className="detail-section">
                <h3>Order Status & Delivery Date</h3>
                <div className="status-info">
                  <div className="info-item">
                    <strong>Current Status:</strong>
                    {getStatusBadge(selectedOrder.status)}
                  </div>
                  {selectedOrder.deliveryDate && (
                    <div className="info-item">
                      <strong>Delivery Date:</strong>
                      <span className="delivery-date-display">
                        <Calendar size={16} />
                        {new Date(selectedOrder.deliveryDate).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                  )}
                </div>
                
                <div className="update-section">
                  <div className="update-group">
                    <label>
                      <Edit size={16} />
                      Update Status
                    </label>
                    <select
                      value={statusUpdate}
                      onChange={(e) => setStatusUpdate(e.target.value)}
                      className="status-select"
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="processing">Processing</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                  
                  <div className="update-group">
                    <label>
                      <Calendar size={16} />
                      Delivery Date
                    </label>
                    <input
                      type="date"
                      value={deliveryDate}
                      onChange={(e) => setDeliveryDate(e.target.value)}
                      className="date-input"
                      min={new Date().toISOString().split('T')[0]}
                    />
                    {deliveryDate && (
                      <button
                        type="button"
                        onClick={() => setDeliveryDate('')}
                        className="btn-clear-date"
                        title="Clear delivery date"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                  
                  <button onClick={handleUpdateStatus} className="btn btn-gold btn-update">
                    <Edit size={16} />
                    Update Order
                  </button>
                </div>
              </div>

              {selectedOrder.notes && (
                <div className="detail-section">
                  <h3>Additional Notes</h3>
                  <p>{selectedOrder.notes}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
