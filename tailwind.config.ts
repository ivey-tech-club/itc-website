import type { Config } from "tailwindcss";

const config: Config = {
	content: [
		"./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/components/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/app/**/*.{js,ts,jsx,tsx,mdx}",
	],
	theme: {
		extend: {
			fontFamily: {
				syne: ["Syne", "sans-serif"],
			},
			colors: {
				background: "var(--background)",
				foreground: "var(--foreground)",
				iveyGreen: "#034638",
			},
		},
	},
	plugins: [],
};
export default config;
