<script setup lang="ts">
import { ref } from 'vue';
import { useForm, useField } from 'vee-validate';
import * as yup from 'yup';
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();

const schema = yup.object({
  email: yup.string()
    .required('Email is required')
    .email('Invalid email format'),
});

const { handleSubmit, errors } = useForm({
  validationSchema: schema,
  validateOnBlur: true,
  validateOnChange: true,
  validateOnInput: true,
});

const { value: email } = useField('email');

const statusMessage = ref('');
const isSuccess = ref(false);

const onSubmit = handleSubmit(async (values) => {
  try {
    await authStore.forgotPassword(values.email);
    statusMessage.value = 'Password reset link sent to your email!';
    isSuccess.value = true;
  } catch (error) {
    statusMessage.value = 'Failed to send reset link. Please try again.';
    isSuccess.value = false;
  }
});
</script>

<template>
  <div class="flex items-center justify-center min-h-screen bg-blue-100">
    <div class="w-full max-w-md p-8 bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transform -rotate-1">
      <h2 class="text-3xl font-bold mb-6 transform rotate-2 bg-yellow-300 inline-block px-4 py-2 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">Forgot Password</h2>

      <form @submit="onSubmit" class="space-y-6">
        <div>
          <label for="email" class="block text-lg font-bold text-black">Email</label>
          <input
            type="email"
            id="email"
            v-model="email"
            :class="{'border-red-500': errors.email}"
            class="mt-1 block w-full border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] py-2 px-3 focus:outline-none focus:bg-pink-200 bg-white transition-colors duration-300"
          >
          <p v-if="errors.email" class="mt-1 text-red-500">{{ errors.email }}</p>
        </div>
        <div v-if="statusMessage" :class="{'bg-green-100': isSuccess, 'bg-red-100': !isSuccess}" class="border-2 border-black p-2 font-bold">
          {{ statusMessage }}
        </div>
        <button
          type="submit"
          class="w-full bg-blue-600 hover:bg-blue-700 text-white text-xl font-bold py-3 px-6 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all duration-300 transform hover:rotate-1"
        >
          Reset Password
        </button>
      </form>

      <div class="mt-8 text-center">
        <p class="text-lg">
          Remembered your password?
          <router-link to="/login"
            class="text-blue-600 hover:text-blue-800 font-bold underline">
            Log in here
          </router-link>
        </p>
      </div>
    </div>
  </div>
</template>
