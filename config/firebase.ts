import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyAiRQG1JnLIac5HLVRh_MfB2BSXPM47hHI",
  authDomain: "trark-83dda.firebaseapp.com",
  projectId: "trark-83dda",
  storageBucket: "trark-83dda.firebasestorage.app",
  messagingSenderId: "1086911822609",
  appId: "1:1086911822609:web:d85fdcc71c66e91397aab0",
  measurementId: "G-22RNVK49FD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize analytics only if supported (browser environment)
let analytics: any = null;
// if (typeof window !== 'undefined') {
//   isSupported().then((supported) => {
//     if (supported) {
//       analytics = getAnalytics(app);
//     }
//   });
// }

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
