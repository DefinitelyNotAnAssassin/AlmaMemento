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
          <input
            type="text"
            id="alumniID"
            name="alumniID"
            v-model="alumniID"
            required
            placeholder="Alumni ID"
          />
        </div>
        <div style="position: relative">
          <input
            :type="isPwVisible ? 'text' : 'password'"
            id="password"
            name="password"
            v-model="password"
            required
            placeholder="Password"
          />
          <button
            type="button"
            class="btn mt-1"
            style="position: absolute; right: 0"
            @click="showPw()"
          >
            <i
              class="bi"
              :class="isPwVisible ? 'bi-eye-slash-fill' : 'bi-eye-fill'"
            ></i>
          </button>
        </div>
        <p v-if="errMsg">{{ errMsg }}</p>
        <button type="submit" class="btn-login">Login</button>
        <div>
          <router-link to="/forgotPassword" class="forgot-password-link"
            >Forgot Password?</router-link>
        </div>
        <div>
          Don’t have an account?
          <router-link to="/signUp" class="forgot-password-link" style="color: #000; font-weight: bolder;"
            >Sign up</router-link
          >
        </div>
      </form>
      <div class="mb-2">
        <a class="login-footer text-dark"
          >Copyright &copy; 2023 AlmaMemento. All Rights Reserved.</a
        >
      </div>
    </div>
    <div class="logo-container">
      <img src="@/assets/images/ctu-logo.png" alt="Logo" />
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

const alumniID = ref("");
const password = ref("");
const errMsg = ref("");
const isLoading = ref(false);
const isPwVisible = ref(false);

const router = useRouter();

const signin = async () => {
  isLoading.value = true;
  try {
    const q = query(
      collection(db, "users"),
      where("alumnaID", "==", alumniID.value),
      where("alumna_password", "==", password.value)
    );
    const querySnapshot = await getDocs(q);
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
      isLoading.value = false;
      errMsg.value =
        "No account with that alumni number and password was found";  
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
