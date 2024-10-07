/* eslint-disable @typescript-eslint/no-require-imports */
import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["selector"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "background-light": "#F9F9F9",
        "foreground-light": "#202537",
        "background-dark": "#262B3C",
        "foreground-dark": "#DADCE0",
        gray: {
          100: "#F3F3F3",
          500: "#939B9F",
        },
        green: {
          400: "#66A060",
        },
        yellow: {
          400: "#CEB02C",
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
