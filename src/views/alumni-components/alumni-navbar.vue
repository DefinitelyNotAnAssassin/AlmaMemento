<template>
  <nav class="navbar">
    <div class="navbar-brand">
      <a class="navbar-item" href="#">
      </a>
    </div>
    <div>
      <router-link :to="{ path: '/alumniDashboard', query: { userId: userId } }" class="navbar-item text-light">Home</router-link>
      <router-link :to="{ path: '/yearbook', query: { userId: userId } }" class="navbar-item text-light">Yearbook</router-link>
      <router-link :to="{ path: '/memento', query: { userId: userId } }" class="navbar-item text-light">Memento</router-link>
      <router-link :to="{ path: '/contact', query: { userId: userId } }" class="navbar-item text-light">Contact</router-link>
    </div>
    <div class="navbar-end">
      <a class="navbar-item text-light" @click="toggleNotifications">
        <span class="icon">
          <i class="fas fa-bell"></i>
        </span>
      </a>
    </div>
  </nav>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter();
const userId = computed(() => router.currentRoute.value.query.userId);

const notificationsVisible = ref(false)

const toggleNotifications = () => {
  notificationsVisible.value = !notificationsVisible.value
}

</script>

<style scoped>
router-link {
  text-decoration: none;
  font-size: 15px;
}
</style>
