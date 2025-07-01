require('dotenv').config({ path: __dirname + '/../.env' });
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Doctor = require('../model/Doctor');

// Get the MongoDB URI from the environment variables
const mongoURI = process.env.MONGODB_URI;

if (!mongoURI) {
  console.error('MONGODB_URI is not defined. Please ensure it is set in the .env file.');
  process.exit(1);
}

// Connect to MongoDB using the URI from .env file
mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(async () => {
    console.log('Connected to MongoDB');

    // Doctor details
    const doctorData = {
        name: 'Dr. New Doctor',
        email: 'doctor1@testhospital.com',
        password: 'Jeleu123', // Plain text password
        hospital: 'Test Hospital',
        role: 'doctor',
    };

    try {
        // Hash password
        const salt = await bcrypt.genSalt(10);
        doctorData.password = await bcrypt.hash(doctorData.password, salt);

        // Create doctor in the database
        const newDoctor = new Doctor(doctorData);
        await newDoctor.save();

        console.log('New doctor created successfully:', {
            name: newDoctor.name,
            email: newDoctor.email,
        });

        mongoose.connection.close();
    } catch (error) {
        console.error('Error creating doctor:', error);
        mongoose.connection.close();
    }
})
.catch((error) => {
    console.error('Error connecting to MongoDB:', error);
    mongoose.connection.close();
});
