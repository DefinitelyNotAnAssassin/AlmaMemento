<template>
  <div class="components-page-main-container p-3">
    <h3 class="text-center">Contact Support</h3>
    <div class="convo-container p-5" style="background: #E5E4E2;">
      
      <div class="d-flex justify-content-between">
        <button class="btn btn-sm btn-dark mx-1" @click="backToMain">
          <i class="bi bi-arrow-return-left"></i>
        </button> 
        <button class="btn btn-sm btn-dark mx-1"  @click="closeConversation">
          Close this Conversation
        </button>
      </div>
      <div class="mt-5">
        <div class="d-flex justify-content-between">
          <h5 class="mb-3">{{ documentData.subject }}</h5>
          <span class="text-muted" style="font-size: 14px"
            >Date: {{ documentData.date }}</span
          >
        </div>
        <div>
          <div>
            <div style="display: flex; flex-direction: column;">
                <div class="mt-2" v-for="alumniReply in documentData.replies"
                  style="width: 50%; align-self:" :style="{ alignSelf: alumniReply.userId === userId ? 'flex-end' : 'flex-start'}">
                    <span class="text-muted"
                      style="
                        font-size: 0.8rem;
                        /* color: black; */
                        
                      ">
                      {{alumniReply.name  }} - {{ alumniReply.date }}
                    </span>
                    <p 
                    style="font-size: 
                    0.9rem; background: white; 
                    padding: 1rem; 
                    border-radius: 0.5rem;"
                    >{{ alumniReply.message }}</p>
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
  onSnapshot,
} from "firebase/firestore";
import { db } from "../../../firebase/index.js";
import { useRouter } from "vue-router";

const props = defineProps(["id"]);
const currentPage = ref("Contact Message");
const documentData = ref({});
const showReply = ref(false);
const replyMessage = ref("");
const router = useRouter();
const userId = router.currentRoute.value.query.userId;
const userName = ref("");

const emit = defineEmits(["update:currentPage", "id"]);
let unsubscribe;  // Variable to store the unsubscribe function

const backToMain = () => {
  currentPage.value = "Contact";
  emit("update:currentPage", "Contact");
};

const sendReply = async () => {
  const userDoc = await getUserDoc(userId);
  const name = `${userDoc.data().lName} ${userDoc.data().fName}`;
  const docRef = doc(db, "concerns", props.id);
  const docSnapshot = await getDoc(docRef); // Fetch the document snapshot
  const replies = docSnapshot.data().replies || []; // Get existing replies or an empty array if not present

  const updatedReplies = [
    ...replies, // Spread existing replies
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

async function closeConversation(){
  const docRef = doc(db, "concerns", props.id);
  await updateDoc(docRef, {
    status: "closed"
  });
};

onMounted(() => {
  setupRealtimeListener();  // Set up real-time listener on mount
});

onUnmounted(() => {
  if (unsubscribe) {
    unsubscribe();  // Clean up the listener when the component is unmounted
  }
});
</script>
