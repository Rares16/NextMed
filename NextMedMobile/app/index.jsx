import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  Text,
  TouchableOpacity,
  Image,
  Dimensions,
} from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import { useRouter } from "expo-router";
import { useMutation } from "@tanstack/react-query";
import { loginUser } from "./(services)/api/api";
import { useDispatch, useSelector } from "react-redux";
import { loginAction } from "./(redux)/authSlice";

import logoStyle from "../styles/logo";

// Calculate 80% of screen width for consistent width
const screenWidth = Dimensions.get("window").width;
const componentWidth = screenWidth * 0.8;

// Color palette
const colors = {
  background: "#f1f9ff",
  inputBackground: "#ccecee",
  primaryText: "#095d7e",
  buttonBackground: "#14967f",
  buttonText: "#ffffff",
};

const LoginSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string().min(6, "Too Short!").required("Password is required"),
});

export default function Login() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [errorMessage, setErrorMessage] = useState(null);
  
  const mutation = useMutation({
    mutationFn: loginUser,
    mutationKey: ["login"],
  });
  
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    if (router.isReady && user) {
      router.replace(`/profile?doctorId=${id}`);

    }
  }, [user, router.isReady]);

  return (
    <View style={styles.container}>
      <Image source={require('../assets/logo.png')} style={logoStyle} />
      <Formik
        initialValues={{ email: "", password: "" }}
        validationSchema={LoginSchema}
        onSubmit={(values) => {
          setErrorMessage(null); // Reset error message before attempt

          // Perform the login mutation
          mutation
            .mutateAsync(values)
            .then((data) => {
              // Extract the necessary data from response
              const { id, name, email, hospital, role, token } = data;

              // Dispatch Redux action to store user data
              dispatch(loginAction({
                id,
                name,
                email,
                hospital,
                role,
                token,
              }));

              // Navigate to the Profile screen with the doctorId as a query parameter
              router.push(`/profile?doctorId=${id}`);
              
            })
            .catch((err) => {
              console.error(err);
              setErrorMessage("Login failed. Please check your credentials.");
            });
        }}
      >
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          errors,
          touched,
        }) => (
          <View style={styles.form}>
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor={colors.primaryText}
              onChangeText={handleChange("email")}
              onBlur={handleBlur("email")}
              value={values.email}
              keyboardType="email-address"
            />
            {errors.email && touched.email ? (
              <Text style={styles.errorText}>{errors.email}</Text>
            ) : null}
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor={colors.primaryText}
              onChangeText={handleChange("password")}
              onBlur={handleBlur("password")}
              value={values.password}
              secureTextEntry
            />
            {errors.password && touched.password ? (
              <Text style={styles.errorText}>{errors.password}</Text>
            ) : null}
            {errorMessage && (
              <Text style={styles.errorText}>{errorMessage}</Text>
            )}
            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
              <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>
          </View>
        )}
      </Formik>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    backgroundColor: colors.background,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: colors.primaryText,
    marginBottom: 20,
  },
  form: {
    width: componentWidth,
  },
  input: {
    height: 50,
    borderColor: colors.primaryText,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 16,
    backgroundColor: colors.inputBackground,
    color: colors.primaryText,
  },
  errorText: {
    color: "red",
    marginBottom: 16,
  },
  button: {
    height: 50,
    backgroundColor: colors.buttonBackground,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    marginTop: 16,
  },
  buttonText: {
    color: colors.buttonText,
    fontSize: 18,
    fontWeight: "bold",
  },
});
