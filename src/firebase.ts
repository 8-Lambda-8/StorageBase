import { initializeApp } from "firebase/app";
import { getFirestore, enableIndexedDbPersistence } from "firebase/firestore";
import { getAuth } from "firebase/auth";

import firebase from "firebase/compat/app";
import * as firebaseui from "firebaseui";
import "firebaseui/dist/firebaseui.css";

const firebaseConfig = {
  apiKey: "AIzaSyBzZaiu-5LyOdSk8mUgOn9XSQqymu71PVk",
  authDomain: "storagebase-4cfb2.firebaseapp.com",
  projectId: "storagebase-4cfb2",
  storageBucket: "storagebase-4cfb2.appspot.com",
  messagingSenderId: "561550407112",
  appId: "1:561550407112:web:6651c71f149c1108ef7cfd",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
enableIndexedDbPersistence(db).catch((err) => {
  if (err.code == "failed-precondition") {
    console.error("Multiple tabs open, persistence can only be enabled in one tab at a a time");
  } else if (err.code == "unimplemented") {
    console.error("The current browser does not support all of the features required");
  }
});

//Initialize Auth
export const auth = getAuth();

export const ui = new firebaseui.auth.AuthUI(auth);

export const uiConfig = {
  signInSuccessUrl: "/",
  signInOptions: [
    firebase.auth.EmailAuthProvider.PROVIDER_ID,
    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
  ],
};
