import React from "react";
import background from "../assets/splash page.png";
import logo from "../assets/itc.png";
import Image from "next/image";
import decor from "../assets/splash-decor.png";

const Landing = () => {
	return (
		<div className="relative" id="#">
			<Image
				src={background}
				alt="background"
				className="w-full h-auto"
				draggable="false"
			/>

			<div className="absolute inset-0 flex flex-col">
				{/* ITC Logo */}
				<div className="ml-28 mt-32">
					<Image
						src={logo}
						alt="logo"
						width={250}
						height={250}
						draggable="false"
					/>

					<div className="mt-8 font-syne text-iveyGreen">
						Ivey Technology Club is building the {""}
						<div>
							tech community at <b>Ivey Business School </b>
						</div>
					</div>
					{/* Bottom decor */}
					<div className="mt-60">
						<Image src={decor} alt="decor" draggable="false" />
					</div>
				</div>
			</div>
		</div>
	);
};

export default Landing;
