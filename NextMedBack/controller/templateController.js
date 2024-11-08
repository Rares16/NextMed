require('dotenv').config(); // Load environment variables
const mongoose = require('mongoose');
const Template = require('../model/Template');

// Create a default template
exports.createDefaultTemplate = async (req, res) => {
  const { name, specialty, fields } = req.body;

  // Validation
  if (!name || !specialty || !fields || !Array.isArray(fields)) {
    return res.status(400).json({ message: 'Name, specialty, and fields are required, and fields must be an array.' });
  }

  try {
    // Check if a default template with the same name and specialty already exists
    const existingTemplate = await Template.findOne({ name, specialty, doctorId: null });
    if (existingTemplate) {
      return res.status(400).json({ message: 'Template with this name and specialty already exists.' });
    }

    const newTemplate = new Template({
      name,
      specialty,
      fields,
    });
    await newTemplate.save();
    res.status(201).json(newTemplate);
  } catch (error) {
    console.error('Error creating default template:', error.message);
    res.status(500).json({ message: 'Server error while creating default template.' });
  }
};

// Customize a template for a specific doctor
exports.customizeTemplate = async (req, res) => {
  const { doctorId, modifications } = req.body;
  const { templateId } = req.params;

  // Validation
  if (!doctorId || !mongoose.Types.ObjectId.isValid(doctorId)) {
    return res.status(400).json({ message: 'Invalid or missing doctorId.' });
  }
  if (!templateId || !mongoose.Types.ObjectId.isValid(templateId)) {
    return res.status(400).json({ message: 'Invalid template ID.' });
  }

  try {
    // Find the original template
    const originalTemplate = await Template.findById(templateId);
    if (!originalTemplate) {
      return res.status(404).json({ message: 'Template not found.' });
    }

    const customizedTemplate = new Template({
      name: originalTemplate.name,
      specialty: originalTemplate.specialty,
      doctorId,
      fields: modifications.fields || originalTemplate.fields,
    });
    await customizedTemplate.save();
    res.status(201).json(customizedTemplate);
  } catch (error) {
    console.error('Error customizing template:', error.message);
    res.status(500).json({ message: 'Server error while customizing template.' });
  }
};

// Get templates by specialty
exports.getTemplatesBySpecialty = async (req, res) => {
  const { specialty } = req.params;

  // Validation
  if (!specialty) {
    return res.status(400).json({ message: 'Specialty is required.' });
  }

  try {
    const templates = await Template.find({ specialty, doctorId: null });
    if (!templates.length) {
      return res.status(404).json({ message: 'No templates found for the given specialty.' });
    }
    res.status(200).json(templates);
  } catch (error) {
    console.error('Error retrieving templates:', error.message);
    res.status(500).json({ message: 'Server error while retrieving templates.' });
  }
};

// Get customized templates for a specific doctor
exports.getCustomizedTemplates = async (req, res) => {
  const { doctorId } = req.params;

  // Validation
  if (!doctorId || !mongoose.Types.ObjectId.isValid(doctorId)) {
    return res.status(400).json({ message: 'Invalid doctor ID.' });
  }

  try {
    const customTemplates = await Template.find({ doctorId });
    if (!customTemplates.length) {
      return res.status(404).json({ message: 'No customized templates found for this doctor.' });
    }
    res.status(200).json(customTemplates);
  } catch (error) {
    console.error('Error retrieving customized templates:', error.message);
    res.status(500).json({ message: 'Server error while retrieving customized templates.' });
  }
};

// Process all steps for a given doctor (for demonstration purposes)
exports.processAllStepsForDoctor = async (req, res) => {
  const { doctorId } = req.params;

  // Validation
  if (!doctorId || !mongoose.Types.ObjectId.isValid(doctorId)) {
    return res.status(400).json({ message: 'Invalid doctor ID.' });
  }

  try {
    // Step 1: Create a Default Template
    const defaultTemplate = new Template({
      name: "Gynecology Initial Visit",
      specialty: "Gynecology",
      fields: [
        { fieldName: "Patient Age", fieldType: "number", required: true },
        { fieldName: "Symptoms", fieldType: "text", required: true },
        { fieldName: "Last Menstrual Period", fieldType: "date", required: false }
      ],
    });
    await defaultTemplate.save();
    console.log('Default template created:', defaultTemplate._id);

    // Step 2: Customize the Default Template for the Doctor
    const customizedTemplate = new Template({
      name: defaultTemplate.name,
      specialty: defaultTemplate.specialty,
      doctorId,
      fields: [
        { fieldName: "Patient Age", fieldType: "number", required: true },
        { fieldName: "Symptoms", fieldType: "text", required: true },
        { fieldName: "Last Menstrual Period", fieldType: "date", required: false },
        { fieldName: "Previous Pregnancy Complications", fieldType: "text", required: false }
      ],
    });
    await customizedTemplate.save();
    console.log('Customized template created for doctor:', doctorId);

    // Step 3: Get Default Templates by Specialty
    const specialtyTemplates = await Template.find({ specialty: "Gynecology", doctorId: null });
    console.log('Default templates retrieved for specialty:', specialtyTemplates.length);

    // Step 4: Get Customized Templates for the Doctor
    const doctorTemplates = await Template.find({ doctorId });
    console.log('Customized templates retrieved for doctor:', doctorTemplates.length);

    // Response with summary
    res.status(200).json({
      message: 'All steps completed successfully',
      defaultTemplate: defaultTemplate,
      customizedTemplate: customizedTemplate,
      specialtyTemplates: specialtyTemplates,
      doctorTemplates: doctorTemplates
    });
  } catch (error) {
    console.error('Error processing all steps for doctor:', error.message);
    res.status(500).json({ message: 'Server error while processing all steps for doctor.' });
  }
};
