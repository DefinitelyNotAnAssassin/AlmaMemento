<template>
    <div class="components-page-main-container p-3">
      <div class="">
        <h3 class="text-center">Alumni</h3>
        <div class="container d-flex flex-column align-items-end">
          <input class="search-bar form-control" style="width: 250px;" type="text" v-model="searchQuery" placeholder="Search by ID or Name">
          <div>
            <button class="btn btn-sm btn-danger mx-1" v-if="selectedItems.length > 0" @click="confirmDelete">Delete Selected</button>
            <button class="btn btn-sm btn-success" @click="addUser">Add User</button>
            <input type="file" @change="importUsers" accept=".xlsx,.xls" />
          </div>
        </div>
      <table class="table table-striped">
        <thead>
          <tr>
            <th></th>
            <th>Name</th>
            <th>ID Number</th>
            <th>Course <button class="btn btn-sm btn-light" @click="addCourse"><i class="bi bi-plus-lg"></i></button></th>
            <th>Class Year <button class="btn btn-sm btn-light" @click="addClassYear"><i class="bi bi-plus-lg"></i></button></th>
            <th>Email</th>
            <th>Phone</th>
            <th>Address</th>
            <th>Actions</th>
          </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in filteredItems" :key="index">
                <td><input type="checkbox" v-model="selectedItems" :value="item.id"></td>
                <td>{{ item.name }}</td>
                <td>{{ item.alumnaID }}</td>
                <td>{{ item.course }}</td>
                <td>{{ item.classYear }}</td>
                <td>{{ item.alumna_email }}</td>
                <td>{{ item.phone }}</td>
                <td>{{ item.address }}</td>
                <td>
                  <button class="btn btn-sm btn-dark mx-1" @click="editItem(item)"><i class="bi bi-pen"></i></button>
                  <button class="btn btn-sm btn-danger" @click="deleteItem(index)"><i class="bi bi-trash3-fill"></i></button>
                </td>
            </tr>
          </tbody>
        </table>
        <div v-if="isModalVisible" class="modal">
        <div class="modal-content">
          <span class="close" @click="closeModal">&times;</span>
          <div v-if="isAdding" class="d-flex">
            <div class="mx-1">
              <div>
                <label for="alumnaID">ID Number</label>
                <input class="form-control" type="text" id="alumnaID" name="alumnaID" v-model="alumnaID">
              </div>
              <div>
                <label for="fName">First Name</label>
                <input class="form-control" type="text" id="fName" name="fName" v-model="fName">
              </div>
              <div>
                <label for="mInitial">Middle Initial</label>
                <input class="form-control" type="text" id="mInitial" name="mInitial" v-model="mInitial">
              </div>
              <div>
                <label for="lName">Last Name</label>
                <input class="form-control" type="text" id="lName" name="lName" v-model="lName">
              </div>
              <div>
                <label>Course</label>
                <select class="form-control" v-model="selectedCourse">
                  <option v-for="course in courses" :key="course.id" :value="course.name">{{ course.name }}</option>
                </select>
              </div>
            </div>
            <div class="mx-1">
              <div>
                <label>Class Year</label>
                <select class="form-control" v-model="selectedClassYear">
                  <option v-for="classYear in classYears" :key="classYear.id" :value="classYear.name">{{ classYear.name }}</option>
                </select>
              </div>
              <div>
                <label for="alumna_email">Email</label>
                <input class="form-control" type="email" id="alumna_email" name="alumna_email" v-model="alumna_email">
              </div>
              <div>
                <label for="phone">Phone</label>
                <input class="form-control" type="tel" id="phone" name="phone" v-model="phone">
              </div>
              <div>
                <label for="address">Address</label>
                <input class="form-control" type="text" id="address" name="address" v-model="address">
              </div>
              <div>
                <label for="alumna_password">Password</label>
                <input class="form-control" type="password" id="alumna_password" name="alumna_password" v-model="alumna_password">
              </div>
            </div>
          </div>
          <div class="d-flex" v-else-if="isEditing">
            <div class="mx-1">
              <div>
                <label for="alumnaID">ID Number</label>
                <input class="form-control" type="text" id="alumnaID" name="alumnaID" v-model="alumnaID">
              </div>
              <div>
                <label for="fName">First Name</label>
                <input class="form-control" type="text" id="fName" name="fName" v-model="fName">
              </div>
              <div>
                <label for="mInitial">Middle Initial</label>
                <input class="form-control" type="text" id="mInitial" name="mInitial" v-model="mInitial">
              </div>
              <div>
                <label for="lName">Last Name</label>
                <input class="form-control" type="text" id="lName" name="lName" v-model="lName">
              </div>
              <div>
                <label>Course</label>
                <select class="form-control" v-model="selectedCourse">
                    <option v-for="course in courses" :key="course.id" :value="course.name">{{ course.name }}</option>
                </select>
              </div>
            </div>
            <div class="mx-1">
              <div>
                <label>Class Year</label>
                <select class="form-control" v-model="selectedClassYear">
                    <option v-for="classYear in classYears" :key="classYear.id" :value="classYear.name">{{ classYear.name }}</option>
                </select>
              </div>
              <div>
                <label for="alumna_email">Email</label>
                <input class="form-control" type="email" id="alumna_email" name="alumna_email" v-model="alumna_email">
              </div>
              <div>
                <label for="phone">Phone</label>
                <input class="form-control" type="tel" id="phone" name="phone" v-model="phone">
              </div>
              <div>
                <label for="address">Address</label>
                <input class="form-control" type="text" id="address" name="address" v-model="address">
              </div>
              <div>
                <label for="alumna_password">Password</label>
                <input class="form-control" type="password" id="alumna_password" name="alumna_password" v-model="alumna_password">
              </div>
            </div>
          </div>
          <div v-else-if="isAddingCourse">
            <div>
              <label for="course_name">Course</label>
              <input class="form-control" type="text" id="course_name" name="course_name" v-model="course_name">
            </div>
            <div>
              <label for="major">Major</label>
              <input class="form-control" type="text" id="major" name="major" v-model="major">
            </div>
          </div>
          <div v-else-if="isAddingClassYear">
            <div>
              <label for="year">Class Year</label>
              <input class="form-control" type="text" id="year" name="year" v-model="year">
            </div>
          </div>
          <div v-else-if="isDeleteConfirmationVisible">
              <p>Are you sure you want to delete the selected item(s)?</p>
              <button @click="deleteSelected">Confirm</button>
          </div>
            <button class="btn btn-sm btn-dark mt-2" @click="submitModal">Submit</button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import { db } from '../../firebase/index.js';
