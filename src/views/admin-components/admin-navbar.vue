<template>
  <nav class="navbar">
    <div class="navbar-brand">
      <a class="navbar-item" href="#">
      </a>
    </div>
    <div class="navbar-end">
      <a class="navbar-item text-light" @click="toggleNotifications">
        <span class="icon">
          <i class="fas fa-bell"></i>
        </span>
        <span v-if="unreadPostsCount > 0" class="tag is-danger">{{ unreadPostsCount }}</span>
      </a>
    </div>
    <div v-if="notificationsVisible" class="notification-panel"  @click="viewPost(post)">
      <ul>
        <li v-for="post in newPosts" :key="post.id">
          <span style="color: black">{{ post.name }} added a post</span>
          <span style="color: black"> at {{ convertedTime }}</span>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { db } from '../../firebase/index.js'
import { collection, onSnapshot } from 'firebase/firestore'

const notificationsVisible = ref(false)
const profileVisible = ref(false)
const unreadPostsCount = ref(0)
const newPosts = ref([])
const convertedTime = ref('')

const toggleNotifications = () => {
  notificationsVisible.value = !notificationsVisible.value
  unreadPostsCount.value = 0
}

const viewPost = (post) => {
  convertedTime.value = new Date().toLocaleString();
}

onMounted(() => {
  const postsCollection = collection(db, 'posts')
  onSnapshot(postsCollection, (snapshot) => {
    const newPostsData = snapshot.docChanges().filter(change => change.type === 'added').map(change => change.doc.data())
    newPosts.value = newPostsData
    unreadPostsCount.value += newPostsData.length
  })
})
</script>

<style>
.notification-panel {
  position: absolute;
  top: 40px;
  right: 0;
  width: 200px;
  background-color: #fff;
  border: 1px solid #ccc;
  padding: 10px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
}
.notification-panel ul {
  list-style-type: none;
  padding: 0;
}
.notification-panel li {
  padding: 5px;
  border-bottom: 1px solid #ccc;
}
.notification-panel li:last-child {
  border-bottom: none;
}
</style>
