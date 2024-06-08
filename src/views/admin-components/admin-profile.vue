<template>
   <Loading v-if="isLoading" />
  <div class="components-page-main-container p-3 profile-container container">
    <h4 style="font-size: 1.5rem;">Profile</h4>
    <div style="background: rgba(0,0,0,0.1); padding: 2rem;">
    <div class="user-profile mt-2" >
      <div class="profile-pic-container" style="margin-right: 2rem;">
        <div style="position: relative;">
        <img
          style="border-radius: 50%; height: 170px; width: 170px"
          :src="userData.profilePicture || userImage"
          alt="profile-picture"
        />
        <button 
        style="border: none; background: black; width: 2rem; height: 2rem; color: white; border-radius: 50%;
         position: absolute; font-size: 1rem; bottom: 0; right: 1rem;"
        @click="openImageModal"
        >
          <i class="bi bi-camera"></i>
        </button>
        </div>
        <h5 class="mt-1" style="text-align: center">
          {{ userData.userlevel }}
        </h5>
      </div>
      <div class="profile-details">
        <h2>{{ userData.name }}</h2>
        <h6>{{ userData.alumna_email }}</h6>
        <div style="display: flex; align-items: center">
          <p style="margin-right: 10px">{{ userData.address }}</p>
      
        
          <!-- <img
            @click="editProfile"
            width="25"
            height="25"
            src="https://img.icons8.com/ios/100/create-new.png"
            alt="create-new"
          /> -->
        </div>
        <button class="btn btn-dark" @click="editProfile">Edit Information</button>
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
        <button class="btn btn-sm btn-success mt-3 p-2"  @click="showChangePasswordModal = true">Change Password</button>
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
        <button class="btn btn-sm btn-primary mt-3 p-2" v-if="isEditable" @click="showModal" style="width: 295px;">
          Save Changes
        </button>
      
      </div>

      
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

    <!-- Change Password Modal -->
    <div
      v-if="showChangePasswordModal"
      class="modal-overlay"
      @click.self="showChangePasswordModal = false"
    >
      <div class="modal-password">
        <h3>Change Password</h3>
        <div>
          <label>Current Password</label>
          <input
            class="form-control"
            type="password"
            v-model="passwordData.currentPassword"
          />
        </div>
        <div>
          <label>New Password</label>
          <input
            class="form-control"
            type="password"
            v-model="passwordData.newPassword"
          />
        </div>
        <div>
          <label>Confirm Password</label>
          <input
            class="form-control"
            type="password"
            v-model="passwordData.confirmPassword"
          />
        </div>
        <div style="margin-top: 1rem;">
        <button class="btn btn-sm btn-primary" @click="ConfirmationChangePassword">
          Update Password
        </button>
        <button
          class="btn btn-sm btn-dark mx-1"
          @click="showChangePasswordModal = false"
        >
          Cancel
        </button>
        </div>
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
            accept="image/*"
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
import { useQuasar } from 'quasar'
import { ref, onMounted } from "vue";
import { db } from "../../firebase/index.js";
import { useRoute } from "vue-router";
import Loading from "../loading.vue";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import {
  getStorage,
  ref as storageRef,
  uploadBytes,
  deleteObject,
  getDownloadURL,
} from "firebase/storage";

const storage = getStorage();
const $q = useQuasar(); 
const showChangePasswordModal = ref(false);
const passwordData = ref({
  currentPassword: "",
  newPassword: "",
  confirmPassword: ""
});

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
const isLoading = ref(false);
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

const SuccessfulMessage = (message)=> {
      $q.dialog({
        title: 'Successful',
        message
      }).onOk(() => {
        // console.log('OK')
      }).onCancel(() => {
        // console.log('Cancel')
      }).onDismiss(() => {
        // console.log('I am triggered on both OK and Cancel')
      })
    }

const ConfirmationChangePassword = ()=> {
  if(passwordData.value.newPassword != passwordData.value.confirmPassword){
    $q.dialog({
    title: 'ERROR',
    message: "Your password doesn't match",
    })

    return
  }

  $q.dialog({
    title: 'Confirmation',
    message: 'Are you sure you want to change your password?',
    cancel: true,
    persistent: true,
  }).onOk(() => {
    changePassword()
  }).onCancel(() => {
    // Action on Cancel
  }).onDismiss(() => {
    // Action on Dismiss
  });
}

const changePassword = async () => {
  isLoading.value = true
  // const userId = route.currentRoute.value.query.userId;
  const userDocRef = doc(db, "users", userId);
  const userDocSnap = await getDoc(userDocRef);
  if (userDocSnap.exists()) {
    const user = userDocSnap.data();
    if (user.alumna_password === passwordData.value.currentPassword) {
      try {
        await updateDoc(userDocRef, {
          alumna_password: passwordData.value.newPassword,
        });
        showChangePasswordModal.value = false;
      } catch (error) {
        console.error("Error updating password: ", error);
      }finally{
        isLoading.value = false
        SuccessfulMessage('Password has been updated.')
      }
    } else {
      alert("Current password is incorrect");
    }
  } else {
    console.log("User not found");
  }
};

const showSaveDialog = () => {
  $q.dialog({
    title: 'Confirmation',
    message: 'Are you sure you want to save changes?',
    cancel: true,
    persistent: true,
  }).onOk(() => {
    saveChanges();
  }).onCancel(() => {
    // Action on Cancel
  }).onDismiss(() => {
    // Action on Dismiss
  });
};

const editProfile = () => {
  isEditable.value = !isEditable.value;
  if(!isEditable.value){
    // showModal()
    showSaveDialog ()
  }
};

const alert = ()=> {
      $q.dialog({
        title: 'Successful',
        message: 'Profile has been updated.'
      }).onOk(() => {
        // console.log('OK')
      }).onCancel(() => {
        // console.log('Cancel')
      }).onDismiss(() => {
        // console.log('I am triggered on both OK and Cancel')
      })
    }

const saveChanges = async () => {
  isLoading.value = true;
  try {
    const docRef = doc(db, "users", userId);
    await updateDoc(docRef, userData.value);
    closeModal();
    isEditable.value = false;
    alert()
   
  } catch (error) {
    console.error("Error updating document:", error);
  }finally{
    isLoading.value = false;
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
  z-index: 5;
}

.modal-password {
  background: white;
  padding: 20px;
  border-radius: 8px;
  max-width: 500px;
  width: 100%;
  height: auto;
  position: absolute;
  left: 50%;
  transform: translate(-50%, -50%);
  top: 50%;

}

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
