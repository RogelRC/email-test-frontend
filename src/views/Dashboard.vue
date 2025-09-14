<template>
  <div class="min-h-screen bg-gray-100">
    <!-- Navigation -->
    <nav class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
            <h1 class="text-xl font-semibold text-gray-800">Panel de Administración</h1>
          </div>
          <div class="flex items-center space-x-4">
            <button
              @click="showUserForm = true"
              class="px-4 py-2 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-md"
            >
              Nuevo Usuario
            </button>
            <button
              @click="handleLogout"
              class="px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md"
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div class="px-4 py-6 sm:px-0">
        <!-- Users Table -->
        <div class="bg-white shadow overflow-hidden sm:rounded-lg">
          <div class="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h3 class="text-lg leading-6 font-medium text-gray-900">
              Gestión de Usuarios
            </h3>
            <p class="mt-1 max-w-2xl text-sm text-gray-500">
              Lista de todos los usuarios registrados en el sistema
            </p>
          </div>

          <!-- Loading State -->
          <div v-if="loading" class="p-6 text-center">
            <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p class="mt-2 text-sm text-gray-600">Cargando usuarios...</p>
          </div>

          <!-- Error State -->
          <div v-if="error" class="p-6 text-center text-red-600">
            <p>Error al cargar los usuarios: {{ error }}</p>
            <button @click="fetchUsers" class="mt-2 text-blue-600 hover:text-blue-800 text-sm">
              Reintentar
            </button>
          </div>

          <!-- Users Table -->
          <div v-else class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nombre
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Código de Ciudad
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Teléfono
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Identificación
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha de Nacimiento
                  </th>
                  <th scope="col" class="relative px-6 py-3">
                    <span class="sr-only">Acciones</span>
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="user in users" :key="user.id" class="hover:bg-gray-50">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-medium text-gray-900">{{ user.name || 'N/A' }}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ user.email || 'N/A' }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ user.city_code || 'N/A' }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ user.phone_number || 'N/A' }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ user.id_number || 'N/A' }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ user.birth_date ? new Date(user.birth_date).toLocaleDateString() : 'N/A' }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button @click="editUser(user)" class="text-blue-600 hover:text-blue-900 mr-4">
                      Editar
                    </button>
                    <button @click="confirmDelete(user)" class="text-red-600 hover:text-red-900">
                      Eliminar
                    </button>
                  </td>
                </tr>
                <tr v-if="users.length === 0">
                  <td colspan="5" class="px-6 py-4 text-center text-sm text-gray-500">
                    No hay usuarios registrados
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Pagination -->
          <div v-if="users.length > 0" class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div class="flex-1 flex justify-between sm:hidden">
              <button
                @click="currentPage > 1 ? currentPage-- : null"
                :disabled="currentPage === 1"
                class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Anterior
              </button>
              <button
                @click="currentPage++"
                :disabled="currentPage * perPage >= totalUsers"
                class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Siguiente
              </button>
            </div>
            <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p class="text-sm text-gray-700">
                  Mostrando <span class="font-medium">{{ (currentPage - 1) * perPage + 1 }}</span>
                  a <span class="font-medium">{{ Math.min(currentPage * perPage, totalUsers) }}</span>
                  de <span class="font-medium">{{ totalUsers }}</span> resultados
                </p>
              </div>
              <div>
                <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    @click="currentPage > 1 ? currentPage-- : null"
                    :disabled="currentPage === 1"
                    :class="{
                      'opacity-50 cursor-not-allowed': currentPage === 1,
                      'hover:bg-gray-50': currentPage > 1
                    }"
                    class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500"
                  >
                    <span class="sr-only">Anterior</span>
                    <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
                    </svg>
                  </button>
                  <button
                    v-for="page in totalPages"
                    :key="page"
                    @click="currentPage = page"
                    :class="{
                      'z-10 bg-blue-50 border-blue-500 text-blue-600': currentPage === page,
                      'bg-white border-gray-300 text-gray-500 hover:bg-gray-50': currentPage !== page
                    }"
                    class="relative inline-flex items-center px-4 py-2 border text-sm font-medium"
                  >
                    {{ page }}
                  </button>
                  <button
                    @click="currentPage < totalPages ? currentPage++ : null"
                    :disabled="currentPage >= totalPages"
                    :class="{
                      'opacity-50 cursor-not-allowed': currentPage >= totalPages,
                      'hover:bg-gray-50': currentPage < totalPages
                    }"
                    class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500"
                  >
                    <span class="sr-only">Siguiente</span>
                    <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                    </svg>
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- User Form Modal -->
    <UserForm
      v-if="showUserForm"
      :user="currentUser"
      :is-editing="!!currentUser"
      :loading="formLoading"
      @close="closeUserForm"
      @submit="handleUserSubmit"
    />

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteConfirm" class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-xl shadow-xl w-full max-w-md transform transition-all">
        <div class="p-6">
          <div class="flex justify-between items-center mb-6">
            <h3 class="text-xl font-semibold text-gray-900">
              Confirmar eliminación
            </h3>
            <button
              @click="showDeleteConfirm = false"
              class="text-gray-400 hover:text-gray-500 transition-colors"
              :disabled="deleting"
            >
              <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div class="space-y-6">
            <div class="bg-red-50 border-l-4 border-red-400 p-4 rounded-md">
              <div class="flex">
                <div class="flex-shrink-0">
                  <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                  </svg>
                </div>
                <div class="ml-3">
                  <p class="text-sm text-red-700">
                    ¿Estás seguro de que deseas eliminar al usuario <span class="font-semibold">{{ currentUser?.name }}</span>?
                    Esta acción no se puede deshacer y todos los datos asociados se perderán permanentemente.
                  </p>
                </div>
              </div>
            </div>

            <div class="flex justify-end space-x-3 pt-2">
              <button
                type="button"
                @click="showDeleteConfirm = false"
                :disabled="deleting"
                class="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Cancelar
              </button>
              <button
                type="button"
                @click="deleteUser"
                :disabled="deleting"
                class="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <svg v-if="deleting" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <svg v-else class="-ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                {{ deleting ? 'Eliminando...' : 'Eliminar' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AdminDashboard',
}
</script>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import UserService from '@/services/UserService';
import UserForm from '@/components/UserForm.vue';

const router = useRouter();

// State
const users = ref([]);
const loading = ref(true);
const error = ref(null);
const showUserForm = ref(false);
const currentUser = ref(null);
const formLoading = ref(false);
const showDeleteConfirm = ref(false);
const deleting = ref(false);

// Pagination
const currentPage = ref(1);
const perPage = 10;
const totalUsers = ref(0);
const totalPages = ref(1);

// Fetch all users and handle pagination on the client side
const allUsers = ref([]);

const fetchUsers = async () => {
  try {
    loading.value = true;
    error.value = null;

    // Only fetch users if we haven't already
    if (allUsers.value.length === 0) {
      const response = await UserService.getUsers();
      allUsers.value = Array.isArray(response) ? response : [];
      totalUsers.value = allUsers.value.length;
      totalPages.value = Math.ceil(totalUsers.value / perPage);
    }

    // Calculate pagination
    const start = (currentPage.value - 1) * perPage;
    const end = start + perPage;
    users.value = allUsers.value.slice(start, end);

  } catch (err) {
    console.error('Error fetching users:', err);
    error.value = err.response?.data?.message || 'Error al cargar los usuarios';
    users.value = [];
    totalUsers.value = 0;
    totalPages.value = 1;
  } finally {
    loading.value = false;
  }
};

// Handle user form submission
const handleUserSubmit = async (userData) => {
  try {
    formLoading.value = true;
    let response;

    if (currentUser.value) {
      // Update existing user
      response = await UserService.updateUser(currentUser.value.id, userData);

      // Update the user in the allUsers array
      const index = allUsers.value.findIndex(u => u.id === currentUser.value.id);
      if (index !== -1) {
        allUsers.value[index] = { ...allUsers.value[index], ...userData };
      }
    } else {
      // Create new user
      response = await UserService.createUser(userData);

      // Add the new user to the beginning of the allUsers array
      allUsers.value.unshift(response);
      totalUsers.value = allUsers.value.length;
      totalPages.value = Math.ceil(totalUsers.value / perPage);

      // Reset to first page to show the new user
      currentPage.value = 1;
    }

    // Update the paginated users list
    const start = (currentPage.value - 1) * perPage;
    const end = start + perPage;
    users.value = allUsers.value.slice(start, end);

    closeUserForm();
  } catch (err) {
    console.error('Error saving user:', err);

    let errorMessage = 'Error al guardar el usuario';

    // Check if we have validation errors
    if (err.errors) {
      const errorMessages = [];
      // Convert the errors object into an array of messages
      Object.entries(err.errors).forEach(([field, messages]) => {
        // Capitalize the first letter of the field name and replace underscores with spaces
        const fieldName = field.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        // Add each error message for this field
        if (Array.isArray(messages)) {
          messages.forEach(message => {
            errorMessages.push(`• ${fieldName}: ${message}`);
          });
        } else if (typeof messages === 'string') {
          errorMessages.push(`• ${fieldName}: ${messages}`);
        }
      });

      if (errorMessages.length > 0) {
        errorMessage = 'Por favor corrija los siguientes errores:\n\n' + errorMessages.join('\n');
      }
    } else if (err.message) {
      // If there's a general error message, use it
      errorMessage = err.message;
    }

    // Show the error message to the user
    alert(errorMessage);
  } finally {
    formLoading.value = false;
  }
};

// Edit user
const editUser = (user) => {
  currentUser.value = { ...user };
  showUserForm.value = true;
};

// Confirm delete
const confirmDelete = (user) => {
  currentUser.value = user;
  showDeleteConfirm.value = true;
};

// Delete user
const deleteUser = async () => {
  if (!currentUser.value) return;

  try {
    deleting.value = true;
    await UserService.deleteUser(currentUser.value.id);

    // Remove the deleted user from allUsers and update the UI
    const userIndex = allUsers.value.findIndex(user => user.id === currentUser.value.id);
    if (userIndex !== -1) {
      allUsers.value.splice(userIndex, 1);
      totalUsers.value = allUsers.value.length;
      totalPages.value = Math.ceil(totalUsers.value / perPage);

      // Update the current page if we deleted the last item on the page
      if (users.value.length === 1 && currentPage.value > 1) {
        currentPage.value--;
      } else {
        // Just update the current page's users
        const start = (currentPage.value - 1) * perPage;
        const end = start + perPage;
        users.value = allUsers.value.slice(start, end);
      }
    }

    showDeleteConfirm.value = false;
    currentUser.value = null;
  } catch (err) {
    console.error('Error deleting user:', err);
    alert(err.response?.data?.message || 'Error al eliminar el usuario');
  } finally {
    deleting.value = false;
  }
};

// Close user form
const closeUserForm = () => {
  showUserForm.value = false;
  currentUser.value = null;
};

// Handle logout
const handleLogout = () => {
  // Eliminar la cookie
  document.cookie = 'auth_token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
  // Eliminar datos de usuario
  localStorage.removeItem('user');
  // Redirigir al login
  router.push('/login');
};

// Watch for page changes
watch(currentPage, () => {
  // Only update the visible users without making a new API call
  const start = (currentPage.value - 1) * perPage;
  const end = start + perPage;
  users.value = allUsers.value.slice(start, end);
});

// Fetch users on component mount
onMounted(() => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  if (!user || !document.cookie.includes('auth_token')) {
    router.push('/login');
  } else {
    fetchUsers();
  }
});
</script>
