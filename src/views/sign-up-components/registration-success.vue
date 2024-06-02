<template>
  <div
    class="d-flex justify-content-center align-items-center pb-5"
    style="height: 100vh"
  >
    <div class="d-flex flex-column align-items-center">
      <img
        src="../../assets/images/check_icon.png"
        style="height: 100px; width: 100px"
      />
      <h1 style="font-size: 2rem !important; font-weight: bolder;">You’re Done!</h1>
      <form @submit.prevent="GotoLoginPage">
        <p style="text-align: center;">Click the button below to Log in</p>
        <div>
          <button class="btn btn-danger w-100" type="submit" style="width: 30vw !important;">Log in</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
const router = useRouter();

const GotoLoginPage = ()=>{
  router.push("/login");
}
</script>
