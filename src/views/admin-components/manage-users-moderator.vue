<template>
  <div class="components-page-main-container p-3">
    <div class="">
      <h3 class="text-center">Moderator</h3>
      <div class="container d-flex flex-column align-items-end">
        <input
          class="search-bar form-control"
          style="width: 250px"
          type="text"
          v-model="searchQuery"
          placeholder="Search by ID or Name"
        />
        <div>
          <button
            class="btn btn-sm btn-danger mx-1"
            v-if="selectedItems.length > 0"
            @click="confirmDelete"
          >
            Delete
          </button>
          <button class="btn btn-sm btn-success mx-1 mt-2 mb-2" @click="addUser">
            Add User
          </button>
        </div>
      </div>
      <table class="table table-hover">
        <thead class="table-success">
          <tr>
            <th>
              <input
                type="checkbox"
                v-model="selectAllChecked"
                @click="checkAllItems"
              />
            </th>
            <th>Name</th>
            <th>Moderator ID</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Address</th>
            <th>Year of Moderatorship</th>
            <th>Actions</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in filteredItems" :key="index">
            <td>
              <input type="checkbox" v-model="selectedItems" :value="item.id" />
            </td>
            <td>{{ item.name }}</td>
            <td>{{ item.alumnaID }}</td>
            <td>{{ item.alumna_email }}</td>
            <td>{{ item.phone }}</td>
            <td>{{ item.address }}</td>
            <td>{{ item.yearAppointed }}</td>
            <td>
              <button class="btn btn-sm btn-dark mx-1" @click="editItem(item)">
                <i class="bi bi-pen"></i>
              </button>
              <button class="btn btn-sm btn-danger" @click="deleteItem(index)">
                <i class="bi bi-trash3-fill"></i>
              </button>
            </td>
            <td>
              <button
                class="btn btn-sm btn-danger"
                v-if="item.status === 'active'"
                @click="changeStatus(item.id, 'inactive')"
              >
                Deactivate
              </button>
              <button
                class="btn btn-sm btn-success"
                v-else
                @click="changeStatus(item.id, 'active')"
              >
                Activate
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-if="isModalVisible" class="modal">
        <div class="modal-content" style="width: 500px">
          <span class="close" @click="closeModal">&times;</span>
          <div v-if="isAdding" class="d-flex">
            <div class="mx-1">
              <div>
                <label for="alumnaID">ID Number</label>
                <input
                  class="form-control"
                  type="text"
                  id="alumnaID"
                  name="alumnaID"
                  v-model="alumnaID"
                  placeholder="ID Number"
                />
              </div>
              <div>
                <label for="fName">First Name</label>
                <input
                  class="form-control"
                  type="text"
                  id="fName"
                  name="fName"
                  v-model="fName"
                  placeholder="First Name"
                />
              </div>
              <div>
                <label for="mInitial">Middle Initial</label>
                <input
                  class="form-control"
                  type="text"
                  id="mInitial"
                  name="mInitial"
                  v-model="mInitial"
                  placeholder="Middle Initial"
                />
              </div>
              <div>
                <label for="lName">Last Name</label>
                <input
                  class="form-control"
                  type="text"
                  id="lName"
                  name="lName"
                  v-model="lName"
                  placeholder="Last Name"
                />
              </div>
              <div>
                <label for="alumna_email">Email</label>
                <input
                  class="form-control"
                  type="email"
                  id="alumna_email"
                  name="alumna_email"
                  v-model="alumna_email"
                  placeholder="Email"
                />
              </div>
            </div>
            <div class="mx-1">
              <div>
                <label for="alumna_password">Password</label>
                <input
                  class="form-control"
                  type="password"
                  id="alumna_password"
                  name="alumna_password"
                  v-model="alumna_password"
                  placeholder="Password"
                />
              </div>
              <div>
                <label for="phone">Phone</label>
                <input
                  class="form-control"
                  type="tel"
                  id="phone"
                  name="phone"
                  v-model="phone"
                  placeholder="Phone"
                />
              </div>
              <div>
                <label for="address">Address</label>
                <input
                  class="form-control"
                  type="text"
                  id="address"
                  name="address"
                  v-model="address"
                  placeholder="Address"
                />
              </div>
            </div>
          </div>
          <div v-else-if="isEditing" class="d-flex">
            <div class="mx-1">
              <div>
                <label for="alumnaID">ID Number</label>
                <input
                  class="form-control"
                  type="text"
                  id="alumnaID"
                  name="alumnaID"
                  v-model="alumnaID"
                  placeholder="ID Number"
                />
              </div>
              <div>
                <label for="fName">First Name</label>
                <input
                  class="form-control"
                  type="text"
                  id="fName"
                  name="fName"
                  v-model="fName"
                  placeholder="First Name"
                />
              </div>
              <div>
                <label for="mInitial">Middle Initial</label>
                <input
                  class="form-control"
                  type="text"
                  id="mInitial"
                  name="mInitial"
                  v-model="mInitial"
                  placeholder="Middle Initial"
                />
              </div>
              <div>
                <label for="lName">Last Name</label>
                <input
                  class="form-control"
                  type="text"
                  id="lName"
                  name="lName"
                  v-model="lName"
                  placeholder="Last Name"
                />
              </div>
              <div>
                <label for="alumna_email">Email</label>
                <input
                  class="form-control"
                  type="email"
                  id="alumna_email"
                  name="alumna_email"
                  v-model="alumna_email"
                  placeholder="Email"
                />
              </div>
            </div>
            <div class="mx-1">
              <!---<div>
                <label for="alumna_password">Password</label>
                <input
                  class="form-control"
                  type="password"
                  id="alumna_password"
                  name="alumna_password"
                  v-model="alumna_password"
                  placeholder="Password"
                />
              </div>-->
              <div>
                <label for="phone">Phone</label>
                <input
                  class="form-control"
                  type="tel"
                  id="phone"
                  name="phone"
                  v-model="phone"
                  placeholder="Phone"
                />
              </div>
              <div>
                <label for="address">Address</label>
                <input
                  class="form-control"
                  type="text"
                  id="address"
                  name="address"
                  v-model="address"
                  placeholder="Address"
                />
              </div>
            </div>
          </div>
          <div v-else-if="isDeleteConfirmationVisible">
            <p>Are you sure you want to delete the selected item(s)?</p>
            <button @click="deleteSelected">Confirm</button>
          </div>
          <div v-if="!isDeleteConfirmationVisible">
            <button class="btn btn-sm btn-dark mt-2" @click="submitModal">
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from "vue";
import { db } from "../../firebase/index.js";
import { read, utils } from "xlsx";
import {
  collection,
  query,
  where,
  addDoc,
  updateDoc,
  doc,
  deleteDoc,
  onSnapshot,
  getDocs,
} from "firebase/firestore";

