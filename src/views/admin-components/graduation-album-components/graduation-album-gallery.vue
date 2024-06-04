<template>
  <div class="components-page-main-container p-3">
    <div class="text-center">
      <h3>{{ props.gradsubfolderName }}</h3>
      <h4>{{ props.subfolderName }} - {{ props.folderName }}</h4>
    </div>

    <div class="d-flex justify-content-between">
      <button class="btn btn-sm btn-dark mx-1" @click="backToGrad">
        <i class="bi bi-arrow-return-left"></i>
      </button>
      <button class="btn btn-sm btn-success mx-1" @click="showModal = true">
        Upload Image
      </button>
    </div>

    <div v-if="showModal" class="modal">
      <div class="modal-content">
        <span class="close" @click="showModal = false">&times;</span>
        <input
          class="form-control"
          type="file"
          multiple
          ref="imageInput"
          @change="handleFileUpload"
        />
        <button class="btn btn-sm btn-success" @click="uploadImage">
          Upload
        </button>
      </div>
    </div>

    <div class="image-container d-flex flex-wrap mt-2">
      <div  v-for="image in images">
        <img
        class="m-1"
        style="height: 200px; width: 200px"
       
        :key="image.id"
        :src="image.url"
        alt="Uploaded Image"
      />
      <button @click="deleteImage(image)" class="btn btn-delete">
        <i class="bi bi-x-square"></i>
      </button>
      </div>
     
    </div>
  </div>
</template>

<script setup>
import { ref, defineEmits, defineProps } from "vue";
import {
  uploadBytes,
  getDownloadURL,
  deleteObject,
  ref as storageRef,
} from "firebase/storage";
import {
  addDoc,
  collection,
  query,
  where,
  onSnapshot,
  deleteDoc,
  doc
} from "firebase/firestore";
import { db, storage } from "../../../firebase/index.js";
import { useQuasar } from "quasar";
const props = defineProps(["folderName", "subfolderName", "gradsubfolderName"]);
const emit = defineEmits(["update:currentPage"]);
const $q = useQuasar()
const currentAlbumPage = ref("Gallery");
const showModal = ref(false);
const selectedFiles = ref([]);
const images = ref([]);

const backToGrad = async () => {
  currentAlbumPage.value = "Chosen PAB";
  emit("update:currentPage", "Chosen PAB");
};

const handleFileUpload = (event) => {
  selectedFiles.value = Array.from(event.target.files);
};

const uploadImage = async () => {
  if (selectedFiles.value.length === 0) {
    return $q.dialog({ title: "Warning", message: "Image required." });
  }

  const uploadPromises = selectedFiles.value.map(async (file) => {
    const imageRef = storageRef(storage, `gallery/${file.name}`);
    await uploadBytes(imageRef, file);
    const imageUrl = await getDownloadURL(imageRef);

    await addDoc(collection(db, "gallery"), {
      folder: props.folderName,
      subfolder: props.subfolderName,
      gradsubfolder: props.gradsubfolderName,
      url: imageUrl,
      storagePath: imageRef.fullPath,
    });
  });

  await Promise.all(uploadPromises);
  showModal.value = false;
};

const deleteImage = async (image) => {
  try {
    const imageRef = storageRef(storage, image.url);
    await deleteObject(imageRef);

    const docRef = doc(db, "gallery", image.id);
    await deleteDoc(docRef);

    images.value = images.value.filter((img) => img.id !== image.id);
  } catch (error) {
    $q.dialog({ title: "Error", message: error.message });
  }
};

onSnapshot(
  query(
    collection(db, "gallery"),
    where("gradsubfolder", "==", props.gradsubfolderName),
    where("subfolder", "==", props.subfolderName),
    where("folder", "==", props.folderName)
  ),
  (snapshot) => {
    images.value = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      images.value.push({ id: doc.id, url: data.url });
    });
  }
);
</script>

<style>
.modal {
  display: block;
  position: fixed;
  z-index: 1;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgb(0, 0, 0);
  background-color: rgba(0, 0, 0, 0.4);
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

.image-container {
  display: flex;
  flex-wrap: wrap;
}

.image-container img {
  width: 200px;
  height: 200px;
  margin: 10px;
  object-fit: cover;
}

.image-container div{
  position: relative;
  margin: 0.5rem;
}

.btn-delete{
  position: absolute;
  right: -0.5rem;
  top: -0.5rem;
  font-size: 1.5rem;
  z-index: 1000;
}
</style>
