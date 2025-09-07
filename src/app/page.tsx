"use client";

import Hero from "@/components/Landing/hero-section/Hero";
import Navbar_1 from "@/components/Landing/navbar/Navbar_1";
import PAS from "@/components/Landing/PAS";
import HowItWorks from "@/components/Landing/HowItWorks";
import Demo from "@/components/Landing/Demo";
import FAQ from "@/components/Landing/FAQ";
import Testimonios from "@/components/Landing/Testimonios/Testimonios";
import Contact from "@/components/Landing/Contact";
import Guarantee from "@/components/Landing/Guarantee";
import Floating from "@/components/Landing/Floating";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Navbar_1 />
      <Hero />
      <PAS />
      <HowItWorks />
      <Demo />
      <Testimonios />
      <FAQ />
      <Guarantee />
      <Contact />
      <Floating />
    </div>
  );
}
