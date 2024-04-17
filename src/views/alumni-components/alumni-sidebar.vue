<template>
  <aside class="sidebar-container bg-secondary d-flex flex-row align-items-center">
    <img
      src="https://scontent.fmnl25-1.fna.fbcdn.net/v/t39.30808-6/362681859_833846268097031_774316903881338625_n.jpg?_nc_cat=103&ccb=1-7&_nc_sid=5f2048&_nc_eui2=AeHybu1WboC1y_yed82N84fp01fI_da8ksXTV8j91rySxXf65cUC0wq7qeoTuGVHZoA7wWJE_7z3FS0NZzVf5bJJ&_nc_ohc=8WQTYxhl5nQAb5u3wwK&_nc_ht=scontent.fmnl25-1.fna&oh=00_AfBm__PVH81knV7GG_RFs3itnIRxD5TSyT79WZ3tDsMZaw&oe=6625BCA4"
      alt="profile"
    />
    <h3>Emmanuel Ugaban</h3>
    <p>emman@gmail.com</p>
    <div>
      <h3>Profile</h3>
      <div>
        <span>ID number: </span>
        <span>00000</span>
      </div>
      <div>
        <span>Course: </span>
        <span>BSIT</span>
      </div>
      <div>
        <span>Class Year: </span>
        <span>2023-2024</span>
      </div>
      <div>
        <span>Phone </span>
        <span>09123456789</span>
      </div>
    </div>
  </aside>
</template>

<script setup>
import { ref } from "vue";
</script>

<style scoped>
aside {
  height: calc(100vh - 60px);
  width: 400px;
}
</style>
