<template>
  <div>
    {{ props.gradsubfolderName }} - {{ props.subfolderName }} - {{ props.folderName }}
    <button @click="showModal = true">Upload Image</button>
    <button @click="backToGrad">Back</button>
    <div v-if="showModal" class="modal">
      <div class="modal-content">
        <span class="close" @click="showModal = false">&times;</span>
        <input type="file" ref="imageInput" @change="handleFileUpload">
        <button @click="uploadImage">Upload</button>
      </div>
    </div>
    <div class="image-container">
      <img v-for="image in images" :key="image.id" :src="image.url" alt="Uploaded Image">
    </div>
  </div>
</template>

<script setup>
import { ref, defineEmits, defineProps } from 'vue';
import { uploadBytes, getDownloadURL, ref as storageRef } from 'firebase/storage';
import { addDoc, collection, query, where, onSnapshot } from 'firebase/firestore';
import { db, storage } from '../../../firebase/index.js';

const props = defineProps(['folderName', 'subfolderName', 'gradsubfolderName']);
const emit = defineEmits(['update:currentPage']);

const currentAlbumPage = ref('Gallery');
const showModal = ref(false);
let selectedFile = null;
const images = ref([]);

const backToGrad = async () => {
  currentAlbumPage.value = 'ChosenCourse';
  emit('update:currentPage', 'ChosenCourse');
};

const handleFileUpload = (event) => {
  selectedFile = event.target.files[0];
};

const uploadImage = async () => {
  if (!selectedFile) return;

  const imageRef = storageRef(storage, `gallery/${selectedFile.name}`);
  await uploadBytes(imageRef, selectedFile);
  const imageUrl = await getDownloadURL(imageRef);

  await addDoc(collection(db, 'gallery'), {
    gradsubfolder: props.gradsubfolderName,
    url: imageUrl,
  });
};

onSnapshot(query(collection(db, 'gallery'), where('gradsubfolder', '==', props.gradsubfolderName)), (snapshot) => {
  images.value = [];
  snapshot.forEach((doc) => {
    const data = doc.data();
    images.value.push({ id: doc.id, url: data.url });
  });
});
</script>

<style>
.modal {
  display: block;
  position: fixed;
  z-index: 1;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgb(0,0,0);
  background-color: rgba(0,0,0,0.4);
}

.modal-content {
  background-color: #fefefe;
  margin: 15% auto;
  padding: 20px;
  border: 1px solid #888;
  width: 80%;
}

.close {
  color: #aaa;
  float: right;
  font-size: 28px;
  font-weight: bold;
}

.close:hover,
.close:focus {
  color: black;
  text-decoration: none;
  cursor: pointer;
}

.image-container {
  display: flex;
  flex-wrap: wrap;
}

.image-container img {
  width: 200px;
  height: 200px;
  margin: 10px;
  object-fit: cover;
}
</style>
