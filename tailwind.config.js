/** @type {import("tailwindcss").Config} */
export default {
  content: ["./src/**/*.{html,js,svelte,ts}"],
  theme: {
    extend: {
      opacity: {
        15: "0.15",
        7: "0.07"
      },
      width: {
        34: "8.5rem",
        50: "12.5rem",
        38: "9.5rem"
      },
      borderWidth: {
        3: "3px",
        1: "1px"
      },
      textUnderlineOffset: {
        3: "3px"
      },
      padding: {
        0.5: "0.125rem"
      }
    },
    colors: {
      white: "#FFFFFF",
      black: "#000000",
      blackish: "#181818",
      transparent: "#00000000",
      accent: "#e2b714"
    }
  },
  plugins: []
}
