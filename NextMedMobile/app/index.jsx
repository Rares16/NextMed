import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Image,
  Dimensions,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import { useRouter } from "expo-router";
import { useMutation } from "@tanstack/react-query";
import { loginUser } from "./(services)/api/api";
import { useDispatch, useSelector } from "react-redux";
import { loginAction } from "./(redux)/authSlice";

import logoStyle from "../styles/logo";
import formStyle from "../styles/form";
import buttonStyle from "../styles/button";
import { colors } from "../styles/colors";

// Calculate 80% of screen width for consistent width
const screenWidth = Dimensions.get("window").width;
const componentWidth = screenWidth * 0.8;

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
      router.replace(`/profile?doctorId=${user.id}`);
    }
  }, [user, router.isReady]);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.background }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, justifyContent: "center", alignItems: "center", padding: 16 }}
        keyboardShouldPersistTaps="handled"
      >
        <Image source={require("../assets/logo.png")} style={logoStyle} />
        <Text
          style={{
            fontSize: 14,
            color: colors.primaryText,
            textAlign: "center",
            marginBottom: 20,
            paddingHorizontal: 20,
            fontWeight: "300",
          }}
        >
          We take care of your paperwork so you can take care of your patients
        </Text>

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
                dispatch(
                  loginAction({
                    id,
                    name,
                    email,
                    hospital,
                    role,
                    token,
                  })
                );

                // Navigate to the Profile screen with the doctorId as a query parameter
                router.push(`/profile?doctorId=${id}`);
              })
              .catch((err) => {
                console.error(err);
                setErrorMessage("Login failed. Please check your credentials.");
              });
          }}
        >
          {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
            <View style={formStyle.form}>
              <TextInput
                style={formStyle.input}
                placeholder="Email"
                placeholderTextColor={colors.primaryText}
                onChangeText={handleChange("email")}
                onBlur={handleBlur("email")}
                value={values.email}
                keyboardType="email-address"
              />
              {errors.email && touched.email ? (
                <Text style={formStyle.errorText}>{errors.email}</Text>
              ) : null}

              <TextInput
                style={formStyle.input}
                placeholder="Password"
                placeholderTextColor={colors.primaryText}
                onChangeText={handleChange("password")}
                onBlur={handleBlur("password")}
                value={values.password}
                secureTextEntry
              />
              {errors.password && touched.password ? (
                <Text style={formStyle.errorText}>{errors.password}</Text>
              ) : null}
              {errorMessage && <Text style={formStyle.errorText}>{errorMessage}</Text>}

              <TouchableOpacity style={buttonStyle.button} onPress={handleSubmit}>
                <Text style={buttonStyle.buttonText}>Login</Text>
              </TouchableOpacity>
            </View>
          )}
        </Formik>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
