import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: 'AIzaSyBGADdsBQqBwE08FjBC0UyY6rRAAXPuTU4',
  authDomain: 'almamemento-6c12e.firebaseapp.com',
  projectId: 'almamemento-6c12e',
  storageBucket: 'almamemento-6c12e.appspot.com',
  messagingSenderId: '732279676471',
  appId: '1:732279676471:web:ad1bef8499e4b3606769b2'
}

const firebaseApp = initializeApp(firebaseConfig)
const firestore = getFirestore(firebaseApp)
const auth = getAuth(firebaseApp)

const app = createApp(App)
app.use(router).mount('#app')
