<template>
    <div v-if="currentAlbumPage === 'Main'">
        <MainPage :currentAlbumPage="currentAlbumPage" @update:currentPage="currentAlbumPage = $event" @folder-name="updateSelectedFolder"/>
    </div>
    <div v-if="currentAlbumPage === 'Course'">
        <Course :folderName="selectedFolderName"  @update:currentPage="currentAlbumPage = $event" @subfolder-name="updateSelectedSubFolder"/>
    </div>
    <div v-if="currentAlbumPage === 'ChosenCourse'">
        <ChosenCourse :folderName="selectedFolderName" :subfolderName="selectedSubFolderName" @update:currentPage="currentAlbumPage = $event" @grad-subfolder-name="updateSelectedGradSubFolder"/>
    </div>
    <div v-if="currentAlbumPage === 'GraduationPortrait'">
        <GraduationPortrait :folderName="selectedFolderName" :subfolderName="selectedSubFolderName" :gradsubfolderName="selectedGradSubFolderName" @update:currentPage="currentAlbumPage = $event" />
    </div>
    <div v-if="currentAlbumPage === 'Gallery'">
        <Gallery :folderName="selectedFolderName" :subfolderName="selectedSubFolderName" :gradsubfolderName="selectedGradSubFolderName" @update:currentPage="currentAlbumPage = $event" />
    </div>
</template>

<script setup>
import { ref } from 'vue'
import MainPage from './graduation-album-components/graduation-album-main.vue'
import Course from './graduation-album-components/graduation-album-course.vue'
import ChosenCourse from './graduation-album-components/graduation-album-chosen-course.vue'
import GraduationPortrait from './graduation-album-components/graduation-album-graduation-portrait.vue'
import Gallery from './graduation-album-components/graduation-album-gallery.vue'

const currentAlbumPage = ref('Main')
const selectedFolderName = ref('');
const selectedSubFolderName = ref('');
const selectedGradSubFolderName = ref('');

const updateSelectedFolder = (folderName) => {
  console.log('Folder name selected:', folderName);
  selectedFolderName.value = folderName;
  currentAlbumPage.value = 'Course';
};

const updateSelectedSubFolder = (subfolderName) => {
  console.log('Folder name selected:', subfolderName);
  selectedSubFolderName.value = subfolderName;
  currentAlbumPage.value = 'ChosenCourse';
};

const updateSelectedGradSubFolder = (gradsubfolderName) => {
  console.log('Folder name selected:', gradsubfolderName);
  if (gradsubfolderName === 'Graduation Portrait') {
    selectedGradSubFolderName.value = gradsubfolderName;
    currentAlbumPage.value = 'GraduationPortrait';
  }else {
    selectedGradSubFolderName.value = gradsubfolderName;
    currentAlbumPage.value = 'Gallery';
  }
};
</script>