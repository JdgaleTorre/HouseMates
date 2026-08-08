# HouseMates

Shared household app for roommates. First feature: a live "needs list" (shopping list) scoped to a house, joined via an invite code.

## Stack

- Expo (React Native, TypeScript)
- NativeWind (Tailwind for React Native)
- Firebase: Firestore (data) + Firebase Auth (Google OAuth2 via `@react-native-google-signin/google-signin`, requires a custom EAS dev client — see below)

## Setup

1. Install dependencies:
   ```
   npm install
   ```

2. Create a Firebase project at https://console.firebase.google.com:
   - Add a **Web app** to the project (Expo apps use the Firebase JS SDK, registered as "Web" even for mobile) — this gives you the config values below.
   - **Authentication → Sign-in method**: enable **Google** and **Anonymous**.
   - **Firestore Database**: create it in production/locked mode (not test mode).

3. Copy `.env.example` to `.env` and fill in the values from your Firebase Web app config:
   ```
   cp .env.example .env
   ```

4. Deploy the security rules in `firestore.rules` using the Firebase CLI via `npx` (no global install needed — `npm install -g firebase-tools` will fail with an `EACCES` permission error on systems where the global npm prefix isn't user-writable, e.g. Arch/CachyOS):
   ```
   npx firebase-tools login
   npx firebase-tools use --add   # select your Firebase project
   npx firebase-tools deploy --only firestore:rules
   ```
   (Or paste the contents of `firestore.rules` into the Firebase console's Rules editor.)

5. Start the app and open it in Expo Go on your phone:
   ```
   npx expo start
   ```

## Google Sign-In setup (required before this will run at all)

Expo Go cannot do native Google Sign-In — it needs a custom **EAS dev client** build. Steps:

1. **Get the Web client ID.** When you enabled the Google provider in Firebase Authentication, Firebase auto-created an OAuth client in the same Google Cloud project. Go to [Google Cloud Console → APIs & Services → Credentials](https://console.cloud.google.com/apis/credentials) (same project as your Firebase project), find **"Web client (auto created by Google Service)"**, copy its Client ID, and set it as `EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID` in `.env`.

2. **Log in to EAS** (free account, via `npx` so it doesn't hit the same global-install permission issue as firebase-tools):
   ```
   npx eas-cli login
   npx eas-cli build:configure
   ```
   This will ask to link/create an EAS project and writes a project ID into `app.json`.

3. **Build the Android dev client:**
   ```
   npx eas-cli build --profile development --platform android
   ```
   This builds in the cloud (~10–15 min) and gives you an APK link/QR to install directly on your phone — no Android Studio needed.

4. **Register the Android OAuth client.** After the build finishes, get the SHA-1 fingerprint EAS generated:
   ```
   npx eas-cli credentials
   ```
   (Android → select the development build's keystore → view SHA-1.) Then in Google Cloud Console, create a new **Android** OAuth client ID using package name `com.josegale.housemates` and that SHA-1. No app code changes needed for this — it's purely a Google Cloud registration.

5. **Install the dev client build on your phone** (from the EAS build link), then run:
   ```
   npx expo start --dev-client
   ```
   and open the app from the dev client (not Expo Go).

6. **For iOS** (skip if only testing Android for now): create an **iOS** OAuth client ID in Google Cloud Console using bundle ID `com.josegale.housemates`, then add its *reversed* client ID as `iosUrlScheme` in the `@react-native-google-signin/google-signin` plugin entry in `app.json`, before running `npx eas-cli build --profile development --platform ios`.

Apple Sign-In is also required by Apple before real App Store submission (alongside any other third-party social login) — not built yet, tracked as a follow-up.
