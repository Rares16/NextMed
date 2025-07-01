import { Dimensions } from "react-native";

const screenWidth = Dimensions.get("window").width;

const logoStyle = {
  width: screenWidth * 0.8,
  height: undefined,
  aspectRatio: 1,
  marginBottom: 32,
  resizeMode: "contain",
};

export default logoStyle;
