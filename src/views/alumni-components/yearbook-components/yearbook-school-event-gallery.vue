<template>
  <div
    class="components-page-main-container p-3"
    style="width: 100vw !important"
  >
    <div class="text-center">
      <h4>{{ props.subfolderName }}</h4>
      <h5>{{ props.folderName }}</h5>
    </div>

    <div class="d-flex justify-content-between">
      <button class="btn btn-sm btn-dark mx-1" @click="backToGrad">
        <i class="bi bi-arrow-return-left"></i>
      </button>
    </div>

    <div class="image-container d-flex flex-wrap mt-2">
      <div class="image"   v-for="image in images">
        <img
        class="m-1"
        style="height: 200px; width: 200px"
      
        :key="image.id"
        :src="image.url"
        alt="Uploaded Image"
      />
      <div class="details" v-if="image.isDetails">
        <h3>Details</h3>
        <p>Name: <span>{{ image.name }}</span></p>
        <p>Program & Block: <br/><span>{{ image.pab }}</span></p>
        <p>Time: <br/><span>{{ image.time }}</span></p>
      </div>
      <div class="dot-container" @click="image.isMenu = !image.isMenu">
        <span></span>
        <span></span>
        <span></span>
      </div>
      <button class="btn btn-dark btn-details" v-if="image.isMenu" @click="image.isDetails = !image.isDetails" >Details</button>
      </div>
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
  getDoc,
  doc
} from "firebase/firestore";
import { db, storage } from "../../../firebase/index.js";

const props = defineProps(["folderName", "subfolderName"]);
const emit = defineEmits(["update:currentPage"]);

const currentAlbumPage = ref("School Events Gallery");
const images = ref([]);

const backToGrad = async () => {
  currentAlbumPage.value = "School Events";
  emit("update:currentPage", "School Events");
};

const formatDate = (timestamp) => {
  const date = new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000);
  const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  };
  return date.toLocaleString('en-US', options);
};

onSnapshot(
  query(
    collection(db, "posts"),
    where("event", "==", props.subfolderName),
    where("schoolYear", "==", props.folderName),
    where("status", "==", "approved"),
  ),
  (snapshot) => {
    const imagePromises = snapshot.docs.map(async (docSnapshot) => {
      const data = docSnapshot.data();
      const userDocRef = doc(db, "users", data.userIdOrig); // Correctly create a reference to the user's document
      const userDocSnap = await getDoc(userDocRef);
      let pab = "";

      if (userDocSnap.exists()) {
        const user = userDocSnap.data();
        pab = user.pab;
      }

      return {
        id: docSnapshot.id,
        url: data.imageUrls,
        eventsubfolder: data.event,
        isMenu: false,
        isDetails: false,
        caption: data.caption,
        name: data.name,
        schoolYear: data.schoolYear,
        event: data.event,
        time: formatDate(data.time),
        pab: pab,
      };
    });

    Promise.all(imagePromises).then((results) => {
      images.value = results;
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
  position: relative;
}

.image-container .image{
  position: relative;
  overflow: visible !important;

}

.image-container img {
  width: 200px;
  height: 200px;
  margin: 10px;
  object-fit: cover;
}



.image .dot-container{
  cursor: pointer;
  position: absolute;
  right: 0.5rem;
  top: 0.5rem;
  height: 1.5rem;
  width: 0.5rem;

  display: flex;
  flex-direction: column; 
}

.dot-container span{
  width: 0.3rem;
  height: 0.3rem;
  margin-bottom: 0.1rem;
  background: #323232;
  border-radius: 50%;
  align-self: flex-end;
}

.image .btn{
  position: absolute;
  right: -4rem;
  top: 2rem;
  z-index: 1;
  display: block;
}

.details{
  position: absolute;
  inset: 0 0 0 0;
  margin: 0.3rem;
  padding: 0.5rem;
  background: rgba(0, 0, 0, 0.4);
  color: white;
  line-height: 0.9rem;
}



.details p{
  text-wrap: wrap;
  font-weight: bold;
}

.details h3{
  font-size: 1rem;
  font-weight: bold;
}

.details span{
  font-weight: normal;
}

</style>
