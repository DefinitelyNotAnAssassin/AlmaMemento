<template>
  <Loading v-if="isLoading" />
  <div class="main">
    <div class="container-fluid p-0">
      <NavBar />
      <div>
        <img
          src="../../assets/images/memento-bg.png"
          alt="Memento"
          style="width: 100vw; height: 300px"
        />
      </div>
      <div class="container-fluid p-0 d-flex">
        <MementoSideBar />
        <div class="main-content">
          <div
            style="
              display: flex;
              justify-content: space-between;
              padding: 0.5rem 1rem; margin-left: 125px;
            "
          >
     

            <div class="d-flex justify-content-center" v-if="isCurrentUser">
              <div
                class="background-color-brown card m-3 p-2 pb-5"
                v-if="selectedStatus !== 'Rejected'"
                style="position: relative; left: 45%; width: 500px"
              >
                <div class="d-flex align-items-center">
                  <img
                    :src="
                      userData.photoURL ||
                      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSrg2WnUIHC9h-YDMdULjrK55IN9EFKqSRznTVQxaxnww&s'
                    "
                    style="
                      height: 40px !important;
                      width: 40px !important;
                      border-radius: 50%;
                    "
                    alt="Profile Picture"
                  />
                  <input
                    style="height: 40px"
                    type="text"
                    class="form-control m-0 mx-1"
                    v-model="caption"
                    placeholder="Tell us about your school experiences..."
                  />
                  <button
                    @click="savePost"
                    class="btn btn-light"
                    style="height: 40px"
                  >
                    Post
                  </button>
                </div>
                <button
                  @click="showPostModal"
                  class="btn m-2 text-light"
                  style="position: absolute; bottom: 0; right: 0"
                >
                  <i class="bi bi-card-image"></i> Photos
                </button>
              </div>
            </div>
            <select
              v-model="selectedStatus"
              class="btn btn-success m-2"
              style="
                position: relative;
                top: -5rem;
                z-index: 0;
                height: min-content;
              "
              v-if="isCurrentUser"
            >
              <option>Approved</option>
              <option>Rejected</option>
              <option>Pending</option>
            </select>
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
                <button
                  class="btn btn-primary m-1"
                  @click="continueModal"
                  :disabled="!isValidSelected"
                >
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
                    accept="image/*"
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
                  <button class="btn btn-secondary" @click="showPostModal">
                    Back
                  </button>
                  <button
                    class="btn-post btn btn-secondary"
                    @click="savePost"
                    style="
                      border-radius: 0.5rem;
                      padding: 0.45rem 1rem;
                      margin-left: 0.5rem;
                    "
                  >
                    Post
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div
            class="d-flex flex-column align-items-center"
            style="overflow-y: scroll;  "
          >
          <div
              style="width: 550px;"
              v-for="post in approvedPosts.slice()"
              :key="post.id"

              :id="post.id"
              class="container card p-3 background-color-brown text-light my-2"
            >
              <div
                class="btn-dot"
                v-if="post.isCurrentUser"
                @click="toggleEdit(post)"
              >
                <span></span>
                <span></span>
                <span></span>
              </div>
              <div class="post-actions" v-if="post.isEdit">
                <button
                  class="btn btn-dark btn-edit"
                  style="  font-size: 1rem;"
                  @click="EditPostDialog(post)"
                >
                  Edit
                </button>
                <button
                  class="btn btn-danger "
    
                  @click="ConfirmDeleteDialog(post)"
                >
                  Delete
                </button>
              </div>
              <router-link
                :to="{
                  path: '/memento',
                  query: { userId: post.userIdOrig, alumniId: post.userId },
                }"
                style="
                  font-size: 1.5rem;
                  text-decoration: none;
                  color: white;
                  width: max-content;
                "
                >{{ post.name }}</router-link
              >
                <br>
              <p>{{ post.caption }}</p>
              <div
                v-if="post.imageUrls && post.imageUrls.length > 0"
                id="imageCarousel"
                class="carousel slide"
                data-bs-ride="carousel">
                <div class="carousel-inner">
              
                  <div
                  v-for="(imageUrl, index) in post.imageUrls"
                    :key="index"
                    
                  class="carousel-item"
                  :class="{
                      'carousel-item': true,
                        active: index === anotherIndex,
                    }"
                    
                    >
                      <img
                        v-if="imageUrl.type.startsWith('image/')"
                        :src="imageUrl.url"
                        class="d-block w-100"
                      alt="Image Preview"
                      style="width: 100px; height: 400px"
                      
                        controls
                        @click="openImageModal(imageUrl)"
                      />
                      <video
                        v-else
                        :src="imageUrl.url"
                        class="d-block w-100"
                      alt="Video Preview"
                      style="width: 100px; height: 400px"
                        controls
                        @click="openImageModal(imageUrl)"
                      ></video>
                   
                  </div>
                </div>
                <button
                  v-if="post.imageUrls.length > 1"
                  class="carousel-control-prev"
                  type="button"
                  data-bs-target="#imageCarousel"
                  data-bs-slide="prev"
                  @click.prevent="prevImage(post)"
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
                  @click.prevent="nextImage(post)"
                >
                  <span
                    class="carousel-control-next-icon"
                    aria-hidden="true"
                  ></span>
                  <span class="visually-hidden">Next</span>
                </button>
              </div>
              <!-- <div v-else>No images available</div> -->

              <!-- Likes -->
              <div class="d-flex align-items-center mt-2">
                <a
                  href="#"
                  @click.prevent="toggleLike(post)"
                  class="text-light"
                  style="text-decoration: none !important"
                >
                  <i
                    class="bi"
                    :class="{
                      'bi-heart-fill': post.likedBy.includes(userId),
                      'bi-heart': !post.likedBy.includes(userId),
                    }"
                  ></i>
                  {{ post.likes }}
                </a>
                <a
                  href="#"
                  @click.prevent="toggleComments(post)"
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
                  <div>
                    <button
                      @click="editComment(comment, post)"
                      class="btn-edit-comment"
                      v-if="comment.userId === userId"
                      style="
                        background: none;
                        color: white;
                        border: none;
                        text-decoration: underline;
                        font-size: 0.8rem;
                      "
                    >
                      Edit
                    </button>
                    <button
                      @click="deleteComment(comment, post)"
                      class="btn-delete-comment"
                      v-if="
                        post.userIdOrig === userId || comment.userId === userId
                      "
                      style="
                        background: none;
                        color: white;
                        border: none;
                        text-decoration: underline;
                        font-size: 0.8rem;
                        margin-left: 0.5rem;
                      "
                    >
                      Delete
                    </button>
                  </div>
                </div>

                <input
                  v-model="post.newComment"
                  @keyup.enter="addComment(post)"
                  type="text"
                  style="
                    padding: 0.5rem 1rem;
                    border: none;
                    margin-top: 0.5rem;
                    width: 100%;
                    outline: none;
                  "
                  placeholder="Add a comment..."
                />
              </div>
              <hr class="pt-1" />
              <p>{{ post.schoolYear }} - {{ post.event }}</p>
              <p>
                Posted on: {{ formatApprovalDate(getLatestApprovalDate(post)) }}
              </p>
            </div>


            
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import Loading from "../loading.vue";
import { useQuasar } from "quasar";
import { ref, onMounted, computed, watch, defineProps, nextTick } from "vue";
import NavBar from "./alumni-navbar.vue";
import SideBar from "./alumni-sidebar.vue";
import MementoSideBar from "./memento-sidebar.vue";
import { db, storage } from "../../firebase/index.js";

