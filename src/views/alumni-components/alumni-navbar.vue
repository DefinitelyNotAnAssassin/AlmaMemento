<template>
  <nav class="navbar" style="position: sticky; top: 0; z-index: 1;">
    <img src="../../assets/images/w-logo.png" alt="logo" style="height: 50px; margin-left: 120px">  
    <div class="navbar-brand">
      <a class="navbar-item" href="#"> </a>
    </div>
    
    <div>
      <router-link
        :to="{ path: '/alumniDashboard', query: { userId: userId, alumniId: alumniId } }"
        class="navbar-item text-light"
        style="font-size: 15px; text-decoration: none;"
        >Home</router-link
      >
      <router-link
        :to="{ path: '/yearbook', query: { userId: userId, alumniId: alumniId } }"
        class="navbar-item text-light"
        style="font-size: 15px; text-decoration: none"
        >Yearbook</router-link
      >
      <router-link
        :to="{ path: '/memento', query: { userId: userId, alumniId: alumniId } }"
        class="navbar-item text-light"
        style="font-size: 15px; text-decoration: none"
        >Memento</router-link
      >
      <router-link
        :to="{ path: '/contact', query: { userId: userId, alumniId: alumniId } }"
        class="navbar-item text-light"
        style="font-size: 15px; text-decoration: none; margin-right: 330px"
        >Contact</router-link
      >
    </div>
    <div class="navbar-end ">
      <button @click="logout" class=" btn btn-sm btn-light " >
      <i class="fas fa-power-off"></i> Logout
     </button>
      <a class="notif-main navbar-item text-light" @click="toggleNotifications">
        <span class="icon">
          <i class="fas fa-bell"></i>
        </span>
        <span v-if="unreadPostsCount > 0" class="notif-badge badge rounded-pill bg-danger">{{ unreadPostsCount }}</span>
      </a>
    </div>
    <div v-if="notificationsVisible" class="notification-panel">
      <button class="btn btn-sm btn-light mx-1" @click="filterBy('All')">All</button>
      <button class="btn btn-sm btn-light" @click="filterBy('Unread')">Unread</button>
      <ul>
        <li
          v-for="post in filteredPosts"
          :key="post.id"
          @click="viewPost(post)"
          style="cursor: pointer;"
          class="notification"
          :class="{ unread: post.status === 'unread', clickable: post.type === 'concern' }"
        >
        <span style="color: black" v-if="post?.reason === 'Spam'">[] The post was identified as spam or overly promotional. We aim to maintain a community free from unsolicited advertisements.</span>
        <span style="color: black" v-else-if="post?.reason === 'Nudity'">The post included nudity or sexually explicit content, which is not allowed in our community to ensure a professional environment.</span>
        <span style="color: black" v-else-if="post?.reason === 'Violence'">The post contained violent content or imagery, which is prohibited to ensure the safety and comfort of our members.</span>
        <span style="color: black" v-else-if="post?.reason === 'Hate Speech'">The post included hate speech or discriminatory remarks, which violate our commitment to an inclusive and respectful community.</span>
        <span style="color: black" v-else-if="post?.reason === 'False Information'">The post contained incorrect or misleading information. Accuracy is crucial to maintaining trust within our community.</span>
        <span style="color: black" v-else-if="post?.reason === 'Suicide or Self-Injury'">The post referenced or encouraged suicide or self-injury, which we take very seriously for the well-being of our members.</span>
        <span style="color: black" v-else-if="post?.action">{{ "Your post has been " + post?.action}} </span>
<span style="color: black" v-else>{{ "Your post has been rejected due to " + post?.reason}}</span>
        
          <span style="color: black">{{ " " + timeDifference(post?.date) }}</span>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { db } from "../../firebase/index.js";
import { collection, onSnapshot, updateDoc, doc, getDocs } from "firebase/firestore";
import { useRouter } from "vue-router";
const router = useRouter();
const userId = computed(() => router.currentRoute.value.query.userId);
const alumniId = computed(() => router.currentRoute.value.query.alumniId);


const notificationsVisible = ref(false);
const unreadPostsCount = ref(0);
const newPosts = ref([]);
const filteredPosts = ref([]);
const isLoading = ref(false);
const loadingProgress = ref(0);

const logout = async () => {
  isLoading.value = true;
  try {
    isLoading.value = true;

    await new Promise((resolve) => setTimeout(resolve, 1000));
    loadingProgress.value = 25;

    const q = collection(db, "users");
    const querySnapshot = await getDocs(q);
    const userId = router.currentRoute.value.query.userId;

    loadingProgress.value = 50;

    const user = querySnapshot.docs.find(
      (doc) => doc.id === userId && doc.data().loggedIn === true
    );

    if (user) {
      await updateDoc(doc(db, "users", user.id), {
        loggedIn: false,
      });

      loadingProgress.value = 75;

      // router.push({ name: "login" });
      console.log("Logout successful. Redirecting to login page...");
      console.log("Current URL:", window.location.href);
    } else {
      isLoading.value = false;
      console.log("No logged in user found");
    }

    localStorage.clear()
    router.push({ name: "login" });
  } catch (error) {
    isLoading.value = false;
    console.error("Error:", error.message);
  } finally {
    setTimeout(() => {
      isLoading.value = false;
      loadingProgress.value = 100;
    }, 500);
  }
};


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
  const currentPage = ref('');
  if (post.type === "concern") {
    currentPage.value = "Contact";
    emit("update:currentPage", "Contact");
  } else {
    console.log("New post notification:", post);
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

onMounted(() => {
  const notificationsCollection = collection(db, "notifications");
  const unsubscribe = onSnapshot(notificationsCollection, (snapshot) => {

    // Filter notifications for the current user
    const allNotifications = snapshot.docChanges().map((change) => {
      const data = change.doc.data();
      data.id = change.doc.id;
      return data;
    }).filter((notification) => {
    
      return notification.for === "alumni" && notification.authorId === userId.value;
    });

    // Update the reactive variables
    newPosts.value = allNotifications;
    unreadPostsCount.value = allNotifications.filter(
      (notification) => notification.status === "unread"
    ).length;

    // Assign filtered posts to the reactive variable
    filteredPosts.value = [...newPosts.value];
    console.log("New Posts: ", newPosts.value)
    // Sort the filtered posts by time
    filteredPosts.value.sort((a, b) => b.time.toDate() - a.time.toDate());
    console.log("FilteredNotification: ", filteredPosts.value);
  });

  // Return the unsubscribe function to stop listening to snapshot changes when the component is unmounted
  return unsubscribe;
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

.notification:hover{
  background: rgba(0, 0, 0, 0.2)
}
</style>