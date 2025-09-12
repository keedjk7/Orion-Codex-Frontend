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
        <div className="text-center mb-16 space-y-4">
          <div className="inline-block px-4 py-2 bg-primary/10 rounded-full border border-primary/20 mb-2">
            <span className="text-primary font-semibold text-sm">
              👥 User Stories
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4" data-testid="use-cases-title">
            Built for Every Finance Professional
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            See how Orion transforms daily workflows for finance teams at every level.
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 mb-12 bg-muted/30 p-2 rounded-xl" data-testid="use-cases-tabs">
            {useCases.map((useCase, index) => (
              <TabsTrigger 
                key={useCase.id} 
                value={useCase.id} 
                className="text-sm py-3 px-4 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-200 font-semibold"
                data-testid={`tab-${useCase.id}`}
              >
                <div className="text-center">
                  <div className="text-xs text-muted-foreground data-[state=active]:text-primary-foreground/80">Role {index + 1}</div>
                  <div>{useCase.title}</div>
                </div>
              </TabsTrigger>
            ))}
          </TabsList>

          {useCases.map((useCase) => (
            <TabsContent key={useCase.id} value={useCase.id} className="mt-0">
              <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12 p-8 bg-gradient-to-r from-primary/5 to-chart-1/5 rounded-2xl border border-primary/10">
                  <h3 className="text-3xl font-bold text-foreground mb-2" data-testid={`use-case-title-${useCase.id}`}>
                    {useCase.title}
                  </h3>
                  <p className="text-xl text-primary font-semibold mb-4" data-testid={`use-case-tagline-${useCase.id}`}>
                    {useCase.tagline}
                  </p>
                  <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Real user transformation story</span>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8 mb-8">
                  <Card className="p-6 border-2 border-red-200 relative overflow-hidden">
                    <div className="absolute top-4 right-4">
                      <div className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-semibold">
                        🔴 Before Orion
                      </div>
                    </div>
                    <CardContent className="p-0 mt-2">
                      <h4 className="font-bold text-foreground mb-4 flex items-center gap-2" data-testid={`before-title-${useCase.id}`}>
                        <span className="text-red-500">❌</span>
                        {useCase.beforeTitle}
                      </h4>
                      <ul className="space-y-3">
                        {useCase.before.map((item, index) => (
                          <li key={index} className="text-muted-foreground flex items-start gap-3" data-testid={`before-item-${useCase.id}-${index}`}>
                            <span className="text-red-400 mt-1 text-xs">●</span>
                            <span className="flex-1">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  <Card className="p-6 bg-gradient-to-br from-green-50 to-blue-50 border-2 border-green-200 relative overflow-hidden">
                    <div className="absolute top-4 right-4">
                      <div className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-semibold">
                        🟢 With Orion
                      </div>
                    </div>
                    <CardContent className="p-0 mt-2">
                      <h4 className="font-bold text-foreground mb-4 flex items-center gap-2" data-testid={`after-title-${useCase.id}`}>
                        <span className="text-green-500">✓</span>
                        {useCase.afterTitle}
                      </h4>
                      <ul className="space-y-3">
                        {useCase.after.map((item, index) => (
                          <li key={index} className="text-muted-foreground flex items-start gap-3" data-testid={`after-item-${useCase.id}-${index}`}>
                            <span className="text-green-500 mt-1 text-xs">✓</span>
                            <span className="flex-1">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>

                {useCase.features.length > 0 && (
                  <Card className="p-6 bg-gradient-to-r from-primary/5 to-chart-2/5 border border-primary/20">
                    <CardContent className="p-0">
                      <h4 className="font-bold text-foreground mb-4 flex items-center gap-2">
                        <span className="text-primary">🚀</span>
                        Key Features for {useCase.title}s:
                      </h4>
                      <div className="grid grid-cols-2 gap-3">
                        {useCase.features.map((feature, index) => (
                          <div key={index} className="flex items-center gap-2 p-3 bg-background/80 rounded-lg border border-border/50" data-testid={`feature-${useCase.id}-${index}`}>
                            <div className="w-2 h-2 bg-primary rounded-full"></div>
                            <span className="text-sm font-medium text-foreground">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
                
                <div className="mt-8 text-center">
                  <div className="inline-flex items-center gap-2 px-6 py-3 bg-primary/10 rounded-full border border-primary/20">
                    <span className="text-primary font-semibold text-sm">
                      📈 Results: Up to 90% time savings
                    </span>
                  </div>
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
}