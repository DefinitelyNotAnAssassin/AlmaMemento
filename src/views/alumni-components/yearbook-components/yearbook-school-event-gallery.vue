<template>
    <div class="components-page-main-container p-3">
      <div class="text-center">
        <h4>{{ props.subfolderName }} - {{ props.folderName }}</h4>
      </div>
  
      <div class="d-flex justify-content-between">
        <button class="btn btn-sm btn-dark mx-1" @click="backToGrad">
          <i class="bi bi-arrow-return-left"></i>
        </button>
      </div>
  
      <div class="image-container d-flex flex-wrap mt-2">
        <img
          class="m-1"
          style="height: 200px; width: 200px"
          v-for="image in images"
          :key="image.id"
          :src="image.url"
          alt="Uploaded Image"
        />
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, defineEmits, defineProps } from "vue";
  import {
    uploadBytes,
    getDownloadURL,
    ref as storageRef,
  } from "firebase/storage";
  import {
    addDoc,
    collection,
    query,
    where,
    onSnapshot,
  } from "firebase/firestore";
  import { db, storage } from "../../../firebase/index.js";
  
  const props = defineProps(["folderName", "subfolderName"]);
  const emit = defineEmits(["update:currentPage"]);
  
  const currentAlbumPage = ref("School Events Gallery");
  const showModal = ref(false);
  let selectedFile = null;
  const images = ref([]);
  
  const backToGrad = async () => {
    currentAlbumPage.value = "School Events";
    emit("update:currentPage", "School Events");
  };
  
  onSnapshot(
    query(
      collection(db, "gallery"),
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
  </style>
  