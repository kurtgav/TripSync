import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import HeroSection from "@/components/home/hero-section";
import UniversitySelector from "@/components/home/university-selector";
import HowItWorks from "@/components/home/how-it-works";
import AvailableRides from "@/components/home/available-rides";
import MapSection from "@/components/home/map-section";
import UniversityPartners from "@/components/home/university-partners";
import Testimonials from "@/components/home/testimonials";
import DownloadApp from "@/components/home/download-app";
import { Helmet } from "react-helmet";

export default function HomePage() {
  return (
    <>
      <Helmet>
        <title>TripSync - Carpooling for Students</title>
        <meta name="description" content="TripSync connects university students with reliable carpooling options, helping you save money, reduce emissions, and make new friends." />
      </Helmet>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <HeroSection />
          <UniversitySelector />
          <HowItWorks />
          <AvailableRides />
          <MapSection />
          <UniversityPartners />
          <Testimonials />
          <DownloadApp />
        </main>
        <Footer />
      </div>
    </>
  );
}
