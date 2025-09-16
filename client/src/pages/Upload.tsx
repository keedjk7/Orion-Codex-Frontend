import { useState } from "react";
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
  Zap
} from "lucide-react";
import heroBackground from "@assets/generated_images/Gradient_mesh_hero_background_83768b02.png";

type DataType = "transaction" | "master-data" | "";
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
}

export default function Upload() {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [dataType, setDataType] = useState<DataType>("");
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  // Mock some initial uploaded files for demonstration
  const [hasInitialData] = useState(() => {
    // Add some mock historical data using plain objects instead of File constructor
    const mockHistoricalFiles: UploadedFile[] = [
      {
        file: {
          name: 'transactions_2024_q1.csv',
          size: 245760, // 240KB
          type: 'text/csv'
        },
        dataType: 'transaction',
        status: 'success',
        progress: 100,
        id: 'mock-1',
        recordsProcessed: 1247,
        uploadedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() // 2 hours ago
      },
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
        uploadedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString() // 5 hours ago
      },
      {
        file: {
          name: 'failed_import.json',
          size: 128000, // 125KB
          type: 'application/json'
        },
        dataType: 'transaction',
        status: 'error',
        progress: 100,
        id: 'mock-3',
        error: 'Invalid JSON format',
        uploadedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() // 1 day ago
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

    if (!dataType) {
      toast({
        title: "Data Type Required",
        description: "Please select a data type (Transaction or Master Data)",
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
      case "transaction":
        return <FileText className="w-4 h-4 text-blue-500" />;
      case "master-data":
        return <Database className="w-4 h-4 text-purple-500" />;
      default:
        return null;
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
                Select data type and upload files. Supports CSV, Excel (.xlsx, .xls) and JSON (max 10MB per file)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Data Type Selection */}
              <div className="space-y-2">
                <Label htmlFor="data-type">Data Type *</Label>
                <Select value={dataType} onValueChange={(value: DataType) => setDataType(value)}>
                  <SelectTrigger id="data-type">
                    <SelectValue placeholder="Select data type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="transaction">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-blue-500" />
                        Transaction Data
                      </div>
                    </SelectItem>
                    <SelectItem value="master-data">
                      <div className="flex items-center gap-2">
                        <Database className="w-4 h-4 text-purple-500" />
                        Master Data
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

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
                disabled={selectedFiles.length === 0 || !dataType || isUploading}
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
                                <span>
                                  {uploadedFile.dataType === "transaction" ? "Transaction Data" : "Master Data"}
                                </span>
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
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="bg-card/95 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-500" />
                  Transaction Data
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Financial transaction data such as income, expenses, purchases, and transfers
                </p>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li className="flex items-center gap-2">
                    <div className="w-1 h-1 bg-blue-500 rounded-full" />
                    CSV, Excel or JSON files
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1 h-1 bg-blue-500 rounded-full" />
                    Must include date and amount columns
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1 h-1 bg-blue-500 rounded-full" />
                    Supports multiple file upload
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1 h-1 bg-blue-500 rounded-full" />
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
          </div>
        </div>
      </div>
    </div>
  );
}

