import React, { useState } from "react";
import { View, Text, TextInput, Button, Alert, StyleSheet } from "react-native";

const OTP = ({ navigation }: any) => {
  const [otp, setOtp] = useState<string>("");

  const handleOtpSubmit = async () => {
    try {
      if (!otp) {
        throw new Error("Invalid OTP. Please enter a valid OTP.");
      }

      const response = await fetch(
        "https://87e89eab-95e5-4c0f-8192-7ee0196e1581-dev.e1-us-east-azure.choreoapis.dev/employee-mgmt-system/student-mgmt-server/v1.0/validate-otp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "api-key": process.env.EXPO_PUBLIC_API_KEY,
            "otp-code": otp, // Pass OTP in the header
          },
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("API Error:", {
          status: response.status,
          statusText: response.statusText,
          responseBody: errorText,
        });
        throw new Error("Failed to validate OTP");
      }

      const data = await response.json();

      const { message } = data;

      if (message !== "Authentication successful") {
        throw new Error(message || "Invalid response from server");
      }

      // Navigate to MainApp without passing bearer token
      navigation.navigate("MainApp");
    } catch (error) {
      console.error("Error during OTP validation:", {
        message: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : null,
        otpValue: otp,
      });
      Alert.alert(
        "Error",
        error instanceof Error ? error.message : "An unknown error occurred"
      );
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Enter OTP</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter OTP"
        value={otp}
        onChangeText={setOtp} // Get otp as a string
        keyboardType="numeric"
      />
      <Button title="Submit" onPress={handleOtpSubmit} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
  },
  input: {
    width: "80%",
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 8,
  },
});

export default OTP;