<template>{{ props.subfolderName }}</template>
<script setup>
  import { ref, onMounted, defineEmits } from 'vue';
  import { collection, addDoc, getDocs, deleteDoc, updateDoc, doc, query, where } from 'firebase/firestore';
  import { db } from '../../../firebase/index.js';
  
  const currentAlbumPage = ref('Course')
  
  const folders = ref([]);
  const showModal = ref(false);
  const newFolderName = ref('');
  const showDeleteConfirmation = ref(false);
  let folderToDeleteIndex = null;
  const props = defineProps(['folderName', 'subfolderName']);
</script>