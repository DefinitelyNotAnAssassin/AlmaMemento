<template>
    <div>
        <button v-if="selectedItems.length > 0" @click="confirmDelete">Delete Selected</button>
        <button @click="addUser">Add User</button>
      <table>
        <thead>
          <tr>
            <th></th>
            <th>Name</th>
            <th>ID Number</th>
            <th>Course <button @click="addCourse">Add</button></th>
            <th>Class Year <button @click="addClassYear">Add</button></th>
            <th>Email</th>
            <th>Phone</th>
            <th>Address</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
            <tr v-for="(item, index) in sortedItems" :key="index">
                <td><input type="checkbox" v-model="selectedItems" :value="item.id"></td>
                <td>{{ item.name }}</td>
                <td>{{ item.alumnaID }}</td>
                <td>{{ getCourseName(item.course) }}</td>
                <td>{{ getClassYearName(item.classYear) }}</td>
                <td>{{ item.alumna_email }}</td>
                <td>{{ item.phone }}</td>
                <td>{{ item.address }}</td>
                <td>
                <button @click="editItem(item)">Edit</button>
                <button @click="deleteItem(index)">Delete</button>
                </td>
            </tr>
        </tbody>
      </table>
      <div v-if="isModalVisible" class="modal">
      <div class="modal-content">
        <span class="close" @click="closeModal">&times;</span>
        <div v-if="isAdding">
            <input type="text" id="alumnaID" name="alumnaID" v-model="alumnaID">
            <select v-model="selectedClassYear">
                <option v-for="classYear in classYears" :key="classYear.id" :value="classYear.id">{{ classYear.name }}</option>
            </select>
            <input type="text" id="fName" name="fName" v-model="fName">
            <input type="text" id="mInitial" name="mInitial" v-model="mInitial">
            <input type="text" id="lName" name="lName" v-model="lName">
            <select v-model="selectedCourse">
                <option v-for="course in courses" :key="course.id" :value="course.id">{{ course.name }}</option>
            </select>
            <input type="email" id="alumna_email" name="alumna_email" v-model="alumna_email">
            <input type="tel" id="phone" name="phone" v-model="phone">
            <input type="text" id="address" name="address" v-model="address">
            <input type="password" id="alumna_password" name="alumna_password" v-model="alumna_password">
        </div>
        <div v-else-if="isEditing">
            <input type="number" id="alumnaID" name="alumnaID" v-model="alumnaID">
            <input type="text" id="fName" name="fName" v-model="fName">
            <input type="text" id="mInitial" name="mInitial" v-model="mInitial">
            <input type="text" id="lName" name="lName" v-model="lName">
            <select v-model="selectedCourse">
                <option v-for="course in courses" :key="course.id" :value="course.id">{{ course.name }}</option>
            </select>
            <select v-model="selectedClassYear">
                <option v-for="classYear in classYears" :key="classYear.id" :value="classYear.id">{{ classYear.name }}</option>
            </select>
            <input type="email" id="alumna_email" name="alumna_email" v-model="alumna_email">
            <input type="tel" id="phone" name="phone" v-model="phone">
            <input type="text" id="address" name="address" v-model="address">
            <input type="password" id="alumna_password" name="alumna_password" v-model="alumna_password">
        </div>
        <div v-else-if="isAddingCourse">
            <input type="text" id="course_name" name="course_name" v-model="course_name">
            <input type="text" id="major" name="major" v-model="major">
        </div>
        <div v-else-if="isAddingClassYear">
            <input type="text" id="year" name="year" v-model="year">
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
import { ref, onMounted, watch } from 'vue'
import { db } from '../../firebase/index.js';
import { collection, query, where, getDocs, addDoc, updateDoc, doc, deleteDoc, onSnapshot } from 'firebase/firestore'
  
