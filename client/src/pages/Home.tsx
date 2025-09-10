import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import FeaturesOverview from "@/components/FeaturesOverview";
import ValueProposition from "@/components/ValueProposition";
import FeatureDeepDive from "@/components/FeatureDeepDive";
import UseCases from "@/components/UseCases";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main>
        <Hero />
        <FeaturesOverview />
        <ValueProposition />
        <FeatureDeepDive />
        <UseCases />
      </main>
      <Footer />
    </div>
  );
}