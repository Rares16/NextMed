const OpenAI = require('openai');  // Use whichever variant works for your SDK version
require('dotenv').config();
const Template = require('../model/Template'); // Assuming you have a Template model

// Set up OpenAI API
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Function to process transcription with GPT-3/ChatGPT
async function analyzeTranscriptionWithGPT(transcriptionText, templateId) {
  try {
    // Step 1: Fetch the template by ID
    const template = await Template.findById(templateId);
    if (!template) {
      throw new Error('Template not found.');
    }

    // Create a list of template fields to include in the prompt
    const templateFieldsDescription = template.fields.map((field) => {
      return `- ${field.fieldName}: (${field.fieldType}) ${field.required ? "Required" : "Optional"}`;
    }).join("\n");

    // Step 2: Construct the prompt including the transcription and template details
    const prompt = `
      You are given a patient's transcription data and the information about the template that needs to be filled. Your task is to extract relevant information from the transcription text to fill the provided template fields. 

      Here is the template you need to fill:
      ${templateFieldsDescription}

      Transcription:
      "${transcriptionText}"
      
      Please extract and provide the information in the following JSON format:
      {
        "name": "Extracted name",
        "age": "Extracted age",
        "symptoms": "Extracted symptoms",
        "lastMenstrualPeriod": "Extracted last menstrual period",
        "previousPregnancyComplications": "Extracted complications if available",
        "additionalFields": {
          // Include any additional fields found based on the template, for example:
          "FieldName1": "Value1",
          "FieldName2": "Value2"
        }
      }
    `;

    // Step 3: Make a request to the OpenAI API with the prompt
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
    });

    // Step 4: Extract the response text
    const responseText = completion.choices[0].message.content;
    console.log("GPT Response:", responseText);

    // Step 5: Parse the JSON output from the response
    const extractedData = JSON.parse(responseText);

    return extractedData;
  } catch (error) {
    console.error("Error calling OpenAI API:", error.message);
    throw new Error("Failed to extract information from transcription.");
  }
}

module.exports = { analyzeTranscriptionWithGPT };
