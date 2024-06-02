<template>
    <div v-if="currentPage === 'Reset'">
        <VerifyStudentId @update:currentPage="currentPage = $event" @id="updateID"/>
    </div>
    <div v-if="currentPage === 'Verify'">
        <VerifyStudentEmail :id="selectedID" @update:currentPage="currentPage = $event" />
    </div>
    <div v-if="currentPage === 'New Password'">
        <CreatePassword :id="selectedID" @update:currentPage="currentPage = $event" />
    </div>
</template>

<script setup>
import { ref } from 'vue'
import VerifyStudentId from './sign-up-components/verify-student-id.vue'
import VerifyStudentEmail from './sign-up-components/verify-student-email.vue'
import CreatePassword from './sign-up-components/create-student-pass.vue'
import RegistrationSuccess from './sign-up-components/registration-success.vue'

const currentPage = ref('Reset')
const selectedID = ref('')

const updateID = (id) => {
  console.log(id);
  selectedID.value = id;
  currentPage.value = 'Verify';
};
</script>