const items = ref([])
const selectedItems = ref([])
const isModalVisible = ref(false)
const isAdding = ref(false)
const isEditing = ref(false)
const isAddingCourse = ref(false)
const isAddingClassYear = ref(false)
const isDeleteConfirmationVisible = ref(false)
const selectedCourse = ref(null)
const selectedClassYear = ref(null)
const courses = ref([])
const classYears = ref([])
const alumnaID = ref('');
const fName = ref('');
const mInitial = ref('');
const lName = ref('');
const alumna_email = ref('');
const phone = ref('');
const address = ref('');
const alumna_password = ref('');
  
const fetchData = async () => {
  const querySnapshot = await query(collection(db, 'users'), where('userlevel', '==', 'alumni'));
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
  fetchCoursesAndClassYears();
}


const fetchCoursesAndClassYears = async () => {
    const coursesSnapshot = await getDocs(collection(db, 'courses'));
    courses.value = coursesSnapshot.docs.map(doc => ({ id: doc.id, name: doc.data().name }));

    const classYearsSnapshot = await getDocs(collection(db, 'classYears'));
    classYears.value = classYearsSnapshot.docs.map(doc => ({ id: doc.id, name: doc.data().name }));
}

onMounted(fetchData)

const addUser = () => {
    isModalVisible.value = true
    isAdding.value = true

    alumnaID.value = '';
    fName.value = '';
    mInitial.value = '';
    lName.value = '';
    selectedCourse.value = null;
    selectedClassYear.value = null;
    alumna_email.value = '';
    phone.value = '';
    address.value = '';
    alumna_password.value = '';
}
  
const addCourse = () => {
    isModalVisible.value = true
    isAddingCourse.value = true
}
  
const addClassYear = () => {
    isModalVisible.value = true
    isAddingClassYear.value = true
}

const confirmDelete = () => {
  isModalVisible.value = true
  isDeleteConfirmationVisible.value = true
}

const closeModal = () => {
    isModalVisible.value = false
    isAdding.value = false
    isEditing.value = false
    isAddingCourse.value = false
    isAddingClassYear.value = false
    isDeleteConfirmationVisible.value = false
}

const submitModal = async () => {
    if (isAdding.value === true) {
        const data = {
            alumnaID: alumnaID.value,
            fName: fName.value,
            mInitial: mInitial.value,
            lName: lName.value,
            course: selectedCourse.value,
            classYear: selectedClassYear.value,
            alumna_email: alumna_email.value,
            phone: phone.value,
            address: address.value,
            alumna_password: alumna_password.value,
            userlevel: 'alumni'
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
                course: selectedCourse.value,
                classYear: selectedClassYear.value,
                alumna_email: alumna_email.value,
                phone: phone.value,
                address: address.value,
                alumna_password: alumna_password.value
            })
        } else {
            console.error('Selected item not found');
        }
    } else if (isAddingCourse.value === true) {
        const data = {
            name: course_name.value,
            major: major.value
        };
        await addDoc(collection(db, 'courses'), data);
    } else if (isAddingClassYear.value == true) {
        const data = {
            name: year.value
        };
        await addDoc(collection(db, 'classYears'), data);
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
    selectedCourse.value = selectedItem.course;
    selectedClassYear.value = selectedItem.classYear;
    alumna_email.value = selectedItem.alumna_email;
    phone.value = selectedItem.phone;
    address.value = selectedItem.address;
    alumna_password.value = selectedItem.alumna_password;
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

const getCourseName = (id) => {
  const course = courses.value.find((course) => course.id === id);
  return course ? course.name : '';
};

const getClassYearName = (id) => {
  const classYear = classYears.value.find((classYear) => classYear.id === id);
  return classYear ? classYear.name : '';
};

const deleteSelected = async () => {
  for (const id of selectedItems.value) {
    const docRef = doc(db, 'users', id);
    await deleteDoc(docRef);
  }
  isDeleteConfirmationVisible.value = false
  selectedItems.value = []
}

</script>
  