<template>
  <div class="main">
    <div class="container-fluid bg-dark">
      <NavBar />
      <SideBar />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import NavBar from './alumni-components/alumni-navbar.vue';
import SideBar from './alumni-components/alumni-sidebar.vue';

</script>
