import type { Metadata } from "next";
``;
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
	variable: "--font-red-five",
	weight: "normal",
});

export const fonts = [geistSans, geistMono, redFive];

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
				className={`${geistSans.variable} ${geistMono.variable} antialiased`}
			>
				{children}
			</body>
		</html>
	);
}
