 NextMed Application

 Overview

NextMed is a full-stack medical application developed as a diploma project. The system assists doctors in documenting patient consultations by enabling audio recording, transcription using AWS services, structured data extraction, and template-based medical reporting. The application is designed to improve the efficiency and accuracy of medical recordkeeping.

 Key Features

- Audio recording of patient consultations
- Automatic transcription using AWS Transcribe
- Named entity recognition using AWS Comprehend
- Template-based report generation tailored to medical specialties
- Doctor and patient profile management
- Cloud storage for audio files using AWS S3
- Secure authentication and role-based access control
- MongoDB Atlas for cloud database management

Technologies Used

**Frontend:**  
- React Native (Expo)  
- React Redux  
- NativeWind  

**Backend:**  
- Node.js  
- Express.js  
- MongoDB (Atlas)

**Cloud Services:**  
- AWS S3  
- AWS Transcribe  
- AWS Comprehend  
- AWS IAM

How to Use

Backend Setup

1. Navigate to the backend folder:
   ```bash
   cd NextMedBack

2. Install dependencies:
    npm install

3. Configure environment variables in a .env file:
    MONGODB_URI

    AWS_ACCESS_KEY_ID

    AWS_SECRET_ACCESS_KEY

    S3_BUCKET_NAME

    AWS_REGION

4. Start the backend server:
    node index.js

 Mobile App Setup

1. Navigate to the mobile frontend folder:
    cd NextMedMobile

2. Install dependencies:
    npm install

3. Start the development server:
    npx expo start

4. Open the app on a physical device using Expo Go or in an emulator.