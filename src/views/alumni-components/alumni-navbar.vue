<template>
  <nav class="navbar-container">
    <img class="logo" src="../../assets/images/logo.png" alt="Logo" />
    <div class="navbar-buttons">
      <button class="btn-home">Home</button>
      <button class="btn-yearbook">Yearbook</button>
    </div>
    <div class="right-container">
      <div class="search-container">
        <i class="fa-solid fa-magnifying-glass"></i>
        <input type="search" placeholder="Search..." />
      </div>
      <button class="btn-notification"><i class="fa-solid fa-bell"></i></button>
      <button class="btn-profile"><i class="fa-solid fa-user"></i></button>
    </div>
  </nav>
</template>

<script setup>
import { ref } from "vue";
</script>

<style scoped>
nav {
  display: flex;
  justify-content: space-between;
  background-color: #861b23;
  width: 100%;
}

nav img {
    width: 200px;
}

.btn-home, .btn-yearbook {
    background-color: none !important;
    border: none !important;
}

.right-container {
    display: flex;
    justify-content: space-between;
    width: 300px;
}
</style>
