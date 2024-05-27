<template>
  <div>
    <Navbar :currentPage="currentPage" @update:currentPage="currentPage = $event"/>
    <div class="main">
      <Sidebar :currentPage="currentPage" @update:currentPage="currentPage = $event" />
      <div v-if="currentPage === 'Dashboard'" >
        <DashboardContent :currentPage="currentPage" @update:currentPage="currentPage = $event" />
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
      <div v-else-if="currentPage === 'School Event'">
        <SchoolEvent />
      </div>
      <div v-else-if="currentPage === 'Contact'">
        <Contact />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { getDoc, doc } from 'firebase/firestore'
import { db } from '../firebase/index.js'
import { useRouter } from 'vue-router'
import Navbar from './admin-components/admin-navbar.vue'
import Sidebar from './admin-components/admin-sidebar.vue'
import DashboardContent from './admin-components/admin-dashboard.vue'
import ProfileContent from './admin-components/admin-profile.vue'
import ManageUserAlumni from './admin-components/manage-users-alumni.vue'
import ManageUserAdmin from './admin-components/manage-users-admin.vue'
import ManageUserModerator from './admin-components/manage-users-moderator.vue'
import ManageContent from './admin-components/manage-content.vue'
import GraduationAlbum from './admin-components/graduation-album.vue'
import SchoolEvent from './admin-components/school-event.vue'
import Contact from './admin-components/admin-contact.vue'

const currentPage = ref('Dashboard')
const userRole = ref(null)
const router = useRouter();
const userId = computed(() => router.currentRoute.value.query.userId);

const getUserRole = async () => {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId.value))
    if (userDoc.exists()) {
      userRole.value = userDoc.data().userlevel
      if (userRole.value === 'moderator') {
        currentPage.value = 'Manage Content'
      }
    } else {
       currentPage.value = ref('Dashboard')
    }
  } catch (error) {
    console.error('Error fetching user role:', error)
  }
}

onMounted(() => {
  getUserRole()
})


</script>


