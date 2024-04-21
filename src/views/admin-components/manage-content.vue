<template>
  <div>
    <select v-model="filterStatus">
      <option value="all">All</option>
      <option value="approved">Approved</option>
      <option value="rejected">Rejected</option>
    </select>
    <table>
      <thead>
        <tr>
          <th></th>
          <th>ID Number</th>
          <th>Name</th>
          <th>Year</th>
          <th>Event</th>
          <th>Description</th>
          <th>Image</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in filteredItems" :key="item.id">
          <td><input type="checkbox" v-model="selectedItems" :value="item.id"></td>
          <td>{{ item.userId }}</td>
          <td>{{ item.name }}</td>
          <td>{{ item.schoolYear }}</td>
          <td>{{ item.event }}</td>
          <td>{{ item.caption }}</td>
          <td><a @click="showImagePreview(item.imageUrl)">View Image</a></td>
          <td>
            <template v-if="item.status === 'pending'">
              <button @click="approvePost(item, index)">Approve</button>
              <button @click="rejectPost(item, index)">Reject</button>
            </template>
            <span v-else-if="item.status === 'approved'">Approved</span>
            <span v-else-if="item.status === 'rejected'">Rejected</span>
          </td>
        </tr>
      </tbody>
    </table>
    <div v-if="imagePreview" class="modal">
      <div class="modal-content">
        <span class="close" @click="closeModal">&times;</span>
        <img :src="imagePreview" alt="Image Preview">
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { db } from '../../firebase/index.js';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';

const items = ref([]);
const selectedItems = ref([]);
const imagePreview = ref(null);
const schoolYear = ref([]);
const event = ref([]);
const userId = ref([]);
const filterStatus = ref('all');

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

async function approvePost(item, index) {
  const postRef = doc(db, 'posts', item.id);
  await updateDoc(postRef, { status: 'approved' });
  items.value[index].status = 'approved';
}

async function rejectPost(item, index) {
  const postRef = doc(db, 'posts', item.id);
  await updateDoc(postRef, { status: 'rejected' });
  items.value[index].status = 'rejected';
}

function showImagePreview(imageUrl) {
  imagePreview.value = imageUrl;
}

function closeModal() {
  imagePreview.value = null;
}

const filteredItems = computed(() => {
  if (filterStatus.value === 'all') {
    return items.value;
  } else {
    return items.value.filter(item => item.status === filterStatus.value);
  }
});
</script>

<style>
.modal {
  display: flex;
  position: fixed;
  z-index: 1;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgba(0, 0, 0, 0.7);
}

.modal-content {
  background-color: #fefefe;
  margin: 15% auto;
  padding: 20px;
  border: 1px solid #888;
  width: 80%;
}

.close {
  color: #aaa;
  float: right;
  font-size: 28px;
  font-weight: bold;
}

.close:hover,
.close:focus {
  color: black;
  text-decoration: none;
  cursor: pointer;
}
</style>
