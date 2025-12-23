import { initializeApp } from 'firebase/app';
import { getAuth, RecaptchaVerifier } from 'firebase/auth';
import { getAnalytics } from 'firebase/analytics';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBpOGCUDuXPliILU3fEDYVLFxMjN5Ht8ok",
  authDomain: "manvaasam-a2182.firebaseapp.com",
  projectId: "manvaasam-a2182",
  storageBucket: "manvaasam-a2182.firebasestorage.app",
  messagingSenderId: "776371797902",
  appId: "1:776371797902:web:4e96f391faf2ffb7bd6edf",
  measurementId: "G-T90E0EFGL2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;

export { auth, RecaptchaVerifier };

export const setupRecaptcha = (elementId: string) => {
  return new RecaptchaVerifier(auth, elementId, {
    size: 'invisible',
  });
};