import {
  collection,
  getDocs,
  addDoc,
  onSnapshot,
  getDoc,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import {
  ref as storageRef,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject
} from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
import { useRouter } from "vue-router";


const isLiked = ref(false);
const showModal = ref(false);
const showImageModal = ref(false);
const schoolYears = ref([]);
const events = ref([]);
const selectedSchoolYear = ref("");
const selectedEvent = ref("");
const caption = ref("");
const anotherIndex = ref(0);
const selectedImages = ref([]);
const selectedFiles = ref([]);
const selectedStatus = ref("Approved");
const progressBars = ref([]);
const router = useRouter();
const userId = computed(() => router.currentRoute.value.query.userId);
const alumniId = computed(() => router.currentRoute.value.query.alumniId);
const isImageSelected = computed(() => selectedImages.value.length > 0);
const showAllImages = ref(false);
const posts = ref([]);
const isLoading = ref(false);
const $q = useQuasar();
const isCurrentUser = ref(false);
const currentIndex = ref(0);

const isOpen = ref(false);
const imageUrl = ref("");
const fileType = ref("")
const isAction = ref(false);
const isEdit = ref(false);
const isEditPostId = ref("");
const editCommentText = ref("");
const currentComment = ref(null);
const currentPost = ref(null);
// Edited start
const userData = ref({
  name: "",
  email: "",
  idNumber: "",
  course: "",
  classYear: "",
  phone: "",
  photoURL: "",
});

const CustomDialog = (title, message) => {
  $q.dialog({
    title,
    message,
  })
    .onOk(() => {
      // console.log('OK')
    })
    .onCancel(() => {
      // console.log('Cancel')
    })
    .onDismiss(() => {
      // console.log('I am triggered on both OK and Cancel')
    });
};

function nextImage(post) {
  if (anotherIndex < post.imageUrls.length - 1) {
    anotherIndex.value++;
  } else {
    anotherIndex.value = 0; // Reset to the first image if at the end
  }
}

function prevImage(post) {
  console.log("Current Index: ", post)
  if (anotherIndex > 0) {
    anotherIndex.value--;
  } else {
    anotherIndex.value = post.imageUrls.length - 1; // Go to the last image if at the beginning
  }
}


const ConfirmDeleteDialog = (post) => {
  toggleEdit(post);
  $q.dialog({
    title: "Confirmation",
    message: "Are you sure you want to delete this post?",
    cancel: true,
    persistent: true,
  })
    .onOk(() => {
      DeletePost(post);
    })
    .onCancel(() => {
      // Action on Cancel
    })
    .onDismiss(() => {
      // Action on Dismiss
    });
};

const DeletePost = async (post) => {
  try {
    console.log("Deleting post: ", post)
    try{
      const imageUrls = post.imageUrls;
      console.log("Image Urls: ", imageUrls)
      imageUrls.forEach(async (url) => {
        const filePath = url.url.split('/o/')[1].split('?')[0];
        const decodedFilePath = decodeURIComponent(filePath);
        const imageRef = storageRef(storage, decodedFilePath);
        
        try {
          await deleteObject(imageRef);
          console.log("Deleted image:", decodedFilePath);
        } catch (error) {
          console.error("Error deleting image:", decodedFilePath, error);
          CustomDialog("Error", error.message);
        }
      });
    } catch (error) {
      CustomDialog("Error", error.message);
    }
    const postRef = doc(db, "posts", post.id);
    await deleteDoc(postRef);

    // also delete the images from storage
    
    posts.value = posts.value.filter((p) => p.id !== post.id); // Remove locally for immediate UI feedback
    CustomDialog("Success", "Post has been deleted successfully.");
  } catch (error) {
    CustomDialog("Error", error.message);
  }
};

const editComment = (comment, post) => {
  currentComment.value = comment;
  currentPost.value = post;
  editCommentText.value = comment.text;
  $q.dialog({
    title: "Comment",
    message: "Enter your new Comment?",
    prompt: {
      model: comment.text,
      type: "text",
    },
    cancel: true,
    persistent: true,
  })
    .onOk((data) => {
      saveEditComment(data);
    })
    .onCancel(() => {
      // console.log('>>>> Cancel')
    })
    .onDismiss(() => {
      // console.log('I am triggered on both OK and Cancel')
    });
};

const saveEditComment = async (data) => {
  const commentIndex = currentPost.value.comments.findIndex(
    (c) => c.id === currentComment.value.id
  );
  if (commentIndex !== -1) {
    currentPost.value.comments[commentIndex].text = data;
    try {
      await updateDoc(doc(db, "posts", currentPost.value.id), {
        comments: currentPost.value.comments,
        latestComment: currentPost.value.comments[commentIndex],
      });
    } catch (error) {
      console.error("Error updating comment: ", error);
      $q.dialog({ title: "Error", message: "Failed to update comment" });
    }
  }
};

const deleteComment = async (comment, post) => {
  $q.dialog({
    title: "Confirm",
    message: "Are you sure you want to delete this comment?",
    cancel: true,
    persistent: true,
  })
    .onOk(async () => {
      const commentIndex = post.comments.findIndex((c) => c.id === comment.id);
      if (commentIndex !== -1) {
        post.comments.splice(commentIndex, 1);
        try {
          await updateDoc(doc(db, "posts", post.id), {
            comments: post.comments,
            latestComment:
              post.comments.length > 0
                ? post.comments[post.comments.length - 1]
                : null,
          });
        } catch (error) {
          console.error("Error deleting comment: ", error);
          $q.dialog({ title: "Error", message: "Failed to delete comment" });
        }
      }
    })
    .onCancel(() => {});
};



const openImageModal = (url) => {
  imageUrl.value = url.url;
  fileType.value = url.type
  isOpen.value = true;
  
};





import imageCompression from 'browser-image-compression';


const uploadFiles = async (event) => {
  const maxFiles = 10;
  const files = event.target.files;

  if (selectedFiles.value.length + files.length > maxFiles) {
    $q.dialog({title: "Errors", message: "You can upload a maximum of 10 files. File Name: " + files.name})
    selectedFiles.value = [] 
    return;
  }

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    if (file.type.startsWith('video/')) {
      const duration = await getVideoDuration(file);
      if (duration > 25) {
        selectedFiles.value = []
        $q.dialog({title: "Errors", message: "Video length should not exceed 25 seconds."})
        return;
      }
    }

    if (file.type.startsWith('image/')){

      // limit image for 2mb, if lower alert and return 

      if(file.size > 2000000){
        $q.dialog({title: "Errors", message: "Image size should not exceed 2MB. File Name: " + file.name})
        selectedFiles.value = []

        return;
      }
    }

    const storageReference = storageRef(storage, `files/${file.name}`);
    const uploadTask = uploadBytesResumable(storageReference, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        progressBars.value[i] = progress;
      },
      (error) => {
        console.error("Error uploading file:", error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((url) => {
          selectedFiles.value.push({ url, type: file.type });
          progressBars.value[i] = 100;
        });
      }
    );
  }
};

