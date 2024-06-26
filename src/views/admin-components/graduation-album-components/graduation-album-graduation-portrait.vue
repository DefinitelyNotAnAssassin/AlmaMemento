<template>
  <div class="components-page-main-container p-3 photo-album">
    <div class="text-center">
      <h4>{{ props.gradsubfolderName }}</h4>
      <h3>
        {{ props.subfolderName }} - {{ props.folderName }}
      </h3>
    </div>
    <div class="d-flex justify-content-between">
      <button class="btn btn-sm btn-dark mx-1" @click="backToGrad">
        <i class="bi bi-arrow-return-left"></i>
      </button>
      <button class="btn btn-sm btn-success mx-1" @click="openModal">
        Add Photo
      </button>
    </div>

    <div class="d-flex flex-column align-items-center" style="font-size: 12px">
      <div class="adviser-container">
        <div class="image-container wh-150px p-0" style="position: relative">
          <img
            class="wh-150px m-0"
            style="cursor: pointer"
            v-if="adviserImageUrl"
            :src="adviserImageUrl"
            alt="Adviser Image"
            @click="openImageModal(adviserImageUrl)"
          />
          <button
            class="btn btn-sm btn-light btn-togglemenu"
            @click="toggleAdviserMenu"
          >
            <i class="bi bi-list"></i>
          </button>
          <div v-if="showAdviserMenu" class="bg-light p-1 menu-container">
            <button class="btn btn-sm" @click="editAdviser(adviser)">
              Edit
            </button>
            <button class="btn btn-sm" @click="deleteAdviser">Delete</button>
          </div>
        </div>
        <div class="text-center mt-1">
          <span v-if="adviserName">
            <div>{{ adviserName }}</div>
            <div>Adviser</div>
          </span>
        </div>
      </div>
    </div>

    <div class="students-container d-flex flex-wrap">
      <div
        class="student-container m-2"
        v-for="student in sortedStudents"
        :key="student.id"
      >
        <div class="image-container wh-150px p-0" style="position: relative">
          <img
            class="wh-150px m-0"
            style="cursor: pointer"
            :src="student.imageUrl"
            alt="Student Image"
            @click="openImageModal(student.imageUrl)"
          />
          <button
            class="btn btn-sm btn-light btn-togglemenu"
            @click="toggleStudentMenu(student.id)"
          >
            <i class="bi bi-list"></i>
          </button>
          <div
            v-if="showStudentMenu === student.id"
            class="bg-light p-1 menu-container"
          >
            <button class="btn btn-sm" @click="editStudent(student)">
              Edit
            </button>
            <button class="btn btn-sm" @click="deleteStudent(student.id)">
              Delete
            </button>
          </div>
        </div>
        <div class="text-center" style="width: 150px; font-size: 12px">
          <div class="bg-dark text-light">{{ student.name }}</div>
          <div v-if="student.address">{{ student.address }}</div>
          <div style="height: 30px; overflow-y: auto" v-if="student.quotes">
            <p class="" style="word-wrap: break-word">
              {{ student.quotes }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <div v-if="isModalOpen" class="modal">
      <div class="modal-content">
        <span @click="closeModal" class="close">&times;</span>
        <h5 class="text-center">Upload Image</h5>
        <div class="mt-3">
          <input
            class="form-control"
            type="file"
            @change="uploadImage"
            accept="image/*"
            ref="imageInput"
          />
          <div>
            <label for="role">Role:</label>
            <select class="form-control" id="role" v-model="selectedRole">
              <option value="adviser" :disabled="isAdviserDisabled">
                Adviser
              </option>
              <option value="student">Student</option>
            </select>
          </div>
          <div>
            <label for="name">Name:</label>
            <input
              class="form-control"
              type="text"
              id="name"
              v-model="nameInput"
            />
          </div>
          <div>
            <label for="address" v-if="selectedRole === 'student'"
              >Address:</label
            >
            <input
              class="form-control"
              type="text"
              id="address"
              v-model="addressInput"
              v-if="selectedRole === 'student'"
            />
          </div>
          <div>
            <label for="quotes" v-if="selectedRole === 'student'"
              >Quotes:</label
            >
            <input
              class="form-control"
              type="text"
              id="quotes"
              v-model="quotesInput"
              v-if="selectedRole === 'student'"
            />
          </div>
          <button
            @click="uploadData"
            class="upload-button btn btn-sm btn-success"
          >
            Upload
          </button>
        </div>
      </div>
    </div>

    <div v-if="isOpen" class="modal">
      <div class="modal-content">
        <span @click="closeImageModal" class="close">&times;</span>
        <img
          :src="imageUrl"
          alt="Preview Image"
          style="max-width: 100%; max-height: 80vh"
        />
      </div>
    </div>

    <div v-if="isAdviserModalOpen" class="modal">
      <div class="modal-content">
        <span @click="closeAdviserModal" class="close">&times;</span>
        <h5 class="text-center">Edit Adviser</h5>
        <div class="mt-3">
          <div>
            <label for="adviserName">Name:</label>
            <input
              class="form-control"
              type="text"
              id="adviserName"
              v-model="editedAdviserName"
            />
          </div>
          <div>
            <label for="adviserImage">Image:</label>
            <input
              class="form-control"
              type="file"
              id="adviserImage"
              ref="adviserImageInput"
              @change="uploadAdviserImage"
              accept="image/*"
            />
          </div>
          <div class="text-center">
            <button
              @click="saveAdviserChanges"
              class="upload-button btn btn-sm btn-success"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="isStudentModalOpen" class="modal">
      <div class="modal-content">
        <span @click="closeStudentModal" class="close">&times;</span>
        <h5 class="text-center">Edit Student</h5>
        <div class="mt-3">
          <div>
            <label for="studentName">Name:</label>
            <input
              class="form-control"
              type="text"
              id="studentName"
              v-model="editedStudentName"
            />
          </div>
          <div>
            <label for="studentAddress">Address:</label>
            <input
              class="form-control"
              type="text"
              id="studentAddress"
              v-model="editedStudentAddress"
            />
          </div>
          <div>
            <label for="studentQuotes">Quotes:</label>
            <input
              class="form-control"
              type="text"
              id="studentQuotes"
              v-model="editedStudentQuotes"
            />
          </div>
          <div>
            <label for="studentImage">Image:</label>
            <input
              class="form-control"
              type="file"
              id="studentImage"
              ref="studentImageInput"
              @change="uploadStudentImage"
              accept="image/*"
            />
          </div>
          <div class="text-center">
            <button
              @click="saveStudentChanges"
              class="upload-button btn btn-sm btn-success"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="isDeleteAdviserModalOpen" class="modal">
      <div class="modal-content">
        <span @click="closeDeleteAdviserModal" class="close">&times;</span>
        <h5 class="text-center">Delete Adviser</h5>
        <div class="mt-3">
          <p>Are you sure you want to delete?</p>
          <div class="text-center">
            <button
              @click="deleteAdviserNow"
              class="upload-button btn btn-sm btn-danger"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="isDeleteStudentModalOpen" class="modal">
      <div class="modal-content">
        <span @click="closeDeleteStudentModal" class="close">&times;</span>
        <h5 class="text-center">Delete Student</h5>
        <div class="mt-3">
          <p>Are you sure you want to delete?</p>
          <div class="text-center">
            <button
              @click="deleteStudentNow"
              class="upload-button btn btn-sm btn-danger"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch, defineProps, defineEmits } from "vue";
