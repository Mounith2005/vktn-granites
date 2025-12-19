import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from '../api/axios';
import { Package, Clock, CheckCircle, XCircle, Eye, ShoppingCart, Calendar } from 'lucide-react';
import { formatDimension } from '../utils/unitConverter';
import './MyOrders.css';

function MyOrders() {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchOrders();
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

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
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

  if (!user) {
    return null;
  }

  return (
    <div className="my-orders-page">
      <div className="orders-container">
        <div className="page-header">
          <ShoppingCart size={40} />
          <h1>My Orders</h1>
          <p>View and track your temple granite orders</p>
        </div>

        <div className="orders-actions">
          <button onClick={() => navigate('/place-order')} className="btn btn-gold">
            <Package size={18} />
            Place New Order
          </button>
        </div>

        {loading ? (
          <div className="loading">Loading your orders...</div>
        ) : orders.length === 0 ? (
          <div className="no-orders">
            <Package size={64} />
            <h2>No Orders Yet</h2>
            <p>You haven't placed any orders yet. Start by placing your first order!</p>
            <button onClick={() => navigate('/place-order')} className="btn btn-gold">
              Place Your First Order
            </button>
          </div>
        ) : (
          <div className="orders-grid">
            {orders.map((order) => (
              <div key={order._id} className="order-card">
                <div className="order-header">
                  <div className="order-number">
                    <strong>Order #{order.orderNumber}</strong>
                    <span className="order-date">
                      {new Date(order.orderDate).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                  {getStatusBadge(order.status)}
                </div>

                <div className="order-body">
                  <div className="order-info">
                    <div className="info-item">
                      <strong>Temple:</strong>
                      <span>{order.templeName}</span>
                    </div>
                    <div className="info-item">
                      <strong>Items:</strong>
                      <span>{order.items.length} items</span>
                    </div>
                    <div className="info-item">
                      <strong>Total Running Feet:</strong>
                      <span className="running-feet">{order.totalRunningFeet} ft</span>
                    </div>
                    {order.deliveryDate && (
                      <div className="info-item delivery-date-item">
                        <strong>Delivery Date:</strong>
                        <span className="delivery-date-badge">
                          <Calendar size={14} />
                          {new Date(order.deliveryDate).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="order-items-preview">
                    <strong>Items:</strong>
                    <ul>
                      {order.items.slice(0, 3).map((item, index) => {
                        const lengthUnit = item.lengthUnit || 'in';
                        const widthUnit = item.widthUnit || 'in';
                        return (
                          <li key={index}>
                            {item.itemName} ({formatDimension(item.length, lengthUnit)} × {formatDimension(item.width, widthUnit)}) - {item.runningFeet.toFixed(2)} ft
                          </li>
                        );
                      })}
                      {order.items.length > 3 && (
                        <li className="more-items">+ {order.items.length - 3} more items</li>
                      )}
                    </ul>
                  </div>
                </div>

                <div className="order-footer">
                  <button onClick={() => handleViewOrder(order)} className="btn btn-view">
                    <Eye size={16} />
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {showModal && selectedOrder && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h2>Order #{selectedOrder.orderNumber}</h2>
                <span className="modal-date">
                  Placed on {new Date(selectedOrder.orderDate).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                </span>
              </div>
              <button onClick={() => setShowModal(false)} className="btn-close">×</button>
            </div>

            <div className="modal-body">
              <div className="status-section">
                <h3>Order Status</h3>
                <div className="status-info">
                  {getStatusBadge(selectedOrder.status)}
                  {selectedOrder.deliveryDate && (
                    <div className="delivery-date-info">
                      <Calendar size={18} />
                      <div>
                        <strong>Expected Delivery Date:</strong>
                        <span className="delivery-date-value">
                          {new Date(selectedOrder.deliveryDate).toLocaleDateString('en-IN', {
                            weekday: 'long',
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                          })}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="detail-section">
                <h3>Customer Information</h3>
                <div className="detail-grid">
                  <div><strong>Name:</strong> {selectedOrder.customerName}</div>
                  <div><strong>Phone:</strong> {selectedOrder.customerPhone}</div>
                  <div><strong>Address:</strong> {selectedOrder.customerAddress}</div>
                  <div><strong>Temple:</strong> {selectedOrder.templeName}</div>
                </div>
              </div>

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

              {selectedOrder.notes && (
                <div className="detail-section">
                  <h3>Additional Notes</h3>
                  <p className="notes-text">{selectedOrder.notes}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MyOrders;
