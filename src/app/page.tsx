import Image from "next/image";
import { FiArrowUpRight, FiGlobe, FiInstagram } from "react-icons/fi";

import CompanyShowcase from "../components/CompanyShowcase";
import ClubSnapshot from "../components/ClubSnapshot";
import IveyFooter from "../components/IveyFooter";
import ReferenceHero from "../components/ReferenceHero";
import SiteHeader from "../components/SiteHeader";
import btcPhoto from "../assets/breaking-into-tech-conference.webp";
import sanFranciscoPhoto from "../assets/sf.png";
import communityPhoto from "../assets/social2.png";

const events = [
  {
    title: "Breaking Into Tech Conference",
    location: "Ivey Business School",
    image: btcPhoto,
    imageAlt: "Breaking Into Tech Conference presentation at the Ivey Business School",
  },
  {
    title: "San Francisco Career Trek",
    location: "San Francisco, CA",
    image: sanFranciscoPhoto,
    imageAlt: "Ivey Tech Club students on a career trek",
  },
  {
    title: "Toronto Career Trek",
    location: "Toronto, ON",
    image: communityPhoto,
    imageAlt: "Ivey Tech Club students exploring Toronto together",
  },
] as const;

function EventCard({ event }: { event: (typeof events)[number] }) {
  return (
    <article className="event-card">
      <div className="event-card__content">
        <div className="event-card__image">
          <Image
            fill
            sizes="(max-width: 760px) 100vw, (max-width: 1100px) 50vw, 33vw"
            src={event.image}
            alt={event.imageAlt}
          />
        </div>
        <div className="event-card__body">
          <h3>{event.title}</h3>
          <p className="event-card__location">
            <FiGlobe aria-hidden="true" />
            {event.location}
          </p>
        </div>
      </div>
    </article>
  );
}

export default function Home() {
  return (
    <div className="site-shell reference-shell">
      <SiteHeader />

      <main id="top">
        <ReferenceHero />
        <ClubSnapshot />
        <CompanyShowcase />

        <section className="events-section" id="events">
          <div className="section-heading section-grid">
            <div>
              <h2>Talks, visits, and things to build.</h2>
            </div>
          </div>
          <div className="events-grid">
            {events.map((event) => (
              <EventCard key={event.title} event={event} />
            ))}
          </div>
          <a
            className="events-more"
            href="https://www.instagram.com/iveytechclub/"
            target="_blank"
            rel="noreferrer"
            aria-label="See more events on Instagram"
          >
            <span className="events-more__icon" aria-hidden="true">
              <FiInstagram />
            </span>
            <span className="events-more__copy">
              <strong>See more events on Instagram</strong>
              <span className="events-more__handle">@iveytechclub</span>
            </span>
            <span className="events-more__arrow" aria-hidden="true">
              <FiArrowUpRight />
            </span>
          </a>
        </section>
      </main>

      <IveyFooter />
    </div>
  );
}
