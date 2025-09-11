import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { 
  TrendingUp, 
  TrendingDown, 
  Building2, 
  BarChart3, 
  Globe, 
  Clock,
  Activity,
  DollarSign,
  Users,
  ArrowUpRight,
  ArrowDownRight,
  Menu
} from "lucide-react";
import heroBackground from "@assets/generated_images/Gradient_mesh_hero_background_83768b02.png";

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Design placeholders instead of real data
  const placeholderMarketData = [
    { id: "1", symbol: "AAPL", name: "Apple Inc.", sector: "Technology" },
    { id: "2", symbol: "MSFT", name: "Microsoft Corporation", sector: "Technology" },
    { id: "3", symbol: "GOOGL", name: "Alphabet Inc.", sector: "Technology" },
    { id: "4", symbol: "AMZN", name: "Amazon.com Inc.", sector: "Consumer Discretionary" },
    { id: "5", symbol: "TSLA", name: "Tesla Inc.", sector: "Consumer Discretionary" },
    { id: "6", symbol: "NVDA", name: "NVIDIA Corporation", sector: "Technology" }
  ];

  const placeholderNews = [
    { id: "1", category: "Markets", importance: "high" },
    { id: "2", category: "Earnings", importance: "medium" },
    { id: "3", category: "Policy", importance: "high" },
    { id: "4", category: "Analysis", importance: "medium" },
    { id: "5", category: "Technology", importance: "low" }
  ];

  const placeholderCompanies = [
    { id: "1", symbol: "AAPL", industry: "Technology Hardware" },
    { id: "2", symbol: "MSFT", industry: "Software Infrastructure" },
    { id: "3", symbol: "GOOGL", industry: "Internet Content & Information" }
  ];

  const placeholderIndicators = [
    { id: "1", name: "GDP Growth Rate", period: "Q3 2024" },
    { id: "2", name: "Unemployment Rate", period: "September 2024" },
    { id: "3", name: "Inflation Rate", period: "September 2024" },
    { id: "4", name: "Treasury Yield", period: "Current" },
    { id: "5", name: "Consumer Confidence", period: "September 2024" }
  ];

  const formatCurrency = (value: string) => {
    const num = parseFloat(value);
    if (num >= 1e12) return `$${(num / 1e12).toFixed(1)}T`;
    if (num >= 1e9) return `$${(num / 1e9).toFixed(1)}B`;
    if (num >= 1e6) return `$${(num / 1e6).toFixed(1)}M`;
    return `$${num.toLocaleString()}`;
  };

  const formatChange = (change: string, changePercent: string) => {
    const changeNum = parseFloat(change);
    const isPositive = changeNum >= 0;
    return (
      <span className={`flex items-center gap-1 ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
        {isPositive ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
        {Math.abs(changeNum).toFixed(2)} ({Math.abs(parseFloat(changePercent)).toFixed(2)}%)
      </span>
    );
  };

  const SidebarContent = () => (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-foreground mb-6" data-testid="dashboard-title">
        Business Intelligence
      </h1>
      
      {/* Navigation Sections */}
      <div className="space-y-6">
        <div>
          <h3 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wide" data-testid="nav-markets">
            Markets
          </h3>
          <div className="space-y-2">
            <Button variant="ghost" className="w-full justify-start" data-testid="nav-equities">
              <BarChart3 className="w-4 h-4 mr-2" />
              Equities
            </Button>
            <Button variant="ghost" className="w-full justify-start" data-testid="nav-bonds">
              <TrendingUp className="w-4 h-4 mr-2" />
              Bonds
            </Button>
            <Button variant="ghost" className="w-full justify-start" data-testid="nav-commodities">
              <Globe className="w-4 h-4 mr-2" />
              Commodities
            </Button>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wide" data-testid="nav-analysis">
            Analysis
          </h3>
          <div className="space-y-2">
            <Button variant="ghost" className="w-full justify-start" data-testid="nav-company-research">
              <Building2 className="w-4 h-4 mr-2" />
              Company Research
            </Button>
            <Button variant="ghost" className="w-full justify-start" data-testid="nav-economic-data">
              <Activity className="w-4 h-4 mr-2" />
              Economic Data
            </Button>
            <Button variant="ghost" className="w-full justify-start" data-testid="nav-news-analysis">
              <Clock className="w-4 h-4 mr-2" />
              News Analysis
            </Button>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wide" data-testid="nav-reports">
            Reports
          </h3>
          <div className="space-y-2">
            <Button variant="ghost" className="w-full justify-start" data-testid="nav-financial-reports">
              <BarChart3 className="w-4 h-4 mr-2" />
              Financial Reports
            </Button>
            <Button variant="ghost" className="w-full justify-start" data-testid="nav-earnings-reports">
              <TrendingUp className="w-4 h-4 mr-2" />
              Earnings Reports
            </Button>
            <Button variant="ghost" className="w-full justify-start" data-testid="nav-market-reports">
              <Globe className="w-4 h-4 mr-2" />
              Market Reports
            </Button>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wide" data-testid="nav-tools">
            Tools
          </h3>
          <div className="space-y-2">
            <Button variant="ghost" className="w-full justify-start" data-testid="nav-portfolio">
              <DollarSign className="w-4 h-4 mr-2" />
              Portfolio Analytics
            </Button>
            <Button variant="ghost" className="w-full justify-start" data-testid="nav-alerts">
              <Users className="w-4 h-4 mr-2" />
              Market Alerts
            </Button>
          </div>
        </div>
      </div>

      <Separator className="my-6" />

      {/* Economic Indicators */}
      <div>
        <h3 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wide" data-testid="economic-indicators-title">
          Economic Indicators
        </h3>
        <div className="space-y-3">
          {placeholderIndicators.map((indicator) => (
            <div key={indicator.id} className="flex justify-between items-center" data-testid={`indicator-${indicator.name.toLowerCase().replace(/\s+/g, '-')}`}>
              <div className="text-sm">
                <div className="font-medium">{indicator.name}</div>
                <div className="text-muted-foreground text-xs">{indicator.period}</div>
              </div>
              <div className="text-right">
                <div className="w-12 h-4 bg-muted rounded animate-pulse"></div>
                <div className="w-8 h-3 bg-muted/60 rounded animate-pulse mt-1"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Beautiful Background like landing page */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroBackground})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background/60 to-background/80" />
      
      <div className="relative z-10 flex">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block w-80 bg-card/95 backdrop-blur-sm border-r border-border/20 flex-shrink-0">
          <ScrollArea className="h-screen">
            <SidebarContent />
          </ScrollArea>
        </div>

        {/* Mobile Header */}
        <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-md border-b border-border/20">
          <div className="flex items-center justify-between p-4">
            <h1 className="text-lg font-bold text-foreground" data-testid="mobile-dashboard-title">
              Business Intelligence
            </h1>
            <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" data-testid="mobile-menu-trigger">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80 p-0 bg-card/95 backdrop-blur-sm">
                <ScrollArea className="h-full">
                  <SidebarContent />
                </ScrollArea>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 p-6 pt-20 lg:pt-6">
          <div className="max-w-6xl mx-auto space-y-6">
            {/* Top Market Overview */}
            <Card className="bg-card/95 backdrop-blur-sm" data-testid="market-overview-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Market Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {placeholderMarketData.map((stock) => (
                    <div key={stock.id} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors bg-card/50 backdrop-blur-sm" data-testid={`stock-${stock.symbol}`}>
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <div className="font-semibold">{stock.symbol}</div>
                          <div className="text-sm text-muted-foreground">{stock.name}</div>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {stock.sector}
                        </Badge>
                      </div>
                      <div className="space-y-1">
                        <div className="w-16 h-6 bg-muted rounded animate-pulse"></div>
                        <div className="flex items-center gap-1">
                          <div className="w-12 h-4 bg-green-200 rounded animate-pulse"></div>
                          <ArrowUpRight className="w-3 h-3 text-green-600" />
                        </div>
                        <div className="w-20 h-3 bg-muted/60 rounded animate-pulse"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Business News */}
              <Card className="bg-card/95 backdrop-blur-sm" data-testid="business-news-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    Latest Business News
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-80">
                    <div className="space-y-4">
                      {placeholderNews.map((news) => (
                        <div key={news.id} className="pb-4 border-b last:border-b-0" data-testid={`news-${news.id}`}>
                          <div className="flex items-start gap-3">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <Badge 
                                  variant={news.importance === 'high' ? 'destructive' : news.importance === 'medium' ? 'default' : 'secondary'}
                                  className="text-xs"
                                >
                                  {news.importance}
                                </Badge>
                                <Badge variant="outline" className="text-xs">
                                  {news.category}
                                </Badge>
                              </div>
                              <div className="w-3/4 h-4 bg-muted rounded animate-pulse mb-2"></div>
                              <div className="space-y-1 mb-2">
                                <div className="w-full h-3 bg-muted/60 rounded animate-pulse"></div>
                                <div className="w-2/3 h-3 bg-muted/60 rounded animate-pulse"></div>
                              </div>
                              <div className="w-32 h-3 bg-muted/40 rounded animate-pulse"></div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>

              {/* Company Highlights */}
              <Card className="bg-card/95 backdrop-blur-sm" data-testid="company-highlights-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="w-5 h-5" />
                    Company Highlights
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-80">
                    <div className="space-y-4">
                      {placeholderCompanies.map((company) => (
                        <div key={company.id} className="p-4 border rounded-lg bg-card/50 backdrop-blur-sm" data-testid={`company-${company.symbol}`}>
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <div className="w-32 h-5 bg-muted rounded animate-pulse mb-1"></div>
                              <p className="text-sm text-muted-foreground">{company.industry}</p>
                            </div>
                            <Badge variant="outline">{company.symbol}</Badge>
                          </div>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <div className="text-muted-foreground">Revenue</div>
                              <div className="w-16 h-4 bg-muted rounded animate-pulse"></div>
                            </div>
                            <div>
                              <div className="text-muted-foreground">Profit</div>
                              <div className="w-16 h-4 bg-muted rounded animate-pulse"></div>
                            </div>
                            <div>
                              <div className="text-muted-foreground">Employees</div>
                              <div className="w-16 h-4 bg-muted rounded animate-pulse"></div>
                            </div>
                            <div>
                              <div className="text-muted-foreground">HQ</div>
                              <div className="w-16 h-4 bg-muted rounded animate-pulse"></div>
                            </div>
                          </div>
                          <div className="mt-2 space-y-1">
                            <div className="w-full h-3 bg-muted/60 rounded animate-pulse"></div>
                            <div className="w-3/4 h-3 bg-muted/60 rounded animate-pulse"></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}