
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, GithubAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
    apiKey: "AIzaSyCk6J26tOUmbbVZiYj7pKHAiAh2wQ-Rue4",
    authDomain: "my-portfolio-712f5.firebaseapp.com",
    projectId: "my-portfolio-712f5",
    storageBucket: "my-portfolio-712f5.firebasestorage.app",
    messagingSenderId: "1025771522515",
    appId: "1:1025771522515:web:1ac9f2b5eb89fd9b4cc726",
    measurementId: "G-SEZ39YKMMR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);

// Initialize Services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
export const githubProvider = new GithubAuthProvider();

export default app;
