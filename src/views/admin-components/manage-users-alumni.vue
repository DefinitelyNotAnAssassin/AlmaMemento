<template>
  <div class="components-page-main-container p-3">
    <div class="">
      <h3 class="text-center">Alumni</h3>
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
          <button class="btn btn-sm btn-success mx-1" @click="addUser">
            Add User
          </button>
          <label class="btn btn-sm btn-dark">
            <i class="bi bi-upload"></i> Import Users
            <input
              type="file"
              style="display: none"
              @change="importUsers"
              accept=".xlsx,.xls"
            />
          </label>
        </div>
      </div>
      <table class="table table-striped">
        <thead>
          <tr>
            <th>
              <input
                type="checkbox"
                v-model="selectAllChecked"
                @click="checkAllItems"
              />
            </th>
            <th>Name</th>
            <th>ID Number</th>
            <th>
              <div class="d-flex align-items-center">
                <div class="dropdown">
                  <button
                    class="btn btn-sm dropdown-toggle"
                    type="button"
                    id="programBlockDropdown"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  ></button>
                  <ul
                    class="dropdown-menu"
                    aria-labelledby="programBlockDropdown"
                  >
                    <li v-for="pab in pabs" :key="pab.id">
                      <label class="dropdown-item">
                        <input
                          type="checkbox"
                          v-model="selectedProgramsAndBlocks"
                          :value="pab.name"
                          @click.stop
                        />
                        {{ pab.name }}
                      </label>
                    </li>
                  </ul>
                </div>
                <span class="mx-1">Program & Block</span>
                <button
                  class="btn btn-sm btn-light"
                  @click="addProgramAndBlock"
                >
                  <i class="bi bi-plus-lg"></i>
                </button>
              </div>
            </th>
            <th>
              <div class="d-flex align-items-center">
                <div class="dropdown">
                  <button
                    class="btn btn-sm dropdown-toggle"
                    type="button"
                    id="classYearDropdown"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  ></button>
                  <ul class="dropdown-menu" aria-labelledby="classYearDropdown">
                    <li v-for="year in classYears" :key="year.id">
                      <label class="dropdown-item">
                        <input
                          type="checkbox"
                          v-model="selectedClassYears"
                          :value="year.name"
                          @click.stop
                        />
                        {{ year.name }}
                      </label>
                    </li>
                  </ul>
                </div>
                <span class="mx-1">Class Year</span>
                <button class="btn btn-sm btn-light" @click="addClassYear">
                  <i class="bi bi-plus-lg"></i>
                </button>
              </div>
            </th>
            <th>Email</th>
            <th>Phone</th>
            <th>Address</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in filteredItems" :key="index">
            <td>
              <input type="checkbox" v-model="selectedItems" :value="item.id" />
            </td>
            <td>{{ item.name }}</td>
            <td>{{ item.alumnaID }}</td>
            <td>{{ item.pab }}</td>
            <td>{{ item.classYear }}</td>
            <td>{{ item.alumna_email }}</td>
            <td>{{ item.phone }}</td>
            <td>{{ item.address }}</td>
            <td>
              <button class="btn btn-sm btn-dark mx-1" @click="editItem(item)">
                <i class="bi bi-pen"></i>
              </button>
              <button class="btn btn-sm btn-danger" @click="deleteItem(index)">
                <i class="bi bi-trash3-fill"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-if="isSuccessVisible" class="modal">
        <div class="modal-content" style="width: 500px">
          <p>{{ successMessage }}</p>
        </div>
      </div>
      <div v-if="isWarningVisible" class="modal">
        <div class="modal-content" style="width: 500px">
          <p>{{ warningMessage }}</p>
        </div>
      </div>
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
                <label>Program & Block</label>
                <select class="form-control" v-model="selectedProgramAndBlock">
                  <option v-for="pab in pabs" :key="pab.id" :value="pab.name">
                    {{ pab.name }}
                  </option>
                </select>
              </div>
            </div>
            <div class="mx-1">
              <div>
                <label>Class Year</label>
                <select class="form-control" v-model="selectedClassYear">
                  <option
                    v-for="classYear in classYears"
                    :key="classYear.id"
                    :value="classYear.name"
                  >
                    {{ classYear.name }}
                  </option>
                </select>
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
          <div class="d-flex" v-else-if="isEditing">
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
                <label>Program & Block</label>
                <select class="form-control" v-model="selectedProgramAndBlock">
                  <option v-for="pab in pabs" :key="pab.id" :value="pab.name">
                    {{ pab.name }}
                  </option>
                </select>
              </div>
            </div>
            <div class="mx-1">
              <div>
                <label>Class Year</label>
                <select class="form-control" v-model="selectedClassYear">
                  <option
                    v-for="classYear in classYears"
                    :key="classYear.id"
                    :value="classYear.name"
                  >
                    {{ classYear.name }}
                  </option>
                </select>
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
          <div v-else-if="isAddingProgramAndBlock">
            <div>
              <label for="pabName">Program</label>
              <input
                class="form-control"
                type="text"
                id="pabName"
                name="pabName"
                v-model="pabName"
                placeholder="Program"
              />
            </div>
            <div>
              <label for="major">Major</label>
              <input
                class="form-control"
                type="text"
                id="major"
                name="major"
                v-model="major"
                placeholder="Major"
              />
            </div>
            <div>
              <label for="blck">Block</label>
              <input
                class="form-control"
                type="text"
                id="blck"
                name="blck"
                v-model="blck"
                placeholder="Block"
              />
            </div>
            <label for="year">Class Year</label>
            <select class="form-control" v-model="selectedClassYear">
              <option
                v-for="classYear in classYears"
                :key="classYear.id"
                :value="classYear.name"
              >
                {{ classYear.name }}
              </option>
            </select>
          </div>
          <div v-else-if="isAddingClassYear">
            <div>
              <label for="year">Class Year</label>
              <input
                class="form-control"
                type="text"
                id="year"
                name="year"
                v-model="year"
                placeholder="Class Year"
              />
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
  getDocs,
  addDoc,
  updateDoc,
  doc,
  deleteDoc,
  onSnapshot,
} from "firebase/firestore";

