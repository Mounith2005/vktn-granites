import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from '../api/axios';
import { Plus, Trash2, ShoppingCart, AlertCircle, Copy, Layers } from 'lucide-react';
import { UNITS } from '../utils/unitConverter';
import './PlaceOrder.css';

// Common granite item names for dropdown
const GRANITE_ITEMS = [
  'பலகை',
  'உத்திரம் ',
  'கபோதகம்',
  'யாழன்',
  'உள்வரி',
  'பெரிய உத்திரம்',
  'கதவாடி கல்',
  'கோன் வட்டம்',
  'பாவுகள்',
  'சுருள் படி',
  'படி',
  'கோமுதை',
  'தளவரிசை',
];

// Interactive 3D Box Component
function Box3D({ length, width, height, rotateX, rotateY }) {
  const scale = 20; // Exact 1:1 scale for actual dimensions
  const L = length * scale;
  const W = width * scale;
  const H = height * scale;
  const startX = 100; // Center position for exact size
  const startY = 400;

  return (
    <svg width="900" height="900">
      <g
        transform={`
          rotate(${rotateY}, 500, 350)
          rotate(${rotateX}, 500, 350)
        `}
      >
        {/* Front face */}
        <rect
          x={startX}
          y={startY - H}
          width={L}
          height={H}
          fill="#2ae216"
          stroke="black"
          strokeWidth="2"
        />
        {/* Top face */}
        <polygon
          points={`
            ${startX},${startY - H}
            ${startX + W},${startY - H - W}
            ${startX + L + W},${startY - H - W}
            ${startX + L},${startY - H}
          `}
          fill="#2ae216"
          stroke="black"
          strokeWidth="2"
        />
        {/* Side face */}
        <polygon
          points={`
            ${startX + L},${startY - H}
            ${startX + L + W},${startY - H - W}
            ${startX + L + W},${startY - W}
            ${startX + L},${startY}
          `}
          fill="#738271"
          stroke="black"
          strokeWidth="2"
        />
      </g>
    </svg>
  );
}

