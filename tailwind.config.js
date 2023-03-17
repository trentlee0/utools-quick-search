/** @type {import("tailwindcss").Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  darkMode: 'media',
  prefix: '',
  theme: {
    extend: {
      colors: {
        'utools-black': '#303133'
      }
    }
  },
  plugins: []
}
