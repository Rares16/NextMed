// routes/templateRoutes.js
const express = require('express');
const router = express.Router();
const {
  createDefaultTemplate,
  customizeTemplate,
  getTemplateById, 
  getTemplatesBySpecialty,
  getCustomizedTemplates,
  updateTemplateById,
  processAllStepsForDoctor,
} = require('../controller/templateController');

// Route to create a default template
router.post('/default', createDefaultTemplate);

// Route to customize an existing template for a specific doctor
router.post('/customize/:templateId', customizeTemplate);

// Route to get default templates by specialty
router.get('/specialty/:specialty', getTemplatesBySpecialty);

// Route to get customized templates for a specific doctor
router.get('/my/:doctorId', getCustomizedTemplates);

// Route to handle all steps in one sequence for a given doctor
router.post('/all-steps/:doctorId', processAllStepsForDoctor);
router.get('/:templateId', getTemplateById); 
router.patch('/:templateId', updateTemplateById);
module.exports = router;
