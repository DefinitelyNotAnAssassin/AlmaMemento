<template>
  <div>
    <router-view v-if="!isLoading"></router-view>
    <div v-else>Loading...</div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const isLoading = ref(true);
const router = useRouter();

onMounted(() => {
  const userId = localStorage.getItem('userId');
  const userlevel = localStorage.getItem('userlevel');

  if (userId && userlevel) {
    if (userlevel === "administrator" || userlevel === "moderator") {
      router.push({ name: 'adminDashboard', query: { userId } });
    } else if (userlevel === "alumni") {
      router.push({ name: 'alumniDashboard', query: { userId } });
    }
  } else {
    router.push({ name: 'login' });
  }

  isLoading.value = false;
});
</script>
