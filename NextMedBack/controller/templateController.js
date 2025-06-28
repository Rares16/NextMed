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
      console.error(`Invalid or missing doctorId: ${doctorId}`);
      return res.status(400).json({ message: 'Invalid doctor ID.' });
    }
  
    try {
      console.log(`Fetching templates for doctor ID: ${doctorId}`);
      const customTemplates = await Template.find({ doctorId: new mongoose.Types.ObjectId(doctorId) });
  
      // Return an empty array with a 200 status if no templates found
      if (!customTemplates.length) {
        console.log('No customized templates found for this doctor.');
        return res.status(200).json([]);
      }
  
      // Send back the customized templates found for the doctor
      res.status(200).json(customTemplates);
    } catch (error) {
      console.error('Error retrieving customized templates:', error.message);
      res.status(500).json({ message: 'Server error while retrieving customized templates.' });
    }
  };
  
  // Delete a template by ID
  exports.deleteTemplateById = async (req, res) => {
    const { templateId } = req.params;

    if (!templateId || !mongoose.Types.ObjectId.isValid(templateId)) {
      return res.status(400).json({ message: 'Invalid template ID.' });
    }

    try {
      const deletedTemplate = await Template.findByIdAndDelete(templateId);

      if (!deletedTemplate) {
        return res.status(404).json({ message: 'Template not found.' });
      }

      res.status(200).json({ message: 'Template deleted successfully.', deletedTemplate });
    } catch (error) {
      console.error('Error deleting template:', error.message);
      res.status(500).json({ message: 'Server error while deleting template.' });
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
exports.getTemplateById = async (req, res) => {
    try {
      const { templateId } = req.params;
  
      // Validate the template ID
      if (!templateId || !mongoose.Types.ObjectId.isValid(templateId)) {
        return res.status(400).json({ message: 'Invalid template ID.' });
      }
  
      // Find the template by ID
      const template = await Template.findById(templateId);
  
      if (!template) {
        return res.status(404).json({ message: 'Template not found.' });
      }
  
      // Respond with the found template
      res.status(200).json(template);
    } catch (error) {
      console.error('Error retrieving template:', error);
      res.status(500).json({ message: 'Server error while retrieving template.' });
    }
  };
  exports.updateTemplateById = async (req, res) => {
    const { templateId } = req.params;
    const { fields, doctorId } = req.body; // Make sure to use fields, not updates
  
    console.log(`Received update request for template ID: ${templateId}`);
    console.log('Fields received for update:', fields);
    console.log('DoctorId received:', doctorId);
  
    // Validation
    if (!templateId || !mongoose.Types.ObjectId.isValid(templateId)) {
      console.error('Invalid template ID');
      return res.status(400).json({ message: 'Invalid template ID.' });
    }
  
    if (!fields || !Array.isArray(fields)) {
      console.error('Invalid fields provided:', fields);
      return res.status(400).json({ message: 'Invalid updates provided. "fields" must be an array.' });
    }  
  
    try {
      // Find the template by ID
      let template = await Template.findById(templateId);
      if (!template) {
        return res.status(404).json({ message: 'Template not found.' });
      }
  
      // Create a new customized template if doctorId is provided
      if (doctorId) {
        // Validate doctorId format
        if (!mongoose.Types.ObjectId.isValid(doctorId)) {
          return res.status(400).json({ message: 'Invalid doctorId format.' });
        }
  
        // Apply field updates to create the modified fields array
        let modifiedFields = [...template.fields]; // Start with original fields
        
        fields.forEach(update => {
          if (update.action === 'add') {
            modifiedFields.push({
              fieldName: update.fieldName,
              fieldType: update.fieldType,
              required: update.required,
              options: update.options || [],
            });
          } else if (update.action === 'remove') {
            modifiedFields = modifiedFields.filter(field => field.fieldName !== update.fieldName);
          }
        });
  
        // Create new customized template
        const customizedTemplateData = {
          name: template.name + '(customized)',
          specialty: template.specialty,
          doctorId: new mongoose.Types.ObjectId(doctorId),
          fields: modifiedFields,
        };
  
        console.log('Creating template with data:', customizedTemplateData);
        
        const customizedTemplate = new Template(customizedTemplateData);
        await customizedTemplate.save();
        
        console.log('Saved template:', customizedTemplate.toObject());
        console.log(`Created new customized template for doctor: ${doctorId}`);
        
        res.status(201).json(customizedTemplate);
      } else {
        // Update the original template if no doctorId provided
        fields.forEach(update => {
          if (update.action === 'add') {
            template.fields.push({
              fieldName: update.fieldName,
              fieldType: update.fieldType,
              required: update.required,
              options: update.options || [],
            });
          } else if (update.action === 'remove') {
            template.fields = template.fields.filter(field => field.fieldName !== update.fieldName);
          }
        });
  
        // Save updated template
        await template.save();
        res.status(200).json(template);
      }
    } catch (error) {
      console.error('Error updating template:', error.message);
      res.status(500).json({ message: 'Server error while updating template.' });
    }
  };