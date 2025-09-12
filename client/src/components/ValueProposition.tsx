import { Card, CardContent } from "@/components/ui/card";
import { Rocket, Target, Lightbulb } from "lucide-react";

const pillars = [
  {
    icon: Rocket,
    title: "10x Faster Insights",
    metric: "10x",
    metricLabel: "Speed Increase",
    description: "From days of Excel manipulation to instant AI-powered analysis. Ask questions in plain English, get answers with full drill-down capability.",
    features: ["Natural language queries", "Instant data processing", "Smart drill-down", "Automated reporting"],
    color: "text-chart-1",
    bgColor: "bg-chart-1/10",
    borderColor: "border-chart-1/20"
  },
  {
    icon: Target,
    title: "99.9% Accuracy",
    metric: "99.9%",
    metricLabel: "Data Accuracy",
    description: "Automated anomaly detection catches errors before they impact reports. Single source of truth with complete audit trails.",
    features: ["Anomaly detection", "Error prevention", "Audit trails", "Data validation"],
    color: "text-chart-2",
    bgColor: "bg-chart-2/10",
    borderColor: "border-chart-2/20"
  },
  {
    icon: Lightbulb,
    title: "Predictive Intelligence",
    metric: "95%",
    metricLabel: "Forecast Accuracy",
    description: "Move beyond historical reporting. AI-powered forecasts that learn from your patterns and external market data.",
    features: ["Market intelligence", "Pattern recognition", "Trend analysis", "Risk modeling"],
    color: "text-chart-3",
    bgColor: "bg-chart-3/10",
    borderColor: "border-chart-3/20"
  },
];

export default function ValueProposition() {
  return (
    <section className="py-24 bg-gradient-to-br from-muted/30 via-background to-muted/30">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16 space-y-4">
          <div className="inline-block px-4 py-2 bg-primary/10 rounded-full border border-primary/20 mb-2">
            <span className="text-primary font-semibold text-sm">
              🏆 Proven Results
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4" data-testid="value-prop-title">
            Why Finance Teams Choose Orion
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Join hundreds of finance teams who have transformed their operations with measurable results.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {pillars.map((pillar, index) => {
            const Icon = pillar.icon;
            return (
              <div key={index} className={`text-center p-8 rounded-2xl border-2 ${pillar.borderColor} ${pillar.bgColor} hover:shadow-lg transition-all duration-300 group`} data-testid={`pillar-${index}`}>
                <div className="mb-6 flex justify-center">
                  <div className="p-4 rounded-full bg-background/80 shadow-md group-hover:scale-110 transition-transform duration-300">
                    <Icon className={`w-12 h-12 ${pillar.color}`} />
                  </div>
                </div>
                
                <div className="mb-4">
                  <div className={`text-5xl font-black ${pillar.color} mb-2`} data-testid={`pillar-metric-${index}`}>
                    {pillar.metric}
                  </div>
                  <div className="text-sm text-muted-foreground font-semibold">
                    {pillar.metricLabel}
                  </div>
                </div>
                
                <h3 className="text-2xl font-bold text-foreground mb-4 group-hover:text-primary transition-colors" data-testid={`pillar-title-${index}`}>
                  {pillar.title}
                </h3>
                
                <p className="text-muted-foreground text-base leading-relaxed mb-6" data-testid={`pillar-description-${index}`}>
                  {pillar.description}
                </p>
                
                <div className="space-y-2">
                  <div className="text-xs text-muted-foreground font-semibold mb-3">Key Capabilities:</div>
                  <div className="grid grid-cols-2 gap-2">
                    {pillar.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="text-xs px-2 py-1 bg-background/60 rounded-full text-muted-foreground border border-border/50">
                        ✓ {feature}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}