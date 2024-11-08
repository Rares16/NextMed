// models/Doctor.js
const mongoose = require('mongoose');

const DoctorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // Should be hashed
  hospital: { type: String, required: true },
  role: { type: String, enum: ['doctor', 'admin'], default: 'doctor' },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Doctor', DoctorSchema);