// routes/doctorRoutes.js
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Doctor = require('../model/Doctor'); // Import the Doctor model
const Patient = require('../model/Patient'); // Import the Patient model

// Get a specific doctor by ID, including patients
router.get('/:id', async (req, res) => {
  try {
    const doctorId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(doctorId)) {
      return res.status(400).json({ message: 'Invalid doctor ID format' });
    }

    // Find the doctor by ID
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    // Find the patients associated with this doctor
    const patients = await Patient.find({ doctorId });

    // Attach patients to the doctor object before sending it back
    const doctorData = {
      ...doctor.toObject(),
      patients: patients, // Add the patients array to the doctor data
    };

    res.json(doctorData);
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
});

module.exports = router;
