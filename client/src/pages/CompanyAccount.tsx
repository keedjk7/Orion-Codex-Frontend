import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2, Building2, Database, TrendingUp, Activity, Users } from "lucide-react";
import Navigation from "@/components/Navigation";
import heroBackground from "@assets/generated_images/Gradient_mesh_hero_background_83768b02.png";

interface Company {
  id: string;
  companyCode: string;
  shortName: string;
  fullName: string;
  description?: string;
  industry?: string;
  headquarters?: string;
  createdAt: string;
  updatedAt: string;
}

export default function CompanyAccount() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  const [formData, setFormData] = useState({ 
    companyCode: "", 
    shortName: "",
    fullName: ""
  });
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  // Mock data for demonstration
  useEffect(() => {
    const mockData: Company[] = [
      {
        id: "1",
        companyCode: "TCC001",
        shortName: "TCC Tech",
        fullName: "TCC Technology Co., Ltd.",
        createdAt: "2024-01-15T10:30:00Z",
        updatedAt: "2024-01-15T10:30:00Z",
      },
      {
        id: "2",
        companyCode: "OFS002",
        shortName: "Orion Finance",
        fullName: "Orion Financial Services Co., Ltd.",
        createdAt: "2024-01-16T14:20:00Z",
        updatedAt: "2024-01-16T14:20:00Z",
      },
      {
        id: "3",
        companyCode: "DIL003",
        shortName: "Digital Labs",
        fullName: "Digital Innovation Labs Co., Ltd.",
        createdAt: "2024-01-17T09:15:00Z",
        updatedAt: "2024-01-17T09:15:00Z",
      },
      {
        id: "4",
        companyCode: "GTC004",
        shortName: "Global Trade",
        fullName: "Global Trading Corporation",
        createdAt: "2024-01-18T11:45:00Z",
        updatedAt: "2024-01-18T11:45:00Z",
      },
      {
        id: "5",
        companyCode: "SES005",
        shortName: "Green Energy",
        fullName: "Sustainable Energy Solutions Ltd.",
        createdAt: "2024-01-19T16:30:00Z",
        updatedAt: "2024-01-19T16:30:00Z",
      },
    ];
    
    setTimeout(() => {
      setCompanies(mockData);
      setLoading(false);
    }, 1000);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.shortName.trim() || !formData.fullName.trim() || !formData.companyCode.trim()) {
      toast({
        title: "Error",
        description: "Company code, short name, and full name are required",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (editingCompany) {
        // Update existing company
        setCompanies(prev => prev.map(company => 
          company.id === editingCompany.id 
            ? { 
                ...company, 
                companyCode: formData.companyCode,
                shortName: formData.shortName,
                fullName: formData.fullName,
                updatedAt: new Date().toISOString() 
              }
            : company
        ));
        toast({
          title: "Success",
          description: "Company updated successfully",
        });
      } else {
        // Add new company
        const newCompany: Company = {
          id: Date.now().toString(),
          companyCode: formData.companyCode,
          shortName: formData.shortName,
          fullName: formData.fullName,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        setCompanies(prev => [...prev, newCompany]);
        toast({
          title: "Success",
          description: "Company added successfully",
        });
      }
      
      setDialogOpen(false);
      setFormData({ companyCode: "", shortName: "", fullName: "" });
      setEditingCompany(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save company",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (company: Company) => {
    setEditingCompany(company);
    setFormData({ 
      companyCode: company.companyCode,
      shortName: company.shortName,
      fullName: company.fullName
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setCompanies(prev => prev.filter(company => company.id !== id));
      toast({
        title: "Success",
        description: "Company deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete company",
        variant: "destructive",
      });
    }
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setFormData({ companyCode: "", shortName: "", fullName: "" });
    setEditingCompany(null);
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
            <div className="p-3 rounded-xl bg-gradient-to-br from-green-500 to-green-600 text-white shadow-lg">
              <Building2 className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-slate-900 dark:text-white">
                Company Account
              </h1>
              <p className="text-slate-600 dark:text-slate-400 text-lg">
                Manage company information and profiles
              </p>
            </div>
          </div>
          
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Companies</CardTitle>
                <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/50">
                  <Database className="h-4 w-4 text-green-600 dark:text-green-400" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-slate-900 dark:text-white">{companies.length}</div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Registered entities
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">Company Codes</CardTitle>
                <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/50">
                  <Activity className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-slate-900 dark:text-white">
                  {new Set(companies.map(c => c.companyCode)).size}
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Unique identifiers
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">Management Status</CardTitle>
                <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/50">
                  <TrendingUp className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-slate-900 dark:text-white">Active</div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  System ready
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Companies Section */}
        <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
          <CardHeader className="border-b border-slate-200 dark:border-slate-700 pb-4">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-2xl font-bold text-slate-900 dark:text-white">
                  Company Management
                </CardTitle>
                <CardDescription className="text-slate-600 dark:text-slate-400 mt-1">
                  Manage company profiles and organizational information
                </CardDescription>
              </div>
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button 
                    onClick={() => handleDialogClose()}
                    className="bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Company
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <form onSubmit={handleSubmit}>
                    <DialogHeader>
                      <DialogTitle className="text-xl font-semibold">
                        {editingCompany ? "Edit Company" : "Add New Company"}
                      </DialogTitle>
                      <DialogDescription className="text-slate-600 dark:text-slate-400">
                        {editingCompany 
                          ? "Update the company information below."
                          : "Enter the details for the new company."
                        }
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="companyCode" className="text-right font-medium">
                          Company Code *
                        </Label>
                        <Input
                          id="companyCode"
                          value={formData.companyCode}
                          onChange={(e) => setFormData({ ...formData, companyCode: e.target.value })}
                          className="col-span-3 border-slate-300 dark:border-slate-600"
                          placeholder="Enter company code"
                          required
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="shortName" className="text-right font-medium">
                          Short Name *
                        </Label>
                        <Input
                          id="shortName"
                          value={formData.shortName}
                          onChange={(e) => setFormData({ ...formData, shortName: e.target.value })}
                          className="col-span-3 border-slate-300 dark:border-slate-600"
                          placeholder="Enter short name"
                          required
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="fullName" className="text-right font-medium">
                          Full Name *
                        </Label>
                        <Input
                          id="fullName"
                          value={formData.fullName}
                          onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                          className="col-span-3 border-slate-300 dark:border-slate-600"
                          placeholder="Enter full company name"
                          required
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="button" variant="outline" onClick={handleDialogClose}>
                        Cancel
                      </Button>
                      <Button 
                        type="submit" 
                        disabled={submitting}
                        className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white"
                      >
                        {submitting ? "Saving..." : (editingCompany ? "Update" : "Add")}
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="flex flex-col justify-center items-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mb-4"></div>
                <p className="text-slate-600 dark:text-slate-400">Loading companies...</p>
              </div>
            ) : (
              <div className="overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700/50">
                      <TableHead className="font-semibold text-slate-900 dark:text-white py-4">Code</TableHead>
                      <TableHead className="font-semibold text-slate-900 dark:text-white py-4">Short Name</TableHead>
                      <TableHead className="font-semibold text-slate-900 dark:text-white py-4">Full Name</TableHead>
                      <TableHead className="text-right font-semibold text-slate-900 dark:text-white py-4">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {companies.map((company, index) => (
                      <TableRow 
                        key={company.id}
                        className={`hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors ${
                          index % 2 === 0 ? 'bg-white dark:bg-slate-800/30' : 'bg-slate-50/50 dark:bg-slate-700/20'
                        }`}
                      >
                        <TableCell className="text-slate-600 dark:text-slate-400 py-4">
                          <Badge variant="outline" className="font-mono">
                            {company.companyCode}
                          </Badge>
                        </TableCell>
                        <TableCell className="py-4">
                          <div className="font-medium text-slate-900 dark:text-white">
                            {company.shortName}
                          </div>
                        </TableCell>
                        <TableCell className="py-4">
                          <div className="font-medium text-slate-900 dark:text-white">
                            {company.fullName}
                          </div>
                        </TableCell>
                        <TableCell className="text-right py-4">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEdit(company)}
                              className="hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700 dark:hover:bg-blue-900 dark:hover:border-blue-700 dark:hover:text-blue-300"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  className="hover:bg-red-50 hover:border-red-200 hover:text-red-700 dark:hover:bg-red-900 dark:hover:border-red-700 dark:hover:text-red-300"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete the
                                    company "{company.fullName}" from the system.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDelete(company.id)}
                                    className="bg-red-600 hover:bg-red-700 text-white"
                                  >
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                    {companies.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-12 text-slate-500 dark:text-slate-400">
                          <div className="flex flex-col items-center gap-2">
                            <Building2 className="w-12 h-12 text-slate-300 dark:text-slate-600" />
                            <p className="text-lg font-medium">No companies found</p>
                            <p className="text-sm">Add your first company to get started.</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
