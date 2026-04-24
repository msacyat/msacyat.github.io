/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#06111f",
        mist: "#eef4ff",
        sky: "#7cc7ff",
        peach: "#ffb18b",
      },
      boxShadow: {
        glow: "0 20px 60px rgba(4, 14, 28, 0.35)",
      },
      fontFamily: {
        sans: ["Aptos", "Segoe UI", "Helvetica Neue", "Arial", "sans-serif"],
      },
      backdropBlur: {
        xs: "3px",
      },
      backgroundImage: {
        "hero-grid":
          "radial-gradient(circle at top left, rgba(124, 199, 255, 0.22), transparent 32%), radial-gradient(circle at 85% 18%, rgba(255, 177, 139, 0.18), transparent 24%), linear-gradient(180deg, #10203c 0%, #07111f 50%, #020611 100%)",
      },
    },
  },
  plugins: [],
};
