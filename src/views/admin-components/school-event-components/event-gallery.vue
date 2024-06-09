<template>
  <div
    class="components-page-main-container p-3"
    style="width: 100% !important"
  >
    <div class="text-center">
      <h4>{{ props.subfolderName }}</h4>
      <h5>{{ props.folderName }}</h5>
    </div>

    <div class="d-flex justify-content-between">
      <button class="btn btn-sm btn-dark mx-1" @click="backToGrad">
        <i class="bi bi-arrow-return-left"></i>
      </button>
      <div class="d-flex justify-content-end">
      <input
        class="form-control"
        style="width: 250px"
        type="text"
        v-model="searchQuery"
        placeholder="Search"
      />

    </div>
    </div>

    <div class="image-container d-flex flex-wrap mt-2">
      <div class="d-flex gap-1 m-2" v-for="(image, index) in filteredImages" :key="image.id">
        <div

        class="image" style="position: relative; height: 250px; width: 250px;" v-for="(file, idx) in image.url" :key="idx">
          <img style="height: 100%; width: 100%;" v-if="file.type.startsWith('image/')" :src="file.url" class="m-1" />
          <video  style="height: 100%; width: 100%;" v-else :src="file.url" controls></video>

          <div class="details" v-if="file.isDetails" @click = "file.isDetails = !file.isDetails">
            <h3>Details</h3>
            <p>Name: <span>{{ image.name }}</span></p>
            <p>Program & Block: <br /><span>{{ image.pab }}</span></p>
            <p>Time: <br /><span>{{ image.time }}</span></p>
          </div>
          <div class="dot-container" @click="file.isMenu = !file.isMenu">
            <span></span>
            <span></span>
            <span></span>
          </div>
          <button class="btn btn-dark btn-details" v-if="file.isMenu" @click="file.isDetails = !file.isDetails; file.isMenu = !file.isMenu">Details</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, defineEmits, defineProps, computed } from "vue";
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
const searchQuery = ref("");

const currentAlbumPage = ref("School Events Gallery");
const images = ref([]);

const backToGrad = async () => {
  currentAlbumPage.value = "Event";
  emit("update:currentPage", "Event");
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
        isMenu: false,
        isDetails: false,
        eventsubfolder: data.event,
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

const filteredImages = computed(() => {

  if(searchQuery.value.trim() !== ""){
    return images.value
    .filter((image) =>
    image.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    image.pab.toLowerCase().includes(searchQuery.value.toLowerCase()) ||

    String(image.time).includes(searchQuery.value)
    )
    .sort((a, b) => a.name.localeCompare(b.name));
  }

  return images.value
});




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
  z-index: 3;
  display: block;
}

.details{
  position: absolute;
  top: -105%;
  left: -1rem;

  width: 105%;
  height: 100%;
  padding: 0.5rem;
  background: rgba(0, 0, 0, 0.4);
  color: white;
  line-height: 0.9rem;
  z-index: 2;
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
