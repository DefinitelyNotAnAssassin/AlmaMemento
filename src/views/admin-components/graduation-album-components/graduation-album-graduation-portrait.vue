<template>
{{ props.gradsubfolderName }} - {{ props.subfolderName }} - {{ props.folderName }}
</template>
<script setup>
  import { ref, onMounted, defineEmits, computed } from 'vue';
  import { collection, addDoc, getDocs, deleteDoc, updateDoc, doc, query, where } from 'firebase/firestore';
  import { db, storage } from '../../../firebase/index.js';
  import { uploadBytes, deleteObject, getDownloadURL } from 'firebase/storage';

  const currentAlbumPage = ref('GraduationPortrait')
  const props = defineProps(['folderName', 'subfolderName', 'gradsubfolderName']);

</script>