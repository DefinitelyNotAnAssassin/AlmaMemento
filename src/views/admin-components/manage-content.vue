<template>
  <div class="components-page-main-container p-3">
    <div class="text-center">
      <h3>Manage Content</h3>
    </div>
    <div class="d-flex justify-content-between">
      <select class="select-status form-control form-select" v-model="filterStatus">
        <option value="pending">Pending</option>
        <option value="approved">Approved</option>
        <option value="rejected">Rejected</option>
      </select>
      <input
        class="txt-search form-control"
        type="text"
        v-model="searchQuery"
        placeholder="Search by ID or Name"
        v-if="filterStatus !== 'history'"
      />
    </div>
    <div class="d-flex justify-content-end mt-1 mb-1">
      <button
        class="btn btn-sm btn-danger mx-1"
        v-if="selectedItems.length > 0"
        @click="confirmDelete"
      >
        Delete Selected
      </button>
    </div>
    <table class="table table-striped">
      <thead v-show="filterStatus !== 'history'">
        <tr>
          <th>
            <input type="checkbox" v-model="selectAllChecked" @click="checkAllItems" />
          </th>
          <th>ID Number</th>
          <th>Name</th>
          <th>Year</th>
          <th>Event</th>
          <th>Description</th>
          <th>Image</th>
          <th>Actions</th>
          <th>History</th>
        </tr>
      </thead>
      <tbody>
  <tr v-for="(item, index) in filteredItems" :key="item.id">
    <td>
      <input type="checkbox" v-model="selectedItems" :value="item.id" />
    </td>
    <td>{{ item.userId }}</td>
    <td>{{ item.name }}</td>
    <td>{{ item.schoolYear }}</td>
    <td>{{ item.event }}</td>
    <td>{{ item.caption }}</td>
    <td>
      <a class="btn-view-image" @click="showImagePreview(item.imageUrls)" v-if="item.imageUrls">
        View Image
      </a>
    </td>
    <td>
      <template class="d-flex flex-wrap" v-if="item.status === 'pending'">
        <button
          class="btn btn-sm btn-success"
          @click="approvePost(item, index)"
        >
          Approve
        </button>
        <button
          class="btn btn-sm btn-danger mx-1"
          @click="showRejectReasonDialog(item, index)"
        >
          Reject
        </button>
      </template>
      <span
        class="btn btn-sm btn-success"
        style="cursor: not-allowed"
        v-else-if="item.status === 'approved'"
        >Approved</span
      >
      <span
        class="btn btn-sm btn-danger"
        style="cursor: not-allowed"
        v-else-if="item.status === 'rejected'"
        >Rejected</span
      >
    </td>
    <td>
      <template v-if="item.history && item.history.length > 0">
        <ul>
          <li >
            {{ item.history.slice().reverse()[0].admin }} - {{ item.history.slice().reverse()[0].status }} 
          </li>
        </ul>
      </template>
      <span v-else>No History</span>
    </td>
  </tr>
