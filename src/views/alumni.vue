<template>
  <div class="main">
    <div class="container-fluid p-0">
      <NavBar />
      <div class="container-fluid d-flex">
        <SideBar />
        <div class="main-content">
          <p>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Doloribus
            quidem rem at ab, laboriosam sit quasi quos eius nihil itaque!
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import NavBar from "./alumni-components/alumni-navbar.vue";
import SideBar from "./alumni-components/alumni-sidebar.vue";
</script>
