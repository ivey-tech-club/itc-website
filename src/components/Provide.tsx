import React from "react";

const ServiceItem = ({
	title,
	description,
}: {
	title: string;
	description: string;
}) => (
	<div className="mb-6">
		<h2 className="text-emerald-800 text-xl font-semibold mb-2">✦ {title}</h2>
		<p className="text-gray-700">{description}</p>
	</div>
);

const Provide = () => {
	const services = [
		{
			title: "Major Events",
			description:
				"Engage in large-scale events such as hackathons and conferences that bring together students and industry leaders.",
		},
		{
			title: "Workshops",
			description:
				"Participate in both technical and non-technical workshops designed to enhance your skills and knowledge.",
		},
		{
			title: "Resources",
			description:
				"Access a wealth of resources, including book recommendations, podcasts, newsletters, case prep materials, and other online tools to support your tech journey.",
		},
		{
			title: "Mentorship",
			description:
				"Benefit from the guidance and experience of upper-year mentors who share their insights and expertise from their journeys.",
		},
		{
			title: "Networking",
			description:
				"Join a network of accomplished peers for support and collaboration, and gain firsthand industry exposure through firm trips and excursions to major tech hubs.",
		},
	];

	return (
		<div className=" bg-[#E9F2EB] py-12 px-4 sm:px-6 lg:px-8">
			<div className="max-w-5xl mx-auto bg-white rounded-lg shadow-md p-8">
				<h1 className="text-4xl font-bold text-emerald-800 mb-10 text-left">
					WHAT WE PROVIDE <span className="text-green-500">💚</span>
				</h1>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					<div className="space-y-6">
						{services.slice(0, 3).map((service, index) => (
							<ServiceItem
								key={index}
								title={service.title}
								description={service.description}
							/>
						))}
					</div>
					<div className="space-y-6">
						{services.slice(3).map((service, index) => (
							<ServiceItem
								key={index + 3}
								title={service.title}
								description={service.description}
							/>
						))}
					</div>
				</div>
			</div>
		</div>
	);
};

export default Provide;
