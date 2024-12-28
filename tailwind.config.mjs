/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#e6f0fa',
          100: '#cce1f5',
          200: '#99c2eb',
          300: '#66a4e1',
          400: '#3385d7',
          500: '#0056b3',  // Our main primary color
          600: '#004590',
          700: '#00346c',
          800: '#002249',
          900: '#001125',
        },
        secondary: {
          50: '#ffffff',
          100: '#fefefe',
          200: '#fdfdfd',
          300: '#fcfcfc',
          400: '#fafbfb',
          500: '#f8f9fa',  // Our main secondary color
          600: '#c6c7c8',
          700: '#959596',
          800: '#636464',
          900: '#323232',
        },
        accent: {
          50: '#e6f9fd',
          100: '#ccf3fa',
          200: '#99e7f6',
          300: '#66dbf1',
          400: '#33cfed',
          500: '#00b4d8',  // Our main accent color
          600: '#0090ad',
          700: '#006c82',
          800: '#004856',
          900: '#00242b',
        },
      },
    },
  },
  plugins: [],
}