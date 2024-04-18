<template>
  <aside class="sidebar-container d-flex flex-column align-items-center">
    <img
      class="mt-5"
      src="https://scontent.fmnl25-1.fna.fbcdn.net/v/t39.30808-6/362681859_833846268097031_774316903881338625_n.jpg?_nc_cat=103&ccb=1-7&_nc_sid=5f2048&_nc_eui2=AeHybu1WboC1y_yed82N84fp01fI_da8ksXTV8j91rySxXf65cUC0wq7qeoTuGVHZoA7wWJE_7z3FS0NZzVf5bJJ&_nc_ohc=8WQTYxhl5nQAb5u3wwK&_nc_ht=scontent.fmnl25-1.fna&oh=00_AfBm__PVH81knV7GG_RFs3itnIRxD5TSyT79WZ3tDsMZaw&oe=6625BCA4"
      alt="profile"
    />
    <h4 class="mt-2">Emmanuel Ugaban</h4>
    <p>emman@gmail.com</p>
    <div class="mt-5 profile-table-container">
      <h4>Profile</h4>
      <table>
        <tr>
          <td>ID number:</td>
          <td class="td-padding-left">0000</td>
        </tr>
        <tr>
          <td>Course:</td>
          <td class="td-padding-left">BSIT</td>
        </tr>
        <tr>
          <td>Class Year:</td>
          <td class="td-padding-left">2023-2024</td>
        </tr>
        <tr>
          <td>Phone:</td>
          <td class="td-padding-left">09123456789</td>
        </tr>
      </table>
    </div>
    <button @click="logout" class="logout-button"><i class="fas fa-power-off"></i>  Logout</button>
  </aside>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from 'vue-router'
import { db } from '../../firebase/index.js'
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore'

const router = useRouter()

const logout = async () => {
    try {
      console.log("Logging out...")
  
      const q = collection(db, "users")
      const querySnapshot = await getDocs(q)
      const userId = router.currentRoute.value.query.userId
      console.log("UserID:", userId)
  
      const user = querySnapshot.docs.find(doc => doc.id === userId && doc.data().loggedIn === true)
  
      if (user) {
        console.log("User found:", user.data())
  
        await updateDoc(doc(db, 'users', user.id), {
          loggedIn: false
        });
  
        router.push({ name: 'login' })
        console.log("Logout successful. Redirecting to login page...");
        console.log("Current URL:", window.location.href);
      } else {
        console.log("No logged in user found")
        errMsg.value = "No logged in user found"
      }
    } catch (error) {
      console.error("Error:", error.message)
      errMsg.value = "An error occurred"
    }
  }
</script>

<style scoped>
aside {
  height: calc(100vh - 70px);
  width: 400px;
  border-right: 10px solid #861b23;
}

aside img {
  height: 120px;
  widows: 120px;
  border-radius: 50%;
}

.profile-table-container {
  width: 280px !important;
}

.td-padding-left {
  padding-left: 30px;
}

table tr td {
  padding-top: 10px;
  padding-bottom: 10px;
}
</style>