</tbody>
    </table>
    <div v-show="filterStatus === 'history'" class="history-list">
      <h4>History</h4>
      <ul>
        <li v-for="item in filteredHistory" :key="item.id">
          <template v-for="(historyItem, historyIndex) in item.history">
            <span v-if= "historyIndex > 0">, </span>
            <span>{{ historyItem.admin }} {{ historyItem.status }} the post of {{ item.name }} on {{ historyItem.time }} </span>
          </template>
        </li>
      </ul>
    </div>
    <div v-if="imagePreview" class="modal">
    <div class="modal-content bg-dark">
      <span class="close text-white" @click="closeModal">&times;</span>
      <div id="imageCarousel" class="carousel slide" data-bs-ride="carousel">
        <div class="carousel-inner">
          <div
          :key="index" :class="{ 'carousel-item': true, 'active': index === currentIndex }"
                  v-for="(imageUrl, index) in imagePreview"
                   
                    
                  class="carousel-item"
                
                    
                    >
                      <img
                        v-if="imageUrl.type.startsWith('image/')"
                        :src="imageUrl.url"
                        class="d-block w-100"
                      alt="Image Preview"
                        width="100"
                        height="600"
                        controls
                        @click="openImageModal(imageUrl.url)"
                      />
                      <video
                        v-else
                        :src="imageUrl.url"
                        class="d-block w-100"
                      alt="Video Preview"
                        width="100"
                        height="600"
                        controls
                        @click="openImageModal(imageUrl.url)"
                      ></video>
                   
                  </div>
         
        </div>
          <button class="carousel-control-prev" type="button" @click="prevImage">
            <span class="carousel-control-prev-icon" aria-hidden="true"></span>
            <span class="visually-hidden">Previous</span>
          </button>
          <button class="carousel-control-next" type="button" @click="nextImage">
            <span class="carousel-control-next-icon" aria-hidden="true"></span>
            <span class="visually-hidden">Next</span>
          </button>
        </div>
      </div>
    </div>
    <div v-if="isModalVisible" class="modal">
      <div class="modal-content">
        <span class="close" @click="closeModal">&times;</span>
        <p>Are you sure you want to delete the selected item(s)?</p>
        <button class="btn btn-sm btn-danger" @click="deleteSelected">
          Confirm
        </button>
      </div>
    </div>
  </div>
  <div v-if="showRejectReason" class="modal">
      <div class="modal-content">
        <h3>Please Select a Reason</h3>
        <select v-model="reason" class="form-select mb-2">
          <option>Spam</option>
          <option>Nudity</option>
          <option>Violence</option>
          <option>Hate Speech</option>
          <option>False Information</option>
          <option>Suicide or Self-Injury</option>
          <option>Other</option>
        </select>
        <div v-if="reason === 'Other'">
          <label for="other">Others: </label>
          <input type="text" id="other" v-model="otherReason" placeholder="Enter other reason" class="form-control mb-2"/>
        </div>
       
        <button class="btn btn-sm btn-danger" @click="rejectPost(rejectItem, rejectIndex)">
          Reject
        </button>
        <button
          class="btn btn-sm btn-secondary mt-1"
          @click="showRejectReason = false"
        >
          Cancel
        </button>
      </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { db } from "../../firebase/index.js";
import { useRouter } from "vue-router";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  getDoc,
  query,
  where,
  addDoc
} from "firebase/firestore";

const items = ref([]);
const selectedItems = ref([]);
const imagePreview = ref(null);
const schoolYear = ref([]);
const event = ref([]);
const userId = ref([]);
const filterStatus = ref("pending");
const isModalVisible = ref(false);
const selectAllChecked = ref(false); 
const currentIndex = ref(0);
const showRejectReason = ref(false);
const rejectIndex = ref(null)
const rejectItem = ref(null)
const reason = ref("Spam")
const otherReason = ref("")
const router = useRouter();
const adminId = router.currentRoute.value.query.userId;

const fetchUsersAndClassYearsAndEvents = async () => {
  const userSnapshot = await getDocs(collection(db, "users"));
  userId.value = userSnapshot.docs.map((doc) => ({
    id: doc.id,
    alumnaID: doc.data().alumnaID,
    name: doc.data().name,
  }));

  const querySnapshot = await getDocs(collection(db, "posts"));
  items.value = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  const classYearsSnapshot = await getDocs(collection(db, "classYears"));
  schoolYear.value = classYearsSnapshot.docs.map((doc) => ({
    id: doc.id,
    name: doc.data().name,
  }));

  const eventsSnapshot = await getDocs(collection(db, "events"));
  event.value = eventsSnapshot.docs.map((doc) => ({
    id: doc.id,
    name: doc.data().name,
  }));
};

const listenForPostChanges = () => {
  const unsubscribe = onSnapshot(collection(db, "posts"), (snapshot) => {
    snapshot.docChanges().forEach((change) => {
      if (change.type === "added") {
        items.value.push({ id: change.doc.id, ...change.doc.data() });
      } else if (change.type === "modified") {
        const index = items.value.findIndex(
          (item) => item.id === change.doc.id
        );
        if (index !== -1) {
          items.value[index] = { id: change.doc.id, ...change.doc.data() };
        }
      } else if (change.type === "removed") {
        items.value = items.value.filter((item) => item.id !== change.doc.id);
      }
    });
  });
};

const searchQuery = ref("");

async function userIdToName(adminId) {
  const docRef = doc(db, "users", adminId);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    const userData = docSnap.data();
    const { fName, lName, mInitial } = userData;
    const fullName = `${fName}, ${lName} ${mInitial}.`;
    return fullName;
  } else {
    console.log("No such document!");
    return null;
  }
}

