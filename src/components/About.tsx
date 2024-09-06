import React from "react";
import Image from "next/image";
import social1 from "../assets/social1.png";
import social2 from "../assets/social2.png";
const about = () => {
	return (
		<div>
			<div
				id="about"
				className="flex flex-col items-center justify-center min-h-screen bg-[#E9F2EB] "
			>
				<div className="max-w-5xl mx-auto px-6 py-16">
					{/* Title */}
					<h2 className="text-4xl font-bold text-green-800 text-center mb-8">
						ABOUT US
					</h2>

					{/* Text Content */}
					<div className="bg-white p-6 shadow-lg rounded-md text-center mb-12">
						<p className="text-gray-600 text-lg leading-relaxed">
							Ivey Tech Club (ITC) is dedicated to building a vibrant community
							for Ivey students interested in technology. We make the tech
							industry more accessible and approachable by hosting events,
							providing mentorship, and creating opportunities for students to
							improve their skills. Our club welcomes students from all
							backgrounds and levels of experience, kickstarting careers and
							making tech a more prominent and viable path for Ivey students.
						</p>
					</div>

					{/* Image Section */}
					<div className="flex justify-between items-center">
						{/* Image 1 */}
						<div>
							<Image
								className="ml-32 sm:ml-16"
								src={social1}
								alt="Group Photo 1"
								draggable="false"
							/>
						</div>

						{/* Image 2 */}
						<div>
							<Image
								className="mr-48 mb-32"
								src={social2}
								alt="Group Photo 2"
								draggable="false"
							/>
						</div>
					</div>
				</div>
			</div>

			{/* Numbers */}
			<div className="bg-[#E9F2EB] py-16">Our Numbers</div>
		</div>
	);
};

export default about;
