// routes/doctorRoutes.js
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Doctor = require('../model/Doctor'); // Import the Doctor model

// Get a specific doctor by ID
router.get('/:id', async (req, res) => {
  try {
    const doctorId = req.params.id;

    // Validate the doctor ID
    if (!mongoose.Types.ObjectId.isValid(doctorId)) {
      return res.status(400).json({ message: 'Invalid doctor ID format' });
    }

    // Find the doctor by ID
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    res.json(doctor);
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
});

module.exports = router;
