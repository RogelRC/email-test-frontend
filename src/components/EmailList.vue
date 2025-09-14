<template>
  <div class="bg-white rounded-lg border border-gray-200">
    <div class="px-4 py-5 sm:px-6 border-b border-gray-200">
      <div class="flex items-center justify-between">
        <div>
          <h3 class="text-lg font-medium leading-6 text-gray-900">Bandeja de Entrada</h3>
          <p class="mt-1 max-w-2xl text-sm text-gray-500">
            Lista de correos electrónicos recibidos
          </p>
        </div>
        <button
          @click="fetchEmails"
          :disabled="isLoading"
          class="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          <svg v-if="isLoading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <svg v-else class="-ml-1 mr-1.5 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Actualizar
        </button>
      </div>
    </div>

    <div class="overflow-hidden">
      <div v-if="isLoading && emails.length === 0" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
        <p class="mt-3 text-sm text-gray-600">Cargando correos electrónicos...</p>
      </div>

      <div v-else-if="emails.length === 0" class="text-center py-12">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">No hay correos</h3>
        <p class="mt-1 text-sm text-gray-500">No se han encontrado correos electrónicos en tu bandeja de entrada.</p>
      </div>

      <ul v-else class="divide-y divide-gray-200">
        <li v-for="email in emails" :key="email.id" class="hover:bg-gray-50 transition-colors">
          <div class="px-4 py-4 sm:px-6">
            <div class="flex items-center justify-between">
              <p class="text-sm font-medium text-blue-600">
                {{ email.subject || '(Sin asunto)' }}
              </p>
            </div>
            <div class="mt-2 sm:flex sm:justify-between">
              <div class="sm:flex items-center">
                <!-- Show sender info if not the current user -->
                <template v-if="email.user_id !== currentUserId">
                  <p class="text-sm text-gray-500">
                    <svg class="inline-block mr-1.5 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    {{ email.senderEmail || 'Sistema' }}
                  </p>
                </template>

                <!-- Show status indicator -->
                <p v-if="email.user_id === currentUserId" class="ml-2 text-sm text-gray-500">
                  <svg class="inline-block mr-1.5 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Enviado</span>
                </p>
                <p v-else-if="email.recipient_id === currentUserId" class="ml-2 text-sm text-gray-500">
                  <svg class="inline-block mr-1.5 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Recibido</span>
                </p>
              </div>
              <div class="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                <svg class="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p>
                  {{ new Date(email.created_at).toLocaleString() }}
                </p>
              </div>
            </div>
            <div class="mt-2">
              <p class="text-sm text-gray-700 whitespace-pre-line">
                {{ email.body }}
              </p>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import EmailService from '../services/EmailService';
import UserService from '../services/UserService';

const emails = ref([]);
const userCache = ref({});
const currentUserId = ref(null);
const isLoading = ref(true);
const error = ref('');

const fetchUser = async (userId) => {
  try {
    // Check if user is already in cache
    if (!userCache.value[userId]) {
      const user = await UserService.getUser(userId);
      userCache.value = {
        ...userCache.value,
        [userId]: user
      };
    }
    return userCache.value[userId]?.email || 'Usuario desconocido';
  } catch (error) {
    console.error('Error fetching user:', error);
    return 'Error al cargar el remitente';
  }
};

// Get current user ID when component is created
onMounted(async () => {
  try {
    currentUserId.value = await UserService.getCurrentUserId();
    await fetchEmails();
  } catch (err) {
    console.error('Error initializing:', err);
    error.value = 'Error al cargar los datos del usuario';
  }
});

const fetchEmails = async () => {
  try {
    isLoading.value = true;
    error.value = '';
    const response = await EmailService.getEmails();
    // The API returns the array directly, not wrapped in a data property
    let emailList = Array.isArray(response) ? response : [];

    console.log('Current user ID:', currentUserId.value);
    console.log('Email list before filtering:', emailList);

    // Filter out emails where sender and recipient are the same user
    emailList = emailList.filter(email => email.user_id !== email.recipient_id);

    console.log('Email list after filtering:', emailList);

    // Fetch sender info for each email
    const emailsWithSenders = await Promise.all(emailList.map(async (email) => {
      if (email.user_id) {
        const senderEmail = await fetchUser(email.user_id);
        return { ...email, senderEmail };
      }
      return { ...email, senderEmail: 'Sistema' };
    }));

    emails.value = emailsWithSenders;
    console.log('Emails loaded:', emails.value);
  } catch (err) {
    console.error('Error fetching emails:', err);
    error.value = 'Error al cargar los correos. Por favor, inténtalo de nuevo.';
  } finally {
    isLoading.value = false;
  }
};

// Fetch emails when component is mounted
onMounted(() => {
  fetchEmails();
});

defineExpose({
  fetchEmails
});
</script>
