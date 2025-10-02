import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useKeycloak } from '@/contexts/KeycloakContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import {
  Upload,
  File,
  FileText,
  Image as ImageIcon,
  FileSpreadsheet,
  X,
  Check,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Clock,
  AlertCircle,
  Download,
  Eye,
  Database,
  TrendingUp,
  Building,
  Calendar
} from 'lucide-react';
import { cn } from '@/lib/utils';

type DataType = "master-data" | "actual" | "fix-asset" | "";
type UploadStatus = "idle" | "uploading" | "success" | "error";

interface MockFile {
  name: string;
  size: number;
  type: string;
}

interface UploadedFile {
  file: File | MockFile;
  dataType: DataType;
  status: UploadStatus;
  progress: number;
  id: string;
  recordsProcessed?: number;
  error?: string;
  uploadedAt?: string;
  companyId?: string;
  companyName?: string;
  year?: number;
}

interface Company {
  id: string;
  companyCode: string;
  shortName: string;
  fullName: string;
}

const ALLOWED_FILE_TYPES = {
  'application/pdf': { extension: '.pdf', icon: FileText, color: 'text-red-600' },
  'application/vnd.ms-excel': { extension: '.xls', icon: FileSpreadsheet, color: 'text-green-600' },
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': { extension: '.xlsx', icon: FileSpreadsheet, color: 'text-green-600' },
  'text/csv': { extension: '.csv', icon: FileSpreadsheet, color: 'text-blue-600' },
  'image/png': { extension: '.png', icon: ImageIcon, color: 'text-purple-600' },
  'image/jpeg': { extension: '.jpg', icon: ImageIcon, color: 'text-purple-600' },
  'image/jpg': { extension: '.jpg', icon: ImageIcon, color: 'text-purple-600' },
  'text/plain': { extension: '.txt', icon: FileText, color: 'text-gray-600' },
  'application/json': { extension: '.json', icon: FileText, color: 'text-yellow-600' },
};

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export default function FileUpload() {
  const { user } = useKeycloak();
  const { toast } = useToast();
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [dataType, setDataType] = useState<DataType>("");
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Generate year options (current year to current year - 3)
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 4 }, (_, i) => currentYear - i);

  // Mock companies data
  const companies: Company[] = [
    {
      id: "1",
      companyCode: "TCC001",
      shortName: "TCC Tech",
      fullName: "TCC Technology Co., Ltd."
    },
    {
      id: "2",
      companyCode: "OFS002",
      shortName: "Orion Finance",
      fullName: "Orion Financial Services Co., Ltd."
    },
    {
      id: "3",
      companyCode: "DIL003",
      shortName: "Digital Labs",
      fullName: "Digital Innovation Labs Co., Ltd."
    },
    {
      id: "4",
      companyCode: "GTC004",
      shortName: "Global Trade",
      fullName: "Global Trading Corporation"
    },
    {
      id: "5",
      companyCode: "SES005",
      shortName: "Green Energy",
      fullName: "Sustainable Energy Solutions Ltd."
    }
  ];

  // Mock upload statistics
  const uploadStats = {
    total: uploadedFiles.length,
    successful: uploadedFiles.filter(f => f.status === 'success').length,
    processing: uploadedFiles.filter(f => f.status === 'uploading').length,
    failed: uploadedFiles.filter(f => f.status === 'error').length,
    lastUpdate: new Date('2025-12-06T12:07:00')
  };

  // Mock some initial uploaded files for demonstration
  useEffect(() => {
    const mockHistoricalFiles: UploadedFile[] = [
      {
        file: {
          name: 'customer_master.xlsx',
          size: 512000,
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        },
        dataType: 'master-data',
        status: 'success',
        progress: 100,
        id: 'mock-1',
        recordsProcessed: 856,
        uploadedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
        companyName: 'Orion Financial Services Co., Ltd.'
      },
      {
        file: {
          name: 'actual_data_2023.json',
          size: 128000,
          type: 'application/json'
        },
        dataType: 'actual',
        status: 'success',
        progress: 100,
        id: 'mock-2',
        recordsProcessed: 542,
        uploadedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
        companyName: 'Digital Innovation Labs Co., Ltd.',
        year: 2023
      },
      {
        file: {
          name: 'fixed_assets_2022.xlsx',
          size: 384000,
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        },
        dataType: 'fix-asset',
        status: 'success',
        progress: 100,
        id: 'mock-3',
        recordsProcessed: 324,
        uploadedAt: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(),
        companyName: 'Sustainable Energy Solutions Ltd.',
        year: 2022
      }
    ];
    setUploadedFiles(mockHistoricalFiles);
  }, []);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const formatTimeAgo = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const getFileIcon = (type: string) => {
    const fileType = ALLOWED_FILE_TYPES[type as keyof typeof ALLOWED_FILE_TYPES];
    if (fileType) {
      const Icon = fileType.icon;
      return <Icon className={cn("h-5 w-5", fileType.color)} />;
    }
    return <File className="h-5 w-5 text-gray-600" />;
  };

  const getDataTypeIcon = (type: DataType) => {
    switch (type) {
      case "master-data":
        return <Database className="w-4 h-4 text-purple-500" />;
      case "actual":
        return <TrendingUp className="w-4 h-4 text-green-500" />;
      case "fix-asset":
        return <Building className="w-4 h-4 text-orange-500" />;
      default:
        return null;
    }
  };

  const getDataTypeLabel = (type: DataType) => {
    switch (type) {
      case "master-data":
        return "Master Data";
      case "actual":
        return "Actual Data";
      case "fix-asset":
        return "Fixed Asset Data";
      default:
        return "";
    }
  };

  const getStatusIcon = (status: UploadStatus) => {
    switch (status) {
      case "uploading":
        return <RefreshCw className="w-4 h-4 animate-spin text-blue-500" />;
      case "success":
        return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case "error":
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const validateFile = (file: File): { valid: boolean; error?: string } => {
    // Check file type
    if (!ALLOWED_FILE_TYPES[file.type as keyof typeof ALLOWED_FILE_TYPES]) {
      return {
        valid: false,
        error: 'File type not supported. Please upload CSV, Excel, or JSON files.'
      };
    }

    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      return {
        valid: false,
        error: `File size exceeds ${formatFileSize(MAX_FILE_SIZE)} limit.`
      };
    }

    return { valid: true };
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    
    // Validate each file
    const validFiles: File[] = [];
    files.forEach((file) => {
      const validation = validateFile(file);
      if (!validation.valid) {
        toast({
          title: "Invalid File",
          description: `${file.name}: ${validation.error}`,
          variant: "destructive",
        });
      } else {
        validFiles.push(file);
      }
    });

    setSelectedFiles(validFiles);
  };

  const handleUpload = async () => {
    // Validation
    if (selectedFiles.length === 0) {
      toast({
        title: "No Files Selected",
        description: "Please select files to upload",
        variant: "destructive",
      });
      return;
    }

    if (!selectedCompany) {
      toast({
        title: "Company Required",
        description: "Please select a company",
        variant: "destructive",
      });
      return;
    }

    if (!dataType) {
      toast({
        title: "Data Type Required",
        description: "Please select a data type",
        variant: "destructive",
      });
      return;
    }

    if ((dataType === 'actual' || dataType === 'fix-asset') && !selectedYear) {
      toast({
        title: "Year Required",
        description: "Please select a year for Actual or Fixed Asset data",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);

    // Create uploaded files from selected files
    const newUploadedFiles: UploadedFile[] = selectedFiles.map((file) => ({
      file,
      dataType,
      status: "uploading" as UploadStatus,
      progress: 0,
      id: Math.random().toString(36).substr(2, 9),
      companyId: selectedCompany?.id,
      companyName: selectedCompany?.fullName,
      year: selectedYear || undefined,
    }));

    setUploadedFiles(prev => [...newUploadedFiles, ...prev]);

    try {
      // Simulate progress for each file
      const progressInterval = setInterval(() => {
        setUploadedFiles(prev =>
          prev.map(f =>
            newUploadedFiles.some(nf => nf.id === f.id) && f.status === "uploading"
              ? { ...f, progress: Math.min(f.progress + 10, 90) }
              : f
          )
        );
      }, 200);

      // Mock API call - simulate processing time
      await new Promise(resolve => setTimeout(resolve, 2000));

      clearInterval(progressInterval);

      // Mock results - simulate success/failure
      const mockResults = selectedFiles.map((file) => {
        const isSuccess = Math.random() > 0.15; // 85% success rate
        return {
          filename: file.name,
          size: file.size,
          dataType,
          status: isSuccess ? 'success' : 'error',
          recordsProcessed: isSuccess ? Math.floor(Math.random() * 1000) + 50 : undefined,
          error: isSuccess ? undefined : ['Invalid file format', 'File too large', 'Corrupted data', 'Missing required columns'][Math.floor(Math.random() * 4)],
          uploadedAt: new Date().toISOString()
        };
      });

      // Update status based on mock results
      setUploadedFiles(prev => 
        prev.map(f => {
          const mockResult = mockResults.find((r: any) => r.filename === f.file.name);
          if (newUploadedFiles.some(nf => nf.id === f.id)) {
            return {
              ...f,
              status: mockResult?.status === 'success' ? "success" as UploadStatus : "error" as UploadStatus,
              progress: 100,
              recordsProcessed: mockResult?.recordsProcessed,
              error: mockResult?.error,
              uploadedAt: mockResult?.uploadedAt
            };
          }
          return f;
        })
      );

      // Show toast for results
      const successCount = mockResults.filter((r: any) => r.status === 'success').length;
      const errorCount = mockResults.filter((r: any) => r.status === 'error').length;

      if (successCount > 0) {
        toast({
          title: "Upload Successful",
          description: `Successfully uploaded ${successCount} file${successCount > 1 ? 's' : ''}${errorCount > 0 ? `, ${errorCount} failed` : ''}`,
        });
      }

      if (errorCount > 0 && successCount === 0) {
        toast({
          title: "Upload Failed",
          description: `Failed to upload ${errorCount} file${errorCount > 1 ? 's' : ''}`,
          variant: "destructive",
        });
      }

    } catch (error) {
      console.error('Upload error:', error);
      
      // Update status to error for all files
      setUploadedFiles(prev => 
        prev.map(f => 
          newUploadedFiles.some(nf => nf.id === f.id)
            ? { ...f, status: "error" as UploadStatus, progress: 100, error: "Network error" }
            : f
        )
      );

      toast({
        title: "Connection Error",
        description: "Unable to connect to server",
        variant: "destructive",
      });
    }

    setIsUploading(false);
    setSelectedFiles([]);
    setDataType("");
    setSelectedCompany(null);
    setSelectedYear(null);
    
    // Clear file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeFile = (fileId: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const isFormValid = selectedCompany && dataType && 
    (dataType === 'master-data' || (dataType === 'actual' || dataType === 'fix-asset') && selectedYear);

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-blue-100">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-blue-600">Total Updates</p>
                <p className="text-3xl font-bold text-gray-900 my-1">{uploadStats.total}</p>
                <p className="text-xs text-gray-500">
                  Latest date: {uploadStats.lastUpdate.toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: '2-digit',
                    year: '2-digit'
                  })} {uploadStats.lastUpdate.toLocaleTimeString('en-GB', {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false
                  })}
                </p>
              </div>
              <div className="h-12 w-12 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                <RefreshCw className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-100">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-green-600">Successful</p>
                <p className="text-3xl font-bold text-gray-900 my-1">{uploadStats.successful}</p>
                <p className="text-xs text-gray-500">
                  Latest date: {uploadStats.lastUpdate.toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: '2-digit',
                    year: '2-digit'
                  })} {uploadStats.lastUpdate.toLocaleTimeString('en-GB', {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false
                  })}
                </p>
              </div>
              <div className="h-12 w-12 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                <Check className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-100">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-blue-600">Processing</p>
                <p className="text-3xl font-bold text-gray-900 my-1">{uploadStats.processing}</p>
                <p className="text-xs text-gray-500">
                  Latest date: {uploadStats.lastUpdate.toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: '2-digit',
                    year: '2-digit'
                  })} {uploadStats.lastUpdate.toLocaleTimeString('en-GB', {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false
                  })}
                </p>
              </div>
              <div className="h-12 w-12 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                <Clock className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-orange-100">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-orange-600">Failed</p>
                <p className="text-3xl font-bold text-gray-900 my-1">{uploadStats.failed}</p>
                <p className="text-xs text-gray-500">
                  Latest date: {uploadStats.lastUpdate.toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: '2-digit',
                    year: '2-digit'
                  })} {uploadStats.lastUpdate.toLocaleTimeString('en-GB', {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false
                  })}
                </p>
              </div>
              <div className="h-12 w-12 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                <AlertCircle className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upload Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Upload Files
          </CardTitle>
          <CardDescription>
            Select company, data type and upload files. Supports CSV, Excel (.xlsx, .xls) and JSON (max 10MB per file)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Company Selection */}
          <div className="space-y-2">
            <Label htmlFor="company">Company *</Label>
            <Select
              value={selectedCompany?.id || ""}
              onValueChange={(value) => {
                const company = companies.find(c => c.id === value);
                setSelectedCompany(company || null);
              }}
            >
              {companies.map((company) => (
                <SelectItem key={company.id} value={company.id}>
                  <div className="flex items-center gap-2">
                    <Building className="w-4 h-4 text-blue-500" />
                    <span>{company.fullName}</span>
                    <span className="text-muted-foreground text-sm">({company.companyCode})</span>
                  </div>
                </SelectItem>
              ))}
            </Select>
          </div>

          {/* Data Type Selection */}
          <div className="space-y-2">
            <Label htmlFor="data-type">Data Type *</Label>
            <Select
              value={dataType}
              onValueChange={(value: DataType) => {
                setDataType(value);
                // Reset year selection when changing data type
                if (value !== 'actual' && value !== 'fix-asset') {
                  setSelectedYear(null);
                }
              }}
            >
              <SelectItem value="master-data">
                <div className="flex items-center gap-2">
                  <Database className="w-4 h-4 text-purple-500" />
                  Master Data
                </div>
              </SelectItem>
              <SelectItem value="actual">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-green-500" />
                  Actual Data
                </div>
              </SelectItem>
              <SelectItem value="fix-asset">
                <div className="flex items-center gap-2">
                  <Building className="w-4 h-4 text-orange-500" />
                  Fixed Asset Data
                </div>
              </SelectItem>
            </Select>
          </div>

          {/* Year Selection - only show for Actual and FixAsset */}
          {(dataType === 'actual' || dataType === 'fix-asset') && (
            <div className="space-y-2">
              <Label htmlFor="year">Year *</Label>
              <Select
                value={selectedYear?.toString() || ""}
                onValueChange={(value) => setSelectedYear(parseInt(value))}
              >
                {yearOptions.map((year) => (
                  <SelectItem key={year} value={year.toString()}>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-slate-500" />
                      {year}
                    </div>
                  </SelectItem>
                ))}
              </Select>
            </div>
          )}

          {/* File Selection */}
          <div className="space-y-2">
            <Label htmlFor="file-upload">Data Files *</Label>
            <div 
              className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-gray-400 transition-colors cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Upload className="h-5 w-5 text-gray-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Select Files</p>
                  <p className="text-xs text-gray-500">No files selected</p>
                </div>
              </div>
            </div>
            <input
              ref={fileInputRef}
              id="file-upload"
              type="file"
              multiple
              accept=".csv,.xlsx,.xls,.json"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>

          {/* Selected Files Details - Show in green boxes below the main selection */}
          {selectedFiles.length > 0 && (
            <div className="space-y-2">
              {selectedFiles.map((file, index) => (
                <div key={index} className="border-2 border-green-300 bg-green-50 rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="h-8 w-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <Check className="h-4 w-4 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                        <div className="flex items-center gap-2 text-xs text-gray-600 mt-0.5">
                          <span>{getDataTypeLabel(dataType)}</span>
                          {selectedCompany && (
                            <>
                              <span>•</span>
                              <span>{selectedCompany.shortName}</span>
                            </>
                          )}
                          <span>•</span>
                          <span>{formatFileSize(file.size)}</span>
                          {file.type.includes('spreadsheet') && (
                            <>
                              <span>•</span>
                              <span>864 Records</span>
                            </>
                          )}
                        </div>
                </div>
              </div>
                <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        const newFiles = selectedFiles.filter((_, i) => i !== index);
                        setSelectedFiles(newFiles);
                        if (newFiles.length === 0 && fileInputRef.current) {
                          fileInputRef.current.value = '';
                        }
                      }}
                      className="h-8 w-8 p-0"
                    >
                      <X className="h-4 w-4" />
                </Button>
              </div>
                </div>
              ))}
              </div>
          )}

          {/* Upload Button */}
          <Button 
            onClick={handleUpload} 
            disabled={
              selectedFiles.length === 0 || 
              !selectedCompany || 
              !dataType || 
              ((dataType === 'actual' || dataType === 'fix-asset') && !selectedYear) ||
              isUploading
            }
            className={cn(
              "w-full",
              selectedFiles.length === 0 || !selectedCompany || !dataType || ((dataType === 'actual' || dataType === 'fix-asset') && !selectedYear)
                ? "bg-blue-300 hover:bg-blue-300 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            )}
            size="lg"
          >
            {isUploading ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Uploading Files...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" />
                Upload Files
              </>
            )}
          </Button>

          {/* Supported File Types */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm font-medium text-gray-700 mb-2">Supported file types:</p>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline">CSV</Badge>
              <Badge variant="outline">Excel (.xls, .xlsx)</Badge>
              <Badge variant="outline">JSON (max 10MB per file)</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Upload History */}
      {uploadedFiles.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Upload History</CardTitle>
            <CardDescription>
              Track your uploaded files and their processing status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {uploadedFiles.map((uploadedFile) => (
                <div key={uploadedFile.id} className="border rounded-lg p-4 bg-white hover:shadow-sm transition-all duration-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      <div className={cn(
                        "h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0",
                        uploadedFile.status === 'success' && "bg-green-500",
                        uploadedFile.status === 'uploading' && "bg-blue-500",
                        uploadedFile.status === 'error' && "bg-red-500"
                      )}>
                        {uploadedFile.status === 'success' && <Check className="h-5 w-5 text-white" />}
                        {uploadedFile.status === 'uploading' && <RefreshCw className="h-5 w-5 text-white animate-spin" />}
                        {uploadedFile.status === 'error' && <AlertCircle className="h-5 w-5 text-white" />}
                  </div>
                  <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{uploadedFile.file.name}</p>
                        <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                          <span>{getDataTypeLabel(uploadedFile.dataType)}</span>
                          <span>•</span>
                          <span>{formatFileSize(uploadedFile.file.size)}</span>
                          {uploadedFile.recordsProcessed && (
                            <>
                              <span>•</span>
                              <span>{uploadedFile.recordsProcessed} records</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge 
                        className={cn(
                          "text-xs font-medium",
                          uploadedFile.status === 'success' && "bg-green-100 text-green-700 border-green-200",
                          uploadedFile.status === 'error' && "bg-red-100 text-red-700 border-red-200",
                          uploadedFile.status === 'uploading' && "bg-blue-100 text-blue-700 border-blue-200"
                        )}
                      >
                        {uploadedFile.status === 'uploading' ? `${uploadedFile.progress}%` : 
                         uploadedFile.status === 'success' ? 'Success' : 
                         uploadedFile.status === 'error' ? 'Failed' : uploadedFile.status}
                      </Badge>
                      {uploadedFile.status !== "uploading" && (
                      <Button
                        variant="ghost"
                        size="sm"
                          onClick={() => removeFile(uploadedFile.id)}
                          className="h-8 w-8 p-0"
                      >
                          <X className="w-4 h-4" />
                      </Button>
                    )}
                    </div>
                  </div>
                  
                  {uploadedFile.status === "uploading" && (
                    <Progress value={uploadedFile.progress} className="h-1.5 mt-3" />
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Info Cards */}
      <div className="grid md:grid-cols-3 gap-6">
      <Card>
        <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-500" />
              Actual Data
            </CardTitle>
        </CardHeader>
        <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Actual financial performance data for specific years
            </p>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li className="flex items-center gap-2">
                <div className="w-1 h-1 bg-green-500 rounded-full" />
                Requires year selection
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1 h-1 bg-green-500 rounded-full" />
                Company-specific data
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1 h-1 bg-green-500 rounded-full" />
                Historical performance tracking
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1 h-1 bg-green-500 rounded-full" />
                Maximum file size: 10MB
              </li>
            </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
              <Database className="w-5 h-5 text-purple-500" />
              Master Data
          </CardTitle>
        </CardHeader>
        <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Core system data such as customers, products, departments
            </p>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li className="flex items-center gap-2">
                <div className="w-1 h-1 bg-purple-500 rounded-full" />
                CSV, Excel or JSON files
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1 h-1 bg-purple-500 rounded-full" />
                Must include ID or Code column
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1 h-1 bg-purple-500 rounded-full" />
                Duplicate data validation
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1 h-1 bg-purple-500 rounded-full" />
                Maximum file size: 10MB
              </li>
              </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="w-5 h-5 text-orange-500" />
              Fixed Asset Data
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Fixed asset information including depreciation data
            </p>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li className="flex items-center gap-2">
                <div className="w-1 h-1 bg-orange-500 rounded-full" />
                Requires year selection
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1 h-1 bg-orange-500 rounded-full" />
                Asset tracking and depreciation
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1 h-1 bg-orange-500 rounded-full" />
                Company-specific assets
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1 h-1 bg-orange-500 rounded-full" />
                Maximum file size: 10MB
              </li>
              </ul>
        </CardContent>
      </Card>
      </div>
    </div>
  );
}
