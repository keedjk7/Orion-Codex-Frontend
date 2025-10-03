import React, { useState, Suspense } from 'react';
import { useKeycloak } from '@/contexts/KeycloakContext';
import { cn } from '@/lib/utils';
import DashboardSidebar from '@/components/DashboardSidebar';
import DashboardHeader from '@/components/DashboardHeader';
import { useLocation } from 'wouter';

// Lazy load PL Report component
const PLReport = React.lazy(() => import('./PLReport'));

export default function PLReportPage() {
  const { authenticated } = useKeycloak();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [, setLocation] = useLocation();

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

  const handleTabChange = (tab: string) => {
    if (tab === 'home') {
      setLocation('/home');
      return;
    }
    
    // Navigate to different dashboard routes
    switch (tab) {
      case 'ce-dashboard':
        setLocation('/ce-dashboard');
        break;
      case 'fn-dashboard':
        setLocation('/fn-dashboard');
        break;
      case 'pl-report':
        setLocation('/pl-report');
        break;
      case 'upload':
        setLocation('/upload');
        break;
      case 'home':
        setLocation('/home');
        break;
      default:
        break;
    }
    setSidebarOpen(false);
  };

  const handleSidebarCollapse = (collapsed: boolean) => {
    setSidebarCollapsed(collapsed);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <DashboardSidebar
        activeTab="pl-report"
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
          title="Profit & Loss Report"
          subtitle="Hierarchical P&L account structure with expandable view"
          onMenuClick={() => setSidebarOpen(true)}
        />

        {/* Content */}
        <main className="flex-1 p-4 lg:p-6 overflow-auto bg-gray-100">
          <Suspense fallback={
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading P&L Report...</p>
              </div>
            </div>
          }>
            <PLReport />
          </Suspense>
        </main>
      </div>
    </div>
  );
}

