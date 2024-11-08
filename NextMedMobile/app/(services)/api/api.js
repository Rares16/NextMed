import axios from "axios";

// Login User
export const loginUser = async (user) => {
  const response = await axios.post(
    "http://192.168.1.102:3000/auth/login",
    user,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};

// Fetch Doctor Info
export const getDoctorInfo = async (doctorId) => {
  try {
    const response = await axios.get(
      `http://192.168.1.102:3000/api/doctor/${doctorId}`,
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
// Fetch customized templates for a specific doctor
export const getCustomizedTemplates = async (doctorId) => {
    try {
      if (!doctorId) {
        throw new Error("Doctor ID is required for fetching templates");
      }
  
      const response = await axios.get(`http://192.168.1.102:3000/templates/my/${doctorId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching customized templates:", error);
      throw error;
    }
  };

  
  // Fetch default templates by specialty
  export const getTemplatesBySpecialty = async (specialty) => {
    if (!specialty) throw new Error('No specialty provided');
    const response = await axios.get(`http://192.168.1.102:3000/templates/specialty/${specialty}`);
    return response.data;
  };
  export const getTemplateById = async (templateId) => {
    try {
      const response = await axios.get(`http://192.168.1.102:3000/templates/${templateId}`);
      
      return response.data;
    } catch (error) {
      console.error('Error fetching template by ID:', error);
      throw error;
    }
  };
  export const updateTemplateById = async (templateId, updates) => {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
  
    try {
      const response = await axios.patch(
        `http://192.168.1.102:3000/templates/${templateId}`,
        updates,
        config
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  };