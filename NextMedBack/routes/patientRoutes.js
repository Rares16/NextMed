// patientroutes.js
const AWS = require('aws-sdk');
const mongoose = require('mongoose');
const multer = require('multer');
const Patient = require('../model/Patient');
const Doctor = require('../model/Doctor'); // Import the Doctor model
const express = require('express');
const router = express.Router();
const { getTranscriptionResultFromS3, extractTranscriptionText, createPatientProfile } = require('../model/Transcription');

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const s3 = new AWS.S3();
const transcribeService = new AWS.TranscribeService();

// Configure multer for file upload
const upload = multer({ storage: multer.memoryStorage() });

// Upload audio, transcribe, and create a patient profile
router.post('/upload-audio', upload.single('audio'), async (req, res) => {
  const file = req.file;
  const templateId = req.body.templateId; // Template selected by the user on the frontend

  if (!file) return res.status(400).json({ message: 'Audio file is required' });
  if (!templateId) return res.status(400).json({ message: 'Template ID is required' });

  try {
    // Step 1: Upload audio to S3
    const audioFileUrl = await uploadAudioToS3(file);
    console.log('Audio uploaded to S3:', audioFileUrl);

    // Step 2: Start AWS Transcribe Job
    const transcriptionJobName = await startTranscription(audioFileUrl);
    console.log('Started transcription job with name:', transcriptionJobName);

    // Step 3: Poll for transcription result (simplified)
    let jobStatus = 'IN_PROGRESS';
    while (jobStatus === 'IN_PROGRESS') {
      const result = await transcribeService.getTranscriptionJob({ TranscriptionJobName: transcriptionJobName }).promise();
      jobStatus = result.TranscriptionJob.TranscriptionJobStatus;

      if (jobStatus === 'COMPLETED') {
        const transcriptionKey = `${transcriptionJobName}.json`;
        console.log(`Fetching transcription result for job: ${transcriptionJobName}`);

        // Step 4: Fetch JSON from S3 directly using S3 SDK
        const transcriptionData = await getTranscriptionResultFromS3(process.env.S3_BUCKET_NAME, transcriptionKey);

        // Step 5: Extract transcription text
        const transcriptionText = extractTranscriptionText(transcriptionData);
        console.log('Transcription completed. Text:', transcriptionText);

        // Step 6: Create a patient profile using the transcription and selected template
        const newPatient = await createPatientProfile(transcriptionText, templateId);
        console.log('Patient profile created successfully:', newPatient);

        // Respond with the newly created patient profile
        return res.status(201).json({ message: 'Patient profile created successfully', patient: newPatient });
      }

      // Add delay between polling to avoid excessive API requests
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }
  } catch (error) {
    console.error('Error during transcription or patient creation:', error);
    res.status(500).json({ message: error.message });
  }
});
router.get('/:id', async (req, res) => {
    try {
      const patientId = req.params.id;
  
      // Validate the patient ID
      if (!mongoose.Types.ObjectId.isValid(patientId)) {
        return res.status(400).json({ message: 'Invalid patient ID format' });
      }
  
      // Find the patient by ID and make sure fields are included
      const patient = await Patient.findById(patientId).lean();
      if (!patient) {
        return res.status(404).json({ message: 'Patient not found' });
      }
  
      const doctor = await Doctor.findById(patient.doctorId).lean();
  
      // Constructing the full patient data, including the doctor if available
      const patientData = {
        ...patient,
        doctor: doctor ? doctor : null,
      };
  
      // Sending patient data back
      res.status(200).json(patientData);
    } catch (error) {
      console.error('Server error:', error);
      res.status(500).json({ message: 'Server error. Please try again later.' });
    }
  });
  module.exports = router;
