import { initializeApp } from "firebase/app";
import { initializeFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyB1yhSkTxfD8UmxbmcP_wc_DXm6dlDk8EM",
  authDomain: "keystoneassessment-dca5f.firebaseapp.com",
  projectId: "keystoneassessment-dca5f",
  storageBucket: "keystoneassessment-dca5f.appspot.com",
  messagingSenderId: "151015718713",
  appId: "1:151015718713:web:256a27ae133dfb400c72e8",
};

export const firebase_app = initializeApp(firebaseConfig);
export const firebase_storage = getStorage(firebase_app);
export const firebase_db = initializeFirestore(firebase_app, {
  experimentalForceLongPolling: true,
});
