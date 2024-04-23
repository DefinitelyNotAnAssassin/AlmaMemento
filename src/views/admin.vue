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
      <div v-else-if="currentPage === 'Alumni'">
        <ManageUserAlumni />
      </div>
      <div v-else-if="currentPage === 'Moderator'">
        <ManageUserModerator />
      </div>
      <div v-else-if="currentPage === 'Admin'">
        <ManageUserAdmin />
      </div>
      <div v-else-if="currentPage === 'Manage Content'">
        <ManageContent />
      </div>
      <div v-else-if="currentPage === 'Graduation Album'">
        <GraduationAlbum />
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
import ManageUserAlumni from './admin-components/manage-users-alumni.vue'
import ManageUserAdmin from './admin-components/manage-users-admin.vue'
import ManageUserModerator from './admin-components/manage-users-moderator.vue'
import ManageContent from './admin-components/manage-content.vue'
import GraduationAlbum from './admin-components/graduation-album.vue'

const currentPage = ref('Dashboard')

</script>
