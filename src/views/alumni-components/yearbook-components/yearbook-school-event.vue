<template>
  <div
    class="components-page-main-container p-3 photo-album"
    style="width: 100vw !important"
  >
    <div class="text-center">
      <h3>Program & Block</h3>
    </div>
    <div class="d-flex justify-content-end">
      <input
        class="form-control"
        style="width: 250px"
        type="text"
        v-model="searchQuery"
        placeholder="Search Folder"
      />
    </div>
    <div class="d-flex justify-content-between">
      <button class="btn btn-sm btn-dark mx-1" @click="backToSEMain">
        <i class="bi bi-arrow-return-left"></i>
      </button>
    </div>
    <div class="folders">
      <div
        class="folder m-2"
        v-for="(folder, index) in filteredFolders"
        :key="index"
        @click="changeAlbumPage(folder.name)"
      >
        <div class="folder-box bg-secondary">
          <div class="folder-options"></div>
          <div class="folder-name-bottom bg-primary text-light">
            <span>{{ folder.name }}</span>
            <span><i class="bi bi-arrow-right-circle-fill"></i></span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, defineEmits, computed } from "vue";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  updateDoc,
  doc,
  query,
  where,
} from "firebase/firestore";
import { db } from "../../../firebase/index.js";

const currentAlbumPage = ref("School Events");

const folders = ref([]);
const searchQuery = ref("");
const props = defineProps(["folderName"]);

const fetchFolders = async () => {
  if (currentAlbumPage.value === "School Events" && props.folderName) {
    const querySnapshot = await getDocs(
      query(collection(db, "subfolders"), where("year", "==", props.folderName))
    );
    folders.value = querySnapshot.docs
      .map((doc) => ({
        id: doc.id,
        name: doc.data().name,
        type: doc.data().type,
      }))
      .filter((folder) => folder.type === "events");
  } else {
    folders.value = [];
  }
};

onMounted(fetchFolders);

const emit = defineEmits(["update:currentPage", "subfolder-name"]);

const changeAlbumPage = (subfolderName) => {
  currentAlbumPage.value = "School Events Gallery";
  emit("update:currentPage", "School Events Gallery");
  emit("subfolder-name", subfolderName);
};

const backToSEMain = () => {
  currentAlbumPage.value = "SE Main";
  emit("update:currentPage", "SE Main");
};

const filteredFolders = computed(() => {
  return folders.value.filter((folder) =>
    folder.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});
</script>

<style>
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 5px;
}

input {
  margin-bottom: 10px;
}

.folders {
  height: 70vh;
  overflow-y: auto;
}

.folder-box {
  width: 200px;
  height: 200px;
  position: relative;
  border-radius: 0% !important;
}

.folder-options {
  position: absolute;
  top: 5px;
  right: 5px;
  cursor: pointer;
}

.folder-options-content {
  background-color: white;
  position: absolute;
  top: 25px;
  right: 5px;
  border-radius: 5px;
  padding: 5px;
}

.folder-options-content span {
  font-size: 12px;
  cursor: pointer;
}

.folder-name-bottom {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 5px;
  display: flex;
  justify-content: space-between;
  cursor: pointer;
}
</style>
