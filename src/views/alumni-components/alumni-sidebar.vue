<template>
  <aside class="sidebar-container d-flex flex-column align-items-center p-3">
    <img
      class="mt-5"
      src="https://scontent.fmnl25-1.fna.fbcdn.net/v/t39.30808-6/362681859_833846268097031_774316903881338625_n.jpg?_nc_cat=103&ccb=1-7&_nc_sid=5f2048&_nc_eui2=AeHybu1WboC1y_yed82N84fp01fI_da8ksXTV8j91rySxXf65cUC0wq7qeoTuGVHZoA7wWJE_7z3FS0NZzVf5bJJ&_nc_ohc=8WQTYxhl5nQAb5u3wwK&_nc_ht=scontent.fmnl25-1.fna&oh=00_AfBm__PVH81knV7GG_RFs3itnIRxD5TSyT79WZ3tDsMZaw&oe=6625BCA4"
      alt="profile"
    />
    <h4 class="mt-2">Emmanuel Ugaban</h4>
    <p>emman@gmail.com</p>
    <div class="mt-5 bg-secondary profile-table-container">
      <h4>Profile</h4>
      <table>
        <tr>
          <td>ID number:</td>
          <td class="td-padding-left">0000</td>
        </tr>
        <tr>
          <td>Course:</td>
          <td class="td-padding-left">BSIT</td>
        </tr>
        <tr>
          <td>Class Year:</td>
          <td class="td-padding-left">2023-2024</td>
        </tr>
        <tr>
          <td>Phone:</td>
          <td class="td-padding-left">09123456789</td>
        </tr>
      </table>
    </div>
  </aside>
</template>

<script setup>
import { ref } from "vue";
</script>

<style scoped>
aside {
  height: calc(100vh - 70px);
  width: 400px;
  border-right: 10px solid #861b23;
}

aside img {
  height: 120px;
  widows: 120px;
  border-radius: 50%;
}

.profile-table-container {
  widows: 350px;
}

.td-padding-left {
  padding-left: 20px;
}
</style>
