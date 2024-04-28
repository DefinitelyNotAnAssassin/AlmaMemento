<template>
    <aside class="sidebar">
      <img src="../../assets/images/logo.png" alt="Logo">
      <ul>
        <li v-for="(item, index) in sidebarItems" :key="index">
          <a class="text-light" @click="handleSidebarItemClick(item)">
            {{ item }}
            <span v-if="item === 'Manage Users' || item === 'Yearbook'" class="dropdown-arrow">▼</span>
          </a>
          <ul v-if="dropdownItemsVisibility[item]">
            <li v-for="(dropdownItem, dropdownIndex) in dropdownItems[item]" :key="dropdownIndex">
              <button @click="handleDropdownClick(dropdownItem)">{{ dropdownItem }}</button>
            </li>
          </ul>
        </li>
      </ul>
      <button @click="logout" class="logout-button"><i class="fas fa-power-off"></i>  Logout</button>
    </aside>
  </template>
  
  <script setup>
  import { ref, computed, reactive, defineEmits } from 'vue'
  import { useRouter } from 'vue-router'
  import { db } from '../../firebase/index.js'
  import { collection, getDocs, updateDoc, doc } from 'firebase/firestore'
  
  const currentPage = ref('Dashboard');
  
  const sidebarItems = ['Dashboard', 'Profile', 'Manage Users', 'Manage Content', 'Yearbook']
  const dropdownItems = {
    'Manage Users': ['Alumni', 'Moderator', 'Admin'],
    'Yearbook': ['Graduation Album', 'School Event']
  }
  const dropdownItemsVisible = reactive({
    'Manage Users': false,
    'Yearbook': false
  })
  
  const emit = defineEmits(['update:currentPage'])

  
  const handleSidebarItemClick = (item) => {
    if (item === 'Dashboard') {
      currentPage.value = 'Dashboard'
      emit('update:currentPage', 'Dashboard')
    } else if (item === 'Profile') {
      currentPage.value = 'Profile'
      emit('update:currentPage', 'Profile')
    } else if (item === 'Manage Content') {
      currentPage.value = 'Manage Content'
      emit('update:currentPage', 'Manage Content')
    } else {
      selectItem(item)
    }
  }
  
  const selectItem = (item) => {
    if (dropdownItems.hasOwnProperty(item)) {
      dropdownItemsVisible[item] = !dropdownItemsVisible[item];
      console.log(item)
    }
  }
  
  const handleDropdownClick = (dropdownItem) => {
    console.log('Clicked dropdown item:', dropdownItem)
    currentPage.value = dropdownItem
    emit('update:currentPage', dropdownItem)
  }

  const router = useRouter()
  
  const logout = async () => {
    try {
      console.log("Logging out...")
  
      const q = collection(db, "users")
      const querySnapshot = await getDocs(q)
      const userId = router.currentRoute.value.query.userId
      console.log("UserID:", userId)
  
      const user = querySnapshot.docs.find(doc => doc.id === userId && doc.data().loggedIn === true)
  
      if (user) {
        console.log("User found:", user.data())
  
        await updateDoc(doc(db, 'users', user.id), {
          loggedIn: false
        });
  
        router.push({ name: 'login' })
        console.log("Logout successful. Redirecting to login page...");
        console.log("Current URL:", window.location.href);
      } else {
        console.log("No logged in user found")
        errMsg.value = "No logged in user found"
      }
    } catch (error) {
      console.error("Error:", error.message)
      errMsg.value = "An error occurred"
    }
  }
  
  const dropdownItemsVisibility = computed(() => {
    const visibility = {}
    for (const item of sidebarItems) {
      if (dropdownItems.hasOwnProperty(item)) {
        visibility[item] = dropdownItemsVisible[item] || false
      }
    }
    return visibility
  })
  </script>
  