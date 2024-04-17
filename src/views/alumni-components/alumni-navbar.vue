<template>
    <div class="navbar-container">
        <img class="logo" src="../../assets/images/logo.png" alt="Logo">
        <div class="navbar-buttons">
            <button class="btn-home">Home</button>
            <button class="btn-yearbook">Yearbook</button>
        </div>
        <div>
            <div class="search-container">
                <i class="fa-solid fa-magnifying-glass"></i>
                <input type="search" placeholder="Search...">
            </div>
            <button class="btn-notification"><i class="fa-solid fa-bell"></i></button>
            <button class="btn-profile"><i class="fa-solid fa-user"></i></button>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'

</script>

