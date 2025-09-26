import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  LayoutDashboard,
  BarChart3,
  TrendingUp,
  FileText,
  Settings,
  Users,
  Calculator,
  Database,
  Target,
  DollarSign,
  Calendar,
  X,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  isOpen?: boolean;
  onClose?: () => void;
  isCollapsed?: boolean;
  onCollapseToggle?: (collapsed: boolean) => void;
}

const menuItems = [
  { id: 'overview', label: 'Financial Overview', icon: LayoutDashboard },
  { id: 'financial', label: 'P&L Analysis', icon: DollarSign },
  { id: 'budgets', label: 'Budget Management', icon: Target },
  { id: 'forecasting', label: 'Financial Forecasting', icon: TrendingUp },
  { id: 'reporting', label: 'Financial Reports', icon: FileText },
  { id: 'analytics', label: 'Financial Analytics', icon: BarChart3 },
  { id: 'cashflow', label: 'Cash Flow', icon: Database },
  { id: 'risk', label: 'Risk Management', icon: Calculator },
  { id: 'planning', label: 'Strategic Planning', icon: Calendar },
  { id: 'compliance', label: 'Compliance & Audit', icon: Users },
  { id: 'settings', label: 'Settings', icon: Settings },
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

  return (
    <>
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
          "fixed lg:static inset-y-0 left-0 z-50 bg-white border-r border-gray-200 h-full flex flex-col transition-all duration-300 ease-in-out lg:translate-x-0 group",
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
        <nav className="flex-1 p-2 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
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
