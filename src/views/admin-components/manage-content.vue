<template>
  <div class="components-page-main-container p-3">
    <div class="text-center">
      <h3>Manage Content</h3>
    </div>
    <div class="d-flex justify-content-between">
      <select class="select-status form-control" v-model="filterStatus">
        <option value="all">All</option>
        <option value="approved">Approved</option>
        <option value="rejected">Rejected</option>
        <option value="history">History</option>
      </select>
      <input
        class="txt-search form-control"
        type="text"
        v-model="searchQuery"
        placeholder="Search by ID or Name"
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
          <th></th>
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
            <a class="btn-view-image" @click="showImagePreview(item.imageUrls)"
              >View Image</a
            >
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
                @click="rejectPost(item, index)"
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
                <li v-for="historyItem in item.history" :key="historyItem.id">
                  {{ historyItem.admin }} - {{ historyItem.status }}
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
            <span v-if="historyIndex > 0">, </span>
            <span>{{ historyItem.admin }} - {{ historyItem.status }}</span>
          </template>
        </li>
      </ul>
    </div>
    <div v-if="imagePreview" class="modal">
      <div class="modal-content">
        <span class="close" @click="closeModal">&times;</span>
        <div
          style="height: 60vh; overflow-y: auto"
          class="d-flex flex-column align-items-center mt-5"
        >
          <div
            class="m-1"
            v-for="(imageUrl, index) in imagePreview"
            :key="index"
          >
            <img style="width: 280px" :src="imageUrl" alt="Image Preview" />
          </div>
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
} from "firebase/firestore";

const items = ref([]);
const selectedItems = ref([]);
const imagePreview = ref(null);
const schoolYear = ref([]);
const event = ref([]);
const userId = ref([]);
const filterStatus = ref("all");
const isModalVisible = ref(false);

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

const userIdToName = async (adminId) => {
  const docRef = doc(db, "users", adminId);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return docSnap.data().name;
  } else {
    console.log("No such document!");
    return null;
  }
};

async function approvePost(item, index) {
  const postRef = doc(db, "posts", item.id);
  const adminName = await userIdToName(adminId);
  const approvalTime = new Date();
  if (adminName) {
    await updateDoc(postRef, {
      status: "approved",
      history: [
        ...(item.history || []),
        { admin: adminName, status: "approved", time: approvalTime },
      ],
    });
    items.value[index].status = "approved";
  }
}

async function rejectPost(item, index) {
  const postRef = doc(db, "posts", item.id);
  const adminName = await userIdToName(adminId);
  const approvalTime = new Date();
  if (adminName) {
    await updateDoc(postRef, {
      status: "rejected",
      history: [
        ...(item.history || []),
        { admin: adminName, status: "rejected", time: approvalTime },
      ],
    });
    items.value[index].status = "rejected";
  }
}

function showImagePreview(imageUrls) {
  if (typeof imageUrls === "string") {
    imageUrls = [imageUrls];
  }

  if (Array.isArray(imageUrls) && imageUrls.length > 0) {
    imagePreview.value = imageUrls;
  } else {
    console.error("Invalid imageUrls:", imageUrls);
  }
}

function closeModal() {
  imagePreview.value = null;
}

const filteredHistory = computed(() => {
  if (filterStatus.value === "history") {
    return items.value.filter(
      (item) => item.history && item.history.length > 0
    );
  } else {
    return [];
  }
});

const filteredItems = computed(() => {
  let filtered = items.value;

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
  width: 80%;
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
