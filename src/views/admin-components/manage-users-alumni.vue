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
          <button class="btn btn-sm btn-success mx-1 mt-2 mb-2" @click="addUser">
            Add User
          </button>
          <label class="btn btn-sm btn-dark mt-2 mb-2">
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
      <table class="table table-hover">
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
                <span class="mx-1">Program & Block</span>
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
              </div>
            </th>
            <th>
              <div class="d-flex align-items-center">
                <span class="mx-1">Class Year</span>
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
              <button class="btn btn-sm btn-danger" @click="deleteItem(item)">
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
                  v-on:keypress="LetterOnly($event)"
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
                  v-on:keypress="LetterOnly($event)"
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
                  v-on:keypress="LetterOnly($event)"
                />
              </div>
              <div>
                <label>Program</label>
                <input
                  class="form-control"
                  type="text"
                  id="pabName"
                  name="pabName"
                  v-model="pabName"
                />
              </div>
              <div>
                <label>Major</label>
                <input
                  class="form-control"
                  type="text"
                  id="major"
                  name="major"
                  v-model="major"
                />
              </div>
            </div>
            <div class="mx-1">
              <div>
                <label>Block</label>
                <input
                  class="form-control"
                  type="text"
                  id="blck"
                  name="blck"
                  v-model="blck"
                />
              </div>
              <div>
                <label>Class Year</label>
                <input
                  class="form-control"
                  type="text"
                  id="year"
                  name="year"
                  v-model="year"
                  v-on:keypress="NumberWithDash($event)"
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
              <div>
                <label for="phone">Phone</label>
                <input
                  class="form-control"
                  type="tel"
                  id="phone"
                  name="phone"
                  v-model="phone"
                  placeholder="Phone"
                  v-on:keypress="NumberOnly($event)"
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
              <div v-if="false">
                <label for="bio">Bio</label>
                <input
                  class="form-control"
                  type="text"
                  id="bio"
                  name="bio"
                  v-model="bio"
                  placeholder="Bio"
                  maxlength="50"
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
                  disabled
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
                  v-on:keypress="LetterOnly($event)"
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
                  v-on:keypress="LetterOnly($event)"
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
                  v-on:keypress="LetterOnly($event)"
                />
              </div>
              <div>
                <label>Program</label>
                <input
                  class="form-control"
                  type="text"
                  id="pabName"
                  name="pabName"
                  v-model="pabName"
                />
              </div>
            </div>
            <div class="mx-1">
              <div>
                <label>Class Year</label>
                <input
                  class="form-control"
                  type="text"
                  id="year"
                  name="year"
                  v-model="year"
                  v-on:keypress="NumberWithDash($event)"
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
              <div>
                <label for="phone">Phone</label>
                <input
                  class="form-control"
                  type="tel"
                  id="phone"
                  name="phone"
                  v-model="phone"
                  placeholder="Phone"
                  v-on:keypress="NumberOnly($event)"
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
              <div v-if="false">
                <label for="bio">Bio</label>
                <input
                  class="form-control"
                  type="text"
                  id="bio"
                  name="bio"
                  v-model="bio"
                  placeholder="Bio"
                  maxlength="50"
                />
              </div>
            </div>
          </div>
          <div v-else-if="isDeleteConfirmationVisible">
            <p>Are you sure you want to delete the selected item(s)?</p>
            <button class="btn btn-sm btn-dark mt-2" @click="deleteSelected">
              Confirm
            </button>
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
import { useQuasar } from "quasar";
import { LetterOnly, NumberOnly, NumberWithDash } from "@/Utils/KeyPressRole.js";

