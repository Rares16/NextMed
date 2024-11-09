// styles/logo.js

import { Dimensions } from "react-native";

// Get the screen width
const screenWidth = Dimensions.get("window").width;

// Define the logo style
const logoStyle = {
  width: screenWidth * 0.8, // Resize to 60% of the screen width
  height: undefined,        // Maintain aspect ratio
  aspectRatio: 1,           // Aspect ratio to keep it proportional
  marginBottom: 32,         // Adjust the spacing as needed
  resizeMode: "contain",    // Scale the content of the image proportionally
};

export default logoStyle;
