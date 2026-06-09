/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        marca: {
          50:  "#fdf2f4",
          100: "#fce7eb",
          200: "#f9d0d9",
          300: "#f4a8ba",
          400: "#ec7595",
          500: "#df4d72",
          600: "#cc2d55",
          700: "#ac2046",
          800: "#8f1c3c",
          900: "#7a1b38",
          950: "#420a1b",
        },
        neutro: {
          50:  "#f8f7f4",
          100: "#efeee9",
          200: "#dedbd2",
          300: "#c6c2b5",
          400: "#aaa494",
          500: "#948e7d",
          600: "#877f6d",
          700: "#706a5a",
          800: "#5c574c",
          900: "#4c4840",
          950: "#282521",
        },
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
