<template>
   <Loading v-if="isLoading" />
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
                  :src="
                    userData.photoURL ||
                    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSrg2WnUIHC9h-YDMdULjrK55IN9EFKqSRznTVQxaxnww&s'
                  "
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
                  v-model="caption"
                  placeholder="Tell us about your school experiences..."
                />
                <button
                  @click="saveStory"
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
                    v-for="event in filterEvents"
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
                  <div class="post-images">
                    <div class="image" v-for="image in selectedImages" :key="image">
                      <img :src="image" alt="Post Image" width="100" height="100"/>  
                      <button @click="deleteImage(index)" class="delete-btn">
                        <i class="bi bi-x-circle"></i>
                      </button>
                    </div>
                  </div>
                  <input
                    class="form-control mt-2"
                    type="file"
                    accept="image/*, video/*"
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
                  <button class="btn btn-secondary" @click="showPostModal" style="margin-left: -0.5rem;">
                  Back
                </button>
                  <button class="btn-post btn btn-primary" @click="savePost" style="margin-left: 0.5rem; background: #400; border-color: #400;">Post</button>
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

            <div class="btn-dot" v-if="post.isCurrentUser" >
              <span></span>
              <span></span>
              <span></span>
            </div>
            <div class="post-actions">
               <button class="btn btn-dark btn-edit" @click="EditPostDialog(post)">Edit</button> 
               <button class="btn btn-danger btn-delete" @click="ConfirmDeleteDialog(post)">Delete</button> 
            </div>
            <router-link
        :to="{ path: '/memento', query: { userId: post.userIdOrig, alumniId: post.userId } }"

        style="font-size: 1.5rem; text-decoration: none; color: white; width: max-content"
        >{{ post.name }}</router-link>

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
                    
                    :class="{ 'carousel-item': true, 'active': index === currentIndex }"
                  >
                    <img
                      :src="imageUrl"
                      class="d-block w-100"
                      alt="Image Preview"
                      @click="openImageModal(imageUrl)"
                    />
                  </div>
                </div>
                <button
                  v-if="post.imageUrls.length > 1"
                  class="carousel-control-prev"
                  type="button"
                  data-bs-target="#imageCarousel"
                  data-bs-slide="prev"
                  @click="prevImage(post)"
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
                  @click="nextImage(post)"
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
                  @click="toggleLike(post)"
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
                  <div>
                  <button @click="editComment(comment, post)" class="btn-edit-comment" v-if="comment.userId === userId" style="background: none; color: white; border: none; text-decoration: underline; font-size: 0.8rem;">Edit</button>
                  <button @click="deleteComment(comment, post)" class="btn-delete-comment" v-if="post.userIdOrig === userId || comment.userId === userId" style="background: none; color: white; border: none; text-decoration: underline; font-size: 0.8rem; margin-left: 0.5rem;">Delete</button>
                  </div>
                </div>

                <input
                  v-model="post.newComment"
                  @keyup.enter="addComment(post)"
                  type="text"
                  style="padding: 0.5rem 1rem; border: none; margin-top: 0.5rem; width: 100%; outline: none;"
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
  <div v-if="isOpen" class="modal">
    <div class="modal-content">
      <span @click="closePostImageModal" class="close">&times;</span>
      <img
        :src="imageUrl"
        alt="Preview Image"
        style="max-width: 100%; max-height: 80vh"
      />
    </div>
  </div>
</template>

