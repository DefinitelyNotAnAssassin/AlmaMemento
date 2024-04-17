<template>
  <nav class="navbar-container">
    <img class="logo" src="../../assets/images/logo.png" alt="Logo" />
    <div class="navbar-buttons">
      <button type="button" class="btn-home">Home</button>
      <button type="button" class="btn-yearbook">Yearbook</button>
    </div>
    <div class="right-container">
      <div class="search-container">
        <i class="fa-solid fa-magnifying-glass">S</i>
        <input type="search" placeholder="Search..." />
      </div>
      <button type="button" class="btn-notification">
        N<i class="fa-solid fa-bell"></i>
      </button>
      <button type="button" class="btn-profile">
        P<i class="fa-solid fa-user"></i>
      </button>
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

.btn-home,
.btn-yearbook {
  height: 40px;
  widows: 80px;
  background-color: rgba(255, 255, 255, 0);
  border: none;
  color: white;
  margin: 10px;
  padding: 0px 10px;
  border-radius: 5px;
}

.btn-home:hover,
.btn-yearbook:hover {
  background-color: rgba(255, 255, 255, 0.697);
  color: black;
}

.right-container {
  display: flex;
  justify-content: space-between;
  align-items: center !important;
  background-color: blue;
  /* width: 250px; */
}

.right-container .search-container {
  background-color: red !important;
  position: relative;
  width: 150px !important;
  margin: 0 !important;
}

.right-container .search-container input {
  position: absolute !important;
  width: 100% !important;
  height: 100px !important;
}

.right-container .search-container i {
  position: absolute !important;
}

.right-container .search-container i {
  left: 10px;
}

.right-container button {
  height: 40px;
  width: 40px;
  color: white;
  background-color: rgba(255, 255, 255, 0);
  border: none;
}
</style>
