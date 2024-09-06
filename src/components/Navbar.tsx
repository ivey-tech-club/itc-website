import Link from "next/link";

const Navbar = () => {
	return (
		<nav className="bg-[#E9F2EB] border-b border-gray-200">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex justify-between h-16">
					<div className="flex-shrink-0 flex items-center"></div>
					<div className="hidden sm:ml-6 sm:flex sm:space-x-8">
						{/* Navigation Links */}
						<Link
							href="#about"
							className="text-gray-700 hover:text-gray-900 font-medium"
						>
							About
						</Link>
						<Link
							href="#events"
							className="text-gray-700 hover:text-gray-900 font-medium"
						>
							Events
						</Link>
						<Link
							href="#team"
							className="text-gray-700 hover:text-gray-900 font-medium"
						>
							Team
						</Link>
						<Link
							href="#contact"
							className="text-gray-700 hover:text-gray-900 font-medium"
						>
							Contact
						</Link>
					</div>
				</div>
			</div>
		</nav>
	);
};

export default Navbar;
