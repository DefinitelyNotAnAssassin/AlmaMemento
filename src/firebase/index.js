import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyCV7PyJD_6x3_yI-Ow247qxrXTF5Q4w6Ro",
  authDomain: "almamemento2.firebaseapp.com",
  projectId: "almamemento2",
  storageBucket: "almamemento2.appspot.com",
  messagingSenderId: "699584866738",
  appId: "1:699584866738:web:51fc91824accba66421cab",
  measurementId: "G-RDED32M0BD"
}

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);


export { db, storage };
