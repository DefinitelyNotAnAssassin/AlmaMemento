<template>
  <div class="components-page-main-container p-3 photo-album">
    <div class="text-center">
      <h3>
        {{ props.folderName }}
      </h3>
      <h4>{{ props.gradsubfolderName }} - {{ props.subfolderName }} -</h4>
    </div>
    <div class="d-flex justify-content-between">
      <button class="btn btn-sm btn-dark mx-1" @click="backToGrad">
        <i class="bi bi-arrow-return-left"></i>
      </button>
      <button class="btn btn-sm btn-success mx-1" @click="openModal">
        Add Photo
      </button>
    </div>

    <div
      class="d-flex flex-column align-items-center bg-dark"
      style="font-size: 12px"
    >
      <div class="adviser-container bg-primary">
        <div class="image-container bg-secondary wh-150px p-0" style="position: relative">
          <img
            class="wh-150px"
            style="cursor: pointer"
            v-if="adviserImageUrl"
            :src="adviserImageUrl"
            alt="Adviser Image"
            @click="openImageModal(adviserImageUrl)"
          />
          <div class="menu-container">
            <button class="btn btn-sm btn-light" @click="toggleAdviserMenu">
              <i class="bi bi-list"></i>
            </button>
            <div v-if="showAdviserMenu" class="bg-light p-1">
              <button class="btn btn-sm" @click="editAdviser(adviser)">
                Edit
              </button>
              <button class="btn btn-sm" @click="deleteAdviser">Delete</button>
            </div>
          </div>
        </div>
        <div class="text-center">
          <span v-if="adviserName">
            <div>{{ adviserName }}</div>
            <div>Adviser</div>
          </span>
        </div>
      </div>
    </div>

    <div class="students-container d-flex flex-wrap">
      <div
        class="width-150px student-container m-2 picture-container p-0"
        v-for="student in students"
        :key="student.id"
      >
        <div class="image-container">
          <img
            style="height: 150px; width: 150px !important; cursor: pointer"
            :src="student.imageUrl"
            alt="Student Image"
            @click="openImageModal(student.imageUrl)"
          />
          <button
            class="btn btn-sm btn-light btn-menu"
            @click="toggleStudentMenu(student.id)"
          >
            <i class="bi bi-list"></i>
          </button>
          <div
            v-if="showStudentMenu === student.id"
            class="menu-options card bg-light"
          >
            <button class="btn btn-sm" @click="editStudent(student)">
              Edit
            </button>
            <button class="btn btn-sm" @click="deleteStudent(student.id)">
              Delete
            </button>
          </div>
        </div>
        <div class="width-150px text-center" style="font-size: 12px">
          <div class="bg-dark text-light">{{ student.name }}</div>
          <div v-if="student.address">{{ student.address }}</div>
          <div style="height: 30px; overflow-y: auto" v-if="student.quotes">
            <p class="width-150px" style="word-wrap: break-word">
              {{ student.quotes }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <div v-if="isModalOpen" class="modal">
      <div class="modal-content">
        <span @click="closeModal" class="close">&times;</span>
        <h2>Upload Image</h2>
        <input type="file" @change="uploadImage" ref="imageInput" />
        <label for="role">Role:</label>
        <select id="role" v-model="selectedRole">
          <option value="adviser" :disabled="isAdviserDisabled">Adviser</option>
          <option value="student">Student</option>
        </select>
        <label for="name">Name:</label>
        <input type="text" id="name" v-model="nameInput" />
        <label for="address" v-if="selectedRole === 'student'">Address:</label>
        <input
          type="text"
          id="address"
          v-model="addressInput"
          v-if="selectedRole === 'student'"
        />
        <label for="quotes" v-if="selectedRole === 'student'">Quotes:</label>
        <input
          type="text"
          id="quotes"
          v-model="quotesInput"
          v-if="selectedRole === 'student'"
        />
        <button @click="uploadData" class="upload-button">Upload</button>
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
        <h2>Edit Adviser</h2>
        <label for="adviserName">Name:</label>
        <input type="text" id="adviserName" v-model="editedAdviserName" />
        <label for="adviserImage">Image:</label>
        <input
          type="file"
          id="adviserImage"
          ref="adviserImageInput"
          @change="uploadAdviserImage"
        />
        <button @click="saveAdviserChanges" class="upload-button">
          Save Changes
        </button>
      </div>
    </div>

    <div v-if="isStudentModalOpen" class="modal">
      <div class="modal-content">
        <span @click="closeStudentModal" class="close">&times;</span>
        <h2>Edit Student</h2>
        <label for="studentName">Name:</label>
        <input type="text" id="studentName" v-model="editedStudentName" />
        <label for="studentAddress">Address:</label>
        <input type="text" id="studentAddress" v-model="editedStudentAddress" />
        <label for="studentQuotes">Quotes:</label>
        <input type="text" id="studentQuotes" v-model="editedStudentQuotes" />
        <label for="studentImage">Image:</label>
        <input
          type="file"
          id="studentImage"
          ref="studentImageInput"
          @change="uploadStudentImage"
        />
        <button @click="saveStudentChanges" class="upload-button">
          Save Changes
        </button>
      </div>
    </div>

    <div v-if="isDeleteAdviserModalOpen" class="modal">
      <div class="modal-content">
        <span @click="closeDeleteAdviserModal" class="close">&times;</span>
        <h2>Delete Adviser</h2>
        <p>Are you sure you want to delete?</p>
        <button @click="deleteAdviserNow" class="upload-button">Delete</button>
      </div>
    </div>

    <div v-if="isDeleteStudentModalOpen" class="modal">
      <div class="modal-content">
        <span @click="closeDeleteStudentModal" class="close">&times;</span>
        <h2>Delete Student</h2>
        <p>Are you sure you want to delete?</p>
        <button @click="deleteStudentNow" class="upload-button">Delete</button>
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
  currentAlbumPage.value = "Chosen Course";
  emit("update:currentPage", "Chosen Course");
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
    course: props.subfolderName,
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

const checkAdviserExists = async () => {
  const q = query(
    collection(db, "gradportrait"),
    where("year", "==", props.folderName),
    where("course", "==", props.subfolderName),
    where("role", "==", "adviser")
  );
  const querySnapshot = await getDocs(q);
  isAdviserDisabled.value = querySnapshot.size > 0;
};

const fetchStudentsAndAdviser = async () => {
  const q = query(
    collection(db, "gradportrait"),
    where("year", "==", props.folderName),
    where("course", "==", props.subfolderName)
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
      } else {
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
    where("course", "==", props.subfolderName),
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
}

.wh-150px {
  width: 150px;
  height: 150px;
}

.menu-container {
  position: absolute;
  background-color: red;
}
</style>
