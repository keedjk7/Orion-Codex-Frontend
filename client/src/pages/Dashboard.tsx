import { useState } from "react";
import Navigation from "@/components/Navigation";
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
  Menu,
  Target,
  PieChart,
  FileText,
  Calendar
} from "lucide-react";
import heroBackground from "@assets/generated_images/Gradient_mesh_hero_background_83768b02.png";

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Design placeholders for internal business data
  const placeholderDepartments = [
    { id: "1", name: "Sales", budget: "$2.5M", status: "On Track" },
    { id: "2", name: "Marketing", budget: "$1.8M", status: "Over Budget" },
    { id: "3", name: "Engineering", budget: "$4.2M", status: "Under Budget" },
    { id: "4", name: "Operations", budget: "$1.1M", status: "On Track" },
    { id: "5", name: "Customer Success", budget: "$850K", status: "On Track" },
    { id: "6", name: "HR", budget: "$650K", status: "Under Budget" }
  ];

  const placeholderUpdates = [
    { id: "1", category: "Sales", importance: "high", type: "Monthly Report" },
    { id: "2", category: "Product", importance: "medium", type: "Feature Release" },
    { id: "3", category: "Operations", importance: "high", type: "System Update" },
    { id: "4", category: "HR", importance: "medium", type: "Team Announcement" },
    { id: "5", category: "Finance", importance: "low", type: "Budget Review" }
  ];

  const placeholderProjects = [
    { id: "1", name: "Q4 Product Launch", status: "In Progress", team: "Product Team" },
    { id: "2", name: "Customer Portal Redesign", status: "Planning", team: "Engineering" },
    { id: "3", name: "Sales Process Optimization", status: "Complete", team: "Sales Ops" }
  ];

  const placeholderMetrics = [
    { id: "1", name: "Monthly Revenue", period: "November 2024" },
    { id: "2", name: "Customer Acquisition", period: "This Month" },
    { id: "3", name: "Employee Satisfaction", period: "Q4 2024" },
    { id: "4", name: "Project Completion Rate", period: "Current Quarter" },
    { id: "5", name: "Customer Retention", period: "Last 30 Days" }
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
        Company Dashboard
      </h1>
      
      {/* Navigation Sections */}
      <div className="space-y-6">
        <div>
          <h3 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wide" data-testid="nav-departments">
            Departments
          </h3>
          <div className="space-y-2">
            <Button variant="ghost" className="w-full justify-start" data-testid="nav-sales">
              <Target className="w-4 h-4 mr-2" />
              Sales
            </Button>
            <Button variant="ghost" className="w-full justify-start" data-testid="nav-marketing">
              <TrendingUp className="w-4 h-4 mr-2" />
              Marketing
            </Button>
            <Button variant="ghost" className="w-full justify-start" data-testid="nav-engineering">
              <Building2 className="w-4 h-4 mr-2" />
              Engineering
            </Button>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wide" data-testid="nav-analytics">
            Analytics
          </h3>
          <div className="space-y-2">
            <Button variant="ghost" className="w-full justify-start" data-testid="nav-performance">
              <BarChart3 className="w-4 h-4 mr-2" />
              Performance
            </Button>
            <Button variant="ghost" className="w-full justify-start" data-testid="nav-budget-analysis">
              <PieChart className="w-4 h-4 mr-2" />
              Budget Analysis
            </Button>
            <Button variant="ghost" className="w-full justify-start" data-testid="nav-project-tracking">
              <Activity className="w-4 h-4 mr-2" />
              Project Tracking
            </Button>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wide" data-testid="nav-reports">
            Reports
          </h3>
          <div className="space-y-2">
            <Button variant="ghost" className="w-full justify-start" data-testid="nav-financial-reports">
              <FileText className="w-4 h-4 mr-2" />
              Financial Reports
            </Button>
            <Button variant="ghost" className="w-full justify-start" data-testid="nav-monthly-summary">
              <Calendar className="w-4 h-4 mr-2" />
              Monthly Summary
            </Button>
            <Button variant="ghost" className="w-full justify-start" data-testid="nav-team-reports">
              <Users className="w-4 h-4 mr-2" />
              Team Reports
            </Button>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wide" data-testid="nav-tools">
            Tools
          </h3>
          <div className="space-y-2">
            <Button variant="ghost" className="w-full justify-start" data-testid="nav-budget-planner">
              <DollarSign className="w-4 h-4 mr-2" />
              Budget Planner
            </Button>
            <Button variant="ghost" className="w-full justify-start" data-testid="nav-team-management">
              <Users className="w-4 h-4 mr-2" />
              Team Management
            </Button>
          </div>
        </div>
      </div>

      <Separator className="my-6" />

      {/* Key Metrics */}
      <div>
        <h3 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wide" data-testid="key-metrics-title">
          Key Metrics
        </h3>
        <div className="space-y-3">
          {placeholderMetrics.map((metric) => (
            <div key={metric.id} className="flex justify-between items-center" data-testid={`metric-${metric.name.toLowerCase().replace(/\s+/g, '-')}`}>
              <div className="text-sm">
                <div className="font-medium">{metric.name}</div>
                <div className="text-muted-foreground text-xs">{metric.period}</div>
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
      {/* Navigation Bar like landing page */}
      <Navigation />
      
      {/* Beautiful Background like landing page */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroBackground})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background/60 to-background/80" />
      
      <div className="relative z-10 flex pt-20">
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
              Company Dashboard
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
            {/* Department Overview */}
            <Card className="bg-card/95 backdrop-blur-sm" data-testid="department-overview-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="w-5 h-5" />
                  Department Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {placeholderDepartments.map((dept) => (
                    <div key={dept.id} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors bg-card/50 backdrop-blur-sm" data-testid={`dept-${dept.name.toLowerCase()}`}>
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <div className="font-semibold">{dept.name}</div>
                          <div className="text-sm text-muted-foreground">{dept.budget}</div>
                        </div>
                        <Badge 
                          variant={dept.status === "On Track" ? "default" : dept.status === "Over Budget" ? "destructive" : "secondary"} 
                          className="text-xs"
                        >
                          {dept.status}
                        </Badge>
                      </div>
                      <div className="space-y-1">
                        <div className="w-16 h-6 bg-muted rounded animate-pulse"></div>
                        <div className="flex items-center gap-1">
                          <div className="w-12 h-4 bg-blue-200 rounded animate-pulse"></div>
                          <TrendingUp className="w-3 h-3 text-blue-600" />
                        </div>
                        <div className="w-20 h-3 bg-muted/60 rounded animate-pulse"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Company Updates */}
              <Card className="bg-card/95 backdrop-blur-sm" data-testid="company-updates-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    Latest Company Updates
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-80">
                    <div className="space-y-4">
                      {placeholderUpdates.map((update) => (
                        <div key={update.id} className="pb-4 border-b last:border-b-0" data-testid={`update-${update.id}`}>
                          <div className="flex items-start gap-3">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <Badge 
                                  variant={update.importance === 'high' ? 'destructive' : update.importance === 'medium' ? 'default' : 'secondary'}
                                  className="text-xs"
                                >
                                  {update.importance}
                                </Badge>
                                <Badge variant="outline" className="text-xs">
                                  {update.category}
                                </Badge>
                                <Badge variant="secondary" className="text-xs">
                                  {update.type}
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

              {/* Active Projects */}
              <Card className="bg-card/95 backdrop-blur-sm" data-testid="active-projects-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    Active Projects
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-80">
                    <div className="space-y-4">
                      {placeholderProjects.map((project) => (
                        <div key={project.id} className="p-4 border rounded-lg bg-card/50 backdrop-blur-sm" data-testid={`project-${project.id}`}>
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h4 className="font-semibold">{project.name}</h4>
                              <p className="text-sm text-muted-foreground">{project.team}</p>
                            </div>
                            <Badge 
                              variant={project.status === "Complete" ? "default" : project.status === "In Progress" ? "secondary" : "outline"} 
                              className="text-xs"
                            >
                              {project.status}
                            </Badge>
                          </div>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <div className="text-muted-foreground">Progress</div>
                              <div className="w-16 h-4 bg-muted rounded animate-pulse"></div>
                            </div>
                            <div>
                              <div className="text-muted-foreground">Timeline</div>
                              <div className="w-16 h-4 bg-muted rounded animate-pulse"></div>
                            </div>
                            <div>
                              <div className="text-muted-foreground">Budget</div>
                              <div className="w-16 h-4 bg-muted rounded animate-pulse"></div>
                            </div>
                            <div>
                              <div className="text-muted-foreground">Resources</div>
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