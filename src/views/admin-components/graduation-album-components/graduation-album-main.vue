<template>
  <div class="photo-album">
    <h2>Academic Year</h2>
    <input type="text" v-model="searchQuery" placeholder="Search Folder">
    <div class="folders">
      <div class="folder" v-for="(folder, index) in filteredFolders" :key="index" @click="changeAlbumPage(folder.name)">
        <div class="folder-box">
          <span>{{ folder.name }}</span>
          <div class="folder-options" @click.stop="showFolderOptions(index)">
            ...
            <div class="folder-options-content" v-if="folder.showOptions">
              <span @click.stop="editFolder(index)">Edit</span>
              <span @click.stop="showDeleteFolderConfirmation(index)">Delete</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <button @click="showModal = true">Add Folder</button>
    <div v-if="showModal" class="modal">
      <div class="modal-content">
        <input type="text" v-model="newFolderName" placeholder="Folder Name">
        <button @click="addFolder">Create Folder</button>
        <button @click="showModal = false">Cancel</button>
      </div>
    </div>
    <div v-if="editIndex !== null" class="modal">
      <div class="modal-content">
        <input type="text" v-model="editFolderName" placeholder="Folder Name">
        <button @click="saveEditFolder">Save</button>
        <button @click="cancelEditFolder">Cancel</button>
      </div>
    </div>
    <div v-if="showDeleteConfirmation" class="modal">
      <div class="modal-content">
        <p>Are you sure you want to delete this folder?</p>
        <button @click="confirmDeleteFolder">Delete</button>
        <button @click="cancelDeleteFolder">Cancel</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, defineEmits, computed } from 'vue';
import { collection, addDoc, getDocs, deleteDoc, updateDoc, doc } from 'firebase/firestore';
import { db } from '../../../firebase/index.js';

const currentAlbumPage = ref('Main')

const folders = ref([]);
const showModal = ref(false);
const newFolderName = ref('');
const showDeleteConfirmation = ref(false);
let folderToDeleteIndex = null;

const fetchFolders = async () => {
  const querySnapshot = await getDocs(collection(db, 'folders'));
  folders.value = querySnapshot.docs.map(doc => ({ id: doc.id, name: doc.data().name }));
};

onMounted(fetchFolders);

const addFolder = async () => {
  if (!newFolderName.value.trim()) return;
  await addDoc(collection(db, 'folders'), { name: newFolderName.value });
  newFolderName.value = '';
  showModal.value = false;
  fetchFolders();
};

const emit = defineEmits(['update:currentPage'])

const changeAlbumPage = (folderName) => {
  currentAlbumPage.value = 'Course';
  emit('update:currentPage', 'Course');
  emit('folder-name', folderName);
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
  await deleteDoc(doc(db, 'folders', folders.value[index].id));
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
  const folderRef = doc(db, 'folders', folderId);
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

const editIndex = ref(null);
const editFolderName = ref('');

const searchQuery = ref('');

const filteredFolders = computed(() => {
  return folders.value.filter(folder => folder.name.toLowerCase().includes(searchQuery.value.toLowerCase()));
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
