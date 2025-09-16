import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { 
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ChevronDown, Sparkles, BarChart3, FileText, Target, Shield, Settings, Home, Menu, Upload } from "lucide-react";

export default function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [, setLocation] = useLocation();

  const handleNavigation = (href: string) => {
    setMobileMenuOpen(false);
    setLocation(href);
  };

  return (
    <>
      {/* Main Navigation Bar */}
      <nav className="fixed top-0 w-full z-50 bg-background dark:bg-slate-900 border-b border-border dark:border-slate-700">
        <div className="container mx-auto px-6 py-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity" data-testid="logo-link">
              <Sparkles className="w-7 h-7 text-primary dark:text-blue-400" data-testid="logo-icon" />
              <span className="text-xl font-bold text-foreground dark:text-white" data-testid="logo-text">
                Orion
              </span>
            </Link>

            {/* Desktop Navigation Tabs */}
            <div className="hidden lg:flex items-center gap-1">
              <Link href="/dashboard" className="px-4 py-2 text-foreground dark:text-white hover:bg-muted dark:hover:bg-slate-800 rounded transition-colors" data-testid="nav-dashboard">
                <div className="flex items-center gap-2">
                  <Home className="w-4 h-4" />
                  Dashboard
                </div>
              </Link>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    className="gap-1 text-foreground dark:text-white hover:bg-muted dark:hover:bg-slate-800 px-4 py-2" 
                    data-testid="dropdown-analytics"
                  >
                    <BarChart3 className="w-4 h-4" />
                    Analytics <ChevronDown className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-80 bg-background dark:bg-slate-800 border-border dark:border-slate-700">
                  <div className="grid grid-cols-2 gap-4 p-4">
                    <div>
                      <div className="text-xs font-semibold text-muted-foreground dark:text-slate-400 uppercase tracking-wide mb-2">Performance</div>
                      <div className="space-y-1">
                        <DropdownMenuItem className="text-foreground dark:text-white hover:bg-muted dark:hover:bg-slate-700" data-testid="menu-smart-reporting" onSelect={() => handleNavigation('/dashboard')}>
                          Smart Reporting
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-foreground dark:text-white hover:bg-muted dark:hover:bg-slate-700" data-testid="menu-performance-metrics" onSelect={() => handleNavigation('/dashboard')}>
                          Performance Metrics
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-foreground dark:text-white hover:bg-muted dark:hover:bg-slate-700" data-testid="menu-budget-analysis" onSelect={() => handleNavigation('/dashboard')}>
                          Budget Analysis
                        </DropdownMenuItem>
                      </div>
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-muted-foreground dark:text-slate-400 uppercase tracking-wide mb-2">Intelligence</div>
                      <div className="space-y-1">
                        <DropdownMenuItem className="text-foreground dark:text-white hover:bg-muted dark:hover:bg-slate-700" data-testid="menu-cost-intelligence" onSelect={() => handleNavigation('/dashboard')}>
                          Cost Intelligence
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-foreground dark:text-white hover:bg-muted dark:hover:bg-slate-700" data-testid="menu-ai-insights" onSelect={() => handleNavigation('/dashboard')}>
                          AI Insights
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-foreground dark:text-white hover:bg-muted dark:hover:bg-slate-700" data-testid="menu-trend-analysis" onSelect={() => handleNavigation('/dashboard')}>
                          Trend Analysis
                        </DropdownMenuItem>
                      </div>
                    </div>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    className="gap-1 text-foreground dark:text-white hover:bg-muted dark:hover:bg-slate-800 px-4 py-2" 
                    data-testid="dropdown-reports"
                  >
                    <FileText className="w-4 h-4" />
                    Reports <ChevronDown className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-80 bg-background dark:bg-slate-800 border-border dark:border-slate-700">
                  <div className="grid grid-cols-2 gap-4 p-4">
                    <div>
                      <div className="text-xs font-semibold text-muted-foreground dark:text-slate-400 uppercase tracking-wide mb-2">Financial</div>
                      <div className="space-y-1">
                        <DropdownMenuItem className="text-foreground dark:text-white hover:bg-muted dark:hover:bg-slate-700" data-testid="menu-financial-reports" onSelect={() => handleNavigation('/financial-reports')}>
                          Financial Reports
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-foreground dark:text-white hover:bg-muted dark:hover:bg-slate-700" data-testid="menu-budget-reports" onSelect={() => handleNavigation('/dashboard')}>
                          Budget Reports
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-foreground dark:text-white hover:bg-muted dark:hover:bg-slate-700" data-testid="menu-cost-reports" onSelect={() => handleNavigation('/dashboard')}>
                          Cost Reports
                        </DropdownMenuItem>
                      </div>
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-muted-foreground dark:text-slate-400 uppercase tracking-wide mb-2">Operational</div>
                      <div className="space-y-1">
                        <DropdownMenuItem className="text-foreground dark:text-white hover:bg-muted dark:hover:bg-slate-700" data-testid="menu-monthly-summary" onSelect={() => handleNavigation('/dashboard')}>
                          Monthly Summary
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-foreground dark:text-white hover:bg-muted dark:hover:bg-slate-700" data-testid="menu-department-reports" onSelect={() => handleNavigation('/dashboard')}>
                          Department Reports
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-foreground dark:text-white hover:bg-muted dark:hover:bg-slate-700" data-testid="menu-project-reports" onSelect={() => handleNavigation('/dashboard')}>
                          Project Reports
                        </DropdownMenuItem>
                      </div>
                    </div>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    className="gap-1 text-foreground dark:text-white hover:bg-muted dark:hover:bg-slate-800 px-4 py-2" 
                    data-testid="dropdown-planning"
                  >
                    <Target className="w-4 h-4" />
                    Planning <ChevronDown className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-80 bg-background dark:bg-slate-800 border-border dark:border-slate-700">
                  <div className="grid grid-cols-2 gap-4 p-4">
                    <div>
                      <div className="text-xs font-semibold text-muted-foreground dark:text-slate-400 uppercase tracking-wide mb-2">Budget & Forecast</div>
                      <div className="space-y-1">
                        <DropdownMenuItem className="text-foreground dark:text-white hover:bg-muted dark:hover:bg-slate-700" data-testid="menu-collaborative-planning" onSelect={() => handleNavigation('/dashboard')}>
                          Collaborative Planning
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-foreground dark:text-white hover:bg-muted dark:hover:bg-slate-700" data-testid="menu-scenario-modeling" onSelect={() => handleNavigation('/dashboard')}>
                          Scenario Modeling
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-foreground dark:text-white hover:bg-muted dark:hover:bg-slate-700" data-testid="menu-budget-planner" onSelect={() => handleNavigation('/dashboard')}>
                          Budget Planner
                        </DropdownMenuItem>
                      </div>
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-muted-foreground dark:text-slate-400 uppercase tracking-wide mb-2">Strategy</div>
                      <div className="space-y-1">
                        <DropdownMenuItem className="text-foreground dark:text-white hover:bg-muted dark:hover:bg-slate-700" data-testid="menu-forecast-models" onSelect={() => handleNavigation('/dashboard')}>
                          Forecast Models
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-foreground dark:text-white hover:bg-muted dark:hover:bg-slate-700" data-testid="menu-resource-planning" onSelect={() => handleNavigation('/dashboard')}>
                          Resource Planning
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-foreground dark:text-white hover:bg-muted dark:hover:bg-slate-700" data-testid="menu-strategic-analysis" onSelect={() => handleNavigation('/dashboard')}>
                          Strategic Analysis
                        </DropdownMenuItem>
                      </div>
                    </div>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    className="gap-1 text-foreground dark:text-white hover:bg-muted dark:hover:bg-slate-800 px-4 py-2" 
                    data-testid="dropdown-pl"
                  >
                    <Shield className="w-4 h-4" />
                    PL <ChevronDown className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-80 bg-background dark:bg-slate-800 border-border dark:border-slate-700">
                  <div className="grid grid-cols-2 gap-4 p-4">
                    <div>
                      <div className="text-xs font-semibold text-muted-foreground dark:text-slate-400 uppercase tracking-wide mb-2">Account Management</div>
                      <div className="space-y-1">
                        <DropdownMenuItem className="text-foreground dark:text-white hover:bg-muted dark:hover:bg-slate-700" data-testid="menu-pl-accounts" onSelect={() => handleNavigation('/pl-account')}>
                          PL Accounts
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-foreground dark:text-white hover:bg-muted dark:hover:bg-slate-700" data-testid="menu-account-categories" onSelect={() => handleNavigation('/pl-account')}>
                          Account Categories
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-foreground dark:text-white hover:bg-muted dark:hover:bg-slate-700" data-testid="menu-account-mapping" onSelect={() => handleNavigation('/pl-account')}>
                          Account Mapping
                        </DropdownMenuItem>
                      </div>
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-muted-foreground dark:text-slate-400 uppercase tracking-wide mb-2">Financial Setup</div>
                      <div className="space-y-1">
                        <DropdownMenuItem className="text-foreground dark:text-white hover:bg-muted dark:hover:bg-slate-700" data-testid="menu-chart-of-accounts" onSelect={() => handleNavigation('/pl-account')}>
                          Chart of Accounts
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-foreground dark:text-white hover:bg-muted dark:hover:bg-slate-700" data-testid="menu-account-structure" onSelect={() => handleNavigation('/pl-account')}>
                          Account Structure
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-foreground dark:text-white hover:bg-muted dark:hover:bg-slate-700" data-testid="menu-financial-templates" onSelect={() => handleNavigation('/pl-account')}>
                          Financial Templates
                        </DropdownMenuItem>
                      </div>
                    </div>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    className="gap-1 text-foreground dark:text-white hover:bg-muted dark:hover:bg-slate-800 px-4 py-2" 
                    data-testid="dropdown-tools"
                  >
                    <Settings className="w-4 h-4" />
                    Tools <ChevronDown className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-80 bg-background dark:bg-slate-800 border-border dark:border-slate-700">
                  <div className="grid grid-cols-2 gap-4 p-4">
                    <div>
                      <div className="text-xs font-semibold text-muted-foreground dark:text-slate-400 uppercase tracking-wide mb-2">Data Management</div>
                      <div className="space-y-1">
                        <DropdownMenuItem className="text-foreground dark:text-white hover:bg-muted dark:hover:bg-slate-700" data-testid="menu-upload" onSelect={() => handleNavigation('/upload')}>
                          Upload Data
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-foreground dark:text-white hover:bg-muted dark:hover:bg-slate-700" data-testid="menu-settings" onSelect={() => handleNavigation('/dashboard')}>
                          Settings
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-foreground dark:text-white hover:bg-muted dark:hover:bg-slate-700" data-testid="menu-integrations" onSelect={() => handleNavigation('/dashboard')}>
                          Integrations
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-foreground dark:text-white hover:bg-muted dark:hover:bg-slate-700" data-testid="menu-api-access" onSelect={() => handleNavigation('/dashboard')}>
                          API Access
                        </DropdownMenuItem>
                      </div>
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-muted-foreground dark:text-slate-400 uppercase tracking-wide mb-2">Support</div>
                      <div className="space-y-1">
                        <DropdownMenuItem className="text-foreground dark:text-white hover:bg-muted dark:hover:bg-slate-700" data-testid="menu-help-center" onSelect={() => handleNavigation('/dashboard')}>
                          Help Center
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-foreground dark:text-white hover:bg-muted dark:hover:bg-slate-700" data-testid="menu-documentation" onSelect={() => handleNavigation('/dashboard')}>
                          Documentation
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-foreground dark:text-white hover:bg-muted dark:hover:bg-slate-700" data-testid="menu-ai-assistant" onSelect={() => handleNavigation('/dashboard')}>
                          AI Assistant
                        </DropdownMenuItem>
                      </div>
                    </div>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Desktop User Actions */}
            <div className="hidden lg:flex items-center gap-3">
              <Button variant="ghost" className="text-foreground dark:text-white hover:bg-muted dark:hover:bg-slate-800" data-testid="button-sign-in">
                Sign In
              </Button>
              <Button className="bg-primary hover:bg-primary/90 dark:bg-blue-600 dark:hover:bg-blue-700 text-primary-foreground dark:text-white" data-testid="button-subscribe">
                Subscribe
              </Button>
            </div>

            {/* Mobile Menu */}
            <div className="lg:hidden">
              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="sm" data-testid="mobile-menu-trigger">
                    <Menu className="w-5 h-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-80 p-0 bg-background dark:bg-slate-900">
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-6">
                      <Sparkles className="w-6 h-6 text-primary dark:text-blue-400" />
                      <span className="text-lg font-bold text-foreground dark:text-white">
                        Orion
                      </span>
                    </div>
                    
                    <div className="space-y-4">
                      <Link href="/dashboard" className="flex items-center gap-2 p-3 rounded hover:bg-muted dark:hover:bg-slate-800" onClick={() => handleNavigation('/dashboard')} data-testid="mobile-nav-dashboard">
                        <Home className="w-5 h-5" />
                        Dashboard
                      </Link>
                      
                      <div className="space-y-2">
                        <div className="text-sm font-semibold text-muted-foreground dark:text-slate-400">Analytics</div>
                        <div className="block p-2 rounded hover:bg-muted dark:hover:bg-slate-800 ml-4 cursor-pointer" onClick={() => handleNavigation('/dashboard')}>Smart Reporting</div>
                        <div className="block p-2 rounded hover:bg-muted dark:hover:bg-slate-800 ml-4 cursor-pointer" onClick={() => handleNavigation('/dashboard')}>Performance Metrics</div>
                        <div className="block p-2 rounded hover:bg-muted dark:hover:bg-slate-800 ml-4 cursor-pointer" onClick={() => handleNavigation('/dashboard')}>Budget Analysis</div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="text-sm font-semibold text-muted-foreground dark:text-slate-400">Reports</div>
                        <div className="block p-2 rounded hover:bg-muted dark:hover:bg-slate-800 ml-4 cursor-pointer" onClick={() => handleNavigation('/dashboard')}>Financial Reports</div>
                        <div className="block p-2 rounded hover:bg-muted dark:hover:bg-slate-800 ml-4 cursor-pointer" onClick={() => handleNavigation('/dashboard')}>Monthly Summary</div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="text-sm font-semibold text-muted-foreground dark:text-slate-400">Planning</div>
                        <div className="block p-2 rounded hover:bg-muted dark:hover:bg-slate-800 ml-4 cursor-pointer" onClick={() => handleNavigation('/dashboard')}>Collaborative Planning</div>
                        <div className="block p-2 rounded hover:bg-muted dark:hover:bg-slate-800 ml-4 cursor-pointer" onClick={() => handleNavigation('/dashboard')}>Scenario Modeling</div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="text-sm font-semibold text-muted-foreground dark:text-slate-400">PL</div>
                        <div className="block p-2 rounded hover:bg-muted dark:hover:bg-slate-800 ml-4 cursor-pointer" onClick={() => handleNavigation('/pl-account')}>PL Accounts</div>
                        <div className="block p-2 rounded hover:bg-muted dark:hover:bg-slate-800 ml-4 cursor-pointer" onClick={() => handleNavigation('/pl-account')}>Account Categories</div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="text-sm font-semibold text-muted-foreground dark:text-slate-400">Tools</div>
                        <div className="block p-2 rounded hover:bg-muted dark:hover:bg-slate-800 ml-4 cursor-pointer" onClick={() => handleNavigation('/dashboard')}>Settings</div>
                        <div className="block p-2 rounded hover:bg-muted dark:hover:bg-slate-800 ml-4 cursor-pointer" onClick={() => handleNavigation('/dashboard')}>Help Center</div>
                      </div>
                    </div>
                    
                    <div className="mt-8 pt-6 border-t border-border dark:border-slate-700 space-y-2">
                      <Button variant="ghost" className="w-full justify-start" data-testid="mobile-button-sign-in">
                        Sign In
                      </Button>
                      <Button className="w-full bg-primary hover:bg-primary/90 dark:bg-blue-600 dark:hover:bg-blue-700" data-testid="mobile-button-subscribe">
                        Subscribe
                      </Button>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}