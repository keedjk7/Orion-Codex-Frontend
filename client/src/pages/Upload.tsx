import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useToast } from "@/hooks/use-toast";
import Navigation from "@/components/Navigation";
import { 
  Upload as UploadIcon, 
  FileText, 
  Database, 
  CheckCircle, 
  AlertCircle, 
  X, 
  File,
  TrendingUp,
  Activity,
  Clock,
  Zap,
  Building,
  Check,
  ChevronsUpDown,
  Calendar
} from "lucide-react";
import heroBackground from "@assets/generated_images/Gradient_mesh_hero_background_83768b02.png";

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
  description?: string;
  industry?: string;
  headquarters?: string;
}

export default function Upload() {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [dataType, setDataType] = useState<DataType>("");
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [companySearchOpen, setCompanySearchOpen] = useState(false);
  const [companySearchValue, setCompanySearchValue] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoadingCompanies, setIsLoadingCompanies] = useState(false);
  const { toast } = useToast();

  // Generate year options (current year to current year - 3)
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 4 }, (_, i) => currentYear - i);

  // Load companies on component mount - using same mock data as CompanyAccount
  useEffect(() => {
    const loadCompanies = async () => {
      setIsLoadingCompanies(true);
      
      // Mock data matching CompanyAccount.tsx
      const mockCompaniesData: Company[] = [
        {
          id: "1",
          companyCode: "TCC001",
          shortName: "TCC Tech",
          fullName: "TCC Technology Co., Ltd.",
          description: "Leading technology solutions provider",
          industry: "Technology",
          headquarters: "Bangkok, Thailand"
        },
        {
          id: "2",
          companyCode: "OFS002",
          shortName: "Orion Finance",
          fullName: "Orion Financial Services Co., Ltd.",
          description: "Comprehensive financial management solutions",
          industry: "Financial Services",
          headquarters: "Singapore"
        },
        {
          id: "3",
          companyCode: "DIL003",
          shortName: "Digital Labs",
          fullName: "Digital Innovation Labs Co., Ltd.",
          description: "Research and development in digital transformation",
          industry: "Research & Development",
          headquarters: "Tokyo, Japan"
        },
        {
          id: "4",
          companyCode: "GTC004",
          shortName: "Global Trade",
          fullName: "Global Trading Corporation",
          description: "International trading and logistics",
          industry: "Trading & Logistics",
          headquarters: "Hong Kong"
        },
        {
          id: "5",
          companyCode: "SES005",
          shortName: "Green Energy",
          fullName: "Sustainable Energy Solutions Ltd.",
          description: "Renewable energy and sustainability consulting",
          industry: "Energy & Environment",
          headquarters: "Seoul, South Korea"
        }
      ];
      
      // Simulate loading delay
      setTimeout(() => {
        setCompanies(mockCompaniesData);
        setIsLoadingCompanies(false);
      }, 500);
    };
    
    loadCompanies();
  }, []);

  // Mock some initial uploaded files for demonstration
  const [hasInitialData] = useState(() => {
    // Add some mock historical data using plain objects instead of File constructor
    const mockHistoricalFiles: UploadedFile[] = [
      {
        file: {
          name: 'customer_master.xlsx',
          size: 512000, // 500KB
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        },
        dataType: 'master-data',
        status: 'success',
        progress: 100,
        id: 'mock-2',
        recordsProcessed: 856,
        uploadedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5 hours ago
        companyName: 'Orion Financial Services Co., Ltd.'
      },
      {
        file: {
          name: 'actual_data_2023.json',
          size: 128000, // 125KB
          type: 'application/json'
        },
        dataType: 'actual',
        status: 'success',
        progress: 100,
        id: 'mock-4',
        recordsProcessed: 542,
        uploadedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), // 12 hours ago
        companyName: 'Digital Innovation Labs Co., Ltd.',
        year: 2023
      },
      {
        file: {
          name: 'fixed_assets_2022.xlsx',
          size: 384000, // 375KB
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        },
        dataType: 'fix-asset',
        status: 'success',
        progress: 100,
        id: 'mock-5',
        recordsProcessed: 324,
        uploadedAt: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(), // 18 hours ago
        companyName: 'Sustainable Energy Solutions Ltd.',
        year: 2022
      }
    ];
    setUploadedFiles(mockHistoricalFiles);
    return true;
  });

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setSelectedFiles(files);
  };

  const handleUpload = async () => {
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
        description: "Please select a year for Actual or FixAsset data",
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

    setUploadedFiles(prev => [...prev, ...newUploadedFiles]);

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
      const mockResults = selectedFiles.map((file, index) => {
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
  };

  const removeFile = (fileId: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const getStatusIcon = (status: UploadStatus) => {
    switch (status) {
      case "uploading":
        return <UploadIcon className="w-4 h-4 animate-spin" />;
      case "success":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "error":
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
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

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
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

  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-no-repeat relative"
      style={{ backgroundImage: `url(${heroBackground})` }}
    >
      <div className="absolute inset-0 bg-white/90 dark:bg-slate-900/90"></div>
      <Navigation />
      
      <div className="relative z-10 container mx-auto px-6 py-8 mt-20">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg">
              <UploadIcon className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-slate-900 dark:text-white">
                Data Upload Center
              </h1>
              <p className="text-slate-600 dark:text-slate-400 text-lg">
                Upload and manage your financial data files
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-8">

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6">
            <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
              <CardContent className="p-3 md:p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs md:text-sm font-medium text-blue-700 dark:text-blue-300">Total Uploads</p>
                    <p className="text-xl md:text-2xl font-bold text-blue-900 dark:text-blue-100">
                      {uploadedFiles.length}
                    </p>
                  </div>
                  <div className="h-10 w-10 md:h-12 md:w-12 bg-blue-200 dark:bg-blue-800 rounded-full flex items-center justify-center">
                    <UploadIcon className="h-5 w-5 md:h-6 md:w-6 text-blue-700 dark:text-blue-300" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/50 dark:to-green-900/50 border-green-200 dark:border-green-800 hover:shadow-lg transition-all duration-300">
              <CardContent className="p-3 md:p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs md:text-sm font-medium text-green-700 dark:text-green-300">Successful</p>
                    <p className="text-xl md:text-2xl font-bold text-green-900 dark:text-green-100">
                      {uploadedFiles.filter(f => f.status === 'success').length}
                    </p>
                  </div>
                  <div className="h-10 w-10 md:h-12 md:w-12 bg-green-200 dark:bg-green-800 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-5 w-5 md:h-6 md:w-6 text-green-700 dark:text-green-300" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/50 dark:to-purple-900/50 border-purple-200 dark:border-purple-800 hover:shadow-lg transition-all duration-300">
              <CardContent className="p-3 md:p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs md:text-sm font-medium text-purple-700 dark:text-purple-300">Processing</p>
                    <p className="text-xl md:text-2xl font-bold text-purple-900 dark:text-purple-100">
                      {uploadedFiles.filter(f => f.status === 'uploading').length}
                    </p>
                  </div>
                  <div className="h-10 w-10 md:h-12 md:w-12 bg-purple-200 dark:bg-purple-800 rounded-full flex items-center justify-center">
                    <Activity className="h-5 w-5 md:h-6 md:w-6 text-purple-700 dark:text-purple-300" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950/50 dark:to-orange-900/50 border-orange-200 dark:border-orange-800 hover:shadow-lg transition-all duration-300">
              <CardContent className="p-3 md:p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs md:text-sm font-medium text-orange-700 dark:text-orange-300">Failed</p>
                    <p className="text-xl md:text-2xl font-bold text-orange-900 dark:text-orange-100">
                      {uploadedFiles.filter(f => f.status === 'error').length}
                    </p>
                  </div>
                  <div className="h-10 w-10 md:h-12 md:w-12 bg-orange-200 dark:bg-orange-800 rounded-full flex items-center justify-center">
                    <AlertCircle className="h-5 w-5 md:h-6 md:w-6 text-orange-700 dark:text-orange-300" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Upload Form */}
          <Card className="bg-card/95 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UploadIcon className="w-5 h-5" />
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
                <Popover open={companySearchOpen} onOpenChange={setCompanySearchOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={companySearchOpen}
                      className="w-full justify-between"
                      disabled={isLoadingCompanies}
                    >
                      {selectedCompany ? (
                        <div className="flex items-center gap-2">
                          <Building className="w-4 h-4 text-blue-500" />
                          <span>{selectedCompany.fullName}</span>
                          <span className="text-muted-foreground text-sm">({selectedCompany.companyCode})</span>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">
                          {isLoadingCompanies ? "Loading companies..." : "Select company..."}
                        </span>
                      )}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0" align="start">
                    <Command>
                      <CommandInput
                        placeholder="Search companies..."
                        value={companySearchValue}
                        onValueChange={setCompanySearchValue}
                      />
                      <CommandList>
                        <CommandEmpty>No companies found.</CommandEmpty>
                        <CommandGroup>
                          {companies
                            .filter((company) => 
                              company.shortName.toLowerCase().includes(companySearchValue.toLowerCase()) ||
                              company.fullName.toLowerCase().includes(companySearchValue.toLowerCase()) ||
                              company.companyCode.toLowerCase().includes(companySearchValue.toLowerCase())
                            )
                            .map((company) => (
                            <CommandItem
                              key={company.id}
                              onSelect={() => {
                                setSelectedCompany(company);
                                setCompanySearchOpen(false);
                                setCompanySearchValue("");
                              }}
                              className="flex items-center gap-2"
                            >
                              <Check
                                className={`mr-2 h-4 w-4 ${
                                  selectedCompany?.id === company.id ? "opacity-100" : "opacity-0"
                                }`}
                              />
                              <Building className="w-4 h-4 text-blue-500" />
                              <div className="flex flex-col">
                                <span className="font-medium">{company.fullName}</span>
                                <span className="text-sm text-muted-foreground">
                                  {company.companyCode} • {company.shortName}
                                </span>
                              </div>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>

              {/* Data Type Selection */}
              <div className="space-y-2">
                <Label htmlFor="data-type">Data Type *</Label>
                <Select value={dataType} onValueChange={(value: DataType) => {
                  setDataType(value);
                  // Reset year selection when changing data type
                  if (value !== 'actual' && value !== 'fix-asset') {
                    setSelectedYear(null);
                  }
                }}>
                  <SelectTrigger id="data-type">
                    <SelectValue placeholder="Select data type" />
                  </SelectTrigger>
                  <SelectContent>
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
                  </SelectContent>
                </Select>
              </div>

              {/* Year Selection - only show for Actual and FixAsset */}
              {(dataType === 'actual' || dataType === 'fix-asset') && (
                <div className="space-y-2">
                  <Label htmlFor="year">Year *</Label>
                  <Select value={selectedYear?.toString() || ""} onValueChange={(value) => setSelectedYear(parseInt(value))}>
                    <SelectTrigger id="year">
                      <SelectValue placeholder="Select year" />
                    </SelectTrigger>
                    <SelectContent>
                      {yearOptions.map((year) => (
                        <SelectItem key={year} value={year.toString()}>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-slate-500" />
                            {year}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* File Selection */}
              <div className="space-y-2">
                <Label htmlFor="file-upload">Select Files *</Label>
                <Input
                  id="file-upload"
                  type="file"
                  multiple
                  accept=".csv,.xlsx,.xls,.json"
                  onChange={handleFileSelect}
                  className="cursor-pointer"
                />
              </div>

              {/* Selected Files Preview */}
              {selectedFiles.length > 0 && (
                <div className="space-y-2">
                  <Label>Selected Files ({selectedFiles.length} files)</Label>
                  <div className="space-y-2">
                    {selectedFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg bg-gradient-to-r from-card/60 to-card/40 hover:shadow-md transition-all duration-200">
                        <div className="flex items-center gap-3">
                          <File className="w-4 h-4 text-muted-foreground" />
                          <div>
                            <p className="text-sm font-medium">{file.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {formatFileSize(file.size)}
                            </p>
                          </div>
                        </div>
                        {dataType && getDataTypeIcon(dataType)}
                      </div>
                    ))}
                  </div>
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
                className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg hover:shadow-primary/25"
                size="lg"
              >
                {isUploading ? (
                  <>
                    <UploadIcon className="w-4 h-4 mr-2 animate-spin" />
                    Uploading Files...
                  </>
                ) : (
                  <>
                    <UploadIcon className="w-4 h-4 mr-2" />
                    Upload Files
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Upload History */}
          {uploadedFiles.length > 0 && (
            <Card className="bg-card/95 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Upload History
                </CardTitle>
                <CardDescription>
                  Track your uploaded files and their processing status
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-96">
                  <div className="space-y-4">
                    {uploadedFiles.map((uploadedFile) => (
                      <div key={uploadedFile.id} className="border rounded-lg p-4 bg-gradient-to-r from-card/60 to-card/40 hover:shadow-md transition-all duration-200">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            {getStatusIcon(uploadedFile.status)}
                            <div>
                              <p className="text-sm font-medium">{uploadedFile.file.name}</p>
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                {getDataTypeIcon(uploadedFile.dataType)}
                                <span>{getDataTypeLabel(uploadedFile.dataType)}</span>
                                {uploadedFile.companyName && (
                                  <>
                                    <span>•</span>
                                    <span>{uploadedFile.companyName}</span>
                                  </>
                                )}
                                {uploadedFile.year && (
                                  <>
                                    <span>•</span>
                                    <span>{uploadedFile.year}</span>
                                  </>
                                )}
                                <span>•</span>
                                <span>{formatFileSize(uploadedFile.file.size)}</span>
                                {uploadedFile.recordsProcessed && (
                                  <>
                                    <span>•</span>
                                    <span>{uploadedFile.recordsProcessed} records</span>
                                  </>
                                )}
                                {uploadedFile.uploadedAt && (
                                  <>
                                    <span>•</span>
                                    <span>{formatTimeAgo(uploadedFile.uploadedAt)}</span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge 
                              variant={
                                uploadedFile.status === 'success' ? 'default' :
                                uploadedFile.status === 'error' ? 'destructive' :
                                uploadedFile.status === 'uploading' ? 'secondary' : 'outline'
                              }
                              className="text-xs"
                            >
                              {uploadedFile.status === 'uploading' ? `${uploadedFile.progress}%` : uploadedFile.status}
                            </Badge>
                            {uploadedFile.status !== "uploading" && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeFile(uploadedFile.id)}
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                        </div>
                        
                        {uploadedFile.status === "uploading" && (
                          <Progress value={uploadedFile.progress} className="h-2 mb-2" />
                        )}
                        
                        {uploadedFile.status === "success" && (
                          <Alert className="mt-2">
                            <CheckCircle className="h-4 w-4" />
                            <AlertDescription>
                              File uploaded and processed successfully
                              {uploadedFile.recordsProcessed && ` (${uploadedFile.recordsProcessed} records processed)`}
                            </AlertDescription>
                          </Alert>
                        )}
                        
                        {uploadedFile.status === "error" && (
                          <Alert variant="destructive" className="mt-2">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>
                              Failed to upload file
                              {uploadedFile.error && `: ${uploadedFile.error}`}
                            </AlertDescription>
                          </Alert>
                        )}
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          )}

          {/* Info Cards */}
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="bg-card/95 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 border-0">
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

            <Card className="bg-card/95 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="w-5 h-5 text-purple-500" />
                  Master Data
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Core system data such as customers, products, departments, and organizational units
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
                    Duplicate data validation included
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1 h-1 bg-purple-500 rounded-full" />
                    Maximum file size: 10MB
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-card/95 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="w-5 h-5 text-orange-500" />
                  Fixed Asset Data
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Fixed asset information including depreciation and asset lifecycle data
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
      </div>
    </div>
  );
}

