# AiPrise React Native Expo Example

An example application demonstrating how to integrate the [AiPrise React Native SDK](https://www.npmjs.com/package/aiprise-react-native-sdk) into an Expo project for automated KYC (Know Your Customer) and identity verification workflows.

AiPrise provides identity verification, document verification, biometric liveness checks, and AML compliance across emerging and global markets. This example demonstrates camera permissions handling, SDK configuration, and lifecycle event management within an Expo (SDK 52) and React Native application.

---

## Features

- **Pre-built Verification UI**: Launch AiPrise's hosted verification flow directly from your React Native app using `AiPriseButton`.
- **Camera Permissions Handling**: Automated runtime permission requests using `expo-camera`.
- **Lifecycle Event Hooks**: Comprehensive callbacks for `onStart`, `onResume`, `onSuccess`, `onComplete`, `onError`, and `onAbandoned`.
- **TypeScript Ready**: Full type safety with pre-configured types from `aiprise-react-native-sdk`.
- **Sandbox & Production Support**: Easily toggle between testing and live environments.

---

## Prerequisites

Before getting started, make sure you have:

- [Node.js](https://nodejs.org/) (v18.x or v20.x LTS recommended)
- `npm`, `yarn`, or `pnpm`
- An [AiPrise Account](https://www.aiprise.com/) and an active **Template ID** from your [AiPrise Dashboard](https://dashboard.aiprise.com/)
- For physical device testing: [Expo Go](https://expo.dev/go) installed on your mobile device (available on iOS App Store and Google Play Store)
- For simulator testing: Xcode (macOS only) for iOS Simulator, or Android Studio for Android Emulator

---

## Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/AiPrise/aiprise-react-native-expo-example.git
   cd aiprise-react-native-expo-example
   ```

2. **Install project dependencies:**

   ```bash
   npm install
   ```

   Key dependencies included:
   - `aiprise-react-native-sdk`: AiPrise React Native component library
   - `react-native-webview`: Required by the SDK to render the verification interface
   - `expo-camera`: Used to request and verify camera permissions before launching the flow

---

## Configuration

### 1. Set Your Template ID

Open `App.tsx` and replace `"YOUR_TEMPLATE_ID"` with your actual Template ID obtained from the [AiPrise Dashboard](https://dashboard.aiprise.com/):

```tsx
<AiPriseButton
  mode="SANDBOX"
  templateID="YOUR_ACTUAL_TEMPLATE_ID"
  // ...
/>
```

### 2. Select Environment Mode

The SDK supports two environment modes:

- `mode="SANDBOX"`: For development and testing with sample ID documents and test profiles.
- `mode="PRODUCTION"`: For live identity verifications in production.

---

## Camera Permissions Setup

Identity verification requires camera access to capture government-issued identification documents and biometric selfies/liveness checks.

### Expo Managed Workflow (`app.json`)

The `expo-camera` plugin is configured in `app.json` to automatically inject the required permissions during build or prebuild:

```json
{
  "expo": {
    "plugins": [
      [
        "expo-camera",
        {
          "cameraPermission": "Allow $(PRODUCT_NAME) to access your camera for identity verification."
        }
      ]
    ]
  }
}
```

### Bare React Native / Custom Native Config

If you generate native projects with `npx expo prebuild` or use Bare React Native:

- **iOS (`ios/<ProjectName>/Info.plist`)**:
  ```xml
  <key>NSCameraUsageDescription</key>
  <string>Allow access to the camera to take photos of identity documents and selfies for verification.</string>
  ```

- **Android (`android/app/src/main/AndroidManifest.xml`)**:
  ```xml
  <uses-permission android:name="android.permission.CAMERA" />
  ```

### Runtime Permission Check

In `App.tsx`, permissions are verified prior to presenting the verification button:

```tsx
const [permission, requestPermission] = useCameraPermissions();

if (!permission) {
  return <View style={styles.container} />;
}

if (!permission.granted) {
  return (
    <View style={styles.container}>
      <Text style={styles.permissionText}>
        We need your permission to access the camera for identity verification.
      </Text>
      <Button onPress={requestPermission} title="Grant Permission" />
    </View>
  );
}
```

---

## Running the Application

Start the Expo development server:

```bash
npx expo start
```

### Running on a Physical Device

1. Open the **Expo Go** app on your device:
   - **Android**: Scan the QR code shown in the terminal.
   - **iOS**: Scan the QR code with the default Camera app and tap the prompt to open in Expo Go.
2. Grant camera permissions when prompted.
3. Tap the AiPrise verification button to launch the identity verification flow.

### Running on Emulators

- Press <kbd>i</kbd> in the terminal to launch the **iOS Simulator**.
- Press <kbd>a</kbd> in the terminal to launch the **Android Emulator**.
- Press <kbd>r</kbd> to reload the application.

---

## Component Reference

### `AiPriseButton`

The primary interactive component that renders a launch button and manages the verification modal.

#### Core Props

| Prop | Type | Required | Description |
| :--- | :--- | :---: | :--- |
| `mode` | `"SANDBOX" \| "PRODUCTION"` | **Yes** | Verification environment mode. |
| `templateID` | `string` | **Yes** | Your AiPrise Template ID configuring the verification steps. |
| `sessionID` | `string` | No | Resume an in-progress verification session. |
| `onboardingSessionToken` | `string` | No | Session token for pre-authenticated onboarding sessions. |
| `title` | `string` | No | Custom text label displayed on the button. |
| `clientReferenceID` | `string` | No | Custom reference identifier from your system for correlation. |
| `userData` | `AiPriseUserData` | No | Pre-filled user data (name, email, DOB, address, phone number). |
| `businessData` | `AiPriseBusinessData` | No | Pre-filled company data for KYB workflows. |
| `theme` | `AiPriseThemeOptions` | No | Custom styling tokens (colors, font, border radius, background). |
| `uiOptions` | `object` | No | UI language and country restriction options. |
| `style` | `ViewStyle` | No | Style object applied to the button container. |

#### Event Callbacks

| Event | Signature | Description |
| :--- | :--- | :--- |
| `onStart` | `(sessionId?: string) => void` | Invoked when the verification flow opens. |
| `onResume` | `(sessionId?: string) => void` | Invoked when an existing session resumes. |
| `onSuccess` | `(sessionId?: string) => void` | Invoked when the user completes and submits the verification form (note: final KYC decision is delivered asynchronously via webhook). |
| `onComplete` | `(sessionId?: string) => void` | Invoked when the user finishes all verification steps. |
| `onError` | `(errorCode: string) => void` | Invoked when an error occurs during the verification flow. |
| `onAbandoned` | `(sessionId?: string) => void` | Invoked if the user closes or dismisses the flow before completing. |

#### Example Usage with Callbacks & User Pre-fill

```tsx
import { AiPriseButton } from "aiprise-react-native-sdk";

<AiPriseButton
  mode="SANDBOX"
  templateID="YOUR_TEMPLATE_ID"
  clientReferenceID="user_usr_12345"
  userData={{
    first_name: "Jane",
    last_name: "Doe",
    email_address: "jane.doe@example.com",
    phone_number: "+15551234567",
  }}
  onStart={(sessionId) => {
    console.log("Verification started with session ID:", sessionId);
  }}
  onSuccess={(sessionId) => {
    console.log("Verification form submitted with session ID:", sessionId);
  }}
  onComplete={(sessionId) => {
    console.log("Session completed:", sessionId);
  }}
  onError={(errorCode) => {
    console.error("Verification error encountered:", errorCode);
  }}
  onAbandoned={(sessionId) => {
    console.log("User dismissed verification:", sessionId);
  }}
/>
```

---

### `AiPriseFrame`

For inline or full-screen integrations without a modal trigger, use `AiPriseFrame`:

```tsx
import { AiPriseFrame } from "aiprise-react-native-sdk";

<AiPriseFrame
  mode="SANDBOX"
  templateID="YOUR_TEMPLATE_ID"
  style={{ flex: 1, width: "100%" }}
  onSuccess={(sessionId) => console.log("Success:", sessionId)}
  onError={(errorCode) => console.error("Error:", errorCode)}
/>
```

---

## Project Structure

```text
aiprise-react-native-expo-example/
├── assets/                 # App icons and splash assets
├── App.tsx                 # Main application component with camera permissions & AiPriseButton
├── app.json                # Expo configuration file and camera plugin settings
├── index.ts                # Application root entry point
├── package.json            # Project dependencies and npm scripts
├── tsconfig.json           # TypeScript configuration
└── README.md               # Integration guide and documentation
```

---

## Documentation & Support

- [AiPrise Official Website](https://www.aiprise.com/)
- [AiPrise Developer Documentation](https://docs.aiprise.com/)
- [AiPrise React Native SDK Documentation](https://docs.aiprise.com/docs/react-native-sdk)
- [AiPrise npm Package](https://www.npmjs.com/package/aiprise-react-native-sdk)
