<template>
  <Loading v-if="isLoading" />
  <aside>
    <div
      class="memento-sidebar d-flex justify-content-center"
      style="position: relative"
    >
      <div
        class="d-flex align-items-center"
        style="position: absolute; top: -150px; padding-left: 200px"
      >
        <div class="profile-image">
          <img
            :src="
              userData.photoURL ||
              'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSrg2WnUIHC9h-YDMdULjrK55IN9EFKqSRznTVQxaxnww&s'
            "
            @click="openImageModal(userData.photoURL || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSrg2WnUIHC9h-YDMdULjrK55IN9EFKqSRznTVQxaxnww&s')"
            alt="profile"
            style="height: 150px; width: 150px; border-radius: 50%"
          />
          <button type="button" class="btn btn-sm btn-camera" @click="triggerFileInput">
            <i class="bi bi-camera"></i>
          </button>
          <input
            type="file"
            ref="fileInput"
            @change="showSaveDialog"
            accept="image/*"
            style="display: none"
          />
        </div>
        <div style="margin-left: 10px">
          <h4 class="text-light" style="white-space: nowrap;">{{ userData.name }}</h4>
          <h6 class="text-light">{{ userData.bio || "Add bio" }}</h6>
          <button
            class="btn btn-sm btn-success"
           
            @click="showEditProfileModal = true"
          >
            Edit Profile
          </button>
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
        <button
          class="btn btn-sm text-light background-color-brown"
      style="background-color: #400;"
          @click="showChangePasswordModal = true"
        >
          Change Password
        </button>
      </div>
    </div>

    <!-- Edit Profile Modal -->
    <div
      v-if="showEditProfileModal"
      class="modal-overlay"
      @click.self="showEditProfileModal = false"
    >
      <div class="modal">
        <h3>Edit Profile</h3>
        <div>
          <label>Phone</label>
          <input class="form-control" type="text" v-model="editData.phone" />
        </div>
        <div>
          <label>Address</label>
          <input class="form-control" type="text" v-model="editData.address" />
        </div>
        <div>
          <label>Email</label>
          <input class="form-control" type="email" v-model="editData.email" />
        </div>
        <div style="margin-bottom: 1rem;">
          <label>Bio</label>
          <input class="form-control" type="text" v-model="editData.bio" maxlength="50"/>
        </div>
        <button class="btn btn-sm btn-primary" @click="ConfirmationSaveProfile">
          Save
        </button>
        <button
          class="btn btn-sm btn-dark mx-1"
          @click="showEditProfileModal = false"
        >
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
      <div class="modal">
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
        <button class="btn btn-sm btn-primary" @click="ConfirmationChangePassword">
          Save
        </button>
        <button
          class="btn btn-sm btn-dark mx-1"
          @click="showChangePasswordModal = false"
        >
          Cancel
        </button>
      </div>
      
    </div>
  
  </aside>
   <div v-if="isOpen" class="profile-modal">
      <div class="modal-content">
        <span @click="closeImageModal" class="close">&times;</span>
        <img
          :src="imageUrl"
          alt="Preview Image"
          style="max-width: 100%; max-height: 80vh"
        />
      </div>
    </div>
</template>

<script setup>
import Loading from "../loading.vue";
import { useQuasar } from 'quasar'
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
import {
  getStorage,
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
const $q = useQuasar(); 
const isOpen = ref(false);
const imageUrl = ref("");
const isLoading = ref(false);

const openImageModal = (url) => {
  imageUrl.value = url;
  isOpen.value = true;
};

const closeImageModal = () => {
  isOpen.value = false;
};


const router = useRouter();

const userData = ref({
  name: "",
  alumna_email: "",
  alumnaID: "",
  course: "",
  classYear: "",
  phone: "",
  address: "",
  bio: "",
  pab: "",
  photoURL: "",
});

const editData = ref({
  phone: "",
  address: "",
  email: "",
  bio: ""
});

const passwordData = ref({
  currentPassword: "",
  newPassword: "",
});

const showEditProfileModal = ref(false);
const showChangePasswordModal = ref(false);
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
    
      phone: user.phone,
      address: user.address,
      email: user.alumna_email,
      bio: user.bio
    };

    console.log("user" + userData.photoURL);
  } else {
    console.log("User not found");
  }
};

const ConfirmationSaveProfile = () => {
  $q.dialog({
    title: 'Confirmation',
    message: 'Are you sure you want to save changes?',
    cancel: true,
    persistent: true,
  }).onOk(() => {
    saveProfile()
  }).onCancel(() => {
    // Action on Cancel
  }).onDismiss(() => {
    // Action on Dismiss
  });
};


const saveProfile = async () => {
  isLoading.value = true
  const userId = router.currentRoute.value.query.userId;
  const userDocRef = doc(db, "users", userId);
  try {
    await updateDoc(userDocRef, {
      phone: editData.value.phone,
      address: editData.value.address,
      alumna_email: editData.value.email,
      bio: editData.value.bio
    });
    showEditProfileModal.value = false;
    // Refresh the user data
    fetchUserData();
  } catch (error) {
    console.error("Error updating document: ", error);
  }finally {
    isLoading.value = false
    SuccessfulMessage("Profile has been updated.")
  }
};

const triggerFileInput = () => {
  fileInput.value.click();
};

const showSaveDialog = (event) => {
  $q.dialog({
    title: 'Confirmation',
    message: 'Are you sure you want to change your profile picture?',
    cancel: true,
    persistent: true,
  }).onOk(() => {
    uploadImage(event)
  }).onCancel(() => {
    // Action on Cancel
  }).onDismiss(() => {
    // Action on Dismiss
  });
};

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

const uploadImage = async (event) => {
  isLoading.value = true
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
    }finally{
      isLoading.value = false
      SuccessfulMessage('Profile picture has been updated.')
    }
  }
};

const ConfirmationChangePassword = ()=> {
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
  const userId = router.currentRoute.value.query.userId;
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
  z-index: 5;
}

.modal {
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

.profile-modal {
  position: fixed;
  z-index: 1;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
}

.profile-modal .modal-content{
  background-color: #fefefe;
  margin: 10% auto;
  padding: 20px;
  border: 1px solid #888;
  width: 30%;
  max-width: 800px;
}
.profile-image{
  position: relative;
  padding: 0.3rem;
  border-radius: 50%;
  border: 0.3rem solid #400;

}

.profile-image .btn-camera{
  position: absolute;
  bottom: -1rem;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.5);
  border-bottom-left-radius: 50%;
  border-bottom-right-radius: 50%;
  border-top-left-radius: 0%;
  border-top-right-radius: 0%;
  width: 50%;
}

.profile-image .btn-camera i{
  color: white;
}
</style>
