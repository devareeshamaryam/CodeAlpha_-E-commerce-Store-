 // app/page.tsx
import CTABar from "@/components/CTABar";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import ShopSection from "@/components/ShopSection";
import SocialsSection from "@/components/Socials";

export default function Home() {
  return (
    <> 
    <main>
      <div className="relative">
        <div className="absolute inset-x-0 top-0 z-50">
          <CTABar />
          <Header />
        </div>
        <Hero />
      </div>
    </main>
    <ShopSection />
    <SocialsSection />
    <Footer />
    </>
  );
}