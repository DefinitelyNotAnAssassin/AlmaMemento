<template>
{{ props.gradsubfolderName }} - {{ props.subfolderName }} - {{ props.folderName }}

<button @click="backToGrad">Back</button>

<button @click="openModal" class="add-photo-button">Add Photo</button>

<div class="adviser-container">
    <img v-if="adviserImageUrl" :src="adviserImageUrl" alt="Adviser Image" />
    <h3 v-if="adviserName">Adviser: {{ adviserName }}</h3>
</div>

<div class="student-container" v-for="student in students" :key="student.id">
  <img :src="student.imageUrl" alt="Student Image" />
  <h3>{{ student.name }}</h3>
  <p v-if="student.address">Address: {{ student.address }}</p>
  <p v-if="student.quotes">Quotes: {{ student.quotes }}</p>
</div>

<div v-if="isModalOpen" class="modal">
  <div class="modal-content">
    <span @click="closeModal" class="close">&times;</span>
    <h2>Upload Image</h2>
    <input type="file" @change="uploadImage" ref="imageInput" />
    <label for="role">Role:</label>
    <select id="role" v-model="selectedRole">
      <option value="adviser" :disabled="isAdviserDisabled">Adviser</option>
      <option value="student">Student</option>
    </select>
    <label for="name">Name:</label>
    <input type="text" id="name" v-model="nameInput" />
    <label for="address" v-if="selectedRole === 'student'">Address:</label>
    <input type="text" id="address" v-model="addressInput" v-if="selectedRole === 'student'" />
    <label for="quotes" v-if="selectedRole === 'student'">Quotes:</label>
    <input type="text" id="quotes" v-model="quotesInput" v-if="selectedRole === 'student'" />
    <button @click="uploadData" class="upload-button">Upload</button>
  </div>
</div>
</template>

<script setup>
import { ref, onMounted, computed, watch, defineProps, defineEmits } from 'vue';
import { addDoc, collection, query, where, getDocs, onSnapshot } from 'firebase/firestore';
import { uploadBytes, getDownloadURL, deleteObject, ref as storageRef } from 'firebase/storage';
import { db, storage } from '../../../firebase/index.js';

const currentAlbumPage = ref('GraduationPortrait')

const props = defineProps(['folderName', 'subfolderName', 'gradsubfolderName']);
const isModalOpen = ref(false);
const imageInput = ref(null);
const selectedRole = ref('');
const nameInput = ref('');
const addressInput = ref('');
const quotesInput = ref('');
const isAdviserDisabled = ref(false); 
const students = ref([]);
const adviser = ref(null);
const adviserImageUrl = ref('');
const adviserName = ref('');

const emit = defineEmits(['update:currentPage'])

const backToGrad = async () => {
  currentAlbumPage.value = 'ChosenCourse';
  emit('update:currentPage', 'ChosenCourse');
};

const openModal = async () => {
    isModalOpen.value = true;
};

const closeModal = () => {
    isModalOpen.value = false;
};

const uploadData = async () => {
    const imageRef = storageRef(storage, `gradportrait/${imageInput.value.files[0].name}`);
    await uploadBytes(imageRef, imageInput.value.files[0]);
    const imageUrl = await getDownloadURL(imageRef);

    await addDoc(collection(db, 'gradportrait'), {
        year: props.folderName,
        course: props.subfolderName,
        folderIn: props.gradsubfolderName,
        role: selectedRole.value,
        name: nameInput.value,
        address: addressInput.value,
        quotes: quotesInput.value,
        imageUrl: imageUrl,
    });

    selectedRole.value = '';
    nameInput.value = '';
    addressInput.value = '';
    quotesInput.value = '';

    closeModal();
};

const checkAdviserExists = async () => {
    const q = query(collection(db, 'gradportrait'), where('year', '==', props.folderName), where('course', '==', props.subfolderName), where('role', '==', 'adviser'));
    const querySnapshot = await getDocs(q);
    isAdviserDisabled.value = querySnapshot.size > 0; 
};

const fetchStudentsAndAdviser = async () => {
  const q = query(
    collection(db, 'gradportrait'),
    where('year', '==', props.folderName),
    where('course', '==', props.subfolderName)
  );

  const unsubscribe1 = onSnapshot(q, (querySnapshot) => {
    students.value = [];
    adviser.value = null;

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      if (data.role === 'adviser') {
        adviser.value = data;
        adviserImageUrl.value = data.imageUrl;
        adviserName.value = data.name;
      } else {
        students.value.push(data);
      }
    });
  });

  return unsubscribe1;
};

const unsubscribe1 = fetchStudentsAndAdviser(); watch(
  () => [props.folderName, props.subfolderName],
  () => {
    unsubscribe1();
    unsubscribe1 = fetchStudentsAndAdviser();
  }
);

const unsubscribe = onSnapshot(query(collection(db, 'gradportrait'), where('year', '==', props.folderName), where('course', '==', props.subfolderName), where('role', '==', 'adviser')), () => {
    checkAdviserExists();
});

onMounted(
  checkAdviserExists,
  fetchStudentsAndAdviser
);

</script>


<style scoped>
  .add-photo-button {
    background-color: #4CAF50;
    color: white;
    padding: 15px 32px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 16px;
    margin: 4px 2px;
    cursor: pointer;
  }

  .modal {
    position: fixed;
    z-index: 1;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
  }

  .modal-content {
    background-color: #fefefe;
    margin: 15% auto;
    padding: 20px;
    border: 1px solid #888;
    width: 80%;
    max-width: 800px;
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

  .upload-button {
    background-color: #4CAF50;
    color: white;
    padding: 15px 32px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 16px;
    margin: 4px 2px;
    cursor: pointer;
  }
</style>