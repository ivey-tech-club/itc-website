import React from "react";
import Image from "next/image";
import { AiOutlineDiscord } from "react-icons/ai";
import { CiGlobe } from "react-icons/ci";

import background from "../assets/splash page.png";
import logo from "../assets/itc.png";
import decor from "../assets/splash-decor.png";

const Landing = () => {
	return (
		<div className="relative min-h-screen" id="#">
			<Image
				src={background}
				alt="background"
				className="w-full h-full object-cover absolute top-0 left-0"
				layout="fill"
				draggable="false"
			/>

			<div className="absolute inset-0 flex flex-col">
				<div className="container mx-auto px-4 py-8 md:py-16 flex flex-col h-full">
					{/* ITC Logo */}
					<div className="mb-8">
						<Image
							src={logo}
							alt="logo"
							width={150}
							height={150}
							className="w-40 md:w-64"
							draggable="false"
						/>
					</div>

					<div className="font-syne text-iveyGreen text-lg md:text-2xl mb-8">
						Ivey Technology Club is building the{" "}
						<span className="block">
							tech community at <b>Ivey Business School</b>
						</span>
					</div>

					{/* Discord and Alumni Links */}
					<div className="space-y-4 mb-8">
						<a
							href="https://discord.gg/p9SPdrNaHy"
							rel="noreferrer"
							target="_blank"
							className="inline-flex items-center space-x-2 border border-iveyGreen rounded-md px-4 py-2"
						>
							<AiOutlineDiscord
								className="hover:-translate-y-1 transition-transform cursor-pointer text-neutral-500 dark:text-iveyGreen"
								size={30}
							/>
							<span className="text-iveyGreen">Join our Discord</span>
						</a>

						<br />

						<a
							href="#"
							rel="noreferrer"
							target="_blank"
							className="inline-flex items-center space-x-2 border border-iveyGreen rounded-md px-4 py-2"
						>
							<CiGlobe
								className="hover:-translate-y-1 transition-transform cursor-pointer text-neutral-500 dark:text-iveyGreen"
								size={30}
							/>
							<span className="text-iveyGreen">View Our Alumni</span>
						</a>
					</div>

					{/* Bottom decor */}
					<div className="mt-auto">
						<Image
							src={decor}
							alt="decor"
							draggable="false"
							className="w-full h-auto"
						/>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Landing;
