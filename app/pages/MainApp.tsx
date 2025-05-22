import React, { useRef } from "react";
import { View, StyleSheet, ActivityIndicator } from "react-native";
import { WebView } from "react-native-webview";
import AsyncStorage from "@react-native-async-storage/async-storage";

const MainApp: React.FC = ({ route }: any) => {
  const webviewRef = useRef<WebView>(null);

  React.useEffect(() => {
    const fetchStudentId = async () => {
      try {
        let studentId = await AsyncStorage.getItem("student_id");
        if (studentId) {
          studentId = String(studentId); 
          const injectedJavaScript = `
            (function() {
              window.studentData = {
                student_id: "${studentId}",
                API_KEY: "${process.env.EXPO_PUBLIC_API_KEY}"
              };
              console.log("Student data injected:", window.studentData);
            })();
            true; // Note: This is required for Android to signal completion
          `;
          webviewRef.current?.injectJavaScript(injectedJavaScript);
        }
      } catch (error) {
        console.error("Failed to fetch student_id from AsyncStorage:", error);
      }
    };

    fetchStudentId();
  }, []);

  return (
    <View style={styles.container}>
      <WebView
        ref={webviewRef}
        source={{
          uri: "https://87abc270-1269-4d98-8dad-e53781a1ae52.e1-us-east-azure.choreoapps.dev",
        }}
        style={styles.webview}
        startInLoadingState={true}
        renderLoading={() => (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color="#0000ff" />
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webview: {
    flex: 1,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default MainApp;