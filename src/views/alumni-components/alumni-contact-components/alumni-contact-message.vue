<template>
  <div class="components-page-main-container p-3">
    <h3 class="text-center">Contact Support</h3>
    <button class="btn btn-sm btn-dark mx-1" @click="closeMessageModal">
      <i class="bi bi-x-square"></i>
    </button>
    <button class="btn btn-sm btn-dark mx-1" @click="closeConversation" v-if="documentData.status !== 'closed'">
      Close this Conversation
    </button>
    <div class="convo-container p-5" style="background: white;">
      <div class="mt-5">
        <div class="d-flex justify-content-between">
          <h4>{{ documentData.subject }}</h4>
          <span class="text-secondary" style="font-size: 14px"
            >Date: {{ documentData.date }}</span
          >
        </div>
        <div>
          <div>
            <div style="display: flex; flex-direction: column;">
                <div class="mt-2" v-for="alumniReply in documentData.replies"
                  style="width: 50%; align-self:" :style="{ alignSelf: alumniReply.userId === userId ? 'flex-end' : 'flex-start'}">
                    <p 
                    style="font-size: 
                    1rem; background: lightgreen; 
                    padding: 1rem; 
                    border-radius: 0.5rem;"
                    >{{ alumniReply.message }}</p>
                    <span 
                      style="
                        font-size: 0.8rem;
                        font-weight: bold;
                        color: gray;
                        
                      ">
                      {{alumniReply.name  }} - {{ alumniReply.date }}
                    </span>
                </div>
            </div>     
        </div> 
        </div>
      </div>
      <div class="mt-2" v-if="showReply">
        <textarea
          class="form-control"
          v-model="replyMessage"
          rows="5"
          cols="50"
          placeholder="Enter your reply"
        ></textarea>
        <button class="btn btn-sm btn-success mt-2" @click="sendReply">
          Send
        </button>
      </div>
      <button class="btn btn-sm btn-dark mt-2" v-else @click="showReply = true"
        v-if="documentData.status !== 'closed'"
      >
        Reply
      </button>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted, onUnmounted, defineProps, defineEmits } from "vue";
import {
  doc,
  getDoc,
  updateDoc,
  onSnapshot
} from "firebase/firestore";
import { db } from "../../../firebase/index.js";
import { useRouter } from "vue-router";

const currentPage = ref("Contact Message");
const documentData = ref({});
const showReply = ref(false);
const replyMessage = ref("");
const router = useRouter();
const userId = router.currentRoute.value.query.userId;
const userName = ref("");
const showMessage = ref(false)

const props = defineProps(["id"])
const emit = defineEmits(['update:showMessage']);
let unsubscribe;  // Variable to store the unsubscribe function

const sendReply = async () => {
  const userDoc = await getUserDoc(userId);
  const name = `${userDoc.data().lName} ${userDoc.data().fName}`;
  const docRef = doc(db, "concerns", props.id);
  const docSnapshot = await getDoc(docRef); // Fetch the document snapshot
  const replies = docSnapshot.data().replies || []; // Get existing replies or an empty array if not present

  const updatedReplies = [
    ...replies, 
    {
      userId: userId,
      message: replyMessage.value,
      date: new Date().toLocaleDateString(),
      name: name,
    }
  ];

  await updateDoc(docRef, {
    replies: updatedReplies,
    status: "pending"
  });

  replyMessage.value = "";
  showReply.value = false;
};

const getUserDoc = async (userId) => {
  const userDocRef = doc(db, "users", userId);
  const userDocSnap = await getDoc(userDocRef);
  return userDocSnap;
};

const setupRealtimeListener = () => {
  const docRef = doc(db, "concerns", props.id);
  unsubscribe = onSnapshot(docRef, (docSnap) => {
    if (docSnap.exists()) {
      documentData.value = docSnap.data();
    }
  });
};

const closeMessageModal = () => {
  showMessage.value = false;
  emit("update:showMessage", false);
};

const closeConversation = async () => {
  const docRef = doc(db, "concerns", props.id);
  await updateDoc(docRef, {
    status: "closed"
  });
};

onMounted(() => {
  setupRealtimeListener();  
});

onUnmounted(() => {
  if (unsubscribe) {
    unsubscribe();  
  }
});
</script>

<style scoped>
.components-page-main-container{
  position: absolute;
  inset: 0 0 0 0 !important;
  width: 100%;
  z-index: 1000;
  background: rgba(0, 0, 0, 0.4);
  padding: 3rem !important;
}

.convo-container{
  height: 70vh;
  overflow-y: scroll;
}
</style>
