import React from "react";
import Avatar from "./Avatar";
import ray from "../assets/ray.jpg";
import vivek from "../assets/vivek.jpg";

const members = [
	{
		name: "Ray Wang",
		title: "President",
		image: ray,
	},
	{
		name: "Vivek Jariwala",
		title: "President",
		image: vivek,
	},
];
const Team = () => {
	return (
		<div id="team" className="bg-[#E9F2EB] min-h-screen">
			{members.map((member, index) => (
				<Avatar
					key={index}
					name={member.name}
					title={member.title}
					image={member.image}
				/>
			))}
		</div>
	);
};

export default Team;
