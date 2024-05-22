<template>
  <div class="components-page-main-container p-3 photo-album">
    <div class="text-center">
      <h3>Academic Year</h3>
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
    <div class="d-flex justify-content-end">
      <button class="btn btn-sm btn-success" @click="showModal = true">
        Add Folder
      </button>
    </div>
    <div class="folders d-flex flex-wrap">
      <div
        class="folder m-2"
        v-for="folder in filteredFolders"
        :key="folder.id"
        @click="changeAlbumPage(folder.name)"
      >
        <div class="folder-box bg-secondary">
          <div
            class="folder-options"
            @click.stop="showFolderOptions(folder.id)"
          >
            <i class="bi bi-three-dots-vertical"></i>
          </div>
          <div class="folder-options-content" v-if="folder.showOptions">
            <span @click.stop="editFolder(folder.id)">Edit</span>
            <span @click.stop="showDeleteFolderConfirmation(folder.id)"
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
        <button class="btn btn-sm btn-danger" @click="confirmDeleteFolder">
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

const currentAlbumPage = ref("Main");

const folders = ref([]);
const showModal = ref(false);
const showWarningModal = ref(false);
const newFolderName = ref("");
const editIndex = ref(null);
const editFolderName = ref("");
const searchQuery = ref("");
const showDeleteConfirmation = ref(false);
let folderToDeleteIndex = null;

const fetchFolders = async () => {
  const querySnapshot = await getDocs(collection(db, "folders"));
  folders.value = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    name: doc.data().name,
    showOptions: false,
  }));
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

  try {
    await addDoc(collection(db, "folders"), { name: newFolderName.value });

    const classYearsQuerySnapshot = await getDocs(collection(db, "classYears"));
    const classYearsNames = classYearsQuerySnapshot.docs.map(
      (doc) => doc.data().name
    );

    if (!classYearsNames.includes(newFolderName.value)) {
      await addDoc(collection(db, "classYears"), { name: newFolderName.value });
    }

    newFolderName.value = "";
    showModal.value = false;

    fetchFolders();
  } catch (error) {
    console.error("Error adding folder: ", error);
  }
};

const emit = defineEmits(["update:currentPage"]);

const changeAlbumPage = (folderName) => {
  currentAlbumPage.value = "PAB";
  emit("update:currentPage", "PAB");
  emit("folder-name", folderName);
};

const toggleFolderOptions = (folderId) => {
  folders.value = folders.value.map((folder) => {
    if (folder.id === folderId) {
      return { ...folder, showOptions: !folder.showOptions };
    }
    return { ...folder, showOptions: false };
  });
};

const showFolderOptions = (folderId) => {
  toggleFolderOptions(folderId);
};

const deleteFolder = async (folderId) => {
  const folder = folders.value.find((folder) => folder.id === folderId);
  if (folder) {
    try {
      await deleteDoc(doc(db, "folders", folderId));

      const dbSnapshot = await getDocs(
        query(collection(db, "subfolders"), where("year", "==", folder.name))
      );
      dbSnapshot.forEach(async (docSnapshot) => {
        await deleteDoc(doc(db, "subfolders", docSnapshot.id));
      });

      const gallerySnapshot = await getDocs(
        query(collection(db, "gallery"), where("year", "==", folder.name))
      );
      gallerySnapshot.forEach(async (docSnapshot) => {
        await deleteDoc(doc(db, "gallery", docSnapshot.id));
      });

      const gradPortraitSnapshot = await getDocs(
        query(collection(db, "gradportrait"), where("year", "==", folder.name))
      );
      gradPortraitSnapshot.forEach(async (docSnapshot) => {
        await deleteDoc(doc(db, "gradportrait", docSnapshot.id));
      });

      fetchFolders();
    } catch (error) {
      console.error("Error deleting folder and associated data: ", error);
    }
  }
};

const saveEditFolder = async () => {
  if (editIndex.value === null || !editFolderName.value.trim()) return;

  const folderRef = doc(db, "folders", editIndex.value);
  const oldFolderName = folders.value.find(
    (folder) => folder.id === editIndex.value
  ).name;

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

const showDeleteFolderConfirmation = (folderId) => {
  folderToDeleteIndex = folderId;
  showDeleteConfirmation.value = true;
};

const cancelDeleteFolder = () => {
  folderToDeleteIndex = null;
  showDeleteConfirmation.value = false;
};

const filteredFolders = computed(() => {
  return folders.value
    .filter((folder) =>
      folder.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
    .sort((a, b) => b.name.localeCompare(a.name));
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
