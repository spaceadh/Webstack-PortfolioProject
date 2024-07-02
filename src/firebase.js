import firebase from "firebase/app";
import "firebase/analytics";
import "firebase/firestore";
import "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBzaItwwWPIiftTQIT1_bLnyU15NbTBBDM",
  authDomain: "jaybiecakes-6d4b1.firebaseapp.com",
  databaseURL: "https://jaybiecakes-6d4b1-default-rtdb.firebaseio.com",
  projectId: "jaybiecakes-6d4b1",
  storageBucket: "jaybiecakes-6d4b1.appspot.com",
  messagingSenderId: "286183429962",
  appId: "1:286183429962:web:2717bd9888488976b093b3",
  measurementId: "G-GZ6RPV8DTD"

};

const firebaseApp = firebase.initializeApp(firebaseConfig);
const provider = new firebase.auth.GoogleAuthProvider();
const db = firebaseApp.firestore();
const auth = firebase.auth();

export { auth, provider };
export default db;
