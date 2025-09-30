import React, { useState } from 'react';
import { Calendar, Filter, RefreshCw, X } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

export interface FilterOptions {
  dateRange: string;
  category: string;
  status: string;
}

interface DashboardFiltersProps {
  onFilterChange: (filters: FilterOptions) => void;
  initialFilters?: FilterOptions;
}

const dateRanges = [
  { value: 'today', label: 'Today' },
  { value: 'week', label: 'This Week' },
  { value: 'month', label: 'This Month' },
  { value: 'quarter', label: 'This Quarter' },
  { value: 'year', label: 'This Year' },
  { value: 'all', label: 'All Time' }
];

const categories = [
  { value: 'all', label: 'All Categories' },
  { value: 'revenue', label: 'Revenue' },
  { value: 'cost', label: 'Cost' },
  { value: 'profit', label: 'Profit' },
  { value: 'expenses', label: 'Expenses' }
];

const statuses = [
  { value: 'all', label: 'All Status' },
  { value: 'actual', label: 'Actual' },
  { value: 'forecast', label: 'Forecast' },
  { value: 'budget', label: 'Budget' }
];

export function DashboardFilters({ onFilterChange, initialFilters }: DashboardFiltersProps) {
  const [filters, setFilters] = useState<FilterOptions>(initialFilters || {
    dateRange: 'month',
    category: 'all',
    status: 'all'
  });

  const [showFilters, setShowFilters] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const handleFilterChange = (key: keyof FilterOptions, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    setHasChanges(true);
  };

  const applyFilters = () => {
    onFilterChange(filters);
    setHasChanges(false);
    setShowFilters(false);
  };

  const resetFilters = () => {
    const defaultFilters = {
      dateRange: 'month',
      category: 'all',
      status: 'all'
    };
    setFilters(defaultFilters);
    onFilterChange(defaultFilters);
    setHasChanges(false);
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.dateRange !== 'month') count++;
    if (filters.category !== 'all') count++;
    if (filters.status !== 'all') count++;
    return count;
  };

  return (
    <div className="relative">
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowFilters(!showFilters)}
          className="gap-2"
        >
          <Filter className="w-4 h-4" />
          <span>Filters</span>
          {getActiveFiltersCount() > 0 && (
            <Badge variant="secondary" className="ml-1 px-1.5 py-0.5 text-xs">
              {getActiveFiltersCount()}
            </Badge>
          )}
        </Button>

        {getActiveFiltersCount() > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={resetFilters}
            className="gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Reset</span>
          </Button>
        )}
      </div>

      {showFilters && (
        <div className="absolute top-12 right-0 z-50 w-96 bg-white rounded-lg shadow-2xl border border-gray-200 p-4 animate-in slide-in-from-top-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900">Filter Options</h3>
            <button
              onClick={() => setShowFilters(false)}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-4">
            {/* Date Range Filter */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-2" />
                Date Range
              </label>
              <div className="grid grid-cols-2 gap-2">
                {dateRanges.map(range => (
                  <button
                    key={range.value}
                    onClick={() => handleFilterChange('dateRange', range.value)}
                    className={`px-3 py-2 text-sm rounded-lg border transition-all ${
                      filters.dateRange === range.value
                        ? 'bg-blue-50 border-blue-500 text-blue-700 font-semibold'
                        : 'bg-white border-gray-200 text-gray-700 hover:border-blue-300'
                    }`}
                  >
                    {range.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Category
              </label>
              <div className="grid grid-cols-2 gap-2">
                {categories.map(cat => (
                  <button
                    key={cat.value}
                    onClick={() => handleFilterChange('category', cat.value)}
                    className={`px-3 py-2 text-sm rounded-lg border transition-all ${
                      filters.category === cat.value
                        ? 'bg-green-50 border-green-500 text-green-700 font-semibold'
                        : 'bg-white border-gray-200 text-gray-700 hover:border-green-300'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Data Type
              </label>
              <div className="grid grid-cols-2 gap-2">
                {statuses.map(status => (
                  <button
                    key={status.value}
                    onClick={() => handleFilterChange('status', status.value)}
                    className={`px-3 py-2 text-sm rounded-lg border transition-all ${
                      filters.status === status.value
                        ? 'bg-purple-50 border-purple-500 text-purple-700 font-semibold'
                        : 'bg-white border-gray-200 text-gray-700 hover:border-purple-300'
                    }`}
                  >
                    {status.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between pt-4 border-t">
            <Button
              variant="outline"
              size="sm"
              onClick={resetFilters}
              className="gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Reset All
            </Button>
            <Button
              size="sm"
              onClick={applyFilters}
              disabled={!hasChanges}
              className="gap-2"
            >
              Apply Filters
              {hasChanges && (
                <Badge variant="secondary" className="ml-1 bg-white text-blue-600">
                  New
                </Badge>
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
