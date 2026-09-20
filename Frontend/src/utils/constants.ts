/**
 * API base URL.
 *
 *  - Android emulator:      http://10.0.2.2:5000/api   (10.0.2.2 is the emulator's alias for your computer)
 *  - Physical device (USB): run `adb reverse tcp:5000 tcp:5000` and use http://localhost:5000/api
 *  - Physical device (Wi-Fi): use your computer's LAN IP, e.g. http://192.168.1.20:5000/api
 *  - Production:            your HTTPS URL, e.g. https://todo-api.example.com/api
 */
const DEV_API_URL = 'http://localhost:5000/api';
const PROD_API_URL = 'https://your-production-api.example.com/api';

export const API_BASE_URL = __DEV__ ? DEV_API_URL : PROD_API_URL;