const getVideoDuration = (file) => {
  return new Promise((resolve) => {
    const video = document.createElement("video");
    video.preload = "metadata";
    video.onloadedmetadata = () => {
      window.URL.revokeObjectURL(video.src);
      resolve(video.duration);
    };
    video.src = URL.createObjectURL(file);
  });
};


function toggleEdit(post) {
  post.isEdit = !post.isEdit;
}
async function savePost() {
  if (caption.value.length == 0) {
    $q.dialog({title: "Warning", message: "Required caption"});
    return;
  }
  const success = ref(false);
  isLoading.value = true;

  if (isEdit.value) {
    try {
      const userSnapshot = await getDocs(collection(db, "users"));
      const userData = userSnapshot.docs
        .find((doc) => doc.id === userId.value)
        ?.data();
      const userName = `${userData.fName} ${userData.lName}`;
      const postRef = doc(db, "posts", isEditPostId.value);

      const post = {
        schoolYear: selectedSchoolYear.value,
        event: selectedEvent.value,
        caption: caption.value,
        imageUrls: selectedFiles.value,
        status: "pending",
        time: new Date(),
        date: new Date().toLocaleDateString(),
        history: [{ admin: userName, status: "pending", time: new Date() }],
      };
      await updateDoc(postRef, post);

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
      success.value = true;
    } catch (error) {
      $q.dialog(
        {
          title: "Something Problem",
          message:  "You need to login again"
        }
      ).onOk(()=>{
        router.push({name: "login"})
      })
      success.value = false;
    } finally {
      isLoading.value = false;
      closeImageModal();
      if (success.value)
        CustomDialog(
          "Waiting for Approval",
          "We will notify you once your post has been approved."
        );
    }
  } else {
    try {
      const userSnapshot = await getDocs(collection(db, "users"));
      const userData = userSnapshot.docs
        .find((doc) => doc.id === userId.value)
        ?.data();
      const userName = `${userData.fName} ${userData.lName}`;
      const post = {
        userIdOrig: userId.value,
        userId: alumniId.value,
        name: userName,
        schoolYear: selectedSchoolYear.value,
        event: selectedEvent.value,
        caption: caption.value,
        imageUrls: selectedFiles.value,
        status: "pending",
        time: new Date(),
        date: new Date().toLocaleDateString(),
        history: [{ admin: userName, status: "pending", time: new Date() }],
        likedBy: [],
        likes: 0,
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
      success.value = true;
    } catch (error) {
      $q.dialog(
        {
          title: "Something Problem",
          message:  "You need to login again"
        }
      ).onOk(()=>{
        router.push({name: "login"})
      })
      success.value = false;
    } finally {
      isLoading.value = false;
      if (success.value)
        CustomDialog(
          "Waiting for Approval",
          "We will notify you once your post has been approved."
        );
    }
  }
}

async function saveStory() {
  if(caption.value.trim() == ""){
    $q.dialog({title: "Warning",message: "Caption required."})
    return
  }

  const userSnapshot = await getDocs(collection(db, "users"));
  const userData = userSnapshot.docs
    .find((doc) => doc.id === userId.value)
    ?.data();
  const userName = `${userData.fName} ${userData.lName}`;

  const post = {
    userId: alumniId.value,
    name: userName,
    caption: caption.value,
    status: "pending",
    history: [],
    likedBy: [], // Initialize with an empty array
    likes: 0, // Initialize likes count
    time: new Date(),
    date: new Date().toLocaleDateString(),
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
  CustomDialog(
          "Waiting for Approval",
          "We will notify you once your post has been approved."
        );

        caption.value = ""
}

const EditPostDialog = (post) => {
  toggleEdit(post);
  showPostModal();
  selectedSchoolYear.value = post.schoolYear;
  selectedEvent.value = post.event;
  caption.value = post.caption;
  selectedFiles.value = post.imageUrls;
  isEditPostId.value = post.id;
  console.log("Edit Post: ", isEdit.value);
  console.log("Post Id: ", post.id);
};

const EditPost = async (post, caption) => {
  try {
    const postRef = doc(db, "posts", post.id);
    await updateDoc(postRef, {
      caption: caption,
    });
    post.caption = caption;
    CustomDialog("Success", "Post caption has been updated successfully");
  } catch (error) {
    CustomDialog("Error", error.message);
  }
};
const fetchUserData = async () => {
  const userId = router.currentRoute.value.query.userId;
  const userDocRef = doc(db, "users", userId);
  const userDocSnap = await getDoc(userDocRef);

  const currentUser = localStorage.getItem("userId");
  if (userId !== currentUser) {
    isCurrentUser.value = false;
  } else {
    isCurrentUser.value = true;
  }

  if (userDocSnap.exists()) {
    const user = userDocSnap.data();
    const name = `${user.fName} ${user.mInitial} ${user.lName}`;

    userData.value = {
      ...user,
      name: name.trim(),
      photoURL: user.profilePicture,
    };
    console.log("memento name: " + userData.name);
  } else {
    console.log("User not found");
  }
};
fetchUserData();

// Edited End



router.afterEach(async (to, from) => {
      if (to.path === '/memento' && to.query.mementoId) {
        console.log("Triggered");
        
        await nextTick();    
        selectedStatus.value = "Rejected";
        console.log(selectedStatus.value);

   
        const element = document.getElementById(to.query.mementoId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        } else { 
          console.log("Element not found");
        }
      }
    });

function showPostModal() {
  showModal.value = true;
  if (showModal.value) {
    showImageModal.value = false;
  } else {
    showImageModal.value = true;
  }
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
  for (let i = 0; i < event.target.files.length; i++) {
    const file = event.target.files[i];
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


const toggleLike = async (post) => {
  const userSnapshot = await getDocs(collection(db, "users"));
  const userData = userSnapshot.docs
    .find((doc) => doc.id === userId.value)
    ?.data();
  const userName = `${userData.fName} ${userData.lName}`;

  const postRef = doc(db, "posts", post.id);
  const postSnapshot = await getDoc(postRef);
  const postData = postSnapshot.data();
  const likedBy = postData.likedBy || [];
  const postId = postData.id;
  const postAuthor = postData.userIdOrig;

  const notification = {
    userId: alumniId.value,
    postId: postId,
    authorId: post.userId,
    name: userName,
    postCaption: post.caption,
    time: new Date(),
    date: new Date().toLocaleDateString(),
    status: "unread",
    message: `${userName} liked your post.`,
    for: "alumni",
    type: "newLike",
  };

  if (likedBy.includes(userId.value)) {
    // If the user has already liked the post, unlike it
    const updatedLikes = likedBy.filter((id) => id !== userId.value);
    isLiked.value = updatedLikes;
    await updateDoc(postRef, {
      likedBy: updatedLikes,
      likes: updatedLikes.length,
    });
  } else {
    const updatedLikes = [...likedBy, userId.value];
    await updateDoc(postRef, {
      likedBy: updatedLikes,
      likes: updatedLikes.length,
    });

    if (userId.value !== postAuthor) {
      await addDoc(collection(db, "notifications"), notification);
    }
  }
};




const approvedPosts = computed(() => {
  return posts.value
    .filter(
      (post) =>
        post.status === selectedStatus.value.toLowerCase() &&
        post.userIdOrig === userId.value
    )
    .sort((a, b) => {

      return b.time - a.time;
      
    });
});


async function addComment(post) {
  if (post.newComment.trim() === "") return;
  const newId = uuidv4();
  const postId = post.id;
  const postAuthor = post.userIdOrig;
  const userSnapshot = await getDocs(collection(db, "users"));
  const userData = userSnapshot.docs
    .find((doc) => doc.id === userId.value)
    ?.data();
  const userName = `${userData.fName} ${userData.lName}`;

  const notification = {
    userId: alumniId.value,
    postId: postId,
    postCaption: post.caption,
    name: userName,
    authorId: post.userId,
    time: new Date(),
    date: new Date().toLocaleDateString(),
    status: "unread",
    message: `${userName} commented on your post.`,
    for: "alumni",
    type: "newComment",
  };

  const newComment = {
    id: newId,
    userId: userId.value,
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
    if (userId.value !== postAuthor) {
      await addDoc(collection(db, "notifications"), notification);
    }
  } catch (error) {
    console.error("Error adding comment:", error);
  }
}

function formatApprovalDate(timestamp) {
  console.log(timestamp);
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
  console.log(post);
  if (!post.history || post.history.length === 0) {
    return "No approval date available";
  }

  const latestTime = post.history.reduce((latest, entry) => {
    return entry.time > latest ? entry.time : latest;
  }, post.history[0].time);
  console.log(latestTime);
  return latestTime;
}

watch(approvedPosts, (newPosts, oldPosts) => {
  console.log("New approved posts:", newPosts);
});

const isValidSelected = computed(() => {
  return selectedSchoolYear.value !== "" && selectedEvent.value !== "";
});

watch(approvedPosts, (newPosts, oldPosts) => {
  console.log("New approved posts:", newPosts);
});

watch(isValidSelected, (newSelect, oldSelect) => {
  console.log("isSelected:", newSelect);
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
    posts.value = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        likedBy: data.likedBy || [], // Ensure likedBy is always an array
        likes: data.likes || 0, // Ensure likes is always a number
        comments: data.comments || [], // Ensure comments is always an array
        showComments: false,
        commentsLoaded: false,
        isCurrentUser: data.userIdOrig === userId.value,
        newComment: "",
        isEdit: false,
      };
    });
  });
});
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
  overflow-x: hidden;
  overflow-y: hidden;
  background-color: rgb(0, 0, 0);
  background-color: rgba(0, 0, 0, 0.4);
}

