<template>
    <div>
      <button class="btn btn-sm btn-dark mx-1" @click="backToMain"><i class="bi bi-arrow-return-left"></i></button>
      <div>
        <p>Name: {{ userName }}</p>
        <p>User ID: {{ documentData.userId }}</p>
        <p>Date: {{ documentData.date }}</p>
        <p>Subject: {{ documentData.subject }}</p>
        <p>Message: {{ documentData.message }}</p>
        <img :src="documentData.url" alt="Concern Image" />
      </div>
      <div v-if="showReply">
        <textarea v-model="replyMessage" rows="5" cols="50" placeholder="Enter your reply"></textarea>
        <button @click="sendReply">Send</button>
      </div>
      <button v-else @click="showReply = true">Reply</button>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, defineProps, defineEmits } from "vue";
  import { doc, getDoc, updateDoc, arrayUnion, serverTimestamp } from "firebase/firestore";
  import { db } from "../../../firebase/index.js";
  import { useRouter } from "vue-router";
  
  const props = defineProps(["id"]);
  const currentPage = ref('Contact Message')
  const documentData = ref({});
  const showReply = ref(false);
  const replyMessage = ref('');
  const router = useRouter();
  const userId = router.currentRoute.value.query.userId;
  const userName = ref('');
  
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
        name: name
      })
    });
    replyMessage.value = '';
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
  