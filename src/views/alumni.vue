<template>
  <div class="main">
    <div class="container-fluid p-0">
      <NavBar />
      <div class="container-fluid d-flex">
        <SideBar />
        <div class="main-content">
          <p>
            <button @click="showPostModal" class="btn">Add Post</button>
          </p>
          
          <div v-if="showModal" class="modal">
            <div class="modal-content">
              <span class="close" @click="closeModal">&times;</span>
              <label for="schoolYear">Select School Year:</label>
              <select id="schoolYear" v-model="selectedSchoolYear">
                <option v-for="year in schoolYears" :key="year.id" :value="year.id">{{ year.name }}</option>
              </select>
              <label for="event">Select Event:</label>
              <select id="event" v-model="selectedEvent">
                <option v-for="event in events" :key="event.id" :value="event.id">{{ event.name }}</option>
              </select>
              <button @click="continueModal">Continue</button>
              <button @click="closeModal">Cancel</button>
            </div>
          </div>
          
          <div v-if="showImageModal" class="modal">
            <div class="modal-content">
              <span class="close" @click="closeImageModal">&times;</span>
              <textarea v-model="caption" placeholder="Enter caption"></textarea>
              <input type="file" @change="uploadImage" />
              <div class="image-preview" v-if="imageUrl">
                <img :src="imageUrl" alt="Preview" />
              </div>
              <button @click="savePost">Save Post</button>
            </div>
          </div>

          <div class="posts-container card-container container p-3 bg-dark">
            <div v-for="post in approvedPosts" :key="post.id" class="container card p-3 background-color-brown text-light mt-2">
              <h3>{{ post.caption }}</h3>
              <img :src="post.imageUrl" alt="Post Image" />
              <hr class="pt-1">
              <p>{{ post.schoolYear }} - {{ post.event }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import NavBar from "./alumni-components/alumni-navbar.vue";
import SideBar from "./alumni-components/alumni-sidebar.vue";
import { db, storage} from '../firebase/index.js';
import { collection, getDocs, addDoc } from 'firebase/firestore'
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useRouter } from 'vue-router'

const showModal = ref(false);
const showImageModal = ref(false);
const schoolYears = ref([]);
const events = ref([]);
const selectedSchoolYear = ref("");
const selectedEvent = ref("");
const caption = ref("");
const imageUrl = ref("");
const status = ref("");
const router = useRouter()
const userId = router.currentRoute.value.query.userId

const posts = ref([]);
const approvedPosts = ref([]);

function showPostModal() {
  showModal.value = true;
}

function closeModal() {
  showModal.value = false;
}

function continueModal() {
  showModal.value = false;
  showImageModal.value = true;
}

function closeImageModal() {
  showImageModal.value = false;
  selectedSchoolYear.value = "";
  selectedEvent.value = "";
  caption.value = "";
  imageUrl.value = "";
}

function uploadImage(event) {
  const file = event.target.files[0];
  const storageReference = storageRef(storage, `images/${file.name}`);
  uploadBytes(storageReference, file).then(() => {
    getDownloadURL(storageReference).then(url => {
      imageUrl.value = url;
    }).catch(error => {
      console.error('Error getting download URL:', error);
    });
  }).catch((error) => {
    console.error('Error uploading image:', error);
  });
}

async function savePost() {
  const post = {
    userId: userId,
    schoolYear: selectedSchoolYear.value,
    event: selectedEvent.value,
    caption: caption.value,
    imageUrl: imageUrl.value,
    status: ""
  };
  await addDoc(collection(db, 'posts'), post);
  closeImageModal();
}

onMounted(async () => {
  const coursesSnapshot = await getDocs(collection(db, 'classYears'));
  schoolYears.value = coursesSnapshot.docs.map(doc => ({ id: doc.id, name: doc.data().name }));

  const classYearsSnapshot = await getDocs(collection(db, 'events'));
  events.value = classYearsSnapshot.docs.map(doc => ({ id: doc.id, name: doc.data().name }));

  const postsSnapshot = await getDocs(collection(db, 'posts'));
  posts.value = postsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

  approvedPosts.value = posts.value.filter(post => post.status === 'approved');
});
</script>

<style>
.modal {
  display: flex; /* Hidden by default */
  position: fixed; /* Stay in place */
  z-index: 1; /* Sit on top */
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto; /* Enable scroll if needed */
  background-color: rgb(0,0,0); /* Fallback color */
  background-color: rgba(0,0,0,0.4); /* Black w/ opacity */
}

/* Modal content */
/* Modal content */
.modal-content {
  background-color: #fefefe;
  margin: 15% auto;
  padding: 20px;
  border: 1px solid #888;
  width: 80%;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* Close button */
.close {
  color: #aaa;
  float: right;
  font-size: 28px;
  font-weight: bold;
  position: absolute;
  top: 10px;
  right: 10px;
}

.close:hover,
.close:focus {
  color: black;
  text-decoration: none;
  cursor: pointer;
}

/* Image preview */
.image-preview {
  margin-top: 10px;
  max-width: 100%;
  height: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.image-preview img {
  max-width: 100%;
  max-height: 300px; /* Limit the height of the image */
  margin-top: 10px; /* Add some space between the image and other elements */
}

.posts-container {
  height: calc(90vh - 70px);
  width: 100% !important;
  overflow-y: auto;
}
</style>
