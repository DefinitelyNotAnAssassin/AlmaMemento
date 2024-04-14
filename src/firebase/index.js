import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyBGADdsBQqBwE08FjBC0UyY6rRAAXPuTU4',
  authDomain: 'almamemento-6c12e.firebaseapp.com',
  projectId: 'almamemento-6c12e',
  storageBucket: 'almamemento-6c12e.appspot.com',
  messagingSenderId: '732279676471',
  appId: '1:732279676471:web:ad1bef8499e4b3606769b2'
}

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);


export { db, storage };
