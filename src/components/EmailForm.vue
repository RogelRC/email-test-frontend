<template>
  <div class="bg-white p-6 rounded-lg border border-gray-200">
    <h2 class="text-lg font-medium text-gray-900 mb-6">Redactar Nuevo Correo</h2>
    
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <div class="space-y-1">
        <label for="recipient_email" class="block text-sm font-medium text-gray-700">
          Para <span class="text-red-500">*</span>
        </label>
        <div class="relative rounded-md shadow-sm">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <input
            v-model="formData.recipient_email"
            type="email"
            id="recipient_email"
            required
            :disabled="isLoading"
            class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="correo@ejemplo.com"
          >
        </div>
      </div>
      
      <div class="space-y-1">
        <label for="subject" class="block text-sm font-medium text-gray-700">
          Asunto <span class="text-red-500">*</span>
        </label>
        <div class="relative rounded-md shadow-sm">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </div>
          <input
            v-model="formData.subject"
            type="text"
            id="subject"
            required
            :disabled="isLoading"
            class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Asunto del correo"
          >
        </div>
      </div>
      
      <div class="space-y-1">
        <label for="body" class="block text-sm font-medium text-gray-700">
          Mensaje <span class="text-red-500">*</span>
        </label>
        <div class="relative rounded-md shadow-sm">
          <textarea
            v-model="formData.body"
            id="body"
            rows="6"
            required
            :disabled="isLoading"
            class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Escribe tu mensaje aquí..."
          ></textarea>
        </div>
      </div>
      
      <div class="flex justify-end pt-4 border-t border-gray-200">
        <button
          type="submit"
          :disabled="isLoading"
          class="inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg v-if="isLoading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <svg v-else class="-ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          {{ isLoading ? 'Enviando...' : 'Enviar Correo' }}
        </button>
      </div>
      
      <div v-if="error" class="rounded-md bg-red-50 p-4">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
            </svg>
          </div>
          <div class="ml-3">
            <h3 class="text-sm font-medium text-red-800">
              Error al enviar el correo
            </h3>
            <div class="mt-2 text-sm text-red-700">
              <p>{{ error }}</p>
            </div>
          </div>
        </div>
      </div>
      
      <div v-if="success" class="rounded-md bg-green-50 p-4">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
            </svg>
          </div>
          <div class="ml-3">
            <h3 class="text-sm font-medium text-green-800">
              ¡Éxito!
            </h3>
            <div class="mt-2 text-sm text-green-700">
              <p>El correo se ha enviado correctamente.</p>
            </div>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import EmailService from '../services/EmailService';

const emit = defineEmits(['email-sent']);

const formData = ref({
  recipient_email: '',
  subject: '',
  body: ''
});

const isLoading = ref(false);
const error = ref('');
const success = ref(false);

const handleSubmit = async () => {
  try {
    isLoading.value = true;
    error.value = '';
    success.value = false;
    
    await EmailService.sendEmail(formData.value);
    
    // Reset form
    formData.value = {
      recipient_email: '',
      subject: '',
      body: ''
    };
    
    success.value = true;
    emit('email-sent');
    
    // Hide success message after 3 seconds
    setTimeout(() => {
      success.value = false;
    }, 3000);
    
  } catch (err) {
    console.error('Error sending email:', err);
    error.value = err.response?.data?.message || 'Error al enviar el correo. Por favor, inténtalo de nuevo.';
  } finally {
    isLoading.value = false;
  }
};
</script>
