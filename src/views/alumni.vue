<template>
  <div class="main">
    <div class="container-fluid p-0">
      <NavBar />
      <div class="container-fluid p-0 d-flex">
        <SideBar />
        <div class="main-content">
          <div class="d-flex justify-content-center">
            <div
              class="background-color-brown card m-3 p-2 pb-5"
              style="position: relative; width: 500px"
            >
              <div class="d-flex align-items-center">
                <img
                  src="https://scontent.fmnl4-6.fna.fbcdn.net/v/t39.30808-6/441204475_122128868540246120_5470515469793099504_n.jpg?_nc_cat=107&ccb=1-7&_nc_sid=5f2048&_nc_eui2=AeEHdxMJCaCsLsFSM-wYtFe3XosaZDEWO_VeixpkMRY79TJ_9UeU8ZAtSnOblRBciZ_8Q9QicYbJldRWKiq41WfR&_nc_ohc=IbNiD3P1d_0Q7kNvgEA5qtT&_nc_ht=scontent.fmnl4-6.fna&oh=00_AYAJDf4u4ynNxOHDxctLsm2DsduxRh4zfnORs09d16hCmw&oe=664FB891"
                  style="
                    height: 40px !important;
                    width: 40px !important;
                    border-radius: 50%;
                  "
                />
                <input
                  style="height: 40px"
                  type="text"
                  class="form-control m-0 mx-1"
                  v-model="message"
                  placeholder="Tell us about your school experiences..."
                />
                <button
                  @click="saveStory"
                  class="btn btn-light"
                  style="height: 40px"
                >
                  <i class="bi bi-plus"></i>
                </button>
              </div>
              <button
                @click="showPostModal"
                class="btn m-2 text-light"
                style="position: absolute; bottom: 0; right: 0"
              >
                <i class="bi bi-card-image"></i> Photo
              </button>
            </div>
          </div>
          <div v-if="showModal" class="modal">
            <div class="modal-content container">
              <div
                class="modal-header d-flex justify-content-between align-items-center text-light background-color-brown"
              >
                <span>Select year and event to proceed</span>
                <span class="close" @click="closeModal">&times;</span>
              </div>
              <div class="input-container mt-5 pt-5">
                <label for="schoolYear">Year:</label>
                <select
                  id="schoolYear"
                  v-model="selectedSchoolYear"
                  class="form-control"
                >
                  <option
                    v-for="year in schoolYears"
                    :key="year.id"
                    :value="year.name"
                  >
                    {{ year.name }}
                  </option>
                </select>
              </div>
              <div class="input-container mt-2">
                <label for="event">Event:</label>
                <select id="event" v-model="selectedEvent" class="form-control">
                  <option
                    v-for="event in events"
                    :key="event.id"
                    :value="event.name"
                  >
                    {{ event.name }}
                  </option>
                </select>
              </div>
              <div class="d-flex justify-content-end mt-3">
                <button class="btn btn-secondary m-1" @click="closeModal">
                  Cancel
                </button>
                <button class="btn btn-primary m-1" @click="continueModal">
                  Continue
                </button>
              </div>
            </div>
          </div>

          <div v-if="showImageModal" class="modal">
            <div class="modal-content">
              <div
                class="modal-header d-flex justify-content-between align-items-center text-light background-color-brown"
              >
                <span>Username / Name Here</span>
                <span class="close" @click="closeImageModal">&times;</span>
              </div>
              <div class="d-flex flex-column justify-content-between">
                <div class="modal-main-content-container">
                  <textarea
                    class="form-control mt-2"
                    v-model="caption"
                    placeholder="Enter caption"
                  ></textarea>
                  <input
                    class="form-control mt-2"
                    type="file"
                    multiple
                    @change="uploadImages"
                  />
                  <div
                    v-for="(progress, index) in progressBars"
                    :key="index"
                    class="progress mt-2"
                  >
                    <div
                      class="progress-bar"
                      role="progressbar"
                      :style="{ width: progress + '%' }"
                      :aria-valuenow="progress"
                      aria-valuemin="0"
                      aria-valuemax="100"
                    >
                      {{ progress }}%
                    </div>
                  </div>
                </div>
                <div class="container mt-3">
                  <button class="btn" @click="savePost">Post</button>
                </div>
              </div>
            </div>
          </div>

          <div
            class="d-flex flex-column align-items-center"
            style="height: calc(100vh - 130px); overflow-y: auto"
          >
            <div
              style="width: 400px"
              v-for="post in approvedPosts"
              :key="post.id"
              class="container card p-3 background-color-brown text-light my-2"
            >
              <h3>{{ post.name }}</h3>
              <h5>{{ post.caption }}</h5>
              <div
                v-if="post.imageUrls && post.imageUrls.length > 0"
                id="imageCarousel"
                class="carousel slide"
                data-bs-ride="carousel"
              >
                <div class="carousel-inner">
                  <div
                    v-for="(imageUrl, index) in post.imageUrls"
                    :key="index"
                    class="carousel-item"
                    :class="{ active: index == 0 }"
                  >
                    <img
                      :src="imageUrl"
                      class="d-block w-100"
                      alt="Image Preview"
                    />
                  </div>
                </div>
                <button
                  v-if="post.imageUrls.length > 1"
                  class="carousel-control-prev"
                  type="button"
                  data-bs-target="#imageCarousel"
                  data-bs-slide="prev"
                >
                  <span
                    class="carousel-control-prev-icon"
                    aria-hidden="true"
                  ></span>
                  <span class="visually-hidden">Previous</span>
                </button>
                <button
                  v-if="post.imageUrls.length > 1"
                  class="carousel-control-next"
                  type="button"
                  data-bs-target="#imageCarousel"
                  data-bs-slide="next"
                >
                  <span
                    class="carousel-control-next-icon"
                    aria-hidden="true"
                  ></span>
                  <span class="visually-hidden">Next</span>
                </button>
              </div>
              <div v-else>No images available</div>

              <!-- Likes -->
              <div class="d-flex align-items-center mt-2">
                <a
                  href="#"
                  @click="incrementLikes(post)"
                  class="text-light"
                  style="text-decoration: none !important"
                >
                  <i class="bi bi-heart"></i> {{ post.likes }}
                </a>
                <a
                  href="#"
                  @click="toggleComments(post)"
                  class="text-light mx-2"
                  style="text-decoration: none !important"
                >
                  <i class="bi bi-chat"></i> Comments
                </a>
              </div>
              <!-- Comments -->
              <div v-if="!post.showComments">
                <div v-if="post.latestComment" class="mt-3">
                  <strong>{{ post.latestComment.user }}</strong
                  >: {{ post.latestComment.text }}
                </div>
              </div>
              <div v-if="post.showComments">
                <div v-for="comment in post.comments" :key="comment.id">
                  <strong>{{ comment.user }}</strong
                  >: {{ comment.text }}
                </div>
                <input
                  v-model="post.newComment"
                  @keyup.enter="addComment(post)"
                  type="text"
                  placeholder="Add a comment..."
                />
              </div>
              <hr class="pt-1" />
              <p>{{ post.schoolYear }} - {{ post.event }}</p>
              <p>
                Approved on:
                {{ formatApprovalDate(getLatestApprovalDate(post)) }}
              </p>
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
import { db, storage } from "../firebase/index.js";
import {
  collection,
  getDocs,
  addDoc,
  onSnapshot,
  doc,
  updateDoc,
  getDoc,
} from "firebase/firestore";
import {
  ref as storageRef,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { useRouter } from "vue-router";

const showModal = ref(false);
const showImageModal = ref(false);
const schoolYears = ref([]);
const events = ref([]);
const selectedSchoolYear = ref("");
const selectedEvent = ref("");
const caption = ref("");
const message = ref("");
const selectedImages = ref([]);
const progressBars = ref([]);
const router = useRouter();
const userId = computed(() => router.currentRoute.value.query.userId);
const alumniId = computed(() => router.currentRoute.value.query.alumniId);
const isImageSelected = computed(() => selectedImages.value.length > 0);
const showAllImages = ref(false);
const posts = ref([]);

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
  selectedImages.value = [];
  progressBars.value = [];
}