async function approvePost(item, index) { 
  const adminName = await userIdToName(adminId);
  // const approvalTime = new Date();
  const userId = item.userId;

  if (adminName) {
    const postRef = doc(db, "posts", item.id);
    await updateDoc(postRef, {
      ...item,
      status: "approved",
      history: [
        ...(item.history || []),
        { admin: adminName, status: "approved", time: new Date() },
      ],
    });
    items.value[index].status = "approved";
  }

  const notificationRef = collection(db, "notifications");
  await addDoc(notificationRef, {
    for: "alumni",
    name: adminName,
    status: "unread",
    type: "newpost",
    action: "approved",
    userId: userId
  });

    if (item.imageUrls && item.imageUrls.length > 0) {
    const eventGalleryRef = collection(db, "eventsgallery");
    await addDoc(eventGalleryRef, {
      imageUrl: item.imageUrls,
      schoolYear: item.schoolYear,
      event: item.event
    });
  }
}

const showRejectReasonDialog = (item, index)=>{
  showRejectReason.value = true  
  rejectIndex.value = index
  rejectItem.value = item
}


async function rejectPost(item, index) {
  const adminId = router.currentRoute.value.query.userId;
  const adminName = await userIdToName(adminId);
  const approvalTime = new Date();
  const userId = item.userId;
  const authorId = item.userIdOrig
  if (adminName) {
    const postRef = doc(db, "posts", item.id);
    await updateDoc(postRef, {
      ...item,
      status: "rejected",
      history: [
        ...(item.history || []),
        { admin: adminName, status: "rejected", time: approvalTime },
      ],
    });
    items.value[index].status = "rejected";
  }

  const notificationRef = collection(db, "notifications");
  await addDoc(notificationRef, {
    for: "alumni",
    name: adminName,
    status: "unread",
    time: approvalTime,
    date: new Date().toLocaleDateString(),
    reason: otherReason.value || reason.value,
    type: "newpost",
    action: "rejected",
    userId: userId,
    authorId: authorId
  });

  showRejectReason.value = false
}

function showImagePreview(imageUrls) {
  if (typeof imageUrls === "string") {
    imageUrls = [imageUrls];
  }

  if (Array.isArray(imageUrls) && imageUrls.length > 0) {
    imagePreview.value = imageUrls;
    currentIndex.value = 0;
  } else {
    console.error("Invalid imageUrls:", imageUrls);
  }
}

function nextImage() {
  if (currentIndex.value < imagePreview.value.length - 1) {
    currentIndex.value++;
  }
}

function prevImage() {
  if (currentIndex.value > 0) {
    currentIndex.value--;
  }
}

function closeModal() {
  imagePreview.value = null;
}

const filteredHistory = computed(() => {
  if (filterStatus.value === "history") {
    return items.value
      .filter((item) => item.history && item.history.length > 0)
      .map((item) => {
        const historyItem = item.history[0];
        const timestamp = historyItem.time ? historyItem.time.toDate() : null;
        const formattedDate = timestamp ? timestamp.toLocaleString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
          hour: "numeric",
          minute: "numeric",
          hour12: true,
        }) : "";
        return {
          ...item,
          history: [{ ...historyItem, time: formattedDate }],
        };
      });
  } else {
    return [];
  }
});

const filteredItems = computed(() => {
  let filtered = items.value;

  if (filterStatus.value !== "history") {
    if (filterStatus.value !== "all") {
      filtered = filtered.filter((item) => item.status === filterStatus.value);
    }

    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.userId.toLowerCase().includes(query) ||
          item.name.toLowerCase().includes(query)
      );
    }
  }

  return filtered;
});


const confirmDelete = () => {
  isModalVisible.value = true;
};

const deleteSelected = async () => {
  for (const id of selectedItems.value) {
    const docRef = doc(db, "posts", id);
    await deleteDoc(docRef);
  }
  isModalVisible.value = false;
  selectedItems.value = [];
  selectAllChecked.value = false;
};

const checkAllItems = (event) => {
  const isChecked = event.target.checked;
  if (isChecked) {
    selectedItems.value = filteredItems.value.map(item => item.id);
  } else {
    selectedItems.value = [];
  }
  selectAllChecked.value = isChecked;
};

onMounted(async () => {
  fetchUsersAndClassYearsAndEvents();
  listenForPostChanges();
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
  background-color: rgba(0, 0, 0, 0.7);
}

.modal-content {
  background-color: #fefefe;
  margin: 15% auto;
  padding: 20px;
  border: 1px solid #888;
}

.modal-content img{
  width: 20rem;
  height: 20rem;
  object-fit: contain;
}

.close {
  color: #aaa;
  float: right;
  font-size: 28px;
  font-weight: bold;
}

.close:hover,
.close:focus {
  color: black;
  text-decoration: none;
  cursor: pointer;
}

.select-status {
  width: 150px;
}

.txt-search {
  width: 200px;
}

.btn-view-image {
  cursor: pointer;
}


</style>
