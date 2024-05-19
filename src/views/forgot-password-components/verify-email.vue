<template>
  <div
    class="d-flex justify-content-center align-items-center"
    style="height: 100vh"
  >
    <div class="d-flex flex-column align-items-center">
      <img
        src="../../assets/images/ctu-logo.png"
        style="height: 200px; width: 200px"
      />
      <h3>PLEASE VERIFY IF IT IS YOU</h3>
      <form @submit.prevent="checkEmail">
        <p>
          Please check your email for verification code sent to
          <span style="font-weight: bold">{{ alumna_email }}</span>
        </p>
        <div>
          <input
            class="form-control"
            type="text"
            v-model="code"
            id="code"
            required
            placeholder="Enter Code"
          />
        </div>
        <p v-if="errorMessage">{{ errorMessage }}</p>
        <button class="btn btn-danger w-100" type="submit">Verify</button>
      </form>
      <p v-if="showResendLink" class="text-center">
        Didn't receive an email? <a href="#" @click="resendEmail">Try again</a>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits } from "vue";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../firebase/index.js";
import emailjs from "emailjs-com";

emailjs.init("zq_xIgPiujn84NnCY");

const code = ref("");
const errorMessage = ref("");
const alumna_email = ref("");
const showResendLink = ref(true);
const props = defineProps(["id"]);
const emit = defineEmits(["update:currentPage"]);
let verificationCode = "";
const currentPage = ref("Verify");

const generateRandomCode = (length) => {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

const fetchEmail = async () => {
  try {
    const q = query(collection(db, "users"), where("alumnaID", "==", props.id));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const user = querySnapshot.docs[0].data();
      alumna_email.value = user.alumna_email;
      await resendEmail();
    } else {
      errorMessage.value = "ID number does not exist";
    }
  } catch (error) {
    console.error("Error fetching email:", error);
    errorMessage.value = "An error occurred while fetching the email";
  }
};

fetchEmail();

const resendEmail = async () => {
  try {
    verificationCode = generateRandomCode(6);
    await emailjs.send("service_qg6fyml", "template_unbfrgi", {
      to_email: alumna_email.value,
      message: verificationCode,
    });
    console.log("Email sent successfully");
    console.log(verificationCode);
  } catch (error) {
    errorMessage.value = "Error sending email. Please try again.";
    console.error("Error sending email:", error);
  }
};

const checkEmail = async () => {
  try {
    if (code.value === verificationCode) {
      console.log("Code is correct");
      currentPage.value = "New Password";
      emit("update:currentPage", "New Password");
    } else {
      console.log("Incorrect code");
      errorMessage.value = "Incorrect code. Please try again.";
    }
  } catch (error) {
    console.error("Error checking email:", error);
  }
};
</script>
