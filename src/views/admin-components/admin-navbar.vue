<template>
  <nav class="navbar" style="height: 70px;">
    <div class="navbar-brand">
      <a class="navbar-item" href="#">
      
      </a>
    </div>
    <div class="navbar-end">
      <a class="notif-main navbar-item text-light" @click="toggleNotifications">
        <span class="icon">
          <i class="fas fa-bell"></i>
        </span>
        <span v-if="unreadPostsCount > 0" class="notif-badge badge rounded-pill bg-danger">{{ unreadPostsCount }}</span>
      </a>

      <button @click="logout" class=" btn text-light">
        <i class="fas fa-power-off"></i> 
      </button>
    </div>
    <div v-if="notificationsVisible" class="notification-panel">
      <button class="btn btn-sm btn-light mx-1" @click="filterBy('All')">All</button>
      <button class="btn btn-sm btn-light" @click="filterBy('Unread')">Unread</button>
      <ul>
        <li
          v-for="post in filteredPosts"
          :key="post.id"
          @click="viewPost(post)"
          style = "cursor: pointer"
          :class="{ unread: post.status === 'unread', clickable: post.type === 'concern' }"
        >
          <span style="color: black">{{ post.name }} added a {{ post.type }}</span>
          <span style="color: black">{{ timeDifference(post.time.toDate()) }}</span>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted, defineEmits } from "vue";
import { db } from "../../firebase/index.js";
import { collection, onSnapshot, updateDoc, doc, getDocs } from "firebase/firestore";
import { useRouter } from "vue-router";
const notificationsVisible = ref(false);
const unreadPostsCount = ref(0);
const newPosts = ref([]);
const filteredPosts = ref([]);
const router = useRouter();
const toggleNotifications = async () => {
  notificationsVisible.value = !notificationsVisible.value;
  if (!notificationsVisible.value) {
    markAllAsRead();
  }
};

const markAllAsRead = async () => {
  const newNotifications = newPosts.value.filter(
    (notification) => notification.type === "newpost" && notification.status === "unread"
  );

  try {
    for (const notification of newNotifications) {
      const docRef = doc(db, "notifications", notification.id);
      await updateDoc(docRef, { status: "read" });
      notification.status = "read";
    }
    console.log("All notifications updated successfully");
  } catch (error) {
    console.error("Error updating notifications: ", error);
  }
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

const emit = defineEmits(["update:currentPage"]);

const viewPost = async (post) => {
  console.log("Viewing post: ", post)
  if (post.type === "concern") {
    emit("update:currentPage", "Contact");
    currentPage.value = "Contact";
  } else {
    emit("update:currentPage", "Manage Content");
  }

  if (post.status === "unread") {
    try {
      const docRef = doc(db, "notifications", post.id);
      await updateDoc(docRef, { status: "read" });
      post.status = "read";
      unreadPostsCount.value -= 1;
    } catch (error) {
      console.error("Error updating notification status: ", error);
    }
  }
  notificationsVisible.value = false;
};

const filterBy = (status) => {
  if (status === "All") {
    filteredPosts.value = [...newPosts.value];
  } else if (status === "Unread") {
    filteredPosts.value = newPosts.value.filter(
      (post) => post.status === "unread"
    );
  }

  filteredPosts.value.sort((a, b) => b.time.toDate() - a.time.toDate());
};


const logout = async () => {
  try {
 

    await new Promise((resolve) => setTimeout(resolve, 1000));


    const q = collection(db, "users");
    const querySnapshot = await getDocs(q);
    const userId = router.currentRoute.value.query.userId;
 

    const user = querySnapshot.docs.find(
      (doc) => doc.id === userId && doc.data().loggedIn === true
    );

    if (user) {
      await updateDoc(doc(db, "users", user.id), {
        loggedIn: false,
      });


      console.log("Logout successful. Redirecting to login page...");
      console.log("Current URL:", window.location.href);
    } else {
      console.log("No logged in user found");
    }
    localStorage.clear()
    router.push({ name: "login" });
  } catch (error) {
    console.error("Error:", error.message);
  } finally {
    setTimeout(() => {
   
    }, 500);
  }
};
onMounted(() => {
  const notificationsCollection = collection(db, "notifications");
  onSnapshot(notificationsCollection, (snapshot) => {
    const allNotifications = snapshot
      .docChanges()
      .filter((change) => change.type === "added")
      .map((change) => {
        const data = change.doc.data();
        data.id = change.doc.id;
      
        return data;
      })
      .filter((notification) => notification.for !== "alumni");

    newPosts.value = allNotifications;
    unreadPostsCount.value = allNotifications.filter(
      (notification) => notification.status === "unread"
    ).length;
    filteredPosts.value = [...newPosts.value];
      
    filteredPosts.value.sort((a, b) => b.time.toDate() - a.time.toDate());
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

.unread {
  background-color: lightblue;
}

.clickable {
  cursor: pointer;
}



</style>