<template>
  <nav class="navbar">
    <div class="navbar-brand">
      <a class="navbar-item" href="#"> </a>
    </div>
    <div class="navbar-end">
      <a class="notif-main navbar-item text-light" @click="toggleNotifications">
        <span class="icon">
          <i class="fas fa-bell"></i>
        </span>
        <span
          v-if="unreadPostsCount > 0"
          class="notif-badge badge rounded-pill bg-danger"
          >{{ unreadPostsCount }}</span
        >
      </a>
    </div>
    <div v-if="notificationsVisible" class="notification-panel">
      <ul>
        <li v-for="post in newPosts" :key="post.id" @click="viewPost(post)">
          <span style="color: black">{{ post.name }} added a post </span>
          <span style="color: black">
            {{ timeDifference(post.time.toDate()) }}</span
          >
        </li>
        <li v-for="post in newPosts" :key="post.id" @click="viewPost(post)">
          <span style="color: black">{{ post.name }} added a post </span>
          <span style="color: black">
            {{ timeDifference(post.time.toDate()) }}</span
          >
        </li>
        <li v-for="post in newPosts" :key="post.id" @click="viewPost(post)">
          <span style="color: black">{{ post.name }} added a post </span>
          <span style="color: black">
            {{ timeDifference(post.time.toDate()) }}</span
          >
        </li>
      </ul>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { db } from "../../firebase/index.js";
import { collection, onSnapshot } from "firebase/firestore";

const notificationsVisible = ref(false);
const profileVisible = ref(false);
const unreadPostsCount = ref(0);
const newPosts = ref([]);

const toggleNotifications = () => {
  notificationsVisible.value = !notificationsVisible.value;
  unreadPostsCount.value = 0;
};

const timeDifference = (timestamp) => {
  const postTime = new Date(timestamp).getTime();
  const now = new Date().getTime();
  const difference = now - postTime;

  if (difference < 60000) {
    return "Just now";
  } else if (difference < 3600000) {
    const minutes = Math.floor(difference / 60000);
    return minutes === 1 ? "1 minute ago" : `${minutes} minutes ago`;
  } else if (difference < 86400000) {
    const hours = Math.floor(difference / 3600000);
    return hours === 1 ? "1 hour ago" : `${hours} hours ago`;
  } else {
    const days = Math.floor(difference / 86400000);
    return days === 1 ? "1 day ago" : `${days} days ago`;
  }
};

const viewPost = (post) => {
  console.log("Viewing post:", post);
};

onMounted(() => {
  const notificationsCollection = collection(db, "notifications");
  onSnapshot(notificationsCollection, (snapshot) => {
    const newNotifications = snapshot
      .docChanges()
      .filter((change) => change.type === "added")
      .map((change) => change.doc.data());
    newPosts.value = newNotifications;
    unreadPostsCount.value += newNotifications.length;
  });
});
</script>

<style>
.notification-panel {
  position: absolute;
  top: 50px;
  right: 30px;
  width: 400px;
  max-height: 400px;
  overflow-y: auto;
  background-color: #fff;
  border: 1px solid #ccc;
  padding: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  font-size: 12px !important;
  z-index: 100000 !important;
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

.notif-main {
  position: relative;
}

.notif-badge {
  position: absolute;
  top: 5px;
  right: 13px;
  padding: 3px !important;
  font-size: 10px;
}
</style>
