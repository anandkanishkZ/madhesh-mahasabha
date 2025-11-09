// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBjKSH2rPa9IrmYJ9H3ckysO36fuJ0EaT4",
  authDomain: "h-mahasabha.firebaseapp.com",
  projectId: "h-mahasabha",
  storageBucket: "h-mahasabha.firebasestorage.app",
  messagingSenderId: "531188368661",
  appId: "1:531188368661:web:16faaa65de52839530551c",
  measurementId: "G-TZ35B28JSL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Analytics (only in browser)
let analytics;
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}

// Initialize Firestore
const db = getFirestore(app);

export { app, analytics, db };