import { read, utils } from 'xlsx';
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
const users = ref([]);
const searchQuery = ref('');

const filteredItems = computed(() => {
  const query = searchQuery.value.toLowerCase();
  return sortedItems.value.filter(item => {
    return (
      (typeof item.alumnaID === 'string' && item.alumnaID.toLowerCase().includes(query)) ||
      item.name.toLowerCase().includes(query)
    );
  });
});
  
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

const checkAlumnaIDExists = async (alumnaID) => {
    const querySnapshot = await getDocs(query(collection(db, 'users'), where('alumnaID', '==', alumnaID)));
    return querySnapshot.size > 0;
}

const submitModal = async () => {
    if (isAdding.value === true) {
      const alumnaIDExists = await checkAlumnaIDExists(alumnaID.value);
        if (alumnaIDExists) {
            console.error('Alumna ID already exists');
            return;
        }
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
            userlevel: 'alumni',
            status: 'active',
        };
        await addDoc(collection(db, 'users'), data);
    } else if (isEditing.value === true) {
        const selectedItem = items.value.find(item => item.alumnaID === alumnaID.value);
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

const deleteSelected = async () => {
  for (const id of selectedItems.value) {
    const docRef = doc(db, 'users', id);
    await deleteDoc(docRef);
  }
  isDeleteConfirmationVisible.value = false
  selectedItems.value = []
}

const importUsers = (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = async (e) => {
    const data = new Uint8Array(e.target.result);
    const workbook = read(data, { type: 'array' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const usersData = utils.sheet_to_json(worksheet, { header: 2 });

    for (const user of usersData) {
      const { alumnaID, fName, mInitial, lName, course, classYear, alumna_email, phone, address, alumna_password } = user;
      console.log(usersData);
      await addDoc(collection(db, 'users'), {
        alumnaID,
        fName,
        mInitial,
        lName,
        course,
        classYear,
        alumna_email,
        phone,
        address,
        alumna_password,
        userlevel: 'alumni',
        status: 'active',
      });
    }

    alert('Users imported successfully');
    fetchData();
  };
  reader.readAsArrayBuffer(file);
};

</script>
  