<template>
  <div class="components-page-main-container p-3">
    <div class="text-center">
      <h3>{{ props.subfolderName }}</h3>
      <h4>{{ props.folderName }}</h4>
    </div>

    <div class="d-flex justify-content-between">
      <button class="btn btn-sm btn-dark mx-1" @click="backToEvent">
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
    <div class="image-container">
      <div class="image-container wh-150px p-0" style="position: relative"  v-for="image in images"  :key="image.id">
      <img
        :src="image.url"
        alt="Uploaded Image"
        @click="openImageModal(image.url)"
      />
      <button
            class="btn btn-sm btn-light btn-togglemenu"
            @click="toggleEventMenu(image)"
          >
            <i class="bi bi-list"></i>
          </button>
          <div v-if="showEventMenu" class="bg-light p-1 menu-container">
            <button class="btn btn-sm" @click="editEvent(image)">
              Edit
            </button>
            <button class="btn btn-sm" @click="deleteEvent(image)">Delete</button>
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

    <div v-if="isEventModalOpen" class="modal">
      <div class="modal-content">
        <span @click="closeEventModal" class="close">&times;</span>
        <h5 class="text-center">Edit Event</h5>
        <div class="mt-3">
          <div>
            <label for="eventName">Name:</label>
            <input
              class="form-control"
              type="text"
              id="eventName"
              v-model="editedEventName"
            />
          </div>
          <div>
            <label for="eventAddress">Address:</label>
            <input
              class="form-control"
              type="text"
              id="eventAddress"
              v-model="editedEventAddress"
            />
          </div>
          <div>
            <label for="eventQuotes">Quotes:</label>
            <input
              class="form-control"
              type="text"
              id="eventQuotes"
              v-model="editedEventQuotes"
            />
          </div>
          <div>
            <label for="eventImage">Image:</label>
            <input
              class="form-control"
              type="file"
              id="eventImage"
              ref="eventImageInput"
              multiple
              @change="uploadEventImage"
              accept="image/*"
            />
          </div>
          <div class="text-center">
            <button
              @click="saveEventChanges"
              class="upload-button btn btn-sm btn-success"
            >
              Save Changes
            </button>
          </div>
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
  deleteDoc,
  updateDoc,
  doc
} from "firebase/firestore";
import { db, storage } from "../../../firebase/index.js";
import { useQuasar } from "quasar";
const $q = useQuasar()
const props = defineProps(["folderName", "subfolderName"]);
const emit = defineEmits(["update:currentPage"]);

const currentAlbumPage = ref("Event Gallery");
const showModal = ref(false);
let selectedFile = null;
const images = ref([]);
const showEventMenu = ref(null);
const isOpen = ref(false);
const editedEventName = ref("");
const eventImageUrl = ref("");
const editedEventAddress = ref("")
const editedEventQuotes = ref("")
const selectedEventId = ref("")
const isEventModalOpen = ref(false)
const eventImageInput = ref(null);

const toggleEventMenu = (event) => {
  showEventMenu.value = showEventMenu.value === event.id ? null : event.id;
};

const imageUrl = ref("");

const openImageModal = (url) => {
  imageUrl.value = url;
  isOpen.value = true;
};

const closeImageModal = () => {
  isOpen.value = false;
};

const editEvent = (event)=>{
  console.log(event)
  editedEventName.value = event.name;
  editedEventAddress.value = event.address;
  editedEventQuotes.value = event.quotes;
  selectedEventId.value = event.id;

  isEventModalOpen.value = true;
}

const saveEventChanges = async () => {
  let newImageUrl = eventImageUrl.value;

  const imageInput = eventImageInput.value;
  if (imageInput && imageInput.files.length > 0) {
    const imageFile = imageInput.files[0];
    const imageRef = storageRef(storage, `eventgallery/${imageFile.name}`);
    await uploadBytes(imageRef, imageFile);
    newImageUrl = await getDownloadURL(imageRef);
  }

  await updateDoc(doc(db, "eventgallery", selectedEventId.value), {
    name: editedEventName.value,
    address: editedEventAddress.value,
    quotes: editedEventQuotes.value,
    imageUrl: newImageUrl,
  });

  isEventModalOpen.value = false;
};


const backToEvent = async () => {
  currentAlbumPage.value = "Event";
  emit("update:currentPage", "Event");
};

const handleFileUpload = (event) => {
  selectedFile = event.target.files[0];
};

const closeEventModal = () => {
  isEventModalOpen.value = false;
};


const uploadEventImage = async (event) => {
  const imageFile = event.target.files[0];
  const imageRef = storageRef(storage, `eventgallery/${imageFile.name}`);
  await uploadBytes(imageRef, imageFile);
  const imageUrl = await getDownloadURL(imageRef);
  eventImageUrl.value = imageUrl;
};

const deleteEvent = async (image) => {
  $q.dialog({
        title: 'Confirmation',
        message: 'Are you sure you want to delete this event?',
        cancel: true,
        persistent: true,
      }).onOk(() => {
        deleteEventNow(image);
      }).onCancel(() => {
        // Action on Cancel
      }).onDismiss(() => {
        // Action on Dismiss
      });
};


const deleteEventNow = async (event) => {
  await deleteDoc(doc(db, "eventgallery", event.id));
};

const uploadImage = async () => {
  if (!selectedFile) return;

  const imageRef = storageRef(storage, `eventgallery/${selectedFile.name}`);
  await uploadBytes(imageRef, selectedFile);
  const imageUrl = await getDownloadURL(imageRef);

  await addDoc(collection(db, "eventgallery"), {
    eventfolder: props.folderName,
    eventsubfolder: props.subfolderName,
    url: imageUrl,
  });
  showModal.value = false;
};

onSnapshot(
  query(
    collection(db, "eventgallery"),
    where("eventfolder", "==", props.folderName),
    where("eventsubfolder", "==", props.subfolderName)
  ),
  (snapshot) => {
    images.value = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      images.value.push({ id: doc.id, url: data.url, name: data.name, address: data.address, quotes: data.quotes });
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

.btn-togglemenu {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  background-color: rgba(255, 255, 255, 0);
  border: none !important;
  color: white;
}

.menu-container {
  position: absolute;
  top: 35px;
  right: 0;
}


</style>
