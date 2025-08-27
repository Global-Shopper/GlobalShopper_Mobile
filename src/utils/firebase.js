import { initializeApp } from 'firebase/app';
import { getMessaging } from "firebase/messaging";

// TODO: Replace the following with your app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCdWCgf0nl6pGpXsvXNOvtNeuG9ZycIYJE",
    authDomain: "globalshopper-54484.firebaseapp.com",
    projectId: "globalshopper-54484",
    storageBucket: "globalshopper-54484.firebasestorage.app",
    messagingSenderId: "180078038826",
    appId: "1:180078038826:web:d07314c8a28628fe099853",
    measurementId: "G-DJPWLHETHB"
  };

  const app = initializeApp(firebaseConfig);
  const messaging = getMessaging(app);