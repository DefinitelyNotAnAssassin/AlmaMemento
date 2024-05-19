<template>
    <div v-if="currentPage === 'Reset'">
        <ResetPassword @update:currentPage="currentPage = $event" @id="updateID"/>
    </div>
    <div v-if="currentPage === 'Verify'">
        <VerifyEmail :id="selectedID" @update:currentPage="currentPage = $event" />
    </div>
    <div v-if="currentPage === 'New Password'">
        <NewPassword :id="selectedID" @update:currentPage="currentPage = $event" />
    </div>
</template>

<script setup>
import { ref } from 'vue'
import ResetPassword from './forgot-password-components/reset-pass.vue'
import VerifyEmail from './forgot-password-components/verify-email.vue'
import NewPassword from './forgot-password-components/new-pass.vue'

const currentPage = ref('Reset')
const selectedID = ref('')

const updateID = (id) => {
  console.log(id);
  selectedID.value = id;
  currentPage.value = 'Verify';
};
</script>