<template>
  <div class="bg-secondary">
    <div class="d-flex flex-column align-items-center">
      <img
        src="../../assets/images/ctu-logo.png"
        style="height: 60px; width: 60px"
      />
      <h3>Reset Password</h3>
      <form @submit.prevent="checkId">
        <div>
          <label for="idNumber">ID Number</label>
          <input
            class="form-control"
            type="text"
            v-model="idNumber"
            id="idNumber"
            required
          />
        </div>
        <p class="text-danger" v-if="errorMessage">{{ errorMessage }}</p>
        <button class="btn btn-danger mt-3" type="submit">Submit</button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, defineEmits } from "vue";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../firebase/index.js";

const idNumber = ref("");
const errorMessage = ref("");
const emit = defineEmits(["update:currentPage", "id"]);
const currentPage = ref("Reset");

const checkId = async () => {
  try {
    const q = query(
      collection(db, "users"),
      where("alumnaID", "==", idNumber.value)
    );
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      errorMessage.value = "";
      currentPage.value = "Verify";
      emit("update:currentPage", "Verify");
      emit("id", idNumber.value);
    } else {
      errorMessage.value = "ID number does not exist";
    }
  } catch (error) {
    console.error("Error checking ID:", error);
    errorMessage.value = "An error occurred while checking the ID";
  }
};
</script>
