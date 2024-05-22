<template>
  <aside>
    <div
      class="memento-sidebar d-flex justify-content-center"
      style="position: relative"
    >
      <div
        class="d-flex align-items-center"
        style="position: absolute; top: -85px"
      >
        <div>
          <img
            style="height: 150px; width: 150px; border-radius: 50%"
            :src="userData.photoURL"
            alt="profile"
          />
          <button type="button" class="btn btn-sm">
            <i class="bi bi-camera"></i>
          </button>
        </div>
        <div style="margin-left: 20px">
          <h4 class="text-light">Miles Morales</h4>
          <h6 class="text-light">UI / UX</h6>
          <button class="btn btn-sm btn-success">Edit Profile</button>
        </div>
      </div>

      <div style="margin-top: 90px">
        <h5>Personal Information</h5>
        <table>
          <tr>
            <td>ID number:</td>
            <td>{{ userData.alumnaID }}</td>
          </tr>
          <tr>
            <td>Phone:</td>
            <td>{{ userData.phone }}</td>
          </tr>
          <tr>
            <td>Address:</td>
            <td>asdakjhd</td>
          </tr>
          <tr>
            <td>Email:</td>
            <td>{{ userData.email }}</td>
          </tr>
        </table>
        <h5 class="mt-2">Academic Background:</h5>
        <table>
          <tr>
            <td>Program & Block:</td>
            <td>{{ userData.course }}</td>
          </tr>
          <tr>
            <td>Major:</td>
            <td>N/A</td>
          </tr>
          <tr>
            <td>Class Year:</td>
            <td>{{ userData.classYear }}</td>
          </tr>
        </table>
        <button class="btn btn-sm text-light background-color-brown">
          Change Password
        </button>
      </div>
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

    console.log(user.profilePicture);
  } else {
    console.log("User not found");
  }
};

fetchUserData();
</script>

<style scoped>
.memento-sidebar {
  border-right: 5px solid #330303;
  height: calc(100vh - 300px);
  width: 400px;
}
</style>