<script setup>
import Loading from "./loading.vue";
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
  deleteDoc
} from "firebase/firestore";
import {
  ref as storageRef,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { useRouter } from "vue-router";
import { useQuasar } from 'quasar'

const $q = useQuasar()

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
const isOpen = ref(false);
const imageUrl = ref("");
const isLoading = ref(false);
const isLiked = ref(false)
const isAction = ref(false)
const isEdit = ref(false)
const isEditPostId = ref("")
const currentIndex = ref(0);
const editCommentText = ref("");
const currentComment = ref(null);
const currentPost = ref(null);
import { v4 as uuidv4 } from 'uuid';
const userData = ref({
  name: "",
  full_name: "",
  email: "",
  idNumber: "",
  pab: "",
  classYear: "",
  phone: "",
  photoURL: "",
});

const deleteImage = (index) => {
  selectedImages.value.splice(index, 1);
};

function nextImage(post) {
  if (currentIndex.value < post.imageUrls.length - 1) {
    currentIndex.value++;
  } else {
    currentIndex.value = 0; // Reset to the first image if at the end
  }
}

function prevImage(post) {
  if (currentIndex.value > 0) {
    currentIndex.value--;
  } else {
    currentIndex.value = post.imageUrls.length - 1; // Go to the last image if at the beginning
  }
}


const CustomDialog = (title,message)=> {
      $q.dialog({
        title,
        message
      }).onOk(() => {
        // console.log('OK')
      }).onCancel(() => {
        // console.log('Cancel')
      }).onDismiss(() => {
        // console.log('I am triggered on both OK and Cancel')
      })
    }

  const ConfirmDeleteDialog = (post) => {
      $q.dialog({
        title: 'Confirmation',
        message: 'Are you sure you want to delete this post?',
        cancel: true,
        persistent: true,
      }).onOk(() => {
        DeletePost(post);
      }).onCancel(() => {
        // Action on Cancel
      }).onDismiss(() => {
        // Action on Dismiss
      });
};    

const DeletePost = async (post) =>{
  try {
    const postRef = doc(db, "posts", post.id);
    await deleteDoc(postRef);
    posts.value = posts.value.filter(p => p.id !== post.id); // Remove locally for immediate UI feedback
    CustomDialog("Success", "Post has been deleted successfully.")
  } catch (error) {
    CustomDialog("Error", error.message)
  }
}

const editComment = (comment, post) => {
  currentComment.value = comment;
  currentPost.value = post;
  editCommentText.value = comment.text;
  $q.dialog({
        title: 'Comment',
        message: 'Enter your new Comment?',
        prompt: {
          model: comment.text,
          type: 'text'
        },
        cancel: true,
        persistent: true
      }).onOk(data => {
        saveEditComment(data)
      }).onCancel(() => {
        // console.log('>>>> Cancel')
      }).onDismiss(() => {
        // console.log('I am triggered on both OK and Cancel')
      })
};


const saveEditComment = async (data) => {
  const commentIndex = currentPost.value.comments.findIndex(c => c.id === currentComment.value.id);
  if (commentIndex !== -1) {
    currentPost.value.comments[commentIndex].text = data;
    try {
      await updateDoc(doc(db, "posts", currentPost.value.id), {
        comments: currentPost.value.comments,
        latestComment: currentPost.value.comments[commentIndex]
      });
    } catch (error) {
      console.error("Error updating comment: ", error);
      $q.dialog({ title: 'Error', message: 'Failed to update comment' });
    }
  }
};

const deleteComment = async (comment, post) => {
  $q.dialog({
    title: 'Confirm',
    message: 'Are you sure you want to delete this comment?',
    cancel: true,
    persistent: true
  }).onOk(async () => {
    const commentIndex = post.comments.findIndex(c => c.id === comment.id);
    if (commentIndex !== -1) {
      post.comments.splice(commentIndex, 1);
      try {
        await updateDoc(doc(db, "posts", post.id), {
          comments: post.comments,
          latestComment: post.comments.length > 0 ? post.comments[post.comments.length - 1] : null
        });
      } catch (error) {
        console.error("Error deleting comment: ", error);
        $q.dialog({ title: 'Error', message: 'Failed to delete comment' });
      }
    }
  }).onCancel(() => { });
};

const fetchUserData = async () => {
  const userId = router.currentRoute.value.query.userId;
  const userDocRef = doc(db, "users", userId);
  const userDocSnap = await getDoc(userDocRef);

  if (userDocSnap.exists()) {
    const user = userDocSnap.data();
    const name = `${user.fName} ${user.mInitial} ${user.lName}`;
    const fullName = `${user.fName} ${user.lName}`;

    userData.value = {
      ...user,
      name: name.trim(),
      full_name: fullName.trim(),
      photoURL: user.profilePicture,
    };
  } else {
    console.log("User not found");
  }
};

fetchUserData();

const openImageModal = (url) => {
  imageUrl.value = url;
  isOpen.value = true;
};

const closePostImageModal = () => {
  isOpen.value = false;
};


function showPostModal() {
  showModal.value = true;
  if(showModal.value){
    showImageModal.value = false;
  }else{
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
  isEdit.value = false;
  isEditPostId.value = ""
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
        if(progressBars.value[i] == 100){
          progressBars.value = 0
        }
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
  if(caption.value.length == 0) {
    alert("Enter caption.")
    return
  }
  const success = ref(false)
  isLoading.value = true

  if(isEdit.value){
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
      imageUrls: selectedImages.value,
      status: "pending",
      time: new Date(),
      date: new Date().toLocaleDateString(),
      history: [{ admin: userName, status: "pending", time: new Date()},],
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
      success.value = true
    } 
    catch (error) {
      CustomDialog("Error", error.message)
    success.value = false
    }
    finally{
      isLoading.value = false
      closeImageModal();
      if(success.value) CustomDialog("Waiting for Approval", "We will notify you once your post has been approved.")
    }
  }else{
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
      imageUrls: selectedImages.value,
      status: "pending",
      time: new Date(),
      date: new Date().toLocaleDateString(),
      history: [{ admin: userName, status: "pending", time: new Date()},],
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
      success.value = true
    } 
    catch (error) {
      CustomDialog("Error", error.message)
    success.value = false
    }
    finally{
      isLoading.value = false
      if(success.value) CustomDialog("Waiting for Approval", "We will notify you once your post has been approved.")
    }
  }
 
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
    caption: caption.value,
    status: "pending",
    history: [],
    likedBy: [], // Initialize with an empty array
    likes: 0, // Initialize likes count
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

const EditPostDialog = (post)=>{
  isEdit.value = true
  showPostModal()
  selectedSchoolYear.value = post.schoolYear
  selectedEvent.value = post.event
  caption.value = post.caption
  selectedImages.value = post.imageUrls
  isEditPostId.value = post.id
  console.log("Edit Post: ", isEdit.value);
  console.log("Post Id: ", post.id)
}

const EditPost = async (post, caption)=> {

  try {
    const postRef = doc(db, "posts", post.id);
    await updateDoc(postRef, {
      caption: caption,
    });
    post.caption = caption; 
    CustomDialog("Success", "Post caption has been updated successfully") 
  } catch (error) {
    CustomDialog("Error", error.message) 
  }
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

const isValidSelected = computed(() => {
  return selectedSchoolYear.value !== "" && selectedEvent.value !== "";
});


function getLatestApprovalDate(post) {
  if (!post.history || post.history.length === 0) {
    return "No approval date available";
  }

  const latestTime = post.history.reduce((latest, entry) => {
    return entry.time > latest ? entry.time : latest;
  }, post.history[0].time);

  return latestTime;
}
const filterEvents = computed(()=>{
  const newEvents = events.value.filter(event => event.year === selectedSchoolYear.value);
  const filteredEvents = newEvents.map((doc) => ({
    id: doc.id,
    name: doc.name,
    year: doc.year
  }))

  return filteredEvents;
})
watch(filterEvents, (newEvents, oldEvents) => {
  console.log("Selected: ", newEvents);
});

watch(approvedPosts, (newPosts, oldPosts) => {
  console.log("New approved posts:", newPosts);
});

onMounted(async () => {
  const coursesSnapshot = await getDocs(collection(db, "folders"));
  schoolYears.value = coursesSnapshot.docs.map((doc) => ({
    id: doc.id,
    name: doc.data().name,
  }));

  const classYearsSnapshot = await getDocs(collection(db, "subfolders"));
  events.value = classYearsSnapshot.docs.map((doc) => ({
    id: doc.id,
    name: doc.data().name,
    year: doc.data().year
  }));



  console.log(events)
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
    };
   
  });
  approvedPosts.value = posts.value.filter((post) => post.status === "approved");
});

  posts.value.forEach((post) => {
    post.comments = [];
    post.likes = 0;
    post.showComments = false;
    post.commentsLoaded = false;
    post.newComment = "";
  });
});





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
  const postId = postData.id
  const postAuthor = postData.userIdOrig

  const notification = {
        userId: alumniId.value,
        postId: postId,
        authorId: post.userIdOrig,
        name: userName,
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
    isLiked.value = updatedLikes
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

    if(userId.value !== postAuthor){
    await addDoc(collection(db, "notifications"), notification);
    }
  }
};

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
  const newId = uuidv4();
  const postId = post.id
  const postAuthor = post.userIdOrig
  const userSnapshot = await getDocs(collection(db, "users"));
  const userData = userSnapshot.docs
    .find((doc) => doc.id === userId.value)
    ?.data();
  const userName = `${userData.fName} ${userData.lName}`;

  const notification = {
        userId: alumniId.value,
        postId: postId,
        name: userName,
        authorId: post.userIdOrig,
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
     if(userId.value !== postAuthor){
    await addDoc(collection(db, "notifications"), notification);
    }
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

.btn-dot{
  height: 1.5rem;
  width: 0.4rem;
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  position: absolute;
  right: 1rem;
  cursor: pointer;
}

.btn-dot span{
  display: block;
 width: 0.4rem;
 height: 0.4rem;
 background: white;
 border-radius: 50%;
}

.btn-dot:hover + .post-actions{
  display: flex;
}

.post-actions{
  background: white;
  padding: 1rem;
  border-radius: 0.3rem;
  position: absolute;
  display: none;
  flex-direction: column;
  width: 10rem;
  gap: 0.5rem;
  right: -8rem;
  top: 1rem;
  z-index: 1000;
  box-shadow: 0.1rem 0.1rem 0.1rem 0.1rem rgba(0, 0, 0, 0.1);
}

.post-actions:hover{
  display: flex;
}

.post-images{
  display: flex;
  flex-wrap: wrap; 
  gap: 10px; 
  padding: 0.5rem 1rem;
}

.post-images .image{
  position: relative;
}

.post-images .image button{
  position: absolute;
  right: 0.2rem;
  top: 0.2rem;
  background: none;
  border: none;
}
</style>
