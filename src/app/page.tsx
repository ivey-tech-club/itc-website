import Navbar from "../components/Navbar";
import Footer from "@/components/footer";
import Landing from "@/components/Landing";
import About from "@/components/About";
import Team from "@/components/Team";
import Events from "@/components/Events";
import AlumniMapTable from "@/components/AlumniMapTable";
import Sponsors from "@/components/Sponsors";

export default function Home() {
  return (
    <div>
      <Navbar />
      <Landing />
      <About />
      <Events />
      <Team />
      <AlumniMapTable />
      <Sponsors />
      <Footer />
    </div>
  );
}
