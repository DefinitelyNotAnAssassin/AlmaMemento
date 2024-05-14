<template>
    <div v-if="currentPage === 'Contact'">
        <ContactMain @update:currentPage="currentPage = $event" @id="updateID"/>
    </div>
    <div v-if="currentPage === 'Contact Message'">
        <ContactMessage :id="selectedID"  @update:currentPage="currentPage = $event" />
    </div>
</template>

<script setup>
import { ref } from 'vue'
import ContactMain from './admin-contact-components/admin-contact-main.vue'
import ContactMessage from './admin-contact-components/admin-contact-message.vue'

const currentPage = ref('Contact')
const selectedID = ref('')

const updateID = (id) => {
  console.log(id);
  selectedID.value = id;
  currentPage.value = 'Contact Message';
};
</script>