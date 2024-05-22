<template>
  <aside>
    <div
      class="memento-sidebar d-flex justify-content-center"
      style="position: relative"
    >
      <div
        class="d-flex align-items-center"
        style="position: absolute; top: -120px; padding-left: 30px"
      >
        <div>
          <img
            :src="userData.photoURL || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSrg2WnUIHC9h-YDMdULjrK55IN9EFKqSRznTVQxaxnww&s'"
            alt="profile"
            style="height: 150px; width: 150px; border-radius: 50%"
          />
          <button type="button" class="btn btn-sm" @click="triggerFileInput">
            <i class="bi bi-camera"></i>
          </button>
          <input
            type="file"
            ref="fileInput"
            @change="uploadImage"
            style="display: none"
          />
        </div>
        <div style="margin-left: 20px">
          <h4 class="text-light">{{ userData.name }}</h4>
          <h6 class="text-light">UI / UX</h6>
          <button class="btn btn-sm btn-success" @click="showModal = true">
            Edit Profile
          </button>
        </div>
      </div>

      <div style="margin-top: 90px">
        <h5>Personal Information</h5>
        <table>
          <tr>
            <td>ID number:</td>
            <td>{{ userData.idNumber }}</td>
          </tr>
          <tr>
            <td>Phone:</td>
            <td>{{ userData.phone }}</td>
          </tr>
          <tr>
            <td>Address:</td>
            <td>{{ userData.address }}</td>
          </tr>
          <tr>
            <td>Email:</td>
            <td>{{ userData.alumna_email }}</td>
          </tr>
        </table>
        <h5 class="mt-2">Academic Background:</h5>
        <table>
          <tr>
            <td>Program & Block:</td>
            <td>{{ userData.pab }}</td>
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
    <!-- Edit Profile Modal -->
    <div v-if="showModal" class="modal-overlay" @click.self="showModal = false">
      <div class="modal">
        <h3>Edit Profile</h3>
        <div>
          <label>First Name</label>
          <input type="text" v-model="editData.fName" />
        </div>
        <div>
          <label>Middle Initial</label>
          <input type="text" v-model="editData.mInitial" />
        </div>
        <div>
          <label>Last Name</label>
          <input type="text" v-model="editData.lName" />
        </div>
        <div>
          <label>Phone</label>
          <input type="text" v-model="editData.phone" />
        </div>
        <div>
          <label>Address</label>
          <input type="text" v-model="editData.address" />
        </div>
        <div>
          <label>Email</label>
          <input type="email" v-model="editData.email" />
        </div>
        <button @click="saveProfile">Save</button>
        <button @click="showModal = false">Cancel</button>
      </div>
    </div>
  </aside>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { db, storage } from "../../firebase/index.js";
import {
  collection,
  getDocs,
  updateDoc,
  doc,
  getDoc,
} from "firebase/firestore";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";

const router = useRouter();

const userData = ref({
  name: "",
  alumna_email: "",
  idNumber: "",
  course: "",
  classYear: "",
  phone: "",
  address: "",
  pab: "",
  photoURL: "",
});

const editData = ref({
  fName: "",
  mInitial: "",
  lName: "",
  phone: "",
  address: "",
  email: "",
});

const showModal = ref(false);
const fileInput = ref(null);

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

    // Populate editData with the fetched user data
    editData.value = {
      fName: user.fName,
      mInitial: user.mInitial,
      lName: user.lName,
      phone: user.phone,
      address: user.address,
      email: user.alumna_email,
    };

    console.log("user" + userData.photoURL);
  } else {
    console.log("User not found");
  }
};

const saveProfile = async () => {
  const userId = router.currentRoute.value.query.userId;
  const userDocRef = doc(db, "users", userId);
  try {
    await updateDoc(userDocRef, {
      fName: editData.value.fName,
      mInitial: editData.value.mInitial,
      lName: editData.value.lName,
      phone: editData.value.phone,
      address: editData.value.address,
      alumna_email: editData.value.email,
    });
    showModal.value = false;
    // Refresh the user data
    fetchUserData();
  } catch (error) {
    console.error("Error updating document: ", error);
  }
};

const triggerFileInput = () => {
  fileInput.value.click();
};

const uploadImage = async (event) => {
  const userId = router.currentRoute.value.query.userId;
  const file = event.target.files[0];
  if (file) {
    const storage = getStorage();
    const storageReference = storageRef(storage, `profilePictures/${userId}`);
    try {
      const snapshot = await uploadBytes(storageReference, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      await updateDoc(doc(db, "users", userId), {
        profilePicture: downloadURL,
      });
      userData.value.photoURL = downloadURL;
    } catch (error) {
      console.error("Error uploading image: ", error);
    }
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
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}
.modal {
  background: white;
  padding: 20px;
  border-radius: 8px;
  max-width: 500px;
  width: 100%;
}
</style>
