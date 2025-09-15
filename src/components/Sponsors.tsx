import React from 'react';
import baincapital from "../assets/sponsors/baincapital.png";
import birchhill from "../assets/sponsors/birchhill.png";
import bondloyalty from "../assets/sponsors/bondloyalty.png";
import cartage from "../assets/sponsors/cartage.png";
import finetune from "../assets/sponsors/finetune.png";
import mckinsey from "../assets/sponsors/mckinsey.png";
import meter from "../assets/sponsors/meter.png";
import microsoft from "../assets/sponsors/microsoft.png";
import notion from "../assets/sponsors/notion.png";
import nvidia from "../assets/sponsors/nvidia.png";
import ramp from "../assets/sponsors/ramp.png";
import rbi from "../assets/sponsors/rbi.png";
import riley from "../assets/sponsors/riley.png";
import salesforce from "../assets/sponsors/salesforce.png";
import scaleai from "../assets/sponsors/scaleai.png";
import upshot from "../assets/sponsors/upshot.png";

import { StaticImageData } from "next/image";
import Image from "next/image";

interface Sponsor {
    name: string;
    logo: StaticImageData;
}

const sponsors: Sponsor[] = [
    {
        name: 'Bain Capital',
        logo: baincapital,
    },
    {
        name: 'Birchhill Equity',
        logo: birchhill,
    },
    {
        name: 'Bond Loyalty',
        logo: bondloyalty,
    },
    {
        name: 'Cartage',
        logo: cartage,
    },
    {
        name: 'Finetune',
        logo: finetune,
    },
    {
        name: 'McKinsey',
        logo: mckinsey,
    },
    {
        name: 'Meter',
        logo: meter,
    },
    {
        name: 'Microsoft',
        logo: microsoft,
    },
    {
        name: 'Notion',
        logo: notion,
    },
    {
        name: 'NVIDIA',
        logo: nvidia,
    },
    {
        name: 'Ramp',
        logo: ramp,
    },
    {
        name: 'Restaurant Brands International (RBI)',
        logo: rbi,
    },
    {
        name: 'Riley',
        logo: riley,
    },
    {
        name: 'Salesforce',
        logo: salesforce,
    },
    {
        name: 'Scale AI',
        logo: scaleai,
    },
    {
        name: 'Upshot Ventures',
        logo: upshot,
    },
];


const Sponsors: React.FC = () => {
    return (
        <div
            id="sponsors"
            className="bg-[#E9F2EB] min-h-screen flex flex-col items-center justify-center"
        >
            <p
                style={{ fontFamily: "RedFive Regular" }}
                className="mb-8 text-2xl text-iveyGreen text-left w-full max-w-3xl pl-4"
            >
                Past Sponsors & Partners
            </p>
            <div className="overflow-hidden w-11/12 max-w-4xl bg-white rounded-2xl grid grid-cols-2 md:grid-cols-4 md: mb-8">
                {sponsors.map((sponsor) => (
                    <div
                        key={sponsor.name}
                        className="flex flex-col items-center justify-center"
                    >
                        <Image
                            src={sponsor.logo}
                            alt={sponsor.name}
                            className="object-contain"
                            width={500}
                            height={300}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Sponsors;