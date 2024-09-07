import React from "react";
import InstagramEmbed from "./Instagram";

const Events = () => {
	return (
		<div
			id="events"
			className="bg-[#E9F2EB] min-h-screen flex flex-col items-center justify-center"
		>
			<div
				style={{ fontFamily: "RedFive Regular" }}
				className="text-iveyGreen text-2xl mb-8 text-left w-full max-w-3xl pl-4"
			>
				Events
			</div>
			<InstagramEmbed />
		</div>
	);
};

export default Events;
