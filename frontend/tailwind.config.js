/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./utils/hooks/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    screens: {
      xs: "480px",
      sm: "576px",
      md: "768px",
      lg: "992px",
      xl: "1200px",
      xxl: "1600px",
    },
    extend: {
      animation: {
        push: "push 1s cubic-bezier(0, 0, 0.2, 1) forwards",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      borderRadius: {
        "semi-sm": "0.175rem",
      },
      colors: {
        primary: "#276EF1",
        secondary: "#d9d9d9",
        success: "#02d46a",
        error: "#ff3b30",
        info: "#0097EC",
        warning: "#ffe58f",
        default: "#fafafa99",
        light: "#0505051a",
      },
      fontFamily: {
        sans: ["var(--font-nunito)"],
      },
      fontSize: {
        "semi-sm": "0.75rem",
      },
      keyframes: {
        push: {
          "75%, 100%": {
            transform: "scale(1.3) scaleY(1.4)",
            opacity: "0",
          },
        },
      },
      zIndex: {
        100: "100",
      },
    },
  },
};
