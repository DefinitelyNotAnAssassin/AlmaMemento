<template>
  <Loading v-if="isLoading" />
  <div class="main-container">
    <div
      class="login-container d-flex flex-column align-items-center justify-content-between"
    >
      <form class="mt-5" @submit.prevent="signin">
        <div class="login-logo">
          <img
            src="@/assets/images/logo2.png"
            alt="Logo"
            style="width: 250px; height: 250px"
          />
        </div>
        <div>
          <p v-if="errMsg" class="text-danger text-center" style="font-weight: bold">{{ errMsg }}</p>
          <input class="form-control input-lg mb-2"
            style="width: 400px"
            type="text"
            id="alumniID"
            name="alumniID"
            v-model="alumniID"
            required
            placeholder="ID Number"
          />
        </div>
        <div style="position: relative">
          <input class="form-control input-lg mb-1"
            style="width: 400px"
            :type="isPwVisible ? 'text' : 'password'"
            id="password"
            name="password"
            v-model="password"
            required
            placeholder="Password"
          />
          <div class="text-end">
          <router-link to="/forgotPassword" class="forgot-password-link text-danger"
            >Forgot Password?</router-link>
        </div>
          <button
            type="button"
            class="btn mt-1"
            style="position: absolute; right: 0; top: 30%; transform: translateY(-50%);"
            @click="showPw()"
          >
            <i
              class="bi"
              :class="isPwVisible ? 'bi-eye-slash-fill' : 'bi-eye-fill'"
            ></i>
          </button>
        </div>
        <button type="submit" class="btn-login rounded border-0" style="background: #871B23">Login</button>
        
        <div>
          Don't have an account?
          <router-link to="/signUp" class="forgot-password-link text-danger" style="font-weight: bold;">Sign up</router-link
          >
        </div>
      </form>
      <div class="mb-2">
        <a class="login-footer text-dark">Copyright &copy; 2024 AlmaMemento.</a>
      </div>
    </div>
    <div class="logo-container">
      <!-- <img src="@/assets/images/ctu-logo.png" alt="Logo" /> -->
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { db } from "../firebase/index.js";
import {
  collection,
  getDocs,
  updateDoc,
  doc,
  query,
  where,
} from "firebase/firestore";
import Loading from "./loading.vue";
import CryptoJS from "crypto-js";

const alumniID = ref("");
const password = ref("");
const errMsg = ref("");
const isLoading = ref(false);
const isPwVisible = ref(false);

const router = useRouter();

const signin = async () => {
  isLoading.value = true;
  try {
    const hashedPassword = CryptoJS.SHA256(password.value).toString();
    const q = query(
      collection(db, "users"),
      where("alumnaID", "==", alumniID.value),
      where("alumna_password", "==", hashedPassword)
    );


    const w = query(
      collection(db, "users"),
      where("alumnaID", "==", alumniID.value),
      where("alumna_password", "==", password.value)
    );
    const querySnapshot = await getDocs(q);
    const querySnapshot2 = await getDocs(w);
    const user = querySnapshot.docs[0];

    if (user) {
      if (user.data().status === "active") {
        await updateDoc(doc(db, "users", user.id), { loggedIn: true });

        localStorage.setItem("userId", user.id);
        localStorage.setItem("userlevel", user.data().userlevel);

        if (
          user.data().userlevel === "administrator" ||
          user.data().userlevel === "moderator"
        ) {
          router.replace({
            name: "adminDashboard",
            query: { userId: user.id },
          });
        } else if (user.data().userlevel === "alumni") {
          router.replace({
            name: "alumniDashboard",
            query: { userId: user.id, alumniId: user.data().alumnaID },
          });
        }
      } else {
        isLoading.value = false;
        errMsg.value = "Your account has been deactivated";
      }
    } else {
      const user2 = querySnapshot2.docs[0];
      if (user2) {
      if (user2.data().status === "active") {
        await updateDoc(doc(db, "users", user2.id), { loggedIn: true });

        localStorage.setItem("userId", user2.id);
        localStorage.setItem("userlevel", user2.data().userlevel);

        if (
          user2.data().userlevel === "administrator" ||
          user2.data().userlevel === "moderator"
        ) {
          router.replace({
            name: "adminDashboard",
            query: { userId: user2.id },
          });
        } else if (user2.data().userlevel === "alumni") {
          router.replace({
            name: "alumniDashboard",
            query: { userId: user2.id, alumniId: user2.data().alumnaID },
          });
        }
      }
    
    }
    else{
      isLoading.value = false;
      errMsg.value = "Invalid ID Number or Password";  
    }  
      }
  } catch (error) {
    isLoading.value = false;
    console.error("Error:", error);
    errMsg.value = "An error occurred";
  }
};

const showPw = () => {
  isPwVisible.value = !isPwVisible.value;
};
</script>