const items = ref([]);
const selectedItems = ref([]);
const isModalVisible = ref(false);
const isAdding = ref(false);
const isEditing = ref(false);
const isDeleteConfirmationVisible = ref(false);
const pabs = ref([]);
const classYears = ref([]);
const alumnaID = ref("");
const fName = ref("");
const mInitial = ref("");
const lName = ref("");
const alumna_email = ref("");
const phone = ref("");
const address = ref("");
const bio = ref("");
const users = ref([]);
const searchQuery = ref("");
const selectAllChecked = ref(false);
const selectedProgramsAndBlocks = ref([]);
const selectedClassYears = ref([]);
const pabName = ref("");
const major = ref("");
const blck = ref("");
const year = ref("");
const isWarningVisible = ref(false);
const warningMessage = ref("");
const isSuccessVisible = ref(false);
const successMessage = ref("");
const $q = useQuasar()

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
  const pabsSnapshot = await query(collection(db, "users"));
   onSnapshot(pabsSnapshot, (snapshot) => {
    const pabData = snapshot.docs.map((doc) => ({
    id: doc.id,
    name: doc.data()?.pab || "", 
    }));

    const filteredPabData = pabData.filter((entry) => entry.name);

    const uniquePabData = Array.from(new Set(filteredPabData.map(entry => entry.name)))
      .map(name => filteredPabData.find(entry => entry.name === name));

    const sortedPabData = uniquePabData.sort((a, b) => a.name.localeCompare(b.name));

    pabs.value = sortedPabData;
    // pabs.value = snapshot.docs
    //   .map((doc) => ({ id: doc.id, name: doc?.pab }))
    //   .sort((a, b) => a?.pab.localeCompare(b?.pab));
  });

  const classYearsSnapshot = await query(collection(db, "users"));
  onSnapshot(classYearsSnapshot, (snapshot) => {
    const classYearData = snapshot.docs.map((doc) => ({
    id: doc.id,
    name: doc.data()?.classYear || "", 
    }));

    const filteredClassYearData = classYearData.filter((entry) => entry.name);

    // Use Set to ensure unique values
    const uniqueClassYearData = Array.from(new Set(filteredClassYearData.map(entry => entry.name)))
      .map(name => filteredClassYearData.find(entry => entry.name === name));

    const sortedClassYearData = uniqueClassYearData.sort((a, b) => a.name.localeCompare(b.name));

    classYears.value = sortedClassYearData;
    // classYears.value = snapshot.docs
    //   .map((doc) => ({ id: doc.id, name: doc.data().name }))
    //   .sort((a, b) => a.name.localeCompare(b.name));
  });
};

const syncData = async () => {
  const userPabs = new Set(items.value.map((user) => user.pab));
  const userClassYears = new Set(items.value.map((user) => user.classYear));

  const existingPabsSnapshot = await getDocs(collection(db, "pabs"));
  const existingPabs = existingPabsSnapshot.docs.map((doc) => doc.data().name);

  const existingClassYearsSnapshot = await getDocs(
    collection(db, "classYears")
  );
  const existingClassYears = existingClassYearsSnapshot.docs.map(
    (doc) => doc.data().name
  );

  for (const pab of Array.from(userPabs)) {
    if (!existingPabs.includes(pab)) {
      await addDoc(collection(db, "pabs"), { name: pab });
    }
  }

  for (const year of Array.from(userClassYears)) {
    if (!existingClassYears.includes(year)) {
      await addDoc(collection(db, "classYears"), { name: year });
    }
  }

  for (const pab of existingPabs) {
    if (!userPabs.has(pab)) {
      const subfoldersQuery = query(
        collection(db, "subfolders"),
        where("name", "==", pab)
      );
      const subfoldersSnapshot = await getDocs(subfoldersQuery);
      const hasSubfolders = !subfoldersSnapshot.empty;

      if (!hasSubfolders) {
        const docRef = doc(
          db,
          "pabs",
          existingPabsSnapshot.docs.find((doc) => doc.data().name === pab).id
        );
        await deleteDoc(docRef);
      } else {
        console.log(
          `PAB ${pab} is referenced in subfolders and cannot be deleted.`
        );
      }
    }
  }

  for (const year of existingClassYears) {
    if (!userClassYears.has(year)) {
      const foldersQuery = query(
        collection(db, "folders"),
        where("name", "==", year)
      );
      const foldersSnapshot = await getDocs(foldersQuery);
      const hasFolders = !foldersSnapshot.empty;

      if (!hasFolders) {
        const docRef = doc(
          db,
          "classYears",
          existingClassYearsSnapshot.docs.find(
            (doc) => doc.data().name === year
          ).id
        );
        await deleteDoc(docRef);
      } else {
        console.log(
          `Class year ${year} is referenced in folders and cannot be deleted.`
        );
      }
    }
  }
};

watch(items, syncData, { deep: true });

onMounted(fetchData);

