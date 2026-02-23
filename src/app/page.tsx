/**
 * Lumina Café — Home Page (Server Component)
 *
 * Orchestrates all page sections. Server components (MenuSection)
 * fetch data on the server; client components handle animations.
 *
 * @module app/page
 */

import {
  Navbar,
  Hero,
  Features,
  Philosophy,
  Protocol,
  Testimonials,
  Footer,
  RevealLoader,
  CinematicIntro,
  HowItWorks,
  AboutUs,
} from '@/components/page-client';

import MenuSection from '@/components/menu/menu-section';
import ReservationForm from '@/components/reservation/reservation-form';

export default function Home() {
  return (
    <main className="bg-cream min-h-screen font-sans relative">
      <RevealLoader bgColors={['#1A1A1A']} />
      <CinematicIntro />
      <Navbar />
      <Hero />
      <HowItWorks />
      <AboutUs />
      <Features />
      <MenuSection />
      <Philosophy />
      <Protocol />
      <ReservationForm />
      <Testimonials />
      <Footer />
    </main>
  );
}
