<template>
  <div class="components-page-main-container p-3">
    <h3 class="text-center">Contact Support</h3>
    <div class="d-flex justify-content-between align-items-center mb-2">
      <input
        class="search-bar form-control"
        style="width: 250px"
        type="text"
        v-model="searchQuery"
        placeholder="Search by ID or Name"
      />
     
      <button style="margin-left: 800px !important; padding: 6px;"
        class="btn btn-sm btn-danger mx-1"
        v-if="selectedMessages.length > 0"
        @click="confirmDelete"
      >
        <i class="bi bi-trash3"></i>
        Delete
      </button>
      <select v-model="selectStatus" class="form-control form-select" style="width: min-content;">
        <option selected>All</option>
        <option>Open</option>
        <option>Pending</option>
        <option>Closed</option>
      </select>
    </div>
    <ul class="list-group">
      <li style="list-style: none; background: black; font-weight: bold; color: white;" class="list-group-item">
        <div class="d-flex justify-content-between align-items-center">
          <div>Action</div>
          <div style="margin-left: -2rem;">Subject</div>
          <div>Date</div>
          <div>Status</div>
        </div>
      </li>
      <li v-for="message in messages" :key="message.id" class="list-group-item">
        <div class="d-flex justify-content-between align-items-center">
          <div class="d-flex align-items-center">
            <div>
              <input
                type="checkbox"
                v-model="selectedMessages"
                :value="message.id"
              />
            </div>
            <div
              class="mx-2"
              @click="navigateToMessage(message.id)"
              style="cursor: pointer"
            >
              {{ message.name }}
            </div>
          </div>
          <div
            @click="navigateToMessage(message.id)"
            style="
              cursor: pointer;
              max-width: 400px;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            "
          >
            {{ message.subject }}
            <span class="text-secondary">
              
              {{ message.message }}
            </span>
          </div>
          <div @click="navigateToMessage(message.id)" style="cursor: pointer">
            {{ message.date }}
          </div>
          <div >
            {{ message.status }}
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, defineEmits, watch } from "vue";
import { db } from "../../../firebase/index.js";
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  updateDoc,
  doc,
  deleteDoc,
  onSnapshot,
} from "firebase/firestore";

const messages = ref([]);
const selectedMessages = ref([]);
const searchQuery = ref("");
const currentPage = ref("Contact");
const selectStatus = ref("All")

const fetchMessages = async () => {
  const q = query(collection(db, "concerns"));
  const querySnapshot = await getDocs(q);

  messages.value = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    name: doc.data().name,
    subject: doc.data().subject,
    message: doc.data().message,
    date: doc.data().date,
    replies: doc.data().replies,
    status: doc.data().status
  }))

  if(selectStatus.value !== "All"){
    messages.value = messages.value.filter((message)=> message.status === selectStatus.value.toLocaleLowerCase());
  }

  
};

watch(selectStatus, (newSelect, oldSelect)=>{
  fetchMessages()
  console.log("Selected: ", newSelect)
})

const confirmDelete = async () => {
  if (confirm("Are you sure you want to delete the selected messages?")) {
    for (const id of selectedMessages.value) {
      const docRef = doc(db, "concerns", id);
      await deleteDoc(docRef);
    }
    selectedMessages.value = [];
  }
};

const emit = defineEmits(["update:currentPage"]);

const navigateToMessage = (id) => {
  currentPage.value = "Contact Message";
  emit("update:currentPage", "Contact Message");
  emit("id", id);
};

fetchMessages();
</script>
