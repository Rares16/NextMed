// components/Transcription.js
const AWS = require('aws-sdk');
const fetch = require('node-fetch');
const Patient = require('../model/Patient');
const Template = require('../model/Template');
const comprehend = new AWS.ComprehendMedical();

// AWS Configuration
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const s3 = new AWS.S3();
const transcribeService = new AWS.TranscribeService();

// Upload audio to S3 and return the file URL
async function uploadAudioToS3(file) {
  const s3Params = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: `uploads/${Date.now()}_${file.originalname}`,
    Body: file.buffer,
    ContentType: file.mimetype,
  };

  const s3Response = await s3.upload(s3Params).promise();
  return s3Response.Location;
}

// Start a transcription job
async function startTranscription(audioFileUrl) {
  const transcribeParams = {
    TranscriptionJobName: `transcription_${Date.now()}`,
    LanguageCode: 'en-US',
    MediaFormat: 'mp3',
    Media: { MediaFileUri: audioFileUrl },
    OutputBucketName: process.env.S3_BUCKET_NAME,
  };

  await transcribeService.startTranscriptionJob(transcribeParams).promise();
  return transcribeParams.TranscriptionJobName;
}

// Get the transcription result
async function getTranscriptionResultFromS3(bucketName, transcriptionKey) {
  try {
    const params = {
      Bucket: bucketName,
      Key: transcriptionKey,
    };
    const s3Object = await s3.getObject(params).promise();
    const jsonData = JSON.parse(s3Object.Body.toString('utf-8'));

    return jsonData;
  } catch (error) {
    console.error('Error fetching transcription result from S3:', error);
    throw new Error(`Failed to retrieve transcription result: ${error.message}`);
  }
}

// Extract transcription text
function extractTranscriptionText(transcriptionData) {
  try {
    if (
      transcriptionData.results &&
      transcriptionData.results.transcripts &&
      transcriptionData.results.transcripts.length > 0
    ) {
      return transcriptionData.results.transcripts[0].transcript;
    } else {
      throw new Error('Transcription data is not in the expected format.');
    }
  } catch (error) {
    console.error('Error extracting transcription text:', error);
    throw new Error(`Failed to extract transcription text: ${error.message}`);
  }
}

async function createPatientProfile(transcriptionText, templateId) {
  try {
    console.log('Creating patient profile with templateId:', templateId);

    // Fetch template
    const template = await Template.findById(templateId);
    if (!template) throw new Error('Template not found');

    // Analyze entities using Comprehend Medical
    const comprehendResponse = await comprehend
      .detectEntitiesV2({ Text: transcriptionText })
      .promise();

    const entities = comprehendResponse.Entities;
    console.log('Entities detected by Comprehend Medical:', JSON.stringify(entities, null, 2));

    // Prepare patientData based on template fields
    const patientData = {
      name: 'Unknown',
      age: null,
      gender: null,
      doctorId: template.doctorId,
      templateId: template._id,
      transcription: transcriptionText,
      extractedFields: {},
    };

    // Map relevant entity types
    for (const entity of entities) {
      const text = entity.Text;
      switch (entity.Type) {
        case 'NAME':
          patientData.name = text;
          break;
        case 'AGE':
          patientData.age = text;
          break;
        case 'GENDER':
          patientData.gender = text;
          break;
      }

      // Check for custom template fields
      for (const field of template.fields) {
        if (
          field.name &&
          text.toLowerCase().includes(field.name.toLowerCase()) &&
          !patientData.extractedFields[field.name]
        ) {
          patientData.extractedFields[field.name] = text;
        }
      }
    }

    // Save to MongoDB
    const newPatient = await Patient.create(patientData);
    return newPatient;
  } catch (error) {
    console.error('Error creating patient profile:', error);
    throw error;
  }
}
module.exports = {
  uploadAudioToS3,
  startTranscription,
  getTranscriptionResultFromS3,
  extractTranscriptionText,
  createPatientProfile,
};
