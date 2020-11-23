import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
import "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBbFZUWYqqDKOma26u_YFFlfKYA3IWcRSQ",
  authDomain: "notes-app-vue-a42c9.firebaseapp.com",
  databaseURL: "https://notes-app-vue-a42c9.firebaseio.com",
  projectId: "notes-app-vue-a42c9",
  storageBucket: "notes-app-vue-a42c9.appspot.com",
  messagingSenderId: "922800962658",
  appId: "1:922800962658:web:f0332786319f584b48a53b"
};

firebase.initializeApp(firebaseConfig);

export default firebase;
