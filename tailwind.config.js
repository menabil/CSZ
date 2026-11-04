const c = (name) => `rgb(var(--${name}) / <alpha-value>)`;

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        page: c("page"), card: c("card"), ink: c("ink"), mute: c("mute"), line: c("line"),
        brand: c("brand"), onbrand: c("onbrand"), accent: c("accent"), tile: c("tile"),
      },
      fontFamily: { sans: ["Inter", "system-ui", "sans-serif"] },
      boxShadow: {
        soft: "0 1px 2px rgb(15 23 42 / 0.05), 0 8px 24px -10px rgb(15 23 42 / 0.15)",
        lift: "0 2px 4px rgb(15 23 42 / 0.05), 0 18px 36px -14px rgb(37 99 235 / 0.35)",
      },
    },
  },
  plugins: [],
};
