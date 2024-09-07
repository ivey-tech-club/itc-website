import React from "react";

const Contact = () => {
	return (
		<section id="contact" className="bg-[#E9F2EB] py-12">
			<div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
				<h2 className="text-3xl font-bold text-gray-800 text-left mb-6">
					Contact Us
				</h2>

				<form className="space-y-6">
					<div>
						<label
							htmlFor="name"
							className="block text-sm font-medium text-gray-700"
						>
							Name
						</label>
						<input
							type="text"
							id="name"
							name="name"
							className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-iveyGreen focus:border-iveyGreen sm:text-sm"
							placeholder="Your name"
							required
						/>
					</div>
					<div>
						<label
							htmlFor="email"
							className="block text-sm font-medium text-gray-700"
						>
							Email
						</label>
						<input
							type="email"
							id="email"
							name="email"
							className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-iveyGreen focus:border-iveyGreen sm:text-sm"
							placeholder="you@example.com"
							required
						/>
					</div>
					<div>
						<label
							htmlFor="message"
							className="block text-sm font-medium text-gray-700"
						>
							Message
						</label>
						<textarea
							id="message"
							name="message"
							rows="4"
							className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-iveyGreen focus:border-iveyGreen sm:text-sm"
							placeholder="Your message"
							required
						></textarea>
					</div>
					<div>
						<button
							type="submit"
							className="w-full bg-iveyGreen text-white py-2 px-4 rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-iveyGreen"
						>
							Send Message
						</button>
					</div>
				</form>
			</div>
		</section>
	);
};

export default Contact;