const addUser = () => {
  isModalVisible.value = true;
  isAdding.value = true;

  alumnaID.value = "";
  fName.value = "";
  mInitial.value = "";
  lName.value = "";
  pabName.value = "";
  major.value = "";
  blck.value = "";
  year.value = "";
  alumna_email.value = "";
  phone.value = "";
  address.value = "";
  bio.value = "";
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
    const programBlockExists = await checkProgramBlockExist(
      pabName.value,
      major.value,
      blck.value,
      year.value
    );
    const yearExists = await checkClassYearExists(year.value);

    if (alumnaIDExists) {
      showWarningPopup("Alumna ID already exists!");
      return;
    }

    let name;
    if (major.value === "N/A" || !major.value) {
      name = `${pabName.value} - Block ${blck.value}`;
    } else {
      name = `${pabName.value} Major in ${major.value} - Block ${blck.value}`;
    }

    const lastName = lName.value;
    const last4Digits = alumnaID.value.slice(-4);
    const alumna_password = `${lastName}${last4Digits}`;

    const userData = {
      alumnaID: alumnaID.value,
      fName: fName.value,
      mInitial: mInitial.value + ".",
      lName: lName.value,
      pab: name,
      classYear: year.value,
      alumna_email: alumna_email.value,
      phone: phone.value,
      address: address.value,
      alumna_password: alumna_password,
      userlevel: "alumni",
      status: "active",
      bio: bio.value
    };

    try {
      await addDoc(collection(db, "users"), userData);

      if (!yearExists) {
        const yearData = { name: year.value };
        await addDoc(collection(db, "folders"), yearData);
      }

      if (!programBlockExists) {
        const subForData = {
          name: name,
          year: year.value,
          type: "pab",
        };
        const subFolder = {
          name: "Graduation Portrait",
          parentFolder: name,
          year: year.value,
          type: "subfolder",
        };
        await addDoc(collection(db, "subfolders"), subForData);
        await addDoc(collection(db, "subfolders"), subFolder);
      }
      showSuccessPopup("Data has been successfully saved!");
    } catch (error) {
      showWarningPopup("Error saving data: " + error.message);
    }
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
        fName: fName.value,
        mInitial: mInitial.value,
        lName: lName.value,
        pab: pabName.value,
        classYear: year.value,
        alumna_email: alumna_email.value,
        phone: phone.value,
        address: address.value,
        alumna_password: alumna_password,
        bio: bio.value
      });
    } else {
      showWarningPopup("Selected item not found");
    }
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
  pabName.value = selectedItem.pab;
  year.value = selectedItem.classYear;
  alumna_email.value = selectedItem.alumna_email;
  phone.value = selectedItem.phone;
  address.value = selectedItem.address;
  bio.value = selectedItem.bio
};

const deleteItem = async (item) => {
  const docRef = doc(db, "users", item.id);
  await deleteDoc(docRef);

  const index = items.value.findIndex((i) => i.id === item.id);
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
  try {
    const file = event.target.files[0];
    if (!file) return;

      const reader = new FileReader();
      reader.onload = async (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const usersData = utils.sheet_to_json(worksheet, { header: 2 });

      // Check for duplicate alumnaIDs

        // Assuming db is your Firestore database instance
        const usersCollection = collection(db, "users");

    // Get all documents in the users collection
    const querySnapshot = await getDocs(usersCollection);

    // Get all alumnaIDs
        const alumnaIDs = new Set(querySnapshot.docs.map(doc => doc.data().alumnaID));

      let hasDuplicates = false;
     

    
    

      // No duplicates, proceed with importing
      for (const user of usersData) {

        for (const user of usersData) {
        const { ID_Number } = user;
        let isFound = false;
        if (alumnaIDs.has(String(ID_Number))) {
          
          $q.dialog({ title: "Error", message: "Duplicate alumnaIDs found " + ID_Number });
          hasDuplicates = true;
          break;
        }
        
      }

      if (hasDuplicates) continue;

        const {
          ID_Number: alumnaID,
          First_Name: fName,
          Middle_Initial: mInitial,
          Last_Name: lName,
          Program_and_Block: pab,
          Class_Year: classYear,
          Email: alumna_email,
          Phone: phone,
          Address: address,
          Bio: bio
        } = user;

        await addDoc(collection(db, "users"), {
          alumnaID: String(alumnaID),
          fName,
          mInitial,
          lName,
          pab: pab || "",
          classYear: String(classYear) || "",
          alumna_email: alumna_email || "",
          phone: String(phone) || "",
          address: String(address) || "",
          alumna_password: "",
          userlevel: "alumni",
          status: "active",
          bio: bio || ""
        });
      }

      $q.dialog({ title: "Success", message: "Users imported successfully" });
      fetchData();
    };
    reader.readAsArrayBuffer(file);
  } catch (error) {
    $q.dialog({ title: "Error", message: error.message });
  }
};

</script>
