<template>
  <div class="container-fluid p-0">
    <NavBar />
    <div class="container-fluid d-flex">
      <SideBar />
      <div class="main-content">
        Heyy
      </div>
    </div>
  </div>
</template>

<script setup>
import NavBar from "./alumni-navbar.vue";
import SideBar from "./alumni-sidebar.vue";
</script>

<style scoped>
.main-content {
  width: calc(100% - 400px);
}
</style>
