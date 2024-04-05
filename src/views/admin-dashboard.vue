<template>
    <div>
      <nav class="navbar">
        <div class="navbar-brand">
          <a class="navbar-item" href="#">
            <img src="../assets/images/logo.png" alt="Logo">
          </a>
        </div>
        <div class="navbar-end">
          <a class="navbar-item" @click="toggleNotifications">
            <span class="icon">
              <i class="fas fa-bell"></i>
            </span>
          </a>
          <a class="navbar-item" @click="toggleProfile">
            <span class="icon">
              <i class="fas fa-user"></i>
            </span>
          </a>
        </div>
      </nav>
      <aside class="sidebar">
        <ul>
          <li v-for="(item, index) in sidebarItems" :key="index">
            <a @click="selectItem(index)">{{ item }}</a>
          </li>
        </ul>
        <button @click="logout" class="logout-button">Logout</button>
      </aside>
      <main>
        <p>Hi Admin!</p>
      </main>
    </div>
  </template>
  
  <script>
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  import { db } from '../firebase/index.js'
  import { collection, getDocs, updateDoc, doc } from 'firebase/firestore'

  const errMsg = ref("")
  const router = useRouter()

  export default {
    data() {
      return {
        notificationsVisible: false,
        profileVisible: false,
        sidebarItems: ['Item 1', 'Item 2', 'Item 3', 'Item 4', 'Item 5']
      };
    },
    methods: {
      toggleNotifications() {
        this.notificationsVisible = !this.notificationsVisible;
      },
      toggleProfile() {
        this.profileVisible = !this.profileVisible;
      },
      selectItem(index) {
        // Handle selection of sidebar item
        console.log('Selected item:', index);
      },
      async logout() {
        try {
          console.log("Logging out...")

          const q = collection(db, "users")
          const querySnapshot = await getDocs(q)
          const user = querySnapshot.docs.find(doc => doc.data().loggedIn === true)

          if (user) {
            console.log("User found:", user.data())

            await updateDoc(doc(db, 'users', user.id), {
              loggedIn: false
            });

            router.push({ name: 'login' })
            console.log("Current URL:", window.location.href);
          } else {
            errMsg.value = "No logged in user found"
          }
        } catch (error) {
          console.error("Error:", error.message)
          errMsg.value = "An error occurred"
        }
      }
    }
  };
</script>


  
  <style>
  /* Add your styles here */
  </style>
  