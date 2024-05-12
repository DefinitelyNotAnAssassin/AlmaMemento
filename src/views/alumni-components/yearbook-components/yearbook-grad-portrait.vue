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
          v-for="student in students"
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
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, watch, defineProps, defineEmits } from "vue";
  import {
    collection,
    query,
    where,
    onSnapshot,
  } from "firebase/firestore";
  import { db } from "../../../firebase/index.js";
  
  const currentAlbumPage = ref("Graduation Portrait");
  
  const props = defineProps(["folderName", "subfolderName", "gradsubfolderName"]);
  const students = ref([]);
  const adviser = ref({});
  const adviserImageUrl = ref("");
  const adviserName = ref("");
  const isOpen = ref(false);
  const imageUrl = ref("");
  
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
        } else {
          students.value.push({ ...data, id: doc.id });
        }
      });
    });
  
    return unsubscribe;
  };
  
  let unsubscribe1;
  
  onMounted(() => {
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
  