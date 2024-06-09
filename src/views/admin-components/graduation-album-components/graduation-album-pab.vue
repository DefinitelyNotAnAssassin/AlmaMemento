<template>
  <div class="components-page-main-container p-3 photo-album">
    <div class="text-center">
      <h4>Program and Block</h4>
    </div>
    <div class="d-flex justify-content-end">
      <input
        class="form-control mb-2"
        style="width: 250px"
        type="text"
        v-model="searchQuery"
        placeholder="Search Folder"
      />
    </div>
    <div class="d-flex justify-content-between">
      <button class="btn btn-sm btn-dark mx-1" @click="backToMain">
        <i class="bi bi-arrow-return-left"></i>
      </button>
      <button class="btn btn-sm btn-success mx-1" @click="showModal = true">
        Add Folder
      </button>
    </div>
    <div class="folders flex-wrap">
      <div
        class="folder m-2"
        v-for="(folder, index) in filteredFolders"
        :key="index"
        @click="changeAlbumPage(folder.name)"
      >
        <div class="folder-box bg-secondary">
          <div class="folder-options" @click.stop="showFolderOptions(index)">
            <i class="bi bi-three-dots-vertical"></i>
          </div>
          <div class="folder-options-content" v-if="folder.showOptions">
            <span @click.stop="editFolder(index)">Edit</span>
            <span @click.stop="showDeleteFolderConfirmation(index)"
              >Delete</span
            >
          </div>
          <div class="folder-name-bottom bg-primary text-light">
            <span>{{ folder.name }}</span>
            <span><i class="bi bi-arrow-right-circle-fill"></i></span>
          </div>
        </div>
      </div>
    </div>
    <div v-if="showModal" class="modal">
      <div class="modal-content">
        <input
          class="form-control"
          type="text"
          v-model="newFolderName"
          placeholder="Folder Name"
        />
        <button class="btn btn-sm btn-primary" @click="addFolder">
          Create Folder
        </button>
        <button
          class="btn btn-sm btn-secondary mt-1"
          @click="showModal = false"
        >
          Cancel
        </button>
      </div>
    </div>
    <div v-if="editIndex !== null" class="modal">
      <div class="modal-content">
        <input
          class="form-control"
          type="text"
          v-model="editFolderName"
          placeholder="Folder Name"
        />
        <button class="btn btn-sm btn-primary" @click="saveEditFolder">
          Save
        </button>
        <button class="btn btn-sm btn-secondary mt-1" @click="cancelEditFolder">
          Cancel
        </button>
      </div>
    </div>
    <div v-if="showDeleteConfirmation" class="modal">
      <div class="modal-content">
        <p>Are you sure you want to delete this folder?</p>
        <button class="btn btn-sm btn-primary" @click="confirmDeleteFolder">
          Delete
        </button>
        <button
          class="btn btn-sm btn-secondary mt-1"
          @click="cancelDeleteFolder"
        >
          Cancel
        </button>
      </div>
    </div>
    <div v-if="showWarningModal" class="modal">
      <div class="modal-content alert alert-warning">
        <p>A folder with the same name already exists!</p>
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

const currentAlbumPage = ref("PAB");

const folders = ref([]);
const showModal = ref(false);
const showWarningModal = ref(false);
const newFolderName = ref("");
const showDeleteConfirmation = ref(false);
let folderToDeleteIndex = null;
const editIndex = ref(null);
const editFolderName = ref("");
const searchQuery = ref("");
const props = defineProps(["folderName"]);

const fetchFolders = async () => {
  if (currentAlbumPage.value === "PAB" && props.folderName) {
    const querySnapshot = await getDocs(
      query(collection(db, "subfolders"), where("year", "==", props.folderName))
    );
    folders.value = querySnapshot.docs
      .map((doc) => ({
        id: doc.id,
        name: doc.data().name,
        type: doc.data().type,
      }))
      .filter((folder) => folder.type === "pab");
  } else {
    folders.value = [];
  }
};

onMounted(fetchFolders);

const addFolder = async () => {
  if (!newFolderName.value.trim()) return;

  const existingFolder = folders.value.find(
    (folder) => folder.name === newFolderName.value
  );
  if (existingFolder) {
    showWarningModal.value = true;
    setTimeout(() => {
      showWarningModal.value = false;
    }, 2000);
    return;
  }

  const selectedYear = currentAlbumPage.value === "PAB" ? props.folderName : "";

  const pabsQuerySnapshot = await getDocs(
    query(collection(db, "pabs"), where("name", "==", newFolderName.value))
  );
  if (pabsQuerySnapshot.docs.length === 0) {
    await addDoc(collection(db, "pabs"), {
      name: newFolderName.value,
    });
  }

  await addDoc(collection(db, "subfolders"), {
    name: newFolderName.value,
    year: selectedYear,
    type: "pab",
  });

  const subfolderName = `Graduation Portrait`;
  await addDoc(collection(db, "subfolders"), {
    name: subfolderName,
    year: selectedYear,
    type: "subfolder",
    parentFolder: newFolderName.value,
  });

  newFolderName.value = "";
  showModal.value = false;
  fetchFolders();
};

const emit = defineEmits(["update:currentPage"]);

const changeAlbumPage = (subfolderName) => {
  currentAlbumPage.value = "Chosen PAB";
  emit("update:currentPage", "Chosen PAB");
  emit("subfolder-name", subfolderName);
};

const backToMain = () => {
  currentAlbumPage.value = "Main";
  emit("update:currentPage", "Main");
};

const showFolderOptions = (index) => {
  folders.value.forEach((folder, i) => {
    if (i !== index) {
      folder.showOptions = false;
    } else {
      folder.showOptions = !folder.showOptions;
    }
  });
};

const deleteFolder = async (index) => {
  const folderId = folders.value[index].id;
  const folderName = folders.value[index].name;

  await deleteDoc(doc(db, "subfolders", folderId));

  const subfoldersSnapshot = await getDocs(
    query(collection(db, "subfolders"), where("parentFolder", "==", folderName))
  );
  subfoldersSnapshot.docs.forEach(async (doc) => {
    await deleteDoc(doc.ref);
  });

  fetchFolders();
};

const editFolder = (index) => {
  editIndex.value = index;
  editFolderName.value = folders.value[index].name;
};

const saveEditFolder = async () => {
  if (editIndex.value === null) return;
  if (!editFolderName.value.trim()) return;
  const folderId = folders.value[editIndex.value].id;
  const folderRef = doc(db, "subfolders", folderId);
  await updateDoc(folderRef, { name: editFolderName.value });
  editIndex.value = null;
  fetchFolders();
};

const cancelEditFolder = () => {
  editIndex.value = null;
};

const confirmDeleteFolder = async () => {
  if (folderToDeleteIndex !== null) {
    await deleteFolder(folderToDeleteIndex);
    folderToDeleteIndex = null;
    showDeleteConfirmation.value = false;
  }
};

const showDeleteFolderConfirmation = (index) => {
  folderToDeleteIndex = index;
  showDeleteConfirmation.value = true;
};

const cancelDeleteFolder = () => {
  folderToDeleteIndex = null;
  showDeleteConfirmation.value = false;
};

const filteredFolders = computed(() => {
  return folders.value.filter((folder) =>
    folder.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  ).sort((a, b) => a.name.localeCompare(b.name));
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
