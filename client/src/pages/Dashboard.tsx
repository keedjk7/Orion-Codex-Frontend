import React, { useState } from 'react';
import { useKeycloak } from '@/contexts/KeycloakContext';
import { cn } from '@/lib/utils';
import DashboardSidebar from '@/components/DashboardSidebar';
import DashboardHeader from '@/components/DashboardHeader';
import DashboardOverview from '@/components/DashboardOverview';

// Placeholder components for other tabs
const FinancialAnalysis = () => (
  <div className="p-6">
    <h2 className="text-2xl font-bold mb-4">Financial Analysis</h2>
    <p className="text-gray-600">Financial analysis tools and reports will be displayed here.</p>
  </div>
);

const BudgetPlanning = () => (
  <div className="p-6">
    <h2 className="text-2xl font-bold mb-4">Budget Planning</h2>
    <p className="text-gray-600">Budget planning and allocation tools will be displayed here.</p>
  </div>
);

const Forecasting = () => (
  <div className="p-6">
    <h2 className="text-2xl font-bold mb-4">Forecasting</h2>
    <p className="text-gray-600">Forecasting models and predictions will be displayed here.</p>
  </div>
);

const Reporting = () => (
  <div className="p-6">
    <h2 className="text-2xl font-bold mb-4">Reports</h2>
    <p className="text-gray-600">Financial reports and analytics will be displayed here.</p>
  </div>
);

const Analytics = () => (
  <div className="p-6">
    <h2 className="text-2xl font-bold mb-4">Analytics</h2>
    <p className="text-gray-600">Advanced analytics and data visualization will be displayed here.</p>
  </div>
);

const TM1Models = () => (
  <div className="p-6">
    <h2 className="text-2xl font-bold mb-4">TM1 Models</h2>
    <p className="text-gray-600">TM1 model management and configuration will be displayed here.</p>
  </div>
);

const Calculations = () => (
  <div className="p-6">
    <h2 className="text-2xl font-bold mb-4">Calculations</h2>
    <p className="text-gray-600">Calculation engines and formulas will be displayed here.</p>
  </div>
);

const PlanningCalendar = () => (
  <div className="p-6">
    <h2 className="text-2xl font-bold mb-4">Planning Calendar</h2>
    <p className="text-gray-600">Planning calendar and scheduling will be displayed here.</p>
  </div>
);

const UserManagement = () => (
  <div className="p-6">
    <h2 className="text-2xl font-bold mb-4">User Management</h2>
    <p className="text-gray-600">User management and permissions will be displayed here.</p>
  </div>
);

const Settings = () => (
  <div className="p-6">
    <h2 className="text-2xl font-bold mb-4">Settings</h2>
    <p className="text-gray-600">System settings and configuration will be displayed here.</p>
  </div>
);

// New Finance-focused Components
const CashFlow = () => (
  <div className="p-6">
    <h2 className="text-2xl font-bold mb-4">Cash Flow Management</h2>
    <p className="text-gray-600">Cash flow analysis, liquidity management, and working capital optimization tools will be displayed here.</p>
  </div>
);

const RiskManagement = () => (
  <div className="p-6">
    <h2 className="text-2xl font-bold mb-4">Financial Risk Management</h2>
    <p className="text-gray-600">Risk assessment, mitigation strategies, and financial risk modeling tools will be displayed here.</p>
  </div>
);

const StrategicPlanning = () => (
  <div className="p-6">
    <h2 className="text-2xl font-bold mb-4">Strategic Financial Planning</h2>
    <p className="text-gray-600">Long-term financial planning, scenario modeling, and strategic investment analysis will be displayed here.</p>
  </div>
);

const ComplianceAudit = () => (
  <div className="p-6">
    <h2 className="text-2xl font-bold mb-4">Compliance & Audit Management</h2>
    <p className="text-gray-600">Compliance monitoring, audit trails, and regulatory reporting tools will be displayed here.</p>
  </div>
);

const tabComponents = {
  overview: DashboardOverview,
  financial: FinancialAnalysis,
  budgets: BudgetPlanning,
  forecasting: Forecasting,
  reporting: Reporting,
  analytics: Analytics,
  cashflow: CashFlow,
  risk: RiskManagement,
  planning: StrategicPlanning,
  compliance: ComplianceAudit,
  settings: Settings,
};

const tabTitles = {
  overview: 'Financial Overview',
  financial: 'P&L Analysis',
  budgets: 'Budget Management',
  forecasting: 'Financial Forecasting',
  reporting: 'Financial Reports',
  analytics: 'Financial Analytics',
  cashflow: 'Cash Flow',
  risk: 'Risk Management',
  planning: 'Strategic Planning',
  compliance: 'Compliance & Audit',
  settings: 'Settings',
};

const tabSubtitles = {
  overview: 'Real-time financial insights and key performance indicators',
  financial: 'Comprehensive P&L analysis and financial reporting',
  budgets: 'Budget planning and allocation management',
  forecasting: 'Financial forecasting and predictive modeling',
  reporting: 'Financial reports and business intelligence',
  analytics: 'Advanced financial analytics and data visualization',
  cashflow: 'Cash flow management and liquidity analysis',
  risk: 'Financial risk assessment and management',
  planning: 'Strategic financial planning and scenario modeling',
  compliance: 'Compliance monitoring and audit management',
  settings: 'System configuration and preferences',
};

export default function Dashboard() {
  const { authenticated } = useKeycloak();
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  if (!authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-gray-600">You need to login to access this page.</p>
        </div>
      </div>
    );
  }

  const ActiveComponent = tabComponents[activeTab as keyof typeof tabComponents];

  const handleTabChange = (tab: string) => {
    if (tab === 'home') {
      // Navigate to home page
      window.location.href = '/home';
      return;
    }
    setActiveTab(tab);
    setSidebarOpen(false); // Close sidebar on mobile when tab changes
  };

  const handleSidebarCollapse = (collapsed: boolean) => {
    setSidebarCollapsed(collapsed);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <DashboardSidebar
        activeTab={activeTab}
        onTabChange={handleTabChange}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        isCollapsed={sidebarCollapsed}
        onCollapseToggle={handleSidebarCollapse}
      />

      {/* Main Content */}
      <div className={cn(
        "flex-1 flex flex-col transition-all duration-300 ease-in-out",
        sidebarCollapsed ? "lg:ml-16 main-content-collapsed" : "lg:ml-0 main-content-expanded"
      )}>
        {/* Header */}
        <DashboardHeader
          title={tabTitles[activeTab as keyof typeof tabTitles]}
          subtitle={tabSubtitles[activeTab as keyof typeof tabSubtitles]}
          onMenuClick={() => setSidebarOpen(true)}
        />

        {/* Content */}
        <main className="flex-1 p-4 lg:p-6 overflow-auto">
          <ActiveComponent />
        </main>
      </div>
    </div>
  );
}
