import Image from "next/image";
import Link from "next/link";

import itcLogo from "../assets/itc.png";

const navLinks = [
  { label: "About", href: "/#about" },
  { label: "Alumni", href: "/alumni" },
] as const;

export default function SiteHeader() {
  return (
    <header className="reference-header">
      <Link className="reference-header__brand" href="/" aria-label="Ivey Tech Club home">
        <Image src={itcLogo} alt="Ivey Tech Club" width={92} height={44} priority />
      </Link>
      <nav className="reference-header__nav" aria-label="Primary navigation">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            prefetch={link.href === "/alumni" ? true : undefined}
          >
            {link.label}
          </Link>
        ))}
      </nav>
      <a
        className="reference-header__cta"
        target="_blank"
        rel="noopener noreferrer"
        href="https://can01.safelinks.protection.outlook.com/?url=https%3A%2F%2Fwww.universe.com%2Fevents%2F2026-ivey-hbaa-clubs-week-tickets-7SZY4K&data=05%7C02%7Csli.hba2027%40ivey.ca%7C0e7d0fe22a3c42874da408df11fdc934%7C547040db185543209738e6878f6271fc%7C0%7C0%7C639249453968274775%7CUnknown%7CTWFpbGZsb3d8eyJFbXB0eU1hcGkiOnRydWUsIlYiOiIwLjAuMDAwMCIsIlAiOiJXaW4zMiIsIkFOIjoiTWFpbCIsIldUIjoyfQ%3D%3D%7C0%7C%7C%7C&sdata=W5N0JTftB3KML5u5zlUoaTbM%2BqEtgmOsnevd%2BJfu0gU%3D&reserved=0"
      >
        Become a member <span aria-hidden="true">↗</span>
      </a>
    </header>
  );
}
