<template>
  <div class="min-h-screen bg-gray-100">
    <!-- Navigation -->
    <nav class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
            <div class="flex-shrink-0 flex items-center">
              <svg class="h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span class="ml-2 text-xl font-semibold text-gray-800">Sistema de Correos</span>
            </div>
          </div>
          <div class="flex items-center space-x-4">
            <div class="relative">
              <button
                @click="showLogoutDropdown = !showLogoutDropdown"
                class="flex items-center space-x-2 text-sm font-medium text-gray-700 hover:text-gray-900 focus:outline-none"
              >
                <div class="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                  <svg class="h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
                  </svg>
                </div>
                <span class="hidden md:inline">{{ userEmail }}</span>
                <svg class="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
                </svg>
              </button>
              
              <!-- Dropdown menu -->
              <div v-if="showLogoutDropdown" class="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10" role="menu" aria-orientation="vertical" aria-labelledby="user-menu">
                <div class="py-1" role="none">
                  <button
                    @click="handleLogout"
                    class="w-full text-left block px-4 py-2 text-sm text-red-700 hover:bg-red-50"
                    role="menuitem"
                  >
                    <div class="flex items-center">
                      <svg class="mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Cerrar sesión
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div class="px-4 py-6 sm:px-0">
        <div class="bg-white shadow overflow-hidden sm:rounded-lg">
          <div class="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h3 class="text-lg leading-6 font-medium text-gray-900">
              Gestión de Correos
            </h3>
            <p class="mt-1 max-w-2xl text-sm text-gray-500">
              Envía y revisa tus correos electrónicos
            </p>
          </div>
          
          <div class="p-6 space-y-8">
            <EmailForm @email-sent="refreshEmailList" />
            <div class="border-t border-gray-200 pt-6">
              <EmailList ref="emailList" />
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import EmailForm from '@/components/EmailForm.vue';
import EmailList from '@/components/EmailList.vue';

const router = useRouter();
const emailList = ref(null);
const showLogoutDropdown = ref(false);
const userEmail = ref('');

// Cerrar el menú desplegable al hacer clic fuera
document.addEventListener('click', (e) => {
  if (!e.target.closest('.relative')) {
    showLogoutDropdown.value = false;
  }
});

// Obtener el correo del usuario al cargar el componente
onMounted(() => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  userEmail.value = user.email || 'Usuario';
});

const refreshEmailList = () => {
  if (emailList.value) {
    emailList.value.fetchEmails();
  }
};

// Handle logout
const handleLogout = () => {
  // Eliminar la cookie de autenticación
  document.cookie = 'auth_token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
  // Eliminar datos de usuario del localStorage
  localStorage.removeItem('user');
  // Redirigir al login
  router.push('/login');
};
</script>
