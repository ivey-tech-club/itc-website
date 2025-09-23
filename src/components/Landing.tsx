import React from "react";
import Image from "next/image";
import { CiGlobe } from "react-icons/ci";

import background from "../assets/splash page.png";
import logo from "../assets/itc.png";
import decor from "../assets/splash-decor.png";

const Landing = () => {
	return (
		<div className="relative w-full" id="#">
			{/* Background Image */}
			<Image
				src={background}
				alt="background"
				className="absolute inset-0 w-full h-full object-cover"
				draggable="false"
				style={{ height: "100%", width: "100%" }}
			/>

			<div className="relative flex flex-col">
				{/* ITC Logo */}
				<div className="ml-4 md:ml-28 mt-4 md:mt-32">
					<Image
						src={logo}
						alt="logo"
						width={250}
						height={250}
						draggable="false"
					/>

					<div className="mt-4 md:mt-8 font-syne text-iveyGreen">
						Ivey Technology Club is building the {""}
						<div>
							tech community at <b>Ivey Business School</b>
						</div>
					</div>

					<div className="flex items-center space-x-2 mt-4">
						<a
							href="https://www.universe.com/events/2025-ivey-hbaa-clubs-week-tickets-YNL2KZ"
							target="_blank"
							rel="noreferrer"
							className="flex items-center space-x-2 border border-iveyGreen rounded-md px-4"
						>
							<CiGlobe
								className="hover:-translate-y-1 transition-transform cursor-pointer text-neutral-500 dark:text-iveyGreen"
								size={50}
							/>
							<span className="text-iveyGreen">
								Become a Member{""}
							</span>
						</a>
					</div>

					{/* Bottom decor */}
					<div className="mt-4 md:mt-52 mb-4">
						<Image src={decor} alt="decor" draggable="false" />
					</div>
				</div>
			</div>
		</div>
	);
};

export default Landing;
