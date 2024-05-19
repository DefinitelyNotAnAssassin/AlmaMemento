<template>
    <div>
      <h1>Reset Password</h1>
      <form @submit.prevent="checkId">
        <div>
          <label for="idNumber">ID Number:</label>
          <input type="text" v-model="idNumber" id="idNumber" required />
        </div>
        <button type="submit">Submit</button>
      </form>
      <p v-if="errorMessage">{{ errorMessage }}</p>
    </div>
  </template>
  
  <script setup>
  import { ref, defineEmits } from 'vue';
  import { collection, query, where, getDocs } from 'firebase/firestore';
  import { db } from '../../firebase/index.js';
  
  const idNumber = ref('');
  const errorMessage = ref('');
  const emit = defineEmits(["update:currentPage", "id"]);
  const currentPage = ref("Reset");
  
  const checkId = async () => {
    try {
        const q = query(collection(db, 'users'), where('alumnaID', '==', idNumber.value));
        const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        errorMessage.value = '';
        currentPage.value = "Verify";
        emit("update:currentPage", "Verify");
        emit("id", idNumber.value);
      } else {
        errorMessage.value = 'ID number does not exist';
      }
    } catch (error) {
      console.error('Error checking ID:', error);
      errorMessage.value = 'An error occurred while checking the ID';
    }
  };
  </script>
  