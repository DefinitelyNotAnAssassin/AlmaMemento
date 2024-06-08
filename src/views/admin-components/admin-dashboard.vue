<template>
  <h4 class="dashboard-title">Welcome Admin!</h4>
    <div class="cards-container">
        <div class="card-one">
            <div class="top-content">
                <img width="100" height="100" src="https://img.icons8.com/dusk/100/students.png" alt="students"/>
                <h1 class="text-white">{{ alumniCount }}</h1>
            </div>
            <div class="bottom-content">
                <h3 class="dashboard-bottom-title">Total Alumni</h3>
                <button class="fa fa-arrow-circle-right" aria-hidden="true" @click="goToAlumni" style="background: none; border: none; margin-right: 10px;"></button>
            </div>
        </div>
        <div class="card-two">
            <div class="top-content">
                <img width="100" height="100" src="https://img.icons8.com/dusk/64/contact-card.png" alt="contact-card"/>
                <h1 class="text-white">{{ contactCount }}</h1>
            </div>
            <div class="bottom-content">
                <h3 class="dashboard-bottom-title">Contact Support</h3>
                <button class="fa fa-arrow-circle-right" aria-hidden="true" @click="goToContact" style="background: none; border: none; margin-right: 10px;"></button>
            </div>
        </div>
        <div class="card-three">
            <div class="top-content">
                <img width="100" height="100" src="https://img.icons8.com/external-flaticons-lineal-color-flat-icons/100/external-courses-recruitment-agency-flaticons-lineal-color-flat-icons-2.png" alt="external-courses-recruitment-agency-flaticons-lineal-color-flat-icons-2"/>
                <h1 class="text-white">{{moderatorCount}}</h1>
            </div>
            <div class="bottom-content">
                <h3 class="dashboard-bottom-title">Total Moderators</h3>
                <i class="fas fa-circle-right"></i>
                <i class="fa fa-arrow-circle-right" aria-hidden="true" @click="goToModerators" style="background: none; border: none; margin-right: 10px; cursor: pointer;"></i>
            </div>
        </div>
        <div class="card-four">
            <div class="top-content">
                <img width="100" height="100" src="https://img.icons8.com/external-flaticons-lineal-color-flat-icons/100/external-courses-recruitment-agency-flaticons-lineal-color-flat-icons-2.png" alt="external-courses-recruitment-agency-flaticons-lineal-color-flat-icons-2"/>
                <h1 class="text-white">{{approvalCount}}</h1>
            </div>
            <div class="bottom-content">
                <h3 class="dashboard-bottom-title">Pending for Approval</h3>
                <i class="fas fa-circle-right"></i>
                <button class="fa fa-arrow-circle-right" aria-hidden="true" @click="goToManageContent" style="background: none; border: none; margin-right: 10px;"></button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, defineEmits } from 'vue'
import { db } from '../../firebase/index.js'
import { collection, getDocs } from 'firebase/firestore'

const alumniCount = ref(0);
const contactCount = ref(0);
const moderatorCount = ref(0);
const approvalCount = ref(0);
const currentPage = ref('Dashboard');

const emit = defineEmits(["update:currentPage"]);

const goToAlumni = () => {
  currentPage.value = "Alumni";
  emit("update:currentPage", "Alumni");
};

const goToManageContent = () => {
  currentPage.value = "Manage Content";
  emit("update:currentPage", "Manage Content");
};

const goToContact = () => {
  currentPage.value = "Contact";
  emit("update:currentPage", "Contact");
};

const goToModerators = () => {
  currentPage.value = "Moderator";
  emit("update:currentPage", "Moderator");
};

const fetchAlumniCount = async () => {
  try {
    const q = collection(db, 'users')
    const querySnapshot = await getDocs(q)
    let count = 0
    let countModerators = 0
    querySnapshot.forEach(doc => {
      const userData = doc.data()
      if (userData.hasOwnProperty('userlevel') && userData.userlevel === 'alumni') {
        count++
      }

      if(userData.hasOwnProperty('userlevel') && userData.userlevel === 'moderator'){
        countModerators++
      }
    })
    alumniCount.value = count
    moderatorCount.value = countModerators

    const concerns = collection(db, 'concerns')
    const concernsQuerySnapshot = await getDocs(concerns)
    let concernsCount = 0
    concernsQuerySnapshot.forEach(doc => {
      const userData = doc.data()
      if (userData.hasOwnProperty('replies')) {
        concernsCount++
      }
    })
    contactCount.value = concernsCount

    const pending = collection(db, 'posts')
    const pendingQuerySnapshot = await getDocs(pending)
    let pendingCount = 0
    pendingQuerySnapshot.forEach(doc => {
      const userData = doc.data()
      if (userData.hasOwnProperty('status') && userData.status === 'pending')  {
        pendingCount++
      }
    })
    approvalCount.value = pendingCount


  } catch (error) {
    console.error('Error fetching alumni count:', error.message)
  }
}

onMounted(() => {
  fetchAlumniCount()
})
</script>

<style scoped>
.dashboard-bottom-title{
  white-space: nowrap;
}


@media only screen and (max-width: 995px) {
 .card-one, .card-two, .card-three,.card-four{
   width: 95%;
   min-width: 340px;
  }
}
</style>


