<template>
<div class="photo-album">
  <h2>Academic Year</h2>
  <div class="folders">
    <div class="folder" v-for="(folder, index) in folders" :key="index" @click="changeAlbumPage(folder.name)">
      <div class="folder-box">
        <span>{{ folder.name }}</span>
        <div class="folder-options" @click.stop="showFolderOptions(index)">
            ...
            <div class="folder-options-content" v-if="folder.showOptions">
                <span @click.stop="editFolder(index)">Edit</span>
                <span @click.stop="deleteFolder(index)">Delete</span>
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
</div>

  </template>
  
  <script setup>
  import { ref, onMounted, defineEmits } from 'vue';
  import { collection, addDoc, getDocs, deleteDoc, updateDoc, doc } from 'firebase/firestore';
  import { db } from '../../../firebase/index.js';

  const currentAlbumPage = ref('Main')
  
  const folders = ref([]);
  const showModal = ref(false);
  const newFolderName = ref('');
  
  const fetchFolders = async () => {
    const querySnapshot = await getDocs(collection(db, 'folders'));
    folders.value = querySnapshot.docs.map(doc => doc.data());
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
  };

  const showFolderOptions = (index) => {
  folders.value.forEach((folder, i) => {
    if (i !== index) {
      folder.showOptions = false;
    }
  });
  folders.value[index].showOptions = !folders.value[index].showOptions;
};

const deleteFolder = async (index) => {
  if (confirm('Are you sure you want to delete this folder?')) {
    await deleteDoc(doc(db, 'folders', folders.value[index].id));
    fetchFolders();
  }
};

const editFolder = (index) => {
    editIndex.value = index;
    editFolderName.value = folders.value[index].name;
};

const saveEditFolder = async () => {
console.log('editIndex:', editIndex.value);
  if (!editFolderName.value.trim()) return;
  folders.value[editIndex.value].name = editFolderName.value;
  await updateFolderName(folders.value[editIndex.value].id, editFolderName.value);
  editIndex.value = null;
};

const cancelEditFolder = () => {
  editIndex.value = null;
};

const editIndex = ref(null);
const editFolderName = ref('');

const updateFolderName = async (id, newName) => {
  await updateDoc(doc(db, 'folders', id), { name: newName });
  fetchFolders();
};


  
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
  