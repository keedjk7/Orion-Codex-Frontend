import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
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
import type { MarketData, BusinessNews, CompanyMetrics, EconomicIndicators } from "@shared/schema";

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { data: marketData = [], isLoading: marketLoading } = useQuery<MarketData[]>({
    queryKey: ['/api/market-data'],
    select: (data) => data.map(market => ({
      ...market,
      updatedAt: new Date(market.updatedAt)
    }))
  });

  const { data: businessNews = [], isLoading: newsLoading } = useQuery<BusinessNews[]>({
    queryKey: ['/api/business-news'],
    select: (data) => data.map(news => ({
      ...news,
      publishedAt: new Date(news.publishedAt)
    }))
  });

  const { data: companyMetrics = [], isLoading: companiesLoading } = useQuery<CompanyMetrics[]>({
    queryKey: ['/api/company-metrics']
  });

  const { data: economicIndicators = [], isLoading: indicatorsLoading } = useQuery<EconomicIndicators[]>({
    queryKey: ['/api/economic-indicators'],
    select: (data) => data.map(indicator => ({
      ...indicator,
      updatedAt: new Date(indicator.updatedAt)
    }))
  });

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
        {indicatorsLoading ? (
          <div className="space-y-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-10 bg-muted rounded animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {economicIndicators.slice(0, 5).map((indicator) => (
              <div key={indicator.id} className="flex justify-between items-center" data-testid={`indicator-${indicator.name.toLowerCase().replace(/\s+/g, '-')}`}>
                <div className="text-sm">
                  <div className="font-medium">{indicator.name}</div>
                  <div className="text-muted-foreground text-xs">{indicator.period}</div>
                </div>
                <div className="text-right">
                  <div className="font-semibold">{indicator.value}{indicator.unit}</div>
                  <div className={`text-xs ${parseFloat(indicator.change) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {parseFloat(indicator.change) >= 0 ? '+' : ''}{indicator.change}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block w-80 bg-card border-r border-border flex-shrink-0">
          <ScrollArea className="h-screen">
            <SidebarContent />
          </ScrollArea>
        </div>

        {/* Mobile Header */}
        <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-card border-b border-border">
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
              <SheetContent side="left" className="w-80 p-0">
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
            <Card data-testid="market-overview-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Market Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                {marketLoading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[...Array(6)].map((_, i) => (
                      <div key={i} className="h-20 bg-muted rounded animate-pulse" />
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {marketData.map((stock) => (
                      <div key={stock.id} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors" data-testid={`stock-${stock.symbol}`}>
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
                          <div className="text-xl font-bold">${stock.price}</div>
                          <div className="text-sm">
                            {formatChange(stock.change, stock.changePercent)}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Vol: {stock.volume.toLocaleString()}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Business News */}
              <Card data-testid="business-news-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    Latest Business News
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-80">
                    {newsLoading ? (
                      <div className="space-y-4">
                        {[...Array(5)].map((_, i) => (
                          <div key={i} className="h-16 bg-muted rounded animate-pulse" />
                        ))}
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {businessNews.map((news) => (
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
                                <h4 className="font-semibold text-sm mb-1 leading-tight">
                                  {news.headline}
                                </h4>
                                <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                                  {news.summary}
                                </p>
                                <div className="text-xs text-muted-foreground">
                                  {news.source} • {news.publishedAt.toLocaleDateString()}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </ScrollArea>
                </CardContent>
              </Card>

              {/* Company Highlights */}
              <Card data-testid="company-highlights-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="w-5 h-5" />
                    Company Highlights
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-80">
                    {companiesLoading ? (
                      <div className="space-y-4">
                        {[...Array(3)].map((_, i) => (
                          <div key={i} className="h-20 bg-muted rounded animate-pulse" />
                        ))}
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {companyMetrics.map((company) => (
                          <div key={company.id} className="p-4 border rounded-lg" data-testid={`company-${company.symbol}`}>
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <h4 className="font-semibold">{company.companyName}</h4>
                                <p className="text-sm text-muted-foreground">{company.industry}</p>
                              </div>
                              <Badge variant="outline">{company.symbol}</Badge>
                            </div>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <div className="text-muted-foreground">Revenue</div>
                                <div className="font-semibold">{formatCurrency(company.revenue)}</div>
                              </div>
                              <div>
                                <div className="text-muted-foreground">Profit</div>
                                <div className="font-semibold">{formatCurrency(company.profit)}</div>
                              </div>
                              <div>
                                <div className="text-muted-foreground">Employees</div>
                                <div className="font-semibold">{company.employees.toLocaleString()}</div>
                              </div>
                              <div>
                                <div className="text-muted-foreground">HQ</div>
                                <div className="font-semibold">{company.headquarters}</div>
                              </div>
                            </div>
                            <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
                              {company.description}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
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