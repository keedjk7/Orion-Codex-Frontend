import { Card, CardContent } from "@/components/ui/card";
import { Rocket, Target, Lightbulb } from "lucide-react";

const pillars = [
  {
    icon: Rocket,
    title: "10x Faster Insights",
    description: "From days of Excel manipulation to instant AI-powered analysis. Ask questions in plain English, get answers with full drill-down capability.",
  },
  {
    icon: Target,
    title: "99.9% Accuracy",
    description: "Automated anomaly detection catches errors before they impact reports. Single source of truth with complete audit trails.",
  },
  {
    icon: Lightbulb,
    title: "Predictive Intelligence",
    description: "Move beyond historical reporting. AI-powered forecasts that learn from your patterns and external market data.",
  },
];

export default function ValueProposition() {
  return (
    <section className="py-24 bg-gradient-to-r from-primary/5 via-background to-primary/5">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4" data-testid="value-prop-title">
            Why Finance Teams Choose Orion
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {pillars.map((pillar, index) => {
            const Icon = pillar.icon;
            return (
              <div key={index} className="text-center" data-testid={`pillar-${index}`}>
                <div className="mb-6 flex justify-center">
                  <div className="p-4 rounded-full bg-primary/10">
                    <Icon className="w-12 h-12 text-primary" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-4" data-testid={`pillar-title-${index}`}>
                  {pillar.title}
                </h3>
                <p className="text-muted-foreground text-lg leading-relaxed" data-testid={`pillar-description-${index}`}>
                  {pillar.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}