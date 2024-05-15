<template>
  <div class="components-page-main-container p-3">
    <h3 class="text-center">Contact Support</h3>
    <button class="btn btn-sm btn-dark mx-1" @click="backToMain">
      <i class="bi bi-arrow-return-left"></i>
    </button>
    <div>
      <div>
        <span style="font-size: 12px"
          >{{ documentData.name }} - {{ documentData.userId }}</span
        >
        <span class="text-secondary" style="font-size: 12px"
          >Date: {{ documentData.date }}</span
        >
      </div>
      <div>
        <h4 style="font-size: 20px">Subject: {{ documentData.subject }}</h4>
      </div>
      <div>
        <p style="font-size: 14px">Message: {{ documentData.message }}</p>
      </div>
      <img :src="documentData.url" alt="Concern Image" />
    </div>
    <div v-if="showReply">
      <textarea
        class="form-control"
        v-model="replyMessage"
        rows="5"
        cols="50"
        placeholder="Enter your reply"
      ></textarea>
      <button class="btn btn-sm btn-success" @click="sendReply">Send</button>
    </div>
    <button class="btn btn-sm btn-dark" v-else @click="showReply = true">
      Reply
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted, defineProps, defineEmits } from "vue";
import {
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
  serverTimestamp,
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

const emit = defineEmits(["update:currentPage"]);

const backToMain = () => {
  currentPage.value = "Contact";
  emit("update:currentPage", "Contact");
};

const sendReply = async () => {
  const userDoc = await getUserDoc(userId);
  const name = `${userDoc.data().lName} ${userDoc.data().fName}`;

  const docRef = doc(db, "concerns", props.id);
  await updateDoc(docRef, {
    replies: arrayUnion({
      message: replyMessage.value,
      date: serverTimestamp(),
      name: name,
    }),
  });
  replyMessage.value = "";
  showReply.value = false;
};

const getUserDoc = async (userId) => {
  const userDocRef = doc(db, "users", userId);
  const userDocSnap = await getDoc(userDocRef);
  return userDocSnap;
};

onMounted(async () => {
  const docRef = doc(db, "concerns", props.id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    documentData.value = docSnap.data();
  }
});
</script>
