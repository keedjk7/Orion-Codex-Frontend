import React, { useState, Suspense } from 'react';
import { useKeycloak } from '@/contexts/KeycloakContext';
import { cn } from '@/lib/utils';
import DashboardSidebar from '@/components/DashboardSidebar';
import DashboardHeader from '@/components/DashboardHeader';
import { useLocation } from 'wouter';

// Lazy load FileUpload component
const FileUpload = React.lazy(() => import('./FileUpload'));

export default function FileUploadPage() {
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
      case 'upload':
        setLocation('/upload');
        break;
      case 'home':
        setLocation('/home');
        break;
      default:
        // For other tabs, you can add logic here if needed
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
        activeTab="upload"
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
          title="File Upload"
          subtitle="Upload and manage your files securely"
          onMenuClick={() => setSidebarOpen(true)}
        />

        {/* Content */}
        <main className="flex-1 p-4 lg:p-6 overflow-auto">
          <Suspense fallback={
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading Upload Page...</p>
              </div>
            </div>
          }>
            <FileUpload />
          </Suspense>
        </main>
      </div>
    </div>
  );
}

