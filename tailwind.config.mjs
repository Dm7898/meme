/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#1DB954",
        darkBg: "#121212",
        greentxt: "#017848",
      },
      fontFamily: {
        poppins: "var(--font-poppins), sans-serif",
      },
    },
  },
  plugins: [],
};
