const AWS = require('aws-sdk');
const multer = require('multer');
const express = require('express');
const router = express.Router();
const { getTranscriptionResultFromS3, extractTranscriptionText } = require('../model/Transcription');
const Patient = require('../model/Patient');  
const transcribeController = require('../controller/transcribeController');


AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const s3 = new AWS.S3();
const transcribeService = new AWS.TranscribeService();
//const comprehend = new AWS.Comprehend();  This is from the previous iteration
const comprehendMedical = new AWS.ComprehendMedical();

// Configure multer for file upload
const upload = multer({ storage: multer.memoryStorage() });

// Function to analyze transcription using AWS Comprehend
async function analyzeTranscriptionWithComprehend(transcriptionText) {
  const params = {
    Text: transcriptionText
  };

  try {
    const data = await comprehendMedical.detectEntitiesV2(params).promise();
    console.log("Entities detected by Comprehend Medical:", data.Entities);
    return data.Entities;
  } catch (err) {
    console.error("Error calling AWS Comprehend Medical:", err);
    throw new Error("Failed to extract medical information.");
  }
}

// Upload audio and transcribe
router.post('/upload-audio', upload.single('audio'), async (req, res) => {
  const file = req.file;

  if (!file) return res.status(400).json({ message: 'Audio file is required' });

  const s3Params = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: `uploads/${Date.now()}_${file.originalname}`,
    Body: file.buffer,
    ContentType: file.mimetype,
  };

  try {
    // Step 1: Upload audio to S3
    const s3Response = await s3.upload(s3Params).promise();
    const audioFileUrl = s3Response.Location;
    console.log('Audio uploaded to S3:', audioFileUrl);

    // Step 2: Start AWS Transcribe Job
    const transcriptionJobName = `transcription_${Date.now()}`;
    const transcribeParams = {
      TranscriptionJobName: transcriptionJobName,
      LanguageCode: 'en-US',
      MediaFormat: 'mp3',
      Media: { MediaFileUri: audioFileUrl },
      OutputBucketName: process.env.S3_BUCKET_NAME,
    };

    await transcribeService.startTranscriptionJob(transcribeParams).promise();
    console.log('Started transcription job with name:', transcriptionJobName);

    // Step 3: Poll for transcription result
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

        // Step 6: Analyze transcription using AWS Comprehend
        const entities = await analyzeTranscriptionWithComprehend(transcriptionText);

        const patientData = {};
        
        // Step 7: Map entities to fields
        entities.forEach(entity => {
          console.log(`Entity Type: ${entity.Type}, Text: ${entity.Text}`);
          switch (entity.Type) {
            case 'NAME':
              patientData.name = entity.Text;
              break;
            case 'AGE':
              patientData.age = entity.Text;
              break;
            case 'DX_NAME':
              patientData.symptoms = patientData.symptoms ? `${patientData.symptoms}, ${entity.Text}` : entity.Text;
              break;
            case 'TEST_NAME':
              patientData.tests = patientData.tests ? `${patientData.tests}, ${entity.Text}` : entity.Text;
              break;
            case 'SYSTEM_ORGAN_SITE':
              break;
            default:
              console.warn(`Unhandled entity type: ${entity.Type}`);
              break;
          }
        });        
        // Step 8: Create Patient Profile
        const newPatient = new Patient({
          name: patientData.name || 'Unknown',
          templateId: req.body.templateId,
          doctorId: req.body.doctorId,
          fields: {
            'Patient Age': patientData.age || 'N/A',
            'Symptoms': patientData.symptoms || 'N/A',
            'Previous Pregnancy Complications': patientData.previousPregnancyComplications || 'N/A',
          }
        });

        await newPatient.save();
        console.log('Patient profile created successfully:', newPatient);

        return res.status(201).json({ patient: newPatient });
      }

      await new Promise((resolve) => setTimeout(resolve, 5000));
    }
  } catch (error) {
    console.error('Error during transcription:', error);
    res.status(500).json({ message: error.message });
  }
});
router.post('/process', transcribeController.processTranscription);
module.exports = router;
