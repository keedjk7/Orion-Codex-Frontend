import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import FeaturesOverview from "@/components/FeaturesOverview";
import ValueProposition from "@/components/ValueProposition";
import FeatureDeepDive from "@/components/FeatureDeepDive";
import UseCases from "@/components/UseCases";
import Footer from "@/components/Footer";
import SectionDivider from "@/components/SectionDivider";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="space-y-8">
        <Hero />
        <SectionDivider variant="dots" />
        <FeaturesOverview />
        <SectionDivider variant="gradient" />
        <ValueProposition />
        <SectionDivider variant="dots" />
        <FeatureDeepDive />
        <SectionDivider variant="gradient" />
        <UseCases />
      </main>
      <Footer />
    </div>
  );
}