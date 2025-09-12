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
  ArrowDownRight,
  Download,
  FileDown,
  Printer,
  ChevronDown,
  ChevronRight,
  Plus,
  Minus
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

// Clean constants - no object literals in JSX
const REVENUE_FIELDS = ["totalRevenue"];
const COGS_FIELDS = ["costOfGoodsSold"];
const OPERATING_EXPENSE_FIELDS = ["operatingExpenses"];
const OTHER_INCOME_FIELDS = ["otherIncome"];
const OTHER_EXPENSE_FIELDS = ["otherExpenses"];
const TAX_EXPENSE_FIELDS = ["taxExpense"];

const CURRENT_ASSET_FIELDS = ["cash", "accountsReceivable", "inventory"];
const NON_CURRENT_ASSET_FIELDS = ["propertyPlantEquipment", "intangibleAssets"];
const CURRENT_LIABILITY_FIELDS = ["accountsPayable", "shortTermDebt"];
const LONG_TERM_LIABILITY_FIELDS = ["longTermDebt"];

const OPERATING_CASH_FIELDS = ["netIncome", "depreciation", "changeInWorkingCapital"];
const INVESTING_CASH_FIELDS = ["capitalExpenditures", "acquisitions"];
const FINANCING_CASH_FIELDS = ["debtIssuance", "debtRepayment", "dividendsPaid"];