function PlaceOrder() {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    customerName: user?.name || '',
    customerPhone: user?.phone || '',
    customerAddress: user?.address || '',
    templeName: '',
    notes: ''
  });

  // 3D Box rotation state
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [lastX, setLastX] = useState(0);
  const [lastY, setLastY] = useState(0);

  // Mouse interaction handlers for 3D rotation
  const handleMouseDown = (e) => {
    setDragging(true);
    setLastX(e.clientX);
    setLastY(e.clientY);
  };

  const handleMouseUp = () => {
    setDragging(false);
  };

  const handleMouseMove = (e) => {
    if (!dragging) return;
    const dx = e.clientX - lastX;
    const dy = e.clientY - lastY;
    setRotateY(prev => prev + dx * 0.5);
    setRotateX(prev => prev + dy * 0.5);
    setLastX(e.clientX);
    setLastY(e.clientY);
  };

  const [items, setItems] = useState([
    { 
      itemName: '', 
      length: '', 
      width: '', 
      height: '',
      lengthUnit: UNITS.INCHES,
      widthUnit: UNITS.INCHES,
      heightUnit: UNITS.INCHES,
      runningFeet: 0, 
      notes: '' 
    }
  ]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  };

  const addItem = () => {
    setItems([...items, { 
      itemName: '', 
      length: '', 
      width: '', 
      height: '',
      lengthUnit: UNITS.INCHES,
      widthUnit: UNITS.INCHES,
      heightUnit: UNITS.INCHES,
      runningFeet: 0, 
      notes: '' 
    }]);
  };

  const addMultipleItems = (count = 5) => {
    const newItems = Array(count).fill(null).map(() => ({
      itemName: '', 
      length: '', 
      width: '', 
      height: '',
      lengthUnit: UNITS.INCHES,
      widthUnit: UNITS.INCHES,
      heightUnit: UNITS.INCHES,
      runningFeet: 0, 
      notes: '' 
    }));
    setItems([...items, ...newItems]);
  };

  const duplicateItem = (index) => {
    const itemToDuplicate = items[index];
    const newItem = {
      ...itemToDuplicate,
      itemName: `${itemToDuplicate.itemName} (Copy)`,
      runningFeet: itemToDuplicate.runningFeet || 0
    };
    const newItems = [...items];
    newItems.splice(index + 1, 0, newItem);
    setItems(newItems);
  };

  const removeItem = (index) => {
    if (items.length > 1) {
      const newItems = items.filter((_, i) => i !== index);
      setItems(newItems);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Validation
    if (!formData.templeName.trim()) {
      setError('Temple name is required');
      setLoading(false);
      return;
    }

    const validItems = items.filter(item => 
      item.itemName.trim() && item.width.trim() && 
      (item.length.trim() || item.runningFeet > 0)
    );

    if (validItems.length === 0) {
      setError('Please add at least one valid item');
      setLoading(false);
      return;
    }

    // Check if any item has both length and running feet
    const conflictingItems = validItems.filter(item => item.length.trim() && item.runningFeet > 0);
    if (conflictingItems.length > 0) {
      setError('Some items have both length and running feet. Please provide only one measurement method.');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post('/api/orders', {
        ...formData,
        items: validItems
      });

      setSuccess(`Order placed successfully! Order Number: ${response.data.order.orderNumber}`);
      
      // Reset form
      setTimeout(() => {
        navigate('/my-orders');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="place-order-page">
        <div className="auth-required">
          <AlertCircle size={48} />
          <h2>Login Required</h2>
          <p>Please login to place an order</p>
          <button onClick={() => navigate('/login')} className="btn btn-gold">
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="place-order-page">
      <div className="place-order-container">
        <div className="page-header">
          <ShoppingCart size={40} />
          <h1>Place Temple Granite Order</h1>
          <p>Fill in the details below to place your order</p>
        </div>

        {error && (
          <div className="alert alert-error">
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="alert alert-success">
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="order-form">
          {/* Customer Details */}
          <div className="form-section">
            <h3>Customer Details</h3>
            <div className="form-row">
              <div className="form-group">
                <label>Customer Name *</label>
                <input
                  type="text"
                  name="customerName"
                  value={formData.customerName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Phone Number *</label>
                <input
                  type="tel"
                  name="customerPhone"
                  value={formData.customerPhone}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Address *</label>
              <textarea
                name="customerAddress"
                value={formData.customerAddress}
                onChange={handleInputChange}
                rows="2"
                required
              />
            </div>

            <div className="form-group">
              <label>Temple Name *</label>
              <input
                type="text"
                name="templeName"
                value={formData.templeName}
                onChange={handleInputChange}
                placeholder="Enter temple name"
                required
              />
            </div>
          </div>

          {/* Order Items */}
          <div className="form-section">
            <div className="section-header">
              <div>
                <h3>Order Items</h3>
                <span className="item-count">({items.length} {items.length === 1 ? 'item' : 'items'})</span>
              </div>
              <div className="item-actions">
                <button type="button" onClick={addItem} className="btn btn-secondary">
                  <Plus size={18} />
                  Add Item
                </button>
                <button type="button" onClick={() => addMultipleItems(5)} className="btn btn-secondary">
                  <Layers size={18} />
                  Add 5 Items
                </button>
              </div>
            </div>

            <div className="items-table-container">
              <div className="items-table">
                <div className="table-header">
                  <span className="col-sno">#</span>
                  <span className="col-item">Item Name</span>
                  <span className="col-dimension">Length</span>
                  <span className="col-dimension">Width</span>
                  <span className="col-dimension">Height</span>
                  <span className="col-running">Running Feet</span>
                  <span className="col-notes">Notes</span>
                  <span className="col-action">Actions</span>
                </div>

              {items.map((item, index) => (
                <div key={index} className="table-row">
                  <span className="col-sno">{index + 1}</span>
                  <select
                    className="col-item"
                    value={item.itemName}
                    onChange={(e) => handleItemChange(index, 'itemName', e.target.value)}
                  >
                    <option value="">Select item </option>
                    {GRANITE_ITEMS.map((itemName, i) => (
                      <option key={i} value={itemName}>{itemName}</option>
                    ))}
                  </select>
                  <div className="col-dimension dimension-input-group">
                    <input
                      type="number"
                      className="dimension-input"
                      placeholder="9"
                      step="0.01"
                      value={item.length}
                      onChange={(e) => handleItemChange(index, 'length', e.target.value)}
                    />
                    <select
                      className="unit-select"
                      value={item.lengthUnit || UNITS.INCHES}
                      onChange={(e) => handleItemChange(index, 'lengthUnit', e.target.value)}
                    >
                      <option value={UNITS.INCHES}>in</option>
                      <option value={UNITS.FEET}>ft</option>
                      <option value={UNITS.CENTIMETER}>cm</option>
                      <option value={UNITS.METER}>m</option>
                    </select>
                  </div>
                  <div className="col-dimension dimension-input-group">
                    <input
                      type="number"
                      className="dimension-input"
                      placeholder="15"
                      step="0.01"
                      value={item.width}
                      onChange={(e) => handleItemChange(index, 'width', e.target.value)}
                    />
                    <select
                      className="unit-select"
                      value={item.widthUnit || UNITS.INCHES}
                      onChange={(e) => handleItemChange(index, 'widthUnit', e.target.value)}
                    >
                      <option value={UNITS.INCHES}>in</option>
                      <option value={UNITS.FEET}>ft</option>
                      <option value={UNITS.CENTIMETER}>cm</option>
                      <option value={UNITS.METER}>m</option>
                    </select>
                  </div>
                  <div className="col-dimension dimension-input-group">
                    <input
                      type="number"
                      className="dimension-input"
                      placeholder="15"
                      step="0.01"
                      value={item.height}
                      onChange={(e) => handleItemChange(index, 'height', e.target.value)}
                    />
                    <select
                      className="unit-select"
                      value={item.heightUnit || UNITS.INCHES}
                      onChange={(e) => handleItemChange(index, 'heightUnit', e.target.value)}
                    >
                      <option value={UNITS.INCHES}>in</option>
                      <option value={UNITS.FEET}>ft</option>
                      <option value={UNITS.CENTIMETER}>cm</option>
                      <option value={UNITS.METER}>m</option>
                    </select>
                  </div>
                  <input
                    type="number"
                    className="col-running"
                    placeholder="20"
                    step="0.1"
                    value={item.runningFeet}
                    onChange={(e) => handleItemChange(index, 'runningFeet', e.target.value)}
                  />
                  <input
                    type="text"
                    className="col-notes"
                    placeholder="Notes"
                    value={item.notes}
                    onChange={(e) => handleItemChange(index, 'notes', e.target.value)}
                  />
                  <div className="col-action action-buttons">
                    <button
                      type="button"
                      className="btn-action btn-duplicate"
                      onClick={() => duplicateItem(index)}
                      title="Duplicate this item"
                    >
                      <Copy size={16} />
                    </button>
                    <button
                      type="button"
                      className="btn-action btn-remove"
                      onClick={() => removeItem(index)}
                      disabled={items.length === 1}
                      title="Remove this item"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
              </div>
            </div>

          {/* 3D Item Visualization */}
          <div 
            className="form-section"
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
            style={{ cursor: dragging ? 'grabbing' : 'grab' }}
          >
            <h3>3D Item Visualization (Drag to Rotate)</h3>
            <div className="form-group" style={{ textAlign: 'center', minHeight: '720px' }}>
              {items.map((item, index) => {
                const length = parseFloat(item.length) || 0;
                const width = parseFloat(item.width) || 0;
                const height = parseFloat(item.height) || 0;
                
                if (length > 0 && width > 0 && height > 0) {
                  return (
                    <div key={index} style={{ marginBottom: '20px' }}>
                      <h4>Item {index + 1}: {item.itemName || 'Unnamed'}</h4>
                      <p style={{ fontSize: '14px', color: '#666', marginBottom: '10px' }}>
                        Dimensions: {length}{item.lengthUnit || 'in'} × {width}{item.widthUnit || 'in'} × {height}{item.heightUnit || 'in'}
                      </p>
                      <Box3D
                        length={length}
                        width={width}
                        height={height}
                        rotateX={rotateX}
                        rotateY={rotateY}
                      />
                    </div>
                  );
                }
                return null;
              })}
              {!items.some(item => parseFloat(item.length) > 0 && parseFloat(item.width) > 0 && parseFloat(item.height) > 0) && (
                <div style={{ padding: '40px', color: '#999' }}>
                  <p>Enter length, width, and height for any item to see 3D visualization</p>
                </div>
              )}
            </div>
          </div>

          {/* Additional Notes */}
          <div className="form-section">
            <h3>Additional Notes</h3>
            <div className="form-group">
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                rows="3"
                placeholder="Any special instructions or requirements..."
              />
            </div>
          </div>
          </div>

          <div className="form-actions">
            <button type="button" onClick={() => navigate('/')} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-gold" disabled={loading}>
              {loading ? 'Placing Order...' : 'Place Order'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default PlaceOrder;
