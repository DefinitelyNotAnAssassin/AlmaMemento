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
  align-items: center;
  background-color: #861b23;
  width: 100%;
  padding: 0px 20px;
}

nav img {
    width: 200px;
}

.btn-home, .btn-yearbook {
    height: 30px;
    widows: 80px;
    background-color: rgba(255, 255, 255, 0);
    border: none;
    color: white;
    margin: 10px;
}

.btn-home, .btn-yearbook:hover {
    background-color: rgba(255, 255, 255, 0.697);
    color: black;
}

.right-container {
    display: flex;
    justify-content: space-between;
    width: 300px;
}

.right-container button {
    height: 30px;
    widows: 30px;
    color: white;
    background-color: rgba(255, 255, 255, 0);
}

</style>
