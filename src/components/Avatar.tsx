import React from "react";
import Image, { StaticImageData } from "next/image";

const Avatar = ({
	name,
	title,
	image,
}: {
	name: string;
	title: string;
	image: StaticImageData;
}) => {
	return (
		<div className="border-transparent-500 flex flex-col items-center">
			<div className="w-[120px] h-[120px] rounded-full overflow-hidden">
				<Image
					height={120}
					width={120}
					src={image}
					alt={name}
					className="w-full h-full object-cover"
					draggable="false"
				/>
			</div>
			<h2 className="mt-4 text-lg font-bold">{name}</h2>
			<p className="text-sm text-center">{title}</p>
		</div>
	);
};

export default Avatar;
