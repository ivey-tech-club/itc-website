"use client";
import React from "react";
import { EventBox } from "./EventBox";

import btc from "../assets/btc.png";
import sf from "../assets/sf.png";

const Events = () => {
  return (
    <div
      id="events"
      className="bg-[#E9F2EB] min-h-screen flex flex-col items-center justify-start pt-16 pb-20"
    >
      <div
      style={{ fontFamily: "RedFive Regular" }}
      className="text-iveyGreen text-2xl mb-8 text-left w-full max-w-6xl px-4"
      >
      Upcoming Events
      </div>
      
    <div className="flex flex-wrap justify-center gap-6 w-full max-w-6xl px-4">
      <EventBox
        name={"Breaking Into Tech Conference"}
        date={"Oct 18, 2025"}
        location={"Ivey Business School"}
        details={
        "Ivey Tech Club’s flagship conference is the ideal opportunity for students exploring technology career paths and those preparing for technical recruiting. Attendees will gain insights from HBA2/3s and alumni who have worked at leading firms like EY, Amazon, Microsoft, Salesforce, and more through interactive workshops and panels. The day also features networking sessions with top Toronto-based firms right here on campus. Don’t miss out on ITC’s biggest event of the year!"
        }
        image={btc}
      />
      <EventBox
        name={"San Francisco Career Trek"}
        date={"Nov 4, 2025 - Nov 8, 2025"}
        location={"San Francisco, CA"}
        details={
        "Join us for an exclusive week-long trip to San Francisco. Throughout the week, you’ll visit leading firms and fast-growing startups, attend curated networking events and panels with industry professionals, and immerse yourself in Bay Area culture. In past years, students have met with industry leaders at companies like NVIDIA, Salesforce, and Scale AI. This will be an amazing opportunity during fall reading week to explore both tech and business career paths, build connections, and discover one of the most dynamic tech hubs in the world."
        }
        image={sf}
      />
        <a href="https://www.instagram.com/iveytechclub/" target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
          <div
            className="bg-iveyGreen rounded-2xl shadow-md w-[320px] h-[400px] flex flex-col items-center justify-center relative overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
          >
            <h2 className="font-syne text-white text-xl font-semibold mb-2" style={{textAlign: 'center', padding: '0 24px', display: 'flex', alignItems: 'center', gap: '12px'}}>
              More events
              <svg width="28" height="28" fill="none" stroke="#fff" strokeWidth="3" viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
            </h2>
          </div>
        </a>
      </div>
    </div>
  );
};

export default Events;
