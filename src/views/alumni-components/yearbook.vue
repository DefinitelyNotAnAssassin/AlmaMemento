<template>
  <NavBar />
  <div class="p-3">
    <button
      class="btn"
      :class="currentAlbumPage === 'Grad Main' ? 'btn-secondary' : 'btn-light'"
      @click="setCurrentAlbumPage('Grad Main')"
    >
      Graduation Album
    </button>
    <button
      class="btn"
      @click="setCurrentAlbumPage('SE Main')"
      :class="currentAlbumPage === 'SE Main' ? 'btn-secondary' : 'btn-light'"
    >
      School Events
    </button>
  </div>
  <div v-if="currentAlbumPage === 'Grad Main'">
    <MainPage
      :currentAlbumPage="currentAlbumPage"
      @update:currentPage="currentAlbumPage = $event"
      @folder-name="updateSelectedFolder"
    />
  </div>
  <div v-if="currentAlbumPage === 'PAB'">
    <PAB
      :folderName="selectedFolderName"
      @update:currentPage="currentAlbumPage = $event"
      @subfolder-name="updateSelectedSubFolder"
    />
  </div>
  <div v-if="currentAlbumPage === 'Chosen PAB'">
    <ChosenPAB
      :folderName="selectedFolderName"
      :subfolderName="selectedSubFolderName"
      @update:currentPage="currentAlbumPage = $event"
      @grad-subfolder-name="updateSelectedGradSubFolder"
    />
  </div>
  <div v-if="currentAlbumPage === 'Graduation Portrait'">
    <GraduationPortrait
      :folderName="selectedFolderName"
      :subfolderName="selectedSubFolderName"
      :gradsubfolderName="selectedGradSubFolderName"
      @update:currentPage="currentAlbumPage = $event"
    />
  </div>
  <div v-if="currentAlbumPage === 'Gallery'">
    <Gallery
      :folderName="selectedFolderName"
      :subfolderName="selectedSubFolderName"
      :gradsubfolderName="selectedGradSubFolderName"
      @update:currentPage="currentAlbumPage = $event"
    />
  </div>
  <div v-if="currentAlbumPage === 'SE Main'">
    <SchoolEventMain
      :currentAlbumPage="currentAlbumPage"
      @update:currentPage="currentAlbumPage = $event"
      @folder-name="updateSelectedEventFolder"
    />
  </div>
  <div v-if="currentAlbumPage === 'School Events'">
    <SchoolEvents
      :folderName="selectedFolderName"
      @update:currentPage="currentAlbumPage = $event"
      @subfolder-name="updateSelectedEventSubFolder"
    />
  </div>
  <div v-if="currentAlbumPage === 'School Events Gallery'">
    <SchoolEventGallery
      :folderName="selectedFolderName"
      :subfolderName="selectedSubFolderName"
      @update:currentPage="currentAlbumPage = $event"
    />
  </div>
</template>

<script setup>
import { ref } from "vue";
import NavBar from "./alumni-navbar.vue";
import MainPage from "./yearbook-components/yearbook-main.vue";
import PAB from "./yearbook-components/yearbook-pab.vue";
import ChosenPAB from "./yearbook-components/yearbook-chosen-pab.vue";
import GraduationPortrait from "./yearbook-components/yearbook-grad-portrait.vue";
import Gallery from "./yearbook-components/yearbook-gallery.vue";
import SchoolEventMain from "./yearbook-components/yearbook-school-event-main.vue";
import SchoolEvents from "./yearbook-components/yearbook-school-event.vue";
import SchoolEventGallery from "./yearbook-components/yearbook-school-event-gallery.vue";

const currentAlbumPage = ref("Grad Main");
const selectedFolderName = ref("");
const selectedSubFolderName = ref("");
const selectedGradSubFolderName = ref("");

const updateSelectedFolder = (folderName) => {
  console.log("Folder name selected:", folderName);
  selectedFolderName.value = folderName;
  currentAlbumPage.value = "PAB";
};

const updateSelectedSubFolder = (subfolderName) => {
  console.log("Folder name selected:", subfolderName);
  selectedSubFolderName.value = subfolderName;
  currentAlbumPage.value = "Chosen PAB";
};

const updateSelectedGradSubFolder = (gradsubfolderName) => {
  console.log("Folder name selected:", gradsubfolderName);
  if (gradsubfolderName === "Graduation Portrait") {
    selectedGradSubFolderName.value = gradsubfolderName;
    currentAlbumPage.value = "Graduation Portrait";
  } else {
    selectedGradSubFolderName.value = gradsubfolderName;
    currentAlbumPage.value = "Gallery";
  }
};

const setCurrentAlbumPage = (page) => {
  currentAlbumPage.value = page;
};

const updateSelectedEventFolder = (folderName) => {
  console.log("Folder name selected 1:", folderName);
  selectedFolderName.value = folderName;
  currentAlbumPage.value = "School Events";
};

const updateSelectedEventSubFolder = (subfolderName) => {
  console.log("Folder name selected 2:", subfolderName);
  selectedSubFolderName.value = subfolderName;
  currentAlbumPage.value = "School Events Gallery";
};
</script>
