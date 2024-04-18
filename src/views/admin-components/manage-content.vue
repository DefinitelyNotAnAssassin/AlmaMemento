<template>
    <div>
      <table>
        <thead>
          <tr>
            <th></th>
            <th>ID Number</th>
            <th>Year</th>
            <th>Event</th>
            <th>Description</th>
            <th>Image</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in items" :key="item.id">
            <td><input type="checkbox" v-model="selectedItems" :value="item.id"></td>
            <td>{{ getUserDataId(item.userId) }}</td>
            <td>{{ getYear(item.schoolYear) }}</td>
            <td>{{ getEvent(item.event) }}</td>
            <td>{{ item.caption }}</td>
            <td><a @click="showImagePreview(item.imageUrl)">View Image</a></td>
            <td>
              <button @click="approvePost(item)">Approve</button>
              <button @click="disapprovePost(item)">Disapprove</button>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-if="imagePreview" class="image-preview">
        <img :src="imagePreview" alt="Image Preview">
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from "vue";
  import { db } from '../../firebase/index.js';
  import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
  
  const items = ref([]);
  const selectedItems = ref([]);
  const imagePreview = ref(null);
  const schoolYear = ref([]);
  const event = ref([]);
  const userId = ref([]);
  
  onMounted(async () => {
    const querySnapshot = await getDocs(collection(db, 'posts'));
    items.value = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  
    fetchUsersAndClassYearsAndEvents();
  });
  
  const fetchUsersAndClassYearsAndEvents = async () => {
    const userSnapshot = await getDocs(collection(db, 'users'));
    userId.value = userSnapshot.docs.map(doc => ({ id: doc.id, alumnaID: doc.data().alumnaID, name: doc.data().name }));

    const classYearsSnapshot = await getDocs(collection(db, 'classYears'));
    schoolYear.value = classYearsSnapshot.docs.map(doc => ({ id: doc.id, name: doc.data().name }));

    const eventsSnapshot = await getDocs(collection(db, 'events'));
    event.value = eventsSnapshot.docs.map(doc => ({ id: doc.id, name: doc.data().name }));
}

function getUserDataId(user) {
    const userData = userId.value.find(u => u.id === user);
    return userData ? userData.alumnaID : 'Unknown';
  }
  
  function getYear(yearId) {
    const yearData = schoolYear.value.find(y => y.id === yearId);
    return yearData ? yearData.name : 'Unknown';
  }
  
  function getEvent(eventId) {
    const eventData = event.value.find(e => e.id === eventId);
    return eventData ? eventData.name : 'Unknown';
  }
  
  async function approvePost(item) {
  const postRef = doc(db, 'posts', item.id);
  await updateDoc(postRef, { status: 'approved' });
}

async function disapprovePost(item) {
  const postRef = doc(db, 'posts', item.id);
  await updateDoc(postRef, { status: 'disapproved' });
}
  
  function showImagePreview(imageUrl) {
    imagePreview.value = imageUrl;
  }
  
  // Reset image preview when clicking outside the preview
  window.addEventListener('click', event => {
    if (event.target.closest('.image-preview') === null) {
      imagePreview.value = null;
    }
  });
  </script>
  