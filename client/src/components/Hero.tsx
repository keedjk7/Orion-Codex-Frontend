import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { BarChart3, DollarSign, TrendingUp, CheckCircle, MessageSquare, Bot, PieChart } from "lucide-react";
import heroBackground from "@assets/generated_images/Gradient_mesh_hero_background_83768b02.png";
import { useKeycloak } from "@/contexts/KeycloakContext";

export default function Hero() {
  const { authenticated } = useKeycloak();

  const handleGetStartedClick = () => {
    if (authenticated) {
      // If user is already logged in, go to home page
      window.location.href = '/home';
    } else {
      // If not logged in, go to login page
      window.location.href = '/login';
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroBackground})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background/60 to-background/80" />

      {/* Floating Demo Cards */}
      <Card className="absolute top-20 right-8 w-80 p-4 bg-card/95 backdrop-blur-sm animate-pulse hidden lg:block" data-testid="card-anomaly-detection">
        <div className="flex items-center gap-2 mb-3">
          <Bot className="w-5 h-5 text-chart-2" />
          <span className="font-semibold text-card-foreground">AI Anomaly Detection</span>
        </div>
        <div className="text-sm text-muted-foreground mb-2">
          "3 unusual patterns detected in Q4 expenses"
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Status: Analyzing...</span>
          <div className="flex-1 bg-muted rounded-full h-2">
            <div className="bg-chart-2 h-2 rounded-full w-4/5" />
          </div>
          <span className="text-xs font-mono">85%</span>
        </div>
      </Card>

      <Card className="absolute bottom-32 left-8 w-72 p-4 bg-card/95 backdrop-blur-sm hidden lg:block" data-testid="card-natural-language">
        <div className="flex items-center gap-2 mb-3">
          <MessageSquare className="w-5 h-5 text-chart-3" />
          <span className="font-semibold text-card-foreground">Natural Language Query</span>
        </div>
        <div className="space-y-2 text-sm">
          <div className="text-muted-foreground">
            <strong>User:</strong> "Why did marketing costs increase 15%?"
          </div>
          <div className="text-card-foreground">
            <strong>Orion:</strong> "Campaign spend up $45K (+18%) driven by..."
            <span className="animate-pulse">|</span>
          </div>
        </div>
      </Card>

      <Card className="absolute bottom-20 right-16 w-64 p-4 bg-card/95 backdrop-blur-sm hidden lg:block" data-testid="card-scenario-modeling">
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp className="w-5 h-5 text-chart-1" />
          <span className="font-semibold text-card-foreground">Scenario Modeling</span>
        </div>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Conservative:</span>
            <span className="text-green-600">+5% ↗️</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Base Case:</span>
            <span className="text-green-600">+12% ↗️</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Aggressive:</span>
            <span className="text-green-600">+22% ↗️</span>
          </div>
        </div>
      </Card>

      <Card className="absolute top-32 left-12 w-72 p-4 bg-card/95 backdrop-blur-sm hidden lg:block" data-testid="card-month-end">
        <div className="flex items-center gap-2 mb-3">
          <CheckCircle className="w-5 h-5 text-green-600" />
          <span className="font-semibold text-card-foreground">Month-End Progress</span>
        </div>
        <div className="space-y-3 text-sm">
          <div className="space-y-1">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Consolidation:</span>
              <span className="text-green-600">Complete</span>
            </div>
            <div className="bg-green-600 h-2 rounded-full w-full" />
          </div>
          <div className="space-y-1">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Allocations:</span>
              <span className="text-chart-2">Running</span>
            </div>
            <div className="bg-muted rounded-full h-2">
              <div className="bg-chart-2 h-2 rounded-full w-3/4" />
            </div>
          </div>
          <div className="pt-2 border-t border-border">
            <span className="text-xs text-muted-foreground">Time saved: 4.5 hours</span>
          </div>
        </div>
      </Card>

      {/* Main Content */}
      <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
        <div className="space-y-6">
          <div className="inline-block px-4 py-2 bg-primary/10 rounded-full border border-primary/20 mb-4">
            <span className="text-primary font-semibold text-sm">
              🚀 Transform Your Finance Operations
            </span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black text-foreground leading-tight" data-testid="hero-headline">
            <span className="bg-gradient-to-r from-primary to-chart-1 bg-clip-text text-transparent text-8xl md:text-9xl">
              Orion
            </span>
            <br />
            <span className="text-4xl md:text-5xl">Your AI-Powered</span>
            <br />
            <span className="bg-gradient-to-r from-chart-1 to-chart-2 bg-clip-text text-transparent">
              Finance Team Companion
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed" data-testid="hero-subheadline">
            Transform complex financial data into actionable insights with AI. 
            <br className="hidden md:block" />
            <span className="text-foreground font-semibold">Cut reporting time by 90%</span> and make data-driven decisions faster.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto text-sm text-muted-foreground">
            <div className="flex items-center justify-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Real-time Analytics</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>AI-Powered Insights</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span>No-Code Setup</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
          <Button 
            size="lg" 
            className="text-lg px-8 py-4 hover-elevate active-elevate-2" 
            data-testid="button-get-started"
            onClick={handleGetStartedClick}
          >
            Get Started →
          </Button>
          <Button 
            size="lg" 
            variant="outline"
            className="text-lg px-8 py-4 hover-elevate active-elevate-2" 
            data-testid="button-learn-more"
            onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Learn More →
          </Button>
        </div>

        {/* Key Finance Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto mb-8">
          <Card className="p-6 bg-card/80 backdrop-blur-sm hover-elevate transition-all duration-300" data-testid="feature-finance-reports">
            <div className="flex items-center gap-3 mb-3">
              <BarChart3 className="w-6 h-6 text-chart-1" />
              <h3 className="font-semibold text-card-foreground">Finance Reports</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Generate comprehensive financial reports in seconds with AI-powered analysis and insights.
            </p>
          </Card>
          
          <Card className="p-6 bg-card/80 backdrop-blur-sm hover-elevate transition-all duration-300" data-testid="feature-resource-allocation">
            <div className="flex items-center gap-3 mb-3">
              <PieChart className="w-6 h-6 text-chart-2" />
              <h3 className="font-semibold text-card-foreground">Resource Allocation</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Track costs and revenue allocation across departments with real-time budget monitoring.
            </p>
          </Card>
          
          <Card className="p-6 bg-card/80 backdrop-blur-sm hover-elevate transition-all duration-300" data-testid="feature-sales-forecast">
            <div className="flex items-center gap-3 mb-3">
              <DollarSign className="w-6 h-6 text-chart-3" />
              <h3 className="font-semibold text-card-foreground">Sales Forecast</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Predict future sales trends and revenue with advanced machine learning models.
            </p>
          </Card>
        </div>

        {/* Trust Indicators */}
        <div className="bg-card/80 backdrop-blur-sm border border-card-border rounded-2xl p-6 max-w-4xl mx-auto" data-testid="trust-indicators">
          <p className="text-center text-sm text-muted-foreground mb-4">Trusted by leading finance teams worldwide</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-chart-1 mb-1">500+</div>
              <div className="text-sm text-muted-foreground">Finance Teams</div>
              <div className="text-xs text-muted-foreground mt-1">Across 40+ countries</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-chart-2 mb-1">$2B+</div>
              <div className="text-sm text-muted-foreground">Analyzed Daily</div>
              <div className="text-xs text-muted-foreground mt-1">Real-time processing</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-chart-3 mb-1">99.9%</div>
              <div className="text-sm text-muted-foreground">Uptime SLA</div>
              <div className="text-xs text-muted-foreground mt-1">Enterprise-grade</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}