<template>
    <div v-if="currentAlbumPage === 'Event Year'">
        <EventYear :currentAlbumPage="currentAlbumPage" @update:currentPage="currentAlbumPage = $event" @folder-name="updateSelectedFolder"/>
    </div>
    <div v-if="currentAlbumPage === 'Event'">
        <EventPage :folderName="selectedFolderName" :currentAlbumPage="currentAlbumPage" @update:currentPage="currentAlbumPage = $event" @subfolder-name="updateSelectedSubFolder"/>
    </div>
    <div v-if="currentAlbumPage === 'Event Gallery'">
        <EventGallery :folderName="selectedFolderName" :subfolderName="selectedSubFolderName" @update:currentPage="currentAlbumPage = $event"/>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import EventYear from './school-event-components/event-year.vue'
import EventPage from './school-event-components/event-main.vue'
import EventGallery from './school-event-components/event-gallery.vue'

const currentAlbumPage = ref('Event Year')
const selectedFolderName = ref('');
const selectedSubFolderName = ref('');

const updateSelectedFolder = (folderName) => {
  console.log('Folder name selected:', folderName);
  selectedFolderName.value = folderName;
  currentAlbumPage.value = 'Event';
};

const updateSelectedSubFolder = (subfolderName) => {
  console.log('Folder name selected:', subfolderName);
  selectedSubFolderName.value = subfolderName;
  currentAlbumPage.value = 'Event Gallery';
};

</script>