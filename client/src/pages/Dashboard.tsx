import { useState, useEffect, useMemo } from "react";
import Navigation from "@/components/Navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
  Calendar,
  Zap,
  Heart,
  Shield,
  Search,
  Filter,
  Grid,
  List
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart
} from "recharts";
import heroBackground from "@assets/generated_images/Gradient_mesh_hero_background_83768b02.png";

// Define types for better type safety
type Detail = {
  label: string;
  value: string;
  trend: string;
};

type Topic = {
  title: string;
  icon: React.ReactNode;
  summary: string;
  details: Detail[];
};

const topics: Record<string, Topic> = {
  performance: {
    title: "Performance Overview",
    icon: <TrendingUp className="w-5 h-5" />,
    summary: "Company performance remains strong across all key metrics. Revenue growth of 15% YoY with improved operational efficiency.",
    details: [
      { label: "Revenue Growth", value: "+15% YoY", trend: "up" },
      { label: "Profit Margin", value: "18.5%", trend: "up" },
      { label: "Customer Satisfaction", value: "4.6/5", trend: "up" },
      { label: "Employee Retention", value: "94%", trend: "stable" }
    ]
  },
  financial: {
    title: "Financial Health",
    icon: <DollarSign className="w-5 h-5" />,
    summary: "Strong financial position with healthy cash flow and controlled spending across all departments. Budget variance within acceptable range.",
    details: [
      { label: "Cash Flow", value: "+$2.1M", trend: "up" },
      { label: "Budget Variance", value: "-2.3%", trend: "good" },
      { label: "Operating Costs", value: "$8.2M", trend: "stable" },
      { label: "ROI", value: "22.4%", trend: "up" }
    ]
  },
  operations: {
    title: "Operational Excellence",
    icon: <Activity className="w-5 h-5" />,
    summary: "Operational efficiency improved through automation and process optimization. Project delivery rate exceeds targets.",
    details: [
      { label: "Project Success Rate", value: "89%", trend: "up" },
      { label: "Process Efficiency", value: "+12%", trend: "up" },
      { label: "System Uptime", value: "99.8%", trend: "excellent" },
      { label: "Response Time", value: "<2h", trend: "good" }
    ]
  },
  growth: {
    title: "Growth Trajectory",
    icon: <BarChart3 className="w-5 h-5" />,
    summary: "Sustained growth momentum with new customer acquisition and market expansion initiatives showing positive results.",
    details: [
      { label: "New Customers", value: "+284", trend: "up" },
      { label: "Market Share", value: "12.8%", trend: "up" },
      { label: "Product Adoption", value: "+28%", trend: "up" },
      { label: "Churn Rate", value: "5.8%", trend: "down" }
    ]
  }
};

type TopicFocusContentProps = {
  selectedTopic: string;
  setSelectedTopic: (topic: string) => void;
};

