import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  BarChart3,
  TrendingUp,
  FileText,
  DollarSign,
  Home,
  X,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Upload,
  Database,
  Building2,
  GitBranch
} from 'lucide-react';

// Custom scrollbar styles for sidebar
const sidebarScrollbarStyles = `
  .custom-scrollbar::-webkit-scrollbar {
    width: 6px;
  }
  .custom-scrollbar::-webkit-scrollbar-track {
    background: #f8fafc;
    border-radius: 3px;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 3px;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: #94a3b8;
  }
`;

interface MenuItem {
  id: string;
  label: string;
  icon: any;
  isGroup?: boolean;
  children?: MenuItem[];
}

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  isOpen?: boolean;
  onClose?: () => void;
  isCollapsed?: boolean;
  onCollapseToggle?: (collapsed: boolean) => void;
}

const menuItems: MenuItem[] = [
  { id: 'home', label: 'Home', icon: Home },
  { 
    id: 'dashboards', 
    label: 'Dashboards', 
    icon: BarChart3,
    isGroup: true,
    children: [
      { id: 'ce-dashboard', label: 'CE Dashboard', icon: BarChart3 },
      { id: 'fn-dashboard', label: 'FN Dashboard', icon: TrendingUp },
    ]
  },
  { 
    id: 'financial-reports', 
    label: 'Financial Reports', 
    icon: FileText,
    isGroup: true,
    children: [
      { id: 'pl-report', label: 'P&L Report', icon: DollarSign },
    ]
  },
  { 
    id: 'master-data', 
    label: 'Master Data', 
    icon: Database,
    isGroup: true,
    children: [
      { id: 'pl-account', label: 'PL Account', icon: DollarSign },
      { id: 'company-account', label: 'Company Account', icon: Building2 },
      { id: 'io-mapping', label: 'IO Mapping', icon: GitBranch },
    ]
  },
  { id: 'upload', label: 'File Upload', icon: Upload },
];

