<template>
  <div class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-xl shadow-xl w-full max-w-md transform transition-all">
      <div class="p-6">
        <div class="flex justify-between items-center mb-6">
          <h3 class="text-xl font-semibold text-gray-900">
            {{ isEditing ? 'Editar Usuario' : 'Nuevo Usuario' }}
          </h3>
          <button
            @click="$emit('close')"
            class="text-gray-400 hover:text-gray-500 transition-colors"
            :disabled="loading"
          >
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-5">
          <!-- Error Message -->
          <div v-if="formError" class="bg-red-50 border-l-4 border-red-400 p-4 rounded">
            <div class="flex">
              <div class="flex-shrink-0">
                <svg class="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                </svg>
              </div>
              <div class="ml-3">
                <p class="text-sm text-red-700">{{ formError }}</p>
              </div>
            </div>
          </div>
          <!-- Name -->
          <div class="space-y-1">
            <label class="block text-sm font-medium text-gray-700">
              Nombre <span class="text-red-500">*</span>
            </label>
            <div class="relative rounded-md shadow-sm">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <UserIcon class="h-5 w-5 text-gray-400" />
              </div>
              <input
                v-model="formData.name"
                type="text"
                required
                :disabled="loading"
                class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Nombre completo"
              >
            </div>
          </div>

          <!-- Email - Only show when creating new user -->
          <div v-if="!isEditing" class="space-y-1">
            <label class="block text-sm font-medium text-gray-700">
              Email <span class="text-red-500">*</span>
            </label>
            <div class="relative rounded-md shadow-sm">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <EnvelopeIcon class="h-5 w-5 text-gray-400" />
              </div>
              <input
                v-model="formData.email"
                type="email"
                required
                :disabled="loading"
                class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="correo@ejemplo.com"
              >
            </div>
          </div>

          <!-- Password Fields -->
          <div v-if="!isEditing" class="space-y-1">
            <label class="block text-sm font-medium text-gray-700">
              Contraseña <span class="text-red-500">*</span>
            </label>
            <div class="relative rounded-md shadow-sm">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <LockClosedIcon class="h-5 w-5 text-gray-400" />
              </div>
              <input
                v-model="formData.password"
                type="password"
                required
                :disabled="loading"
                class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="••••••••"
              >
            </div>
          </div>

          <!-- Password Change Fields (for existing users) -->
          <div v-if="isEditing" class="space-y-4 border-gray-200">

            <div class="space-y-3">
              <div class="space-y-1">
                <label class="block text-sm font-medium text-gray-700">Nueva Contraseña</label>
                <div class="relative rounded-md shadow-sm">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <LockClosedIcon class="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    v-model="formData.new_password"
                    type="password"
                    :disabled="loading"
                    class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Dejar en blanco para no cambiar"
                  >
                </div>
              </div>
              <div class="space-y-1">
                <label class="block text-sm font-medium text-gray-700">Confirmar Nueva Contraseña</label>
                <div class="relative rounded-md shadow-sm">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <LockClosedIcon class="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    v-model="formData.new_password_confirmation"
                    type="password"
                    :disabled="loading || !formData.new_password"
                    class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Confirmar nueva contraseña"
                  >
                </div>
                <p v-if="formData.new_password && formData.new_password !== formData.new_password_confirmation"
                   class="mt-1 text-sm text-red-600">
                  Las contraseñas no coinciden
                </p>
              </div>
            </div>
          </div>

          <!-- Phone Number -->
          <div class="space-y-1">
            <label class="block text-sm font-medium text-gray-700">
              Teléfono
            </label>
            <div class="relative rounded-md shadow-sm">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <PhoneIcon class="h-5 w-5 text-gray-400" />
              </div>
              <input
                v-model="formData.phone_number"
                type="tel"
                :disabled="loading"
                class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="+1 (555) 000-0000"
              >
            </div>
          </div>

          <!-- City Code -->
          <div class="space-y-1">
            <label class="block text-sm font-medium text-gray-700">
              Código de Ciudad <span class="text-red-500">*</span>
            </label>
            <div class="relative rounded-md shadow-sm">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MapPinIcon class="h-5 w-5 text-gray-400" />
              </div>
              <input
                v-model="formData.city_code"
                type="number"
                required
                :disabled="loading"
                class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Código de ciudad"
              >
            </div>
          </div>

          <!-- ID Number - Only show when creating new user -->
          <div v-if="!isEditing" class="space-y-1">
            <label class="block text-sm font-medium text-gray-700">
              Número de Cédula <span class="text-red-500">*</span>
            </label>
            <div class="relative rounded-md shadow-sm">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <IdentificationIcon class="h-5 w-5 text-gray-400" />
              </div>
              <input
                v-model="formData.id_number"
                type="text"
                inputmode="numeric"
                pattern="[0-9]*"
                @input="formatIdNumber($event)"
                required
                :disabled="loading"
                class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Número de cédula"
              >
            </div>
          </div>

          <!-- Birth Date -->
          <div class="space-y-1">
            <label class="block text-sm font-medium text-gray-700">
              Fecha de Nacimiento <span class="text-red-500">*</span>
            </label>
            <div class="relative rounded-md shadow-sm">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <CalendarIcon class="h-5 w-5 text-gray-400" />
              </div>
              <input
                v-model="formData.birth_date"
                type="date"
                required
                :disabled="loading"
                class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
            </div>
          </div>

          <!-- Form Actions -->
          <div class="flex justify-end space-x-3 pt-2">
            <button
              type="button"
              @click="$emit('close')"
              :disabled="loading"
              class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancelar
            </button>
            <button
              type="submit"
              :disabled="loading"
              class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span v-if="loading" class="flex items-center">
                <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Guardando...
              </span>
              <span v-else>
                {{ isEditing ? 'Actualizar' : 'Crear Usuario' }}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import {
  UserIcon,
  EnvelopeIcon,
  LockClosedIcon,
  PhoneIcon,
  MapPinIcon,
  IdentificationIcon,
  CalendarIcon
} from '@heroicons/vue/24/outline';