const items = ref([]);
const selectedItems = ref([]);
const isModalVisible = ref(false);
const isAdding = ref(false);
const isEditing = ref(false);
const isAddingProgramAndBlock = ref(false);
const isAddingClassYear = ref(false);
const isDeleteConfirmationVisible = ref(false);
const selectedProgramAndBlock = ref(null);
const selectedClassYear = ref(null);
const pabs = ref([]);
const classYears = ref([]);
const alumnaID = ref("");
const fName = ref("");
const mInitial = ref("");
const lName = ref("");
const alumna_email = ref("");
const phone = ref("");
const address = ref("");
const users = ref([]);
const searchQuery = ref("");
const selectAllChecked = ref(false);
const selectedProgramsAndBlocks = ref([]);
const selectedClassYears = ref([]);
const pabName = ref("");
const major = ref("");
const blck = ref("");
const isWarningVisible = ref(false);
const warningMessage = ref("");
const isSuccessVisible = ref(false);
const successMessage = ref("");

const filteredItems = computed(() => {
  const query = searchQuery.value.toLowerCase();
  const filtered = sortedItems.value.filter((item) => {
    const matchesSearch =
      (typeof item.alumnaID === "string" &&
        item.alumnaID.toLowerCase().includes(query)) ||
      item.name.toLowerCase().includes(query);

    const matchesProgramBlock =
      selectedProgramsAndBlocks.value.length === 0 ||
      selectedProgramsAndBlocks.value.includes(item.pab);
    const matchesClassYear =
      selectedClassYears.value.length === 0 ||
      selectedClassYears.value.includes(item.classYear);

    return matchesSearch && matchesProgramBlock && matchesClassYear;
  });

  return filtered.sort((a, b) => a.name.localeCompare(b.name));
});

