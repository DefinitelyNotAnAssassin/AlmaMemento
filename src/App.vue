<template>
  <div>
    <router-view v-if="!isLoading"></router-view>
    <div v-else>Loading...</div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getFirestore, collection, query, onSnapshot, where } from 'firebase/firestore';
import { useRouter } from 'vue-router';

const isLoading = ref(true);
const router = useRouter();

onMounted(() => {
  const db = getFirestore();
  
  const q = query(collection(db, 'users'), where('loggedIn', '==', true));
const unsubscribe = onSnapshot(q, (snapshot) => {
  const userLoggedIn = !snapshot.empty;
  isLoading.value = false;
  console.log('User is logged in:', userLoggedIn);
  if (!userLoggedIn) {
    console.log('Navigating to login');
    router.push({ name: 'login' });
  }
}, (error) => {
  console.error('Firestore snapshot error:', error);
  isLoading.value = false;
});
});

</script>
