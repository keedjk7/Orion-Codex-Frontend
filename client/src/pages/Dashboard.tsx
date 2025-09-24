import React, { useState } from 'react';
import { useKeycloak } from '@/contexts/KeycloakContext';
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

const tabComponents = {
  overview: DashboardOverview,
  financial: FinancialAnalysis,
  budgets: BudgetPlanning,
  forecasting: Forecasting,
  reporting: Reporting,
  analytics: Analytics,
  models: TM1Models,
  calculations: Calculations,
  calendar: PlanningCalendar,
  users: UserManagement,
  settings: Settings,
};

const tabTitles = {
  overview: 'Dashboard Overview',
  financial: 'Financial Analysis',
  budgets: 'Budget Planning',
  forecasting: 'Forecasting',
  reporting: 'Reports',
  analytics: 'Analytics',
  models: 'TM1 Models',
  calculations: 'Calculations',
  calendar: 'Planning Calendar',
  users: 'User Management',
  settings: 'Settings',
};

const tabSubtitles = {
  overview: 'Real-time insights and key performance indicators',
  financial: 'Comprehensive financial analysis and reporting',
  budgets: 'Budget planning and allocation management',
  forecasting: 'Predictive modeling and forecasting tools',
  reporting: 'Financial reports and business intelligence',
  analytics: 'Advanced analytics and data visualization',
  models: 'TM1 model management and configuration',
  calculations: 'Calculation engines and business rules',
  calendar: 'Planning calendar and workflow management',
  users: 'User access control and permissions',
  settings: 'System configuration and preferences',
};

export default function Dashboard() {
  const { authenticated } = useKeycloak();
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
    setActiveTab(tab);
    setSidebarOpen(false); // Close sidebar on mobile when tab changes
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <DashboardSidebar 
        activeTab={activeTab} 
        onTabChange={handleTabChange}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:ml-0">
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
