import { Button, SafeAreaView, StyleSheet, Text, View } from "react-native";

import { useCameraPermissions } from "expo-camera";
import { AiPriseButton } from "aiprise-react-native-sdk";

export default function App() {
  const [permission, requestPermission] = useCameraPermissions();

  // Camera permissions are still loading
  if (!permission) {
    return <View />;
  }

  // Camera permissions are not granted yet
  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: "center" }}>
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title="Grant Permission" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <AiPriseButton
        mode="SANDBOX"
        templateID="YOUR_TEMPLATE_ID"
        style={{ marginLeft: "auto", marginRight: "auto" }} // Center the button
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
