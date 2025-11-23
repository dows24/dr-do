// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyAJkWcbKHExLIiYFQrhSOjSVEoqOaTnDF4",
    authDomain: "dr-do-branding.firebaseapp.com",
    projectId: "dr-do-branding",
    storageBucket: "dr-do-branding.firebasestorage.app",
    messagingSenderId: "695620694270",
    appId: "1:695620694270:web:6ef6553a11f555f0aff5af",
    measurementId: "G-JFTWHV8RGZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore(app);