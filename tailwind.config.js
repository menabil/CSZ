const c = (name) => `rgb(var(--${name}) / <alpha-value>)`;

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        page: c("page"),
        card: c("card"),
        ink: c("ink"),
        mute: c("mute"),
        line: c("line"),
        brand: c("brand"),
        onbrand: c("onbrand"),
        copper: c("copper"),
        tile: c("tile"),
        deep: c("deep"),
      },
      fontFamily: {
        display: ['"Space Grotesk"', "system-ui", "sans-serif"],
        sans: ['"IBM Plex Sans"', "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 1px 2px rgb(0 0 0 / 0.04), 0 8px 24px -8px rgb(0 0 0 / 0.12)",
        lift: "0 2px 4px rgb(0 0 0 / 0.05), 0 18px 36px -12px rgb(11 110 79 / 0.28)",
      },
    },
  },
  plugins: [],
};
