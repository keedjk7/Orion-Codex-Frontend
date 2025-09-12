import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart3, Zap, DollarSign, Users, Bot } from "lucide-react";

const features = [
  {
    icon: BarChart3,
    title: "Smart Reporting",
    subtitle: "AI-Powered Financial Intelligence",
    description: "Transform raw data into actionable insights instantly. Get automated anomaly detection and drill-down capabilities.",
    benefits: ["90% faster reporting", "Zero manual errors", "Real-time updates"],
    color: "text-chart-1",
    bgColor: "bg-chart-1/10"
  },
  {
    icon: Zap,
    title: "Scenario Modeling", 
    subtitle: "Interactive What-If Analysis",
    description: "Test any business assumption and see immediate P&L impact. Make confident strategic decisions with data.",
    benefits: ["Instant projections", "Multiple scenarios", "Risk assessment"],
    color: "text-chart-2",
    bgColor: "bg-chart-2/10"
  },
  {
    icon: DollarSign,
    title: "Cost Intelligence",
    subtitle: "Automated Cost Allocation", 
    description: "Fair, transparent cost distribution using AI recommendations. Eliminate manual allocation disputes forever.",
    benefits: ["AI-driven allocation", "Transparent logic", "Audit-ready trails"],
    color: "text-chart-3",
    bgColor: "bg-chart-3/10"
  },
  {
    icon: Users,
    title: "Collaborative Planning",
    subtitle: "Streamlined Budgeting & Forecasting",
    description: "Unite your team with real-time collaborative workflows. Get AI-powered baseline suggestions and approvals.",
    benefits: ["Team collaboration", "Workflow automation", "Version control"],
    color: "text-chart-4",
    bgColor: "bg-chart-4/10"
  },
  {
    icon: Bot,
    title: "AI Assistant & Strategic Insights",
    subtitle: "Natural Language Queries + Long-Range Planning",
    description: "Ask complex financial questions in plain English. Get strategic insights with market intelligence integration.",
    benefits: ["Natural language", "Market insights", "Strategic analysis"],
    color: "text-chart-5",
    bgColor: "bg-chart-5/10"
  },
];

export default function FeaturesOverview() {
  return (
    <section className="py-24 bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16 space-y-4">
          <div className="inline-block px-4 py-2 bg-primary/10 rounded-full border border-primary/20 mb-2">
            <span className="text-primary font-semibold text-sm">
              ⚡ Core Features
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4" data-testid="features-title">
            Five Powerful Features to Transform Your FP&A
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Everything you need to modernize your financial operations and make data-driven decisions faster.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={index} className="p-6 hover-elevate transition-all duration-300 border-l-4 border-l-transparent hover:border-l-primary group" data-testid={`feature-card-${index}`}>
                <CardContent className="p-0">
                  <div className="mb-4 flex items-center justify-between">
                    <div className={`p-3 rounded-xl ${feature.bgColor} group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className={`w-8 h-8 ${feature.color}`} />
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-muted-foreground">Feature #{index + 1}</div>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors" data-testid={`feature-title-${index}`}>
                    {feature.title}
                  </h3>
                  <p className="text-primary font-semibold mb-3 text-sm" data-testid={`feature-subtitle-${index}`}>
                    {feature.subtitle}
                  </p>
                  <p className="text-muted-foreground leading-relaxed mb-4" data-testid={`feature-description-${index}`}>
                    {feature.description}
                  </p>
                  <div className="space-y-2">
                    <div className="text-xs text-muted-foreground font-semibold mb-2">Key Benefits:</div>
                    <div className="flex flex-wrap gap-1">
                      {feature.benefits.map((benefit, benefitIndex) => (
                        <div key={benefitIndex} className="text-xs px-2 py-1 bg-muted/50 rounded-full text-muted-foreground">
                          • {benefit}
                        </div>
                      ))}
                    </div>
                  </div>
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