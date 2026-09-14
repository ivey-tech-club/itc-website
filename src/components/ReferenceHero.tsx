import Image from "next/image";

import groupPhoto from "../assets/hero-team.webp";
import AnimatedGrid from "./AnimatedGrid";

export default function ReferenceHero() {
	return (
		<section className="reference-hero" aria-labelledby="reference-hero-title">
			<AnimatedGrid />
			<div className="reference-hero__content">
				<div className="reference-hero__photo">
					<Image
						fill
						priority
						sizes="(max-width: 760px) 86vw, 34vw"
						src={groupPhoto}
						alt="Ivey Tech Club members gathered together"
					/>
				</div>

				<h1 className="reference-hero__wordmark" id="reference-hero-title">
					<span className="reference-brandmark reference-brandmark--hero">itc</span>
				</h1>

				<div className="reference-hero__copy">
					<p className="reference-hero__eyebrow">IVEY TECH CLUB</p>
					<p>
						A community of curious people building useful things and turning new
						ideas into momentum.
					</p>
					<div className="reference-hero__actions">
						<a href="#events">View events <span aria-hidden="true">↗</span></a>
						<a href="https://can01.safelinks.protection.outlook.com/?url=https%3A%2F%2Fwww.universe.com%2Fevents%2F2026-ivey-hbaa-clubs-week-tickets-7SZY4K&data=05%7C02%7Csli.hba2027%40ivey.ca%7C0e7d0fe22a3c42874da408df11fdc934%7C547040db185543209738e6878f6271fc%7C0%7C0%7C639249453968274775%7CUnknown%7CTWFpbGZsb3d8eyJFbXB0eU1hcGkiOnRydWUsIlYiOiIwLjAuMDAwMCIsIlAiOiJXaW4zMiIsIkFOIjoiTWFpbCIsIldUIjoyfQ%3D%3D%7C0%7C%7C%7C&sdata=W5N0JTftB3KML5u5zlUoaTbM%2BqEtgmOsnevd%2BJfu0gU%3D&reserved=0" target="_blank" rel="noopener noreferrer" aria-label="Become a member — email Ivey Tech Club">
							Become a member <span aria-hidden="true">↗</span>
						</a>
					</div>
				</div>
			</div>
		</section>
	);
}
