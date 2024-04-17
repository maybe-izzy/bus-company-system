/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        'soft-black': 'rgba(0, 0, 0, 0.85)',
      },
    },
  },
  plugins: [require("daisyui")],
};
