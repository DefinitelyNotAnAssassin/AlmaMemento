<template>
    <div class="main-container">
      <div class="login-container">
        <form @submit.prevent="signin">
          <div class="login-logo">
            <img src="@/assets/images/logo2.png" alt="Logo" style="width: 250px; height: 250px;">
          </div>
          <input type="text" id="alumniID" name="alumniID" v-model="alumniID" required placeholder="Alumni ID">
          <input type="password" id="password" name="password" v-model="password" required placeholder="Password">
          <p v-if="errMsg">{{ errMsg }}</p>
          <button type="submit">Login</button>
          <div>
            <a href="#" class="forgot-password-link">Forgot Password?</a>
          </div>
        </form>
        <div>
          <br>
          <br>
          <br>
          <br>
          <br>
          <br>
          <br>
          <br>
          <br>
          <br>
          <br>
          <br>
          <br>
          <br>
          <br>
          <br>
          <a class="login-footer">Copyright &copy; 2023 AlmaMemento. All Rights Reserved.</a>
        </div>
      </div>
      <div class="logo-container">
        <img src="@/assets/images/ctu-logo.png" alt="Logo">
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  import { db } from '../firebase/index.js'
  import { collection, getDocs, updateDoc, doc, query, where } from 'firebase/firestore'

  const alumniID = ref("")
  const password = ref("")
  const errMsg = ref("")

  const router = useRouter()

  const signin = async () => {
    try {
      console.log("Trying to sign in...")

      const q = query(collection(db, "users"), where("alumnaID", "==", alumniID.value), where("alumna_password", "==", password.value));
      const querySnapshot = await getDocs(q);
      const user = querySnapshot.docs[0];

      if (user) {
        console.log("User found:", user.data())

        await updateDoc(doc(db, 'users', user.id), { loggedIn: true });

        router.push({ name: 'dashboard', query: { userId: user.id } })
        console.log("Current URL:", window.location.href);
      } else {
        errMsg.value = "No account with that alumni number and password was found"
      }
    } catch (error) {
      console.error("Error:", error.message)
      errMsg.value = "An error occurred"
    }
  }
</script>
