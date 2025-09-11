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
  AlertCircle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import Navigation from "@/components/Navigation";
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
      return <div className="p-8 text-center" data-testid="loading-pl">Loading data...</div>;
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
            <Card key={topic} data-testid={`pl-comparative-${topic}`}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-5 w-5" />
                  Profit & Loss Statement - {topic}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table className="min-w-full">
                    <TableHeader>
                      <TableRow>
                        <TableHead className="sticky left-0 bg-background z-10 min-w-[200px] border-r">Line Item</TableHead>
                        {statements.map((statement) => (
                          <TableHead key={statement.period} className="text-right min-w-[120px]" data-testid={`header-${statement.period}`}>
                            {statement.period}
                          </TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium sticky left-0 bg-background z-10 border-r">Total Revenue</TableCell>
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
                      <TableCell className="font-medium sticky left-0 bg-background z-10 border-r">Cost of Goods Sold</TableCell>
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
                    <TableRow className="border-t-2 bg-blue-50 dark:bg-blue-950/20">
                      <TableCell className="font-bold sticky left-0 bg-background z-10 border-r">Gross Profit</TableCell>
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
                      <TableCell className="font-medium sticky left-0 bg-background z-10 border-r">Operating Expenses</TableCell>
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
                    <TableRow className="border-t-2 bg-green-50 dark:bg-green-950/20">
                      <TableCell className="font-bold sticky left-0 bg-background z-10 border-r">Operating Income</TableCell>
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
                      <TableCell className="font-medium sticky left-0 bg-background z-10 border-r">Other Income</TableCell>
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
                      <TableCell className="font-medium sticky left-0 bg-background z-10 border-r">Other Expenses</TableCell>
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
                    <TableRow className="border-t-2 bg-orange-50 dark:bg-orange-950/20">
                      <TableCell className="font-bold sticky left-0 bg-background z-10 border-r">Income Before Tax</TableCell>
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
                      <TableCell className="font-medium sticky left-0 bg-background z-10 border-r">Tax Expense</TableCell>
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
                    <TableRow className="border-t-4 bg-primary/10">
                      <TableCell className="font-bold text-lg sticky left-0 bg-background z-10 border-r">Net Income</TableCell>
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
      return <div className="p-8 text-center" data-testid="loading-bs">Loading data...</div>;
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
          <Card key={topic} data-testid={`bs-comparative-${topic}`}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Balance Sheet - {topic}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table className="min-w-full">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="sticky left-0 bg-background z-10 min-w-[200px] border-r">รายการ</TableHead>
                      {sheets.map((sheet) => (
                        <TableHead key={sheet.period} className="text-right min-w-[120px]" data-testid={`header-${sheet.period}`}>
                          {sheet.period}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {/* Assets Section */}
                    <TableRow className="bg-blue-50 dark:bg-blue-950/20">
                      <TableCell className="font-bold sticky left-0 bg-background z-10 border-r">สินทรัพย์หมุนเวียน</TableCell>
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
                      <TableCell className="font-medium sticky left-0 bg-background z-10 border-r pl-6">เงินสด</TableCell>
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
                      <TableCell className="font-medium sticky left-0 bg-background z-10 border-r pl-6">ลูกหนี้การค้า</TableCell>
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
                      <TableCell className="font-medium sticky left-0 bg-background z-10 border-r pl-6">สินค้าคงเหลือ</TableCell>
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
                    <TableRow className="bg-blue-50 dark:bg-blue-950/20">
                      <TableCell className="font-bold sticky left-0 bg-background z-10 border-r">สินทรัพย์ไม่หมุนเวียน</TableCell>
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
                      <TableCell className="font-medium sticky left-0 bg-background z-10 border-r pl-6">ที่ดิน อาคาร อุปกรณ์</TableCell>
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
                      <TableCell className="font-medium sticky left-0 bg-background z-10 border-r pl-6">สินทรัพย์ไม่มีตัวตน</TableCell>
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
                    <TableRow className="border-t-2 bg-green-50 dark:bg-green-950/20">
                      <TableCell className="font-bold sticky left-0 bg-background z-10 border-r">สินทรัพย์รวม</TableCell>
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
                    <TableRow className="bg-orange-50 dark:bg-orange-950/20">
                      <TableCell className="font-bold sticky left-0 bg-background z-10 border-r">หนี้สินหมุนเวียน</TableCell>
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
                      <TableCell className="font-medium sticky left-0 bg-background z-10 border-r pl-6">เจ้าหนี้การค้า</TableCell>
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
                      <TableCell className="font-medium sticky left-0 bg-background z-10 border-r pl-6">หนี้สินระยะสั้น</TableCell>
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
                    <TableRow className="bg-orange-50 dark:bg-orange-950/20">
                      <TableCell className="font-bold sticky left-0 bg-background z-10 border-r">หนี้สินระยะยาว</TableCell>
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
                      <TableCell className="font-medium sticky left-0 bg-background z-10 border-r pl-6">หนี้สินระยะยาว</TableCell>
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
                    <TableRow className="border-t-2 bg-red-50 dark:bg-red-950/20">
                      <TableCell className="font-bold sticky left-0 bg-background z-10 border-r">หนี้สินรวม</TableCell>
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
                    <TableRow className="bg-purple-50 dark:bg-purple-950/20">
                      <TableCell className="font-bold sticky left-0 bg-background z-10 border-r">ส่วนของผู้ถือหุ้น</TableCell>
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
                      <TableCell className="font-medium sticky left-0 bg-background z-10 border-r pl-6">กำไรสะสม</TableCell>
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
      return <div className="p-8 text-center" data-testid="loading-cf">Loading data...</div>;
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
          <Card key={topic} data-testid={`cf-comparative-${topic}`}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Cash Flow Statement - {topic}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table className="min-w-full">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="sticky left-0 bg-background z-10 min-w-[200px] border-r">รายการ</TableHead>
                      {statements.map((statement) => (
                        <TableHead key={statement.period} className="text-right min-w-[120px]" data-testid={`header-${statement.period}`}>
                          {statement.period}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                <TableBody>
                  <TableRow className="bg-blue-50 dark:bg-blue-950/20">
                    <TableCell className="font-bold sticky left-0 bg-background z-10 border-r">กระแสเงินสดจากการดำเนินงาน</TableCell>
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
                    <TableCell className="font-medium sticky left-0 bg-background z-10 border-r pl-8">กำไรสุทธิ</TableCell>
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
                    <TableCell className="font-medium sticky left-0 bg-background z-10 border-r pl-8">ค่าเสื่อมราคา</TableCell>
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
                    <TableCell className="font-medium sticky left-0 bg-background z-10 border-r pl-8">การเปลี่ยนแปลงในเงินทุนหมุนเวียน</TableCell>
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
                  <TableRow className="bg-green-50 dark:bg-green-950/20">
                    <TableCell className="font-bold sticky left-0 bg-background z-10 border-r">กระแสเงินสดจากการลงทุน</TableCell>
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
                    <TableCell className="font-medium sticky left-0 bg-background z-10 border-r pl-8">การลงทุนในสินทรัพย์ถาวร</TableCell>
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
                    <TableCell className="font-medium sticky left-0 bg-background z-10 border-r pl-8">การซื้อกิจการ</TableCell>
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
                  <TableRow className="bg-orange-50 dark:bg-orange-950/20">
                    <TableCell className="font-bold sticky left-0 bg-background z-10 border-r">กระแสเงินสดจากการจัดหาเงิน</TableCell>
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
                    <TableCell className="font-medium sticky left-0 bg-background z-10 border-r pl-8">การกู้ยืมเงิน</TableCell>
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
                    <TableCell className="font-medium sticky left-0 bg-background z-10 border-r pl-8">การชำระคืนหนี้</TableCell>
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
                    <TableCell className="font-medium sticky left-0 bg-background z-10 border-r pl-8">เงินปันผลที่จ่าย</TableCell>
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
                  <TableRow className="border-t-4 bg-muted/50">
                    <TableCell className="font-bold text-lg sticky left-0 bg-background z-10 border-r">การเปลี่ยนแปลงในเงินสดสุทธิ</TableCell>
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
                    <TableCell className="font-medium sticky left-0 bg-background z-10 border-r">เงินสดต้นงวด</TableCell>
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
                  <TableRow className="border-t-2 bg-primary/10">
                    <TableCell className="font-bold text-lg sticky left-0 bg-background z-10 border-r">เงินสดปลายงวด</TableCell>
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
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-background to-muted/10 border-b">
        <div className="container mx-auto px-6 py-16">
          <div className="text-center space-y-6">
            <h1 className="text-5xl md:text-6xl font-bold text-foreground leading-tight flex items-center justify-center gap-4" data-testid="page-title">
              <FileText className="h-12 w-12 md:h-16 md:w-16 text-primary" />
              รายงานการเงิน
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed" data-testid="page-description">
              ดูและแก้ไขรายงานการเงิน รวมถึงงบกำไรขาดทุน งบดุล และงบกระแสเงินสด พร้อมการวิเคราะห์อัจฉริยะแบบเรียลไทม์
            </p>
            <div className="flex justify-center gap-4 text-sm text-muted-foreground">
              <Badge variant="outline" className="px-4 py-2">
                <strong className="text-foreground">Live Data</strong> อัปเดตแล้ว
              </Badge>
              <Badge variant="outline" className="px-4 py-2">
                <strong className="text-foreground">AI-Powered</strong> การวิเคราะห์
              </Badge>
              <Badge variant="outline" className="px-4 py-2">
                <strong className="text-foreground">Real-time</strong> แก้ไขได้
              </Badge>
            </div>
          </div>
        </div>
      </section>

      <main className="container mx-auto px-6 py-12">
        <div className="max-w-7xl mx-auto space-y-8">

          {/* Filters */}
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  <span className="text-sm font-medium">กรองข้อมูล:</span>
                </div>
                
                <Select value={selectedTopic} onValueChange={setSelectedTopic}>
                  <SelectTrigger className="w-[200px]" data-testid="select-topic">
                    <SelectValue placeholder="เลือกหัวข้อ" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all" data-testid="option-all-topics">ทั้งหมด</SelectItem>
                    {uniqueTopics.map((topic) => (
                      <SelectItem key={topic} value={topic} data-testid={`option-topic-${topic}`}>
                        {topic}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={startPeriod} onValueChange={handleStartPeriodChange}>
                  <SelectTrigger className="w-[200px]" data-testid="select-start-period">
                    <SelectValue placeholder="Start Period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none" data-testid="option-no-start">No Start</SelectItem>
                    {uniquePeriods.map((period) => (
                      <SelectItem key={period} value={period} data-testid={`option-start-${period}`}>
                        {period}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Select value={endPeriod} onValueChange={handleEndPeriodChange}>
                  <SelectTrigger className="w-[200px]" data-testid="select-end-period">
                    <SelectValue placeholder="End Period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none" data-testid="option-no-end">No End</SelectItem>
                    {uniquePeriods.map((period) => (
                      <SelectItem key={period} value={period} data-testid={`option-end-${period}`}>
                        {period}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {(selectedTopic && selectedTopic !== "all" || (startPeriod && startPeriod !== "none") || (endPeriod && endPeriod !== "none")) && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSelectedTopic("all");
                      setStartPeriod("none");
                      setEndPeriod("none");
                    }}
                    data-testid="button-clear-filters"
                  >
                    Clear Filters
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Financial Reports Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-3" data-testid="tabs-list">
              <TabsTrigger value="pl" className="flex items-center gap-2" data-testid="tab-pl">
                <Calculator className="h-4 w-4" />
                งบกำไรขาดทุน
              </TabsTrigger>
              <TabsTrigger value="bs" className="flex items-center gap-2" data-testid="tab-bs">
                <BarChart3 className="h-4 w-4" />
                งบดุล
              </TabsTrigger>
              <TabsTrigger value="cf" className="flex items-center gap-2" data-testid="tab-cf">
                <TrendingUp className="h-4 w-4" />
                งบกระแสเงินสด
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
      </main>
    </div>
  );
}