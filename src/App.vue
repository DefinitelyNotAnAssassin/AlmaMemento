<template>
  <div class="main-container">
    <div class="login-container">
      <form @submit.prevent="signin">
        <div class="login-logo">
          <img src="@/assets/images/logo.png" alt="Logo" style="width: 250px; height: 250px;">
        </div>
        <input type="text" id="studNum" name="studNum" v-model="studNum" required>
        <input type="password" id="password" name="password" v-model="password" required>
        <p v-if="errMsg">{{ errMsg }}</p>
        <button type="submit">Login</button>
        <div>
          <a href="#" class="forgot-password-link">Forgot Password?</a>
        </div>
      </form>
      <div>
        <a class="login-footer">Copyright</a>
      </div>
    </div>
    <div class="logo-container">
      <img src="@/assets/images/ctu-logo.png" alt="Logo">
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'
import { useRouter } from 'vue-router'
import { db } from './firebase/index.js'
import { collection, query, getDocs, where } from 'firebase/firestore'

const studNum = ref("")
const password = ref("")
const errMsg = ref("")

const auth = getAuth()
const router = useRouter()

const signin = async () => {
  try {
    await signInWithEmailAndPassword(auth, studNum.value, password.value)
    console.log("Successfully Signed In!")
    console.log(auth.currentUser)

    const q = query(collection(db, "sample users"), where("studNum", "==", auth.currentUser.studNum))
    const querySnapshot = await getDocs(q)
    querySnapshot.forEach((doc) => {
      console.log(doc.id, " => ", doc.data())
    })

    router.push("/admin-dashboard")
  } catch (error) {
    console.error(error.code)
    switch (error.code) {
      case "auth/invalid-email":
        errMsg.value = "Invalid Email"
        break
      case "auth/user-not-found":
        errMsg.value = "No account with that student number was found"
        break
      case "auth/wrong-password":
        errMsg.value = "Incorrect Password"
        break
      default:
        errMsg.value = "Email or Password was incorrect"
        break
    }
  }
}
</script>
