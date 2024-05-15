<template>
  <div class="components-page-main-container p-3">
    <div class="d-flex justify-content-between align-items-center">
      <input
        class="search-bar form-control"
        style="width: 250px"
        type="text"
        v-model="searchQuery"
        placeholder="Search by ID or Name"
      />
      <button
        class="btn btn-sm btn-danger mx-1"
        v-if="selectedMessages.length > 0"
        @click="confirmDelete"
      >
        <i class="bi bi-trash3"></i>
      </button>
    </div>
    <ul class="list-group">
      <li v-for="message in messages" :key="message.id" class="list-group-item">
        <div class="d-flex justify-content-between align-items-center">
          <div class="d-flex align-items-center">
            <input
              type="checkbox"
              v-model="selectedMessages"
              :value="message.id"
            />
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
            style="cursor: pointer; max-width: 300px; background-color: red"
          >
            {{ message.subject }}
            <span class="text-secondary">
              -
              Sampleeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeetttttttttttttttt
              {{ message.message }}</span
            >
          </div>
          <div @click="navigateToMessage(message.id)" style="cursor: pointer">
            {{ message.date }}
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, defineEmits } from "vue";
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

const fetchMessages = async () => {
  const q = query(collection(db, "concerns"));
  const querySnapshot = await getDocs(q);
  messages.value = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    name: doc.data().name,
    subject: doc.data().subject,
    date: doc.data().date,
  }));
};

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
