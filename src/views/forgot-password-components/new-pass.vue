<template>
  <div
    class="d-flex justify-content-center align-items-center pb-5"
    style="height: 100vh"
  >
    <div class="d-flex flex-column align-items-center">
      <img
        src="../../assets/images/ctu-logo.png"
        style="height: 200px; width: 200px"
      />
      <h3>CHOOSE A NEW PASSWORD</h3>
      <p>Enter the password you want to set for your account</p>
      <form @submit.prevent="updatePassword">
        <div>
          <input
            class="form-control"
            type="password"
            v-model="newPass"
            id="newPass"
            required
          />
          <input
            class="form-control"
            type="password"
            v-model="confPass"
            id="confPass"
            required
          />
        </div>
        <button class="btn btn-danger w-100" type="submit">Continue</button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps } from "vue";
import { useRouter } from "vue-router";
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
} from "firebase/firestore";
import { db } from "../../firebase/index.js";

const props = defineProps(["id"]);
const router = useRouter();

const newPass = ref("");
const confPass = ref("");

const updatePassword = async () => {
  if (newPass.value !== confPass.value) {
    alert("Passwords do not match");
    return;
  }

  try {
    const usersCollection = collection(db, "users");
    const q = query(usersCollection, where("alumnaID", "==", props.id));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const userDoc = querySnapshot.docs[0];
      const userDocRef = doc(db, "users", userDoc.id);
      await updateDoc(userDocRef, {
        alumna_password: newPass.value,
      });
      alert("Password updated successfully");
      router.push("/login");
    } else {
      alert("User not found");
    }
  } catch (error) {
    console.error("Error updating password:", error);
    alert("An error occurred while updating the password");
  }
};
</script>
