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

  // Mock internal business data for company overview
  const departmentData = [
    { 
      id: "1", 
      name: "Sales", 
      budget: "$2.5M", 
      spent: "$2.1M", 
      status: "On Track",
      performance: "+15%",
      summary: "Sales team exceeding Q4 targets with strong enterprise deals pipeline. Budget on track with 84% utilization.",
      trend: "up"
    },
    { 
      id: "2", 
      name: "Marketing", 
      budget: "$1.8M", 
      spent: "$2.0M", 
      status: "Over Budget",
      performance: "+8%",
      summary: "Marketing spend increased for holiday campaign launch. ROI positive at 3.2x, justifying budget overrun.",
      trend: "up"
    },
    { 
      id: "3", 
      name: "Engineering", 
      budget: "$4.2M", 
      spent: "$3.8M", 
      status: "Under Budget",
      performance: "+22%",
      summary: "Engineering delivery accelerated due to process improvements. Budget savings from remote hiring strategy.",
      trend: "up"
    },
    { 
      id: "4", 
      name: "Operations", 
      budget: "$1.1M", 
      spent: "$1.0M", 
      status: "On Track",
      performance: "+5%",
      summary: "Operations running efficiently with recent automation. Cost savings reinvested in infrastructure upgrades.",
      trend: "stable"
    },
    { 
      id: "5", 
      name: "Customer Success", 
      budget: "$850K", 
      spent: "$825K", 
      status: "On Track",
      performance: "+12%",
      summary: "Customer satisfaction scores improved to 4.8/5. Reduced churn by 18% through proactive engagement.",
      trend: "up"
    },
    { 
      id: "6", 
      name: "HR", 
      budget: "$650K", 
      spent: "$580K", 
      status: "Under Budget",
      performance: "+3%",
      summary: "Hiring goals met efficiently. Savings from reduced recruitment agency fees and improved retention.",
      trend: "stable"
    }
  ];

  const companyUpdates = [
    { 
      id: "1", 
      category: "Sales", 
      importance: "high", 
      type: "Monthly Report",
      title: "Q4 Sales Performance Exceeds Forecast",
      summary: "Sales team closed $2.8M in November, 15% above target. Major enterprise deals with TechCorp and FinanceInc finalized. December pipeline looking strong with $3.2M potential.",
      impact: "Revenue",
      date: "2 hours ago"
    },
    { 
      id: "2", 
      category: "Product", 
      importance: "medium", 
      type: "Feature Release",
      title: "Mobile App Update Drives User Engagement",
      summary: "New mobile features launched last week showing 28% increase in daily active users. Customer feedback overwhelmingly positive with 4.7/5 app store rating.",
      impact: "Growth",
      date: "5 hours ago"
    },
    { 
      id: "3", 
      category: "Operations", 
      importance: "high", 
      type: "System Update",
      title: "Infrastructure Upgrade Improves Performance",
      summary: "Server migration completed successfully. System uptime improved to 99.8% and page load times reduced by 40%. Customer complaints down 60%.",
      impact: "Efficiency",
      date: "1 day ago"
    },
    { 
      id: "4", 
      category: "HR", 
      importance: "medium", 
      type: "Team Announcement",
      title: "New Engineering Manager Joins Team",
      summary: "Sarah Chen joins as Senior Engineering Manager from Google. Will lead our AI initiatives and scale engineering practices. Team excited about new technical direction.",
      impact: "Growth",
      date: "2 days ago"
    },
    { 
      id: "5", 
      category: "Finance", 
      importance: "low", 
      type: "Budget Review",
      title: "Q4 Budget Review Shows Positive Variance",
      summary: "Overall company spending at 92% of budget with strong revenue performance. Recommend reinvesting savings into Q1 marketing campaign and engineering tools.",
      impact: "Strategy",
      date: "3 days ago"
    }
  ];

  const activeProjects = [
    { 
      id: "1", 
      name: "Q4 Product Launch", 
      status: "In Progress", 
      team: "Product Team",
      progress: "75%",
      timeline: "2 weeks remaining",
      budget: "$450K",
      summary: "Major product release on schedule. Beta testing with 200 customers showing excellent feedback. Launch event planned for Dec 15th with marketing campaign ready.",
      risk: "Low"
    },
    { 
      id: "2", 
      name: "Customer Portal Redesign", 
      status: "Planning", 
      team: "Engineering",
      progress: "25%",
      timeline: "6 weeks",
      budget: "$280K",
      summary: "UI/UX research complete. New design will reduce customer support tickets by estimated 30%. Development starts next week with 3 engineers assigned.",
      risk: "Medium"
    },
    { 
      id: "3", 
      name: "Sales Process Optimization", 
      status: "Complete", 
      team: "Sales Ops",
      progress: "100%",
      timeline: "Completed",
      budget: "$120K",
      summary: "CRM automation implemented successfully. Sales cycle reduced from 45 to 32 days average. Team productivity increased 18% with better lead qualification.",
      risk: "None"
    }
  ];

  const keyMetrics = [
    { 
      id: "1", 
      name: "Monthly Revenue", 
      period: "November 2024",
      value: "$2.8M",
      change: "+15%",
      target: "$2.4M",
      summary: "Strong enterprise sales and product adoption driving revenue growth above targets."
    },
    { 
      id: "2", 
      name: "Customer Acquisition", 
      period: "This Month",
      value: "284 new customers",
      change: "+22%",
      target: "250",
      summary: "Marketing campaigns and product improvements attracting higher quality leads."
    },
    { 
      id: "3", 
      name: "Employee Satisfaction", 
      period: "Q4 2024",
      value: "4.6/5",
      change: "+8%",
      target: "4.3/5",
      summary: "New benefits package and flexible work policy boosting team morale significantly."
    },
    { 
      id: "4", 
      name: "Project Completion Rate", 
      period: "Current Quarter",
      value: "89%",
      change: "+12%",
      target: "85%",
      summary: "Improved project management processes and clear priorities accelerating delivery."
    },
    { 
      id: "5", 
      name: "Customer Retention", 
      period: "Last 30 Days",
      value: "94.2%",
      change: "+3%",
      target: "92%",
      summary: "Customer success initiatives and product stability improvements reducing churn."
    }
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
          {keyMetrics.map((metric) => (
            <div key={metric.id} className="flex justify-between items-center" data-testid={`metric-${metric.name.toLowerCase().replace(/\s+/g, '-')}`}>
              <div className="text-sm">
                <div className="font-medium">{metric.name}</div>
                <div className="text-muted-foreground text-xs">{metric.period}</div>
              </div>
              <div className="text-right">
                <div className="font-semibold text-sm">{metric.value}</div>
                <div className={`text-xs ${metric.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                  {metric.change}
                </div>
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
                  {departmentData.map((dept) => (
                    <div key={dept.id} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors bg-card/50 backdrop-blur-sm" data-testid={`dept-${dept.name.toLowerCase()}`}>
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <div className="font-semibold">{dept.name}</div>
                          <div className="text-sm text-muted-foreground">{dept.spent} / {dept.budget}</div>
                        </div>
                        <div className="text-right">
                          <Badge 
                            variant={dept.status === "On Track" ? "default" : dept.status === "Over Budget" ? "destructive" : "secondary"} 
                            className="text-xs mb-1"
                          >
                            {dept.status}
                          </Badge>
                          <div className={`text-sm font-semibold ${dept.performance.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                            {dept.performance}
                          </div>
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground leading-relaxed">
                        {dept.summary}
                      </div>
                      <div className="mt-2 flex items-center gap-1">
                        {dept.trend === 'up' ? (
                          <TrendingUp className="w-3 h-3 text-green-600" />
                        ) : dept.trend === 'down' ? (
                          <TrendingDown className="w-3 h-3 text-red-600" />
                        ) : (
                          <Activity className="w-3 h-3 text-blue-600" />
                        )}
                        <span className="text-xs text-muted-foreground">
                          {dept.trend === 'up' ? 'Trending Up' : dept.trend === 'down' ? 'Trending Down' : 'Stable'}
                        </span>
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
                      {companyUpdates.map((update) => (
                        <div key={update.id} className="pb-4 border-b last:border-b-0" data-testid={`update-${update.id}`}>
                          <div className="flex items-start gap-3">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
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
                                  {update.impact}
                                </Badge>
                                <span className="text-xs text-muted-foreground">{update.date}</span>
                              </div>
                              <h4 className="font-semibold text-sm mb-2">{update.title}</h4>
                              <p className="text-xs text-muted-foreground leading-relaxed">
                                {update.summary}
                              </p>
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
                      {activeProjects.map((project) => (
                        <div key={project.id} className="p-4 border rounded-lg bg-card/50 backdrop-blur-sm" data-testid={`project-${project.id}`}>
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h4 className="font-semibold">{project.name}</h4>
                              <p className="text-sm text-muted-foreground">{project.team}</p>
                            </div>
                            <div className="text-right">
                              <Badge 
                                variant={project.status === "Complete" ? "default" : project.status === "In Progress" ? "secondary" : "outline"} 
                                className="text-xs mb-1"
                              >
                                {project.status}
                              </Badge>
                              <div className="text-xs text-muted-foreground">Risk: {project.risk}</div>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                            <div>
                              <div className="text-muted-foreground">Progress</div>
                              <div className="font-semibold">{project.progress}</div>
                            </div>
                            <div>
                              <div className="text-muted-foreground">Timeline</div>
                              <div className="font-semibold">{project.timeline}</div>
                            </div>
                            <div>
                              <div className="text-muted-foreground">Budget</div>
                              <div className="font-semibold">{project.budget}</div>
                            </div>
                            <div>
                              <div className="text-muted-foreground">Status</div>
                              <div className="font-semibold">{project.status}</div>
                            </div>
                          </div>
                          <div className="text-xs text-muted-foreground leading-relaxed">
                            {project.summary}
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