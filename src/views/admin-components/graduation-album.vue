<template>
    <div v-if="currentAlbumPage === 'Main'">
        <MainPage :currentAlbumPage="currentAlbumPage" @update:currentPage="currentAlbumPage = $event" />
    </div>
    <div v-if="currentAlbumPage === 'Course'">
        <Course />
    </div>
</template>

<script setup>
import { ref } from 'vue'
import MainPage from './graduation-album-components/graduation-album-main.vue'
import Course from './graduation-album-components/graduation-album-course.vue'

const currentAlbumPage = ref('Main')

</script>