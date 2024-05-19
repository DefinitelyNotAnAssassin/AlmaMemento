<template>
    <div>
      <h1>PLEASE VERIFY IF IT IS YOU</h1>
      <form @submit.prevent="checkEmail">
        <p>Please check your email for verification code sent to {{ alumna_email }}</p>
        <div>
          <label for="code">Enter Code:</label>
          <input type="text" v-model="code" id="code" required />
        </div>
        <button type="submit">Submit</button>
      </form>
      <p v-if="errorMessage">{{ errorMessage }}</p>
      <p v-if="showResendLink">Didn't receive an email? <a href="#" @click="resendEmail">Try again</a></p>
    </div>
  </template>
  
  <script setup>
  import { ref, defineProps } from 'vue';
  import { collection, query, where, getDocs } from 'firebase/firestore';
  import { db } from '../../firebase/index.js';
  import axios from 'axios';
  
  const code = ref('');
  const errorMessage = ref('');
  const alumna_email = ref('');
  const showResendLink = ref(true);
  const props = defineProps(["id"]);
  
  const generateRandomCode = (length) => {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  };
  
  const fetchEmail = async () => {
    try {
      const q = query(collection(db, 'users'), where('alumnaID', '==', props.id));
      const querySnapshot = await getDocs(q);
  
      if (!querySnapshot.empty) {
        const user = querySnapshot.docs[0].data();
        alumna_email.value = user.alumna_email;
        await resendEmail();
      } else {
        errorMessage.value = 'ID number does not exist';
      }
    } catch (error) {
      console.error('Error fetching email:', error);
      errorMessage.value = 'An error occurred while fetching the email';
    }
  };
  
  fetchEmail();
  
  const resendEmail = async () => {
    try {
      const verificationCode = generateRandomCode(6);
      await axios.post('http://localhost:3000/send-email', { email: alumna_email.value, code: verificationCode });
      console.log('Email sent successfully');
    } catch (error) {
      errorMessage.value = 'Error sending email. Please try again.';
      console.error('Error sending email:', error);
    }
  };
  
  const checkEmail = async () => {
    try {
      console.log('Checking code...', code.value);
      errorMessage.value = 'Incorrect code. Please try again.';
    } catch (error) {
      console.error('Error checking email:', error);
    }
  };
  </script>
  