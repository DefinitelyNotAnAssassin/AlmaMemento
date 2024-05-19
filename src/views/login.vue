<template>
    <div class="main-container">
      <div v-if="isLoading" class="loading-overlay">
        <progress class="loading-progress" max="100" :value="loadingProgress"></progress>
        <p>Loading...</p>
      </div>
      <div v-else class="login-container d-flex flex-column align-items-center justify-content-between">
        <form class="mt-5" @submit.prevent="signin">
          <div class="login-logo">
            <img src="@/assets/images/logo2.png" alt="Logo" style="width: 250px; height: 250px;">
          </div>
          <input type="text" id="alumniID" name="alumniID" v-model="alumniID" required placeholder="Alumni ID">
          <input type="password" id="password" name="password" v-model="password" required placeholder="Password">
          <p v-if="errMsg">{{ errMsg }}</p>
          <button type="submit">Login</button>
          <div>
          <router-link to="/forgotPassword" class="forgot-password-link">Forgot Password?</router-link>
        </div>
        </form>
        <div class="mb-2">
          <a class="login-footer text-dark">Copyright &copy; 2023 AlmaMemento. All Rights Reserved.</a>
        </div>
      </div>
      <div v-if="!isLoading" class="logo-container">
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
  const isLoading = ref(false)
  const loadingProgress = ref(0)
  
  const router = useRouter()
  
  const signin = async () => {
    try {
      console.log("Trying to sign in...")
      isLoading.value = true
  
      await new Promise(resolve => setTimeout(resolve, 1000))
      loadingProgress.value = 25
  
      const q = query(collection(db, "users"), where("alumnaID", "==", alumniID.value), where("alumna_password", "==", password.value));
      const querySnapshot = await getDocs(q);
      const user = querySnapshot.docs[0];
      loadingProgress.value = 50
  
      if (user) {
        console.log("User found:", user.data())
  
        if (user.data().status === 'active') {
          await updateDoc(doc(db, 'users', user.id), { loggedIn: true });
          loadingProgress.value = 75
  
          if (user.data().userlevel === 'administrator') {
            router.push({ name: 'adminDashboard', query: { userId: user.id } })
          } else if(user.data().userlevel === 'alumni') {
            router.push({ name: 'alumniDashboard', query: { userId: user.id, alumniId: user.data().alumnaID } })
          } else if(user.data().userlevel === 'moderator') {
            router.push({ name: 'modDashboard', query: { userId: user.id } })
          }
          console.log("Current URL:", window.location.href);
        } else {
          errMsg.value = "Your account has been deactivated"
        }
      } else {
        errMsg.value = "No account with that alumni number and password was found"
      }
    } catch (error) {
      console.error("Error:", error.message)
      errMsg.value = "An error occurred"
    } finally {
          setTimeout(() => {
          isLoading.value = false;
          loadingProgress.value = 0;
        }, 500);
    }
  }
  </script>