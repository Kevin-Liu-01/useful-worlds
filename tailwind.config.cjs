/** @type {import('tailwindcss').Config} */

const config = {
  darkMode: "class",
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        orbiter: ["TASA Orbiter", "system-ui", "sans-serif"],
        nacelle: ["Nacelle", "system-ui", "sans-serif"],
        radio: ["Radio Grotesk", "system-ui", "sans-serif"],
        pangram: ["Pangram Sans", "system-ui", "sans-serif"],
        telegraf: ["Telegraf", "system-ui", "sans-serif"],
        mori: ["PP Mori", "system-ui", "sans-serif"],
        kode: ["Kode Mono", "monospace"],
      },
      colors: {
        gpt: "#f97316",
        gptLight: "#ff842e",
        gptLighter: "#ff944a",
        gptLightest: "#ffb17b",
        gptDark: "#e1650e",
        gptDarker: "#c5570a",
      },
    },
  },
  plugins: [],
};

module.exports = config;
