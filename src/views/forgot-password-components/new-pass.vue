<template>
    <div>
      <h1>CHOOSE A NEW PASSWORD</h1>
      <form @submit.prevent="updatePassword">
        <p>Enter the password you want to set for your account</p>
        <div>
          <input type="password" v-model="newPass" id="newPass" required />
          <input type="password" v-model="confPass" id="confPass" required />
          </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  </template>
  
  <script setup>
  import { ref, defineProps } from 'vue';
  import { useRouter } from 'vue-router';
  import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
  import { db } from '../../firebase/index.js';
  
  const props = defineProps(['id']);
  const router = useRouter();
  
  const newPass = ref('');
  const confPass = ref('');
  
  const updatePassword = async () => {
    if (newPass.value !== confPass.value) {
      alert('Passwords do not match');
      return;
    }
  
    try {
      const usersCollection = collection(db, 'users');
      const q = query(usersCollection, where('alumnaID', '==', props.id));
      const querySnapshot = await getDocs(q);
  
      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        const userDocRef = doc(db, 'users', userDoc.id);
        await updateDoc(userDocRef, {
          alumna_password: newPass.value
        });
        alert('Password updated successfully');
        router.push('/login');
      } else {
        alert('User not found');
      }
    } catch (error) {
      console.error('Error updating password:', error);
      alert('An error occurred while updating the password');
    }
  };
  </script>
  