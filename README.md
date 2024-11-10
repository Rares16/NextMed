# NextMed Application 📱💉

![NextMed Logo](https://ibb.co/QK8qdZy) <!-- You can replace this with your actual logo -->

[![Node.js](https://img.shields.io/badge/Node.js-14%2B-green)](https://nodejs.org/)
[![React Native](https://img.shields.io/badge/React%20Native-0.63-blue)](https://reactnative.dev/)
[![License](https://img.shields.io/badge/License-MIT-yellow)](./LICENSE)
[![AWS](https://img.shields.io/badge/AWS-S3%20%7C%20Transcribe-orange)](https://aws.amazon.com/)

---

## 🚀 Overview

**NextMed** is an innovative medical application designed to streamline the documentation process for healthcare providers, enabling doctors to manage patient information more efficiently. With integrated features such as:

- Audio Recording and Transcription 🎤📝
- Customized Templates 📋
- Comprehensive Patient Management 🧑‍⚕️👨‍⚕️

NextMed helps medical professionals focus more on **patient care** and less on **paperwork**.

The project is comprised of:
- A **mobile application** for doctors (built with **React Native**).
- A **backend server** for data storage and processing (built with **Node.js** and **MongoDB**).

![NextMed Workflow] <!-- Add workflow images if available -->

---

## 🌟 Features

- **🎤 Audio Recording**: Doctors can record patient descriptions and other notes, which are transcribed automatically.
- **📝 Customized Templates**: Create, customize, and reuse medical templates for efficient documentation.
- **👥 Patient Management**: Manage a list of patients, each linked to a specific doctor.
- **🔐 Authentication**: Secure user authentication system for doctors.
- **☁️ AWS Integration**: Uses AWS S3 for file storage and AWS Transcribe for transcription services.

---

## 🛠️ Technologies Used

### 📱 Mobile Application
- **React Native**: Cross-platform development for iOS and Android.
- **Expo Router**: Manage in-app navigation effortlessly.
- **React Redux**: Manages state across the application.
- **React Query**: Data fetching, caching, and synchronization.
- **NativeWind**: Tailwind CSS-like styling for React Native.

### 🖥️ Backend Server
- **Node.js** and **Express**: Backend API services.
- **MongoDB with Mongoose**: Database for storing doctor information, templates, and patient data.
- **AWS S3**: Storage for audio files.
- **AWS Transcribe**: Converts audio files to text.
- **AWS Comprehend**: Extracts medical information from text to populate templates.
- **Bcrypt**: For hashing passwords for secure authentication.

### 🔧 Other Tools
- **Formik + Yup**: For form handling and validation.
- **Expo AV (Audio)**: For recording audio files.
- **Axios**: For HTTP requests to communicate with the backend.
- **Multer**: Handles file uploads on the backend.

---
