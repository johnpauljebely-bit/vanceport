import Hero from "@/components/sections/hero";
import PositioningSection from "@/components/sections/positioning-section";
import CapabilitiesSection from "@/components/sections/capabilities-section";
import CommunitySection from "@/components/sections/community-section";
import SmoothScroll from "@/components/smooth-scroll";

export default function Home() {
  return (
    <>
      <SmoothScroll />
      <Hero />
      <PositioningSection />
      <CapabilitiesSection />
      <CommunitySection />
    </>
  );
}
