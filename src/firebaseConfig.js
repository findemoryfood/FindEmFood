// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAVDxq4BnlyNupqAvxbb0VnCBrPjHX1E2A",
  authDomain: "find-em-food.firebaseapp.com",
  databaseURL: "https://find-em-food-default-rtdb.firebaseio.com",
  projectId: "find-em-food",
  storageBucket: "find-em-food.appspot.com",
  messagingSenderId: "593345581471",
  appId: "1:593345581471:web:aa587e53255f784e64edaa",
  measurementId: "G-0S1P4VR4SN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firebase Realtime Database
const database =  getDatabase(app);

// Export the database object
export { database };
export { app };