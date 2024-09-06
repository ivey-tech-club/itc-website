import Navbar from "../components/Navbar";
import Footer from "@/components/footer";
import Landing from "@/components/Landing";
import About from "@/components/About";
import Team from "@/components/Team";
import Events from "@/components/Events";
import Contact from "@/components/Contact";
export default function Home() {
	return (
		<div>
			<Navbar />
			<Landing />
			<About />
			<Events />
			<Team />
			<Contact />
			<Footer />
		</div>
	);
}
