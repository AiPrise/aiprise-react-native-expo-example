import { StatusBar } from "expo-status-bar";
import { Button, StyleSheet, Text, View } from "react-native";
import { useCameraPermissions } from "expo-camera";
import { AiPriseButton } from "aiprise-react-native-sdk";

export default function App() {
  const [permission, requestPermission] = useCameraPermissions();

  // Camera permissions are still loading
  if (!permission) {
    return <View style={styles.container} />;
  }

  // Camera permissions are not granted yet
  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.permissionText}>
          We need your permission to access the camera for identity verification.
        </Text>
        <Button onPress={requestPermission} title="Grant Permission" />
        <StatusBar style="auto" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <AiPriseButton
        mode="SANDBOX"
        templateID="YOUR_TEMPLATE_ID"
        onStart={(sessionId) => {
          console.log("Verification started. Session ID:", sessionId);
        }}
        onSuccess={(sessionId) => {
          console.log("Verification successful. Session ID:", sessionId);
        }}
        onComplete={(sessionId) => {
          console.log("Verification completed. Session ID:", sessionId);
        }}
        onError={(errorCode) => {
          console.error("Verification error:", errorCode);
        }}
      />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  permissionText: {
    textAlign: "center",
    marginBottom: 16,
    fontSize: 16,
    color: "#333",
  },
});
