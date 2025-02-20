import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        author: ["Author", "serif"],
        generalSans: ["General Sans", "sans-serif"],
      },
      textStyles: {
        smButton: {
          fontSize: "14px",
          fontWeight: "600",
          lineHeight: "1.5",
        },
        mdButton: {
          fontSize: "16px",
          fontWeight: "600",
          lineHeight: "1.5",
        },
        lgButton: {
          fontSize: "20px",
          fontWeight: "600",
          lineHeight: "1.5",
        },
      },

      colors: {
        warmerMocha: "#4A3E3B",
        darkMocha: "#3A2E2B",
        lightGray: "#1A1A1A",
        charcoalBlack: "#1B1B1B",
        deepGray: "#252525",
        warmBeige: "#EAE0D5",
        mutedSand: "#BFB6A8",
        burntAmber: "#D68C45",
        deepCopper: "#B36E30",
        mutedTeal: "#32A67F",
        warmRed: "#D14343",
        slightlyLightGrey: "#2E2E2E",

        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [],
} satisfies Config;
