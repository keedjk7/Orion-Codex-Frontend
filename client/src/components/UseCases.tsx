import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const useCases = [
  {
    id: "analyst",
    title: "Finance Analyst",
    tagline: "Finally, Focus on Analysis, Not Data Prep",
    beforeTitle: "Priya's Day Before Orion:",
    before: [
      "3 hours exporting and consolidating data",
      "2 hours creating variance reports", 
      "1 hour explaining variances",
      "0 hours on strategic analysis"
    ],
    afterTitle: "Priya's Day With Orion:",
    after: [
      "0 minutes on data prep (automated)",
      "15 minutes reviewing AI-generated variances",
      "5+ hours on strategic analysis and improvements"
    ],
    features: [
      "Automated report generation",
      "Drill-down to transaction level",
      "AI-powered variance explanations", 
      "Excel add-in for familiar workflows"
    ]
  },
  {
    id: "controller",
    title: "Financial Controller", 
    tagline: "Control and Compliance, Automated",
    beforeTitle: "David's Wins with Orion:",
    before: [
      "🛡️ Automated anomaly detection prevents errors",
      "📋 Complete audit trails for every change",
      "⚡ Month-end close reduced by 20%",
      "🔒 SOX compliance built-in"
    ],
    afterTitle: "Features David Loves:",
    after: [
      "Real-time consolidation across entities",
      "Automated journal entry validation",
      "Role-based access controls",
      "One-click regulatory reporting"
    ],
    features: []
  },
  {
    id: "cfo",
    title: "CFO",
    tagline: "Strategic Insights at the Speed of Thought", 
    beforeTitle: "Sarah's Strategic Advantages:",
    before: [
      "Board decks generated automatically",
      "Predictive forecasts with external data",
      "Scenario planning in real-time",
      "Natural language queries for instant insights"
    ],
    afterTitle: "Executive Features:",
    after: [
      "AI-generated executive summaries",
      "Competitor and market intelligence", 
      "Long-range planning tools",
      "Mobile-first dashboard design"
    ],
    features: []
  },
  {
    id: "department-head", 
    title: "Department Head",
    tagline: "Your Budget, Clearly Understood",
    beforeTitle: "Mark's Experience:",
    before: [
      "Simple web portal for budget submission",
      "Real-time spending visibility",
      "Automatic alerts for budget variances",
      "Clear approval workflows"
    ],
    afterTitle: "What Mark Appreciates:",
    after: [
      "No more spreadsheet email chains",
      "Instant budget vs actual comparisons",
      "Mobile access to spending data",
      "Collaborative planning with finance team"
    ],
    features: []
  }
];

export default function UseCases() {
  const [activeTab, setActiveTab] = useState("analyst");

  return (
    <section className="py-24 bg-gradient-to-b from-background to-muted/10">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4" data-testid="use-cases-title">
            Built for Every Finance Professional
          </h2>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-12" data-testid="use-cases-tabs">
            {useCases.map((useCase) => (
              <TabsTrigger 
                key={useCase.id} 
                value={useCase.id} 
                className="text-sm"
                data-testid={`tab-${useCase.id}`}
              >
                {useCase.title}
              </TabsTrigger>
            ))}
          </TabsList>

          {useCases.map((useCase) => (
            <TabsContent key={useCase.id} value={useCase.id} className="mt-0">
              <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                  <h3 className="text-3xl font-bold text-foreground mb-2" data-testid={`use-case-title-${useCase.id}`}>
                    {useCase.title}
                  </h3>
                  <p className="text-xl text-primary font-semibold" data-testid={`use-case-tagline-${useCase.id}`}>
                    {useCase.tagline}
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 mb-8">
                  <Card className="p-6">
                    <CardContent className="p-0">
                      <h4 className="font-bold text-foreground mb-4" data-testid={`before-title-${useCase.id}`}>
                        {useCase.beforeTitle}
                      </h4>
                      <ul className="space-y-3">
                        {useCase.before.map((item, index) => (
                          <li key={index} className="text-muted-foreground" data-testid={`before-item-${useCase.id}-${index}`}>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  <Card className="p-6 bg-primary/5">
                    <CardContent className="p-0">
                      <h4 className="font-bold text-foreground mb-4" data-testid={`after-title-${useCase.id}`}>
                        {useCase.afterTitle}
                      </h4>
                      <ul className="space-y-3">
                        {useCase.after.map((item, index) => (
                          <li key={index} className="text-muted-foreground" data-testid={`after-item-${useCase.id}-${index}`}>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>

                {useCase.features.length > 0 && (
                  <Card className="p-6">
                    <CardContent className="p-0">
                      <h4 className="font-bold text-foreground mb-4">Key Features for {useCase.title}s:</h4>
                      <div className="flex flex-wrap gap-2">
                        {useCase.features.map((feature, index) => (
                          <Badge key={index} variant="secondary" data-testid={`feature-${useCase.id}-${index}`}>
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
}