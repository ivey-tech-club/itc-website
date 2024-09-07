import React from "react";
import InstagramEmbed from "./Instagram";

const Events = () => {
	return (
		<div
			id="events"
			className="bg-[#E9F2EB] min-h-screen flex flex-col items-center justify-center text-center"
		>
			<div className="text-iveyGreen font-redfive text-2xl font-bold mb-8">
				{" "}
				Events{" "}
			</div>
			<InstagramEmbed />
		</div>
	);
};

export default Events;
