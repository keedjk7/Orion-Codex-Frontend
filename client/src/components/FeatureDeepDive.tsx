import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import dashboardMockup from "@assets/generated_images/Financial_dashboard_mockup_interface_6e947e70.png";
import scenarioMockup from "@assets/generated_images/Scenario_modeling_interface_mockup_6ad3769f.png";
import allocationMockup from "@assets/generated_images/Cost_allocation_workflow_visualization_57740431.png";

const integrations = ["SAP", "Oracle", "NetSuite", "QuickBooks", "Excel", "Custom APIs"];

export default function FeatureDeepDive() {
  return (
    <div className="py-24 space-y-32">
      {/* Smart Reporting */}
      <section className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-4xl font-bold text-foreground" data-testid="smart-reporting-title">
              Your AI-Powered Financial Command Center
            </h2>
            <h3 className="text-2xl text-primary font-semibold" data-testid="smart-reporting-subtitle">
              Transform raw data into actionable intelligence
            </h3>
            <p className="text-lg text-muted-foreground leading-relaxed" data-testid="smart-reporting-description">
              Starting from your existing systems, Orion navigates your financial data to surface insights, 
              detect anomalies, and generate reports automatically.
            </p>
            
            <div className="space-y-4">
              <h4 className="font-semibold text-foreground">Key Features:</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-primary rounded-full"></span>
                  Automated data ingestion from any source
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-primary rounded-full"></span>
                  Real-time anomaly detection with AI
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-primary rounded-full"></span>
                  Interactive drill-down to transaction level
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-primary rounded-full"></span>
                  One-click period comparisons
                </li>
              </ul>
            </div>

            <div className="space-y-3">
              <p className="text-sm font-semibold text-foreground">Compatible with:</p>
              <div className="flex flex-wrap gap-2">
                {integrations.map((integration, index) => (
                  <Badge key={index} variant="secondary" data-testid={`integration-${index}`}>
                    {integration}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:pl-8">
            <Card className="overflow-hidden">
              <img 
                src={dashboardMockup} 
                alt="Smart Reporting Dashboard"
                className="w-full h-auto"
                data-testid="smart-reporting-mockup"
              />
            </Card>
          </div>
        </div>
      </section>

      {/* Scenario Modeling */}
      <section className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="lg:order-2 space-y-6">
            <h2 className="text-4xl font-bold text-foreground" data-testid="scenario-modeling-title">
              Test Every Possibility. Prepare for Any Future.
            </h2>
            <h3 className="text-2xl text-primary font-semibold" data-testid="scenario-modeling-subtitle">
              Model the future with confidence
            </h3>
            <p className="text-lg text-muted-foreground leading-relaxed" data-testid="scenario-modeling-description">
              Orion runs in the background so you can test assumptions and see instant impact. 
              Each scenario runs in an isolated sandbox without affecting your actuals.
            </p>
            
            <div className="space-y-4">
              <h4 className="font-semibold text-foreground">Key Benefits:</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-primary rounded-full"></span>
                  Test unlimited what-if scenarios
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-primary rounded-full"></span>
                  See cascading P&L effects instantly
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-primary rounded-full"></span>
                  Compare scenarios side-by-side
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-primary rounded-full"></span>
                  Get AI-powered scenario suggestions
                </li>
              </ul>
            </div>

            <Card className="p-4 bg-muted/50">
              <CardContent className="p-0">
                <p className="text-sm text-muted-foreground italic">
                  "We modeled 15 different growth scenarios in the time it used to take us 
                  to build one spreadsheet model."
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  — CFO, TechScale Inc.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="lg:order-1 lg:pr-8">
            <Card className="overflow-hidden">
              <img 
                src={scenarioMockup} 
                alt="Scenario Modeling Interface"
                className="w-full h-auto"
                data-testid="scenario-modeling-mockup"
              />
            </Card>
          </div>
        </div>
      </section>

      {/* Cost Intelligence */}
      <section className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-4xl font-bold text-foreground" data-testid="cost-intelligence-title">
              Fair. Transparent. Automated.
            </h2>
            <h3 className="text-2xl text-primary font-semibold" data-testid="cost-intelligence-subtitle">
              Delegate cost allocation to Orion
            </h3>
            <p className="text-lg text-muted-foreground leading-relaxed" data-testid="cost-intelligence-description">
              Set up automatic allocation rules with our visual builder. Tag @orion to start allocations 
              directly from your workflow. Orion plugs into your existing processes, running proactively 
              so your team stays focused on strategic work.
            </p>
            
            <div className="space-y-4">
              <h4 className="font-semibold text-foreground">The Orion Advantage:</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-primary rounded-full"></span>
                  Visual drag-and-drop rule builder
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-primary rounded-full"></span>
                  AI-recommended allocation drivers
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-primary rounded-full"></span>
                  Full transparency for all departments
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-primary rounded-full"></span>
                  Complete audit trail
                </li>
              </ul>
            </div>

            <Card className="p-4 bg-primary/5">
              <CardContent className="p-0">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-semibold">Allocating IT Costs</span>
                    <span className="text-xs text-muted-foreground">ETA: 30 seconds</span>
                  </div>
                  <div className="bg-muted rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full w-4/5" />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    85% Complete • 2 departments remaining
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:pl-8">
            <Card className="overflow-hidden">
              <img 
                src={allocationMockup} 
                alt="Cost Allocation Workflow"
                className="w-full h-auto"
                data-testid="cost-intelligence-mockup"
              />
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}