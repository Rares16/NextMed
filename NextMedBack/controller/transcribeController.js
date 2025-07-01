
const AWS = require('aws-sdk');
const Transcription = require('../model/Transcription');
const Patient = require('../model/Patient');
const Template = require('../model/Template');

// Initialize AWS ComprehendMedical
const comprehendMedical = new AWS.ComprehendMedical({
  region: 'us-east-1'
});

exports.processTranscription = async (req, res) => {
  try {
    const { transcriptionText, doctorId, templateId } = req.body;
    if (!transcriptionText || !doctorId || !templateId) {
      return res.status(400).json({ message: 'Missing required fields.' });
    }

    // Detect entities using AWS Comprehend Medical
    const comprehendResult = await comprehendMedical
      .detectEntitiesV2({ Text: transcriptionText })
      .promise();

    const entities = comprehendResult.Entities || [];
    console.log('Entities detected by Comprehend Medical:', entities);

    // Extract fields
    let name = 'Unknown';
    let age = 'N/A';
    let patientGender = 'N/A';
    const symptoms = [];

    entities.forEach(entity => {
      if (entity.Type === 'NAME') name = entity.Text;
      else if (entity.Type === 'AGE') age = entity.Text;
      else if (entity.Type === 'GENDER') {
        const rawGender = entity.Text.toLowerCase();
        if (['male', 'man', 'm'].includes(rawGender)) patientGender = 'male';
        else if (['female', 'woman', 'f'].includes(rawGender)) patientGender = 'female';
        else patientGender = rawGender;
        }
      
      else if (entity.Type === 'DX_NAME') symptoms.push(entity.Text);
    });

    // Get the template to map template fields
    const template = await Template.findById(templateId);
    if (!template) {
      return res.status(404).json({ message: 'Template not found.' });
    }

    const templateFields = template.fields || [];
    const populatedFields = new Map();

    templateFields.forEach(field => {
      switch (field) {
        case 'Patient Age':
          populatedFields.set(field, age || 'N/A');
          break;
        case 'Symptoms':
          populatedFields.set(field, symptoms.length > 0 ? symptoms.join(', ') : 'N/A');
          break;
        case 'Gender':
            populatedFields.set(field, patientGender || 'N/A');
        default:
          // Handle any custom fields with N/A if not found
          populatedFields.set(field, 'N/A');
      }
    });

    // Create and save new patient
    const newPatient = new Patient({
      name,
      doctorId,
      templateId,
      patientGender: gender || 'N/A',
      fields: populatedFields
    });

    await newPatient.save();

    // Save transcription too if you want
    const newTranscription = new Transcription({
      doctorId,
      transcriptionText,
      patientId: newPatient._id,
      comprehendResult
    });

    await newTranscription.save();

    res.status(200).json({
      message: 'Patient data processed and saved.',
      patient: newPatient,
      transcription: newTranscription
    });

  } catch (error) {
    console.error('Error in transcription processing:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};
