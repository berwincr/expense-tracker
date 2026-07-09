/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "#10151F",
          50: "#F4F6F5",
          100: "#E4E8E6",
          200: "#C7CFCB",
          300: "#9BA8A2",
          400: "#6B7A73",
          500: "#4A5850",
          600: "#333F39",
          700: "#232B26",
          800: "#171D1A",
          900: "#10151F",
        },
        paper: "#F4F6F5",
        emerald: {
          DEFAULT: "#1B8A5A",
          50: "#EAF6EF",
          100: "#CDEBD9",
          500: "#1B8A5A",
          600: "#146E47",
          700: "#0F5537",
        },
        rust: {
          DEFAULT: "#C1432C",
          50: "#FBEBE7",
          100: "#F4CCC2",
          500: "#C1432C",
          600: "#A23522",
          700: "#7E2A1A",
        },
        signal: {
          DEFAULT: "#2F6FED",
          50: "#EAF1FE",
          500: "#2F6FED",
          600: "#1E56C7",
        },
      },
      fontFamily: {
        display: ["Fraunces", "serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["IBM Plex Mono", "ui-monospace", "monospace"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(16, 21, 31, 0.06), 0 1px 8px rgba(16, 21, 31, 0.04)",
      },
      borderRadius: {
        xl2: "0.875rem",
      },
    },
  },
  plugins: [],
};
