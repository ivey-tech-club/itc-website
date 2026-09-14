import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
	src: "./fonts/GeistVF.woff",
	variable: "--font-geist-sans",
	weight: "100 900",
});
const geistMono = localFont({
	src: "./fonts/GeistMonoVF.woff",
	variable: "--font-geist-mono",
	weight: "100 900",
});
const redFive = localFont({
	src: "./fonts/REDFIVE_.woff",
	variable: "--font-redfive",
	weight: "400",
});
const montreal = localFont({
	src: [
		{ path: "./fonts/Montreal-Regular.ttf", weight: "400", style: "normal" },
		{ path: "./fonts/Montreal-Bold.ttf", weight: "700", style: "normal" },
	],
	variable: "--font-montreal",
});

export const metadata: Metadata = {
	title: "Ivey Tech Club",
	description: "Ivey's technology commnunity",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body
				className={`${geistSans.variable} ${geistMono.variable} ${redFive.variable} ${montreal.variable} antialiased`}
			>
				{children}
			</body>
		</html>
	);
}
