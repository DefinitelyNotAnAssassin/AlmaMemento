<template>
  <div class="loader-container">
    <div class="loader"></div>
  </div>
</template>

<script></script>

<style scoped>
.loader-container {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  width: 100vw;
  top: 0;
  left: 0;
  z-index: 10000000;
  background-color: rgba(0, 0, 0, 0.268);
}

.loader {
  border: 8px solid #f3f3f3;
  border-top: 8px solid #400;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 2s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
