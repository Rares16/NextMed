const AWS = require('aws-sdk');
const multer = require('multer');
const express = require('express');
const router = express.Router();
const { getTranscriptionResultFromS3, extractTranscriptionText } = require('../model/Transcription');

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const s3 = new AWS.S3();
const transcribeService = new AWS.TranscribeService();

// Configure multer for file upload
const upload = multer({ storage: multer.memoryStorage() });

// Upload audio and transcribe
router.post('/upload-audio', upload.single('audio'), async (req, res) => {
  const file = req.file;

  if (!file) return res.status(400).json({ message: 'Audio file is required' });

  // Step 1: Upload audio to S3
  const s3Params = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: `uploads/${Date.now()}_${file.originalname}`,
    Body: file.buffer,
    ContentType: file.mimetype,
  };

  try {
    const s3Response = await s3.upload(s3Params).promise();
    const audioFileUrl = s3Response.Location;
    console.log('Audio uploaded to S3:', audioFileUrl);

    // Step 2: Start AWS Transcribe Job
    const transcriptionJobName = `transcription_${Date.now()}`;
    const transcribeParams = {
      TranscriptionJobName: transcriptionJobName,
      LanguageCode: 'en-US', // Adjust if necessary
      MediaFormat: 'mp3', // Ensure the uploaded file is in this format
      Media: { MediaFileUri: audioFileUrl },
      OutputBucketName: process.env.S3_BUCKET_NAME,
    };

    await transcribeService.startTranscriptionJob(transcribeParams).promise();
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

        // Respond with transcription text
        return res.status(201).json({ transcriptionText });
      }

      // Add delay between polling to avoid excessive API requests
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }
  } catch (error) {
    console.error('Error during transcription:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
