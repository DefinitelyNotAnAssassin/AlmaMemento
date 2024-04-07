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
  isLoading.value = false;
  router.push({ name: 'login' });
});
</script>
