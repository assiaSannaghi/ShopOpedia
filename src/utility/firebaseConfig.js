// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"
import { getAuth } from "firebase/auth"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDoY6m4Vtza_4sLtG2_piXdQF8xZkG1dzo",
    authDomain: "shopopedia-24844.firebaseapp.com",
    projectId: "shopopedia-24844",
    storageBucket: "shopopedia-24844.firebasestorage.app",
    messagingSenderId: "214894811829",
    appId: "1:214894811829:web:eb9672b2263eb221c9bcfc"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app)
const auth = getAuth(app)

export { app as firebaseApp, db, auth }