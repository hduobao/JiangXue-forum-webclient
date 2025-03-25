// tailwind.config.js
module.exports = {
  mode: 'jit',
  content: [
    "./src/**/*.{html,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      scrollbar: {
        hide: {
          '-ms-overflow-style': 'none',  /* IE and Edge */
          'scrollbar-width': 'none',     /* Firefox */
          '&::-webkit-scrollbar': {      /* Chrome, Safari, Opera */
            display: 'none',
          },
        },
      },
    },
  },
  plugins: [
    require("@tailwindcss/line-clamp"),
    require('tailwind-scrollbar-hide'),
  ],
};
