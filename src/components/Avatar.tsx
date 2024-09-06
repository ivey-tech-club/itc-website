import React from "react";
import Image from "next/image";

const Avatar = ({
	name,
	title,
	image,
}: {
	name: string;
	title: string;
	image: string;
}) => {
	return (
		<div>
			<Image
				height={250}
				width={250}
				src={image}
				alt={name}
				className="w-32 h-32 rounded-full object-cover border-4 border-gray-200"
			/>
			<h2 className="mt-4 text-lg font-bold">{name}</h2>
			<p className="text-sm text-gray-600">{title}</p>
		</div>
	);
};

export default Avatar;