import {
  addDoc,
  collection,
  query,
  where,
  getDocs,
  onSnapshot,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import {
  uploadBytes,
  getDownloadURL,
  deleteObject,
  ref as storageRef,
} from "firebase/storage";
import { db, storage } from "../../../firebase/index.js";

const currentAlbumPage = ref("Graduation Portrait");

const props = defineProps(["folderName", "subfolderName", "gradsubfolderName"]);
const isModalOpen = ref(false);
const imageInput = ref(null);
const selectedRole = ref("");
const nameInput = ref("");
const addressInput = ref("");
const quotesInput = ref("");
const isAdviserDisabled = ref(false);
const students = ref([]);
const adviser = ref({});
const adviserImageUrl = ref("");
const adviserName = ref("");
const isOpen = ref(false);
const imageUrl = ref("");
const showAdviserMenu = ref(false);
const showStudentMenu = ref(null);
const isAdviserModalOpen = ref(false);
const editedAdviserName = ref("");
const adviserImageInput = ref(null);
const isStudentModalOpen = ref(false);
const editedStudentName = ref("");
const editedStudentAddress = ref("");
const editedStudentQuotes = ref("");
const studentImageInput = ref(null);
const isDeleteStudentModalOpen = ref(false);
const isDeleteAdviserModalOpen = ref(false);
let selectedDeleteStudentId = null;
let selectedStudentId = null;
let selectedAdviserId = null;
const studentImageUrl = ref("");

const emit = defineEmits(["update:currentPage"]);

const backToGrad = async () => {
  currentAlbumPage.value = "Chosen PAB";
  emit("update:currentPage", "Chosen PAB");
};

const openImageModal = (url) => {
  imageUrl.value = url;
  isOpen.value = true;
};

const closeImageModal = () => {
  isOpen.value = false;
};

const openModal = async () => {
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
};

const toggleAdviserMenu = () => {
  showAdviserMenu.value = !showAdviserMenu.value;
};

const toggleStudentMenu = (studentId) => {
  showStudentMenu.value =
    showStudentMenu.value === studentId ? null : studentId;
};

const editAdviser = (adviser) => {
  editedAdviserName.value = adviser.name;
  selectedAdviserId = adviser.id;

  isAdviserModalOpen.value = true;
};

const closeAdviserModal = () => {
  isAdviserModalOpen.value = false;
};

const uploadAdviserImage = async (event) => {
  const imageFile = event.target.files[0];
  const imageRef = storageRef(storage, `adviserImages/${imageFile.name}`);
  await uploadBytes(imageRef, imageFile);
  const imageUrl = await getDownloadURL(imageRef);
  adviserImageUrl.value = imageUrl;
};

const saveAdviserChanges = async () => {
  let newImageUrl = adviserImageUrl.value;

  const imageInput = adviserImageInput.value;
  if (imageInput && imageInput.files.length > 0) {
    const imageFile = imageInput.files[0];
    const imageRef = storageRef(storage, `adviserImages/${imageFile.name}`);
    await uploadBytes(imageRef, imageFile);
    newImageUrl = await getDownloadURL(imageRef);
  }

  await updateDoc(doc(db, "gradportrait", selectedAdviserId), {
    name: editedAdviserName.value,
    imageUrl: newImageUrl,
  });
  isAdviserModalOpen.value = false;
};

const deleteAdviser = async () => {
  isDeleteAdviserModalOpen.value = true;
};

const closeDeleteAdviserModal = () => {
  isDeleteAdviserModalOpen.value = false;
};

const deleteAdviserNow = async () => {
  await deleteDoc(doc(db, "gradportrait", adviser.value.id));
  adviser.value = {};
  isDeleteAdviserModalOpen.value = false;
};

const editStudent = (student) => {
  editedStudentName.value = student.name;
  editedStudentAddress.value = student.address;
  editedStudentQuotes.value = student.quotes;
  selectedStudentId = student.id;

  isStudentModalOpen.value = true;
};

const closeStudentModal = () => {
  isStudentModalOpen.value = false;
};

const uploadStudentImage = async (event) => {
  const imageFile = event.target.files[0];
  const imageRef = storageRef(storage, `studentImages/${imageFile.name}`);
  await uploadBytes(imageRef, imageFile);
  const imageUrl = await getDownloadURL(imageRef);
  studentImageUrl.value = imageUrl;
};

const saveStudentChanges = async () => {
  let newImageUrl = studentImageUrl.value;

  const imageInput = studentImageInput.value;
  if (imageInput && imageInput.files.length > 0) {
    const imageFile = imageInput.files[0];
    const imageRef = storageRef(storage, `studentImages/${imageFile.name}`);
    await uploadBytes(imageRef, imageFile);
    newImageUrl = await getDownloadURL(imageRef);
  }

  await updateDoc(doc(db, "gradportrait", selectedStudentId), {
    name: editedStudentName.value,
    address: editedStudentAddress.value,
    quotes: editedStudentQuotes.value,
    imageUrl: newImageUrl,
  });

  isStudentModalOpen.value = false;
};

const deleteStudent = async (studentId) => {
  selectedDeleteStudentId = studentId;
  isDeleteStudentModalOpen.value = true;
};

const closeDeleteStudentModal = () => {
  isDeleteStudentModalOpen.value = false;
};

const deleteStudentNow = async () => {
  await deleteDoc(doc(db, "gradportrait", selectedDeleteStudentId));
  selectedDeleteStudentId = null;
  isDeleteStudentModalOpen.value = false;
};

const uploadData = async () => {
  const imageRef = storageRef(
    storage,
    `gradportrait/${imageInput.value.files[0].name}`
  );
  await uploadBytes(imageRef, imageInput.value.files[0]);
  const imageUrl = await getDownloadURL(imageRef);

  await addDoc(collection(db, "gradportrait"), {
    year: props.folderName,
    pab: props.subfolderName,
    folderIn: props.gradsubfolderName,
    role: selectedRole.value,
    name: nameInput.value,
    address: addressInput.value,
    quotes: quotesInput.value,
    imageUrl: imageUrl,
  });

  selectedRole.value = "";
  nameInput.value = "";
  addressInput.value = "";
  quotesInput.value = "";

  closeModal();
};

const sortedStudents = computed(() => {
  return students.value.slice().sort((a, b) => {
    return a.name.localeCompare(b.name);
  });
});

const checkAdviserExists = async () => {
  const q = query(
    collection(db, "gradportrait"),
    where("year", "==", props.folderName),
    where("pab", "==", props.subfolderName),
    where("role", "==", "adviser")
  );
  const querySnapshot = await getDocs(q);
  isAdviserDisabled.value = querySnapshot.size > 0;
};

const fetchStudentsAndAdviser = async () => {
  const q = query(
    collection(db, "gradportrait"),
    where("year", "==", props.folderName),
    where("pab", "==", props.subfolderName)
  );

  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    students.value = [];
    adviser.value = {};

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      if (data.role === "adviser") {
        adviser.value = { ...data, id: doc.id };
        adviserImageUrl.value = data.imageUrl;
        adviserName.value = data.name;
      } else if (data.role === "student") {
        students.value.push({ ...data, id: doc.id });
      }
    });
  });

  return unsubscribe;
};


