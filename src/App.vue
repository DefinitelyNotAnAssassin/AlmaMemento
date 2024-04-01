<script setup>
import MainTemplate from './components/templates/main-template.vue'
</script>

<template>
  <div class="main-container">
    <div class="login-container">
      <form @submit.prevent="login">
        <div class="login-logo">
        <img src="./assets/images/logo.png" alt="Logo" style="width: 250px; height: 250px;">
      </div>
        <input type="text" id="username" name="username" v-model="username" required>
        <input type="password" id="password" name="password" v-model="password" required>
        <button type="submit">Login</button>
        <div>
          <a href="#" class="forgot-password-link">Forgot Password?</a>
        </div>
      </form>
      <div>
          <a class="login-footer">Copyright</a>
      </div>
    </div>
    <div class="logo-container">
      <img src="./assets/images/ctu-logo.png" alt="Logo">
    </div>
  </div>
</template> 