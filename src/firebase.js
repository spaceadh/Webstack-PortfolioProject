import firebase from "firebase/app";
import "firebase/analytics";
import "firebase/firestore";
import "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAkoj-Qgg6naftJq1PAbAv3hlLt3nnwXVg",
  authDomain: "hospitalmanagment-e87e5.firebaseapp.com",
  databaseURL: "https://hospitalmanagment-e87e5-default-rtdb.firebaseio.com",
  projectId: "hospitalmanagment-e87e5",
  storageBucket: "hospitalmanagment-e87e5.appspot.com",
  messagingSenderId: "774783064434",
  appId: "1:774783064434:web:858edca20f2371938725eb"
};

const firebaseApp = firebase.initializeApp(firebaseConfig);
const provider = new firebase.auth.GoogleAuthProvider();
const db = firebaseApp.firestore();
const auth = firebase.auth();

export { auth, provider };
export default db;
