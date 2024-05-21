<template>
  <div>
    <router-view v-if="!isLoading"></router-view>
    <div v-else>Loading...</div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from './composables/useAuth';
import Loading from './views/loading.vue';

const isLoading = ref(true);
const router = useRouter();

const { isAuthenticated, checkAuth } = useAuth();

checkAuth();

onMounted(() => {
  if (!isAuthenticated.value) {
    router.push({ name: 'login' });
  }
  isLoading.value = false;
});
</script>

