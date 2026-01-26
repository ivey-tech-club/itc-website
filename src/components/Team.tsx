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
    title: "Co-Presidents",
    image: jocelyn,
    link: "https://www.linkedin.com/in/jocelyn-chang-a710921b7/", // Add LinkedIn or other profile link here
  },
  {
    name: "Ronin Williams-Young",
    title: "Co-Presidents",
    image: ronin,
    link: "https://www.linkedin.com/in/ronin-williams-young/", // Add LinkedIn or other profile link here
  },
  {
    name: "Audrey Li",
    title: "Communications",
    role: "VP",
    image: audrey,
    link: "https://www.linkedin.com/in/audreylii/", // Add LinkedIn or other profile link here
  },
  {
    name: "Laura Caraccio",
    title: "Communications",
    role: "VP",
    image: laura,
    link: "https://www.linkedin.com/in/laura-caraccio/", // Add LinkedIn or other profile link here
  },
  {
    name: "Jennifer Cao",
    title: "Development",
    role: "VP",
    image: jennifer,
    link: "https://www.linkedin.com/in/jenniferrcao/", // Add LinkedIn or other profile link here
  },
  {
    name: "Laurel Dong",
    title: "Social",
    role: "VP",
    image: laurel,
    link: "https://www.linkedin.com/in/laurel-dong/", // Add LinkedIn or other profile link here
  },
  {
    name: "Harvey Zhu",
    title: "Social",
    role: "VP",
    image: harvey,
    link: "https://www.linkedin.com/in/harvey-zhu/", // Add LinkedIn or other profile link here
  },
  {
    name: "Uttej Mannava",
    title: "Sponsorship",
    role: "VP",
    image: uttej,
    link: "https://www.linkedin.com/in/-um/", // Add LinkedIn or other profile link here
  },
  {
    name: "Ashiti Patel",
    title: "Sponsorship",
    role: "VP",
    image: ashiti,
    link: "https://www.linkedin.com/in/ashiti-patel/", // Add LinkedIn or other profile link here
  },
  {
    name: "Evan Woo",
    title: "Expedition",
    role: "VP",
    image: evan,
    link: "https://www.linkedin.com/in/evan-woo/", // Add LinkedIn or other profile link here
  },
  {
    name: "Affan Bhimani",
    title: "Expedition",
    role: "VP",
    image: affan,
    link: "https://www.linkedin.com/in/affan-bhimani-9297361bb/", // Add LinkedIn or other profile link here
  },
  {
    name: "Pranav Arora",
    title: "Flagship",
    role: "VP",
    image: pranav,
    link: "https://www.linkedin.com/in/pranav-arora-ca/", // Add LinkedIn or other profile link here
  },
  {
    name: "Carina Luo",
    title: "Flagship",
    role: "VP",
    image: carina,
    link: "https://www.linkedin.com/in/carina-luo/", // Add LinkedIn or other profile link here
  },
  {
    name: "Sophia Yuan",
    title: "Careers",
    role: "VP",
    image: sophia,
    link: "https://www.linkedin.com/in/sophiay888/", // Add LinkedIn or other profile link here
  },
  {
    name: "Marianna Speranza",
    title: "Careers",
    role: "VP",
    image: marianna,
    link: "https://www.linkedin.com/in/mariannasperanza/", // Add LinkedIn or other profile link here
  },
  {
    name: "Lecia Cheng",
    title: "Careers",
    role: "VP",
    image: lecia,
    link: "https://www.linkedin.com/in/lecia-cheng/", // Add LinkedIn or other profile link here
  },
  {
    // Section Reps
    name: "Luca Roma",
    title: "Sponsorship",
    role: "Section Rep",
    link: "https://www.linkedin.com/in/luca-roma-western/", // Add LinkedIn or other profile link here
  },
  {
    name: "Khalad Osman",
    title: "Sponsorship",
    role: "Section Rep",
    link: "https://www.linkedin.com/in/khalad-osman/", // Add LinkedIn or other profile link here
  },
  {
    name: "Hadi Youssef",
    title: "Careers",
    role: "Section Rep",
    link: "https://www.linkedin.com/in/hadiy/", // Add LinkedIn or other profile link here
  },
  {
    name: "Barry Paul",
    title: "Careers",
    role: "Section Rep",
    link: "https://www.linkedin.com/in/barryxpaul/", // Add LinkedIn or other profile link here
  },
  {
    name: "Annie Yu",
    title: "Careers",
    role: "Section Rep",
    link: "https://www.linkedin.com/in/annie-yu22/", // Add LinkedIn or other profile link here
  },
  {
    name: "Parum Patel",
    title: "Communications",
    role: "Section Rep",
    link: "https://www.linkedin.com/in/parum-p-1b498a1b1/", // Add LinkedIn or other profile link here
  },
  {
    name: "Emily Yu",
    title: "Communications",
    role: "Section Rep",
    link: "https://www.linkedin.com/in/emily-nz-yu/", // Add LinkedIn or other profile link here
  },
  {
    name: "William Jiang",
    title: "Social",
    role: "Section Rep",
    link: "https://www.linkedin.com/in/williamxjiang/", // Add LinkedIn or other profile link here
  },
  {
    name: "Stephanie Li",
    title: "Social",
    role: "Section Rep",
    link: "https://www.linkedin.com/in/stephanieli802/", // Add LinkedIn or other profile link here
  },
  {
    name: "Millicent Song",
    title: "Flagship",
    role: "Section Rep",
    link: "https://www.linkedin.com/in/millicent-song/", // Add LinkedIn or other profile link here
  },
  {
    name: "Alice Nguyen",
    title: "Flagship",
    role: "Section Rep",
    link: "https://www.linkedin.com/in/alicebtnguyen/", // Add LinkedIn or other profile link here
  },
  {
    name: "Stella Zhu",
    title: "Flagship",
    role: "Section Rep",
    link: "https://www.linkedin.com/in/zhustella/", // Add LinkedIn or other profile link here
  },
  {
    name: "Molly Jin",
    title: "Flagship",
    role: "Section Rep",
    link: "https://www.linkedin.com/in/molly-jin/", // Add LinkedIn or other profile link here
  },
  {
    name: "Aaryan Joharapurkar",
    title: "Development",
    role: "Section Rep",
    link: "https://www.linkedin.com/in/aaryanj/", // Add LinkedIn or other profile link here
  },
  {
    name: "Gloria Qi",
    title: "Development",
    role: "Section Rep",
    link: "https://www.linkedin.com/in/gloria-qi-/", // Add LinkedIn or other profile link here
  },
  {
    name: "Juna Kim",
    title: "Development",
    role: "Section Rep",
    link: "https://www.linkedin.com/in/kimjuna/", // Add LinkedIn or other profile link here
  },
  {
    name: "Natalie Wang",
    title: "Development",
    role: "Section Rep",
    link: "https://www.linkedin.com/in/wang-natalie/", // Add LinkedIn or other profile link here
  },
  {
    name: "Claire Kuo",
    title: "Expedition",
    role: "Section Rep",
    link: "https://www.linkedin.com/in/cclairey11/", // Add LinkedIn or other profile link here
  },
  {
    name: "Mehak Marwaha",
    title: "Expedition",
    role: "Section Rep",
    link: "https://www.linkedin.com/in/mehakmarwaha2005/", // Add LinkedIn or other profile link here
  },
  {
    name: "Allison Ye",
    title: "Expedition",
    role: "Section Rep",
    link: "https://www.linkedin.com/in/-allison-ye/", // Add LinkedIn or other profile link here
  },
  {
    name: "Dan Mick",
    title: "Expedition",
    role: "Section Rep",
    link: "https://www.linkedin.com/in/danmick/", // Add LinkedIn or other profile link here
  },
];
const Team = () => {
  // Group members by title
  const groupedMembers = members.reduce(
    (acc, member) => {
      if (!acc[member.title]) {
        acc[member.title] = [];
      }
      acc[member.title].push(member);
      return acc;
    },
    {} as Record<string, typeof members>,
  );

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

      <div className="w-full max-w-4xl">
        {Object.entries(groupedMembers).map(([title, membersInGroup]) => (
          <div key={title} className="mb-12">
            <h3 className="text-xl font-semibold text-iveyGreen mb-4 pl-4">
              {title}
            </h3>
            {title === "Co-Presidents" ? (
              <div className="flex justify-center gap-8 mb-8">
                {membersInGroup.map((member, index) => (
                  <Avatar
                    key={index}
                    name={member.name}
                    title={member.title}
                    image={member.image}
                    link={member.link}
                    size={180}
                    role={member.role}
                  />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-y-8 pl-4 text-center items-center justify-center">
                {membersInGroup.map((member, index) => (
                  <Avatar
                    key={index}
                    name={member.name}
                    title={member.title}
                    image={member.image}
                    link={member.link}
                    role={member.role}
                    size={member.image ? 150 : 120}
                  />
                ))}
              </div>
            )}
          </div>
        ))}
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
