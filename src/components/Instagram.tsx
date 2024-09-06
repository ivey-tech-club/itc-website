"use client";
import React, { useEffect } from "react";

const InstagramEmbed = () => {
	useEffect(() => {
		// Dynamically add Instagram's script
		const script = document.createElement("script");
		script.src = "https://www.instagram.com/embed.js";
		script.async = true;
		document.body.appendChild(script);
	}, []);

	return (
		<blockquote
			className="instagram-media"
			data-instgrm-permalink="https://www.instagram.com/iveytechclub/"
			data-instgrm-version="12"
			style={{
				background: "#FFF",
				border: 0,
				borderRadius: "3px",
				boxShadow: "0 0 1px 0 rgba(0,0,0,0.5), 0 1px 10px 0 rgba(0,0,0,0.15)",
				margin: "1px",
				maxWidth: "540px",
				minWidth: "326px",
				padding: 0,
				width: "99.375%",
			}}
		>
			<div style={{ padding: "16px" }}>
				<a
					id="main_link"
					href="https://www.instagram.com/iveytechclub/"
					style={{
						background: "#FFFFFF",
						lineHeight: 0,
						padding: "0 0",
						textAlign: "center",
						textDecoration: "none",
						width: "100%",
					}}
					target="_blank"
					rel="noopener noreferrer"
				>
					<div
						style={{
							display: "flex",
							flexDirection: "row",
							alignItems: "center",
						}}
					>
						<div
							style={{
								backgroundColor: "#F4F4F4",
								borderRadius: "50%",
								flexGrow: 0,
								height: "40px",
								marginRight: "14px",
								width: "40px",
							}}
						></div>
						<div
							style={{
								display: "flex",
								flexDirection: "column",
								flexGrow: 1,
								justifyContent: "center",
							}}
						>
							<div
								style={{
									backgroundColor: "#F4F4F4",
									borderRadius: "4px",
									flexGrow: 0,
									height: "14px",
									marginBottom: "6px",
									width: "100px",
								}}
							></div>
							<div
								style={{
									backgroundColor: "#F4F4F4",
									borderRadius: "4px",
									flexGrow: 0,
									height: "14px",
									width: "60px",
								}}
							></div>
						</div>
					</div>
					<div style={{ padding: "19% 0" }}></div>
					<div
						style={{
							display: "block",
							height: "50px",
							margin: "0 auto 12px",
							width: "50px",
						}}
					>
						{/* SVG Icon */}
						<svg
							width="50px"
							height="50px"
							viewBox="0 0 60 60"
							version="1.1"
							xmlns="http://www.w3.org/2000/svg"
							xmlnsXlink="http://www.w3.org/1999/xlink"
						>
							<g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
								<g
									transform="translate(-511.000000, -20.000000)"
									fill="#000000"
								>
									<g>
										<path d="..."></path>
									</g>
								</g>
							</g>
						</svg>
					</div>
					<div style={{ paddingTop: "8px" }}>
						<div
							style={{
								color: "#3897f0",
								fontFamily: "Arial,sans-serif",
								fontSize: "14px",
								fontStyle: "normal",
								fontWeight: 550,
								lineHeight: "18px",
							}}
						>
							View this post on Instagram
						</div>
					</div>
				</a>
				<p
					style={{
						color: "#c9c8cd",
						fontFamily: "Arial,sans-serif",
						fontSize: "14px",
						lineHeight: "17px",
						marginBottom: 0,
						marginTop: "8px",
						overflow: "hidden",
						padding: "8px 0 7px",
						textAlign: "center",
						textOverflow: "ellipsis",
						whiteSpace: "nowrap",
					}}
				>
					<a
						href="https://www.instagram.com/iveytechclub/"
						style={{
							color: "#c9c8cd",
							fontFamily: "Arial,sans-serif",
							fontSize: "14px",
							fontStyle: "normal",
							fontWeight: "normal",
							lineHeight: "17px",
							textDecoration: "none",
						}}
						target="_blank"
						rel="noopener noreferrer"
					>
						Shared post
					</a>{" "}
					on <time>Time</time>
				</p>
			</div>
		</blockquote>
	);
};

export default InstagramEmbed;
