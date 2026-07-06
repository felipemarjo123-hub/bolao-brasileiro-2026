import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0A1128", // Azul Marinho Profundo
        foreground: "#f8fafc",
        primary: {
          DEFAULT: "#ccff00", // Verde Limão Neon
          foreground: "#0A1128", // Texto escuro no fundo neon para contraste
          dark: "#a3cc00",
        },
        card: {
          DEFAULT: "#121C3D", // Azul um pouco mais claro para cards
          foreground: "#f3f4f6",
        }
      },
    },
  },
  plugins: [],
};
export default config;
