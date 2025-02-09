<script setup lang="ts">
import {ref} from 'vue';
import {useForm, useField} from 'vee-validate';
import * as yup from 'yup';
import {useAuthStore} from '@/stores/auth';

const authStore = useAuthStore();

const schema = yup.object({
  fullName: yup.string().required('Full name is required').min(2, 'Full name must be at least 2 characters'),
  email: yup.string().required('Email is required').email('Invalid email format'),
  password: yup.string()
      .required('Password is required')
      .min(8, 'Password must be at least 8 characters')
      .matches(/[A-Z]/, 'Password must contain an uppercase letter')
      .matches(/[a-z]/, 'Password must contain a lowercase letter')
      .matches(/[0-9]/, 'Password must contain a number')
      .matches(/[^A-Za-z0-9]/, 'Password must contain a special character'),
  confirmPassword: yup.string()
      .required('Please confirm your password')
      .oneOf([yup.ref('password')], 'Passwords must match'),
});

const {handleSubmit, errors, values} = useForm({
  validationSchema: schema,
});

const {value: fullName} = useField('fullName');
const {value: email} = useField('email');
const {value: password} = useField('password');
const {value: confirmPassword} = useField('confirmPassword');

const errorMessage = ref('');
const isRegistered = ref(false);

const onSubmit = handleSubmit(async (values) => {
  try {
    const result = await authStore.register(values.fullName, values.email, values.password);
    if (result.success) {
      isRegistered.value = true;
    } else {
      errorMessage.value = result.error;
      // If it's an email exists error, focus the email input
      if (result.error.includes('email is already registered')) {
        document.getElementById('email')?.focus();
      }
    }
  } catch (error) {
    errorMessage.value = 'Registration failed. Please try again.';
  }
});

const passwordStrength = (password: string) => {
  if (!password) return {text: '', color: ''};
  if (password.length < 8) return {text: 'Too short', color: 'text-red-500'};
  if (schema.fields.password.isValidSync(password)) return {text: 'Strong', color: 'text-green-500'};
  return {text: 'Weak', color: 'text-yellow-500'};
};
</script>

<template>
  <div class="flex items-center justify-center min-h-screen bg-blue-100">
    <div
        class="w-full max-w-md p-8 bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transform -rotate-1">
      <h2 class="text-3xl font-bold mb-6 transform rotate-2 bg-yellow-300 inline-block px-4 py-2 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        {{ isRegistered ? 'Registration Successful!' : 'Register' }}
      </h2>

      <div v-if="isRegistered" class="space-y-4">
        <p class="text-lg font-bold mb-4 bg-green-200 border-2 border-black p-2 inline-block transform -rotate-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
          Your account has been created!
        </p>
        <p>An activation email has been sent to your email address. Please check your inbox and click on the activation
          link to complete your registration.</p>
        <p>Once your account is activated, you will be able to log in.</p>
        <router-link to="/login"
                     class="block w-full bg-blue-500 hover:bg-blue-600 text-white text-center text-xl font-bold py-3 px-6 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all duration-300 transform hover:rotate-1">
          Go to Login Page
        </router-link>
      </div>

      <template v-else>
        <p class="text-lg font-bold mb-4 bg-yellow-200 border-2 border-black p-2 inline-block transform -rotate-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
          Heads up! All fields are required.
        </p>

        <form @submit="onSubmit" class="space-y-6">
          <div>
            <label for="fullName" class="block text-lg font-bold text-black">Full Name</label>
            <input
                type="text"
                id="fullName"
                v-model="fullName"
                :class="{'border-red-500': errors.fullName}"
                class="mt-1 block w-full border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] py-2 px-3 focus:outline-none focus:bg-pink-200 bg-white transition-colors duration-300"
            >
            <p v-if="errors.fullName" class="mt-1 text-red-500">{{ errors.fullName }}</p>
          </div>
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
            <div v-if="password" class="mt-2 text-sm" :class="passwordStrength(password).color">
              Password strength: {{ passwordStrength(password).text }}
            </div>
            <p v-if="errors.password" class="mt-1 text-red-500">{{ errors.password }}</p>
          </div>
          <div>
            <label for="confirmPassword" class="block text-lg font-bold text-black">Confirm Password</label>
            <input
                type="password"
                id="confirmPassword"
                v-model="confirmPassword"
                :class="{'border-red-500': errors.confirmPassword}"
                class="mt-1 block w-full border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] py-2 px-3 focus:outline-none focus:bg-pink-200 bg-white transition-colors duration-300"
            >
            <p v-if="errors.confirmPassword" class="mt-1 text-red-500">{{ errors.confirmPassword }}</p>
          </div>
          <div v-if="errorMessage"
               class="bg-red-100 border-2 border-black p-4 font-bold text-red-600 rounded-lg shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transform -rotate-1">
            {{ errorMessage }}
            <div v-if="errorMessage.includes('email is already registered')" class="mt-2">
              <router-link to="/login"
                           class="text-blue-600 hover:text-blue-800 underline">
                Click here to log in
              </router-link>
            </div>
          </div>
          <button
              type="submit"
              class="w-full bg-green-600 hover:bg-green-700 text-white text-xl font-bold py-3 px-6 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all duration-300 transform hover:rotate-1"
          >
            Register
          </button>
        </form>

        <div class="mt-8 text-center">
          <p class="text-lg">
            Already have an account?
            <router-link to="/login"
                         class="text-blue-600 hover:text-blue-800 font-bold underline">
              Log in here
            </router-link>
          </p>
        </div>
      </template>
    </div>
  </div>
</template>
