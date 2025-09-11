import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  FileText, 
  Filter, 
  Save, 
  Edit2, 
  Check, 
  X,
  Calculator,
  TrendingUp,
  BarChart3,
  AlertCircle,
  DollarSign,
  PieChart,
  Activity,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import Navigation from "@/components/Navigation";
import heroBackground from "@assets/generated_images/Gradient_mesh_hero_background_83768b02.png";
import type { 
  ProfitLossStatement,
  BalanceSheet,
  CashFlowStatement 
} from "@shared/schema";

export default function FinancialReports() {
  const [selectedTopic, setSelectedTopic] = useState<string>("all");
  const [startPeriod, setStartPeriod] = useState<string>("none");
  const [endPeriod, setEndPeriod] = useState<string>("none");
  const [activeTab, setActiveTab] = useState<string>("pl");
  const [editingCells, setEditingCells] = useState<Record<string, any>>({});
  const queryClient = useQueryClient();
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const { toast } = useToast();

  // Fetch financial reports data
  const { data: plStatements = [], isLoading: plLoading } = useQuery({
    queryKey: ['/api/profit-loss', selectedTopic, startPeriod, endPeriod],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (selectedTopic && selectedTopic !== 'all') params.append('topic', selectedTopic);
      if (startPeriod && startPeriod !== 'none') params.append('startPeriod', startPeriod);
      if (endPeriod && endPeriod !== 'none') params.append('endPeriod', endPeriod);
      
      const response = await fetch(`/api/profit-loss?${params}`);
      if (!response.ok) throw new Error('Failed to fetch P&L statements');
      return response.json() as Promise<ProfitLossStatement[]>;
    }
  });

  const { data: balanceSheets = [], isLoading: bsLoading } = useQuery({
    queryKey: ['/api/balance-sheet', selectedTopic, startPeriod, endPeriod],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (selectedTopic && selectedTopic !== 'all') params.append('topic', selectedTopic);
      if (startPeriod && startPeriod !== 'none') params.append('startPeriod', startPeriod);
      if (endPeriod && endPeriod !== 'none') params.append('endPeriod', endPeriod);
      
      const response = await fetch(`/api/balance-sheet?${params}`);
      if (!response.ok) throw new Error('Failed to fetch balance sheets');
      return response.json() as Promise<BalanceSheet[]>;
    }
  });

  const { data: cashFlowStatements = [], isLoading: cfLoading } = useQuery({
    queryKey: ['/api/cash-flow', selectedTopic, startPeriod, endPeriod],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (selectedTopic && selectedTopic !== 'all') params.append('topic', selectedTopic);
      if (startPeriod && startPeriod !== 'none') params.append('startPeriod', startPeriod);
      if (endPeriod && endPeriod !== 'none') params.append('endPeriod', endPeriod);
      
      const response = await fetch(`/api/cash-flow?${params}`);
      if (!response.ok) throw new Error('Failed to fetch cash flow statements');
      return response.json() as Promise<CashFlowStatement[]>;
    }
  });

  // Get unique topics and periods for filtering
  const uniqueTopics = useMemo(() => {
    const allData = [...plStatements, ...balanceSheets, ...cashFlowStatements];
    return Array.from(new Set(allData.map(item => item.topic)));
  }, [plStatements, balanceSheets, cashFlowStatements]);

  const uniquePeriods = useMemo(() => {
    const allData = [...plStatements, ...balanceSheets, ...cashFlowStatements];
    const periods = Array.from(new Set(allData.map(item => item.period)));
    // Sort periods properly for YYYY-MM format, then reverse for newest first
    return periods.sort((a, b) => {
      // Handle 'none' values
      if (a === 'none') return 1;
      if (b === 'none') return -1;
      // Standard string comparison works for YYYY-MM format
      return a.localeCompare(b);
    }).reverse();
  }, [plStatements, balanceSheets, cashFlowStatements]);

  // Helper function for safe number parsing
  const safeParseFloat = (value: string | undefined): number => {
    if (!value) return 0;
    const parsed = parseFloat(value);
    return isNaN(parsed) ? 0 : parsed;
  };

  // Helper function for percentage change calculation
  const calculatePercentageChange = (current: number, previous: number): number => {
    if (previous === 0) return 0;
    return ((current - previous) / Math.abs(previous)) * 100;
  };

  // Calculate key financial metrics
  const financialMetrics = useMemo(() => {
    // Get latest periods for each statement type
    const plPeriods = plStatements.map(pl => pl.period).sort().reverse();
    const bsPeriods = balanceSheets.map(bs => bs.period).sort().reverse();
    const cfPeriods = cashFlowStatements.map(cf => cf.period).sort().reverse();
    
    const latestPLPeriod = plPeriods[0] || '';
    const previousPLPeriod = plPeriods[1] || '';
    const latestBSPeriod = bsPeriods[0] || '';
    const previousBSPeriod = bsPeriods[1] || '';
    const latestCFPeriod = cfPeriods[0] || '';
    const previousCFPeriod = cfPeriods[1] || '';
    
    // P&L Metrics
    const latestPL = plStatements.find(pl => pl.period === latestPLPeriod);
    const previousPL = plStatements.find(pl => pl.period === previousPLPeriod);
    
    const currentRevenue = latestPL ? safeParseFloat(latestPL.totalRevenue) : 0;
    const currentExpenses = latestPL ? 
      safeParseFloat(latestPL.costOfGoodsSold) + 
      safeParseFloat(latestPL.operatingExpenses) + 
      safeParseFloat(latestPL.otherExpenses) + 
      safeParseFloat(latestPL.taxExpense) : 0;
    const currentNetIncome = latestPL ? safeParseFloat(latestPL.netIncome) : 0;
    
    const previousRevenue = previousPL ? safeParseFloat(previousPL.totalRevenue) : 0;
    const previousExpenses = previousPL ? 
      safeParseFloat(previousPL.costOfGoodsSold) + 
      safeParseFloat(previousPL.operatingExpenses) + 
      safeParseFloat(previousPL.otherExpenses) + 
      safeParseFloat(previousPL.taxExpense) : 0;
    const previousNetIncome = previousPL ? safeParseFloat(previousPL.netIncome) : 0;
    
    // Balance Sheet Metrics
    const latestBS = balanceSheets.find(bs => bs.period === latestBSPeriod);
    const previousBS = balanceSheets.find(bs => bs.period === previousBSPeriod);
    
    const currentTotalAssets = latestBS ? safeParseFloat(latestBS.totalAssets) : 0;
    const currentCurrentAssets = latestBS ? safeParseFloat(latestBS.currentAssets) : 0;
    const currentCurrentLiabilities = latestBS ? safeParseFloat(latestBS.currentLiabilities) : 0;
    const workingCapital = currentCurrentAssets - currentCurrentLiabilities;
    
    const previousTotalAssets = previousBS ? safeParseFloat(previousBS.totalAssets) : 0;
    const previousCurrentAssets = previousBS ? safeParseFloat(previousBS.currentAssets) : 0;
    const previousCurrentLiabilities = previousBS ? safeParseFloat(previousBS.currentLiabilities) : 0;
    const previousWorkingCapital = previousCurrentAssets - previousCurrentLiabilities;
    
    // Cash Flow Metrics
    const latestCF = cashFlowStatements.find(cf => cf.period === latestCFPeriod);
    const previousCF = cashFlowStatements.find(cf => cf.period === previousCFPeriod);
    
    const operatingCashFlow = latestCF ? safeParseFloat(latestCF.operatingCashFlow) : 0;
    const previousOperatingCashFlow = previousCF ? safeParseFloat(previousCF.operatingCashFlow) : 0;
    
    // Calculate percentage changes
    const revenueChange = calculatePercentageChange(currentRevenue, previousRevenue);
    const expenseChange = calculatePercentageChange(currentExpenses, previousExpenses);
    const netIncomeChange = calculatePercentageChange(currentNetIncome, previousNetIncome);
    const assetsChange = calculatePercentageChange(currentTotalAssets, previousTotalAssets);
    const workingCapitalChange = calculatePercentageChange(workingCapital, previousWorkingCapital);
    const operatingCashFlowChange = calculatePercentageChange(operatingCashFlow, previousOperatingCashFlow);
    
    return {
      currentRevenue,
      currentExpenses,
      currentNetIncome,
      currentTotalAssets,
      workingCapital,
      operatingCashFlow,
      revenueChange,
      expenseChange,
      netIncomeChange,
      assetsChange,
      workingCapitalChange,
      operatingCashFlowChange,
      latestPLPeriod,
      latestBSPeriod,
      latestCFPeriod,
      hasPreviousPL: !!previousPL,
      hasPreviousBS: !!previousBS,
      hasPreviousCF: !!previousCF
    };
  }, [plStatements, balanceSheets, cashFlowStatements]);

  // Date range validation
  const validateDateRange = (start: string, end: string): boolean => {
    if (start === 'none' || end === 'none') return true;
    if (start > end) {
      toast({
        description: "Start period must be before or equal to end period",
        variant: "destructive"
      });
      return false;
    }
    return true;
  };

  // Enhanced period change handlers with validation
  const handleStartPeriodChange = (value: string) => {
    if (validateDateRange(value, endPeriod)) {
      setStartPeriod(value);
    }
  };

  const handleEndPeriodChange = (value: string) => {
    if (validateDateRange(startPeriod, value)) {
      setEndPeriod(value);
    }
  };

  // Validation helper function
  const validateNumericInput = (value: string): string | null => {
    if (value.trim() === '') return 'Value is required';
    
    const num = parseFloat(value);
    if (isNaN(num)) return 'Must be a valid number';
    
    // Check decimal places
    if (value.includes('.') && value.split('.')[1].length > 2) {
      return 'Maximum 2 decimal places allowed';
    }
    
    return null;
  };

  // Update mutations with improved error handling
  const updatePLMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const response = await apiRequest('PUT', `/api/profit-loss/${id}`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/profit-loss'] });
      toast({ description: "Profit & Loss statement updated successfully" });
    },
    onError: (error: any) => {
      console.error('P&L update error:', error);
      let errorMessage = "An error occurred while updating";
      
      if (error.message.includes('400')) {
        errorMessage = "Invalid data. Please check the entered values";
      } else if (error.message.includes('404')) {
        errorMessage = "Data to be updated not found";
      }
      
      toast({ description: errorMessage, variant: "destructive" });
    }
  });

  const updateBSMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const response = await apiRequest('PUT', `/api/balance-sheet/${id}`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/balance-sheet'] });
      toast({ description: "Balance sheet updated successfully" });
    },
    onError: (error: any) => {
      console.error('Balance sheet update error:', error);
      let errorMessage = "An error occurred while updating";
      
      if (error.message.includes('400')) {
        errorMessage = "Invalid data. Please check the entered values";
      } else if (error.message.includes('404')) {
        errorMessage = "Data to be updated not found";
      }
      
      toast({ description: errorMessage, variant: "destructive" });
    }
  });

  const updateCFMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const response = await apiRequest('PUT', `/api/cash-flow/${id}`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/cash-flow'] });
      toast({ description: "Cash flow statement updated successfully" });
    },
    onError: (error: any) => {
      console.error('Cash flow update error:', error);
      let errorMessage = "An error occurred while updating";
      
      if (error.message.includes('400')) {
        errorMessage = "Invalid data. Please check the entered values";
      } else if (error.message.includes('404')) {
        errorMessage = "Data to be updated not found";
      }
      
      toast({ description: errorMessage, variant: "destructive" });
    }
  });

  // Edit cell functions
  const startEditing = (cellKey: string, currentValue: string) => {
    setEditingCells(prev => ({ ...prev, [cellKey]: currentValue }));
  };

  const saveEdit = async (cellKey: string, itemId: string, field: string, reportType: 'pl' | 'bs' | 'cf') => {
    const newValue = editingCells[cellKey];
    
    // Client-side validation
    const validationError = validateNumericInput(newValue);
    if (validationError) {
      setValidationErrors(prev => ({ ...prev, [cellKey]: validationError }));
      toast({ 
        description: validationError, 
        variant: "destructive" 
      });
      return;
    }

    // Clear any existing validation errors for this cell
    setValidationErrors(prev => {
      const newState = { ...prev };
      delete newState[cellKey];
      return newState;
    });
    
    try {
      if (reportType === 'pl') {
        await updatePLMutation.mutateAsync({ 
          id: itemId, 
          data: { [field]: newValue } 
        });
      } else if (reportType === 'bs') {
        await updateBSMutation.mutateAsync({ 
          id: itemId, 
          data: { [field]: newValue } 
        });
      } else if (reportType === 'cf') {
        await updateCFMutation.mutateAsync({ 
          id: itemId, 
          data: { [field]: newValue } 
        });
      }

      setEditingCells(prev => {
        const newState = { ...prev };
        delete newState[cellKey];
        return newState;
      });
    } catch (error) {
      // Error handling is done in the mutation onError callbacks
      console.error('Save edit error:', error);
    }
  };

  const cancelEdit = (cellKey: string) => {
    setEditingCells(prev => {
      const newState = { ...prev };
      delete newState[cellKey];
      return newState;
    });
    
    // Clear any validation errors for this cell
    setValidationErrors(prev => {
      const newState = { ...prev };
      delete newState[cellKey];
      return newState;
    });
  };

  // Format number for display
  const formatNumber = (value: string | number) => {
    const num = typeof value === 'string' ? parseFloat(value) : value;
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(num);
  };

  // Editable cell component
  const EditableCell = ({ 
    value, 
    itemId, 
    field, 
    reportType, 
    isEditable = true, 
    className = "" 
  }: {
    value: string;
    itemId: string;
    field: string;
    reportType: 'pl' | 'bs' | 'cf';
    isEditable?: boolean;
    className?: string;
  }) => {
    const cellKey = `${itemId}-${field}`;
    const isEditing = cellKey in editingCells;
    const hasError = cellKey in validationErrors;
    const isSaving = updatePLMutation.isPending || updateBSMutation.isPending || updateCFMutation.isPending;

    if (!isEditable) {
      return (
        <TableCell className={`text-right ${className}`} data-testid={`cell-readonly-${field}`}>
          {formatNumber(value)}
        </TableCell>
      );
    }

    if (isEditing) {
      return (
        <TableCell className="text-right p-2" data-testid={`cell-editing-${field}`}>
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1">
              <Input
                value={editingCells[cellKey]}
                onChange={(e) => {
                  setEditingCells(prev => ({ ...prev, [cellKey]: e.target.value }));
                  // Clear validation error on input change
                  if (hasError) {
                    setValidationErrors(prev => {
                      const newState = { ...prev };
                      delete newState[cellKey];
                      return newState;
                    });
                  }
                }}
                className={`h-8 text-right ${hasError ? 'border-red-500 focus:border-red-500' : ''}`}
                type="number"
                step="0.01"
                disabled={isSaving}
                data-testid={`input-edit-${field}`}
              />
              <Button
                size="sm"
                variant="ghost"
                onClick={() => saveEdit(cellKey, itemId, field, reportType)}
                className="h-8 w-8 p-0"
                disabled={isSaving}
                data-testid={`button-save-${field}`}
              >
                {isSaving ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-green-600 border-t-transparent" />
                ) : (
                  <Check className="h-4 w-4 text-green-600" />
                )}
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => cancelEdit(cellKey)}
                className="h-8 w-8 p-0"
                disabled={isSaving}
                data-testid={`button-cancel-${field}`}
              >
                <X className="h-4 w-4 text-red-600" />
              </Button>
            </div>
            {hasError && (
              <div className="flex items-center gap-1 text-xs text-red-600">
                <AlertCircle className="h-3 w-3" />
                <span>{validationErrors[cellKey]}</span>
              </div>
            )}
          </div>
        </TableCell>
      );
    }

    return (
      <TableCell 
        className={`text-right cursor-pointer hover:bg-muted/50 ${className}`}
        onClick={() => startEditing(cellKey, value)}
        data-testid={`cell-editable-${field}`}
      >
        <div className="flex items-center justify-end gap-2">
          {formatNumber(value)}
          <Edit2 className="h-3 w-3 opacity-50" />
        </div>
      </TableCell>
    );
  };

  // Profit & Loss Table Component - Comparative View
  const ProfitLossTable = () => {
    if (plLoading) {
      return (
        <div className="p-12 text-center" data-testid="loading-pl">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="text-lg font-medium text-muted-foreground">Loading data...</span>
          </div>
          <p className="text-sm text-muted-foreground">Please wait</p>
        </div>
      );
    }

    if (plStatements.length === 0) {
      return <div className="p-8 text-center text-muted-foreground">No profit & loss data available</div>;
    }

    // Group statements by topic and sort periods
    const groupedStatements = plStatements.reduce((acc, statement) => {
      if (!acc[statement.topic]) acc[statement.topic] = [];
      acc[statement.topic].push(statement);
      return acc;
    }, {} as Record<string, ProfitLossStatement[]>);

    // Sort periods for each topic
    Object.keys(groupedStatements).forEach(topic => {
      groupedStatements[topic].sort((a, b) => a.period.localeCompare(b.period));
    });

    return (
      <div className="space-y-6">
        {Object.entries(groupedStatements).map(([topic, statements]) => {
          const firstStatement = statements[0];
          const editableFields = JSON.parse(firstStatement?.isEditable || '{}');

          return (
            <Card key={topic} className="bg-card/95 backdrop-blur-sm border border-border/50 shadow-lg hover-elevate transition-all duration-300" data-testid={`pl-comparative-${topic}`}>
              <CardHeader className="bg-muted/50 border-b border-border/50">
                <CardTitle className="flex items-center gap-3 text-xl font-bold">
                  <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
                    <Calculator className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <span className="text-foreground">Profit & Loss Statement</span>
                    <div className="text-sm font-normal text-muted-foreground">{topic}</div>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table className="min-w-full border-separate border-spacing-0 rounded-xl overflow-hidden">
                    <TableHeader>
                      <TableRow className="bg-muted/50 border-b border-border/50">
                        <TableHead className="sticky left-0 bg-muted/50 z-10 min-w-[200px] border-r border-border/50 font-bold text-foreground p-4">Line Item</TableHead>
                        {statements.map((statement) => (
                          <TableHead key={statement.period} className="text-right min-w-[120px] font-semibold text-foreground p-4" data-testid={`header-${statement.period}`}>
                            {statement.period}
                          </TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium sticky left-0 bg-muted/50 z-10 border-r border-border/50">Total Revenue</TableCell>
                      {statements.map((statement) => (
                        <EditableCell
                          key={`${statement.id}-totalRevenue`}
                          value={statement.totalRevenue}
                          itemId={statement.id}
                          field="totalRevenue"
                          reportType="pl"
                          isEditable={JSON.parse(statement.isEditable || '{}').totalRevenue}
                        />
                      ))}
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium sticky left-0 bg-muted/50 z-10 border-r border-border/50">Cost of Goods Sold</TableCell>
                      {statements.map((statement) => (
                        <EditableCell
                          key={`${statement.id}-costOfGoodsSold`}
                          value={statement.costOfGoodsSold}
                          itemId={statement.id}
                          field="costOfGoodsSold"
                          reportType="pl"
                          isEditable={JSON.parse(statement.isEditable || '{}').costOfGoodsSold}
                        />
                      ))}
                    </TableRow>
                    <TableRow className="border-t-2 bg-muted/30 dark:bg-muted/20">
                      <TableCell className="font-bold sticky left-0 bg-muted/50 z-10 border-r border-border/50">Gross Profit</TableCell>
                      {statements.map((statement) => (
                        <EditableCell
                          key={`${statement.id}-grossProfit`}
                          value={statement.grossProfit}
                          itemId={statement.id}
                          field="grossProfit"
                          reportType="pl"
                          isEditable={JSON.parse(statement.isEditable || '{}').grossProfit}
                          className="font-bold"
                        />
                      ))}
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium sticky left-0 bg-muted/50 z-10 border-r border-border/50">Operating Expenses</TableCell>
                      {statements.map((statement) => (
                        <EditableCell
                          key={`${statement.id}-operatingExpenses`}
                          value={statement.operatingExpenses}
                          itemId={statement.id}
                          field="operatingExpenses"
                          reportType="pl"
                          isEditable={JSON.parse(statement.isEditable || '{}').operatingExpenses}
                        />
                      ))}
                    </TableRow>
                    <TableRow className="border-t-2 bg-muted/30 dark:bg-muted/20">
                      <TableCell className="font-bold sticky left-0 bg-muted/50 z-10 border-r border-border/50">Operating Income</TableCell>
                      {statements.map((statement) => (
                        <EditableCell
                          key={`${statement.id}-operatingIncome`}
                          value={statement.operatingIncome}
                          itemId={statement.id}
                          field="operatingIncome"
                          reportType="pl"
                          isEditable={JSON.parse(statement.isEditable || '{}').operatingIncome}
                          className="font-bold"
                        />
                      ))}
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium sticky left-0 bg-muted/50 z-10 border-r border-border/50">Other Income</TableCell>
                      {statements.map((statement) => (
                        <EditableCell
                          key={`${statement.id}-otherIncome`}
                          value={statement.otherIncome}
                          itemId={statement.id}
                          field="otherIncome"
                          reportType="pl"
                          isEditable={JSON.parse(statement.isEditable || '{}').otherIncome}
                        />
                      ))}
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium sticky left-0 bg-muted/50 z-10 border-r border-border/50">Other Expenses</TableCell>
                      {statements.map((statement) => (
                        <EditableCell
                          key={`${statement.id}-otherExpenses`}
                          value={statement.otherExpenses}
                          itemId={statement.id}
                          field="otherExpenses"
                          reportType="pl"
                          isEditable={JSON.parse(statement.isEditable || '{}').otherExpenses}
                        />
                      ))}
                    </TableRow>
                    <TableRow className="border-t-2 bg-muted/30 dark:bg-muted/20">
                      <TableCell className="font-bold sticky left-0 bg-muted/50 z-10 border-r border-border/50">Income Before Tax</TableCell>
                      {statements.map((statement) => (
                        <EditableCell
                          key={`${statement.id}-netIncomeBeforeTax`}
                          value={statement.netIncomeBeforeTax}
                          itemId={statement.id}
                          field="netIncomeBeforeTax"
                          reportType="pl"
                          isEditable={JSON.parse(statement.isEditable || '{}').netIncomeBeforeTax}
                          className="font-bold"
                        />
                      ))}
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium sticky left-0 bg-muted/50 z-10 border-r border-border/50">Tax Expense</TableCell>
                      {statements.map((statement) => (
                        <EditableCell
                          key={`${statement.id}-taxExpense`}
                          value={statement.taxExpense}
                          itemId={statement.id}
                          field="taxExpense"
                          reportType="pl"
                          isEditable={JSON.parse(statement.isEditable || '{}').taxExpense}
                        />
                      ))}
                    </TableRow>
                    <TableRow className="border-t-2 bg-muted/30 dark:bg-muted/20">
                      <TableCell className="font-bold text-lg sticky left-0 bg-muted/50 z-10 border-r border-border/50">Net Income</TableCell>
                      {statements.map((statement) => (
                        <EditableCell
                          key={`${statement.id}-netIncome`}
                          value={statement.netIncome}
                          itemId={statement.id}
                          field="netIncome"
                          reportType="pl"
                          isEditable={JSON.parse(statement.isEditable || '{}').netIncome}
                          className="font-bold text-lg"
                        />
                      ))}
                    </TableRow>
                  </TableBody>
                </Table>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    );
  };

  // Balance Sheet Table Component - Comparative View
  const BalanceSheetTable = () => {
    if (bsLoading) {
      return (
        <div className="p-12 text-center" data-testid="loading-bs">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="text-lg font-medium text-muted-foreground">Loading data...</span>
          </div>
          <p className="text-sm text-muted-foreground">Please wait</p>
        </div>
      );
    }

    if (balanceSheets.length === 0) {
      return <div className="p-8 text-center text-muted-foreground">No balance sheet data available</div>;
    }

    // Group statements by topic and sort periods
    const groupedSheets = balanceSheets.reduce((acc, sheet) => {
      if (!acc[sheet.topic]) acc[sheet.topic] = [];
      acc[sheet.topic].push(sheet);
      return acc;
    }, {} as Record<string, BalanceSheet[]>);

    // Sort periods for each topic
    Object.keys(groupedSheets).forEach(topic => {
      groupedSheets[topic].sort((a, b) => a.period.localeCompare(b.period));
    });

    return (
      <div className="space-y-6">
        {Object.entries(groupedSheets).map(([topic, sheets]) => (
          <Card key={topic} className="bg-card/95 backdrop-blur-sm border border-border/50 shadow-lg hover-elevate transition-all duration-300" data-testid={`bs-comparative-${topic}`}>
            <CardHeader className="bg-muted/50 border-b border-border/50">
              <CardTitle className="flex items-center gap-3 text-xl font-bold">
                <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
                  <BarChart3 className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <span className="text-foreground">Balance Sheet</span>
                  <div className="text-sm font-normal text-muted-foreground">{topic}</div>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table className="min-w-full border-separate border-spacing-0 rounded-xl overflow-hidden">
                  <TableHeader>
                    <TableRow className="bg-muted/50 border-b border-border/50">
                      <TableHead className="sticky left-0 bg-muted/50 z-10 min-w-[200px] border-r border-border/50 font-bold text-foreground p-4">Line Item</TableHead>
                      {sheets.map((sheet) => (
                        <TableHead key={sheet.period} className="text-right min-w-[120px] font-semibold text-foreground p-4" data-testid={`header-${sheet.period}`}>
                          {sheet.period}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {/* Assets Section */}
                    <TableRow className="bg-muted/30 dark:bg-muted/20">
                      <TableCell className="font-bold sticky left-0 bg-muted/50 z-10 border-r border-border/50">Current Assets</TableCell>
                      {sheets.map((sheet) => (
                        <EditableCell
                          key={`${sheet.id}-currentAssets`}
                          value={sheet.currentAssets}
                          itemId={sheet.id}
                          field="currentAssets"
                          reportType="bs"
                          isEditable={JSON.parse(sheet.isEditable || '{}').currentAssets}
                          className="font-bold"
                        />
                      ))}
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium sticky left-0 bg-muted/50 z-10 border-r border-border/50 pl-6">Cash</TableCell>
                      {sheets.map((sheet) => (
                        <EditableCell
                          key={`${sheet.id}-cash`}
                          value={sheet.cash}
                          itemId={sheet.id}
                          field="cash"
                          reportType="bs"
                          isEditable={JSON.parse(sheet.isEditable || '{}').cash}
                        />
                      ))}
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium sticky left-0 bg-muted/50 z-10 border-r border-border/50 pl-6">Accounts Receivable</TableCell>
                      {sheets.map((sheet) => (
                        <EditableCell
                          key={`${sheet.id}-accountsReceivable`}
                          value={sheet.accountsReceivable}
                          itemId={sheet.id}
                          field="accountsReceivable"
                          reportType="bs"
                          isEditable={JSON.parse(sheet.isEditable || '{}').accountsReceivable}
                        />
                      ))}
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium sticky left-0 bg-muted/50 z-10 border-r border-border/50 pl-6">Inventory</TableCell>
                      {sheets.map((sheet) => (
                        <EditableCell
                          key={`${sheet.id}-inventory`}
                          value={sheet.inventory}
                          itemId={sheet.id}
                          field="inventory"
                          reportType="bs"
                          isEditable={JSON.parse(sheet.isEditable || '{}').inventory}
                        />
                      ))}
                    </TableRow>
                    <TableRow className="bg-muted/30 dark:bg-muted/20">
                      <TableCell className="font-bold sticky left-0 bg-muted/50 z-10 border-r border-border/50">Non-Current Assets</TableCell>
                      {sheets.map((sheet) => (
                        <EditableCell
                          key={`${sheet.id}-nonCurrentAssets`}
                          value={sheet.nonCurrentAssets}
                          itemId={sheet.id}
                          field="nonCurrentAssets"
                          reportType="bs"
                          isEditable={JSON.parse(sheet.isEditable || '{}').nonCurrentAssets}
                          className="font-bold"
                        />
                      ))}
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium sticky left-0 bg-muted/50 z-10 border-r border-border/50 pl-6">Property, Plant & Equipment</TableCell>
                      {sheets.map((sheet) => (
                        <EditableCell
                          key={`${sheet.id}-propertyPlantEquipment`}
                          value={sheet.propertyPlantEquipment}
                          itemId={sheet.id}
                          field="propertyPlantEquipment"
                          reportType="bs"
                          isEditable={JSON.parse(sheet.isEditable || '{}').propertyPlantEquipment}
                        />
                      ))}
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium sticky left-0 bg-muted/50 z-10 border-r border-border/50 pl-6">Intangible Assets</TableCell>
                      {sheets.map((sheet) => (
                        <EditableCell
                          key={`${sheet.id}-intangibleAssets`}
                          value={sheet.intangibleAssets}
                          itemId={sheet.id}
                          field="intangibleAssets"
                          reportType="bs"
                          isEditable={JSON.parse(sheet.isEditable || '{}').intangibleAssets}
                        />
                      ))}
                    </TableRow>
                    <TableRow className="border-t-2 bg-muted/30 dark:bg-muted/20">
                      <TableCell className="font-bold sticky left-0 bg-muted/50 z-10 border-r border-border/50">Total Assets</TableCell>
                      {sheets.map((sheet) => (
                        <EditableCell
                          key={`${sheet.id}-totalAssets`}
                          value={sheet.totalAssets}
                          itemId={sheet.id}
                          field="totalAssets"
                          reportType="bs"
                          isEditable={JSON.parse(sheet.isEditable || '{}').totalAssets}
                          className="font-bold"
                        />
                      ))}
                    </TableRow>
                    
                    {/* Liabilities Section */}
                    <TableRow className="bg-muted/30 dark:bg-muted/20">
                      <TableCell className="font-bold sticky left-0 bg-muted/50 z-10 border-r border-border/50">Current Liabilities</TableCell>
                      {sheets.map((sheet) => (
                        <EditableCell
                          key={`${sheet.id}-currentLiabilities`}
                          value={sheet.currentLiabilities}
                          itemId={sheet.id}
                          field="currentLiabilities"
                          reportType="bs"
                          isEditable={JSON.parse(sheet.isEditable || '{}').currentLiabilities}
                          className="font-bold"
                        />
                      ))}
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium sticky left-0 bg-muted/50 z-10 border-r border-border/50 pl-6">Accounts Payable</TableCell>
                      {sheets.map((sheet) => (
                        <EditableCell
                          key={`${sheet.id}-accountsPayable`}
                          value={sheet.accountsPayable}
                          itemId={sheet.id}
                          field="accountsPayable"
                          reportType="bs"
                          isEditable={JSON.parse(sheet.isEditable || '{}').accountsPayable}
                        />
                      ))}
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium sticky left-0 bg-muted/50 z-10 border-r border-border/50 pl-6">Short-term Liabilities</TableCell>
                      {sheets.map((sheet) => (
                        <EditableCell
                          key={`${sheet.id}-shortTermDebt`}
                          value={sheet.shortTermDebt}
                          itemId={sheet.id}
                          field="shortTermDebt"
                          reportType="bs"
                          isEditable={JSON.parse(sheet.isEditable || '{}').shortTermDebt}
                        />
                      ))}
                    </TableRow>
                    <TableRow className="bg-muted/30 dark:bg-muted/20">
                      <TableCell className="font-bold sticky left-0 bg-muted/50 z-10 border-r border-border/50">Long-term Liabilities</TableCell>
                      {sheets.map((sheet) => (
                        <EditableCell
                          key={`${sheet.id}-longTermLiabilities`}
                          value={sheet.longTermLiabilities}
                          itemId={sheet.id}
                          field="longTermLiabilities"
                          reportType="bs"
                          isEditable={JSON.parse(sheet.isEditable || '{}').longTermLiabilities}
                          className="font-bold"
                        />
                      ))}
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium sticky left-0 bg-muted/50 z-10 border-r border-border/50 pl-6">Long-term Debt</TableCell>
                      {sheets.map((sheet) => (
                        <EditableCell
                          key={`${sheet.id}-longTermDebt`}
                          value={sheet.longTermDebt}
                          itemId={sheet.id}
                          field="longTermDebt"
                          reportType="bs"
                          isEditable={JSON.parse(sheet.isEditable || '{}').longTermDebt}
                        />
                      ))}
                    </TableRow>
                    <TableRow className="border-t-2 bg-muted/30 dark:bg-muted/20">
                      <TableCell className="font-bold sticky left-0 bg-muted/50 z-10 border-r border-border/50">Total Liabilities</TableCell>
                      {sheets.map((sheet) => (
                        <EditableCell
                          key={`${sheet.id}-totalLiabilities`}
                          value={sheet.totalLiabilities}
                          itemId={sheet.id}
                          field="totalLiabilities"
                          reportType="bs"
                          isEditable={JSON.parse(sheet.isEditable || '{}').totalLiabilities}
                          className="font-bold"
                        />
                      ))}
                    </TableRow>
                    
                    {/* Equity Section */}
                    <TableRow className="bg-muted/30 dark:bg-muted/20">
                      <TableCell className="font-bold sticky left-0 bg-muted/50 z-10 border-r border-border/50">Shareholders' Equity</TableCell>
                      {sheets.map((sheet) => (
                        <EditableCell
                          key={`${sheet.id}-shareholdersEquity`}
                          value={sheet.shareholdersEquity}
                          itemId={sheet.id}
                          field="shareholdersEquity"
                          reportType="bs"
                          isEditable={JSON.parse(sheet.isEditable || '{}').shareholdersEquity}
                          className="font-bold"
                        />
                      ))}
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium sticky left-0 bg-muted/50 z-10 border-r border-border/50 pl-6">Retained Earnings</TableCell>
                      {sheets.map((sheet) => (
                        <EditableCell
                          key={`${sheet.id}-retainedEarnings`}
                          value={sheet.retainedEarnings}
                          itemId={sheet.id}
                          field="retainedEarnings"
                          reportType="bs"
                          isEditable={JSON.parse(sheet.isEditable || '{}').retainedEarnings}
                        />
                      ))}
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  // Cash Flow Table Component - Comparative View
  const CashFlowTable = () => {
    if (cfLoading) {
      return (
        <div className="p-12 text-center" data-testid="loading-cf">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="text-lg font-medium text-muted-foreground">Loading data...</span>
          </div>
          <p className="text-sm text-muted-foreground">Please wait</p>
        </div>
      );
    }

    if (cashFlowStatements.length === 0) {
      return <div className="p-8 text-center text-muted-foreground">No cash flow data available</div>;
    }

    // Group statements by topic and sort periods
    const groupedStatements = cashFlowStatements.reduce((acc, statement) => {
      if (!acc[statement.topic]) acc[statement.topic] = [];
      acc[statement.topic].push(statement);
      return acc;
    }, {} as Record<string, CashFlowStatement[]>);

    // Sort periods for each topic
    Object.keys(groupedStatements).forEach(topic => {
      groupedStatements[topic].sort((a, b) => a.period.localeCompare(b.period));
    });

    return (
      <div className="space-y-6">
        {Object.entries(groupedStatements).map(([topic, statements]) => (
          <Card key={topic} className="bg-card/95 backdrop-blur-sm border border-border/50 shadow-lg hover-elevate transition-all duration-300" data-testid={`cf-comparative-${topic}`}>
            <CardHeader className="bg-muted/50 border-b border-border/50">
              <CardTitle className="flex items-center gap-3 text-xl font-bold">
                <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <span className="text-foreground">Cash Flow Statement</span>
                  <div className="text-sm font-normal text-muted-foreground">{topic}</div>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table className="min-w-full border-separate border-spacing-0 rounded-xl overflow-hidden">
                  <TableHeader>
                    <TableRow className="bg-muted/50 border-b border-border/50">
                      <TableHead className="sticky left-0 bg-muted/50 z-10 min-w-[200px] border-r border-border/50 font-bold text-foreground p-4">Line Item</TableHead>
                      {statements.map((statement) => (
                        <TableHead key={statement.period} className="text-right min-w-[120px] font-semibold text-foreground p-4" data-testid={`header-${statement.period}`}>
                          {statement.period}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                <TableBody>
                  <TableRow className="bg-muted/30 dark:bg-muted/20">
                    <TableCell className="font-bold sticky left-0 bg-muted/50 z-10 border-r border-border/50">Operating Cash Flow</TableCell>
                    {statements.map((statement) => (
                      <EditableCell
                        key={`${statement.id}-operatingCashFlow`}
                        value={statement.operatingCashFlow}
                        itemId={statement.id}
                        field="operatingCashFlow"
                        reportType="cf"
                        isEditable={JSON.parse(statement.isEditable || '{}').operatingCashFlow}
                        className="font-bold"
                      />
                    ))}
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium sticky left-0 bg-muted/50 z-10 border-r border-border/50 pl-8">Net Income</TableCell>
                    {statements.map((statement) => (
                      <EditableCell
                        key={`${statement.id}-netIncome`}
                        value={statement.netIncome}
                        itemId={statement.id}
                        field="netIncome"
                        reportType="cf"
                        isEditable={JSON.parse(statement.isEditable || '{}').netIncome}
                      />
                    ))}
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium sticky left-0 bg-muted/50 z-10 border-r border-border/50 pl-8">Depreciation</TableCell>
                    {statements.map((statement) => (
                      <EditableCell
                        key={`${statement.id}-depreciation`}
                        value={statement.depreciation}
                        itemId={statement.id}
                        field="depreciation"
                        reportType="cf"
                        isEditable={JSON.parse(statement.isEditable || '{}').depreciation}
                      />
                    ))}
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium sticky left-0 bg-muted/50 z-10 border-r border-border/50 pl-8">Changes in Working Capital</TableCell>
                    {statements.map((statement) => (
                      <EditableCell
                        key={`${statement.id}-changeInWorkingCapital`}
                        value={statement.changeInWorkingCapital}
                        itemId={statement.id}
                        field="changeInWorkingCapital"
                        reportType="cf"
                        isEditable={JSON.parse(statement.isEditable || '{}').changeInWorkingCapital}
                      />
                    ))}
                  </TableRow>
                  <TableRow className="bg-muted/30 dark:bg-muted/20">
                    <TableCell className="font-bold sticky left-0 bg-muted/50 z-10 border-r border-border/50">Investing Cash Flow</TableCell>
                    {statements.map((statement) => (
                      <EditableCell
                        key={`${statement.id}-investingCashFlow`}
                        value={statement.investingCashFlow}
                        itemId={statement.id}
                        field="investingCashFlow"
                        reportType="cf"
                        isEditable={JSON.parse(statement.isEditable || '{}').investingCashFlow}
                        className="font-bold"
                      />
                    ))}
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium sticky left-0 bg-muted/50 z-10 border-r border-border/50 pl-8">Capital Expenditures</TableCell>
                    {statements.map((statement) => (
                      <EditableCell
                        key={`${statement.id}-capitalExpenditures`}
                        value={statement.capitalExpenditures}
                        itemId={statement.id}
                        field="capitalExpenditures"
                        reportType="cf"
                        isEditable={JSON.parse(statement.isEditable || '{}').capitalExpenditures}
                      />
                    ))}
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium sticky left-0 bg-muted/50 z-10 border-r border-border/50 pl-8">Business Acquisitions</TableCell>
                    {statements.map((statement) => (
                      <EditableCell
                        key={`${statement.id}-acquisitions`}
                        value={statement.acquisitions}
                        itemId={statement.id}
                        field="acquisitions"
                        reportType="cf"
                        isEditable={JSON.parse(statement.isEditable || '{}').acquisitions}
                      />
                    ))}
                  </TableRow>
                  <TableRow className="bg-muted/30 dark:bg-muted/20">
                    <TableCell className="font-bold sticky left-0 bg-muted/50 z-10 border-r border-border/50">Financing Cash Flow</TableCell>
                    {statements.map((statement) => (
                      <EditableCell
                        key={`${statement.id}-financingCashFlow`}
                        value={statement.financingCashFlow}
                        itemId={statement.id}
                        field="financingCashFlow"
                        reportType="cf"
                        isEditable={JSON.parse(statement.isEditable || '{}').financingCashFlow}
                        className="font-bold"
                      />
                    ))}
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium sticky left-0 bg-muted/50 z-10 border-r border-border/50 pl-8">Loan Proceeds</TableCell>
                    {statements.map((statement) => (
                      <EditableCell
                        key={`${statement.id}-debtIssuance`}
                        value={statement.debtIssuance}
                        itemId={statement.id}
                        field="debtIssuance"
                        reportType="cf"
                        isEditable={JSON.parse(statement.isEditable || '{}').debtIssuance}
                      />
                    ))}
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium sticky left-0 bg-muted/50 z-10 border-r border-border/50 pl-8">Debt Repayments</TableCell>
                    {statements.map((statement) => (
                      <EditableCell
                        key={`${statement.id}-debtRepayment`}
                        value={statement.debtRepayment}
                        itemId={statement.id}
                        field="debtRepayment"
                        reportType="cf"
                        isEditable={JSON.parse(statement.isEditable || '{}').debtRepayment}
                      />
                    ))}
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium sticky left-0 bg-muted/50 z-10 border-r border-border/50 pl-8">Dividends Paid</TableCell>
                    {statements.map((statement) => (
                      <EditableCell
                        key={`${statement.id}-dividendsPaid`}
                        value={statement.dividendsPaid}
                        itemId={statement.id}
                        field="dividendsPaid"
                        reportType="cf"
                        isEditable={JSON.parse(statement.isEditable || '{}').dividendsPaid}
                      />
                    ))}
                  </TableRow>
                  <TableRow className="border-t-2 bg-muted/30 dark:bg-muted/20">
                    <TableCell className="font-bold text-lg sticky left-0 bg-muted/50 z-10 border-r border-border/50">Net Change in Cash</TableCell>
                    {statements.map((statement) => (
                      <EditableCell
                        key={`${statement.id}-netChangeInCash`}
                        value={statement.netChangeInCash}
                        itemId={statement.id}
                        field="netChangeInCash"
                        reportType="cf"
                        isEditable={JSON.parse(statement.isEditable || '{}').netChangeInCash}
                        className="font-bold text-lg"
                      />
                    ))}
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium sticky left-0 bg-muted/50 z-10 border-r border-border/50">Beginning Cash Balance</TableCell>
                    {statements.map((statement) => (
                      <EditableCell
                        key={`${statement.id}-beginningCashBalance`}
                        value={statement.beginningCashBalance}
                        itemId={statement.id}
                        field="beginningCashBalance"
                        reportType="cf"
                        isEditable={JSON.parse(statement.isEditable || '{}').beginningCashBalance}
                      />
                    ))}
                  </TableRow>
                  <TableRow className="border-t-2 bg-muted/30 dark:bg-muted/20">
                    <TableCell className="font-bold text-lg sticky left-0 bg-muted/50 z-10 border-r border-border/50">Ending Cash Balance</TableCell>
                    {statements.map((statement) => (
                      <EditableCell
                        key={`${statement.id}-endingCashBalance`}
                        value={statement.endingCashBalance}
                        itemId={statement.id}
                        field="endingCashBalance"
                        reportType="cf"
                        isEditable={JSON.parse(statement.isEditable || '{}').endingCashBalance}
                        className="font-bold text-lg"
                      />
                    ))}
                  </TableRow>
                </TableBody>
              </Table>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroBackground})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background/60 to-background/80" />
      
      <div className="relative z-10">
        <Navigation />
        
        {/* Hero Section */}
        <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="text-center space-y-6">
            <h1 className="text-4xl md:text-5xl font-black text-foreground mb-4" data-testid="page-title">
              Financial Reports
              <span className="bg-gradient-to-r from-chart-1 to-chart-2 bg-clip-text text-transparent"> Suite</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed" data-testid="page-description">
              View and edit financial reports including Profit & Loss statements, Balance Sheets, and Cash Flow statements with real-time intelligent analysis
            </p>
            <div className="flex justify-center gap-4 text-sm text-muted-foreground">
              <Badge variant="outline" className="px-4 py-2">
                <strong className="text-foreground">Live Data</strong> Updated
              </Badge>
              <Badge variant="outline" className="px-4 py-2">
                <strong className="text-foreground">AI-Powered</strong> Analysis
              </Badge>
              <Badge variant="outline" className="px-4 py-2">
                <strong className="text-foreground">Real-time</strong> Editable
              </Badge>
            </div>
          </div>
        </div>
      </section>

      <main className="container mx-auto px-6 py-12">
        <div className="max-w-7xl mx-auto space-y-8">

          {/* Enhanced Filters Section */}
          <Card className="bg-card/95 backdrop-blur-sm border border-border/50 shadow-lg hover-elevate transition-all duration-300 mb-8">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Filter className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-lg font-semibold">Data Filters</CardTitle>
                  <p className="text-sm text-muted-foreground">Select the data you want to view</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Topic</label>
                  <Select value={selectedTopic} onValueChange={setSelectedTopic}>
                    <SelectTrigger className="w-full bg-background/80 border-muted focus:border-primary transition-colors" data-testid="select-topic">
                      <SelectValue placeholder="Select topic" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all" data-testid="option-all-topics">All Topics</SelectItem>
                      {uniqueTopics.map((topic) => (
                        <SelectItem key={topic} value={topic} data-testid={`option-topic-${topic}`}>
                          {topic}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Start Period</label>
                  <Select value={startPeriod} onValueChange={handleStartPeriodChange}>
                    <SelectTrigger className="w-full bg-background/80 border-muted focus:border-primary transition-colors" data-testid="select-start-period">
                      <SelectValue placeholder="Select start period" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none" data-testid="option-no-start">Not specified</SelectItem>
                      {uniquePeriods.map((period) => (
                        <SelectItem key={period} value={period} data-testid={`option-start-${period}`}>
                          {period}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">End Period</label>
                  <Select value={endPeriod} onValueChange={handleEndPeriodChange}>
                    <SelectTrigger className="w-full bg-background/80 border-muted focus:border-primary transition-colors" data-testid="select-end-period">
                      <SelectValue placeholder="Select end period" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none" data-testid="option-no-end">Not specified</SelectItem>
                      {uniquePeriods.map((period) => (
                        <SelectItem key={period} value={period} data-testid={`option-end-${period}`}>
                          {period}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Actions</label>
                  {(selectedTopic && selectedTopic !== "all" || (startPeriod && startPeriod !== "none") || (endPeriod && endPeriod !== "none")) ? (
                    <Button
                      variant="outline"
                      className="w-full border-muted-foreground/20 hover:border-primary hover:bg-primary/5 transition-all duration-200"
                      onClick={() => {
                        setSelectedTopic("all");
                        setStartPeriod("none");
                        setEndPeriod("none");
                      }}
                      data-testid="button-clear-filters"
                    >
                      Clear Filters
                    </Button>
                  ) : (
                    <div className="h-10 flex items-center">
                      <p className="text-sm text-muted-foreground">Use filters to search</p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Financial Metrics Dashboard */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
            <Card className="bg-card/95 backdrop-blur-sm border border-border/50 shadow-lg hover-elevate transition-all duration-300" data-testid="metric-revenue">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                    <p className="text-2xl font-bold text-foreground">${formatNumber(financialMetrics.currentRevenue)}</p>
                    {financialMetrics.hasPreviousPL && (
                      <div className="flex items-center mt-1">
                        {financialMetrics.revenueChange >= 0 ? (
                          <ArrowUpRight className="h-4 w-4 text-green-600" />
                        ) : (
                          <ArrowDownRight className="h-4 w-4 text-red-600" />
                        )}
                        <span className={`text-sm ${financialMetrics.revenueChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {Math.abs(financialMetrics.revenueChange).toFixed(1)}%
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="p-3 rounded-full bg-green-100 dark:bg-green-900/20">
                    <DollarSign className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/95 backdrop-blur-sm border border-border/50 shadow-lg hover-elevate transition-all duration-300" data-testid="metric-expenses">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Expenses</p>
                    <p className="text-2xl font-bold text-foreground">${formatNumber(financialMetrics.currentExpenses)}</p>
                    {financialMetrics.hasPreviousPL && (
                      <div className="flex items-center mt-1">
                        {financialMetrics.expenseChange <= 0 ? (
                          <ArrowDownRight className="h-4 w-4 text-green-600" />
                        ) : (
                          <ArrowUpRight className="h-4 w-4 text-red-600" />
                        )}
                        <span className={`text-sm ${financialMetrics.expenseChange <= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {Math.abs(financialMetrics.expenseChange).toFixed(1)}%
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="p-3 rounded-full bg-red-100 dark:bg-red-900/20">
                    <TrendingUp className="h-6 w-6 text-red-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/95 backdrop-blur-sm border border-border/50 shadow-lg hover-elevate transition-all duration-300" data-testid="metric-net-income">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Net Income</p>
                    <p className="text-2xl font-bold text-foreground">${formatNumber(financialMetrics.currentNetIncome)}</p>
                    {financialMetrics.hasPreviousPL && (
                      <div className="flex items-center mt-1">
                        {financialMetrics.netIncomeChange >= 0 ? (
                          <ArrowUpRight className="h-4 w-4 text-green-600" />
                        ) : (
                          <ArrowDownRight className="h-4 w-4 text-red-600" />
                        )}
                        <span className={`text-sm ${financialMetrics.netIncomeChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {Math.abs(financialMetrics.netIncomeChange).toFixed(1)}%
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/20">
                    <Calculator className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/95 backdrop-blur-sm border border-border/50 shadow-lg hover-elevate transition-all duration-300" data-testid="metric-assets">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Assets</p>
                    <p className="text-2xl font-bold text-foreground">${formatNumber(financialMetrics.currentTotalAssets)}</p>
                    {financialMetrics.hasPreviousBS && (
                      <div className="flex items-center mt-1">
                        {financialMetrics.assetsChange >= 0 ? (
                          <ArrowUpRight className="h-4 w-4 text-green-600" />
                        ) : (
                          <ArrowDownRight className="h-4 w-4 text-red-600" />
                        )}
                        <span className={`text-sm ${financialMetrics.assetsChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {Math.abs(financialMetrics.assetsChange).toFixed(1)}%
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900/20">
                    <BarChart3 className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/95 backdrop-blur-sm border border-border/50 shadow-lg hover-elevate transition-all duration-300" data-testid="metric-working-capital">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Working Capital</p>
                    <p className="text-2xl font-bold text-foreground">${formatNumber(financialMetrics.workingCapital)}</p>
                    {financialMetrics.hasPreviousBS && (
                      <div className="flex items-center mt-1">
                        {financialMetrics.workingCapitalChange >= 0 ? (
                          <ArrowUpRight className="h-4 w-4 text-green-600" />
                        ) : (
                          <ArrowDownRight className="h-4 w-4 text-red-600" />
                        )}
                        <span className={`text-sm ${financialMetrics.workingCapitalChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {Math.abs(financialMetrics.workingCapitalChange).toFixed(1)}%
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="p-3 rounded-full bg-orange-100 dark:bg-orange-900/20">
                    <PieChart className="h-6 w-6 text-orange-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/95 backdrop-blur-sm border border-border/50 shadow-lg hover-elevate transition-all duration-300" data-testid="metric-cash-flow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Operating Cash Flow</p>
                    <p className="text-2xl font-bold text-foreground">${formatNumber(financialMetrics.operatingCashFlow)}</p>
                    {financialMetrics.hasPreviousCF && (
                      <div className="flex items-center mt-1">
                        {financialMetrics.operatingCashFlowChange >= 0 ? (
                          <ArrowUpRight className="h-4 w-4 text-green-600" />
                        ) : (
                          <ArrowDownRight className="h-4 w-4 text-red-600" />
                        )}
                        <span className={`text-sm ${financialMetrics.operatingCashFlowChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {Math.abs(financialMetrics.operatingCashFlowChange).toFixed(1)}%
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="p-3 rounded-full bg-teal-100 dark:bg-teal-900/20">
                    <Activity className="h-6 w-6 text-teal-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Enhanced Financial Reports Tabs */}
          <div className="bg-gradient-to-r from-background/50 to-muted/30 rounded-2xl p-6 backdrop-blur-sm border border-border/50">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-foreground flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                Financial Reports
              </h2>
              <p className="text-muted-foreground mt-2">Select the type of report you want to view</p>
            </div>
            
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
              <TabsList className="grid w-full grid-cols-3 p-1 bg-muted/50 backdrop-blur-sm rounded-xl border border-border/30 shadow-lg" data-testid="tabs-list">
                <TabsTrigger 
                  value="pl" 
                  className="flex items-center gap-3 px-6 py-4 text-sm font-medium rounded-lg transition-all duration-300 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg hover:bg-muted-foreground/10" 
                  data-testid="tab-pl"
                >
                  <Calculator className="h-5 w-5" />
                  <span className="hidden sm:inline">Profit & Loss</span>
                  <span className="sm:hidden">P&L</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="bs" 
                  className="flex items-center gap-3 px-6 py-4 text-sm font-medium rounded-lg transition-all duration-300 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg hover:bg-muted-foreground/10" 
                  data-testid="tab-bs"
                >
                  <BarChart3 className="h-5 w-5" />
                  <span className="hidden sm:inline">Balance Sheet</span>
                  <span className="sm:hidden">BS</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="cf" 
                  className="flex items-center gap-3 px-6 py-4 text-sm font-medium rounded-lg transition-all duration-300 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg hover:bg-muted-foreground/10" 
                  data-testid="tab-cf"
                >
                  <TrendingUp className="h-5 w-5" />
                  <span className="hidden sm:inline">Cash Flow</span>
                  <span className="sm:hidden">CF</span>
                </TabsTrigger>
              </TabsList>

            <TabsContent value="pl" data-testid="tab-content-pl">
              <ProfitLossTable />
            </TabsContent>

            <TabsContent value="bs" data-testid="tab-content-bs">
              <BalanceSheetTable />
            </TabsContent>

            <TabsContent value="cf" data-testid="tab-content-cf">
              <CashFlowTable />
            </TabsContent>
          </Tabs>
        </div>
        </div>
      </main>
      </div>
    </div>
  );
}