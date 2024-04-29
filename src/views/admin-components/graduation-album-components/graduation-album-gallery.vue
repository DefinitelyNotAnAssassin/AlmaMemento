<template>
{{ props.gradsubfolderName }} - {{ props.subfolderName }} - {{ props.folderName }}

<button @click="openModal" class="add-photo-button">Add Photo</button>

<div class="student-container" v-for="student in students" :key="student.id">
  <img :src="student.imageUrl" alt="Gallery Image" />
  <h3>{{ student.name }}</h3>
  <p v-if="student.address">Address: {{ student.address }}</p>
  <p v-if="student.quotes">Quotes: {{ student.quotes }}</p>
  <div class="folder-options" @click.stop="showFolderOptions(index)">
    ...
    <div class="folder-options-content" v-if="folder.showOptions">
      <span @click.stop="editFolder(index)">Edit</span>
      <span @click.stop="showDeleteFolderConfirmation(index)">Delete</span>
    </div>
  </div>
</div>

<div v-if="isModalOpen" class="modal">
  <div class="modal-content">
    <span @click="closeModal" class="close">&times;</span>
    <h2>Upload Image</h2>
    <input type="file" @change="uploadImage" ref="imageInput" />
    <button @click="uploadData" class="upload-button">Upload</button>
  </div>
</div>

</template>
<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { addDoc, collection, query, where, getDocs, onSnapshot } from 'firebase/firestore';
import { uploadBytes, getDownloadURL, deleteObject, ref as storageRef } from 'firebase/storage';
import { db, storage } from '../../../firebase/index.js';
  
  const currentAlbumPage = ref('Gallery')
  const props = defineProps(['folderName', 'subfolderName', 'gradsubfolderName']);

</script>