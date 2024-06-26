<template>
  <Loading v-if="isLoading" />
  <aside :class="['sidebar', {'show-nav': isNavVisible}]">
    <a href="#" class="btn-nav" @click="handleSidebar">&#9776;</a>
    <img src="../../assets/images/w-logo.png" alt="Logo" />
    <ul class="mt-3">
      <li
        class="mt-1"
        v-for="(item, index) in sidebarItems"
        :key="index"
        :class="{ disabled: isItemDisabled(item) }"
      >
        <a
          @click="handleSidebarItemClick(item)"
          :class="{ 'disabled-link': isItemDisabled(item) }"
          :disabled="isItemDisabled(item)"
        >
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
     
    </div>
  </aside>
</template>

<script setup>
import { ref, computed, reactive, defineEmits, onMounted } from "vue";
import { useRouter } from "vue-router";
import { db } from "../../firebase/index.js";
import {
  collection,
  getDocs,
  updateDoc,
  doc,
  getDoc,
} from "firebase/firestore";
import Loading from "../loading.vue";

const currentPage = ref("Dashboard");
const loadingProgress = ref(0);
const userRole = ref(null);
const router = useRouter();
const userId = computed(() => router.currentRoute.value.query.userId);
const isLoading = ref(false);
const isNavVisible = ref(false);

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

const handleSidebar = (e)=>{
  e.preventDefault();
 isNavVisible.value = !isNavVisible.value;
 console.log(isNavVisible.value)
}

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
  return (
    userRole.value === "moderator" &&
    item !== "Profile" &&
    item !== "Manage Content"
  );
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
.btn-nav{ 
  background: none;
  color: #fff;
  font-size: 1.5rem;
  font-weight: bold;
  position: absolute;
  right: 0.9rem;
  top: -0.5rem;
  cursor: pointer;
  display: none;
}
.sidebar li {
  color: #fff;
}


@media only screen and (max-width: 615px) {
 .sidebar{
  width: 3rem;
  min-width: 3rem;
  overflow-x: hidden;
  position: relative;
  transition: all 0.3s ease-out;
 }

 .sidebar.show-nav{
  width: 12rem;
  min-width: 12rem;
  transition: all 0.3s ease-out;
 }

.btn-nav{
  display: block;
}

 .sidebar img{
  display: none;
 }

 .sidebar li {
  overflow-x: hidden;

 }



}

</style>

