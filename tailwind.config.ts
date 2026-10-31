import type { Config } from "tailwindcss";
const color = (name: string) => "rgb(var(--" + name + ") / <alpha-value>)";
const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}"],
  darkMode: ["class", '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        canvas: color("canvas"),
        surface: color("surface"),
        soft: color("soft"),
        line: color("line"),
        ink: color("ink"),
        muted: color("muted"),
        accent: color("accent"),
        strong: color("strong"),
        "on-strong": color("on-strong"),
      },
      borderRadius: { md: "8px", lg: "12px" },
    },
  },
  plugins: [],
};
export default config;
