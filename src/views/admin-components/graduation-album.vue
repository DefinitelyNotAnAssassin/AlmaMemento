<template>
    <div v-if="currentAlbumPage === 'Main'">
        <MainPage :currentAlbumPage="currentAlbumPage" @update:currentPage="currentAlbumPage = $event" @folder-name="updateSelectedFolder"/>
    </div>
    <div v-if="currentAlbumPage === 'Course'">
        <Course :folderName="selectedFolderName"  @update:currentPage="currentAlbumPage = $event"/>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import MainPage from './graduation-album-components/graduation-album-main.vue'
import Course from './graduation-album-components/graduation-album-course.vue'

const currentAlbumPage = ref('Main')
const selectedFolderName = ref('');

const updateSelectedFolder = (folderName) => {
  console.log('Folder name selected:', folderName);
  selectedFolderName.value = folderName;
  currentAlbumPage.value = 'Course';
};


</script>