let unsubscribe1;

const unsubscribe = onSnapshot(
  query(
    collection(db, "gradportrait"),
    where("year", "==", props.folderName),
    where("pab", "==", props.subfolderName),
    where("role", "==", "adviser")
  ),
  () => {
    checkAdviserExists();
  }
);

onMounted(() => {
  checkAdviserExists();
  unsubscribe1 = fetchStudentsAndAdviser();
});

watch(
  () => [props.folderName, props.subfolderName],
  () => {
    unsubscribe1();
    unsubscribe1 = fetchStudentsAndAdviser();
  }
);
</script>

<style scoped>
.modal {
  position: fixed;
  z-index: 1;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
}

.modal-content {
  background-color: #fefefe;
  margin: 15% auto;
  padding: 20px;
  border: 1px solid #888;
  width: 80%;
  max-width: 800px;
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
/* 
.upload-button {
  background-color: #4caf50;
  color: white;
  padding: 15px 32px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 4px 2px;
  cursor: pointer;
} */

/* -- */
.wh-150px {
  width: 150px;
  height: 150px;
}

.btn-togglemenu {
  position: absolute;
  top: 0;
  right: 0;
  background-color: rgba(255, 255, 255, 0);
  border: none !important;
  color: white;
}

.menu-container {
  position: absolute;
  top: 35px;
  right: 0;
}

.menu-container button {
  font-size: 12px;
}
</style>
