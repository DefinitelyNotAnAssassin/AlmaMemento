<template>
  <div class="components-page-main-container p-3">
    <!-- <h3 class="text-center">Contact Support</h3> -->
    <!-- <button class="btn btn-sm btn-dark mx-1 mt-5 mb-2" @click="closeMessageModal">
      <i class="bi bi-x-square"></i>
    </button>
    <button class="btn btn-sm btn-dark mx-1 mt-5 mb-2" @click="closeConversation" v-if="documentData.status !== 'closed'">
      Close this Conversation
    </button> -->
    <div class="convo-container" style="background: #E5E4E2; padding-left: 150px; padding-right: 150px; padding-top: 30px; overflow-y: scroll;">
      <div class="d-flex justify-content-between">
        <button class="btn btn-sm btn-dark mx-1" @click="closeMessageModal">
          <i class="bi bi-arrow-return-left"></i>
        </button> 
        <button class="btn btn-sm btn-dark mx-1"  @click="closeConversation">
          Close this Conversation
        </button>
      </div>
      <div class="mt-5">
        <div class="d-flex justify-content-between">
          <h5>{{ documentData.subject }}</h5>
          <span class="text-dark" style="font-size: 14px"
            >Date: {{ documentData.date }}</span
          >
        </div>
        <div>
          <div>
            <div style="display: flex; flex-direction: column;">
                <div class="mt-2" v-for="alumniReply in documentData.replies"
                  style="width: 50%; align-self:" :style="{ alignSelf: alumniReply.userId === userId ? 'flex-end' : 'flex-start'}">
                    <!-- <span 
                      style="
                        font-size: 0.8rem;
                        font-weight: bold;
                        color: gray;
                        
                      ">
                      {{alumniReply.name  }} - {{ alumniReply.date }}
                    </span> -->
                    <p 
                    style="font-size: 
                    1rem; background: white; 
                    padding: 1rem; 
                    border-radius: 0.5rem;"
                    >{{ alumniReply.message }}</p>
                </div>
            </div>     
        </div> 
        </div>
      </div>
      <div class="mt-2">
        <textarea
          class="form-control"
          v-model="replyMessage"
          rows="5"
          cols="50"
          placeholder="Enter your reply"
          required = "true"
        ></textarea>
        <button class="btn btn-sm btn-success mt-2" @click="sendReply">
          Send
        </button>
      </div>
  
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
  // check if the reply message is empty

  if (replyMessage.value === "") {
    alert("Please enter a message");
    return;
  }
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
  padding: 2rem !important;
}

.convo-container{
  height: 90vh;
  overflow-y: scroll;
  overflow: hidden;
}
</style>
