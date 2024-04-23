<template>
    <div>
        <h1>Administrator</h1>
        <input type="text" v-model="searchQuery" placeholder="Search by ID or Name">
        <button v-if="selectedItems.length > 0" @click="confirmDelete">Delete Selected</button>
        <button @click="addUser">Add User</button>
      <table>
        <thead>
          <tr>
            <th></th>
            <th>Name</th>
            <th>Moderator ID</th>
            <th>Email</th>
            <th>Birthday</th>
            <th>Phone</th>
            <th>Address</th>
            <th>Year of Administratorship</th>
            <th>Actions</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
            <tr v-for="(item, index) in filteredItems" :key="index">
                <td><input type="checkbox" v-model="selectedItems" :value="item.id"></td>
                <td>{{ item.name }}</td>
                <td>{{ item.alumnaID }}</td>
                <td>{{ item.alumna_email }}</td>
                <td>{{ item.birthday }}</td>
                <td>{{ item.phone }}</td>
                <td>{{ item.address }}</td>
                <td>{{ item.yearAppointed }}</td>
                <td>
                <button @click="editItem(item)">Edit</button>
                <button @click="deleteItem(index)">Delete</button>
                </td>
                <td>
                <button v-if="item.status === 'active'" @click="changeStatus(item.id, 'inactive')">Deactivate</button>
                <button v-else @click="changeStatus(item.id, 'active')">Activate</button>                    
                </td>
            </tr>
        </tbody>
      </table>
      <div v-if="isModalVisible" class="modal">
      <div class="modal-content">
        <span class="close" @click="closeModal">&times;</span>
        <div v-if="isAdding">
            <input type="text" id="alumnaID" name="alumnaID" v-model="alumnaID">
            <input type="text" id="fName" name="fName" v-model="fName">
            <input type="text" id="mInitial" name="mInitial" v-model="mInitial">
            <input type="text" id="lName" name="lName" v-model="lName">
            <input type="email" id="alumna_email" name="alumna_email" v-model="alumna_email">
            <input type="password" id="alumna_password" name="alumna_password" v-model="alumna_password">
            <input type="text" id="birthday" name="birthday" v-model="birthday">
            <input type="tel" id="phone" name="phone" v-model="phone">
            <input type="text" id="address" name="address" v-model="address">
        </div>
        <div v-else-if="isEditing">
            <input type="text" id="alumnaID" name="alumnaID" v-model="alumnaID">
            <input type="text" id="fName" name="fName" v-model="fName">
            <input type="text" id="mInitial" name="mInitial" v-model="mInitial">
            <input type="text" id="lName" name="lName" v-model="lName">
            <input type="email" id="alumna_email" name="alumna_email" v-model="alumna_email">
            <input type="password" id="alumna_password" name="alumna_password" v-model="alumna_password">
            <input type="text" id="birthday" name="birthday" v-model="birthday">
            <input type="tel" id="phone" name="phone" v-model="phone">
            <input type="text" id="address" name="address" v-model="address">
        </div>
        <div v-else-if="isDeleteConfirmationVisible">
            <p>Are you sure you want to delete the selected item(s)?</p>
            <button @click="deleteSelected">Confirm</button>
        </div>
        <button @click="submitModal">Submit</button>
      </div>
    </div>
    </div>
  </template>
  
<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import { db } from '../../firebase/index.js';
import { collection, query, where, addDoc, updateDoc, doc, deleteDoc, onSnapshot } from 'firebase/firestore'
  
const items = ref([])
const selectedItems = ref([])
const isModalVisible = ref(false)
const isAdding = ref(false)
const isEditing = ref(false)
const isDeleteConfirmationVisible = ref(false)
const alumnaID = ref('');
const fName = ref('');
const mInitial = ref('');
const lName = ref('');
const alumna_email = ref('');
const alumna_password = ref('');
const birthday = ref('');
const phone = ref('');
const address = ref('');
const yearAppointed = ref(new Date().getFullYear().toString());

const searchQuery = ref('');

const filteredItems = computed(() => {
  const query = searchQuery.value.toLowerCase();
  return sortedItems.value.filter(item => {
    return (
      item.alumnaID.toLowerCase().includes(query) ||
      item.name.toLowerCase().includes(query)
    );
  });
});
  
const fetchData = async () => {
  const querySnapshot = await query(collection(db, 'users'), where('userlevel', '==', 'administrator'));
  onSnapshot(querySnapshot, (snapshot) => {
    items.value = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        ...data,
        id: doc.id,
        name: `${data.lName}, ${data.fName}`
      };
    });
  });
}


onMounted(fetchData)

const addUser = () => {
    isModalVisible.value = true
    isAdding.value = true

    alumnaID.value = '';
    fName.value = '';
    mInitial.value = '';
    lName.value = '';
    alumna_email.value = '';
    alumna_password.value = '';
    birthday.value = '';
    phone.value = '';
    address.value = '';
}

const confirmDelete = () => {
  isModalVisible.value = true
  isDeleteConfirmationVisible.value = true
}

const closeModal = () => {
    isModalVisible.value = false
    isAdding.value = false
    isEditing.value = false
    isDeleteConfirmationVisible.value = false
}

const submitModal = async () => {
    if (isAdding.value === true) {
        const data = {
            alumnaID: alumnaID.value,
            fName: fName.value,
            mInitial: mInitial.value,
            lName: lName.value,
            alumna_email: alumna_email.value,
            alumna_password: alumna_password.value,
            birthday: birthday.value,
            phone: phone.value,
            address: address.value,
            yearAppointed: yearAppointed.value,
            userlevel: 'administrator',
            status: 'active'
        };
        await addDoc(collection(db, 'users'), data);
    } else if (isEditing.value === true) {
        const selectedItem = items.value.find(item => item.alumnaID === alumnaID.value);
        console.log()
        if (selectedItem) {
            const docRef = doc(db, 'users', selectedItem.id);
            await updateDoc(docRef, {
                alumnaID: alumnaID.value,
                fName: fName.value,
                mInitial: mInitial.value,
                lName: lName.value,
                alumna_email: alumna_email.value,
                alumna_password: alumna_password.value,
                birthday: birthday.value,
                phone: phone.value,
                address: address.value,
            })
        } else {
            console.error('Selected item not found');
        }
    }
    closeModal();
}


const editItem = (selectedItem) => {
    isModalVisible.value = true;
    isEditing.value = true;

    alumnaID.value = selectedItem.alumnaID;
    fName.value = selectedItem.fName;
    mInitial.value = selectedItem.mInitial;
    lName.value = selectedItem.lName;
    alumna_email.value = selectedItem.alumna_email;
    alumna_password.value = selectedItem.alumna_password;
    birthday.value = selectedItem.birthday;
    phone.value = selectedItem.phone;
    address.value = selectedItem.address;
}
  
const deleteItem = async (index) => {
    const selectedItem = items.value[index];
    if (!selectedItem) return;

    const docRef = doc(db, 'users', selectedItem.id);
    await deleteDoc(docRef);

    items.value.splice(index, 1);
}

const sortedItems = ref([])
    watch(items, () => {
    sortedItems.value = [...items.value].sort((a, b) => a.name.localeCompare(b.name));
})

const deleteSelected = async () => {
  for (const id of selectedItems.value) {
    const docRef = doc(db, 'users', id);
    await deleteDoc(docRef);
  }
  isDeleteConfirmationVisible.value = false
  selectedItems.value = []
}

const changeStatus = async (userId, status) => {
  const docRef = doc(db, 'users', userId);
  await updateDoc(docRef, { status });
}


</script>
  