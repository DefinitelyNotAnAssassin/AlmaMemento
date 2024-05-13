<template>
  <div
    class="components-page-main-container p-3 photo-album"
    style="width: 100vw !important"
  >
    <div class="text-center">
      <h3>{{ props.subfolderName }} - {{ props.folderName }}</h3>
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
      <button class="btn btn-sm btn-dark mx-1" @click="backToPAB">
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
  getDocs,
  deleteDoc,
  updateDoc,
  doc,
  query,
  where,
} from "firebase/firestore";
import { db } from "../../../firebase/index.js";

const currentAlbumPage = ref("Chosen PAB");

const folders = ref([]);
const subfolders = ref([]);
const searchQuery = ref("");
const props = defineProps(["folderName", "subfolderName"]);

const fetchFolders = async () => {
  if (
    currentAlbumPage.value === "Chosen PAB" &&
    props.folderName &&
    props.subfolderName
  ) {
    const querySnapshot = await getDocs(
      query(
        collection(db, "subfolders"),
        where("year", "==", props.folderName),
        where("parentFolder", "==", props.subfolderName),
        where("type", "in", ["grad-album", "subfolder"])
      )
    );

    folders.value = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      name: doc.data().name,
    }));
  } else {
    folders.value = [];
    subfolders.value = [];
  }
};

onMounted(fetchFolders);

const emit = defineEmits(["update:currentPage"]);

const changeAlbumPage = (gradsubfolderName) => {
  currentAlbumPage.value = "Chosen PAB";
  if (gradsubfolderName !== "Graduation Portrait") {
    emit("update:currentPage", "Gallery");
  } else {
    emit("update:currentPage", "Graduation Portrait");
  }
  emit("grad-subfolder-name", gradsubfolderName);
};
const backToPAB = () => {
  currentAlbumPage.value = "PAB";
  emit("update:currentPage", "PAB");
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
  display: flex;
  flex-direction: row;
}

.folder-box {
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 10px;
  margin-bottom: 10px;
  text-align: center;
}

.folder-box span {
  display: block;
  font-weight: bold;
  margin-top: auto;
}
</style>