/* Modal content */
.main-content {
  width: calc(100% - 400px);
}


.btn-dot {
  height: 1.5rem;
  width: 0.4rem;
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  position: absolute;
  right: 1rem;
  cursor: pointer;
}

.btn-dot span {
  display: block;
  width: 0.4rem;
  height: 0.4rem;
  background: white;
  border-radius: 50%;
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
.btn-post {
  background-color: #400;
  color: #fff;
  padding: 10px 15px 10px 15px;
  border-radius: 15px;
}
.btn-post:hover {
  background-color: #330303;
  color: #fff;
  padding: 10px 15px 10px 15px;
  border-radius: 15px;
}

.input-container select {
  background: url("data:image/svg+xml;base64,PHN2ZyBmaWxsPSIjMDAwMDAwIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgdmlld0JveD0iMCAwIDE2IDE2Ij4gPHBhdGggZD0iTTEuNDI4IDMuMjE3YTEuMzc5IDEuMzc5IDAgMCAxIDEuOTU0LS4wMDhsNS42MDcgNS42MDcgNS42MDctNS42MDdhMS4zNzggMS4zNzggMCAxIDEgMS45NTQgMS45NTRsLTYuNTg0IDYuNTg1YTEuMzc5IDEuMzc5IDAgMCAxLTEuOTU0IDBsLTYuNTg0LTYuNTg1YTEuMzc5IDEuMzc5IDAgMCAxLS4wMDgtMS45NTR6Ii8+PC9zdmc+")
    no-repeat right 0.75rem center/8px 8px;
}

.main {
  overflow-x: hidden;
 
}
</style>
