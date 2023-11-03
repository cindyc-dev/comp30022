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
        light: {
          "color-scheme": "light",
          primary: "#423689",
          "primary-content": "#ffffff",
          secondary: "#D8DEFF",
          accent: "#282B40",
          neutral: "#423689",
          "neutral-content": "#ffffff",
          "neutral-focus": "#44529B",
          "base-100": "#ffffff",
          info: "#85C1F9",
          success: "#96D9A9",
          warning: "#F9D885",
          error: "#F98585",
        },
      },
      {
        dark: {
          "color-scheme": "dark",
          primary: "#8074c8",
          "primary-content": "#ffffff",
          secondary: "#423689",
          accent: "#ffb86c",
          neutral: "#8489a4",
          "base-100": "#282a36",
          "base-content": "#f8f8f2",
          info: "#8be9fd",
          success: "#50fa7b",
          warning: "#f1fa8c",
          error: "#ff5555",
        },
      },
      {
        valentine: {
          "color-scheme": "light",
          primary: "#e96d7b",
          secondary: "#f1a5ae",
          accent: "#88dbdd",
          neutral: "#af4670",
          "neutral-content": "#f0d6e8",
          "base-100": "#f0d6e8",
          "base-content": "#632c3b",
          info: "#2563eb",
          success: "#16a34a",
          warning: "#d97706",
          error: "#dc2626",
          "--rounded-btn": "1.9rem",
        },
      },
      "cyberpunk",
      "aqua",
      "lofi",
      "pastel",
      "wireframe",
      "bumblebee",
      "coffee"
    ],
  },
  plugins: [require("@tailwindcss/typography"), require("daisyui")],
} satisfies Config;
