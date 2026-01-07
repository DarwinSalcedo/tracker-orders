# Tracker Orders - Mobile App

This is the mobile application for delivery personnel. Built with React Native and Expo.

## Setup

1.  **Install dependencies**:
    ```bash
    npm install
    ```

2.  **Configuration**:
    - The API URL is configured in `src/services/api.js`.
    - **Android Emulator**: Uses `http://10.0.2.2:3000`
    - **iOS Simulator**: Uses `http://localhost:3000`
    - **Physical Device**: You MUST update `src/services/api.js` with your computer's local IP address (e.g., `http://192.168.1.5:3000`).

## Running the App

1.  Ensure the **Backend** is running (`cd ../backend && npm start`).
2.  Start the mobile app:
    ```bash
    npx expo start
    ```
3.  Press `a` for Android Emulator or `i` for iOS Simulator.

## Features

- **Login**: Delivery personnel can log in.
- **My Deliveries**: View assigned shipments.
- **Order Details**: View route map and instructions.
- **Update Status**: Change status (Picked Up -> In Transit -> Delivered) and update location.
