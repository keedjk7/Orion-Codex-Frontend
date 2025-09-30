import React, { useState } from 'react';
import { ExportDataButton } from './ExportDataButton';
import { DashboardFilters, FilterOptions } from './DashboardFilters';
import { RefreshCw, Info } from 'lucide-react';
import { Button } from './ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { useToast } from '@/hooks/use-toast';

interface EnhancedDashboardToolsProps {
  data: any[];
  filename: string;
  onFilterChange?: (filters: FilterOptions) => void;
  onRefresh?: () => void;
  showFilters?: boolean;
  lastUpdated?: string;
}

export function EnhancedDashboardTools({
  data,
  filename,
  onFilterChange,
  onRefresh,
  showFilters = true,
  lastUpdated = new Date().toLocaleString()
}: EnhancedDashboardToolsProps) {
  const { toast } = useToast();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      if (onRefresh) {
        onRefresh();
      }
      toast({
        title: 'Data Refreshed',
        description: 'Dashboard data has been updated successfully.',
      });
      setIsRefreshing(false);
    }, 1000);
  };

  const handleFilterChange = (filters: FilterOptions) => {
    if (onFilterChange) {
      onFilterChange(filters);
    }
    toast({
      title: 'Filters Applied',
      description: `Showing data for: ${filters.dateRange}`,
    });
  };

  return (
    <div className="flex items-center gap-3 flex-wrap">
      {/* Last Updated Info */}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-xs font-medium cursor-help">
              <Info className="w-3 h-3" />
              <span>Updated: {new Date(lastUpdated).toLocaleTimeString()}</span>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p className="text-xs">Last data sync: {lastUpdated}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {/* Refresh Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={handleRefresh}
        disabled={isRefreshing}
        className="gap-2"
      >
        <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
        <span>{isRefreshing ? 'Refreshing...' : 'Refresh'}</span>
      </Button>

      {/* Filters */}
      {showFilters && (
        <DashboardFilters onFilterChange={handleFilterChange} />
      )}

      {/* Export Button */}
      <ExportDataButton data={data} filename={filename} />
    </div>
  );
}
