// server.js or app.js

require('dotenv').config(); // Load environment variables
const express = require('express');
const mongoose = require('mongoose');
const app = express();

// Import routes
const authRoutes = require('./routes/authRoutes');
const templateRoutes = require('./routes/templateRoutes'); // Import template routes
const doctorRoutes = require('./routes/doctorRoutes'); // Import doctor routes
const transcriptionRoutes = require('./routes/transcriptionRoutes'); // Import transcription routes

// Middleware
app.use(express.json());

// Use routes
app.use('/auth', authRoutes);
app.use('/templates', templateRoutes); // Use '/templates' as the base path for template routes
app.use('/api/doctor', doctorRoutes); // Use '/api/doctor' as the base path for doctor routes
app.use('/api/transcription', transcriptionRoutes); // Use '/api/transcription' as the base path for transcription routes

// MongoDB connection
const mongoURI = process.env.MONGODB_URI;

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
    console.log('Connected to MongoDB successfully.');
    // Start the server only after a successful connection
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
})
.catch((error) => {
    console.error('Error connecting to MongoDB:', error);
});
