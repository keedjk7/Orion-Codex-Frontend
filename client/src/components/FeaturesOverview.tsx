import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart3, Zap, DollarSign, Users, Bot } from "lucide-react";

const features = [
  {
    icon: BarChart3,
    title: "Smart Reporting",
    subtitle: "AI-Powered Financial Intelligence",
    description: "Real-time data consolidation with automated anomaly detection. Your single source of financial truth.",
  },
  {
    icon: Zap,
    title: "Scenario Modeling", 
    subtitle: "Interactive What-If Analysis",
    description: "Test any assumption and see instant P&L impact. Model the future with confidence.",
  },
  {
    icon: DollarSign,
    title: "Cost Intelligence",
    subtitle: "Automated Cost Allocation", 
    description: "Fair, transparent, and automated cost distribution with AI-recommended drivers.",
  },
  {
    icon: Users,
    title: "Collaborative Planning",
    subtitle: "Streamlined Budgeting & Forecasting",
    description: "Web-based workflows with real-time consolidation and AI-powered baselines.",
  },
  {
    icon: Bot,
    title: "AI Assistant & Strategic Insights",
    subtitle: "Natural Language Queries + Long-Range Planning",
    description: "Ask questions in plain English. Get strategic insights with external market intelligence.",
  },
];

export default function FeaturesOverview() {
  return (
    <section className="py-24 bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4" data-testid="features-title">
            Five Powerful Features to Transform Your FP&A
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={index} className="p-6 hover-elevate transition-all duration-200" data-testid={`feature-card-${index}`}>
                <CardContent className="p-0">
                  <div className="mb-4">
                    <Icon className="w-12 h-12 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-2" data-testid={`feature-title-${index}`}>
                    {feature.title}
                  </h3>
                  <p className="text-primary font-semibold mb-3" data-testid={`feature-subtitle-${index}`}>
                    {feature.subtitle}
                  </p>
                  <p className="text-muted-foreground leading-relaxed" data-testid={`feature-description-${index}`}>
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="text-center">
          <Button size="lg" variant="outline" className="hover-elevate active-elevate-2" data-testid="button-explore-features">
            Explore All Features →
          </Button>
        </div>
      </div>
    </section>
  );
}