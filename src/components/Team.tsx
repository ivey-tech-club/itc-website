import React from "react";
import Avatar from "./Avatar";

import jocelyn from "../assets/team/jocelyn.jpg";
import ronin from "../assets/team/ronin.jpg";
import audrey from "../assets/team/audrey.jpg";
import laura from "../assets/team/laura.jpg";
import jennifer from "../assets/team/jennifer.jpg";
import laurel from "../assets/team/laurel.jpg";
import harvey from "../assets/team/harvey.jpg";
import uttej from "../assets/team/uttej.jpg";
import ashiti from "../assets/team/ashiti.jpg";
import evan from "../assets/team/evan.jpg";
import affan from "../assets/team/affan.jpg";
import pranav from "../assets/team/pranav.jpg";
import carina from "../assets/team/carina.jpg";
import sophia from "../assets/team/sophia.jpg";
import marianna from "../assets/team/marianna.jpg";
import lecia from "../assets/team/lecia.jpg";

import { AiOutlineContacts } from "react-icons/ai";
// import { CiGlobe } from "react-icons/ci";

const members = [
  {
    name: "Jocelyn Chang",
    title: "Co-President",
    image: jocelyn,
    link: "https://www.linkedin.com/in/jocelyn-chang-a710921b7/", // Add LinkedIn or other profile link here
  },
  {
    name: "Ronin Williams-Young",
    title: "Co-President",
    image: ronin,
    link: "https://www.linkedin.com/in/ronin-williams-young/", // Add LinkedIn or other profile link here
  },
  {
    name: "Audrey Li",
    title: "Communications",
    image: audrey,
    link: "https://www.linkedin.com/in/audreylii/", // Add LinkedIn or other profile link here
  },
  {
    name: "Laura Caraccio",
    title: "Communications",
    image: laura,
    link: "https://www.linkedin.com/in/laura-caraccio/", // Add LinkedIn or other profile link here
  },
  {
    name: "Jennifer Cao",
    title: "Development",
    image: jennifer,
    link: "https://www.linkedin.com/in/jenniferrcao/", // Add LinkedIn or other profile link here
  },
  {
    name: "Laurel Dong",
    title: "Social",
    image: laurel,
    link: "https://www.linkedin.com/in/laurel-dong/", // Add LinkedIn or other profile link here
  },
  {
    name: "Harvey Zhu",
    title: "Social",
    image: harvey,
    link: "https://www.linkedin.com/in/harvey-zhu/", // Add LinkedIn or other profile link here
  },
  {
    name: "Uttej Mannava",
    title: "Sponsorship",
    image: uttej,
    link: "https://www.linkedin.com/in/-um/", // Add LinkedIn or other profile link here
  },
  {
    name: "Ashiti Patel",
    title: "Sponsorship",
    image: ashiti,
    link: "https://www.linkedin.com/in/ashiti-patel/", // Add LinkedIn or other profile link here
  },
  {
    name: "Evan Woo",
    title: "Expedition",
    image: evan,
    link: "https://www.linkedin.com/in/evan-woo/", // Add LinkedIn or other profile link here
  },
  {
    name: "Affan Bhimani",
    title: "Expedition",
    image: affan,
    link: "https://www.linkedin.com/in/affan-bhimani-9297361bb/", // Add LinkedIn or other profile link here
  },
  {
    name: "Pranav Arora",
    title: "Flagship",
    image: pranav,
    link: "https://www.linkedin.com/in/pranav-arora-ca/", // Add LinkedIn or other profile link here
  },
  {
    name: "Carina Luo",
    title: "Flagship",
    image: carina,
    link: "https://www.linkedin.com/in/carina-luo/", // Add LinkedIn or other profile link here
  },
  {
    name: "Sophia Yuan",
    title: "Careers",
    image: sophia,
    link: "https://www.linkedin.com/in/sophiay888/", // Add LinkedIn or other profile link here
  },
  {
    name: "Marianna Speranza",
    title: "Careers",
    image: marianna,
    link: "https://www.linkedin.com/in/mariannasperanza/", // Add LinkedIn or other profile link here
  },
  {
    name: "Lecia Cheng",
    title: "Careers",
    image: lecia,
    link: "https://www.linkedin.com/in/lecia-cheng/", // Add LinkedIn or other profile link here
  }
];
const Team = () => {
  return (
    <div
      id="team"
      className="bg-[#E9F2EB] min-h-screen flex flex-col items-center justify-center pb-20"
    >
      <p
        style={{ fontFamily: "RedFive Regular" }}
        className="mb-8 text-2xl text-iveyGreen text-left w-full max-w-3xl pl-4"
      >
        2025-2026 Exec Team
      </p>

      <div className="avatars-wrapper">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-y-8 w-full max-w-4xl md:pl-4 mb-8">
          {members.map((member, index) => (
            <Avatar
              key={index + 2}
              name={member.name}
              title={member.title}
              image={member.image}
              link={member.link}
            />
          ))}
        </div>
      </div>
      <br></br>

      <div className="flex items-center space-x-2 mt-4">
        <a
          href="https://wheatsnackbread.github.io/iveytechclub.ca/alumni"
          rel="noreferrer"
          target="_blank"
          className="flex items-center space-x-2 border border-iveyGreen rounded-md px-4"
        >
          <AiOutlineContacts
            className="hover:-translate-y-1 transition-transform cursor-pointer text-neutral-500 dark:text-iveyGreen"
            size={50}
          />
          <span className="text-iveyGreen">Connect with Alumni {""}</span>
        </a>
      </div>
    </div>
  );
};

export default Team;
