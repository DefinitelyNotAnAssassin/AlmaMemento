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
      <h3>Registration Form</h3>
      <form @submit.prevent="registration">
        <div>
          <div style="display: flex; gap: 1rem">
            <input
              class="form-control"
              type="text"
              v-model="firstName"
              id="firstName"
              required
              placeholder="First Name"
              style="margin-bottom: 0.5rem"
            />
            <input
              class="form-control"
              type="text"
              v-model="lastName"
              id="lastName"
              required
              placeholder="Last Name"
              style="margin-bottom: 0.5rem"
            />
          </div>
          <div style="display: flex; gap: 1rem">
            <input
              class="form-control"
              type="text"
              v-model="classYear"
              id="classYear"
              required
              placeholder="Class Year"
              style="margin-bottom: 0.5rem"
            />
            <input
              class="form-control"
              type="text"
              v-model="programBlock"
              id="programBlock"
              required
              placeholder="Program Block"
              style="margin-bottom: 0.5rem"
            />
          </div>
          <input
            class="form-control"
            type="text"
            v-model="address"
            id="address"
            required
            placeholder="Address"
            style="margin-bottom: 0.5rem"
          />
          <input
            class="form-control"
            type="text"
            v-model="phoneNumber"
            id="phoneNumber"
            required
            placeholder="Phone Number"
            style="margin-bottom: 0.5rem"
          />
          <input
            class="form-control"
            type="password"
            v-model="newPass"
            id="newPass"
            required
            placeholder="Password"
            style="margin-bottom: 0.5rem"
          />
          <input
            class="form-control"
            type="password"
            v-model="confPass"
            id="confPass"
            required
            style="margin-bottom: 0.5rem"
            placeholder="Confirm Password"
          />
        </div>
        <button class="btn btn-danger w-100" type="submit">Submit</button>
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
import { useQuasar } from "quasar";
const $q = useQuasar();
const props = defineProps(["id"]);
const router = useRouter();

const firstName = ref("");
const lastName = ref("");
const classYear = ref("");
const programBlock = ref("");
const address = ref("");
const phoneNumber = ref("");
const newPass = ref("");
const confPass = ref("");

const CustomDialog = (title, message) => {
  $q.dialog({
    title,
    message,
  })
    .onOk(() => {
      // console.log('OK')
    })
    .onCancel(() => {
      // console.log('Cancel')
    })
    .onDismiss(() => {
      // console.log('I am triggered on both OK and Cancel')
    });
};

const registration = async () => {
  if (
    firstName.value.trim() === "" ||
    lastName.value.trim() === "" ||
    classYear.value.trim() === "" ||
    programBlock.value.trim() === "" ||
    address.value.trim() === "" ||
    phoneNumber.value.trim() === "" ||
    newPass.value.trim() === ""
  ) {
    CustomDialog("Error", "All fields are required.");
  }

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
        address: address.value,
        fName: firstName.value,
        lName: lastName.value,
        phone: phoneNumber.value,
        alumna_password: newPass.value,
        classYear: classYear.value,
        pab: programBlock.value,
      });
      CustomDialog("Success", "Your account has been registered successfully.");
      router.push("/success");
    } else {
      CustomDialog("Error", "User not found.");
    }
  } catch (error) {
    CustomDialog("Error", error.message);
  }
};
</script>