const fetchData = async () => {
  const querySnapshot = await query(
    collection(db, "users"),
    where("userlevel", "==", "alumni")
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
  fetchProgramAndBlockAndClassYears();
};

const fetchProgramAndBlockAndClassYears = async () => {
  const pabsSnapshot = await query(collection(db, "pabs"));
  const pabSet = new Set();
  onSnapshot(pabsSnapshot, (snapshot) => {
    snapshot.docs.forEach((doc) => {
      const data = doc.data();
      let name;
      if (data.major === "N/A" || !data.major) {
        name = `${data.program} - Block ${data.blck}`;
      } else {
        name = `${data.program} Major in ${data.major} - Block ${data.blck}`;
      }
      pabSet.add(name);
    });
    pabs.value = Array.from(pabSet)
      .map((name) => ({ name }))
      .sort((a, b) => a.name.localeCompare(b.name));
  });

  const classYearsSnapshot = await query(collection(db, "classYears"));
  onSnapshot(classYearsSnapshot, (snapshot) => {
    classYears.value = snapshot.docs
      .map((doc) => ({ id: doc.id, name: doc.data().name }))
      .sort((a, b) => a.name.localeCompare(b.name)); // Sort alphabetically
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
  selectedProgramAndBlock.value = null;
  selectedClassYear.value = null;
  alumna_email.value = "";
  phone.value = "";
  address.value = "";
};

const addProgramAndBlock = () => {
  isModalVisible.value = true;
  isAddingProgramAndBlock.value = true;

  pabName.value = "";
  major.value = "";
  blck.value = "";
  selectedClassYear.value = null;
};

const addClassYear = () => {
  isModalVisible.value = true;
  isAddingClassYear.value = true;
};

const confirmDelete = () => {
  isModalVisible.value = true;
  isDeleteConfirmationVisible.value = true;
};

const closeModal = () => {
  isModalVisible.value = false;
  isAdding.value = false;
  isEditing.value = false;
  isAddingProgramAndBlock.value = false;
  isAddingClassYear.value = false;
  isDeleteConfirmationVisible.value = false;
};

const checkAlumnaIDExists = async (alumnaID) => {
  const querySnapshot = await getDocs(
    query(collection(db, "users"), where("alumnaID", "==", alumnaID))
  );
  return querySnapshot.size > 0;
};

const checkClassYearExists = async (year) => {
  const querySnapshot = await getDocs(
    query(collection(db, "classYears"), where("name", "==", year))
  );
  return querySnapshot.size > 0;
};

const hideMessages = () => {
  isSuccessVisible.value = false;
  isWarningVisible.value = false;
};

const showSuccessPopup = (message) => {
  successMessage.value = message;
  isSuccessVisible.value = true;
  setTimeout(hideMessages, 3000);
};

const showWarningPopup = (message) => {
  warningMessage.value = message;
  isWarningVisible.value = true;
  setTimeout(hideMessages, 3000);
};

const submitModal = async () => {
  if (isAdding.value === true) {
    const alumnaIDExists = await checkAlumnaIDExists(alumnaID.value);
    if (alumnaIDExists) {
      showWarningPopup("Alumna ID already exists!");
      return;
    }

    const lastName = lName.value;
    const last4Digits = alumnaID.value.slice(-4);
    const alumna_password = `${lastName}${last4Digits}`;

    const data = {
      alumnaID: alumnaID.value,
      fName: fName.value,
      mInitial: mInitial.value,
      lName: lName.value,
      pab: selectedProgramAndBlock.value,
      classYear: selectedClassYear.value,
      alumna_email: alumna_email.value,
      phone: phone.value,
      address: address.value,
      alumna_password: alumna_password,
      userlevel: "alumni",
      status: "active",
    };
    await addDoc(collection(db, "users"), data);
  } else if (isEditing.value === true) {
    const selectedItem = items.value.find(
      (item) => item.alumnaID === alumnaID.value
    );
    if (selectedItem) {
      const docRef = doc(db, "users", selectedItem.id);
      const lastName = lName.value;
      const last4Digits = alumnaID.value.slice(-4);
      const alumna_password = `${lastName}${last4Digits}`;
      await updateDoc(docRef, {
        alumnaID: alumnaID.value,
        fName: fName.value,
        mInitial: mInitial.value,
        lName: lName.value,
        pab: selectedProgramAndBlock.value,
        classYear: selectedClassYear.value,
        alumna_email: alumna_email.value,
        phone: phone.value,
        address: address.value,
        alumna_password: alumna_password,
      });
    } else {
      showWarningPopup("Selected item not found");
    }
  } else if (isAddingProgramAndBlock.value === true) {
    const programBlockExists = await checkProgramBlockExist(
      pabName.value,
      major.value,
      blck.value,
      selectedClassYear.value
    );
    if (programBlockExists) {
      showWarningPopup("Program, Major, Block for that year exists");
      return;
    }
    let name;
    if (major.value === "N/A" || !major.value) {
      name = `${pabName.value} - Block ${blck.value}`;
    } else {
      name = `${pabName.value} Major in ${major.value} - Block ${blck.value}`;
    }
    const data = {
      program: pabName.value,
      major: major.value,
      blck: blck.value,
      year: selectedClassYear.value,
    };
    const subForData = {
      name: name,
      year: selectedClassYear.value,
      type: "pab",
    };
    const subFolder = {
      name: "Graduation Portrait",
      parentFolder: name,
      year: selectedClassYear.value,
      type: "subfolder",
    };
    await addDoc(collection(db, "pabs"), data);
    await addDoc(collection(db, "subfolders"), subForData);
    await addDoc(collection(db, "subfolders"), subFolder);
  } else if (isAddingClassYear.value == true) {
    const yearExists = await checkClassYearExists(year.value);
    if (yearExists) {
      showWarningPopup("Class year already exists");
      return;
    }
    const data = {
      name: year.value,
    };
    await addDoc(collection(db, "classYears"), data);
    await addDoc(collection(db, "folders"), data);
  }
  showSuccessPopup("Data has been added successfully!");
  closeModal();
};

const checkProgramBlockExist = async (program, major, block, year) => {
  const querySnapshot = await getDocs(
    query(
      collection(db, "pabs"),
      where("program", "==", program),
      where("major", "==", major),
      where("blck", "==", block),
      where("year", "==", year)
    )
  );
  return querySnapshot.size > 0;
};

const editItem = (selectedItem) => {
  isModalVisible.value = true;
  isEditing.value = true;

  alumnaID.value = selectedItem.alumnaID;
  fName.value = selectedItem.fName;
  mInitial.value = selectedItem.mInitial;
  lName.value = selectedItem.lName;
  selectedProgramAndBlock.value = selectedItem.pab;
  selectedClassYear.value = selectedItem.classYear;
  alumna_email.value = selectedItem.alumna_email;
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

const importUsers = (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = async (e) => {
    const data = new Uint8Array(e.target.result);
    const workbook = read(data, { type: "array" });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const usersData = utils.sheet_to_json(worksheet, { header: 2 });

    for (const user of usersData) {
      const {
        alumnaID,
        fName,
        mInitial,
        lName,
        pab,
        classYear,
        alumna_email,
        phone,
        address,
      } = user;
      const lastName = lName; // assuming lName is the last name field
      const last4Digits = alumnaID.slice(-4);
      const alumna_password = `${lastName}${last4Digits}`;

      await addDoc(collection(db, "users"), {
        alumnaID,
        fName,
        mInitial,
        lName,
        pab,
        classYear,
        alumna_email,
        phone,
        address,
        alumna_password,
        userlevel: "alumni",
        status: "active",
      });
    }

    alert("Users imported successfully");
    fetchData();
  };
  reader.readAsArrayBuffer(file);
};
</script>
