const mongoose = require('mongoose');

const templateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  specialty: {
    type: String,
    required: true,
  },
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor',
    default: null,
  },
  fields: [
    {
      fieldName: { type: String, required: true },
      fieldType: { type: String, enum: ['text', 'number', 'date', 'boolean', 'dropdown'], required: true },
      required: { type: Boolean, default: false },
      options: { type: [String], default: [] },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Template', templateSchema);