export default function FinancialReportsClean() {
  const [selectedTopic, setSelectedTopic] = useState<string>("all");
  const [startPeriod, setStartPeriod] = useState<string>("none");
  const [endPeriod, setEndPeriod] = useState<string>("none");
  const [activeTab, setActiveTab] = useState<string>("pl");
  const [editingCells, setEditingCells] = useState<Record<string, any>>({});
  const queryClient = useQueryClient();
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // Check if any filters are applied
  const hasFiltersApplied = useMemo(() => {
    return selectedTopic !== "all" || startPeriod !== "none" || endPeriod !== "none";
  }, [selectedTopic, startPeriod, endPeriod]);

  // Smart defaults - key sections that should be collapsed (true means collapsed)
  const defaultCollapsedSections: Record<string, boolean> = {
    'pl-income': true, // Revenue section collapsed by default
    'pl-operatingExpenses': true, // Expenses collapsed
    'pl-netIncome': false, // Net Income expanded by default
    'bs-assets': false, // Assets expanded
    'bs-liabilities': true, // Liabilities collapsed
    'bs-equity': false, // Equity expanded
    'cf-operating': false, // Operating activities expanded
    'cf-investing': true, // Investing collapsed
    'cf-financing': true // Financing collapsed
  };

  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>(() => defaultCollapsedSections);
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

  // Helper function to extract unique company names from current data
  const getUniqueCompanyNames = useMemo(() => {
    const allData = [...plStatements, ...balanceSheets, ...cashFlowStatements];
    const companyNames = Array.from(new Set(allData.map(item => item.topic)));
    return companyNames;
  }, [plStatements, balanceSheets, cashFlowStatements]);

  // Get unique topics and periods for filtering
  const uniqueTopics = useMemo(() => {
    const allData = [...plStatements, ...balanceSheets, ...cashFlowStatements];
    return Array.from(new Set(allData.map(item => item.topic)));
  }, [plStatements, balanceSheets, cashFlowStatements]);

  const uniquePeriods = useMemo(() => {
    const allData = [...plStatements, ...balanceSheets, ...cashFlowStatements];
    const periods = Array.from(new Set(allData.map(item => item.period)));
    return periods.sort((a, b) => {
      if (a === 'none') return 1;
      if (b === 'none') return -1;
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

  // Helper functions for collapsible sections
  const toggleSection = (sectionKey: string) => {
    setCollapsedSections(prev => ({
      ...prev,
      [sectionKey]: !prev[sectionKey]
    }));
  };

  const isCollapsed = (sectionKey: string) => {
    // Use smart defaults if section hasn't been explicitly set
    return collapsedSections[sectionKey] ?? defaultCollapsedSections[sectionKey] ?? true;
  };

  // Helper function to calculate section totals
  const calculateSectionTotals = (statements: any[], fields: string[]) => {
    return statements.map(statement => {
      const total = fields.reduce((sum, field) => {
        return sum + safeParseFloat(statement[field]);
      }, 0);
      return total;
    });
  };

  // Export helper functions
  const exportToCSV = (data: any[], fileName: string, reportType: string) => {
    try {
      let csvContent = '';
      
      if (reportType === 'pl') {
        csvContent = 'Topic,Period,Total Revenue,Cost of Goods Sold,Gross Profit,Operating Expenses,Operating Income,Other Income,Other Expenses,Net Income Before Tax,Tax Expense,Net Income\n';
        data.forEach(item => {
          csvContent += `"${item.topic}","${item.period}","${item.totalRevenue}","${item.costOfGoodsSold}","${item.grossProfit}","${item.operatingExpenses}","${item.operatingIncome}","${item.otherIncome}","${item.otherExpenses}","${item.netIncomeBeforeTax}","${item.taxExpense}","${item.netIncome}"\n`;
        });
      } else if (reportType === 'bs') {
        csvContent = 'Topic,Period,Current Assets,Cash,Accounts Receivable,Inventory,Non-Current Assets,Property Plant Equipment,Intangible Assets,Total Assets,Current Liabilities,Accounts Payable,Short Term Debt,Long Term Liabilities,Long Term Debt,Total Liabilities,Shareholders Equity,Retained Earnings\n';
        data.forEach(item => {
          csvContent += `"${item.topic}","${item.period}","${item.currentAssets}","${item.cash}","${item.accountsReceivable}","${item.inventory}","${item.nonCurrentAssets}","${item.propertyPlantEquipment}","${item.intangibleAssets}","${item.totalAssets}","${item.currentLiabilities}","${item.accountsPayable}","${item.shortTermDebt}","${item.longTermLiabilities}","${item.longTermDebt}","${item.totalLiabilities}","${item.shareholdersEquity}","${item.retainedEarnings}"\n`;
        });
      } else if (reportType === 'cf') {
        csvContent = 'Topic,Period,Operating Cash Flow,Net Income,Depreciation,Change in Working Capital,Investing Cash Flow,Capital Expenditures,Acquisitions,Financing Cash Flow,Debt Issuance,Debt Repayment,Dividends Paid,Net Change in Cash,Beginning Cash Balance,Ending Cash Balance\n';
        data.forEach(item => {
          csvContent += `"${item.topic}","${item.period}","${item.operatingCashFlow}","${item.netIncome}","${item.depreciation}","${item.changeInWorkingCapital}","${item.investingCashFlow}","${item.capitalExpenditures}","${item.acquisitions}","${item.financingCashFlow}","${item.debtIssuance}","${item.debtRepayment}","${item.dividendsPaid}","${item.netChangeInCash}","${item.beginningCashBalance}","${item.endingCashBalance}"\n`;
        });
      }

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', fileName);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({ description: `${fileName} exported successfully` });
    } catch (error) {
      console.error('Export error:', error);
      toast({ description: 'Export failed. Please try again.', variant: 'destructive' });
    }
  };

  const exportToPDF = (reportType: string) => {
    try {
      const activeTabElement = document.querySelector(`[data-testid="tab-content-${reportType}"]`);
      if (!activeTabElement) {
        toast({ description: 'No data to export', variant: 'destructive' });
        return;
      }

      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        toast({ description: 'Popup blocked. Please allow popups and try again.', variant: 'destructive' });
        return;
      }

      const reportTitle = reportType === 'pl' ? 'Profit & Loss Statement' : 
                         reportType === 'bs' ? 'Balance Sheet' : 'Cash Flow Statement';

      printWindow.document.write(`
        <html>
          <head>
            <title>${reportTitle}</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              h1 { color: #333; text-align: center; }
              table { width: 100%; border-collapse: collapse; margin: 20px 0; }
              th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
              th { background-color: #f2f2f2; font-weight: bold; }
              .number { text-align: right; }
              @media print {
                body { margin: 0; }
                .no-print { display: none; }
              }
            </style>
          </head>
          <body>
            <h1>${reportTitle}</h1>
            <div>${activeTabElement.innerHTML}</div>
            <script>
              window.onload = function() {
                const editButtons = document.querySelectorAll('button');
                editButtons.forEach(btn => btn.style.display = 'none');
                window.print();
                window.close();
              };
            </script>
          </body>
        </html>
      `);
      
      printWindow.document.close();
      
      toast({ description: `${reportTitle} PDF export initiated` });
    } catch (error) {
      console.error('PDF export error:', error);
      toast({ description: 'PDF export failed. Please try again.', variant: 'destructive' });
    }
  };

  // Calculate key financial metrics
  const financialMetrics = useMemo(() => {
    const plPeriods = plStatements.map(pl => pl.period).sort().reverse();
    const bsPeriods = balanceSheets.map(bs => bs.period).sort().reverse();
    const cfPeriods = cashFlowStatements.map(cf => cf.period).sort().reverse();
    
    const latestPLPeriod = plPeriods[0] || '';
    const previousPLPeriod = plPeriods[1] || '';
    const latestBSPeriod = bsPeriods[0] || '';
    const previousBSPeriod = bsPeriods[1] || '';
    const latestCFPeriod = cfPeriods[0] || '';
    const previousCFPeriod = cfPeriods[1] || '';
    
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
    
    const latestCF = cashFlowStatements.find(cf => cf.period === latestCFPeriod);
    const previousCF = cashFlowStatements.find(cf => cf.period === previousCFPeriod);
    
    const operatingCashFlow = latestCF ? safeParseFloat(latestCF.operatingCashFlow) : 0;
    const previousOperatingCashFlow = previousCF ? safeParseFloat(previousCF.operatingCashFlow) : 0;
    
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
    
    if (value.includes('.') && value.split('.')[1].length > 2) {
      return 'Maximum 2 decimal places allowed';
    }
    
    return null;
  };

  // Update mutations
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
    
    const validationError = validateNumericInput(newValue);
    if (validationError) {
      setValidationErrors(prev => ({ ...prev, [cellKey]: validationError }));
      toast({ 
        description: validationError, 
        variant: "destructive" 
      });
      return;
    }

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
      console.error('Save edit error:', error);
    }
  };

  const cancelEdit = (cellKey: string) => {
    setEditingCells(prev => {
      const newState = { ...prev };
      delete newState[cellKey];
      return newState;
    });
    
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
        <TableCell className={`text-right font-medium text-base py-4 px-6 ${className}`} data-testid={`cell-readonly-${field}`}>
          <span className="text-foreground">{formatNumber(value)}</span>
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

  // Clean CollapsibleTableSection Component - NO OBJECT LITERALS IN JSX
  interface CollapsibleSectionProps {
    title: string;
    sectionKey: string;
    children: React.ReactNode;
    statements: any[];
    className?: string;
    isSubSection?: boolean;
    showToggle?: boolean;
    prefix?: string;
    calculateTotal?: boolean;
    totalFields?: string[];
  }

  const CollapsibleTableSection = ({ 
    title, 
    sectionKey, 
    children, 
    statements,
    className = "",
    isSubSection = false,
    showToggle = true,
    prefix = "",
    calculateTotal = false,
    totalFields = []
  }: CollapsibleSectionProps) => {
    const namespacedKey = prefix ? `${prefix}-${sectionKey}` : sectionKey;
    const collapsed = isCollapsed(namespacedKey);
    const indentClass = isSubSection ? "pl-8" : "pl-6";
    
    // Calculate totals if needed - CLEAN: No object literals here
    const sectionTotals = calculateTotal && totalFields.length > 0 
      ? calculateSectionTotals(statements, totalFields)
      : [];
    
    return (
      <>
        <TableRow 
          className={`${className} ${collapsed ? 'border-b border-border/30' : ''}`}
        >
          <TableCell 
            className={`font-bold sticky left-0 bg-muted/60 z-10 border-r border-border/50 py-3 px-4 text-foreground ${indentClass}`}
            onClick={showToggle ? () => toggleSection(namespacedKey) : undefined}
            style={{ cursor: showToggle ? 'pointer' : 'default' }}
            data-testid={`section-${sectionKey}`}
            role={showToggle ? "button" : undefined}
            aria-expanded={showToggle ? !collapsed : undefined}
            aria-controls={showToggle ? `section-content-${namespacedKey}` : undefined}
          >
            <div className="flex items-center gap-2">
              {showToggle && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 hover:bg-muted/80"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleSection(namespacedKey);
                  }}
                  data-testid={`toggle-${sectionKey}`}
                  aria-label={`${collapsed ? 'Expand' : 'Collapse'} ${title} section`}
                >
                  {collapsed ? (
                    <Plus className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Minus className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              )}
              <span className={isSubSection ? "text-sm" : "text-base"}>{title}</span>
            </div>
          </TableCell>
          {statements.map((statement, index) => {
            const total = calculateTotal && totalFields.length > 0 ? sectionTotals[index] : 0;
            const displayValue = calculateTotal && totalFields.length > 0 
              ? (total === 0 ? "—" : formatNumber(total))
              : "—";

            return (
              <TableCell 
                key={`${statement.id}-${sectionKey}`}
                className="text-right font-medium bg-muted/40 py-3 px-6"
                data-testid={`total-${namespacedKey}-${statement.period}`}
              >
                <span className="text-foreground">{displayValue}</span>
              </TableCell>
            );
          })}
        </TableRow>
        {!collapsed && (
          <div id={`section-content-${namespacedKey}`}>
            {children}
          </div>
        )}
      </>
    );
  };

  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-no-repeat relative"
      style={{ backgroundImage: `url(${heroBackground})` }}
    >
      <div className="absolute inset-0 bg-white/90 dark:bg-slate-900/90"></div>
      <Navigation />
      
      <div className="relative z-10">
        
        <div className="container mx-auto px-6 py-8 mt-20">
          {/* Enhanced Header Section */}
          <div className="mb-8">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h1 className="text-4xl font-bold text-foreground mb-3 flex items-center gap-3" data-testid="title-financial-reports">
                  <BarChart3 className="h-10 w-10 text-primary" />
                  Financial Reports
                </h1>
                <p className="text-xl text-muted-foreground mb-4" data-testid="text-subtitle">
                  Comprehensive financial statements and analysis
                </p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Activity className="h-4 w-4" />
                  <span>Click on section headers to expand/collapse details</span>
                </div>
              </div>
            </div>
            
            {/* Quick Overview Summary */}
            {!plLoading && !bsLoading && !cfLoading && (plStatements.length > 0 || balanceSheets.length > 0 || cashFlowStatements.length > 0) && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {/* Revenue Overview */}
                {plStatements.length > 0 && (
                  <Card className="border-border/50 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 backdrop-blur-sm">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-green-100 dark:bg-green-900/50 rounded-lg">
                          <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Latest Revenue</p>
                          <p className="text-2xl font-bold text-foreground">
                            {plStatements[0]?.totalRevenue ? `${formatNumber(plStatements[0].totalRevenue)}` : '—'}
                          </p>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground">{plStatements[0]?.period || 'Latest Period'}</p>
                    </CardContent>
                  </Card>
                )}
                
                {/* Net Income Overview */}
                {plStatements.length > 0 && (
                  <Card className="border-border/50 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 backdrop-blur-sm">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
                          <DollarSign className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Net Income</p>
                          <p className="text-2xl font-bold text-foreground">
                            {plStatements[0]?.netIncome ? `${formatNumber(plStatements[0].netIncome)}` : '—'}
                          </p>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground">{plStatements[0]?.period || 'Latest Period'}</p>
                    </CardContent>
                  </Card>
                )}
                
                {/* Cash Balance Overview */}
                {balanceSheets.length > 0 && (
                  <Card className="border-border/50 bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-950/30 dark:to-violet-950/30 backdrop-blur-sm">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-purple-100 dark:bg-purple-900/50 rounded-lg">
                          <PieChart className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Cash Balance</p>
                          <p className="text-2xl font-bold text-foreground">
                            {balanceSheets[0]?.cash ? `${formatNumber(balanceSheets[0].cash)}` : '—'}
                          </p>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground">{balanceSheets[0]?.period || 'Latest Period'}</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </div>

          {/* Enhanced Filters Section */}
          <Card className="mb-8 border-primary/30 bg-gradient-to-r from-primary/5 to-secondary/5 shadow-lg" data-testid="card-filters">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground text-lg" data-testid="title-filters">
                <Filter className="h-5 w-5 text-primary" />
                Filter Reports
                <Badge variant="destructive" className="ml-2 text-xs">Required</Badge>
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-2">
                Please select at least one filter below to view financial statements. 
                Choose a company (topic), time period, or both to get started.
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label htmlFor="topic-select" className="text-sm font-medium text-foreground">
                    Topic
                  </label>
                  <Select value={selectedTopic} onValueChange={setSelectedTopic}>
                    <SelectTrigger id="topic-select" data-testid="select-topic">
                      <SelectValue placeholder="Select topic" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all" data-testid="option-topic-all">All Topics</SelectItem>
                      {uniqueTopics.map(topic => (
                        <SelectItem 
                          key={topic} 
                          value={topic} 
                          data-testid={`option-topic-${topic.replace(/\s+/g, '-').toLowerCase()}`}
                        >
                          {topic}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label htmlFor="start-period-select" className="text-sm font-medium text-foreground">
                    Start Period
                  </label>
                  <Select value={startPeriod} onValueChange={handleStartPeriodChange}>
                    <SelectTrigger id="start-period-select" data-testid="select-start-period">
                      <SelectValue placeholder="Start period" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none" data-testid="option-start-period-none">No start limit</SelectItem>
                      {uniquePeriods.map(period => (
                        <SelectItem 
                          key={period} 
                          value={period} 
                          data-testid={`option-start-period-${period}`}
                        >
                          {period}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label htmlFor="end-period-select" className="text-sm font-medium text-foreground">
                    End Period
                  </label>
                  <Select value={endPeriod} onValueChange={handleEndPeriodChange}>
                    <SelectTrigger id="end-period-select" data-testid="select-end-period">
                      <SelectValue placeholder="End period" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none" data-testid="option-end-period-none">No end limit</SelectItem>
                      {uniquePeriods.map(period => (
                        <SelectItem 
                          key={period} 
                          value={period} 
                          data-testid={`option-end-period-${period}`}
                        >
                          {period}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Financial Metrics Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
            {/* Revenue Metric */}
            <Card className="border-border/50 bg-card/90 backdrop-blur-sm" data-testid="metric-revenue">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Revenue</p>
                    <p className="text-lg font-semibold text-foreground" data-testid="value-revenue">
                      ${formatNumber(financialMetrics.currentRevenue)}
                    </p>
                    {financialMetrics.hasPreviousPL && (
                      <div className="flex items-center gap-1 mt-1">
                        {financialMetrics.revenueChange >= 0 ? (
                          <ArrowUpRight className="h-3 w-3 text-green-600" />
                        ) : (
                          <ArrowDownRight className="h-3 w-3 text-red-600" />
                        )}
                        <span 
                          className={`text-xs ${financialMetrics.revenueChange >= 0 ? 'text-green-600' : 'text-red-600'}`}
                          data-testid="change-revenue"
                        >
                          {financialMetrics.revenueChange.toFixed(1)}%
                        </span>
                      </div>
                    )}
                  </div>
                  <DollarSign className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            {/* Expenses Metric */}
            <Card className="border-border/50 bg-card/90 backdrop-blur-sm" data-testid="metric-expenses">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Expenses</p>
                    <p className="text-lg font-semibold text-foreground" data-testid="value-expenses">
                      ${formatNumber(financialMetrics.currentExpenses)}
                    </p>
                    {financialMetrics.hasPreviousPL && (
                      <div className="flex items-center gap-1 mt-1">
                        {financialMetrics.expenseChange >= 0 ? (
                          <ArrowUpRight className="h-3 w-3 text-red-600" />
                        ) : (
                          <ArrowDownRight className="h-3 w-3 text-green-600" />
                        )}
                        <span 
                          className={`text-xs ${financialMetrics.expenseChange >= 0 ? 'text-red-600' : 'text-green-600'}`}
                          data-testid="change-expenses"
                        >
                          {financialMetrics.expenseChange.toFixed(1)}%
                        </span>
                      </div>
                    )}
                  </div>
                  <TrendingUp className="h-8 w-8 text-red-600" />
                </div>
              </CardContent>
            </Card>

            {/* Net Income Metric */}
            <Card className="border-border/50 bg-card/90 backdrop-blur-sm" data-testid="metric-net-income">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Net Income</p>
                    <p className="text-lg font-semibold text-foreground" data-testid="value-net-income">
                      ${formatNumber(financialMetrics.currentNetIncome)}
                    </p>
                    {financialMetrics.hasPreviousPL && (
                      <div className="flex items-center gap-1 mt-1">
                        {financialMetrics.netIncomeChange >= 0 ? (
                          <ArrowUpRight className="h-3 w-3 text-green-600" />
                        ) : (
                          <ArrowDownRight className="h-3 w-3 text-red-600" />
                        )}
                        <span 
                          className={`text-xs ${financialMetrics.netIncomeChange >= 0 ? 'text-green-600' : 'text-red-600'}`}
                          data-testid="change-net-income"
                        >
                          {financialMetrics.netIncomeChange.toFixed(1)}%
                        </span>
                      </div>
                    )}
                  </div>
                  <BarChart3 className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            {/* Total Assets Metric */}
            <Card className="border-border/50 bg-card/90 backdrop-blur-sm" data-testid="metric-total-assets">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Assets</p>
                    <p className="text-lg font-semibold text-foreground" data-testid="value-total-assets">
                      ${formatNumber(financialMetrics.currentTotalAssets)}
                    </p>
                    {financialMetrics.hasPreviousBS && (
                      <div className="flex items-center gap-1 mt-1">
                        {financialMetrics.assetsChange >= 0 ? (
                          <ArrowUpRight className="h-3 w-3 text-green-600" />
                        ) : (
                          <ArrowDownRight className="h-3 w-3 text-red-600" />
                        )}
                        <span 
                          className={`text-xs ${financialMetrics.assetsChange >= 0 ? 'text-green-600' : 'text-red-600'}`}
                          data-testid="change-total-assets"
                        >
                          {financialMetrics.assetsChange.toFixed(1)}%
                        </span>
                      </div>
                    )}
                  </div>
                  <PieChart className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>

            {/* Working Capital Metric */}
            <Card className="border-border/50 bg-card/90 backdrop-blur-sm" data-testid="metric-working-capital">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Working Capital</p>
                    <p className="text-lg font-semibold text-foreground" data-testid="value-working-capital">
                      ${formatNumber(financialMetrics.workingCapital)}
                    </p>
                    {financialMetrics.hasPreviousBS && (
                      <div className="flex items-center gap-1 mt-1">
                        {financialMetrics.workingCapitalChange >= 0 ? (
                          <ArrowUpRight className="h-3 w-3 text-green-600" />
                        ) : (
                          <ArrowDownRight className="h-3 w-3 text-red-600" />
                        )}
                        <span 
                          className={`text-xs ${financialMetrics.workingCapitalChange >= 0 ? 'text-green-600' : 'text-red-600'}`}
                          data-testid="change-working-capital"
                        >
                          {financialMetrics.workingCapitalChange.toFixed(1)}%
                        </span>
                      </div>
                    )}
                  </div>
                  <Calculator className="h-8 w-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>

            {/* Operating Cash Flow Metric */}
            <Card className="border-border/50 bg-card/90 backdrop-blur-sm" data-testid="metric-operating-cash-flow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Operating Cash Flow</p>
                    <p className="text-lg font-semibold text-foreground" data-testid="value-operating-cash-flow">
                      ${formatNumber(financialMetrics.operatingCashFlow)}
                    </p>
                    {financialMetrics.hasPreviousCF && (
                      <div className="flex items-center gap-1 mt-1">
                        {financialMetrics.operatingCashFlowChange >= 0 ? (
                          <ArrowUpRight className="h-3 w-3 text-green-600" />
                        ) : (
                          <ArrowDownRight className="h-3 w-3 text-red-600" />
                        )}
                        <span 
                          className={`text-xs ${financialMetrics.operatingCashFlowChange >= 0 ? 'text-green-600' : 'text-red-600'}`}
                          data-testid="change-operating-cash-flow"
                        >
                          {financialMetrics.operatingCashFlowChange.toFixed(1)}%
                        </span>
                      </div>
                    )}
                  </div>
                  <Activity className="h-8 w-8 text-cyan-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Enhanced Main Reports Tabs */}
          <Card className="border-border/50 bg-card/95 backdrop-blur-sm shadow-lg" data-testid="card-main-reports">
            <CardHeader className="border-b border-border/50">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <CardTitle className="flex items-center gap-2 text-foreground text-xl" data-testid="title-reports">
                    <FileText className="h-5 w-5 text-primary" />
                    Financial Statements
                  </CardTitle>
                  {hasFiltersApplied && getUniqueCompanyNames.length > 0 && (
                    <div className="mt-2">
                      <p className="text-sm text-muted-foreground">Showing data for:</p>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {getUniqueCompanyNames.map((company, index) => (
                          <span 
                            key={company} 
                            className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-primary/10 text-primary"
                          >
                            {company}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mt-2">Detailed financial data organized by statement type</p>
                
                {/* Export Controls */}
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => exportToCSV(
                      activeTab === 'pl' ? plStatements : 
                      activeTab === 'bs' ? balanceSheets : cashFlowStatements,
                      `${activeTab === 'pl' ? 'Profit_Loss' : 
                        activeTab === 'bs' ? 'Balance_Sheet' : 'Cash_Flow'}_${new Date().toISOString().split('T')[0]}.csv`,
                      activeTab
                    )}
                    className="text-muted-foreground hover:text-foreground"
                    data-testid="button-export-csv"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export CSV
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => exportToPDF(activeTab)}
                    className="text-muted-foreground hover:text-foreground"
                    data-testid="button-export-pdf"
                  >
                    <FileDown className="h-4 w-4 mr-2" />
                    Export PDF
                  </Button>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="p-0">
              {!hasFiltersApplied ? (
                <div className="flex items-center justify-center py-16" data-testid="filter-required-message">
                  <div className="text-center max-w-md">
                    <Filter className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-foreground mb-2">Filters Required</h3>
                    <p className="text-muted-foreground mb-4">
                      Please apply at least one filter above to view financial statements. 
                      You can filter by company (topic), start period, or end period.
                    </p>
                    <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                      <span>👆</span>
                      <span>Use the filters above to get started</span>
                    </div>
                  </div>
                </div>
              ) : (
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <div className="border-b border-border/50">
                    <TabsList className="grid w-full grid-cols-3 bg-transparent h-auto p-1" data-testid="tabs-list">
                      <TabsTrigger 
                        value="pl" 
                        className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-6 py-3 font-medium"
                        data-testid="tab-profit-loss"
                      >
                        Profit & Loss
                      </TabsTrigger>
                      <TabsTrigger 
                        value="bs" 
                        className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-6 py-3 font-medium"
                        data-testid="tab-balance-sheet"
                      >
                        Balance Sheet
                      </TabsTrigger>
                      <TabsTrigger 
                        value="cf" 
                        className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-6 py-3 font-medium"
                        data-testid="tab-cash-flow"
                      >
                        Cash Flow
                      </TabsTrigger>
                    </TabsList>
                  </div>

                {/* Profit & Loss Tab */}
                <TabsContent value="pl" className="m-0" data-testid="tab-content-pl">
                  {plLoading ? (
                    <div className="flex items-center justify-center py-12" data-testid="loading-profit-loss">
                      <div className="text-center">
                        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent mx-auto mb-2" />
                        <p className="text-muted-foreground">Loading Profit & Loss statements...</p>
                      </div>
                    </div>
                  ) : plStatements.length === 0 ? (
                    <div className="flex items-center justify-center py-12" data-testid="empty-profit-loss">
                      <div className="text-center">
                        <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-lg font-medium text-foreground mb-2">No Profit & Loss Data</p>
                        <p className="text-muted-foreground">No statements found for the selected filters.</p>
                      </div>
                    </div>
                  ) : (
                    <div className="overflow-auto max-h-[800px]" data-testid="table-container-profit-loss">
                      <Table className="relative">
                        <TableHeader className="sticky top-0 z-20">
                          <TableRow className="bg-muted/80 border-border/50">
                            <TableHead className="sticky left-0 bg-muted/80 z-30 border-r border-border/50 font-bold text-foreground py-4 px-6 min-w-[200px]">
                              Account / Period
                            </TableHead>
                            {plStatements.map(statement => (
                              <TableHead 
                                key={statement.id} 
                                className="text-center font-bold text-foreground py-4 px-6 min-w-[150px] border-l border-border/50"
                                data-testid={`header-period-${statement.period}`}
                              >
                                <div className="text-sm font-bold bg-primary/10 rounded px-2 py-1">{statement.period}</div>
                              </TableHead>
                            ))}
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {/* Revenue Section */}
                          <CollapsibleTableSection
                            title="Revenue"
                            sectionKey="revenue"
                            statements={plStatements}
                            className="bg-blue-50/50 dark:bg-blue-950/20"
                            prefix="pl"
                            calculateTotal={true}
                            totalFields={REVENUE_FIELDS}
                          >
                            <TableRow className="hover:bg-muted/30 transition-colors">
                              <TableCell className="sticky left-0 bg-background/95 z-10 border-r border-border/50 py-3 px-4 pl-12 text-foreground">
                                Total Revenue
                              </TableCell>
                              {plStatements.map(statement => (
                                <EditableCell
                                  key={`${statement.id}-totalRevenue`}
                                  value={statement.totalRevenue}
                                  itemId={statement.id}
                                  field="totalRevenue"
                                  reportType="pl"
                                />
                              ))}
                            </TableRow>
                          </CollapsibleTableSection>

                          {/* Cost of Goods Sold Section */}
                          <CollapsibleTableSection
                            title="Cost of Goods Sold"
                            sectionKey="cogs"
                            statements={plStatements}
                            className="bg-red-50/50 dark:bg-red-950/20"
                            prefix="pl"
                            calculateTotal={true}
                            totalFields={COGS_FIELDS}
                          >
                            <TableRow className="hover:bg-muted/30 transition-colors">
                              <TableCell className="sticky left-0 bg-background/95 z-10 border-r border-border/50 py-3 px-4 pl-12 text-foreground">
                                Cost of Goods Sold
                              </TableCell>
                              {plStatements.map(statement => (
                                <EditableCell
                                  key={`${statement.id}-costOfGoodsSold`}
                                  value={statement.costOfGoodsSold}
                                  itemId={statement.id}
                                  field="costOfGoodsSold"
                                  reportType="pl"
                                />
                              ))}
                            </TableRow>
                          </CollapsibleTableSection>

                          {/* Gross Profit */}
                          <TableRow className="bg-green-50/50 dark:bg-green-950/20 border-t-2 border-green-300 dark:border-green-700">
                            <TableCell className="sticky left-0 bg-green-100/80 dark:bg-green-900/40 z-10 border-r border-border/50 font-bold py-4 px-6 text-foreground">
                              Gross Profit
                            </TableCell>
                            {plStatements.map(statement => (
                              <EditableCell
                                key={`${statement.id}-grossProfit`}
                                value={statement.grossProfit}
                                itemId={statement.id}
                                field="grossProfit"
                                reportType="pl"
                                isEditable={false}
                                className="bg-green-100/60 dark:bg-green-900/30"
                              />
                            ))}
                          </TableRow>

                          {/* Operating Expenses Section */}
                          <CollapsibleTableSection
                            title="Operating Expenses"
                            sectionKey="operatingExpenses"
                            statements={plStatements}
                            className="bg-orange-50/50 dark:bg-orange-950/20"
                            prefix="pl"
                            calculateTotal={true}
                            totalFields={OPERATING_EXPENSE_FIELDS}
                          >
                            <TableRow className="hover:bg-muted/30 transition-colors">
                              <TableCell className="sticky left-0 bg-background/95 z-10 border-r border-border/50 py-3 px-4 pl-12 text-foreground">
                                Operating Expenses
                              </TableCell>
                              {plStatements.map(statement => (
                                <EditableCell
                                  key={`${statement.id}-operatingExpenses`}
                                  value={statement.operatingExpenses}
                                  itemId={statement.id}
                                  field="operatingExpenses"
                                  reportType="pl"
                                />
                              ))}
                            </TableRow>
                          </CollapsibleTableSection>

                          {/* Operating Income */}
                          <TableRow className="bg-blue-50/50 dark:bg-blue-950/20 border-t-2 border-blue-300 dark:border-blue-700">
                            <TableCell className="sticky left-0 bg-blue-100/80 dark:bg-blue-900/40 z-10 border-r border-border/50 font-bold py-4 px-6 text-foreground">
                              Operating Income
                            </TableCell>
                            {plStatements.map(statement => (
                              <EditableCell
                                key={`${statement.id}-operatingIncome`}
                                value={statement.operatingIncome}
                                itemId={statement.id}
                                field="operatingIncome"
                                reportType="pl"
                                isEditable={false}
                                className="bg-blue-100/60 dark:bg-blue-900/30"
                              />
                            ))}
                          </TableRow>

                          {/* Other Income Section */}
                          <CollapsibleTableSection
                            title="Other Income"
                            sectionKey="otherIncome"
                            statements={plStatements}
                            className="bg-green-50/50 dark:bg-green-950/20"
                            prefix="pl"
                            calculateTotal={true}
                            totalFields={OTHER_INCOME_FIELDS}
                          >
                            <TableRow className="hover:bg-muted/30 transition-colors">
                              <TableCell className="sticky left-0 bg-background/95 z-10 border-r border-border/50 py-3 px-4 pl-12 text-foreground">
                                Other Income
                              </TableCell>
                              {plStatements.map(statement => (
                                <EditableCell
                                  key={`${statement.id}-otherIncome`}
                                  value={statement.otherIncome}
                                  itemId={statement.id}
                                  field="otherIncome"
                                  reportType="pl"
                                />
                              ))}
                            </TableRow>
                          </CollapsibleTableSection>

                          {/* Other Expenses Section */}
                          <CollapsibleTableSection
                            title="Other Expenses"
                            sectionKey="otherExpenses"
                            statements={plStatements}
                            className="bg-red-50/50 dark:bg-red-950/20"
                            prefix="pl"
                            calculateTotal={true}
                            totalFields={OTHER_EXPENSE_FIELDS}
                          >
                            <TableRow className="hover:bg-muted/30 transition-colors">
                              <TableCell className="sticky left-0 bg-background/95 z-10 border-r border-border/50 py-3 px-4 pl-12 text-foreground">
                                Other Expenses
                              </TableCell>
                              {plStatements.map(statement => (
                                <EditableCell
                                  key={`${statement.id}-otherExpenses`}
                                  value={statement.otherExpenses}
                                  itemId={statement.id}
                                  field="otherExpenses"
                                  reportType="pl"
                                />
                              ))}
                            </TableRow>
                          </CollapsibleTableSection>

                          {/* Net Income Before Tax */}
                          <TableRow className="bg-purple-50/50 dark:bg-purple-950/20 border-t-2 border-purple-300 dark:border-purple-700">
                            <TableCell className="sticky left-0 bg-purple-100/80 dark:bg-purple-900/40 z-10 border-r border-border/50 font-bold py-4 px-6 text-foreground">
                              Net Income Before Tax
                            </TableCell>
                            {plStatements.map(statement => (
                              <EditableCell
                                key={`${statement.id}-netIncomeBeforeTax`}
                                value={statement.netIncomeBeforeTax}
                                itemId={statement.id}
                                field="netIncomeBeforeTax"
                                reportType="pl"
                                isEditable={false}
                                className="bg-purple-100/60 dark:bg-purple-900/30"
                              />
                            ))}
                          </TableRow>

                          {/* Tax Expense Section */}
                          <CollapsibleTableSection
                            title="Tax Expense"
                            sectionKey="taxExpense"
                            statements={plStatements}
                            className="bg-yellow-50/50 dark:bg-yellow-950/20"
                            prefix="pl"
                            calculateTotal={true}
                            totalFields={TAX_EXPENSE_FIELDS}
                          >
                            <TableRow className="hover:bg-muted/30 transition-colors">
                              <TableCell className="sticky left-0 bg-background/95 z-10 border-r border-border/50 py-3 px-4 pl-12 text-foreground">
                                Tax Expense
                              </TableCell>
                              {plStatements.map(statement => (
                                <EditableCell
                                  key={`${statement.id}-taxExpense`}
                                  value={statement.taxExpense}
                                  itemId={statement.id}
                                  field="taxExpense"
                                  reportType="pl"
                                />
                              ))}
                            </TableRow>
                          </CollapsibleTableSection>

                          {/* Net Income */}
                          <TableRow className="bg-green-100/80 dark:bg-green-900/40 border-t-4 border-green-500">
                            <TableCell className="sticky left-0 bg-green-200/80 dark:bg-green-800/60 z-10 border-r border-border/50 font-bold py-4 px-6 text-foreground text-lg">
                              Net Income
                            </TableCell>
                            {plStatements.map(statement => (
                              <EditableCell
                                key={`${statement.id}-netIncome`}
                                value={statement.netIncome}
                                itemId={statement.id}
                                field="netIncome"
                                reportType="pl"
                                isEditable={false}
                                className="bg-green-200/60 dark:bg-green-800/40 font-bold text-lg"
                              />
                            ))}
                          </TableRow>
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </TabsContent>

                {/* Balance Sheet Tab */}
                <TabsContent value="bs" className="m-0" data-testid="tab-content-bs">
                  {bsLoading ? (
                    <div className="flex items-center justify-center py-12" data-testid="loading-balance-sheet">
                      <div className="text-center">
                        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent mx-auto mb-2" />
                        <p className="text-muted-foreground">Loading Balance Sheet...</p>
                      </div>
                    </div>
                  ) : balanceSheets.length === 0 ? (
                    <div className="flex items-center justify-center py-12" data-testid="empty-balance-sheet">
                      <div className="text-center">
                        <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-lg font-medium text-foreground mb-2">No Balance Sheet Data</p>
                        <p className="text-muted-foreground">No statements found for the selected filters.</p>
                      </div>
                    </div>
                  ) : (
                    <div className="overflow-auto max-h-[800px]" data-testid="table-container-balance-sheet">
                      <Table className="relative">
                        <TableHeader className="sticky top-0 z-20">
                          <TableRow className="bg-muted/80 border-border/50">
                            <TableHead className="sticky left-0 bg-muted/80 z-30 border-r border-border/50 font-bold text-foreground py-4 px-6 min-w-[200px]">
                              Account / Period
                            </TableHead>
                            {balanceSheets.map(statement => (
                              <TableHead 
                                key={statement.id} 
                                className="text-center font-bold text-foreground py-4 px-6 min-w-[150px] border-l border-border/50"
                                data-testid={`header-period-${statement.period}`}
                              >
                                <div className="text-sm font-bold bg-primary/10 rounded px-2 py-1">{statement.period}</div>
                              </TableHead>
                            ))}
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {/* ASSETS SECTION */}
                          <TableRow className="bg-blue-100/80 dark:bg-blue-900/40 border-t-4 border-blue-500">
                            <TableCell className="sticky left-0 bg-blue-200/80 dark:bg-blue-800/60 z-10 border-r border-border/50 font-bold py-4 px-6 text-foreground text-lg">
                              ASSETS
                            </TableCell>
                            {balanceSheets.map((statement) => (
                              <TableCell 
                                key={`${statement.id}-assets-header`}
                                className="text-center font-bold bg-blue-200/60 dark:bg-blue-800/40 py-4 px-6 text-foreground text-lg"
                              >
                                —
                              </TableCell>
                            ))}
                          </TableRow>

                          {/* Current Assets Section */}
                          <CollapsibleTableSection
                            title="Current Assets"
                            sectionKey="currentAssets"
                            statements={balanceSheets}
                            className="bg-blue-50/50 dark:bg-blue-950/20"
                            prefix="bs"
                            calculateTotal={true}
                            totalFields={CURRENT_ASSET_FIELDS}
                          >
                            <TableRow className="hover:bg-muted/30 transition-colors">
                              <TableCell className="sticky left-0 bg-background/95 z-10 border-r border-border/50 py-3 px-4 pl-12 text-foreground">
                                Cash
                              </TableCell>
                              {balanceSheets.map(statement => (
                                <EditableCell
                                  key={`${statement.id}-cash`}
                                  value={statement.cash}
                                  itemId={statement.id}
                                  field="cash"
                                  reportType="bs"
                                />
                              ))}
                            </TableRow>
                            <TableRow className="hover:bg-muted/30 transition-colors">
                              <TableCell className="sticky left-0 bg-background/95 z-10 border-r border-border/50 py-3 px-4 pl-12 text-foreground">
                                Accounts Receivable
                              </TableCell>
                              {balanceSheets.map(statement => (
                                <EditableCell
                                  key={`${statement.id}-accountsReceivable`}
                                  value={statement.accountsReceivable}
                                  itemId={statement.id}
                                  field="accountsReceivable"
                                  reportType="bs"
                                />
                              ))}
                            </TableRow>
                            <TableRow className="hover:bg-muted/30 transition-colors">
                              <TableCell className="sticky left-0 bg-background/95 z-10 border-r border-border/50 py-3 px-4 pl-12 text-foreground">
                                Inventory
                              </TableCell>
                              {balanceSheets.map(statement => (
                                <EditableCell
                                  key={`${statement.id}-inventory`}
                                  value={statement.inventory}
                                  itemId={statement.id}
                                  field="inventory"
                                  reportType="bs"
                                />
                              ))}
                            </TableRow>
                          </CollapsibleTableSection>

                          {/* Current Assets Total */}
                          <TableRow className="bg-blue-50/50 dark:bg-blue-950/20 border-t-2 border-blue-300 dark:border-blue-700">
                            <TableCell className="sticky left-0 bg-blue-100/80 dark:bg-blue-900/40 z-10 border-r border-border/50 font-bold py-4 px-6 text-foreground">
                              Total Current Assets
                            </TableCell>
                            {balanceSheets.map(statement => (
                              <EditableCell
                                key={`${statement.id}-currentAssets`}
                                value={statement.currentAssets}
                                itemId={statement.id}
                                field="currentAssets"
                                reportType="bs"
                                isEditable={false}
                                className="bg-blue-100/60 dark:bg-blue-900/30"
                              />
                            ))}
                          </TableRow>

                          {/* Non-Current Assets Section */}
                          <CollapsibleTableSection
                            title="Non-Current Assets"
                            sectionKey="nonCurrentAssets"
                            statements={balanceSheets}
                            className="bg-purple-50/50 dark:bg-purple-950/20"
                            prefix="bs"
                            calculateTotal={true}
                            totalFields={NON_CURRENT_ASSET_FIELDS}
                          >
                            <TableRow className="hover:bg-muted/30 transition-colors">
                              <TableCell className="sticky left-0 bg-background/95 z-10 border-r border-border/50 py-3 px-4 pl-12 text-foreground">
                                Property, Plant & Equipment
                              </TableCell>
                              {balanceSheets.map(statement => (
                                <EditableCell
                                  key={`${statement.id}-propertyPlantEquipment`}
                                  value={statement.propertyPlantEquipment}
                                  itemId={statement.id}
                                  field="propertyPlantEquipment"
                                  reportType="bs"
                                />
                              ))}
                            </TableRow>
                            <TableRow className="hover:bg-muted/30 transition-colors">
                              <TableCell className="sticky left-0 bg-background/95 z-10 border-r border-border/50 py-3 px-4 pl-12 text-foreground">
                                Intangible Assets
                              </TableCell>
                              {balanceSheets.map(statement => (
                                <EditableCell
                                  key={`${statement.id}-intangibleAssets`}
                                  value={statement.intangibleAssets}
                                  itemId={statement.id}
                                  field="intangibleAssets"
                                  reportType="bs"
                                />
                              ))}
                            </TableRow>
                          </CollapsibleTableSection>

                          {/* Non-Current Assets Total */}
                          <TableRow className="bg-purple-50/50 dark:bg-purple-950/20 border-t-2 border-purple-300 dark:border-purple-700">
                            <TableCell className="sticky left-0 bg-purple-100/80 dark:bg-purple-900/40 z-10 border-r border-border/50 font-bold py-4 px-6 text-foreground">
                              Total Non-Current Assets
                            </TableCell>
                            {balanceSheets.map(statement => (
                              <EditableCell
                                key={`${statement.id}-nonCurrentAssets`}
                                value={statement.nonCurrentAssets}
                                itemId={statement.id}
                                field="nonCurrentAssets"
                                reportType="bs"
                                isEditable={false}
                                className="bg-purple-100/60 dark:bg-purple-900/30"
                              />
                            ))}
                          </TableRow>

                          {/* Total Assets */}
                          <TableRow className="bg-blue-100/80 dark:bg-blue-900/40 border-t-4 border-blue-500">
                            <TableCell className="sticky left-0 bg-blue-200/80 dark:bg-blue-800/60 z-10 border-r border-border/50 font-bold py-4 px-6 text-foreground text-lg">
                              TOTAL ASSETS
                            </TableCell>
                            {balanceSheets.map(statement => (
                              <EditableCell
                                key={`${statement.id}-totalAssets`}
                                value={statement.totalAssets}
                                itemId={statement.id}
                                field="totalAssets"
                                reportType="bs"
                                isEditable={false}
                                className="bg-blue-200/60 dark:bg-blue-800/40 font-bold text-lg"
                              />
                            ))}
                          </TableRow>

                          {/* LIABILITIES & EQUITY SECTION */}
                          <TableRow className="bg-red-100/80 dark:bg-red-900/40 border-t-4 border-red-500">
                            <TableCell className="sticky left-0 bg-red-200/80 dark:bg-red-800/60 z-10 border-r border-border/50 font-bold py-4 px-6 text-foreground text-lg">
                              LIABILITIES & EQUITY
                            </TableCell>
                            {balanceSheets.map((statement) => (
                              <TableCell 
                                key={`${statement.id}-liabilities-header`}
                                className="text-center font-bold bg-red-200/60 dark:bg-red-800/40 py-4 px-6 text-foreground text-lg"
                              >
                                —
                              </TableCell>
                            ))}
                          </TableRow>

                          {/* Current Liabilities Section */}
                          <CollapsibleTableSection
                            title="Current Liabilities"
                            sectionKey="currentLiabilities"
                            statements={balanceSheets}
                            className="bg-red-50/50 dark:bg-red-950/20"
                            prefix="bs"
                            calculateTotal={true}
                            totalFields={CURRENT_LIABILITY_FIELDS}
                          >
                            <TableRow className="hover:bg-muted/30 transition-colors">
                              <TableCell className="sticky left-0 bg-background/95 z-10 border-r border-border/50 py-3 px-4 pl-12 text-foreground">
                                Accounts Payable
                              </TableCell>
                              {balanceSheets.map(statement => (
                                <EditableCell
                                  key={`${statement.id}-accountsPayable`}
                                  value={statement.accountsPayable}
                                  itemId={statement.id}
                                  field="accountsPayable"
                                  reportType="bs"
                                />
                              ))}
                            </TableRow>
                            <TableRow className="hover:bg-muted/30 transition-colors">
                              <TableCell className="sticky left-0 bg-background/95 z-10 border-r border-border/50 py-3 px-4 pl-12 text-foreground">
                                Short-term Debt
                              </TableCell>
                              {balanceSheets.map(statement => (
                                <EditableCell
                                  key={`${statement.id}-shortTermDebt`}
                                  value={statement.shortTermDebt}
                                  itemId={statement.id}
                                  field="shortTermDebt"
                                  reportType="bs"
                                />
                              ))}
                            </TableRow>
                          </CollapsibleTableSection>

                          {/* Current Liabilities Total */}
                          <TableRow className="bg-red-50/50 dark:bg-red-950/20 border-t-2 border-red-300 dark:border-red-700">
                            <TableCell className="sticky left-0 bg-red-100/80 dark:bg-red-900/40 z-10 border-r border-border/50 font-bold py-4 px-6 text-foreground">
                              Total Current Liabilities
                            </TableCell>
                            {balanceSheets.map(statement => (
                              <EditableCell
                                key={`${statement.id}-currentLiabilities`}
                                value={statement.currentLiabilities}
                                itemId={statement.id}
                                field="currentLiabilities"
                                reportType="bs"
                                isEditable={false}
                                className="bg-red-100/60 dark:bg-red-900/30"
                              />
                            ))}
                          </TableRow>

                          {/* Long-term Liabilities Section */}
                          <CollapsibleTableSection
                            title="Long-term Liabilities"
                            sectionKey="longTermLiabilities"
                            statements={balanceSheets}
                            className="bg-orange-50/50 dark:bg-orange-950/20"
                            prefix="bs"
                            calculateTotal={true}
                            totalFields={LONG_TERM_LIABILITY_FIELDS}
                          >
                            <TableRow className="hover:bg-muted/30 transition-colors">
                              <TableCell className="sticky left-0 bg-background/95 z-10 border-r border-border/50 py-3 px-4 pl-12 text-foreground">
                                Long-term Debt
                              </TableCell>
                              {balanceSheets.map(statement => (
                                <EditableCell
                                  key={`${statement.id}-longTermDebt`}
                                  value={statement.longTermDebt}
                                  itemId={statement.id}
                                  field="longTermDebt"
                                  reportType="bs"
                                />
                              ))}
                            </TableRow>
                          </CollapsibleTableSection>

                          {/* Long-term Liabilities Total */}
                          <TableRow className="bg-orange-50/50 dark:bg-orange-950/20 border-t-2 border-orange-300 dark:border-orange-700">
                            <TableCell className="sticky left-0 bg-orange-100/80 dark:bg-orange-900/40 z-10 border-r border-border/50 font-bold py-4 px-6 text-foreground">
                              Total Long-term Liabilities
                            </TableCell>
                            {balanceSheets.map(statement => (
                              <EditableCell
                                key={`${statement.id}-longTermLiabilities`}
                                value={statement.longTermLiabilities}
                                itemId={statement.id}
                                field="longTermLiabilities"
                                reportType="bs"
                                isEditable={false}
                                className="bg-orange-100/60 dark:bg-orange-900/30"
                              />
                            ))}
                          </TableRow>

                          {/* Total Liabilities */}
                          <TableRow className="bg-red-100/80 dark:bg-red-900/40 border-t-4 border-red-500">
                            <TableCell className="sticky left-0 bg-red-200/80 dark:bg-red-800/60 z-10 border-r border-border/50 font-bold py-4 px-6 text-foreground text-lg">
                              TOTAL LIABILITIES
                            </TableCell>
                            {balanceSheets.map(statement => (
                              <EditableCell
                                key={`${statement.id}-totalLiabilities`}
                                value={statement.totalLiabilities}
                                itemId={statement.id}
                                field="totalLiabilities"
                                reportType="bs"
                                isEditable={false}
                                className="bg-red-200/60 dark:bg-red-800/40 font-bold text-lg"
                              />
                            ))}
                          </TableRow>

                          {/* Shareholders' Equity */}
                          <TableRow className="bg-green-50/50 dark:bg-green-950/20 border-t-2 border-green-300 dark:border-green-700">
                            <TableCell className="sticky left-0 bg-green-100/80 dark:bg-green-900/40 z-10 border-r border-border/50 font-bold py-4 px-6 text-foreground">
                              Shareholders' Equity
                            </TableCell>
                            {balanceSheets.map(statement => (
                              <EditableCell
                                key={`${statement.id}-shareholdersEquity`}
                                value={statement.shareholdersEquity}
                                itemId={statement.id}
                                field="shareholdersEquity"
                                reportType="bs"
                              />
                            ))}
                          </TableRow>

                          {/* Retained Earnings */}
                          <TableRow className="bg-green-50/50 dark:bg-green-950/20">
                            <TableCell className="sticky left-0 bg-green-100/80 dark:bg-green-900/40 z-10 border-r border-border/50 font-bold py-4 px-6 text-foreground">
                              Retained Earnings
                            </TableCell>
                            {balanceSheets.map(statement => (
                              <EditableCell
                                key={`${statement.id}-retainedEarnings`}
                                value={statement.retainedEarnings}
                                itemId={statement.id}
                                field="retainedEarnings"
                                reportType="bs"
                              />
                            ))}
                          </TableRow>
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </TabsContent>

                {/* Cash Flow Tab */}
                <TabsContent value="cf" className="m-0" data-testid="tab-content-cf">
                  {cfLoading ? (
                    <div className="flex items-center justify-center py-12" data-testid="loading-cash-flow">
                      <div className="text-center">
                        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent mx-auto mb-2" />
                        <p className="text-muted-foreground">Loading Cash Flow statements...</p>
                      </div>
                    </div>
                  ) : cashFlowStatements.length === 0 ? (
                    <div className="flex items-center justify-center py-12" data-testid="empty-cash-flow">
                      <div className="text-center">
                        <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-lg font-medium text-foreground mb-2">No Cash Flow Data</p>
                        <p className="text-muted-foreground">No statements found for the selected filters.</p>
                      </div>
                    </div>
                  ) : (
                    <div className="overflow-auto max-h-[800px]" data-testid="table-container-cash-flow">
                      <Table className="relative">
                        <TableHeader className="sticky top-0 z-20">
                          <TableRow className="bg-muted/80 border-border/50">
                            <TableHead className="sticky left-0 bg-muted/80 z-30 border-r border-border/50 font-bold text-foreground py-4 px-6 min-w-[200px]">
                              Account / Period
                            </TableHead>
                            {cashFlowStatements.map(statement => (
                              <TableHead 
                                key={statement.id} 
                                className="text-center font-bold text-foreground py-4 px-6 min-w-[150px] border-l border-border/50"
                                data-testid={`header-period-${statement.period}`}
                              >
                                <div className="text-sm font-bold bg-primary/10 rounded px-2 py-1">{statement.period}</div>
                              </TableHead>
                            ))}
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {/* Operating Activities Section */}
                          <CollapsibleTableSection
                            title="Operating Activities"
                            sectionKey="operatingActivities"
                            statements={cashFlowStatements}
                            className="bg-blue-50/50 dark:bg-blue-950/20"
                            prefix="cf"
                            calculateTotal={true}
                            totalFields={OPERATING_CASH_FIELDS}
                          >
                            <TableRow className="hover:bg-muted/30 transition-colors">
                              <TableCell className="sticky left-0 bg-background/95 z-10 border-r border-border/50 py-3 px-4 pl-12 text-foreground">
                                Net Income
                              </TableCell>
                              {cashFlowStatements.map(statement => (
                                <EditableCell
                                  key={`${statement.id}-netIncome`}
                                  value={statement.netIncome}
                                  itemId={statement.id}
                                  field="netIncome"
                                  reportType="cf"
                                />
                              ))}
                            </TableRow>
                            <TableRow className="hover:bg-muted/30 transition-colors">
                              <TableCell className="sticky left-0 bg-background/95 z-10 border-r border-border/50 py-3 px-4 pl-12 text-foreground">
                                Depreciation
                              </TableCell>
                              {cashFlowStatements.map(statement => (
                                <EditableCell
                                  key={`${statement.id}-depreciation`}
                                  value={statement.depreciation}
                                  itemId={statement.id}
                                  field="depreciation"
                                  reportType="cf"
                                />
                              ))}
                            </TableRow>
                            <TableRow className="hover:bg-muted/30 transition-colors">
                              <TableCell className="sticky left-0 bg-background/95 z-10 border-r border-border/50 py-3 px-4 pl-12 text-foreground">
                                Change in Working Capital
                              </TableCell>
                              {cashFlowStatements.map(statement => (
                                <EditableCell
                                  key={`${statement.id}-changeInWorkingCapital`}
                                  value={statement.changeInWorkingCapital}
                                  itemId={statement.id}
                                  field="changeInWorkingCapital"
                                  reportType="cf"
                                />
                              ))}
                            </TableRow>
                          </CollapsibleTableSection>

                          {/* Operating Cash Flow Total */}
                          <TableRow className="bg-blue-50/50 dark:bg-blue-950/20 border-t-2 border-blue-300 dark:border-blue-700">
                            <TableCell className="sticky left-0 bg-blue-100/80 dark:bg-blue-900/40 z-10 border-r border-border/50 font-bold py-4 px-6 text-foreground">
                              Operating Cash Flow
                            </TableCell>
                            {cashFlowStatements.map(statement => (
                              <EditableCell
                                key={`${statement.id}-operatingCashFlow`}
                                value={statement.operatingCashFlow}
                                itemId={statement.id}
                                field="operatingCashFlow"
                                reportType="cf"
                                isEditable={false}
                                className="bg-blue-100/60 dark:bg-blue-900/30"
                              />
                            ))}
                          </TableRow>

                          {/* Investing Activities Section */}
                          <CollapsibleTableSection
                            title="Investing Activities"
                            sectionKey="investingActivities"
                            statements={cashFlowStatements}
                            className="bg-purple-50/50 dark:bg-purple-950/20"
                            prefix="cf"
                            calculateTotal={true}
                            totalFields={INVESTING_CASH_FIELDS}
                          >
                            <TableRow className="hover:bg-muted/30 transition-colors">
                              <TableCell className="sticky left-0 bg-background/95 z-10 border-r border-border/50 py-3 px-4 pl-12 text-foreground">
                                Capital Expenditures
                              </TableCell>
                              {cashFlowStatements.map(statement => (
                                <EditableCell
                                  key={`${statement.id}-capitalExpenditures`}
                                  value={statement.capitalExpenditures}
                                  itemId={statement.id}
                                  field="capitalExpenditures"
                                  reportType="cf"
                                />
                              ))}
                            </TableRow>
                            <TableRow className="hover:bg-muted/30 transition-colors">
                              <TableCell className="sticky left-0 bg-background/95 z-10 border-r border-border/50 py-3 px-4 pl-12 text-foreground">
                                Acquisitions
                              </TableCell>
                              {cashFlowStatements.map(statement => (
                                <EditableCell
                                  key={`${statement.id}-acquisitions`}
                                  value={statement.acquisitions}
                                  itemId={statement.id}
                                  field="acquisitions"
                                  reportType="cf"
                                />
                              ))}
                            </TableRow>
                          </CollapsibleTableSection>

                          {/* Investing Cash Flow Total */}
                          <TableRow className="bg-purple-50/50 dark:bg-purple-950/20 border-t-2 border-purple-300 dark:border-purple-700">
                            <TableCell className="sticky left-0 bg-purple-100/80 dark:bg-purple-900/40 z-10 border-r border-border/50 font-bold py-4 px-6 text-foreground">
                              Investing Cash Flow
                            </TableCell>
                            {cashFlowStatements.map(statement => (
                              <EditableCell
                                key={`${statement.id}-investingCashFlow`}
                                value={statement.investingCashFlow}
                                itemId={statement.id}
                                field="investingCashFlow"
                                reportType="cf"
                                isEditable={false}
                                className="bg-purple-100/60 dark:bg-purple-900/30"
                              />
                            ))}
                          </TableRow>

                          {/* Financing Activities Section */}
                          <CollapsibleTableSection
                            title="Financing Activities"
                            sectionKey="financingActivities"
                            statements={cashFlowStatements}
                            className="bg-green-50/50 dark:bg-green-950/20"
                            prefix="cf"
                            calculateTotal={true}
                            totalFields={FINANCING_CASH_FIELDS}
                          >
                            <TableRow className="hover:bg-muted/30 transition-colors">
                              <TableCell className="sticky left-0 bg-background/95 z-10 border-r border-border/50 py-3 px-4 pl-12 text-foreground">
                                Debt Issuance
                              </TableCell>
                              {cashFlowStatements.map(statement => (
                                <EditableCell
                                  key={`${statement.id}-debtIssuance`}
                                  value={statement.debtIssuance}
                                  itemId={statement.id}
                                  field="debtIssuance"
                                  reportType="cf"
                                />
                              ))}
                            </TableRow>
                            <TableRow className="hover:bg-muted/30 transition-colors">
                              <TableCell className="sticky left-0 bg-background/95 z-10 border-r border-border/50 py-3 px-4 pl-12 text-foreground">
                                Debt Repayment
                              </TableCell>
                              {cashFlowStatements.map(statement => (
                                <EditableCell
                                  key={`${statement.id}-debtRepayment`}
                                  value={statement.debtRepayment}
                                  itemId={statement.id}
                                  field="debtRepayment"
                                  reportType="cf"
                                />
                              ))}
                            </TableRow>
                            <TableRow className="hover:bg-muted/30 transition-colors">
                              <TableCell className="sticky left-0 bg-background/95 z-10 border-r border-border/50 py-3 px-4 pl-12 text-foreground">
                                Dividends Paid
                              </TableCell>
                              {cashFlowStatements.map(statement => (
                                <EditableCell
                                  key={`${statement.id}-dividendsPaid`}
                                  value={statement.dividendsPaid}
                                  itemId={statement.id}
                                  field="dividendsPaid"
                                  reportType="cf"
                                />
                              ))}
                            </TableRow>
                          </CollapsibleTableSection>

                          {/* Financing Cash Flow Total */}
                          <TableRow className="bg-green-50/50 dark:bg-green-950/20 border-t-2 border-green-300 dark:border-green-700">
                            <TableCell className="sticky left-0 bg-green-100/80 dark:bg-green-900/40 z-10 border-r border-border/50 font-bold py-4 px-6 text-foreground">
                              Financing Cash Flow
                            </TableCell>
                            {cashFlowStatements.map(statement => (
                              <EditableCell
                                key={`${statement.id}-financingCashFlow`}
                                value={statement.financingCashFlow}
                                itemId={statement.id}
                                field="financingCashFlow"
                                reportType="cf"
                                isEditable={false}
                                className="bg-green-100/60 dark:bg-green-900/30"
                              />
                            ))}
                          </TableRow>

                          {/* Net Change in Cash */}
                          <TableRow className="bg-yellow-50/50 dark:bg-yellow-950/20 border-t-2 border-yellow-300 dark:border-yellow-700">
                            <TableCell className="sticky left-0 bg-yellow-100/80 dark:bg-yellow-900/40 z-10 border-r border-border/50 font-bold py-4 px-6 text-foreground">
                              Net Change in Cash
                            </TableCell>
                            {cashFlowStatements.map(statement => (
                              <EditableCell
                                key={`${statement.id}-netChangeInCash`}
                                value={statement.netChangeInCash}
                                itemId={statement.id}
                                field="netChangeInCash"
                                reportType="cf"
                                isEditable={false}
                                className="bg-yellow-100/60 dark:bg-yellow-900/30"
                              />
                            ))}
                          </TableRow>

                          {/* Beginning Cash Balance */}
                          <TableRow className="bg-gray-50/50 dark:bg-gray-950/20">
                            <TableCell className="sticky left-0 bg-gray-100/80 dark:bg-gray-900/40 z-10 border-r border-border/50 font-bold py-4 px-6 text-foreground">
                              Beginning Cash Balance
                            </TableCell>
                            {cashFlowStatements.map(statement => (
                              <EditableCell
                                key={`${statement.id}-beginningCashBalance`}
                                value={statement.beginningCashBalance}
                                itemId={statement.id}
                                field="beginningCashBalance"
                                reportType="cf"
                              />
                            ))}
                          </TableRow>

                          {/* Ending Cash Balance */}
                          <TableRow className="bg-cyan-100/80 dark:bg-cyan-900/40 border-t-4 border-cyan-500">
                            <TableCell className="sticky left-0 bg-cyan-200/80 dark:bg-cyan-800/60 z-10 border-r border-border/50 font-bold py-4 px-6 text-foreground text-lg">
                              Ending Cash Balance
                            </TableCell>
                            {cashFlowStatements.map(statement => (
                              <EditableCell
                                key={`${statement.id}-endingCashBalance`}
                                value={statement.endingCashBalance}
                                itemId={statement.id}
                                field="endingCashBalance"
                                reportType="cf"
                                isEditable={false}
                                className="bg-cyan-200/60 dark:bg-cyan-800/40 font-bold text-lg"
                              />
                            ))}
                          </TableRow>
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}