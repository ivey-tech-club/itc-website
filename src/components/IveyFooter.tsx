import Image from "next/image";

import itcLogo from "../assets/itc.png";
import HalftoneImage from "./HalftoneImage";

/*
 * The interactive FooterDial tuner is intentionally disabled while the final
 * artwork settings are being finalized. Its implementation remains isolated
 * in FooterDial.tsx, but it is not imported or rendered here, so it cannot
 * add client-side work to the active footer.
 */

const exploreLinks = [
	{ label: "About Us", href: "#about" },
	{ label: "Events", href: "#events" },
	{ label: "Alumni", href: "/alumni" },
];

const connectLinks = [
	{ label: "Email", href: "mailto:techclub@ivey.ca" },
	{ label: "Instagram", href: "https://www.instagram.com/iveytechclub" },
	{ label: "Facebook", href: "https://www.facebook.com/IveyTechnologyClub/" },
	{ label: "LinkedIn", href: "https://www.linkedin.com/company/ivey-tech-club" },
];

const footerGroups = [
	{ title: "Explore", links: exploreLinks },
	{ title: "Connect", links: connectLinks },
	{
		title: "Club",
		links: [
			{
				label: "Get involved",
				href: "mailto:techclub@ivey.ca?subject=Get%20involved%20with%20Ivey%20Tech%20Club",
			},
			{ label: "Alumni network", href: "/alumni" },
			{ label: "Contact", href: "mailto:techclub@ivey.ca" },
		],
	},
];

function FooterLink({ label, href }: {
	label: string;
	href: string;
}) {
	const isExternal = href.startsWith("http");

	return (
		<a
			href={href}
			rel={isExternal ? "noreferrer" : undefined}
			target={isExternal ? "_blank" : undefined}
		>
			{label}
		</a>
	);
}

interface IveyFooterProps {
	linkHomeSections?: boolean;
}

export default function IveyFooter({ linkHomeSections = false }: IveyFooterProps) {
	const resolveHref = (href: string) =>
		linkHomeSections && href.startsWith("#") ? `/${href}` : href;

	return (
		<footer className="ivey-footer" id="contact">
			<div className="ivey-footer__info">
				<div className="ivey-footer__identity">
					<a href={linkHomeSections ? "/" : "#top"} aria-label="Ivey Tech Club home">
						<Image src={itcLogo} alt="Ivey Tech Club" width={92} height={44} />
					</a>
					<p className="ivey-footer__school">Ivey Tech Club</p>
					<p className="ivey-footer__tagline">
						A student-led community for curious people building useful things together.
					</p>
					<div className="ivey-footer__socials" aria-label="Social links">
						{connectLinks.slice(1).map((link) => (
							<FooterLink key={link.label} {...link} />
						))}
					</div>
				</div>

				{footerGroups.map((group) => (
					<nav className="ivey-footer__nav" key={group.title} aria-label={group.title}>
						<h2>{group.title}</h2>
						<ul>
							{group.links.map((link) => (
								<li key={link.label}>
									<FooterLink {...link} href={resolveHref(link.href)} />
								</li>
							))}
						</ul>
					</nav>
				))}
			</div>

			<div className="ivey-footer__legal">
				<p>© 2026 Ivey Technology Club</p>
				<p>Created by the Ivey Tech Club web team.</p>
				<div className="ivey-footer__legal-actions">
					<a href="https://can01.safelinks.protection.outlook.com/?url=https%3A%2F%2Fwww.universe.com%2Fevents%2F2026-ivey-hbaa-clubs-week-tickets-7SZY4K&data=05%7C02%7Csli.hba2027%40ivey.ca%7C0e7d0fe22a3c42874da408df11fdc934%7C547040db185543209738e6878f6271fc%7C0%7C0%7C639249453968274775%7CUnknown%7CTWFpbGZsb3d8eyJFbXB0eU1hcGkiOnRydWUsIlYiOiIwLjAuMDAwMCIsIlAiOiJXaW4zMiIsIkFOIjoiTWFpbCIsIldUIjoyfQ%3D%3D%7C0%7C%7C%7C&sdata=W5N0JTftB3KML5u5zlUoaTbM%2BqEtgmOsnevd%2BJfu0gU%3D&reserved=0">Become a member <span aria-hidden="true">↗</span></a>
					<a href="#top">Back to top ↑</a>
				</div>
			</div>

			<div className="ivey-footer__art">
				<HalftoneImage alt="A halftone image of the Ivey Business School building and reflection pool" />
			</div>
		</footer>
	);
}
