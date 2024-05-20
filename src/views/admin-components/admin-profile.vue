<template>
  <div class="components-page-main-container p-3 profile-container container">
    <div class="user-profile mt-2">
      <div class="profile-pic-container">
        <img
          style="border-radius: 50%; height: 100px; width: 100px"
          @click="openImageModal"
          :src="userData.profilePicture || userImage"
          alt="profile-picture"
        />
        <button @click="editProfile" class="btn-edit-profile btn btn-sm">
          <i class="bi bi-pencil-square"></i>
        </button>
        <h5 class="mt-1" style="text-align: center">
          {{ userData.userlevel }}
        </h5>
      </div>
      <div class="profile-details">
        <h2>{{ userData.name }}</h2>
        <a>{{ userData.alumna_email }}</a>
        <div style="display: flex; align-items: center">
          <h4 style="margin-right: 10px">{{ userData.address }}</h4>
          <!-- <img
            @click="editProfile"
            width="25"
            height="25"
            src="https://img.icons8.com/ios/100/create-new.png"
            alt="create-new"
          /> -->
        </div>
      </div>
    </div>
    <div class="profile-info mt-2">
      <div>
        <label for="alumnaID">Admin ID:</label>
        <input
          :disabled="!isEditable"
          type="text"
          id="alumnaID"
          name="alumnaID"
          v-model="userData.alumnaID"
        />
      </div>

      <div>
        <label for="name">Name:</label>
        <input
          :disabled="!isEditable"
          type="text"
          id="name"
          name="name"
          v-model="userData.name"
        />
      </div>

      <div>
        <label for="phone">Phone:</label>
        <input
          :disabled="!isEditable"
          type="tel"
          id="phone"
          name="phone"
          v-model="userData.phone"
        />
      </div>

      <div>
        <label for="alumna_email">Email:</label>
        <input
          :disabled="!isEditable"
          type="email"
          id="alumna_email"
          name="alumna_email"
          v-model="userData.alumna_email"
        />
      </div>

      <div>
        <label for="address">Address:</label>
        <input
          :disabled="!isEditable"
          type="text"
          id="address"
          name="address"
          v-model="userData.address"
        />
      </div>

      <div>
        <label for="year">Year of Administratorship:</label>
        <input
          :disabled="!isEditable"
          type="number"
          id="year"
          name="year"
          v-model="userData.year"
        />
      </div>

      <div class="btn-save-container">
        <button
          class="btn btn-sm btn-dark"
          v-if="isEditable"
          @click="showModal"
        >
          Save Changes
        </button>
      </div>
    </div>

    <div v-if="isModalOpen" class="modal">
      <div class="modal-content">
        <span class="close" @click="closeModal">&times;</span>
        <p>Are you sure you want to save changes?</p>
        <button class="btn btn-sm btn-primary" @click="saveChanges">
          Save
        </button>
        <button class="btn btn-sm btn-danger mt-1" @click="closeModal">
          Cancel
        </button>
      </div>
    </div>

    <div v-if="isImageModalOpen" class="modal">
      <div class="modal-content">
        <span class="close" @click="closeImageModal">&times;</span>
        <p>Upload Image here</p>
        <div>
          <label for="profile-picture">Profile Picture:</label>
          <input
            class="form-control"
            type="file"
            id="profile-picture"
            name="profile-picture"
            @change="handleFileUpload"
          />
        </div>
        <p>Choose an option:</p>
        <button class="btn btn-sm btn-primary" @click="uploadPhoto">
          Upload Photo
        </button>
        <button class="btn btn-sm btn-danger mt-1" @click="deletePhoto">
          Delete Photo
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { db } from "../../firebase/index.js";
import { useRoute } from "vue-router";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import {
  getStorage,
  ref as storageRef,
  uploadBytes,
  deleteObject,
  getDownloadURL,
} from "firebase/storage";

const storage = getStorage();

const route = useRoute();
const userId = route.query.userId;
const userData = ref({
  name: "",
  alumna_email: "",
  userlevel: "",
  alumnaID: "",
  phone: "",
  address: "",
  year: "",
  profilePicture: "",
});
const userDataLoaded = ref(false);
const isEditable = ref(false);
const isModalOpen = ref(false);
const isImageModalOpen = ref(false);
let fileToUpload = null;

import userImage from "@/assets/images/user.png";

onMounted(async () => {
  try {
    const docRef = doc(db, "users", userId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      userData.value = docSnap.data();
      userDataLoaded.value = true;
    } else {
      console.log("No such document!");
    }
  } catch (error) {
    console.error("Error getting document:", error);
  }
});

const editProfile = () => {
  isEditable.value = !isEditable.value;
};

const saveChanges = async () => {
  try {
    const docRef = doc(db, "users", userId);
    await updateDoc(docRef, userData.value);
    closeModal();
    isEditable.value = false;
  } catch (error) {
    console.error("Error updating document:", error);
  }
};

const openImageModal = () => {
  isImageModalOpen.value = true;
};

const closeImageModal = () => {
  isImageModalOpen.value = false;
};

const handleFileUpload = (event) => {
  fileToUpload = event.target.files[0];
};

const showModal = () => {
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
};

const uploadPhoto = async () => {
  if (!fileToUpload) {
    return;
  }

  try {
    const storageReference = storageRef(
      storage,
      `users/${userId}/profilePicture.jpg`
    );
    const snapshot = await uploadBytes(storageReference, fileToUpload);

    const downloadURL = await getDownloadURL(storageReference);

    const docRef = doc(db, "users", userId);
    await updateDoc(docRef, { profilePicture: downloadURL });

    userData.value.profilePicture = downloadURL;

    fileToUpload = null;
    closeImageModal();
  } catch (error) {
    console.error("Error uploading photo:", error);
  }
};

const deletePhoto = async () => {
  try {
    const storageReference = storageRef(
      storage,
      `users/${userId}/profilePicture.jpg`
    );
    await deleteObject(storageReference);

    const docRef = doc(db, "users", userId);
    await updateDoc(docRef, { profilePicture: "" });

    window.location.reload();

    closeImageModal();
  } catch (error) {
    console.error("Error deleting photo:", error);
  }
};
</script>

<style>
.modal {
  display: flex;
  position: fixed;
  z-index: 1;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgba(0, 0, 0, 0.4);
}

.modal-content {
  background-color: #fefefe;
  margin: 15% auto;
  padding: 20px;
  border: 1px solid #888;
  width: 80%;
}

.close {
  color: #aaaaaa;
  float: right;
  font-size: 28px;
  font-weight: bold;
}

.close:hover,
.close:focus {
  color: #000;
  text-decoration: none;
  cursor: pointer;
}

.profile-container {
  height: 85vh;
  overflow-y: auto;
}

.template-title {
  margin: 10px;
}
.user-profile {
  display: flex;
  justify-content: center;
  align-items: center;
}
.profile-details {
  margin-left: 50px;
}
.profile-details h1 {
  font-size: 4rem;
}
.profile-info {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  max-width: 600px;
  margin: 0 auto;
}

.profile-info div {
  display: flex;
  flex-direction: column;
}

.profile-info input {
  padding: 10px;
  font-size: 14px;
}

.profile-info input[type="password"] {
  font-family: "password";
}

.btn-save-container {
  position: relative;
}

.btn-save-container button {
  position: absolute;
  bottom: 0;
  right: 0;
}

.profile-pic-container {
  position: relative;
}

.btn-edit-profile {
  position: absolute;
  bottom: 30px;
  right: 10px;
  font-size: 20px;
}
</style>
