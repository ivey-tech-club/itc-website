import Image from "next/image";

import widePhoto from "../assets/club-snapshot.webp";

const stats = [
  { value: "150+", label: "Ivey students in our community" },
  { value: "67%", label: "dual-degree students in the club" },
  { value: "200+", label: "students connected through mentorship" },
] as const;

export default function ClubSnapshot() {
  return (
    <section className="club-snapshot" id="about" aria-labelledby="club-snapshot-title">
      <div className="club-snapshot__intro">
        <div className="club-snapshot__media">
          <picture className="club-snapshot__picture">
            <Image
              fill
              sizes="(max-width: 760px) 100vw, (max-width: 1600px) 58vw, 920px"
              src={widePhoto}
              alt="Ivey Tech Club students gathered on a rooftop in Toronto"
            />
          </picture>
        </div>

        <div className="club-snapshot__copy">
          <h2 id="club-snapshot-title">
            Where Ivey students turn curiosity into <em>capability.</em>
          </h2>
          <p>
            Ivey Tech Club makes technology a more approachable path for Ivey students.
            Through practical events, mentorship, and conversations with people building
            in tech, we help our community explore the industry and find a place in it.
          </p>
          <a className="club-snapshot__link" href="#community">
            Explore our network <span aria-hidden="true">↗</span>
          </a>
        </div>
      </div>

      <dl className="club-snapshot__stats">
        {stats.map((stat) => (
          <div key={stat.label}>
            <dt>{stat.value}</dt>
            <dd>{stat.label}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
