<template>
  <div class="components-page-main-container p-3">
    <h3 class="text-center">Contact Support</h3>
    <div class="d-flex justify-content-between align-items-center">
      <button
        class="btn btn-sm btn-danger mx-1"
        v-if="selectedMessages.length > 0"  
        @click="confirmDelete"
      >
        <i class="bi bi-trash3"></i>
      </button>
    </div>
    <ul class="list-group">
      <li v-for="message in messages.slice().reverse()" :key="message.id" class="list-group-item"
      @click="openMessageDialog(message.id)" 
              @closeModal="closeModalMessage"
       style="cursor: pointer">
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
              style="cursor: pointer"
           
            >
              {{ message.name }}
            </div>
          </div>
          <div
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
              -
              {{ message.message }}
            </span>
          </div>
          <div>
            {{ message.date }}
          </div>
          <div >
            {{ message.status }}
          </div>
        </div>
      </li>
    </ul>
  </div>
  <ContactMessage 
  @update:showMessage="closeMessageModal" 
  :id="concernId"
  v-if="showMessage"/>
</template>

<script setup>
import { ref, defineEmits, computed} from "vue";
import { db } from "../../../firebase/index.js";
import { useRouter } from "vue-router";
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
import ContactMessage from "./alumni-contact-message.vue"

const emit = defineEmits(["update:showMessage"])

const messages = ref([]);
const selectedMessages = ref([]);
const searchQuery = ref("");
const currentPage = ref("Contact");
const userId = computed(() => router.currentRoute.value.query.userId);
const alumniId = computed(() => router.currentRoute.value.query.alumniId);
const router = useRouter()
const showMessage = ref(false)
const concernId = ref("")

const openMessageDialog = (id)=>{
  showMessage.value = true
  concernId.value = id
  emit("update:showMessage", true);
  emit("id", id);
}
function closeMessageModal (){
  showMessage.value = false
}

const fetchMessages = async () => {
  const q = query(collection(db, "concerns"));
  const querySnapshot = await getDocs(q);
  
  messages.value = querySnapshot.docs
    .filter(data => data.data().userId === userId.value) 
    .map((doc) => ({
      id: doc.id,
      name: doc.data().name,
      subject: doc.data().subject,
      alumniReplies: doc.data().alumniReplies,
      adminReplies: doc.data().adminReplies,
      date: doc.data().date,
      status: doc.data().status
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

fetchMessages();
</script>
