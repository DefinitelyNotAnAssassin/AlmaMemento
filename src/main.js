import './assets/main.css'

import { createApp } from 'vue'
import { Quasar, Dialog } from 'quasar'
import App from './App.vue'
import router from './router'

//Quasar libraries
import 'quasar/src/css/index.sass'

import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: "AIzaSyCV7PyJD_6x3_yI-Ow247qxrXTF5Q4w6Ro",
  authDomain: "almamemento2.firebaseapp.com",
  projectId: "almamemento2",
  storageBucket: "almamemento2.appspot.com",
  messagingSenderId: "699584866738",
  appId: "1:699584866738:web:51fc91824accba66421cab",
  measurementId: "G-RDED32M0BD"
}

const firebaseApp = initializeApp(firebaseConfig)
const firestore = getFirestore(firebaseApp)
const auth = getAuth(firebaseApp)

const app = createApp(App)
app.use(Quasar, {
  plugins: {
    Dialog
  }, // import Quasar plugins and add here
})
app.use(router).mount('#app')