const items = ref([]);
const selectedItems = ref([]);
const isModalVisible = ref(false);
const isAdding = ref(false);
const isEditing = ref(false);
const isDeleteConfirmationVisible = ref(false);
const alumnaID = ref("");
const fName = ref("");
const mInitial = ref("");
const lName = ref("");
const alumna_email = ref("");
const alumna_password = ref("");
const phone = ref("");
const address = ref("");
const yearAppointed = ref(new Date().getFullYear().toString());
const selectAllChecked = ref(false);
const searchQuery = ref("");

const filteredItems = computed(() => {
  const query = searchQuery.value.toLowerCase();
  return sortedItems.value.filter((item) => {
    return (
      item.alumnaID.toLowerCase().includes(query) ||
      item.name.toLowerCase().includes(query)
    );
  });
});

const fetchData = async () => {
  const querySnapshot = await query(
    collection(db, "users"),
    where("userlevel", "==", "moderator")
  );
  onSnapshot(querySnapshot, (snapshot) => {
    items.value = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        ...data,
        id: doc.id,
        name: `${data.lName}, ${data.fName}`,
      };
    });
  });
};

onMounted(fetchData);

const addUser = () => {
  isModalVisible.value = true;
  isAdding.value = true;

  alumnaID.value = "";
  fName.value = "";
  mInitial.value = "";
  lName.value = "";
  alumna_email.value = "";
  alumna_password.value = "";
  phone.value = "";
  address.value = "";
};

