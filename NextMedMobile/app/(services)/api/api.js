import axios from "axios";
//import A_URL from ".env";

const DB_URL = "http://192.168.1.243:3000/"; // Use the IP address of the computer running the server

// Login User
export const loginUser = async (user) => {
  console.log(user);
  const response = await axios.post(
    `${DB_URL}auth/login`,
    user,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  console.log('here');
  return response.data;
};

// Fetch Doctor Info
export const getDoctorInfo = async (doctorId) => {
  try {
    const response = await axios.get(
      `${DB_URL}api/doctor/${doctorId}`,
      {
        headers: {
          "Content-Type": "application/json",
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching doctor info:', error);
    throw error; // Re-throw the error so it can be handled where this function is called
  }
};
export const getPatientInfo = async (patientID) => {
  try {
    console.log('Fetching data for patient ID:', patientID); // Log patientID
    const response = await axios.get(
      `${DB_URL}api/patient/${patientID}`,
      {
        headers: {
          "Content-Type": "application/json",
        }
      }
    );
    console.log('Response:', response.data); // Log response to see the data
    return response.data;
  } catch (error) {
    console.error(`Error fetching patient information for ID: ${patientID}`, error);
    throw error;
  }
};

// Fetch customized templates for a specific doctor
export const getCustomizedTemplates = async (doctorId) => {
  try {
    if (!doctorId) {
      throw new Error("Doctor ID is required for fetching templates");
    }

    const response = await axios.get(`${DB_URL}templates/my/${doctorId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching customized templates:", error);
    throw error;
  }
};

// Fetch default templates by specialty
export const getTemplatesBySpecialty = async (specialty) => {
  if (!specialty) throw new Error('No specialty provided');
  const response = await axios.get(`${DB_URL}templates/specialty/${specialty}`);
  return response.data;
};

// Fetch template by ID
export const getTemplateById = async (templateId) => {
  try {
    const response = await axios.get(`${DB_URL}templates/${templateId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching template by ID:', error);
    throw error;
  }
};

// Update template by ID
export const updateTemplateById = async (templateId, updates, doctorId) => {
  console.log('Log doctor:',doctorId);
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  try {
    // Combine updates and doctorId into a single request body object
    const requestBody = {
      ...updates,
      ...(doctorId && { doctorId }) // Only include doctorId if it's provided
    };

    const response = await axios.patch(
      `${DB_URL}templates/${templateId}`,
      requestBody, // Send as single object
      config
    );
    
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteTemplateById = async (templateId) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  try {
    const response = await axios.delete(`${DB_URL}templates/${templateId}`, config);
    return response.data;
  } catch (error) {
    throw error;
  }
};


export const uploadAudioForTranscription = async (audioFileUri) => {
    try {
      console.log('Starting uploadAudioForTranscription function...');
  
      // Log the URI of the audio file received
      console.log('Audio file URI:', audioFileUri);
  
      if (!audioFileUri) {
        console.error('No audio file URI provided');
        throw new Error('No audio file URI provided');
      }
  
      // Creating FormData to send the audio file
      const formData = new FormData();
      const audioFileObject = {
        uri: audioFileUri,
        name: 'recording.3gp', // Use the appropriate file extension
        type: 'audio/3gp',     // Correct MIME type for .3gp format
      };
  
      // Append the audio file to formData
      formData.append('audio', audioFileObject);
  
      // Log the formData details manually
      console.log('FormData content:');
      console.log('Field Name:', 'audio');
      console.log('File Data:', audioFileObject);
  
      // Sending POST request to the backend server
      console.log('Sending POST request to backend...');
      const response = await axios.post(`${DB_URL}api/transcription/upload-audio`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  
      // Log the response from the server
      console.log('Upload successful. Response data:', response.data);
  
      return response.data;
    } catch (error) {
      // Log the complete error object for better debugging
      console.error('Error uploading audio for transcription:', error);
      console.error('Error details:', error.message);
      console.error('Error code:', error.code);
  
      if (error.response) {
        console.error('Error response data:', error.response.data);
        console.error('Error response status:', error.response.status);
        console.error('Error response headers:', error.response.headers);
      } else if (error.request) {
        console.error('Error request:', error.request);
      } else {
        console.error('Error message:', error.message);
      }
  
      throw error;
    }
  };
  