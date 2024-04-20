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
            <div class="modal-content container">
              <div class="modal-header d-flex justify-content-between align-items-center text-light background-color-brown">
                <span>Select year and event to proceed</span>
                <span class="close" @click="closeModal">&times;</span>
              </div>
              <div class="input-container mt-5 pt-5">
                <label for="schoolYear">Year:</label>
                <select id="schoolYear" v-model="selectedSchoolYear" class="form-control">
                  <option v-for="year in schoolYears" :key="year.id" :value="year.id">{{ year.name }}</option>
                </select>
              </div>
              <div class="input-container mt-2">
                <label for="event">Event:</label>
                <select id="event" v-model="selectedEvent" class="form-control">
                  <option v-for="event in events" :key="event.id" :value="event.id">{{ event.name }}</option>
                </select>
              </div>
              <div class="d-flex justify-content-end mt-3">
                <button class="btn btn-secondary m-1" @click="closeModal">Cancel</button>
                <button class="btn btn-primary m-1" @click="continueModal">Continue</button>
              </div>
            </div>
          </div>
          
          <div v-if="showImageModal" class="modal">
            <div class="modal-content">
              <div class="modal-header d-flex justify-content-between align-items-center text-light background-color-brown">
                <span>Username / Name Here</span>
                <span class="close" @click="closeImageModal">&times;</span>
              </div>
              <div class="d-flex flex-column justify-content-between bg-dark">
                <div class="modal-main-content-container">
                  <textarea class="form-control mt-2" v-model="caption" placeholder="Enter caption"></textarea>
                  <input class="form-control mt-2" type="file" @change="uploadImage" />
                  <div class="image-preview mt-2" v-if="imageUrl">
                    <img :src="imageUrl" alt="Preview" />
                  </div>
                </div>
                <button class="btn mt-3" @click="savePost">Post</button>
              </div>
            </div>
          </div>

          <div class="posts-container card-container container p-3">
            <div v-for="post in approvedPosts" :key="post.id" class="container card p-3 background-color-brown text-light mt-2">
              <h3>{{ post.name }}</h3>
              <h5>{{ post.caption }}</h5>
              <img :src="post.imageUrl" alt="Post Image" />
              <hr class="pt-1">
              <p>{{ getSchoolYearName(post.schoolYear) }} - {{ getEventName(post.event) }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from "vue";
import NavBar from "./alumni-components/alumni-navbar.vue";
import SideBar from "./alumni-components/alumni-sidebar.vue";
import { db, storage} from '../firebase/index.js';
import { collection, getDocs, addDoc, onSnapshot } from 'firebase/firestore'
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
const userId = computed(() => router.currentRoute.value.query.userId);
const isImageSelected = computed(() => !!imageUrl.value);

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

const getSchoolYearName = id => computed(() => schoolYears.value.find(year => year.id === id)?.name).value;
const getEventName = id => computed(() => events.value.find(event => event.id === id)?.name).value;

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
  if (!isImageSelected.value) {
    console.log("Please select an image before saving the post.");
    return;
  }

  const userSnapshot = await getDocs(collection(db, 'users'));
  const userData = userSnapshot.docs.find(doc => doc.id === userId.value)?.data();
  const userName = `${userData.lName}, ${userData.fName}`;

  const post = {
    userId: userId.value,
    name: userName,
    schoolYear: selectedSchoolYear.value,
    event: selectedEvent.value,
    caption: caption.value,
    imageUrl: imageUrl.value,
    status: ""
  };
  await addDoc(collection(db, 'posts'), post);
  closeImageModal();
}

watch(approvedPosts, (newPosts, oldPosts) => {
  console.log("New approved posts:", newPosts);
});

onMounted(async () => {
  const coursesSnapshot = await getDocs(collection(db, 'classYears'));
  schoolYears.value = coursesSnapshot.docs.map(doc => ({ id: doc.id, name: doc.data().name }));

  const classYearsSnapshot = await getDocs(collection(db, 'events'));
  events.value = classYearsSnapshot.docs.map(doc => ({ id: doc.id, name: doc.data().name }));

  onSnapshot(collection(db, 'posts'), (snapshot) => {
    posts.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    approvedPosts.value = posts.value.filter(post => post.status === 'approved');
  });
});
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
  background-color: rgb(0,0,0); 
  background-color: rgba(0,0,0,0.4); 
}

/* Modal content */
/* Modal content */
.modal-content {
  background-color: #fefefe;
  margin: 15% auto;
  padding: 20px;
  border: 1px solid #888;
  width: 400px;
  position: relative;
}

.modal-header {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 60px;
}

.modal-main-content-container {
  height: calc(100% - 60px);
  margin-top: 60px;
}

/* Close button */
.close {
  color: #aaa;
  font-size: 28px;
  font-weight: bold;
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
  max-width: 400px;
  max-height: 300px; /* Limit the height of the image */
  margin-top: 10px; /* Add some space between the image and other elements */
}

.posts-container {
  /* height: calc(90vh - 70px); */
  width: 100% !important;
  overflow-y: auto;
}
</style>