const confirmDelete = () => {
  isModalVisible.value = true;
  isDeleteConfirmationVisible.value = true;
};

const closeModal = () => {
  isModalVisible.value = false;
  isAdding.value = false;
  isEditing.value = false;
  isDeleteConfirmationVisible.value = false;
};

const checkAlumnaIDExists = async (alumnaID) => {
  const querySnapshot = await getDocs(
    query(collection(db, "users"), where("alumnaID", "==", alumnaID))
  );
  return querySnapshot.size > 0;
};

const submitModal = async () => {
  if (isAdding.value === true) {
    const alumnaIDExists = await checkAlumnaIDExists(alumnaID.value);
    if (alumnaIDExists) {
      console.error("Alumna ID already exists");
      return;
    }
    const data = {
      alumnaID: alumnaID.value,
      fName: fName.value,
      mInitial: mInitial.value,
      lName: lName.value,
      alumna_email: alumna_email.value,
      alumna_password: alumna_password.value,
      phone: phone.value,
      address: address.value,
      yearAppointed: yearAppointed.value,
      userlevel: "moderator",
      status: "active",
    };
    await addDoc(collection(db, "users"), data);
  } else if (isEditing.value === true) {
    const selectedItem = items.value.find(
      (item) => item.alumnaID === alumnaID.value
    );
    console.log();
    if (selectedItem) {
      const docRef = doc(db, "users", selectedItem.id);
      await updateDoc(docRef, {
        alumnaID: alumnaID.value,
        fName: fName.value,
        mInitial: mInitial.value,
        lName: lName.value,
        alumna_email: alumna_email.value,
        alumna_password: alumna_password.value,
        phone: phone.value,
        address: address.value,
      });
    } else {
      console.error("Selected item not found");
    }
  }
  closeModal();
};

const editItem = (selectedItem) => {
  isModalVisible.value = true;
  isEditing.value = true;

  alumnaID.value = selectedItem.alumnaID;
  fName.value = selectedItem.fName;
  mInitial.value = selectedItem.mInitial;
  lName.value = selectedItem.lName;
  alumna_email.value = selectedItem.alumna_email;
  alumna_password.value = selectedItem.alumna_password;
  phone.value = selectedItem.phone;
  address.value = selectedItem.address;
};

const deleteItem = async (index) => {
  const selectedItem = items.value[index];
  if (!selectedItem) return;

  const docRef = doc(db, "users", selectedItem.id);
  await deleteDoc(docRef);

  items.value.splice(index, 1);
};

const sortedItems = ref([]);
watch(items, () => {
  sortedItems.value = [...items.value].sort((a, b) =>
    a.name.localeCompare(b.name)
  );
});

const deleteSelected = async () => {
  for (const id of selectedItems.value) {
    const docRef = doc(db, "users", id);
    await deleteDoc(docRef);
  }
  isDeleteConfirmationVisible.value = false;
  selectedItems.value = [];
  selectAllChecked.value = false;
};

const checkAllItems = (event) => {
  const isChecked = event.target.checked;
  if (isChecked) {
    selectedItems.value = filteredItems.value.map((item) => item.id);
  } else {
    selectedItems.value = [];
  }
  selectAllChecked.value = isChecked;
};

const changeStatus = async (userId, status) => {
  const docRef = doc(db, "users", userId);
  await updateDoc(docRef, { status });
};
</script>
