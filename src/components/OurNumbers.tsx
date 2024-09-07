import React from "react";

const StatItem = ({
  number,
  description,
}: {
  number: string;
  description: string;
}) => (
  <div className="text-center">
    <p className="font-syne text-5xl font-bold text-emerald-800 mb-2">
      {number}
    </p>
    <p className="font-syne text-emerald-700">{description}</p>
  </div>
);

const OurNumbers = () => {
  const stats = [
    { number: "150", description: "Club Members" },
    { number: "67%", description: "Dual Degree Students" },
    { number: "50", description: "Students in Mentorship Programs" },
  ];

  return (
    <div className="bg-teal-50 py-48 px-4">
      {" "}
      {/* Increase the py-12 value to py-16 */}
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-redfive font-bold text-emerald-800 mb-8 text-left">
          OUR NUMBERS
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 font-syne">
          {stats.map((stat, index) => (
            <StatItem
              key={index}
              number={stat.number}
              description={stat.description}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default OurNumbers;
