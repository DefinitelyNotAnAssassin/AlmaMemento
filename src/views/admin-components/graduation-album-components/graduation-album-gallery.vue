<template>
{{ props.gradsubfolderName }} - {{ props.subfolderName }} - {{ props.folderName }}
</template>
<script setup>
  import { ref, onMounted, defineEmits, computed } from 'vue';
  import { collection, addDoc, getDocs, deleteDoc, updateDoc, doc, query, where } from 'firebase/firestore';
  import { db } from '../../../firebase/index.js';
  
  const currentAlbumPage = ref('Gallery')
  const props = defineProps(['folderName', 'subfolderName', 'gradsubfolderName']);

</script>