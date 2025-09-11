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
  const [selectedPeriod, setSelectedPeriod] = useState<string>("all");
  const [activeTab, setActiveTab] = useState<string>("pl");
  const [editingCells, setEditingCells] = useState<Record<string, any>>({});
  const queryClient = useQueryClient();
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const { toast } = useToast();

  // Fetch financial reports data
  const { data: plStatements = [], isLoading: plLoading } = useQuery({
    queryKey: ['/api/profit-loss', selectedTopic, selectedPeriod],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (selectedTopic && selectedTopic !== 'all') params.append('topic', selectedTopic);
      if (selectedPeriod && selectedPeriod !== 'all') params.append('period', selectedPeriod);
      
      const response = await fetch(`/api/profit-loss?${params}`);
      if (!response.ok) throw new Error('Failed to fetch P&L statements');
      return response.json() as Promise<ProfitLossStatement[]>;
    }
  });

  const { data: balanceSheets = [], isLoading: bsLoading } = useQuery({
    queryKey: ['/api/balance-sheet', selectedTopic, selectedPeriod],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (selectedTopic && selectedTopic !== 'all') params.append('topic', selectedTopic);
      if (selectedPeriod && selectedPeriod !== 'all') params.append('period', selectedPeriod);
      
      const response = await fetch(`/api/balance-sheet?${params}`);
      if (!response.ok) throw new Error('Failed to fetch balance sheets');
      return response.json() as Promise<BalanceSheet[]>;
    }
  });

  const { data: cashFlowStatements = [], isLoading: cfLoading } = useQuery({
    queryKey: ['/api/cash-flow', selectedTopic, selectedPeriod],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (selectedTopic && selectedTopic !== 'all') params.append('topic', selectedTopic);
      if (selectedPeriod && selectedPeriod !== 'all') params.append('period', selectedPeriod);
      
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
    return Array.from(new Set(allData.map(item => item.period))).sort().reverse();
  }, [plStatements, balanceSheets, cashFlowStatements]);

  // Validation helper function
  const validateNumericInput = (value: string): string | null => {
    if (value.trim() === '') return 'Value is required';
    
    const num = parseFloat(value);
    if (isNaN(num)) return 'Must be a valid number';
    if (num < 0) return 'Must not be negative';
    
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
      toast({ description: "รายการขาดทุนถูกอัปเดตเรียบร้อยแล้ว" });
    },
    onError: (error: any) => {
      console.error('P&L update error:', error);
      let errorMessage = "เกิดข้อผิดพลาดในการอัปเดต";
      
      if (error.message.includes('400')) {
        errorMessage = "ข้อมูลไม่ถูกต้อง กรุณาตรวจสอบค่าที่กรอก";
      } else if (error.message.includes('404')) {
        errorMessage = "ไม่พบข้อมูลที่ต้องการอัปเดต";
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
      toast({ description: "งบดุลถูกอัปเดตเรียบร้อยแล้ว" });
    },
    onError: (error: any) => {
      console.error('Balance sheet update error:', error);
      let errorMessage = "เกิดข้อผิดพลาดในการอัปเดต";
      
      if (error.message.includes('400')) {
        errorMessage = "ข้อมูลไม่ถูกต้อง กรุณาตรวจสอบค่าที่กรอก";
      } else if (error.message.includes('404')) {
        errorMessage = "ไม่พบข้อมูลที่ต้องการอัปเดต";
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
      toast({ description: "งบกระแสเงินสดถูกอัปเดตเรียบร้อยแล้ว" });
    },
    onError: (error: any) => {
      console.error('Cash flow update error:', error);
      let errorMessage = "เกิดข้อผิดพลาดในการอัปเดต";
      
      if (error.message.includes('400')) {
        errorMessage = "ข้อมูลไม่ถูกต้อง กรุณาตรวจสอบค่าที่กรอก";
      } else if (error.message.includes('404')) {
        errorMessage = "ไม่พบข้อมูลที่ต้องการอัปเดต";
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
    return new Intl.NumberFormat('th-TH', {
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

  // Profit & Loss Table Component
  const ProfitLossTable = () => {
    if (plLoading) {
      return <div className="p-8 text-center" data-testid="loading-pl">กำลังโหลดข้อมูล...</div>;
    }

    return (
      <div className="space-y-4">
        {plStatements.map((statement) => {
          const editableFields = JSON.parse(statement.isEditable || '{}');
          
          return (
            <Card key={statement.id} data-testid={`pl-statement-${statement.id}`}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Calculator className="h-5 w-5" />
                    งบกำไรขาดทุน - {statement.topic}
                  </CardTitle>
                  <Badge variant="secondary" data-testid={`period-badge-${statement.period}`}>
                    {statement.period}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>รายการ</TableHead>
                      <TableHead className="text-right">จำนวนเงิน (บาท)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">รายได้รวม</TableCell>
                      <EditableCell
                        value={statement.totalRevenue}
                        itemId={statement.id}
                        field="totalRevenue"
                        reportType="pl"
                        isEditable={editableFields.totalRevenue}
                      />
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">ต้นทุนขายสินค้า</TableCell>
                      <EditableCell
                        value={statement.costOfGoodsSold}
                        itemId={statement.id}
                        field="costOfGoodsSold"
                        reportType="pl"
                        isEditable={editableFields.costOfGoodsSold}
                      />
                    </TableRow>
                    <TableRow className="border-t-2">
                      <TableCell className="font-bold">กำไรขั้นต้น</TableCell>
                      <EditableCell
                        value={statement.grossProfit}
                        itemId={statement.id}
                        field="grossProfit"
                        reportType="pl"
                        isEditable={editableFields.grossProfit}
                        className="font-bold"
                      />
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">ค่าใช้จ่ายในการดำเนินงาน</TableCell>
                      <EditableCell
                        value={statement.operatingExpenses}
                        itemId={statement.id}
                        field="operatingExpenses"
                        reportType="pl"
                        isEditable={editableFields.operatingExpenses}
                      />
                    </TableRow>
                    <TableRow className="border-t-2">
                      <TableCell className="font-bold">กำไรจากการดำเนินงาน</TableCell>
                      <EditableCell
                        value={statement.operatingIncome}
                        itemId={statement.id}
                        field="operatingIncome"
                        reportType="pl"
                        isEditable={editableFields.operatingIncome}
                        className="font-bold"
                      />
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">รายได้อื่น</TableCell>
                      <EditableCell
                        value={statement.otherIncome}
                        itemId={statement.id}
                        field="otherIncome"
                        reportType="pl"
                        isEditable={editableFields.otherIncome}
                      />
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">ค่าใช้จ่ายอื่น</TableCell>
                      <EditableCell
                        value={statement.otherExpenses}
                        itemId={statement.id}
                        field="otherExpenses"
                        reportType="pl"
                        isEditable={editableFields.otherExpenses}
                      />
                    </TableRow>
                    <TableRow className="border-t-2">
                      <TableCell className="font-bold">กำไรสุทธิก่อนภาษี</TableCell>
                      <EditableCell
                        value={statement.netIncomeBeforeTax}
                        itemId={statement.id}
                        field="netIncomeBeforeTax"
                        reportType="pl"
                        isEditable={editableFields.netIncomeBeforeTax}
                        className="font-bold"
                      />
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">ค่าใช้จ่ายภาษี</TableCell>
                      <EditableCell
                        value={statement.taxExpense}
                        itemId={statement.id}
                        field="taxExpense"
                        reportType="pl"
                        isEditable={editableFields.taxExpense}
                      />
                    </TableRow>
                    <TableRow className="border-t-4 bg-muted/50">
                      <TableCell className="font-bold text-lg">กำไรสุทธิ</TableCell>
                      <EditableCell
                        value={statement.netIncome}
                        itemId={statement.id}
                        field="netIncome"
                        reportType="pl"
                        isEditable={editableFields.netIncome}
                        className="font-bold text-lg"
                      />
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          );
        })}
      </div>
    );
  };

  // Balance Sheet Table Component
  const BalanceSheetTable = () => {
    if (bsLoading) {
      return <div className="p-8 text-center" data-testid="loading-bs">กำลังโหลดข้อมูล...</div>;
    }

    return (
      <div className="space-y-4">
        {balanceSheets.map((sheet) => {
          const editableFields = JSON.parse(sheet.isEditable || '{}');
          
          return (
            <Card key={sheet.id} data-testid={`balance-sheet-${sheet.id}`}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    งบดุล - {sheet.topic}
                  </CardTitle>
                  <Badge variant="secondary" data-testid={`period-badge-${sheet.period}`}>
                    {sheet.period}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Assets */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">สินทรัพย์</h3>
                    <Table>
                      <TableBody>
                        <TableRow className="bg-muted/30">
                          <TableCell className="font-semibold">สินทรัพย์หมุนเวียน</TableCell>
                          <EditableCell
                            value={sheet.currentAssets}
                            itemId={sheet.id}
                            field="currentAssets"
                            reportType="bs"
                            isEditable={editableFields.currentAssets}
                            className="font-semibold"
                          />
                        </TableRow>
                        <TableRow>
                          <TableCell className="pl-8">เงินสด</TableCell>
                          <EditableCell
                            value={sheet.cash}
                            itemId={sheet.id}
                            field="cash"
                            reportType="bs"
                            isEditable={editableFields.cash}
                          />
                        </TableRow>
                        <TableRow>
                          <TableCell className="pl-8">ลูกหนี้การค้า</TableCell>
                          <EditableCell
                            value={sheet.accountsReceivable}
                            itemId={sheet.id}
                            field="accountsReceivable"
                            reportType="bs"
                            isEditable={editableFields.accountsReceivable}
                          />
                        </TableRow>
                        <TableRow>
                          <TableCell className="pl-8">สินค้าคงเหลือ</TableCell>
                          <EditableCell
                            value={sheet.inventory}
                            itemId={sheet.id}
                            field="inventory"
                            reportType="bs"
                            isEditable={editableFields.inventory}
                          />
                        </TableRow>
                        <TableRow className="bg-muted/30">
                          <TableCell className="font-semibold">สินทรัพย์ไม่หมุนเวียน</TableCell>
                          <EditableCell
                            value={sheet.nonCurrentAssets}
                            itemId={sheet.id}
                            field="nonCurrentAssets"
                            reportType="bs"
                            isEditable={editableFields.nonCurrentAssets}
                            className="font-semibold"
                          />
                        </TableRow>
                        <TableRow>
                          <TableCell className="pl-8">ที่ดิน อาคาร อุปกรณ์</TableCell>
                          <EditableCell
                            value={sheet.propertyPlantEquipment}
                            itemId={sheet.id}
                            field="propertyPlantEquipment"
                            reportType="bs"
                            isEditable={editableFields.propertyPlantEquipment}
                          />
                        </TableRow>
                        <TableRow>
                          <TableCell className="pl-8">สินทรัพย์ไม่มีตัวตน</TableCell>
                          <EditableCell
                            value={sheet.intangibleAssets}
                            itemId={sheet.id}
                            field="intangibleAssets"
                            reportType="bs"
                            isEditable={editableFields.intangibleAssets}
                          />
                        </TableRow>
                        <TableRow className="border-t-4 bg-primary/10">
                          <TableCell className="font-bold text-lg">สินทรัพย์รวม</TableCell>
                          <EditableCell
                            value={sheet.totalAssets}
                            itemId={sheet.id}
                            field="totalAssets"
                            reportType="bs"
                            isEditable={editableFields.totalAssets}
                            className="font-bold text-lg"
                          />
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>

                  {/* Liabilities & Equity */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">หนี้สินและส่วนของเจ้าของ</h3>
                    <Table>
                      <TableBody>
                        <TableRow className="bg-muted/30">
                          <TableCell className="font-semibold">หนี้สินหมุนเวียน</TableCell>
                          <EditableCell
                            value={sheet.currentLiabilities}
                            itemId={sheet.id}
                            field="currentLiabilities"
                            reportType="bs"
                            isEditable={editableFields.currentLiabilities}
                            className="font-semibold"
                          />
                        </TableRow>
                        <TableRow>
                          <TableCell className="pl-8">เจ้าหนี้การค้า</TableCell>
                          <EditableCell
                            value={sheet.accountsPayable}
                            itemId={sheet.id}
                            field="accountsPayable"
                            reportType="bs"
                            isEditable={editableFields.accountsPayable}
                          />
                        </TableRow>
                        <TableRow>
                          <TableCell className="pl-8">หนี้สินระยะสั้น</TableCell>
                          <EditableCell
                            value={sheet.shortTermDebt}
                            itemId={sheet.id}
                            field="shortTermDebt"
                            reportType="bs"
                            isEditable={editableFields.shortTermDebt}
                          />
                        </TableRow>
                        <TableRow className="bg-muted/30">
                          <TableCell className="font-semibold">หนี้สินระยะยาว</TableCell>
                          <EditableCell
                            value={sheet.longTermLiabilities}
                            itemId={sheet.id}
                            field="longTermLiabilities"
                            reportType="bs"
                            isEditable={editableFields.longTermLiabilities}
                            className="font-semibold"
                          />
                        </TableRow>
                        <TableRow>
                          <TableCell className="pl-8">หนี้สินระยะยาว</TableCell>
                          <EditableCell
                            value={sheet.longTermDebt}
                            itemId={sheet.id}
                            field="longTermDebt"
                            reportType="bs"
                            isEditable={editableFields.longTermDebt}
                          />
                        </TableRow>
                        <TableRow className="border-t-2 bg-muted/30">
                          <TableCell className="font-bold">หนี้สินรวม</TableCell>
                          <EditableCell
                            value={sheet.totalLiabilities}
                            itemId={sheet.id}
                            field="totalLiabilities"
                            reportType="bs"
                            isEditable={editableFields.totalLiabilities}
                            className="font-bold"
                          />
                        </TableRow>
                        <TableRow className="bg-muted/30">
                          <TableCell className="font-semibold">ส่วนของผู้ถือหุ้น</TableCell>
                          <EditableCell
                            value={sheet.shareholdersEquity}
                            itemId={sheet.id}
                            field="shareholdersEquity"
                            reportType="bs"
                            isEditable={editableFields.shareholdersEquity}
                            className="font-semibold"
                          />
                        </TableRow>
                        <TableRow>
                          <TableCell className="pl-8">กำไรสะสม</TableCell>
                          <EditableCell
                            value={sheet.retainedEarnings}
                            itemId={sheet.id}
                            field="retainedEarnings"
                            reportType="bs"
                            isEditable={editableFields.retainedEarnings}
                          />
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    );
  };

  // Cash Flow Table Component  
  const CashFlowTable = () => {
    if (cfLoading) {
      return <div className="p-8 text-center" data-testid="loading-cf">กำลังโหลดข้อมูล...</div>;
    }

    return (
      <div className="space-y-4">
        {cashFlowStatements.map((statement) => {
          const editableFields = JSON.parse(statement.isEditable || '{}');
          
          return (
            <Card key={statement.id} data-testid={`cash-flow-${statement.id}`}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    งบกระแสเงินสด - {statement.topic}
                  </CardTitle>
                  <Badge variant="secondary" data-testid={`period-badge-${statement.period}`}>
                    {statement.period}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>รายการ</TableHead>
                      <TableHead className="text-right">จำนวนเงิน (บาท)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow className="bg-blue-50 dark:bg-blue-950/20">
                      <TableCell className="font-bold">กระแสเงินสดจากการดำเนินงาน</TableCell>
                      <EditableCell
                        value={statement.operatingCashFlow}
                        itemId={statement.id}
                        field="operatingCashFlow"
                        reportType="cf"
                        isEditable={editableFields.operatingCashFlow}
                        className="font-bold"
                      />
                    </TableRow>
                    <TableRow>
                      <TableCell className="pl-8">กำไรสุทธิ</TableCell>
                      <EditableCell
                        value={statement.netIncome}
                        itemId={statement.id}
                        field="netIncome"
                        reportType="cf"
                        isEditable={editableFields.netIncome}
                      />
                    </TableRow>
                    <TableRow>
                      <TableCell className="pl-8">ค่าเสื่อมราคา</TableCell>
                      <EditableCell
                        value={statement.depreciation}
                        itemId={statement.id}
                        field="depreciation"
                        reportType="cf"
                        isEditable={editableFields.depreciation}
                      />
                    </TableRow>
                    <TableRow>
                      <TableCell className="pl-8">การเปลี่ยนแปลงในเงินทุนหมุนเวียน</TableCell>
                      <EditableCell
                        value={statement.changeInWorkingCapital}
                        itemId={statement.id}
                        field="changeInWorkingCapital"
                        reportType="cf"
                        isEditable={editableFields.changeInWorkingCapital}
                      />
                    </TableRow>
                    <TableRow className="bg-green-50 dark:bg-green-950/20">
                      <TableCell className="font-bold">กระแสเงินสดจากการลงทุน</TableCell>
                      <EditableCell
                        value={statement.investingCashFlow}
                        itemId={statement.id}
                        field="investingCashFlow"
                        reportType="cf"
                        isEditable={editableFields.investingCashFlow}
                        className="font-bold"
                      />
                    </TableRow>
                    <TableRow>
                      <TableCell className="pl-8">การลงทุนในสินทรัพย์ถาวร</TableCell>
                      <EditableCell
                        value={statement.capitalExpenditures}
                        itemId={statement.id}
                        field="capitalExpenditures"
                        reportType="cf"
                        isEditable={editableFields.capitalExpenditures}
                      />
                    </TableRow>
                    <TableRow>
                      <TableCell className="pl-8">การซื้อกิจการ</TableCell>
                      <EditableCell
                        value={statement.acquisitions}
                        itemId={statement.id}
                        field="acquisitions"
                        reportType="cf"
                        isEditable={editableFields.acquisitions}
                      />
                    </TableRow>
                    <TableRow className="bg-orange-50 dark:bg-orange-950/20">
                      <TableCell className="font-bold">กระแสเงินสดจากการจัดหาเงิน</TableCell>
                      <EditableCell
                        value={statement.financingCashFlow}
                        itemId={statement.id}
                        field="financingCashFlow"
                        reportType="cf"
                        isEditable={editableFields.financingCashFlow}
                        className="font-bold"
                      />
                    </TableRow>
                    <TableRow>
                      <TableCell className="pl-8">การกู้ยืมเงิน</TableCell>
                      <EditableCell
                        value={statement.debtIssuance}
                        itemId={statement.id}
                        field="debtIssuance"
                        reportType="cf"
                        isEditable={editableFields.debtIssuance}
                      />
                    </TableRow>
                    <TableRow>
                      <TableCell className="pl-8">การชำระคืนหนี้</TableCell>
                      <EditableCell
                        value={statement.debtRepayment}
                        itemId={statement.id}
                        field="debtRepayment"
                        reportType="cf"
                        isEditable={editableFields.debtRepayment}
                      />
                    </TableRow>
                    <TableRow>
                      <TableCell className="pl-8">เงินปันผลที่จ่าย</TableCell>
                      <EditableCell
                        value={statement.dividendsPaid}
                        itemId={statement.id}
                        field="dividendsPaid"
                        reportType="cf"
                        isEditable={editableFields.dividendsPaid}
                      />
                    </TableRow>
                    <TableRow className="border-t-4 bg-muted/50">
                      <TableCell className="font-bold text-lg">การเปลี่ยนแปลงในเงินสดสุทธิ</TableCell>
                      <EditableCell
                        value={statement.netChangeInCash}
                        itemId={statement.id}
                        field="netChangeInCash"
                        reportType="cf"
                        isEditable={editableFields.netChangeInCash}
                        className="font-bold text-lg"
                      />
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">เงินสดต้นงวด</TableCell>
                      <EditableCell
                        value={statement.beginningCashBalance}
                        itemId={statement.id}
                        field="beginningCashBalance"
                        reportType="cf"
                        isEditable={editableFields.beginningCashBalance}
                      />
                    </TableRow>
                    <TableRow className="border-t-2 bg-primary/10">
                      <TableCell className="font-bold text-lg">เงินสดปลายงวด</TableCell>
                      <EditableCell
                        value={statement.endingCashBalance}
                        itemId={statement.id}
                        field="endingCashBalance"
                        reportType="cf"
                        isEditable={editableFields.endingCashBalance}
                        className="font-bold text-lg"
                      />
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          );
        })}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-6 py-8 pt-24">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground flex items-center gap-3" data-testid="page-title">
                <FileText className="h-8 w-8" />
                รายงานการเงิน
              </h1>
              <p className="text-muted-foreground mt-2">
                ดูและแก้ไขรายงานการเงิน รวมถึงงบกำไรขาดทุน งบดุล และงบกระแสเงินสด
              </p>
            </div>
          </div>

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

                <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                  <SelectTrigger className="w-[200px]" data-testid="select-period">
                    <SelectValue placeholder="เลือกช่วงเวลา" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all" data-testid="option-all-periods">ทั้งหมด</SelectItem>
                    {uniquePeriods.map((period) => (
                      <SelectItem key={period} value={period} data-testid={`option-period-${period}`}>
                        {period}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {(selectedTopic && selectedTopic !== "all" || selectedPeriod && selectedPeriod !== "all") && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSelectedTopic("all");
                      setSelectedPeriod("all");
                    }}
                    data-testid="button-clear-filters"
                  >
                    ล้างตัวกรอง
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
      </div>
    </div>
  );
}