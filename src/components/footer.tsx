import React from "react";
import {
  AiOutlineGithub,
  AiOutlineLinkedin,
  AiOutlineMail,
  AiOutlineFacebook,
  AiOutlineInstagram,
} from "react-icons/ai";

const Footer = () => {
  return (
    <div className="bg-[#E9F2EB]">
      <footer className="bg-[#E9F2EB] mx-auto max-w-3xl px-4 sm:px-6 md:max-w-5xl">
        <div className="mx-auto p-4 flex flex-col text-center text-neutral-900 md:flex-row md:items-center md:justify-between">
          {/* Text Section */}
          <div className="flex flex-col md:flex-row items-center space-y-1 md:space-y-0 md:space-x-2">
            <span className="text-iveyGreen">© 2024 Ivey Tech Club |</span>
            <span className="text-iveyGreen">
              All Rights Reserved | Made with 💚
            </span>
          </div>

          {/* Icon Section */}
          <div className="flex items-center justify-center space-x-4 mt-4 md:mt-0">
            <a
              href="https://github.com/elyknehc/iveytechclub"
              rel="noreferrer"
              target="_blank"
            >
              <AiOutlineGithub
                className="hover:-translate-y-1 transition-transform cursor-pointer text-neutral-500 dark:text-iveyGreen"
                size={30}
              />
            </a>
            <a
              href="https://www.instagram.com/iveytechclub"
              rel="noreferrer"
              target="_blank"
            >
              <AiOutlineInstagram
                className="hover:-translate-y-1 transition-transform cursor-pointer text-neutral-500 dark:text-iveyGreen"
                size={30}
              />
            </a>
            <a
              href="https://www.facebook.com/IveyTechnologyClub/"
              rel="noreferrer"
              target="_blank"
            >
              <AiOutlineFacebook
                className="hover:-translate-y-1 transition-transform cursor-pointer text-neutral-500 dark:text-iveyGreen"
                size={30}
              />
            </a>
            <a
              href="https://www.linkedin.com/company/ivey-tech-club"
              rel="noreferrer"
              target="_blank"
            >
              <AiOutlineLinkedin
                className="hover:-translate-y-1 transition-transform cursor-pointer text-neutral-500 dark:text-iveyGreen"
                size={30}
              />
            </a>
            <a
              href="mailto:iveytechclub@gmail.com"
              rel="noreferrer"
              target="_blank"
            >
              <AiOutlineMail
                className="hover:-translate-y-1 transition-transform cursor-pointer text-neutral-500 dark:text-iveyGreen"
                size={30}
              />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
