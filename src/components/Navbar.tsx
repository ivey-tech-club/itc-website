"use client";
// import Link from "next/link";
// import Image from "next/image";
// import itc from "../assets/itc.png";

const Navbar = () => {
  const handleSmoothScroll = (
    e: React.MouseEvent<HTMLAnchorElement>,
    targetId: string
  ) => {
    e.preventDefault(); // Prevent default anchor behavior
    const targetElement = document.querySelector(targetId); // Find the target section by ID

    // Scroll to the target section smoothly
    if (targetElement) {
      targetElement.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  return (
    <nav className="bg-[#E9F2EB] border-b border-gray-200 font-syne ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex-shrink-0 flex items-center">
            {/* Logo */}
            {/* <Link href="/">
              <Image src={itc} alt="Logo" width={40} height={40} />
            </Link> */}
          </div>
          <div className="flex-shrink-0 flex items-center">
            {/* Navigation Links */}
            <a
              href="#about"
              className="nav-link text-iveyGreen font-plex hover:text-gray-900 font-semibold mr-5"
              onClick={(e) => handleSmoothScroll(e, "#about")}
            >
              About
            </a>
            <a
              href="#events"
              className="nav-link text-iveyGreen font-plex hover:text-gray-900 font-semibold mr-5"
              onClick={(e) => handleSmoothScroll(e, "#events")}
            >
              Events
            </a>
            <a
              href="#team"
              className="nav-link text-iveyGreen font-plex hover:text-gray-900 font-semibold mr-5"
              onClick={(e) => handleSmoothScroll(e, "#team")}
            >
              Team
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
