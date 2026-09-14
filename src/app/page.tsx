import Image from "next/image";
import { FiArrowUpRight, FiCalendar, FiGlobe, FiInstagram } from "react-icons/fi";

import CompanyShowcase from "../components/CompanyShowcase";
import ClubSnapshot from "../components/ClubSnapshot";
import IveyFooter from "../components/IveyFooter";
import ReferenceHero from "../components/ReferenceHero";
import SiteHeader from "../components/SiteHeader";
import btcPhoto from "../assets/breaking-into-tech-conference.webp";
import sanFranciscoPhoto from "../assets/sf.png";
import communityPhoto from "../assets/social2.png";

const breakingIntoTechTicketUrl =
  "https://www.universe.com/events/itcs-breaking-into-tech-conference-tickets-NHM0LV?ref=universe-discover";

type Event = {
  titleLines: readonly [string, string];
  date: string;
  link?: string;
  comingSoon?: boolean;
  location: string;
  image: typeof btcPhoto;
  imageAlt: string;
};

const events: readonly Event[] = [
  {
    titleLines: ["Breaking Into Tech", "Conference"],
    date: "Sep 20, 2026",
    link: breakingIntoTechTicketUrl,
    location: "Ivey Business School",
    image: btcPhoto,
    imageAlt: "Breaking Into Tech Conference presentation at the Ivey Business School",
  },
  {
    titleLines: ["San Francisco", "Career Trek"],
    date: "Oct 13–17, 2026",
    comingSoon: true,
    location: "San Francisco, CA",
    image: sanFranciscoPhoto,
    imageAlt: "Ivey Tech Club students on a career trek",
  },
  {
    titleLines: ["Toronto Firms", "Trip"],
    date: "Oct 6, 2026",
    comingSoon: true,
    location: "Toronto, ON",
    image: communityPhoto,
    imageAlt: "Ivey Tech Club students exploring Toronto together",
  },
];

function EventCard({ event }: { event: (typeof events)[number] }) {
  const card = (
    <article className={`event-card${event.comingSoon ? " event-card--coming-soon" : ""}`}>
      <div className="event-card__content">
        <div className="event-card__image">
          <Image
            fill
            sizes="(max-width: 760px) 100vw, (max-width: 1100px) 50vw, 33vw"
            src={event.image}
            alt={event.imageAlt}
          />
          {event.comingSoon ? (
            <span className="event-card__status">Tickets coming soon</span>
          ) : null}
        </div>
        <div className="event-card__body">
          <h3>
            {event.titleLines.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </h3>
          <div className="event-card__details">
            <p className="event-card__location">
              <FiGlobe aria-hidden="true" />
              {event.location}
            </p>
            <p className="event-card__date">
              <FiCalendar aria-hidden="true" />
              {event.date}
            </p>
          </div>
        </div>
      </div>
    </article>
  );

  if (!event.link) {
    return card;
  }

  return (
    <a
      className="event-card-link"
      href={event.link}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Buy tickets for ${event.titleLines.join(" ")}`}
    >
      {card}
    </a>
  );
}

export default function Home() {
  return (
    <div className="site-shell reference-shell">
      <a
        className="ticket-banner"
        href={breakingIntoTechTicketUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Buy tickets for Breaking Into Tech Conference"
      >
        <span className="ticket-banner__status">Tickets open</span>
        <span className="ticket-banner__message">Breaking Into Tech Conference</span>
        <span className="ticket-banner__action">
          Get tickets <span aria-hidden="true">↗</span>
        </span>
      </a>
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
              <EventCard key={event.titleLines.join(" ")} event={event} />
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
