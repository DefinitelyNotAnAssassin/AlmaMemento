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
            src="https://scontent.fmnl4-7.fna.fbcdn.net/v/t39.30808-6/444788838_122111548694306247_2658197019216045247_n.jpg?_nc_cat=108&ccb=1-7&_nc_sid=5f2048&_nc_eui2=AeE0sCQLtuCTWRmVqCfywHcg0SWGNPkX7-nRJYY0-Rfv6TFGevTnotrWrky46BorddQx3G3TPxizDIaFJ-7C14xZ&_nc_ohc=k-I6VxJucpUQ7kNvgEQUeO1&_nc_oc=AdgLmfwlw7Hl6zYtfQ9nP1miYffN2ejZ5atev0euv6NZk5FX2BmJLH-iuWPbld3WLBY&_nc_ht=scontent.fmnl4-7.fna&oh=00_AYAA_HZ0Oe97adcb4KPUXbtg8IULDPszvpvzWd5HeNmFZg&oe=6652E773"
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
            <td>123</td>
          </tr>
          <tr>
            <td>Phone:</td>
            <td>0912332</td>
          </tr>
          <tr>
            <td>Address:</td>
            <td>asdakjhd</td>
          </tr>
          <tr>
            <td>Email:</td>
            <td>emman@gmail.com</td>
          </tr>
        </table>
        <h5 class="mt-2">Academic Background:</h5>
        <table>
          <tr>
            <td>Program & Block:</td>
            <td>BSIT - Block A</td>
          </tr>
          <tr>
            <td>Major:</td>
            <td>N/A</td>
          </tr>
          <tr>
            <td>Class Year:</td>
            <td>2023 - 2024</td>
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
