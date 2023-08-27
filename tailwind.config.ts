import { type Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  safelist: [
    {
      pattern: /badge-(info|success|warning|error|primary)/,
    },
  ],
  daisyui: {
    themes: [
      {
        potatotheme: {
          primary: "#626FB5",
          secondary: "#D8DEFF",
          accent: "#282B40",
          neutral: "#626FB5",
          "neutral-content": "#ffffff",
          "neutral-focus": "#44529B",
          "base-100": "#ffffff",
          info: "#85C1F9",
          success: "#96D9A9",
          warning: "#F9D885",
          error: "#F98585",
        },
      },
    ],
  },
  plugins: [require("@tailwindcss/typography"), require("daisyui")],
} satisfies Config;
