require('dotenv').config({ path: __dirname + '/../.env' });
const mongoose = require('mongoose');
const Doctor = require('./model/Doctor'); // adjust path if needed
const Template = require('./model/Template'); // adjust path if needed

const mongoURI = 'mongodb+srv://RaresUser:16Rares2002@cluster0.ok33stj.mongodb.net/test?retryWrites=true&w=majority&appName=Cluster0';

if (!mongoURI) {
  console.error('MONGODB_URI is not defined. Please ensure it is set in the .env file.');
  process.exit(1);
}

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(async () => {
  console.log('✅ Connected to MongoDB');

  try {
    // Step 1: Find the doctor
    const doctor = await Doctor.findOne({ email: 'doctor1@testhospital.com' });

    if (!doctor) {
      console.error('❌ Doctor not found');
      return mongoose.connection.close();
    }

    // Step 2: Define the template
    const templateData = {
      name: 'General Checkup Template',
      specialty: 'General Medicine',
      doctorId: doctor._id, // associate with doctor
      fields: [
        { fieldName: 'Blood Pressure', fieldType: 'text', required: true },
        { fieldName: 'Heart Rate', fieldType: 'number', required: false },
        { fieldName: 'Checkup Date', fieldType: 'date', required: true },
        { fieldName: 'Follow-up Needed', fieldType: 'boolean', required: false },
        {
          fieldName: 'Diagnosis Category',
          fieldType: 'dropdown',
          required: false,
          options: ['Cold', 'Infection', 'Allergy', 'Other']
        }
      ]
    };

    // Step 3: Insert the template
    const newTemplate = new Template(templateData);
    await newTemplate.save();

    console.log('✅ Template created successfully:', {
      name: newTemplate.name,
      id: newTemplate._id.toString(),
    });

    mongoose.connection.close();
  } catch (error) {
    console.error('❌ Error creating template:', error);
    mongoose.connection.close();
  }
})
.catch((error) => {
  console.error('❌ MongoDB connection error:', error);
  mongoose.connection.close();
});
