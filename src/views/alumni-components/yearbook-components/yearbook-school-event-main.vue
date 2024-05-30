<template>
  <div
    class="components-page-main-container p-3 photo-album"
    style="width: 100vw !important"
  >
    <div class="text-center">
      <h3>School Academic Year</h3>
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
    <div class="folders d-flex flex-wrap">
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
} from "firebase/firestore";
import { db } from "../../../firebase/index.js";

const currentAlbumPage = ref("SE Main");

const folders = ref([]);
const searchQuery = ref("");

const fetchFolders = async () => {
  const querySnapshot = await getDocs(collection(db, "folders"));
  folders.value = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    name: doc.data().name,
  }));
};

onMounted(fetchFolders);

const emit = defineEmits(["update:currentPage", "folder-name"]);

const changeAlbumPage = (folderName) => {
  currentAlbumPage.value = "School Events";
  emit("update:currentPage", "School Events");
  emit("folder-name", folderName);
};

const filteredFolders = computed(() => {
  return folders.value
    .filter((folder) =>
      folder.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
    .sort((a, b) => a.name.localeCompare(b.name));
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
