import Link from "next/link";
import Image from "next/image";
import itc from "../assets/itc.png";
const Navbar = () => {
	return (
		<nav className="bg-[#E9F2EB] border-b border-gray-200 font-syne ">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex justify-between h-16">
					<div className="flex-shrink-0 flex items-center">
						{/* Logo */}
						<Link href="/">
							<Image src={itc} alt="Logo" width={40} height={40} />
						</Link>
					</div>
					<div className="flex-shrink-0 flex items-center">
						{/* Navigation Links */}
						<Link
							href="#about"
							className="text-iveyGreen hover:text-gray-900 font-semibold mr-5"
						>
							About
						</Link>
						<Link
							href="#events"
							className="text-iveyGreen hover:text-gray-900 font-semibold mr-5"
						>
							Events
						</Link>
						<Link
							href="#team"
							className="text-iveyGreen hover:text-gray-900 font-semibold mr-5"
						>
							Team
						</Link>
						<Link
							href="#contact"
							className="text-iveyGreen hover:text-gray-900 font-semibold mr-5"
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
