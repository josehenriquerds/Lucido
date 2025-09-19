import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "reef-midnight": "#011f3a",
        "reef-sapphire": "#033e6b",
        "reef-teal": "#0fa3b1",
        "reef-coral": "#ff6f59",
        "reef-sand": "#f6d186",
        "reef-shell": "#000000",
        "reef-algae": "#1bc47d",
        "reef-anemone": "#f4b5c5",
        "reef-ink": "#0b1d26",
        "reef-shadow": "#000000",
      },
      fontFamily: {
        heading: ["Lexend", "ui-sans-serif", "system-ui", "sans-serif"],
        body: ["Atkinson Hyperlegible", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      borderRadius: {
        bubble: "32px",
        lagoon: "44px",
      },
      boxShadow: {
        lagoon: "0 24px 48px rgba(3, 62, 107, 0.25)",
        coral: "0 16px 32px rgba(255, 111, 89, 0.28)",
        shell: "0 12px 24px rgba(255, 246, 233, 0.45)",
      },
      backgroundImage: {
        "reef-depth": "radial-gradient(circle at 20% 20%, rgba(15, 163, 177, 0.22), transparent 55%), radial-gradient(circle at 75% 10%, rgba(244, 181, 197, 0.25), transparent 60%), linear-gradient(180deg, #011f3a 0%, #033e6b 40%, #0fa3b1 100%)",
      },
    },
  },
  plugins: [],
};

export default config;