function uploadImages(event) {
  const maxImages = 10;
  const files = event.target.files;

  if (selectedImages.value.length + files.length > maxImages) {
    console.log("Exceeded maximum number of images allowed");
    return;
  }

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const storageReference = storageRef(storage, `images/${file.name}`);
    const uploadTask = uploadBytesResumable(storageReference, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        progressBars.value[i] = progress;
      },
      (error) => {
        console.error("Error uploading image:", error);
      },
      () => {
        getDownloadURL(storageReference)
          .then((url) => {
            selectedImages.value.push(url);
            progressBars.value[i] = 100;
          })
          .catch((error) => {
            console.error("Error getting download URL:", error);
          });
      }
    );
  }
}

async function savePost() {
  const userSnapshot = await getDocs(collection(db, "users"));
  const userData = userSnapshot.docs
    .find((doc) => doc.id === userId.value)
    ?.data();
  const userName = `${userData.fName} ${userData.lName}`;

  const post = {
    userId: alumniId.value,
    name: userName,
    schoolYear: selectedSchoolYear.value,
    event: selectedEvent.value,
    caption: caption.value,
    imageUrls: selectedImages.value,
    status: "pending",
    history: [],
  };
  await addDoc(collection(db, "posts"), post);

  const notification = {
    userId: alumniId.value,
    name: userName,
    time: new Date(),
    date: new Date().toLocaleDateString(),
    status: "unread",
    for: "modandadmin",
    type: "newpost",
  };
  await addDoc(collection(db, "notifications"), notification);

  closeImageModal();
}

