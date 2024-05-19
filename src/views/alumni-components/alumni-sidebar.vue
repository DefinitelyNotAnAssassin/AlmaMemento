<template>
  <Loading v-if="isLoading" />
  <aside
    class="sidebar-container d-flex flex-column align-items-center text-light m-0 background-color-brown"
  >
    <img class="mt-5" :src="userData.photoURL" alt="profile" />
    <h4 class="mt-2">{{ userData.name }}</h4>
    <p>{{ userData.alumna_email }}</p>
    <div class="mt-5 profile-table-container">
      <h4>Profile</h4>
      <table>
        <tr>
          <td>ID number:</td>
          <td class="td-padding-left">{{ userData.alumnaID }}</td>
        </tr>
        <tr>
          <td>Course:</td>
          <td class="td-padding-left">{{ userData.course }}</td>
        </tr>
        <tr>
          <td>Class Year:</td>
          <td class="td-padding-left">{{ userData.classYear }}</td>
        </tr>
        <tr>
          <td>Phone:</td>
          <td class="td-padding-left">{{ userData.phone }}</td>
        </tr>
      </table>
    </div>
    <button @click="logout" class="logout-butto btn btn-sm btn-light mt-5">
      <i class="fas fa-power-off"></i> Logout
    </button>
  </aside>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { db } from "../../firebase/index.js";
import {
  collection,
  getDocs,
  updateDoc,
  doc,
  getDoc,
} from "firebase/firestore";
import Loading from "../loading.vue";

const router = useRouter();
const loadingProgress = ref(0);

const userData = ref({
  name: "",
  email: "",
  idNumber: "",
  course: "",
  classYear: "",
  phone: "",
  photoURL: "",
});

const isLoading = ref(false);

const logout = async () => {
  isLoading.value = true;
  try {
    isLoading.value = true;

    await new Promise(resolve => setTimeout(resolve, 1000));
    loadingProgress.value = 25;

    const q = collection(db, "users");
    const querySnapshot = await getDocs(q);
    const userId = router.currentRoute.value.query.userId;
    loadingProgress.value = 50;

    const user = querySnapshot.docs.find(
      (doc) => doc.id === userId && doc.data().loggedIn === true
    );

    if (user) {
      await updateDoc(doc(db, "users", user.id), {
        loggedIn: false,
      });

      loadingProgress.value = 75;

      router.push({ name: "login" });
      console.log("Logout successful. Redirecting to login page...");
      console.log("Current URL:", window.location.href);
    } else {
      isLoading.value = false;
      console.log("No logged in user found");
      errMsg.value = "No logged in user found";
    }
  } catch (error) {
    isLoading.value = false;
    console.error("Error:", error.message);
    errMsg.value = "An error occurred";
  } finally {
    setTimeout(() => {
      isLoading.value = false;
      loadingProgress.value = 100;
    }, 500);
  }
};

const fetchUserData = async () => {
  const userId = router.currentRoute.value.query.userId;
  const userDocRef = doc(db, "users", userId);
  const userDocSnap = await getDoc(userDocRef);
  if (userDocSnap.exists()) {
    const user = userDocSnap.data();
    const name = `${user.fName} ${user.mInitial} ${user.lName}`;

    userData.value = {
      ...user,
      name: name.trim(),
      photoURL: user.profilePicture,
    };
  } else {
    console.log("User not found");
  }
};

fetchUserData();
</script>

<style scoped>
aside {
  height: calc(100vh - 70px);
  width: 400px;
}

aside img {
  height: 120px;
  widows: 120px;
  border-radius: 50%;
}

.profile-table-container {
  width: 280px !important;
}

.td-padding-left {
  padding-left: 30px;
}

table tr td {
  padding-top: 10px;
  padding-bottom: 10px;
}
</style>
