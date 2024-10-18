// tailwind.config.js
module.exports = {
  mode: 'jit',
  content: [
    "./src/**/*.{html,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require("@tailwindcss/line-clamp"),
  ],
};