async function saveStory() {
  const userSnapshot = await getDocs(collection(db, "users"));
  const userData = userSnapshot.docs
    .find((doc) => doc.id === userId.value)
    ?.data();
  const userName = `${userData.fName} ${userData.lName}`;

  const post = {
    userId: alumniId.value,
    name: userName,
    caption: message.value,
    status: "pending",
    history: [],
  };
  await addDoc(collection(db, "posts"), post);
  message.value = "";

  const notification = {
    userId: alumniId.value,
    name: userName,
    time: new Date(),
    date: new Date().toLocaleDateString(),
    status: "unread",
    for: "modandadmin",
    type: "newpost",
  };
  await addDoc(collection(db, "notifications"), notification);
}

const approvedPosts = computed(() => {
  return posts.value
    .filter((post) => post.status === "approved")
    .sort((a, b) => {
      const aLatestTime = a.history.reduce(
        (latest, entry) => (entry.time > latest ? entry.time : latest),
        a.history[0].time
      );
      return new Date(aLatestTime);
    });
});

function formatApprovalDate(timestamp) {
  if (!timestamp || !timestamp.seconds) {
    return "Invalid timestamp";
  }
  const date = new Date(timestamp.seconds * 1000);
  const month = date.toLocaleString("default", { month: "short" });
  const day = date.getDate();
  const year = date.getFullYear();
  const time = date.toLocaleString("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });

  return `${month} ${day}, ${year}, ${time}`;
}

function getLatestApprovalDate(post) {
  if (!post.history || post.history.length === 0) {
    return "No approval date available";
  }

  const latestTime = post.history.reduce((latest, entry) => {
    return entry.time > latest ? entry.time : latest;
  }, post.history[0].time);

  return latestTime;
}

watch(approvedPosts, (newPosts, oldPosts) => {
  console.log("New approved posts:", newPosts);
});

onMounted(async () => {
  const coursesSnapshot = await getDocs(collection(db, "classYears"));
  schoolYears.value = coursesSnapshot.docs.map((doc) => ({
    id: doc.id,
    name: doc.data().name,
  }));

  const classYearsSnapshot = await getDocs(collection(db, "events"));
  events.value = classYearsSnapshot.docs.map((doc) => ({
    id: doc.id,
    name: doc.data().name,
  }));

  onSnapshot(collection(db, "posts"), (snapshot) => {
    posts.value = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    approvedPosts.value = posts.value.filter(
      (post) => post.status === "approved"
    );
  });

  posts.value.forEach((post) => {
    post.comments = [];
    post.likes = 0;
    post.showComments = false;
    post.commentsLoaded = false;
    post.newComment = "";
  });
});

async function incrementLikes(post) {
  post.likes++;

  try {
    const postRef = doc(db, "posts", post.id);
    await updateDoc(postRef, {
      likes: post.likes,
    });
  } catch (error) {
    console.error("Error updating likes:", error);
  }
}

function toggleComments(post) {
  post.showComments = !post.showComments;
  if (!post.commentsLoaded) {
    loadComments(post);
    post.commentsLoaded = true;
  }
}

async function loadComments(post) {
  try {
    const postRef = doc(db, "posts", post.id);
    const postDoc = await getDoc(postRef);
    if (postDoc.exists()) {
      const postData = postDoc.data();
      if (postData.comments) {
        post.comments = postData.comments;
      }
    }
  } catch (error) {
    console.error("Error loading comments:", error);
  }
}

async function addComment(post) {
  if (post.newComment.trim() === "") return;

  const userSnapshot = await getDocs(collection(db, "users"));
  const userData = userSnapshot.docs
    .find((doc) => doc.id === userId.value)
    ?.data();
  const userName = `${userData.fName} ${userData.lName}`;

  const newComment = {
    user: userName,
    text: post.newComment,
  };

  try {
    const postRef = doc(db, "posts", post.id);
    const updatedComments = post.comments
      ? [...post.comments, newComment]
      : [newComment];
    await updateDoc(postRef, {
      comments: updatedComments,
      latestComment: newComment,
    });
    post.newComment = "";
  } catch (error) {
    console.error("Error adding comment:", error);
  }
}
</script>

<style scoped>
.modal {
  display: flex;
  position: fixed;
  z-index: 2;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgb(0, 0, 0);
  background-color: rgba(0, 0, 0, 0.4);
}

/* Modal content */
.main-content {
  width: calc(100% - 400px);
}

.modal-content {
  background-color: #fefefe;
  margin: 15% auto;
  padding: 20px;
  border: 1px solid #888;
  width: 400px;
  height: auto;
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

.image-preview img {
  max-width: 300px;
  max-height: 200px;
  margin-top: 10px;
}

.posts-container {
  height: auto;
  width: 100% !important;
  overflow-y: auto;
}
</style>
