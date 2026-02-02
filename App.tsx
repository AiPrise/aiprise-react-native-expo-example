import { Button, SafeAreaView, StyleSheet, Text, View } from "react-native";

import { useCameraPermissions } from "expo-camera";
import { AiPriseButton } from "aiprise-react-native-sdk";

export default function App() {


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
