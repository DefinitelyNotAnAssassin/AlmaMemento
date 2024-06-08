<template>
  <Loading v-if="isLoading" />
  <aside
    class="sidebar-container d-flex flex-column align-items-center text-light m-0 background-color-brown"
    style="position: sticky; top: 4rem;"
  >
    <img
      class="mt-5"
      :src="userData.photoURL || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSrg2WnUIHC9h-YDMdULjrK55IN9EFKqSRznTVQxaxnww&s'"
      alt="profile" style="width: 180px; height: 180px"
    />
    <h4 class="mt-2">{{ userData.name }}</h4>
    <p>{{ userData.alumna_email }}</p>
    <div class="mt-5 profile-table-container">
      <h5>Profile</h5>
      <table>
        <tr>
          <td style="white-space: nowrap;">ID number:</td>
          <td class="td-padding-left">{{ userData.alumnaID }}</td>
        </tr>
        <tr>
          <td>Program & Block:</td>
          <td style="white-space: nowrap;" class="td-padding-left">{{ userData.pab }}</td>
        </tr>
        <tr>
          <td style="white-space: nowrap;">Class Year:</td>
          <td class="td-padding-left">{{ userData.classYear }}</td>
        </tr>
        <tr>
          <td>Phone:</td>
          <td class="td-padding-left">{{ userData.phone }}</td>
        </tr>
      </table>
    </div>
  
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
  full_name: "",
  idNumber: "",
  pab: "",
  classYear: "",
  phone: "",
  photoURL: "",
});

const isLoading = ref(false);



const fetchUserData = async () => {

  const userId =  localStorage.getItem("userId") || router.currentRoute.value.query.userId;
  const userDocRef = doc(db, "users", userId);
  const userDocSnap = await getDoc(userDocRef);
  if (userDocSnap.exists()) {
    const user = userDocSnap.data();
    const name = `${user.fName} ${user.mInitial} ${user.lName}`;
    const fullName = `${user.fName} ${user.lName}`
    userData.value = {
      ...user,
      name: name.trim(),
      full_name: fullName.trim(),
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
  height: 150px;
  width: 150px;
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
