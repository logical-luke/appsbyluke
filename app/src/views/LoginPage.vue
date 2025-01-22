<script setup lang="ts">
import { ref } from 'vue';
import { useForm, useField } from 'vee-validate';
import * as yup from 'yup';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();

const schema = yup.object({
  email: yup.string()
    .required('Email is required')
    .email('Invalid email format'),
  password: yup.string()
    .required('Password is required'),
});

const { handleSubmit, errors } = useForm({
  validationSchema: schema,
  validateOnBlur: true,
  validateOnChange: true,
  validateOnInput: true,
});

const { value: email } = useField('email');
const { value: password } = useField('password');

const errorMessage = ref('');

const onSubmit = handleSubmit(async (values) => {
  try {
    await authStore.login(values.email, values.password);
    router.push('/dashboard');
  } catch (error) {
    errorMessage.value = 'Invalid email or password';
  }
});
</script>

<template>
  <div class="flex items-center justify-center min-h-screen bg-blue-100">
    <div class="w-full max-w-md p-8 bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transform -rotate-1">
      <h2 class="text-3xl font-bold mb-6 transform rotate-2 bg-yellow-300 inline-block px-4 py-2 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">Login</h2>

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
        <div>
          <label for="password" class="block text-lg font-bold text-black">Password</label>
          <input
            type="password"
            id="password"
            v-model="password"
            :class="{'border-red-500': errors.password}"
            class="mt-1 block w-full border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] py-2 px-3 focus:outline-none focus:bg-pink-200 bg-white transition-colors duration-300"
          >
          <p v-if="errors.password" class="mt-1 text-red-500">{{ errors.password }}</p>
        </div>
        <div v-if="errorMessage" class="bg-red-100 border-2 border-black p-2 font-bold text-red-600">{{ errorMessage }}</div>
        <button
          type="submit"
          class="w-full bg-green-600 hover:bg-green-700 text-white text-xl font-bold py-3 px-6 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all duration-300 transform hover:rotate-1"
        >
          Log In
        </button>
      </form>

      <div class="mt-8 text-center">
        <p class="text-lg mb-2">
          <router-link to="/forgot-password" class="text-blue-600 hover:text-blue-800 font-bold underline">
            Forgot Password?
          </router-link>
        </p>
        <p class="text-lg">
          Don't have an account?
          <router-link to="/register"
            class="text-blue-600 hover:text-blue-800 font-bold underline">
            Register here
          </router-link>
        </p>
      </div>
    </div>
  </div>
</template>
