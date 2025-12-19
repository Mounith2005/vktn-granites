import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from '../api/axios';
import { Plus, Trash2, ShoppingCart, AlertCircle, Copy, Layers } from 'lucide-react';
import { UNITS, calculateRunningFeet } from '../utils/unitConverter';
import './PlaceOrder.css';

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

  const [items, setItems] = useState([
    { 
      itemName: '', 
      itemNameTamil: '', 
      length: '', 
      width: '', 
      lengthUnit: UNITS.INCHES,
      widthUnit: UNITS.INCHES,
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
    
    // Auto-calculate running feet when length or width changes
    if (field === 'length' || field === 'width' || field === 'lengthUnit' || field === 'widthUnit') {
      const item = newItems[index];
      if (item.length && item.width) {
        item.runningFeet = calculateRunningFeet(
          item.length, 
          item.lengthUnit || UNITS.INCHES,
          item.width, 
          item.widthUnit || UNITS.INCHES
        );
      } else {
        item.runningFeet = 0;
      }
    }
    
    setItems(newItems);
  };

  const addItem = () => {
    setItems([...items, { 
      itemName: '', 
      itemNameTamil: '', 
      length: '', 
      width: '', 
      lengthUnit: UNITS.INCHES,
      widthUnit: UNITS.INCHES,
      runningFeet: 0, 
      notes: '' 
    }]);
  };

  const addMultipleItems = (count = 5) => {
    const newItems = Array(count).fill(null).map(() => ({
      itemName: '', 
      itemNameTamil: '', 
      length: '', 
      width: '', 
      lengthUnit: UNITS.INCHES,
      widthUnit: UNITS.INCHES,
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

  const calculateTotalRunningFeet = () => {
    return items.reduce((sum, item) => sum + (parseFloat(item.runningFeet) || 0), 0);
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
      item.itemName.trim() && item.length.trim() && item.width.trim() && item.runningFeet > 0
    );

    if (validItems.length === 0) {
      setError('Please add at least one valid item');
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
                  <span className="col-item-tamil">Item (Tamil)</span>
                  <span className="col-dimension">Length</span>
                  <span className="col-dimension">Width</span>
                  <span className="col-running">Running Feet</span>
                  <span className="col-notes">Notes</span>
                  <span className="col-action">Actions</span>
                </div>

              {items.map((item, index) => (
                <div key={index} className="table-row">
                  <span className="col-sno">{index + 1}</span>
                  <input
                    type="text"
                    className="col-item"
                    placeholder="Item name"
                    value={item.itemName}
                    onChange={(e) => handleItemChange(index, 'itemName', e.target.value)}
                  />
                  <input
                    type="text"
                    className="col-item-tamil"
                    placeholder="பெயர்"
                    value={item.itemNameTamil}
                    onChange={(e) => handleItemChange(index, 'itemNameTamil', e.target.value)}
                  />
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

            <div className="total-section">
              <div className="total-info">
                <span><strong>{items.length}</strong> {items.length === 1 ? 'item' : 'items'}</span>
                <span><strong>Total Running Feet: {calculateTotalRunningFeet().toFixed(2)}</strong></span>
              </div>
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
