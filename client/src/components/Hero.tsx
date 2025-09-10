import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Copy, Bot, TrendingUp, CheckCircle, MessageSquare } from "lucide-react";
import heroBackground from "@assets/generated_images/Gradient_mesh_hero_background_83768b02.png";

export default function Hero() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText("npm i -g @orion/cli");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
      <Card className="absolute top-20 right-8 w-80 p-4 bg-card/95 backdrop-blur-sm animate-pulse" data-testid="card-anomaly-detection">
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

      <Card className="absolute bottom-32 left-8 w-72 p-4 bg-card/95 backdrop-blur-sm" data-testid="card-natural-language">
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

      <Card className="absolute bottom-20 right-16 w-64 p-4 bg-card/95 backdrop-blur-sm" data-testid="card-scenario-modeling">
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

      <Card className="absolute top-32 left-12 w-72 p-4 bg-card/95 backdrop-blur-sm" data-testid="card-month-end">
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
        <h1 className="text-5xl md:text-7xl font-black text-foreground mb-6" data-testid="hero-headline">
          Your AI-Powered
          <br />
          <span className="bg-gradient-to-r from-chart-1 to-chart-2 bg-clip-text text-transparent">
            Finance Team Companion
          </span>
        </h1>
        
        <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto" data-testid="hero-subheadline">
          One platform for all your FP&A needs—included in Orion Professional, Team, and Enterprise plans.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
          <Button size="lg" className="text-lg px-8 py-4 hover-elevate active-elevate-2" data-testid="button-get-started">
            Get Started →
          </Button>
          <Button 
            variant="outline" 
            size="lg" 
            className="text-lg px-6 py-4 font-mono gap-2 hover-elevate active-elevate-2"
            onClick={handleCopy}
            data-testid="button-copy-cli"
          >
            $ npm i -g @orion/cli
            <Copy className="w-4 h-4" />
          </Button>
        </div>

        {/* Trust Indicators */}
        <div className="flex flex-wrap items-center justify-center gap-8 text-muted-foreground" data-testid="trust-indicators">
          <Badge variant="outline" className="px-4 py-2">
            <strong className="text-foreground">500+</strong> Finance Teams
          </Badge>
          <Badge variant="outline" className="px-4 py-2">
            <strong className="text-foreground">$2B+</strong> Analyzed Daily
          </Badge>
          <Badge variant="outline" className="px-4 py-2">
            <strong className="text-foreground">99.9%</strong> Uptime
          </Badge>
        </div>
      </div>
    </section>
  );
}