<template>
  <div class="main">
    <div>
      <NavBar />
    </div>
    <div>
      <SideBar />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import NavBar from './alumni-components/alumni-navbar.vue';
import SideBar from './alumni-components/alumni-sidebar.vue';

</script>
