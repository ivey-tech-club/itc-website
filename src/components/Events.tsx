import React from "react";
import InstagramEmbed from "./Instagram";

const Events = () => {
<<<<<<< HEAD
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
=======
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
>>>>>>> 1893421144121958f3d6655786aa5737816c5c80
};

export default Events;
