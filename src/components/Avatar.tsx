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
			<Image
				height={100}
				width={100}
				src={image}
				alt={name}
				className="rounded-full"
				draggable="false"
			/>
			<h2 className="mt-4 text-lg font-bold">{name}</h2>
			<p className="text-sm text-center">{title}</p>
		</div>
	);
};

export default Avatar;
