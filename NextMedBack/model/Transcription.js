// components/Transcription.js
const AWS = require('aws-sdk');
const fetch = require('node-fetch');
const Patient = require('../model/Patient');
const Template = require('../model/Template');

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

// Create a patient profile using transcription and template
async function createPatientProfile(transcriptionText, templateId) {
    try {
      console.log('Creating patient profile with templateId:', templateId);
  
      // Fetch the selected template
      const template = await Template.findById(templateId);
      if (!template) {
        throw new Error('Template not found.');
      }
  
      // Initialize patient data object
      const patientData = {
        name: 'Unknown', // Default name if not available from transcription
        templateId: template._id,
        fields: {},
      };
  
      // Pre-process transcription text: remove filler words, correct common mistakes, convert to lowercase, trim whitespace
      let processedText = transcriptionText.toLowerCase()
        .replace(/\s*(uh|um|er|they|like)\s*/g, ' ') // Remove filler words
        .replace(/\bsuff\b/g, 'suffer') // Fix common transcription errors
        .replace(/\bi'm\b/g, 'i am') // Convert contractions to a common form
        .trim();
      console.log('Processed transcription text:', processedText);
  
      // Extract fields from transcription using the template structure
      template.fields.forEach((field) => {
        let regex;
        console.log(`Attempting to extract value for field: ${field.fieldName}`);
  
        // Create different regex patterns depending on the common phrases
        switch (field.fieldName.toLowerCase()) {
          case 'name':
            // Matches variations like "my name is..." or "i am ..."
            regex = /(?:my name is|i am|i'm)\s+([\w\s]+)/i;
            console.log(`Regex used for field "name": ${regex}`);
            break;
          case 'age':
          case 'patient age':
            // Matches "i am 20 years old", "i'm 20 years old", or slight variations
            regex = /(?:i am|i'm|age is|i am aged)\s+(\d+)\s*(years\s*old)?/i;
            console.log(`Regex used for field "age": ${regex}`);
            break;
          case 'symptoms':
            // Matches phrases like "currently experiencing", "i have", "suffer from"
            regex = /(?:i am currently experiencing|currently experiencing|i have|i'm suffering from|i suffer from|suffer from)\s+([\w\s,]+)/i;
            console.log(`Regex used for field "symptoms": ${regex}`);
            break;
          case 'last menstrual period':
            // Matches variations like "last menstrual period was" or "lmp was"
            regex = /(?:last menstrual period|lmp)\s+(?:was|occurred|happened)\s+([\w\s]+)/i;
            console.log(`Regex used for field "last menstrual period": ${regex}`);
            break;
          case 'previous pregnancy complications':
            // Matches variations for previous complications
            regex = /(?:previous pregnancy complications|past complications)\s*(?:are|were|include)?\s*([\w\s,]+)/i;
            console.log(`Regex used for field "previous pregnancy complications": ${regex}`);
            break;
          default:
            // Skip irrelevant fields like "G", "c", "L", "D"
            console.log(`Skipping field: ${field.fieldName} as it is not relevant for matching.`);
            return;
        }
  
        const match = processedText.match(regex);
        if (match && match[1]) {
          console.log(`Matched value for ${field.fieldName}:`, match[1]);
          patientData.fields[field.fieldName] = match[1].trim();
        } else {
          console.log(`No match found for field: ${field.fieldName}`);
        }
      });
  
      // Create and save the patient profile
      const newPatient = new Patient(patientData);
      await newPatient.save();
      console.log('Patient profile created successfully:', newPatient);
  
      return newPatient;
    } catch (error) {
      console.error('Error creating patient profile:', error);
      throw new Error(`Failed to create patient profile: ${error.message}`);
    }
  }  
module.exports = {
  uploadAudioToS3,
  startTranscription,
  getTranscriptionResultFromS3,
  extractTranscriptionText,
  createPatientProfile,
};
