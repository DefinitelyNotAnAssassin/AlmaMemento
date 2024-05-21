<template>
  <div>
    <router-view v-if="!isLoading" />
    <Loading v-else />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import Loading from './views/loading.vue';

const isLoading = ref(true);

onMounted(() => {
  isLoading.value = false;
});
</script>
