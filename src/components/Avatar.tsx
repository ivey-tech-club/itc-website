import React from "react";
import Image, { StaticImageData } from "next/image";

const Avatar = ({
  name,
  title,
  image,
  link,
  size = 120,
  role,
}: {
  name: string;
  title: string;
  image?: StaticImageData;
  link?: string;
  size?: number;
  role?: string;
}) => {
  const getInitials = (name: string) => {
    const parts = name.split(" ");
    return parts.length >= 2
      ? `${parts[0][0]}${parts[1][0]}`.toUpperCase()
      : name[0].toUpperCase();
  };

  const avatarContent = image ? (
    <Image
      height={size}
      width={size}
      src={image}
      alt={name}
      className="w-full h-full object-cover"
      draggable="false"
    />
  ) : (
    <div className="w-full h-full bg-gray-300 flex items-center justify-center text-2xl font-bold text-gray-700">
      {getInitials(name)}
    </div>
  );

  return (
    <div className="border-transparent-500 flex flex-col items-center">
      {link && link.trim() !== "" ? (
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full overflow-hidden cursor-pointer transition-transform hover:scale-105 block"
          style={{ width: `${size}px`, height: `${size}px` }}
        >
          {avatarContent}
        </a>
      ) : (
        <div
          className="rounded-full overflow-hidden"
          style={{ width: `${size}px`, height: `${size}px` }}
        >
          {avatarContent}
        </div>
      )}
      <h2 className="mt-4 text-lg font-bold">{name}</h2>
      {role && <p className="text-sm text-center">{role}</p>}
    </div>
  );
};

export default Avatar;
