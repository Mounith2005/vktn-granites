import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from '../api/axios';
import { Package, Clock, CheckCircle, XCircle, Eye, Edit, Calendar, Download, Printer } from 'lucide-react';
import { formatDimensionDisplay } from '../utils/unitConverter';
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
  const [showBillModal, setShowBillModal] = useState(false);
  const [editableBill, setEditableBill] = useState({
    items: [],
    ratePerRunningFeet: 1500,
    taxRate: 18,
    transportCharge: 0,
    discount: 0,
    notes: ''
  });

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

  const handleDownloadPDF = (order) => {
    // Create a new window for printing
    const printWindow = window.open('', '_blank');
    
    // Generate HTML content for the order
    const htmlContent = generateOrderHTML(order);
    
    // Write the HTML to the new window
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    
    // Wait for the content to load, then trigger print
    printWindow.onload = () => {
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 500);
    };
  };

  const handlePrintBill = (order) => {
    // Generate bill HTML content
    const billContent = generateBillHTML(order);
    
    // Create a temporary div to hold the bill content
    const billContainer = document.createElement('div');
    billContainer.innerHTML = billContent;
    billContainer.style.position = 'fixed';
    billContainer.style.top = '0';
    billContainer.style.left = '0';
    billContainer.style.width = '100%';
    billContainer.style.height = '100%';
    billContainer.style.backgroundColor = 'white';
    billContainer.style.zIndex = '9999';
    billContainer.style.padding = '20px';
    billContainer.style.boxSizing = 'border-box';
    
    // Add to current page
    document.body.appendChild(billContainer);
    
    // Trigger print after a short delay
    setTimeout(() => {
      window.print();
      // Remove the bill container after printing
      document.body.removeChild(billContainer);
    }, 100);
  };

  const handleEditBill = (order) => {
    // Prepare editable bill data
    const billItems = order.items.map((item, index) => ({
      id: index,
      name: item.itemName || 'Unknown Item',
      tamilName: item.itemNameTamil || '-',
      length: formatDimensionDisplay(item.length, item.lengthUnit || 'in'),
      width: formatDimensionDisplay(item.width, item.widthUnit || 'in'),
      height: formatDimensionDisplay(item.height, item.heightUnit || 'in'),
      runningFeet: item.runningFeet || 0,
      rate: 1500, // Default rate
      amount: (item.runningFeet || 0) * 1500
    }));

    setEditableBill({
      items: billItems,
      ratePerRunningFeet: 1500,
      taxRate: 18,
      transportCharge: 0,
      discount: 0,
      notes: ''
    });
    
    setSelectedOrder(order);
    setShowBillModal(true);
  };

  const handleBillItemChange = (index, field, value) => {
    const updatedItems = [...editableBill.items];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    
    // Recalculate amount if rate or running feet changed
    if (field === 'rate' || field === 'runningFeet') {
      updatedItems[index].amount = parseFloat(updatedItems[index].runningFeet || 0) * parseFloat(updatedItems[index].rate || 0);
    }
    
    setEditableBill({ ...editableBill, items: updatedItems });
  };

  const calculateBillTotals = () => {
    const subtotal = editableBill.items.reduce((sum, item) => sum + parseFloat(item.amount || 0), 0);
    const transportCharge = parseFloat(editableBill.transportCharge) || 0;
    const discount = parseFloat(editableBill.discount) || 0;
    const afterDiscount = subtotal + transportCharge - discount;
    const tax = afterDiscount * (parseFloat(editableBill.taxRate) / 100);
    const grandTotal = afterDiscount + tax;
    
    return {
      subtotal,
      transportCharge,
      discount,
      afterDiscount,
      tax,
      grandTotal
    };
  };

  const handlePrintEditableBill = () => {
    // Generate editable bill HTML content
    const billContent = generateEditableBillHTML();
    
    // Create a temporary div to hold the bill content
    const billContainer = document.createElement('div');
    billContainer.innerHTML = billContent;
    billContainer.style.position = 'fixed';
    billContainer.style.top = '0';
    billContainer.style.left = '0';
    billContainer.style.width = '100%';
    billContainer.style.height = '100%';
    billContainer.style.backgroundColor = 'white';
    billContainer.style.zIndex = '9999';
    billContainer.style.padding = '20px';
    billContainer.style.boxSizing = 'border-box';
    
    // Add to current page
    document.body.appendChild(billContainer);
    
    // Trigger print after a short delay
    setTimeout(() => {
      window.print();
      // Remove bill container after printing
      document.body.removeChild(billContainer);
    }, 100);
  };

  const generateOrderHTML = (order) => {
    const orderDate = new Date(order.orderDate).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    const deliveryDate = order.deliveryDate ? new Date(order.deliveryDate).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }) : 'Not set';

    let itemsHTML = order.items.map((item, index) => {
      const lengthUnit = item.lengthUnit || 'in';
      const widthUnit = item.widthUnit || 'in';
      const heightUnit = item.heightUnit || 'in';
      
      return `
        <tr>
          <td>${index + 1}</td>
          <td>${item.itemName || '-'}</td>
          <td>${item.itemNameTamil || '-'}</td>
          <td>${formatDimensionDisplay(item.length, lengthUnit)}</td>
          <td>${formatDimensionDisplay(item.width, widthUnit)}</td>
          <td>${formatDimensionDisplay(item.height, heightUnit)}</td>
          <td>${item.runningFeet ? item.runningFeet.toFixed(2) + ' ft' : '-'}</td>
          <td>${item.notes || '-'}</td>
        </tr>
      `;
    }).join('');

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Order ${order.orderNumber} - VKTN Granites </title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
            color: #333;
          }
          .header {
            text-align: center;
            border-bottom: 2px solid #0f3459;
            padding-bottom: 20px;
            margin-bottom: 30px;
          }
          .company-name {
            font-size: 24px;
            font-weight: bold;
            color: #0f3459;
            margin-bottom: 5px;
          }
          .order-title {
            font-size: 18px;
            color: #666;
            margin-bottom: 10px;
          }
          .order-number {
            font-size: 20px;
            font-weight: bold;
            color: #d4af37;
          }
          .section {
            margin-bottom: 30px;
          }
          .section-title {
            font-size: 16px;
            font-weight: bold;
            color: #0f3459;
            margin-bottom: 15px;
            border-bottom: 1px solid #eee;
            padding-bottom: 5px;
          }
          .info-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 10px;
            margin-bottom: 20px;
          }
          .info-item {
            padding: 8px;
            background: #f8f9fa;
            border-radius: 4px;
          }
          .info-label {
            font-weight: bold;
            color: #333;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
          }
          th {
            background: #0f3459;
            color: white;
            padding: 10px;
            text-align: left;
            font-weight: bold;
          }
          td {
            padding: 10px;
            border-bottom: 1px solid #ddd;
          }
          tr:nth-child(even) {
            background: #f8f9fa;
          }
          .summary {
            background: #f8f9fa;
            padding: 15px;
            border-radius: 4px;
            margin-top: 20px;
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
          }
          .summary-item {
            font-weight: bold;
          }
          .status-badge {
            display: inline-block;
            padding: 4px 8px;
            border-radius: 12px;
            color: white;
            font-size: 12px;
            font-weight: bold;
          }
          .status-pending { background: #ffc107; color: #333; }
          .status-confirmed { background: #17a2b8; }
          .status-processing { background: #007bff; }
          .status-completed { background: #28a745; }
          .status-cancelled { background: #dc3545; }
          .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #ddd;
            text-align: center;
            color: #666;
            font-size: 12px;
          }
          @media print {
            body { margin: 0; }
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="company-name">VKTN Granites </div>
          <div class="order-title">Order Details</div>
          <div class="order-number">Order #${order.orderNumber}</div>
        </div>

        <div class="section">
          <div class="section-title">Customer Information</div>
          <div class="info-grid">
            <div class="info-item">
              <span class="info-label">Name:</span> ${order.customerName}
            </div>
            <div class="info-item">
              <span class="info-label">Phone:</span> ${order.customerPhone}
            </div>
            <div class="info-item">
              <span class="info-label">Address:</span> ${order.customerAddress}
            </div>
            <div class="info-item">
              <span class="info-label">Temple:</span> ${order.templeName}
            </div>
            <div class="info-item">
              <span class="info-label">Order Date:</span> ${orderDate}
            </div>
            <div class="info-item">
              <span class="info-label">Delivery Date:</span> ${deliveryDate}
            </div>
          </div>
        </div>

        <div class="section">
          <div class="section-title">Order Items</div>
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Item Name</th>
                <th>Tamil Name</th>
                <th>Length</th>
                <th>Width</th>
                <th>Height</th>
                <th>Running Feet</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHTML}
            </tbody>
          </table>
          <div class="summary">
            <div class="summary-item">
              <span class="info-label">Total Items:</span> ${order.items.length}
            </div>
            <div class="summary-item">
              <span class="info-label">Total Running Feet:</span> ${order.totalRunningFeet} ft
            </div>
          </div>
        </div>

        <div class="section">
          <div class="section-title">Order Status</div>
          <div class="info-item">
            <span class="info-label">Current Status:</span> 
            <span class="status-badge status-${order.status}">${order.status.charAt(0).toUpperCase() + order.status.slice(1)}</span>
          </div>
        </div>

        ${order.notes ? `
        <div class="section">
          <div class="section-title">Additional Notes</div>
          <div class="info-item">${order.notes}</div>
        </div>
        ` : ''}

        <div class="footer">
          <p>Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
          <p>VKTN Granites - Temple Granite Orders Management System</p>
        </div>
      </body>
      </html>
    `;
  };

  const generateBillHTML = (order) => {
    const orderDate = new Date(order.orderDate).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    const deliveryDate = order.deliveryDate ? new Date(order.deliveryDate).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }) : 'Not set';

    // Calculate bill details
    const items = order.items.map((item, index) => {
      const lengthUnit = item.lengthUnit || 'in';
      const widthUnit = item.widthUnit || 'in';
      const heightUnit = item.heightUnit || 'in';
      const runningFeet = item.runningFeet || 0;
      
      // Simple pricing calculation (you can adjust rates as needed)
      const ratePerRunningFeet = 1500; // Example rate: ₹1500 per running foot
      const amount = runningFeet * ratePerRunningFeet;
      
      return {
        sno: index + 1,
        name: item.itemName || 'Unknown Item',
        tamilName: item.itemNameTamil || '-',
        length: formatDimensionDisplay(item.length, lengthUnit),
        width: formatDimensionDisplay(item.width, widthUnit),
        height: formatDimensionDisplay(item.height, heightUnit),
        runningFeet: runningFeet.toFixed(2),
        rate: ratePerRunningFeet.toFixed(2),
        amount: amount.toFixed(2)
      };
    });

    const totalRunningFeet = items.reduce((sum, item) => sum + parseFloat(item.runningFeet), 0);
    const totalAmount = items.reduce((sum, item) => sum + parseFloat(item.amount), 0);
    const tax = totalAmount * 0.18; // 18% GST
    const grandTotal = totalAmount + tax;

    let itemsHTML = items.map(item => `
      <tr>
        <td>${item.sno}</td>
        <td>${item.name}</td>
        <td style="text-align: center;">${item.length}</td>
        <td style="text-align: center;">${item.width}</td>
        <td style="text-align: center;">${item.height}</td>
        <td style="text-align: center;">${item.runningFeet} ft</td>
        <td style="text-align: right;">₹${item.rate}</td>
        <td style="text-align: right;">₹${item.amount}</td>
      </tr>
    `).join('');

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <title>BILL - Order ${order.orderNumber} - VKTN Granites</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
            color: #333;
            line-height: 1.4;
          }
          .bill-header {
            text-align: center;
            border-bottom: 3px double #0f3459;
            padding-bottom: 20px;
            margin-bottom: 30px;
          }
          .company-name {
            font-size: 28px;
            font-weight: bold;
            color: #0f3459;
            margin-bottom: 5px;
          }
          .company-address {
            font-size: 14px;
            color: #666;
            margin-bottom: 10px;
          }
          .bill-title {
            font-size: 20px;
            font-weight: bold;
            color: #d4af37;
            margin-bottom: 5px;
          }
          .bill-number {
            font-size: 16px;
            color: #333;
          }
          .billing-info {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin-bottom: 30px;
          }
          .customer-info, .order-info {
            background: #f8f9fa;
            padding: 15px;
            border-radius: 5px;
            border: 1px solid #ddd;
          }
          .section-title {
            font-size: 16px;
            font-weight: bold;
            color: #0f3459;
            margin-bottom: 10px;
            border-bottom: 1px solid #0f3459;
            padding-bottom: 5px;
          }
          .info-row {
            margin-bottom: 5px;
            display: flex;
            justify-content: space-between;
          }
          .info-label {
            font-weight: bold;
            color: #333;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
          }
          th {
            background: #0f3459;
            color: white;
            padding: 12px 8px;
            text-align: left;
            font-weight: bold;
            font-size: 14px;
          }
          td {
            padding: 10px 8px;
            border-bottom: 1px solid #ddd;
            font-size: 13px;
          }
          tr:nth-child(even) {
            background: #f8f9fa;
          }
          .totals-section {
            margin-top: 20px;
            float: right;
            width: 300px;
          }
          .total-row {
            display: flex;
            justify-content: space-between;
            padding: 8px 15px;
            background: #f8f9fa;
            border: 1px solid #ddd;
            margin-bottom: 2px;
          }
          .grand-total {
            background: #0f3459;
            color: white;
            font-weight: bold;
            font-size: 16px;
          }
          .terms-section {
            margin-top: 50px;
            padding: 15px;
            background: #f8f9fa;
            border: 1px solid #ddd;
            border-radius: 5px;
          }
          .terms-title {
            font-weight: bold;
            margin-bottom: 10px;
            color: #0f3459;
          }
          .terms-list {
            font-size: 12px;
            line-height: 1.6;
          }
          .signature-section {
            margin-top: 50px;
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 50px;
          }
          .signature-box {
            border-top: 1px solid #333;
            padding-top: 10px;
            text-align: center;
          }
          .footer {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #ddd;
            text-align: center;
            color: #666;
            font-size: 12px;
          }
          @media print {
            body { margin: 0; padding: 10px; }
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="bill-header">
          <div class="company-name">VKTN Granites</div>
          <div class="company-address">
            123 Temple Street, Chennai - 600001<br>
            Phone: +91 98765 43210 | Email: info@granitecompany.com
          </div>
          <div class="bill-title">TAX INVOICE / BILL</div>
          <div class="bill-number">Bill No: BILL-${order.orderNumber}</div>
        </div>

        <div class="billing-info">
          <div class="customer-info">
            <div class="section-title">Bill To</div>
            <div class="info-row">
              <span class="info-label">Name:</span>
              <span>${order.customerName}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Phone:</span>
              <span>${order.customerPhone}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Address:</span>
              <span>${order.customerAddress}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Temple:</span>
              <span>${order.templeName}</span>
            </div>
          </div>
          
          <div class="order-info">
            <div class="section-title">Order Details</div>
            <div class="info-row">
              <span class="info-label">Order No:</span>
              <span>${order.orderNumber}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Order Date:</span>
              <span>${orderDate}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Delivery Date:</span>
              <span>${deliveryDate}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Status:</span>
              <span style="color: #28a745; font-weight: bold;">${order.status.charAt(0).toUpperCase() + order.status.slice(1)}</span>
            </div>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>S.No</th>
              <th>Item Name</th>
              <th style="text-align: center;">Length</th>
              <th style="text-align: center;">Width</th>
              <th style="text-align: center;">Height</th>
              <th style="text-align: center;">Running Feet</th>
              <th style="text-align: right;">Rate (₹/ft)</th>
              <th style="text-align: right;">Amount (₹)</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHTML}
          </tbody>
        </table>

        <div class="totals-section">
          <div class="total-row">
            <span>Total Running Feet:</span>
            <span>${totalRunningFeet.toFixed(2)} ft</span>
          </div>
          <div class="total-row">
            <span>Subtotal:</span>
            <span>₹${totalAmount.toFixed(2)}</span>
          </div>
          <div class="total-row">
            <span>GST (18%):</span>
            <span>₹${tax.toFixed(2)}</span>
          </div>
          <div class="total-row grand-total">
            <span>Grand Total:</span>
            <span>₹${grandTotal.toFixed(2)}</span>
          </div>
        </div>

        <div style="clear: both;"></div>

        <div class="terms-section">
          <div class="terms-title">Terms & Conditions</div>
          <div class="terms-list">
            1. Payment to be made as per agreed terms.<br>
            2. Goods once sold will not be taken back.<br>
            3. Delivery charges extra if applicable.<br>
            4. Prices are inclusive of GST.<br>
            5. Subject to Chennai jurisdiction.
          </div>
        </div>

        <div class="signature-section">
          <div class="signature-box">
            <div>Customer Signature</div>
          </div>
          <div class="signature-box">
            <div>For VKTN Granites</div>
            <div style="margin-top: 30px;">Authorized Signatory</div>
          </div>
        </div>

        <div class="footer">
          <p>Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
          <p>This is a computer-generated bill and does not require signature</p>
        </div>
      </body>
      </html>
    `;
  };

  const generateEditableBillHTML = () => {
    if (!selectedOrder) return '';
    
    const orderDate = new Date(selectedOrder.orderDate).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    const deliveryDate = selectedOrder.deliveryDate ? new Date(selectedOrder.deliveryDate).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }) : 'Not set';

    const totals = calculateBillTotals();

    let itemsHTML = editableBill.items.map(item => `
      <tr>
        <td>${item.id + 1}</td>
        <td>${item.name}</td>
        <td style="text-align: center;">${item.length}</td>
        <td style="text-align: center;">${item.width}</td>
        <td style="text-align: center;">${item.height}</td>
        <td style="text-align: center;">${parseFloat(item.runningFeet).toFixed(2)} ft</td>
        <td style="text-align: right;">₹${parseFloat(item.rate).toFixed(2)}</td>
        <td style="text-align: right;">₹${parseFloat(item.amount).toFixed(2)}</td>
      </tr>
    `).join('');

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <title>BILL - Order ${selectedOrder.orderNumber} - VKTN Granites</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
            color: #333;
            line-height: 1.4;
          }
          .bill-header {
            text-align: center;
            border-bottom: 3px double #0f3459;
            padding-bottom: 20px;
            margin-bottom: 30px;
          }
          .company-name {
            font-size: 28px;
            font-weight: bold;
            color: #0f3459;
            margin-bottom: 5px;
          }
          .company-address {
            font-size: 14px;
            color: #666;
            margin-bottom: 10px;
          }
          .bill-title {
            font-size: 20px;
            font-weight: bold;
            color: #d4af37;
            margin-bottom: 5px;
          }
          .bill-number {
            font-size: 16px;
            color: #333;
          }
          .billing-info {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin-bottom: 30px;
          }
          .customer-info, .order-info {
            background: #f8f9fa;
            padding: 15px;
            border-radius: 5px;
            border: 1px solid #ddd;
          }
          .section-title {
            font-size: 16px;
            font-weight: bold;
            color: #0f3459;
            margin-bottom: 10px;
            border-bottom: 1px solid #0f3459;
            padding-bottom: 5px;
          }
          .info-row {
            margin-bottom: 5px;
            display: flex;
            justify-content: space-between;
          }
          .info-label {
            font-weight: bold;
            color: #333;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
          }
          th {
            background: #0f3459;
            color: white;
            padding: 12px 8px;
            text-align: left;
            font-weight: bold;
            font-size: 14px;
          }
          td {
            padding: 10px 8px;
            border-bottom: 1px solid #ddd;
            font-size: 13px;
          }
          tr:nth-child(even) {
            background: #f8f9fa;
          }
          .totals-section {
            margin-top: 20px;
            float: right;
            width: 300px;
          }
          .total-row {
            display: flex;
            justify-content: space-between;
            padding: 8px 15px;
            background: #f8f9fa;
            border: 1px solid #ddd;
            margin-bottom: 2px;
          }
          .grand-total {
            background: #0f3459;
            color: white;
            font-weight: bold;
            font-size: 16px;
          }
          .notes-section {
            margin-top: 20px;
            padding: 15px;
            background: #f8f9fa;
            border: 1px solid #ddd;
            border-radius: 5px;
          }
          .terms-section {
            margin-top: 50px;
            padding: 15px;
            background: #f8f9fa;
            border: 1px solid #ddd;
            border-radius: 5px;
          }
          .terms-title {
            font-weight: bold;
            margin-bottom: 10px;
            color: #0f3459;
          }
          .terms-list {
            font-size: 12px;
            line-height: 1.6;
          }
          .signature-section {
            margin-top: 50px;
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 50px;
          }
          .signature-box {
            border-top: 1px solid #333;
            padding-top: 10px;
            text-align: center;
          }
          .footer {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #ddd;
            text-align: center;
            color: #666;
            font-size: 12px;
          }
          @media print {
            body { margin: 0; padding: 10px; }
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="bill-header">
          <div class="company-name">VKTN Granites</div>
          <div class="company-address">
            123 Temple Street, Chennai - 600001<br>
            Phone: +91 98765 43210 | Email: info@granitecompany.com
          </div>
          <div class="bill-title">TAX INVOICE / BILL</div>
          <div class="bill-number">Bill No: BILL-${selectedOrder.orderNumber}</div>
        </div>

        <div class="billing-info">
          <div class="customer-info">
            <div class="section-title">Bill To</div>
            <div class="info-row">
              <span class="info-label">Name:</span>
              <span>${selectedOrder.customerName}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Phone:</span>
              <span>${selectedOrder.customerPhone}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Address:</span>
              <span>${selectedOrder.customerAddress}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Temple:</span>
              <span>${selectedOrder.templeName}</span>
            </div>
          </div>
          
          <div class="order-info">
            <div class="section-title">Order Details</div>
            <div class="info-row">
              <span class="info-label">Order No:</span>
              <span>${selectedOrder.orderNumber}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Order Date:</span>
              <span>${orderDate}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Delivery Date:</span>
              <span>${deliveryDate}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Status:</span>
              <span style="color: #28a745; font-weight: bold;">${selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}</span>
            </div>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>S.No</th>
              <th>Item Name</th>
              <th style="text-align: center;">Length</th>
              <th style="text-align: center;">Width</th>
              <th style="text-align: center;">Height</th>
              <th style="text-align: center;">Running Feet</th>
              <th style="text-align: right;">Rate (₹/ft)</th>
              <th style="text-align: right;">Amount (₹)</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHTML}
          </tbody>
        </table>

        <div class="totals-section">
          <div class="total-row">
            <span>Subtotal:</span>
            <span>₹${totals.subtotal.toFixed(2)}</span>
          </div>
          ${totals.transportCharge > 0 ? `
          <div class="total-row">
            <span>Transport Charge:</span>
            <span>₹${totals.transportCharge.toFixed(2)}</span>
          </div>
          ` : ''}
          ${totals.discount > 0 ? `
          <div class="total-row">
            <span>Discount:</span>
            <span>-₹${totals.discount.toFixed(2)}</span>
          </div>
          ` : ''}
          <div class="total-row">
            <span>After Discount:</span>
            <span>₹${totals.afterDiscount.toFixed(2)}</span>
          </div>
          <div class="total-row">
            <span>GST (${editableBill.taxRate}%):</span>
            <span>₹${totals.tax.toFixed(2)}</span>
          </div>
          <div class="total-row grand-total">
            <span>Grand Total:</span>
            <span>₹${totals.grandTotal.toFixed(2)}</span>
          </div>
        </div>

        <div style="clear: both;"></div>

        ${editableBill.notes ? `
        <div class="notes-section">
          <div class="section-title">Additional Notes</div>
          <div>${editableBill.notes}</div>
        </div>
        ` : ''}

        <div class="terms-section">
          <div class="terms-title">Terms & Conditions</div>
          <div class="terms-list">
            1. Payment to be made as per agreed terms.<br>
            2. Goods once sold will not be taken back.<br>
            3. Delivery charges extra if applicable.<br>
            4. Prices are inclusive of GST.<br>
            5. Subject to Chennai jurisdiction.
          </div>
        </div>

        <div class="signature-section">
          <div class="signature-box">
            <div>Customer Signature</div>
          </div>
          <div class="signature-box">
            <div>For VKTN Granites</div>
            <div style="margin-top: 30px;">Authorized Signatory</div>
          </div>
        </div>

        <div class="footer">
          <p>Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
          <p>This is a computer-generated bill and does not require signature</p>
        </div>
      </body>
      </html>
    `;
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
                        <div className="action-buttons">
                          <button
                            onClick={() => handleViewOrder(order)}
                            className="btn-action btn-view"
                          >
                            <Eye size={16} />
                            View
                          </button>
                          <button
                            onClick={() => handleDownloadPDF(order)}
                            className="btn-action btn-download"
                            title="Download PDF"
                          >
                            <Download size={16} />
                            PDF
                          </button>
                          <button
                            onClick={() => handleEditBill(order)}
                            className="btn-action btn-edit"
                            title="Edit Bill"
                          >
                            <Edit size={16} />
                            Edit
                          </button>
                        </div>
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
              <div className="modal-header-actions">
                <button
                  onClick={() => handleDownloadPDF(selectedOrder)}
                  className="btn-action btn-download"
                  title="Download PDF"
                >
                  <Download size={16} />
                  Download PDF
                </button>
                <button
                  onClick={() => handleEditBill(selectedOrder)}
                  className="btn-action btn-edit"
                  title="Edit Bill"
                >
                  <Edit size={16} />
                  Edit Bill
                </button>
                <button onClick={() => setShowModal(false)} className="btn-close">×</button>
              </div>
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
                  <div><strong>Order Date:</strong> {new Date(selectedOrder.orderDate).toLocaleDateString('en-US', {
                    weekday: 'short',
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}</div>
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
                        <th>Height</th>
                        <th>Running Feet</th>
                        <th>Notes</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedOrder.items.map((item, index) => {
                        const lengthUnit = item.lengthUnit || 'in';
                        const widthUnit = item.widthUnit || 'in';
                        const heightUnit = item.heightUnit || 'in';
                        return (
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{item.itemName}</td>
                            <td>{item.itemNameTamil || '-'}</td>
                            <td>{formatDimensionDisplay(item.length, lengthUnit)}</td>
                            <td>{formatDimensionDisplay(item.width, widthUnit)}</td>
                            <td>{formatDimensionDisplay(item.height, heightUnit)}</td>
                            <td>{item.runningFeet ? item.runningFeet.toFixed(2) + ' ft' : '-'}</td>
                            <td>{item.notes || '-'}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                  <div className="items-total">
                    <div className="summary-grid">
                      <div><strong>Total Items:</strong> {selectedOrder.items.length}</div>
                      <div><strong>Total Running Feet:</strong> {selectedOrder.totalRunningFeet} ft</div>
                    </div>
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

      {/* Edit Bill Modal */}
      {showBillModal && selectedOrder && (
        <div className="modal-overlay" onClick={() => setShowBillModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Edit Bill - Order {selectedOrder.orderNumber}</h2>
              <div className="modal-header-actions">
                <button
                  onClick={handlePrintEditableBill}
                  className="btn-action btn-print"
                  title="Print Edited Bill"
                >
                  <Printer size={16} />
                  Print Bill
                </button>
                <button onClick={() => setShowBillModal(false)} className="btn-close">×</button>
              </div>
            </div>

            <div className="modal-body">
              {/* Workflow Instructions */}
              <div className="detail-section" style={{ background: '#e3f2fd', border: '1px solid #2196f3', borderRadius: '8px', padding: '1rem' }}>
                <h4 style={{ color: '#1976d2', margin: '0 0 0.5rem 0' }}>📝 Bill Editing Workflow</h4>
                <p style={{ margin: '0', color: '#1565c0', fontSize: '0.9rem' }}>
                  1. Edit item pricing and settings below<br />
                  2. Review the bill summary totals<br />
                  3. Click "Print Bill" to generate the final bill
                </p>
              </div>

              {/* Bill Items */}
              <div className="detail-section">
                <h3>Bill Items</h3>
                <div className="bill-items-table">
                  <table>
                    <thead>
                      <tr>
                        <th>S.No</th>
                        <th>Item Name</th>
                        <th>Length</th>
                        <th>Width</th>
                        <th>Height</th>
                        <th>Running Feet</th>
                        <th>Rate (₹/ft)</th>
                        <th>Amount (₹)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {editableBill.items.map((item, index) => (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>{item.name}</td>
                          <td>{item.length}</td>
                          <td>{item.width}</td>
                          <td>{item.height}</td>
                          <td>
                            <input
                              type="number"
                              step="0.01"
                              value={item.runningFeet}
                              onChange={(e) => handleBillItemChange(index, 'runningFeet', e.target.value)}
                              className="bill-input"
                              style={{ width: '80px' }}
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              step="0.01"
                              value={item.rate}
                              onChange={(e) => handleBillItemChange(index, 'rate', e.target.value)}
                              className="bill-input"
                              style={{ width: '80px' }}
                            />
                          </td>
                          <td>₹{parseFloat(item.amount).toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Bill Settings */}
              <div className="detail-section">
                <h3>Bill Settings</h3>
                <div className="bill-settings-grid">
                  <div className="setting-item">
                    <label>Tax Rate (%):</label>
                    <input
                      type="number"
                      step="0.1"
                      value={editableBill.taxRate}
                      onChange={(e) => setEditableBill({...editableBill, taxRate: e.target.value})}
                      className="bill-input"
                    />
                  </div>
                  <div className="setting-item">
                    <label>Transport Charge (₹):</label>
                    <input
                      type="number"
                      step="0.01"
                      value={editableBill.transportCharge}
                      onChange={(e) => setEditableBill({...editableBill, transportCharge: e.target.value})}
                      className="bill-input"
                    />
                  </div>
                  <div className="setting-item">
                    <label>Discount (₹):</label>
                    <input
                      type="number"
                      step="0.01"
                      value={editableBill.discount}
                      onChange={(e) => setEditableBill({...editableBill, discount: e.target.value})}
                      className="bill-input"
                    />
                  </div>
                </div>
              </div>

              {/* Bill Notes */}
              <div className="detail-section">
                <h3>Additional Notes</h3>
                <textarea
                  value={editableBill.notes}
                  onChange={(e) => setEditableBill({...editableBill, notes: e.target.value})}
                  className="bill-notes"
                  rows="3"
                  placeholder="Add any additional notes for the bill..."
                />
              </div>

              {/* Bill Summary */}
              <div className="detail-section">
                <h3>Bill Summary</h3>
                <div className="bill-summary">
                  {(() => {
                    const totals = calculateBillTotals();
                    return (
                      <div className="summary-grid">
                        <div className="summary-item">
                          <span>Subtotal:</span>
                          <span>₹{totals.subtotal.toFixed(2)}</span>
                        </div>
                        {totals.transportCharge > 0 && (
                          <div className="summary-item">
                            <span>Transport Charge:</span>
                            <span>₹{totals.transportCharge.toFixed(2)}</span>
                          </div>
                        )}
                        {totals.discount > 0 && (
                          <div className="summary-item">
                            <span>Discount:</span>
                            <span>-₹{totals.discount.toFixed(2)}</span>
                          </div>
                        )}
                        <div className="summary-item">
                          <span>After Discount:</span>
                          <span>₹{totals.afterDiscount.toFixed(2)}</span>
                        </div>
                        <div className="summary-item">
                          <span>GST ({editableBill.taxRate}%):</span>
                          <span>₹{totals.tax.toFixed(2)}</span>
                        </div>
                        <div className="summary-item grand-total">
                          <span>Grand Total:</span>
                          <span>₹{totals.grandTotal.toFixed(2)}</span>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