const props = defineProps({
  user: {
    type: Object,
    default: () => ({
      name: '',
      email: '',
      password: '',
      phone_number: '',
      city_code: '',
      id_number: '',
      birth_date: ''
    })
  },
  isEditing: {
    type: Boolean,
    default: false
  },
  loading: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['submit', 'close']);

const formError = ref(null);
const formData = ref({
  name: '',
  email: '',
  password: '',
  password_confirmation: '',
  new_password: '',
  new_password_confirmation: '',
  id_number: '',
  phone_number: '',
  birth_date: '',
  role: 'user',
  status: 'active'
});

// Format ID number to ensure it's treated as text (to preserve leading zeros)
const formatIdNumber = (event) => {
  // Only allow numbers
  const value = event.target.value.replace(/\D/g, '');
  // Update the model with the numeric value
  formData.value.id_number = value;
};

// Initialize form with user data when props change
watch(() => props.user, (newVal) => {
  if (newVal) {
    formData.value = { ...formData.value, ...newVal };
    // Ensure ID number is treated as string to preserve leading zeros
    if (newVal.id_number !== undefined) {
      formData.value.id_number = String(newVal.id_number);
    }
  }
}, { immediate: true, deep: true });

const handleSubmit = async () => {
  try {
    if (props.loading) return;
    formError.value = null;

    const dataToSubmit = { ...formData.value };

    // Remove password fields if not changing password (for existing users)
    if (props.isEditing) {
      if (!dataToSubmit.new_password) {
        delete dataToSubmit.new_password;
        delete dataToSubmit.new_password_confirmation;
      } else {
        // If changing password, move new_password to password field for the API
        dataToSubmit.password = dataToSubmit.new_password;
        dataToSubmit.password_confirmation = dataToSubmit.new_password_confirmation;
        delete dataToSubmit.new_password;
        delete dataToSubmit.new_password_confirmation;
      }
      // Don't send empty password field if not changing it
      delete dataToSubmit.password;
    }

    // Convert empty strings to null for optional fields
    if (dataToSubmit.phone_number === '') {
      dataToSubmit.phone_number = null;
    }

    // Emit the submit event and wait for the parent to handle it
    await new Promise((resolve, reject) => {
      emit('submit', dataToSubmit, {
        onSuccess: resolve,
        onError: (error) => {
          // Format the error message to be more user-friendly
          if (error.response?.data?.message) {
            formError.value = error.response.data.message;
          } else if (error.response?.data?.errors) {
            // Handle Laravel validation errors
            const errors = error.response.data.errors;
            formError.value = Object.values(errors).flat().join(' ');
          } else {
            formError.value = 'Ocurrió un error al procesar la solicitud. Por favor, inténtalo de nuevo.';
          }
          reject(error);
        }
      });
    });
  } catch (error) {
    // Error is already handled in the onError callback
    console.error('Error in form submission:', error);
  } finally {
    // Loading state is managed by parent
  }
};
</script>
