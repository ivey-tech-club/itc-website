import React from "react";
import Avatar from "./Avatar";

import jocelyn from "../assets/team/jocelyn.jpg";
import ronin from "../assets/team/ronin.jpg";
import audrey from "../assets/team/audrey.jpg";
import laura from "../assets/team/laura.jpg";
import jennifer from "../assets/team/jennifer.jpg";
import rachel from "../assets/team/rachel.jpg";
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
import olivia from "../assets/team/olivia.jpg";

import { AiOutlineContacts } from "react-icons/ai";
// import { CiGlobe } from "react-icons/ci";

const members = [
  {
    name: "Jocelyn Chang",
    title: "Co-President",
    image: jocelyn,
  },
  {
    name: "Ronin Williams-Young",
    title: "Co-President",
    image: ronin,
  },
  {
    name: "Audrey Li",
    title: "Communications",
    image: audrey,
  },
  {
    name: "Laura Caraccio",
    title: "Communications",
    image: laura,
  },
  {
    name: "Jennifer Cao",
    title: "Development",
    image: jennifer,
  },
  {
    name: "Rachel Chen",
    title: "Development",
    image: rachel,
  },
  {
    name: "Laurel Dong",
    title: "Social",
    image: laurel,
  },
  {
    name: "Harvey Zhu",
    title: "Social",
    image: harvey,
  },
  {
    name: "Uttej Mannava",
    title: "Sponsorship",
    image: uttej,
  },
  {
    name: "Ashiti Patel",
    title: "Sponsorship",
    image: ashiti,
  },
  {
    name: "Evan Woo",
    title: "Expedition",
    image: evan,
  },
  {
    name: "Affan Bhimani",
    title: "Expedition",
    image: affan,
  },
  {
    name: "Pranav Arora",
    title: "Flagship",
    image: pranav,
  },
  {
    name: "Carina Luo",
    title: "Flagship",
    image: carina,
  },
  {
    name: "Sophia Yuan",
    title: "Careers",
    image: sophia,
  },
  {
    name: "Marianna Speranza",
    title: "Careers",
    image: marianna,
  },
  {
    name: "Lecia Cheng",
    title: "Mentorship",
    image: lecia,
  },
  {
    name: "Olivia Yong",
    title: "Mentorship",
    image: olivia,
  }
];
const Team = () => {
  return (
    <div
      id="team"
      className="bg-[#E9F2EB] min-h-screen flex flex-col items-center justify-center"
    >
      <p
        style={{ fontFamily: "RedFive Regular" }}
        className="mb-8 text-2xl text-iveyGreen text-left w-full max-w-3xl pl-4"
      >
        2024-2025 Exec Team
      </p>

      <div className="avatars-wrapper">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-y-8 w-full max-w-4xl md:pl-4 mb-8">
          {members.slice(0, 2).map((member, index) => (
            <Avatar
              key={index}
              name={member.name}
              title={member.title}
              image={member.image}
            />
          ))}
        </div>


        <div className="grid grid-cols-2 md:grid-cols-4 gap-y-8 w-full max-w-4xl md:pl-4 mb-8">
          {members.slice(2).map((member, index) => (
            <Avatar
              key={index + 2}
              name={member.name}
              title={member.title}
              image={member.image}
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
