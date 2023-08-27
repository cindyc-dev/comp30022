import { type Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {}
    },
  },
  plugins: [require("@tailwindcss/typography"), require("daisyui")],
} satisfies Config;
