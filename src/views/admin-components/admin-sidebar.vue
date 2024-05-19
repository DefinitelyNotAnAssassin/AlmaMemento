<template>
  <aside class="sidebar">
    <div v-if="isLoading" class="modal">
      <div class="modal-background"></div>
      <div class="modal-content">
        <div class="box">
          <progress class="progress is-primary" :value="loadingProgress" max="100">{{ loadingProgress }}%</progress>
          <p>Logging out...</p>
        </div>
      </div>
    </div>
    <img src="../../assets/images/w-logo.png" alt="Logo" />
    <ul class="mt-3">
      <li class="mt-1" v-for="(item, index) in sidebarItems" :key="index" :class="{ disabled: isItemDisabled(item) }">
        <a @click="handleSidebarItemClick(item)" :class="{ 'disabled-link': isItemDisabled(item) }" :disabled="isItemDisabled(item)">
          <i :class="sideBarItemsIcons[index]"></i> {{ item }}
          <span
            v-if="item === 'Manage Users' || item === 'Yearbook'"
            class="dropdown-arrow"
            >▼</span
          >
        </a>
        <ul v-if="dropdownItemsVisibility[item]">
          <li
            v-for="(dropdownItem, dropdownIndex) in dropdownItems[item]"
            :key="dropdownIndex"
          >
            <button
              class="sidebar-button text-light"
              @click="handleDropdownClick(dropdownItem)"
            >
              {{ dropdownItem }}
            </button>
          </li>
        </ul>
      </li>
    </ul>
    <div class="logout-button-container">
      <button @click="logout" class="logout-button btn text-light">
        <i class="fas fa-power-off"></i> Logout
      </button>
    </div>
  </aside>
</template>

<script setup>
import { ref, computed, reactive, defineEmits, onMounted } from "vue";
import { useRouter } from "vue-router";
import { db } from "../../firebase/index.js";
import { collection, getDocs, updateDoc, doc, getDoc } from "firebase/firestore";

const currentPage = ref("Dashboard");
const isLoading = ref(false);
const loadingProgress = ref(0);
const userRole = ref(null);
const router = useRouter();
const userId = computed(() => router.currentRoute.value.query.userId);

const sideBarItemsIcons = [
  "bi bi-speedometer2",
  "bi bi-person-circle",
  "bi bi-people",
  "bi bi-body-text",
  "bi bi-book",
];

const sidebarItems = [
  "Dashboard",
  "Profile",
  "Manage Users",
  "Manage Content",
  "Yearbook",
];
const dropdownItems = {
  "Manage Users": ["Alumni", "Moderator", "Admin"],
  Yearbook: ["Graduation Album", "School Event"],
};
const dropdownItemsVisible = reactive({
  "Manage Users": false,
  Yearbook: false,
});

const emit = defineEmits(["update:currentPage"]);

const getUserRole = async () => {
  try {
    const userDoc = await getDoc(doc(db, "users", userId.value));
    if (userDoc.exists()) {
      userRole.value = userDoc.data().userlevel;
    } else {
      console.log("No such document!");
    }
  } catch (error) {
    console.error("Error fetching user role:", error);
  }
};

onMounted(() => {
  getUserRole();
});

const handleSidebarItemClick = (item) => {
  if (isItemDisabled(item)) return;

  if (item === "Dashboard") {
    currentPage.value = "Dashboard";
    emit("update:currentPage", "Dashboard");
  } else if (item === "Profile") {
    currentPage.value = "Profile";
    emit("update:currentPage", "Profile");
  } else if (item === "Manage Content") {
    currentPage.value = "Manage Content";
    emit("update:currentPage", "Manage Content");
  } else {
    selectItem(item);
  }
};

const selectItem = (item) => {
  if (dropdownItems.hasOwnProperty(item)) {
    dropdownItemsVisible[item] = !dropdownItemsVisible[item];
    console.log(item);
  }
};

const handleDropdownClick = (dropdownItem) => {
  if (isItemDisabled(dropdownItem)) return;

  console.log("Clicked dropdown item:", dropdownItem);
  currentPage.value = dropdownItem;
  emit("update:currentPage", dropdownItem);
};

const isItemDisabled = (item) => {
  return userRole.value === "moderator" && item !== "Profile" && item !== "Manage Content";
};

const logout = async () => {
  try {
    isLoading.value = true;

    await new Promise(resolve => setTimeout(resolve, 1000));
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

      router.push({ name: "login" });
      console.log("Logout successful. Redirecting to login page...");
      console.log("Current URL:", window.location.href);
    } else {
      console.log("No logged in user found");
      errMsg.value = "No logged in user found";
    }
  } catch (error) {
    console.error("Error:", error.message);
    errMsg.value = "An error occurred";
  } finally {
    setTimeout(() => {
      isLoading.value = false;
      loadingProgress.value = 100;
    }, 500);
  }
};

const dropdownItemsVisibility = computed(() => {
  const visibility = {};
  for (const item of sidebarItems) {
    if (dropdownItems.hasOwnProperty(item)) {
      visibility[item] = dropdownItemsVisible[item] || false;
    }
  }
  return visibility;
});
</script>

<style>
.disabled-link {
  pointer-events: none;
  color: #504e4e;
  text-decoration: none;
}
</style>
