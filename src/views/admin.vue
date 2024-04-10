<template>
  <div>
    <Navbar />
    <div class="main">
      <Sidebar :currentPage="currentPage" @update:currentPage="currentPage = $event" />
      <div v-if="currentPage === 'Dashboard'">
        <DashboardContent />
      </div>
      <div v-else-if="currentPage === 'Profile'">
        <ProfileContent />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Navbar from './admin-components/admin-navbar.vue'
import Sidebar from './admin-components/admin-sidebar.vue'
import DashboardContent from './admin-components/admin-dashboard.vue'
import ProfileContent from './admin-components/admin-profile.vue'

const currentPage = ref('Dashboard')

</script>