export default function DashboardSidebar({
  activeTab,
  onTabChange,
  isOpen = true,
  onClose,
  isCollapsed: externalCollapsed,
  onCollapseToggle
}: SidebarProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [internalCollapsed, setInternalCollapsed] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState<string[]>(['dashboards', 'financial-reports', 'master-data']);

  // Use external collapsed state if provided, otherwise use internal
  const isCollapsed = externalCollapsed ?? internalCollapsed;

  // Determine if sidebar should expand based on hover or explicit state
  const shouldExpand = !isCollapsed || isHovered;

  const toggleCollapse = () => {
    const newCollapsed = !isCollapsed;
    setInternalCollapsed(newCollapsed);
    onCollapseToggle?.(newCollapsed);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const toggleGroup = (groupId: string) => {
    setExpandedGroups(prev => 
      prev.includes(groupId) 
        ? prev.filter(id => id !== groupId)
        : [...prev, groupId]
    );
  };

  const isGroupExpanded = (groupId: string) => {
    return expandedGroups.includes(groupId);
  };

  return (
    <>
      {/* Custom Scrollbar Styles */}
      <style dangerouslySetInnerHTML={{ __html: sidebarScrollbarStyles }} />
      
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed lg:sticky inset-y-0 left-0 z-50 bg-white border-r border-gray-200 h-screen lg:h-screen flex flex-col transition-all duration-300 ease-in-out lg:translate-x-0 group lg:top-0",
          isOpen ? "translate-x-0 sidebar-slide-in" : "-translate-x-full sidebar-slide-out",
          shouldExpand ? "w-64 sidebar-expanded" : "w-16 sidebar-collapsed"
        )}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Logo/Brand */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-sm">O</span>
              </div>
              {shouldExpand && (
                <div className="transition-opacity duration-200 opacity-100">
                  <h1 className="text-xl font-bold text-gray-900">Orion</h1>
                </div>
              )}
            </div>
            {/* Collapse Toggle & Mobile Close Button */}
            <div className="flex items-center space-x-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleCollapse}
                className={cn(
                  "hidden lg:flex transition-opacity duration-200",
                  shouldExpand ? "opacity-100" : "opacity-0"
                )}
                title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              >
                {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
              </Button>
              {onClose && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="lg:hidden"
                  onClick={onClose}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 p-2 overflow-y-auto overflow-x-hidden custom-scrollbar">
          <div className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              
              // Handle group items
              if (item.isGroup && item.children) {
                const isExpanded = isGroupExpanded(item.id);
                const hasActiveChild = item.children.some(child => child.id === activeTab);
                
                return (
                  <div key={item.id}>
                    {/* Group Header */}
                    <Button
                      variant={hasActiveChild ? "default" : "ghost"}
                      className={cn(
                        "w-full justify-start text-left font-normal transition-all duration-200",
                        hasActiveChild
                          ? "bg-blue-50 text-blue-700 border-blue-200"
                          : "text-gray-600 hover:text-gray-900 hover:bg-gray-50",
                        shouldExpand ? "px-3" : "px-2 justify-center",
                        !shouldExpand && "sidebar-tooltip"
                      )}
                      onClick={() => {
                        if (shouldExpand) {
                          toggleGroup(item.id);
                        } else {
                          onTabChange(item.children?.[0]?.id || item.id);
                        }
                      }}
                      data-tooltip={item.label}
                      title=""
                    >
                      <Icon className={cn("h-4 w-4 flex-shrink-0", shouldExpand ? "mr-3" : "mr-0")} />
                      {shouldExpand && (
                        <>
                          <span className="truncate transition-opacity duration-200 opacity-100 flex-1">
                            {item.label}
                          </span>
                          {isExpanded ? (
                            <ChevronUp className="h-4 w-4 ml-2" />
                          ) : (
                            <ChevronDown className="h-4 w-4 ml-2" />
                          )}
                        </>
                      )}
                    </Button>
                    
                    {/* Group Children */}
                    {shouldExpand && isExpanded && (
                      <div className="ml-6 mt-1 space-y-1">
                        {item.children.map((child) => {
                          const ChildIcon = child.icon;
                          return (
                            <Button
                              key={child.id}
                              variant={activeTab === child.id ? "default" : "ghost"}
                              className={cn(
                                "w-full justify-start text-left font-normal transition-all duration-200",
                                activeTab === child.id
                                  ? "bg-blue-50 text-blue-700 border-blue-200"
                                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50",
                                "px-3"
                              )}
                              onClick={() => onTabChange(child.id)}
                            >
                              <ChildIcon className="h-4 w-4 flex-shrink-0 mr-3" />
                              <span className="truncate transition-opacity duration-200 opacity-100">
                                {child.label}
                              </span>
                            </Button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              }
              
              // Handle regular items
              return (
                <Button
                  key={item.id}
                  variant={activeTab === item.id ? "default" : "ghost"}
                  className={cn(
                    "w-full justify-start text-left font-normal transition-all duration-200",
                    activeTab === item.id
                      ? "bg-blue-50 text-blue-700 border-blue-200"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50",
                    shouldExpand ? "px-3" : "px-2 justify-center",
                    !shouldExpand && "sidebar-tooltip"
                  )}
                  onClick={() => onTabChange(item.id)}
                  data-tooltip={item.label}
                  title=""
                >
                  <Icon className={cn("h-4 w-4 flex-shrink-0", shouldExpand ? "mr-3" : "mr-0")} />
                  {shouldExpand && (
                    <span className="truncate transition-opacity duration-200 opacity-100">
                      {item.label}
                    </span>
                  )}
                </Button>
              );
            })}
          </div>
        </nav>

        {/* Footer */}
        <div className="p-2 border-t border-gray-200">
          {shouldExpand ? (
            <div className="text-xs text-gray-500 text-center transition-opacity duration-200 opacity-100">
              Orion AI Finance
              <br />
              Version 1.0.0
            </div>
          ) : (
            <div className="text-xs text-gray-500 text-center transition-opacity duration-200 opacity-100">
              O
              <br />
              AI
            </div>
          )}
        </div>
      </div>
    </>
  );
}
