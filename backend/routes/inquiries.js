const express = require('express');
const router = express.Router();
const Inquiry = require('../models/Inquiry');

// Get all inquiries
router.get('/', async (req, res) => {
  try {
    const { status } = req.query;
    let filter = {};
    
    if (status) filter.status = status;
    
    const inquiries = await Inquiry.find(filter).sort({ createdAt: -1 });
    res.json(inquiries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single inquiry
router.get('/:id', async (req, res) => {
  try {
    const inquiry = await Inquiry.findById(req.params.id);
    if (!inquiry) {
      return res.status(404).json({ message: 'Inquiry not found' });
    }
    res.json(inquiry);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new inquiry
router.post('/', async (req, res) => {
  const inquiry = new Inquiry(req.body);
  
  try {
    const newInquiry = await inquiry.save();
    res.status(201).json({ 
      message: 'Inquiry submitted successfully! We will contact you soon.',
      inquiry: newInquiry 
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update inquiry status
router.patch('/:id/status', async (req, res) => {
  try {
    const inquiry = await Inquiry.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true, runValidators: true }
    );
    
    if (!inquiry) {
      return res.status(404).json({ message: 'Inquiry not found' });
    }
    
    res.json(inquiry);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete inquiry
router.delete('/:id', async (req, res) => {
  try {
    const inquiry = await Inquiry.findByIdAndDelete(req.params.id);
    
    if (!inquiry) {
      return res.status(404).json({ message: 'Inquiry not found' });
    }
    
    res.json({ message: 'Inquiry deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
