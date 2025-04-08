import type { Config } from "tailwindcss"

export default {
    darkMode: ["class"],
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            fontSize: {
                "14": "0.875rem",
                "16": "1px",
            },
            lineHeight: {
                "4.5": "18",
            },

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
                accentText: "#252525",
                burntAmber: "#D68C45",
                charcoalBlack: "#1B1B1B",
                charcoalGray: "#2D2D2D",
                darkMocha: "#3A2E2B",
                deepBlue: "#1E3A8A",
                deepCopper: "#B36E30",
                deepGray: "#252525",
                darkMutedTeal: "#1A2C34",
                lightGray: "#1A1A1A",
                mutedSand: "#BFB6A8",
                mutedTeal: "#6B9797",
                slightlyLightGrey: "#2E2E2E",
                warmBeige: "#EAE0D5",
                warmerMocha: "#4A3E3B",
                warmRed: "#D14343",

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
} satisfies Config