const TopicFocusContent = ({ selectedTopic, setSelectedTopic }: TopicFocusContentProps) => {
  const currentTopic = topics[selectedTopic];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent mb-2" data-testid="topic-focus-title">
          Strategic Hub
        </h1>
        <p className="text-sm text-muted-foreground">
          Key insights and performance metrics
        </p>
      </div>
      
      {/* Strategic Categories */}
      <div className="space-y-3 mb-6">
        <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
          Categories
        </h2>
        {Object.entries(topics).map(([key, topic]) => (
          <Button
            key={key}
            variant={selectedTopic === key ? "default" : "ghost"}
            className={`w-full justify-start h-12 transition-all duration-200 hover:scale-[1.02] ${
              selectedTopic === key 
                ? 'bg-gradient-to-r from-primary to-primary/80 shadow-lg hover:shadow-primary/25' 
                : 'hover:bg-muted/80'
            }`}
            onClick={() => setSelectedTopic(key)}
            data-testid={`topic-${key}`}
          >
            <div className={`p-1.5 rounded-md mr-3 ${
              selectedTopic === key 
                ? 'bg-white/20' 
                : 'bg-muted'
            }`}>
              {topic.icon}
            </div>
            <div className="flex-1 text-left">
              <div className="font-semibold text-sm">{topic.title}</div>
              <div className="text-xs opacity-75 truncate">
                {key === 'performance' && 'Revenue & Growth'}
                {key === 'financial' && 'Budget & Costs'}
                {key === 'operations' && 'Efficiency Metrics'}
                {key === 'growth' && 'Market Expansion'}
              </div>
            </div>
          </Button>
        ))}
      </div>

      <Separator className="my-6" />

      {/* Strategic Insights */}
      <div className="space-y-4">
        <div className="flex items-center gap-3 mb-4 p-3 bg-gradient-to-r from-muted/50 to-muted/30 rounded-lg border">
          <div className="p-2 bg-primary/10 rounded-lg">
            {currentTopic.icon}
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground" data-testid="current-topic-title">
              {currentTopic.title}
            </h2>
            <div className="text-xs text-muted-foreground font-medium">
              Live Analytics
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-card/80 to-muted/30 rounded-lg p-4 mb-4 border border-border/50">
          <p className="text-sm text-foreground/80 leading-relaxed" data-testid="topic-summary">
            {currentTopic.summary}
          </p>
        </div>

        <div className="space-y-3">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
            <BarChart3 className="w-3 h-3" />
            Key Performance Indicators
          </h3>
          {currentTopic.details.map((detail: Detail, index: number) => (
            <div key={index} className="group p-3 rounded-lg bg-gradient-to-r from-card/60 to-card/40 border border-border/30 hover:border-primary/30 hover:shadow-lg transition-all duration-200" data-testid={`indicator-${index}`}>
              <div className="flex justify-between items-center">
                <div className="text-sm font-medium text-foreground flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${
                    detail.trend === 'up' ? 'bg-green-500' :
                    detail.trend === 'down' ? 'bg-red-500' :
                    'bg-blue-500'
                  }`} />
                  {detail.label}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold">{detail.value}</span>
                  <div className={`p-1 rounded-md ${
                    detail.trend === 'up' ? 'bg-green-100 dark:bg-green-900/30' :
                    detail.trend === 'down' ? 'bg-red-100 dark:bg-red-900/30' :
                    'bg-blue-100 dark:bg-blue-900/30'
                  }`}>
                    {detail.trend === "up" && <TrendingUp className="w-3 h-3 text-green-600" />}
                    {detail.trend === "down" && <TrendingDown className="w-3 h-3 text-red-600" />}
                    {detail.trend === "stable" && <Activity className="w-3 h-3 text-blue-600" />}
                    {(detail.trend === "good" || detail.trend === "excellent") && <Target className="w-3 h-3 text-green-600" />}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Separator className="my-6" />

      {/* Executive Summary */}
      <div>
        <h3 className="text-xs font-semibold text-muted-foreground mb-4 uppercase tracking-wider flex items-center gap-2" data-testid="quick-metrics-title">
          <DollarSign className="w-3 h-3" />
          Executive Summary
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="relative group bg-gradient-to-br from-green-500/10 to-green-600/5 rounded-lg p-3 text-center border border-green-500/20 hover:border-green-500/40 transition-all duration-200 hover:shadow-lg hover:shadow-green-500/10">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
            <div className="relative z-10">
              <div className="text-lg font-bold text-green-600" data-testid="metric-revenue">$2.8M</div>
              <div className="text-xs text-muted-foreground font-medium">Monthly Revenue</div>
            </div>
          </div>
          <div className="relative group bg-gradient-to-br from-blue-500/10 to-blue-600/5 rounded-lg p-3 text-center border border-blue-500/20 hover:border-blue-500/40 transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/10">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
            <div className="relative z-10">
              <div className="text-lg font-bold text-blue-600" data-testid="metric-customers">284</div>
              <div className="text-xs text-muted-foreground font-medium">New Customers</div>
            </div>
          </div>
          <div className="relative group bg-gradient-to-br from-purple-500/10 to-purple-600/5 rounded-lg p-3 text-center border border-purple-500/20 hover:border-purple-500/40 transition-all duration-200 hover:shadow-lg hover:shadow-purple-500/10">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
            <div className="relative z-10">
              <div className="text-lg font-bold text-purple-600" data-testid="metric-success">89%</div>
              <div className="text-xs text-muted-foreground font-medium">Success Rate</div>
            </div>
          </div>
          <div className="relative group bg-gradient-to-br from-orange-500/10 to-orange-600/5 rounded-lg p-3 text-center border border-orange-500/20 hover:border-orange-500/40 transition-all duration-200 hover:shadow-lg hover:shadow-orange-500/10">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
            <div className="relative z-10">
              <div className="text-lg font-bold text-orange-600" data-testid="metric-satisfaction">4.6/5</div>
              <div className="text-xs text-muted-foreground font-medium">Satisfaction</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState("performance");
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [viewMode, setViewMode] = useState("grid");
  
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);
  
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
  
  // Filter data based on search and filter selections
  const filteredDepartments = useMemo(() => {
    if (selectedFilter === 'projects' || selectedFilter === 'updates') return [];
    
    return departmentData.filter(dept => {
      const matchesSearch = searchTerm === '' || 
        dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dept.summary.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesFilter = selectedFilter === 'all' || selectedFilter === 'departments' ||
        (selectedFilter === 'high-priority' && (dept.status === 'Over Budget' || dept.performance.includes('-')));
        
      return matchesSearch && matchesFilter;
    });
  }, [searchTerm, selectedFilter]);
  
  const filteredUpdates = useMemo(() => {
    if (selectedFilter === 'departments' || selectedFilter === 'projects') return [];
    
    return companyUpdates.filter(update => {
      const matchesSearch = searchTerm === '' || 
        update.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        update.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
        update.category.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesFilter = selectedFilter === 'all' || selectedFilter === 'updates' ||
        (selectedFilter === 'high-priority' && update.importance === 'high');
        
      return matchesSearch && matchesFilter;
    });
  }, [searchTerm, selectedFilter]);
  
  const filteredProjects = useMemo(() => {
    if (selectedFilter === 'departments' || selectedFilter === 'updates') return [];
    
    return activeProjects.filter(project => {
      const matchesSearch = searchTerm === '' || 
        project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.team.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.summary.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesFilter = selectedFilter === 'all' || selectedFilter === 'projects' ||
        (selectedFilter === 'high-priority' && project.risk === 'High');
        
      return matchesSearch && matchesFilter;
    });
  }, [searchTerm, selectedFilter]);


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
        <div className="hidden lg:block w-80 bg-card backdrop-blur-sm border-r border-border/20 flex-shrink-0 fixed left-0 top-20 bottom-0 z-40">
          <ScrollArea className="h-full">
            <TopicFocusContent selectedTopic={selectedTopic} setSelectedTopic={setSelectedTopic} />
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
                  <TopicFocusContent selectedTopic={selectedTopic} setSelectedTopic={setSelectedTopic} />
                </ScrollArea>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Main Content Area */}
        <div className={`flex-1 p-6 pt-20 lg:pt-6 lg:ml-80 transition-opacity duration-1000 ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
          <div className="max-w-6xl mx-auto space-y-6">
            {/* Loading Overlay */}
            {isLoading && (
              <div className="fixed inset-0 bg-background/50 backdrop-blur-sm flex items-center justify-center z-50">
                <div className="bg-card p-8 rounded-lg shadow-xl">
                  <div className="flex items-center space-x-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    <div className="text-lg font-semibold">Loading Dashboard...</div>
                  </div>
                </div>
              </div>
            )}
            {/* Search and Filter Controls */}
            <Card className="bg-card/95 backdrop-blur-sm shadow-lg transition-all duration-300 border-0 mb-6">
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                  <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                    <div className="relative w-full sm:w-64">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                      <Input
                        placeholder="Search projects, departments..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 w-full"
                        data-testid="search-input"
                      />
                    </div>
                    <Select value={selectedFilter} onValueChange={setSelectedFilter}>
                      <SelectTrigger className="w-full sm:w-48" data-testid="filter-select">
                        <Filter className="w-4 h-4 mr-2" />
                        <SelectValue placeholder="Filter by..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Items</SelectItem>
                        <SelectItem value="departments">Departments Only</SelectItem>
                        <SelectItem value="projects">Projects Only</SelectItem>
                        <SelectItem value="updates">Updates Only</SelectItem>
                        <SelectItem value="high-priority">High Priority</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant={viewMode === 'grid' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setViewMode('grid')}
                      data-testid="grid-view-btn"
                    >
                      <Grid className="w-4 h-4" />
                    </Button>
                    <Button
                      variant={viewMode === 'list' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setViewMode('list')}
                      data-testid="list-view-btn"
                    >
                      <List className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Key Performance Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6">
              <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/50 dark:to-blue-900/50 border-blue-200 dark:border-blue-800 hover:shadow-lg transition-all duration-300 cursor-pointer hover:scale-105">
                <CardContent className="p-3 md:p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs md:text-sm font-medium text-blue-700 dark:text-blue-300">Total Revenue</p>
                      <p className="text-xl md:text-2xl font-bold text-blue-900 dark:text-blue-100">$2.8M</p>
                      <p className="text-xs text-blue-600 dark:text-blue-400 flex items-center mt-1">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        <span className="hidden sm:inline">+15% from last month</span>
                        <span className="sm:hidden">+15%</span>
                      </p>
                    </div>
                    <div className="h-10 w-10 md:h-12 md:w-12 bg-blue-200 dark:bg-blue-800 rounded-full flex items-center justify-center">
                      <DollarSign className="h-5 w-5 md:h-6 md:w-6 text-blue-700 dark:text-blue-300" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/50 dark:to-green-900/50 border-green-200 dark:border-green-800 hover:shadow-lg transition-all duration-300 cursor-pointer hover:scale-105">
                <CardContent className="p-3 md:p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs md:text-sm font-medium text-green-700 dark:text-green-300">Active Projects</p>
                      <p className="text-xl md:text-2xl font-bold text-green-900 dark:text-green-100">24</p>
                      <p className="text-xs text-green-600 dark:text-green-400 flex items-center mt-1">
                        <Target className="w-3 h-3 mr-1" />
                        <span className="hidden sm:inline">89% success rate</span>
                        <span className="sm:hidden">89%</span>
                      </p>
                    </div>
                    <div className="h-10 w-10 md:h-12 md:w-12 bg-green-200 dark:bg-green-800 rounded-full flex items-center justify-center">
                      <BarChart3 className="h-5 w-5 md:h-6 md:w-6 text-green-700 dark:text-green-300" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/50 dark:to-purple-900/50 border-purple-200 dark:border-purple-800 hover:shadow-lg transition-all duration-300 cursor-pointer hover:scale-105">
                <CardContent className="p-3 md:p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs md:text-sm font-medium text-purple-700 dark:text-purple-300">Team Members</p>
                      <p className="text-xl md:text-2xl font-bold text-purple-900 dark:text-purple-100">156</p>
                      <p className="text-xs text-purple-600 dark:text-purple-400 flex items-center mt-1">
                        <Users className="w-3 h-3 mr-1" />
                        <span className="hidden sm:inline">94% satisfaction</span>
                        <span className="sm:hidden">94%</span>
                      </p>
                    </div>
                    <div className="h-10 w-10 md:h-12 md:w-12 bg-purple-200 dark:bg-purple-800 rounded-full flex items-center justify-center">
                      <Users className="h-5 w-5 md:h-6 md:w-6 text-purple-700 dark:text-purple-300" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950/50 dark:to-orange-900/50 border-orange-200 dark:border-orange-800 hover:shadow-lg transition-all duration-300 cursor-pointer hover:scale-105">
                <CardContent className="p-3 md:p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs md:text-sm font-medium text-orange-700 dark:text-orange-300">System Health</p>
                      <p className="text-xl md:text-2xl font-bold text-orange-900 dark:text-orange-100">99.8%</p>
                      <p className="text-xs text-orange-600 dark:text-orange-400 flex items-center mt-1">
                        <Shield className="w-3 h-3 mr-1" />
                        <span className="hidden sm:inline">All systems online</span>
                        <span className="sm:hidden">Online</span>
                      </p>
                    </div>
                    <div className="h-10 w-10 md:h-12 md:w-12 bg-orange-200 dark:bg-orange-800 rounded-full flex items-center justify-center">
                      <Activity className="h-5 w-5 md:h-6 md:w-6 text-orange-700 dark:text-orange-300" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Revenue Chart */}
            <Card className="bg-card/95 backdrop-blur-sm hover:bg-card shadow-lg hover:shadow-xl transition-all duration-300 border-0 mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Revenue Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={[
                        { month: 'Jan', revenue: 2200000, target: 2000000 },
                        { month: 'Feb', revenue: 2350000, target: 2100000 },
                        { month: 'Mar', revenue: 2100000, target: 2200000 },
                        { month: 'Apr', revenue: 2600000, target: 2300000 },
                        { month: 'May', revenue: 2750000, target: 2400000 },
                        { month: 'Jun', revenue: 2800000, target: 2500000 }
                      ]}
                      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                      <XAxis dataKey="month" className="text-xs" />
                      <YAxis tickFormatter={(value) => `$${(value/1000000).toFixed(1)}M`} className="text-xs" />
                      <Tooltip formatter={(value: any) => [`$${(value/1000000).toFixed(2)}M`, 'Amount']} />
                      <Area type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.3} />
                      <Area type="monotone" dataKey="target" stroke="hsl(var(--muted-foreground))" fill="transparent" strokeDasharray="5 5" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            {/* Department Overview */}
            <Card className="bg-card/95 backdrop-blur-sm hover:bg-card shadow-lg hover:shadow-xl transition-all duration-300 border-0" data-testid="department-overview-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="w-5 h-5" />
                  Department Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' : 'space-y-4'}>
                  {filteredDepartments.length === 0 ? (
                    <div className="col-span-full text-center py-8 text-muted-foreground">
                      <Building2 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>No departments found matching your criteria</p>
                    </div>
                  ) : (
                    filteredDepartments.map((dept, index) => (
                    <div 
                      key={dept.id} 
                      className="p-4 border rounded-lg hover:bg-muted/50 hover:shadow-lg hover:scale-[1.02] transition-all duration-300 ease-in-out bg-card/50 backdrop-blur-sm group cursor-pointer transform" 
                      data-testid={`dept-${dept.name.toLowerCase()}`}
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div className="group-hover:translate-x-1 transition-transform duration-300">
                          <div className="font-semibold text-foreground group-hover:text-primary transition-colors duration-300">{dept.name}</div>
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
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Department Budget Distribution Chart */}
            <Card className="bg-card/95 backdrop-blur-sm hover:bg-card shadow-lg hover:shadow-xl transition-all duration-300 border-0 mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="w-5 h-5" />
                  Budget Distribution by Department
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={[
                          { name: 'Engineering', value: 2800000, color: '#3b82f6' },
                          { name: 'Marketing', value: 1200000, color: '#10b981' },
                          { name: 'Sales', value: 1800000, color: '#8b5cf6' },
                          { name: 'Operations', value: 950000, color: '#f59e0b' },
                          { name: 'HR', value: 650000, color: '#ef4444' }
                        ]}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="value"
                      >
                        {[
                          { name: 'Engineering', value: 2800000, color: '#3b82f6' },
                          { name: 'Marketing', value: 1200000, color: '#10b981' },
                          { name: 'Sales', value: 1800000, color: '#8b5cf6' },
                          { name: 'Operations', value: 950000, color: '#f59e0b' },
                          { name: 'HR', value: 650000, color: '#ef4444' }
                        ].map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: any) => [`$${(value/1000000).toFixed(2)}M`, 'Budget']} />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex flex-wrap gap-2 mt-4">
                  {[
                    { name: 'Engineering', color: '#3b82f6' },
                    { name: 'Marketing', color: '#10b981' },
                    { name: 'Sales', color: '#8b5cf6' },
                    { name: 'Operations', color: '#f59e0b' },
                    { name: 'HR', color: '#ef4444' }
                  ].map((item) => (
                    <div key={item.name} className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-sm text-muted-foreground">{item.name}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Company Updates */}
              <Card className="bg-card/95 backdrop-blur-sm hover:bg-card shadow-lg hover:shadow-xl transition-all duration-300 border-0" data-testid="company-updates-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    Latest Company Updates
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-80">
                    <div className="space-y-4">
                      {filteredUpdates.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                          <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
                          <p>No updates found matching your criteria</p>
                        </div>
                      ) : (
                        filteredUpdates.map((update) => (
                        <div key={update.id} className="pb-4 border-b last:border-b-0 hover:bg-muted/30 rounded-lg p-2 -m-2 transition-all duration-200 cursor-pointer" data-testid={`update-${update.id}`}>
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
                        ))
                      )}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>

              {/* Active Projects */}
              <Card className="bg-card/95 backdrop-blur-sm hover:bg-card shadow-lg hover:shadow-xl transition-all duration-300 border-0" data-testid="active-projects-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    Active Projects
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-80">
                    <div className="space-y-4">
                      {filteredProjects.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                          <Target className="w-12 h-12 mx-auto mb-4 opacity-50" />
                          <p>No projects found matching your criteria</p>
                        </div>
                      ) : (
                        filteredProjects.map((project) => (
                        <div key={project.id} className="p-4 border rounded-lg bg-card/50 backdrop-blur-sm hover:bg-card/80 hover:shadow-md hover:scale-[1.01] transition-all duration-200 cursor-pointer" data-testid={`project-${project.id}`}>
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
                        ))
                      )}
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