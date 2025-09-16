import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { 
  Plus, 
  Edit, 
  Trash2, 
  MapPin, 
  Link as LinkIcon, 
  Database, 
  TrendingUp, 
  Activity, 
  Search,
  Check,
  ChevronsUpDown,
  Filter
} from "lucide-react";
import Navigation from "@/components/Navigation";
import heroBackground from "@assets/generated_images/Gradient_mesh_hero_background_83768b02.png";
import { cn } from "@/lib/utils";

interface PlAccount {
  id: string;
  plAccount: string;
  createdAt: string;
  updatedAt: string;
}

interface IoMapping {
  id: string;
  description: string;
  accountId: string;
  account?: PlAccount; // For joined data
  createdAt: string;
  updatedAt: string;
}

export default function IoMapping() {
  const [ioMappings, setIoMappings] = useState<IoMapping[]>([]);
  const [plAccounts, setPlAccounts] = useState<PlAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingMapping, setEditingMapping] = useState<IoMapping | null>(null);
  const [formData, setFormData] = useState({ 
    description: "", 
    accountId: "" 
  });
  const [submitting, setSubmitting] = useState(false);
  const [accountSearchOpen, setAccountSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterAccount, setFilterAccount] = useState("all");
  const [editingAccountId, setEditingAccountId] = useState<string | null>(null);
  const [editingAccountSearchOpen, setEditingAccountSearchOpen] = useState(false);
  const { toast } = useToast();

  // Mock data for demonstration
  useEffect(() => {
    const mockPlAccounts: PlAccount[] = [
      {
        id: "1",
        plAccount: "Revenue - Sales",
        createdAt: "2024-01-15T10:30:00Z",
        updatedAt: "2024-01-15T10:30:00Z",
      },
      {
        id: "2",
        plAccount: "Cost of Goods Sold",
        createdAt: "2024-01-16T14:20:00Z",
        updatedAt: "2024-01-16T14:20:00Z",
      },
      {
        id: "3",
        plAccount: "Operating Expenses",
        createdAt: "2024-01-17T09:15:00Z",
        updatedAt: "2024-01-17T09:15:00Z",
      },
      {
        id: "4",
        plAccount: "Marketing & Advertising",
        createdAt: "2024-01-18T11:45:00Z",
        updatedAt: "2024-01-18T11:45:00Z",
      },
      {
        id: "5",
        plAccount: "Research & Development",
        createdAt: "2024-01-19T16:30:00Z",
        updatedAt: "2024-01-19T16:30:00Z",
      },
    ];

    const mockIoMappings: IoMapping[] = [
      {
        id: "2024001001",
        description: "Sales revenue from e-commerce platform",
        accountId: "1",
        account: mockPlAccounts[0],
        createdAt: "2024-01-20T10:30:00Z",
        updatedAt: "2024-01-20T10:30:00Z",
      },
      {
        id: "2024001002", 
        description: "Direct material costs for production",
        accountId: "2",
        account: mockPlAccounts[1],
        createdAt: "2024-01-21T14:20:00Z",
        updatedAt: "2024-01-21T14:20:00Z",
      },
      {
        id: "2024001003",
        description: "Office rent and utilities",
        accountId: "",
        account: undefined,
        createdAt: "2024-01-22T09:15:00Z",
        updatedAt: "2024-01-22T09:15:00Z",
      },
      {
        id: "2024001004",
        description: "Digital marketing campaigns",
        accountId: "4",
        account: mockPlAccounts[3],
        createdAt: "2024-01-23T11:45:00Z",
        updatedAt: "2024-01-23T11:45:00Z",
      },
      {
        id: "2024001005",
        description: "Employee training and development",
        accountId: "",
        account: undefined,
        createdAt: "2024-01-24T16:20:00Z",
        updatedAt: "2024-01-24T16:20:00Z",
      },
      {
        id: "2024001006",
        description: "Software licensing and subscriptions",
        accountId: "3",
        account: mockPlAccounts[2],
        createdAt: "2024-01-25T08:15:00Z",
        updatedAt: "2024-01-25T08:15:00Z",
      },
      {
        id: "2024001007",
        description: "Raw materials inventory purchase",
        accountId: "2",
        account: mockPlAccounts[1],
        createdAt: "2024-01-26T13:22:00Z",
        updatedAt: "2024-01-26T13:22:00Z",
      },
      {
        id: "2024001008",
        description: "Online advertising and SEO services",
        accountId: "4",
        account: mockPlAccounts[3],
        createdAt: "2024-01-27T10:45:00Z",
        updatedAt: "2024-01-27T10:45:00Z",
      },
      {
        id: "2024001009",
        description: "Equipment maintenance and repairs",
        accountId: "",
        account: undefined,
        createdAt: "2024-01-28T14:30:00Z",
        updatedAt: "2024-01-28T14:30:00Z",
      },
      {
        id: "2024001010",
        description: "Customer service platform subscription",
        accountId: "3",
        account: mockPlAccounts[2],
        createdAt: "2024-01-29T09:20:00Z",
        updatedAt: "2024-01-29T09:20:00Z",
      },
      {
        id: "2024001011",
        description: "Product development and innovation",
        accountId: "5",
        account: mockPlAccounts[4],
        createdAt: "2024-01-30T11:10:00Z",
        updatedAt: "2024-01-30T11:10:00Z",
      },
      {
        id: "2024001012",
        description: "Retail store sales commission",
        accountId: "1",
        account: mockPlAccounts[0],
        createdAt: "2024-02-01T15:45:00Z",
        updatedAt: "2024-02-01T15:45:00Z",
      },
      {
        id: "2024001013",
        description: "Telecommunications and internet services",
        accountId: "",
        account: undefined,
        createdAt: "2024-02-02T12:30:00Z",
        updatedAt: "2024-02-02T12:30:00Z",
      },
      {
        id: "2024001014",
        description: "Professional consulting services",
        accountId: "3",
        account: mockPlAccounts[2],
        createdAt: "2024-02-03T16:15:00Z",
        updatedAt: "2024-02-03T16:15:00Z",
      },
      {
        id: "2024001015",
        description: "Quality assurance and testing",
        accountId: "5",
        account: mockPlAccounts[4],
        createdAt: "2024-02-04T08:50:00Z",
        updatedAt: "2024-02-04T08:50:00Z",
      },
      {
        id: "2024001016",
        description: "Warehouse storage and logistics",
        accountId: "2",
        account: mockPlAccounts[1],
        createdAt: "2024-02-05T13:25:00Z",
        updatedAt: "2024-02-05T13:25:00Z",
      },
      {
        id: "2024001017",
        description: "Trade show and exhibition expenses",
        accountId: "4",
        account: mockPlAccounts[3],
        createdAt: "2024-02-06T10:40:00Z",
        updatedAt: "2024-02-06T10:40:00Z",
      },
      {
        id: "2024001018",
        description: "Insurance premiums and coverage",
        accountId: "",
        account: undefined,
        createdAt: "2024-02-07T14:55:00Z",
        updatedAt: "2024-02-07T14:55:00Z",
      },
      {
        id: "2024001019",
        description: "Mobile app development services",
        accountId: "5",
        account: mockPlAccounts[4],
        createdAt: "2024-02-08T09:30:00Z",
        updatedAt: "2024-02-08T09:30:00Z",
      },
      {
        id: "2024001020",
        description: "Corporate training and certification",
        accountId: "",
        account: undefined,
        createdAt: "2024-02-09T11:20:00Z",
        updatedAt: "2024-02-09T11:20:00Z",
      },
      {
        id: "2024001021",
        description: "Cloud hosting and server costs",
        accountId: "3",
        account: mockPlAccounts[2],
        createdAt: "2024-02-10T15:10:00Z",
        updatedAt: "2024-02-10T15:10:00Z",
      },
      {
        id: "2024001022",
        description: "Partnership revenue sharing",
        accountId: "1",
        account: mockPlAccounts[0],
        createdAt: "2024-02-11T12:45:00Z",
        updatedAt: "2024-02-11T12:45:00Z",
      },
      {
        id: "2024001023",
        description: "Legal and compliance services",
        accountId: "",
        account: undefined,
        createdAt: "2024-02-12T08:35:00Z",
        updatedAt: "2024-02-12T08:35:00Z",
      },
      {
        id: "2024001024",
        description: "Energy and utility bills",
        accountId: "3",
        account: mockPlAccounts[2],
        createdAt: "2024-02-13T16:20:00Z",
        updatedAt: "2024-02-13T16:20:00Z",
      },
      {
        id: "2024001025",
        description: "Market research and analytics",
        accountId: "4",
        account: mockPlAccounts[3],
        createdAt: "2024-02-14T13:15:00Z",
        updatedAt: "2024-02-14T13:15:00Z",
      }
    ];
    
    setTimeout(() => {
      setPlAccounts(mockPlAccounts);
      setIoMappings(mockIoMappings);
      setLoading(false);
    }, 1000);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.description.trim()) {
      toast({
        title: "Error",
        description: "Description is required",
        variant: "destructive",
      });
      return;
    }

    if (!formData.accountId) {
      toast({
        title: "Error", 
        description: "Please select a PL Account",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (editingMapping) {
        // Update existing mapping
        setIoMappings(prev => prev.map(mapping => 
          mapping.id === editingMapping.id 
            ? { 
                ...mapping, 
                description: formData.description,
                accountId: formData.accountId,
                account: plAccounts.find(acc => acc.id === formData.accountId),
                updatedAt: new Date().toISOString() 
              }
            : mapping
        ));
        toast({
          title: "Success",
          description: "IO Mapping updated successfully",
        });
      } else {
        // Add new mapping
        const newId = `2024${String(Date.now()).slice(-6)}`;
        const newMapping: IoMapping = {
          id: newId,
          description: formData.description,
          accountId: formData.accountId,
          account: plAccounts.find(acc => acc.id === formData.accountId),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        setIoMappings(prev => [...prev, newMapping]);
        toast({
          title: "Success",
          description: "IO Mapping added successfully",
        });
      }
      
      setDialogOpen(false);
      setFormData({ description: "", accountId: "" });
      setEditingMapping(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save IO Mapping",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (mapping: IoMapping) => {
    setEditingMapping(mapping);
    setFormData({ 
      description: mapping.description,
      accountId: mapping.accountId 
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setIoMappings(prev => prev.filter(mapping => mapping.id !== id));
      toast({
        title: "Success",
        description: "IO Mapping deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete IO Mapping",
        variant: "destructive",
      });
    }
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setFormData({ description: "", accountId: "" });
    setEditingMapping(null);
  };

  const handleAccountUpdate = async (mappingId: string, newAccountId: string) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setIoMappings(prev => prev.map(mapping => 
        mapping.id === mappingId 
          ? { 
              ...mapping, 
              accountId: newAccountId,
              account: plAccounts.find(acc => acc.id === newAccountId),
              updatedAt: new Date().toISOString() 
            }
          : mapping
      ));
      
      toast({
        title: "Success",
        description: "Account updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update account",
        variant: "destructive",
      });
    } finally {
      setEditingAccountId(null);
      setEditingAccountSearchOpen(false);
    }
  };

  const handleCancelAccountEdit = () => {
    setEditingAccountId(null);
    setEditingAccountSearchOpen(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const filteredMappings = ioMappings.filter(mapping => {
    const matchesSearch = searchQuery === "" || 
      mapping.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mapping.account?.plAccount.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = filterAccount === "all" || mapping.accountId === filterAccount;
    
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <Navigation />
      
      {/* Beautiful Background like other pages */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroBackground})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background/60 to-background/80" />
      
      <main className="relative z-10 container mx-auto px-6 py-8 pt-24">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              IO Mapping
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Manage Input/Output data mapping with PL Accounts for efficient financial data management
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6">
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/50 dark:to-blue-900/50 border-blue-200 dark:border-blue-800 hover:shadow-lg transition-all duration-300">
              <CardContent className="p-3 md:p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs md:text-sm font-medium text-blue-700 dark:text-blue-300">Total Mappings</p>
                    <p className="text-xl md:text-2xl font-bold text-blue-900 dark:text-blue-100">
                      {ioMappings.length}
                    </p>
                  </div>
                  <div className="h-10 w-10 md:h-12 md:w-12 bg-blue-200 dark:bg-blue-800 rounded-full flex items-center justify-center">
                    <MapPin className="h-5 w-5 md:h-6 md:w-6 text-blue-700 dark:text-blue-300" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/50 dark:to-green-900/50 border-green-200 dark:border-green-800 hover:shadow-lg transition-all duration-300">
              <CardContent className="p-3 md:p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs md:text-sm font-medium text-green-700 dark:text-green-300">Active Links</p>
                    <p className="text-xl md:text-2xl font-bold text-green-900 dark:text-green-100">
                      {ioMappings.filter(m => m.account).length}
                    </p>
                  </div>
                  <div className="h-10 w-10 md:h-12 md:w-12 bg-green-200 dark:bg-green-800 rounded-full flex items-center justify-center">
                    <LinkIcon className="h-5 w-5 md:h-6 md:w-6 text-green-700 dark:text-green-300" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/50 dark:to-purple-900/50 border-purple-200 dark:border-purple-800 hover:shadow-lg transition-all duration-300">
              <CardContent className="p-3 md:p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs md:text-sm font-medium text-purple-700 dark:text-purple-300">PL Accounts</p>
                    <p className="text-xl md:text-2xl font-bold text-purple-900 dark:text-purple-100">
                      {plAccounts.length}
                    </p>
                  </div>
                  <div className="h-10 w-10 md:h-12 md:w-12 bg-purple-200 dark:bg-purple-800 rounded-full flex items-center justify-center">
                    <Database className="h-5 w-5 md:h-6 md:w-6 text-purple-700 dark:text-purple-300" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950/50 dark:to-orange-900/50 border-orange-200 dark:border-orange-800 hover:shadow-lg transition-all duration-300">
              <CardContent className="p-3 md:p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs md:text-sm font-medium text-orange-700 dark:text-orange-300">Categories</p>
                    <p className="text-xl md:text-2xl font-bold text-orange-900 dark:text-orange-100">
                      {new Set(ioMappings.map(m => m.accountId)).size}
                    </p>
                  </div>
                  <div className="h-10 w-10 md:h-12 md:w-12 bg-orange-200 dark:bg-orange-800 rounded-full flex items-center justify-center">
                    <TrendingUp className="h-5 w-5 md:h-6 md:w-6 text-orange-700 dark:text-orange-300" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <Card className="bg-card/95 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 border-0">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                IO Mapping Management
              </CardTitle>
              <CardDescription>
                Manage Input/Output data mapping with system PL Accounts
              </CardDescription>
                </div>
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                  <DialogTrigger asChild>
                    <Button 
                      onClick={() => handleDialogClose()}
                      className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg hover:shadow-primary/25"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add IO Mapping
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[500px]">
                    <form onSubmit={handleSubmit}>
                      <DialogHeader>
                        <DialogTitle className="text-xl font-semibold">
                          {editingMapping ? "Edit IO Mapping" : "Add New IO Mapping"}
                        </DialogTitle>
                        <DialogDescription className="text-muted-foreground">
                          {editingMapping 
                            ? "Edit the IO Mapping information below"
                            : "Enter the details for the new IO Mapping"
                          }
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="description">Description *</Label>
                          <Textarea
                            id="description"
                            value={formData.description}
                            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                            placeholder="Enter description for this mapping..."
                            className="min-h-[80px]"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="account">PL Account *</Label>
                          <Popover open={accountSearchOpen} onOpenChange={setAccountSearchOpen}>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                role="combobox"
                                aria-expanded={accountSearchOpen}
                                className="w-full justify-between"
                              >
                                {formData.accountId
                                  ? plAccounts.find(account => account.id === formData.accountId)?.plAccount
                                  : "Select account..."}
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-full p-0">
                              <Command>
                                <CommandInput placeholder="Search accounts..." />
                                <CommandEmpty>No account found.</CommandEmpty>
                                <CommandGroup>
                                  <CommandList>
                                    {plAccounts.map((account) => (
                                      <CommandItem
                                        key={account.id}
                                        value={account.plAccount}
                                        onSelect={() => {
                                          setFormData(prev => ({ 
                                            ...prev, 
                                            accountId: account.id 
                                          }));
                                          setAccountSearchOpen(false);
                                        }}
                                      >
                                        <Check
                                          className={cn(
                                            "mr-2 h-4 w-4",
                                            formData.accountId === account.id ? "opacity-100" : "opacity-0"
                                          )}
                                        />
                                        {account.plAccount}
                                      </CommandItem>
                                    ))}
                                  </CommandList>
                                </CommandGroup>
                              </Command>
                            </PopoverContent>
                          </Popover>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button type="button" variant="outline" onClick={handleDialogClose}>
                          Cancel
                        </Button>
                        <Button 
                          type="submit" 
                          disabled={submitting}
                          className="bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90"
                        >
                          {submitting ? "Saving..." : (editingMapping ? "Update" : "Add")}
                        </Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Search and Filter */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search mappings or accounts..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={filterAccount} onValueChange={setFilterAccount}>
                  <SelectTrigger className="w-full sm:w-[200px]">
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Filter by account" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Accounts</SelectItem>
                    {plAccounts.map((account) => (
                      <SelectItem key={account.id} value={account.id}>
                        {account.plAccount}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Data Table */}
              {loading ? (
                <div className="flex flex-col justify-center items-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4"></div>
                  <p className="text-muted-foreground">Loading IO mappings...</p>
                </div>
              ) : (
                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead className="font-semibold">ID</TableHead>
                        <TableHead className="font-semibold">Description</TableHead>
                        <TableHead className="font-semibold">Account</TableHead>
                        <TableHead className="text-right font-semibold">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredMappings.map((mapping, index) => (
                        <TableRow 
                          key={mapping.id}
                          className={`hover:bg-muted/30 transition-colors ${
                            index % 2 === 0 ? 'bg-background' : 'bg-muted/10'
                          }`}
                        >
                          <TableCell className="font-mono text-sm">
                            {mapping.id}
                          </TableCell>
                          <TableCell className="max-w-xs">
                            <div className="truncate" title={mapping.description}>
                              {mapping.description}
                            </div>
                          </TableCell>
                          <TableCell className="min-w-[200px]">
                            {editingAccountId === mapping.id ? (
                              <Popover 
                                open={editingAccountSearchOpen} 
                                onOpenChange={(open) => {
                                  setEditingAccountSearchOpen(open);
                                  if (!open) {
                                    handleCancelAccountEdit();
                                  }
                                }}
                              >
                                <PopoverTrigger asChild>
                                  <Button
                                    variant="outline"
                                    role="combobox"
                                    aria-expanded={editingAccountSearchOpen}
                                    className="w-full justify-between text-left"
                                    size="sm"
                                  >
                                    {mapping.account?.plAccount || "Select account..."}
                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                  </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-[250px] p-0">
                                  <Command>
                                    <CommandInput placeholder="Search accounts..." />
                                    <CommandEmpty>No account found.</CommandEmpty>
                                    <CommandGroup>
                                      <CommandList>
                                        {plAccounts.map((account) => (
                                          <CommandItem
                                            key={account.id}
                                            value={account.plAccount}
                                            onSelect={() => {
                                              handleAccountUpdate(mapping.id, account.id);
                                            }}
                                          >
                                            <Check
                                              className={cn(
                                                "mr-2 h-4 w-4",
                                                mapping.accountId === account.id ? "opacity-100" : "opacity-0"
                                              )}
                                            />
                                            {account.plAccount}
                                          </CommandItem>
                                        ))}
                                      </CommandList>
                                    </CommandGroup>
                                  </Command>
                                </PopoverContent>
                              </Popover>
                            ) : (
                              <div 
                                className="group flex items-center gap-2 p-2 rounded hover:bg-muted/50 cursor-pointer transition-colors"
                                onClick={() => {
                                  setEditingAccountId(mapping.id);
                                  setEditingAccountSearchOpen(true);
                                }}
                                title="Click to edit account"
                              >
                                {mapping.account?.plAccount ? (
                                  <>
                                    <Database className="w-4 h-4 text-muted-foreground" />
                                    <span className="flex-1 text-sm">
                                      {mapping.account.plAccount}
                                    </span>
                                    <Edit className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                                  </>
                                ) : (
                                  <>
                                    <div className="w-4 h-4" />
                                    <span className="flex-1 text-sm text-muted-foreground italic">
                                      Click to select account
                                    </span>
                                    <Edit className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                                  </>
                                )}
                              </div>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-700"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete this
                                    IO mapping from the system.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDelete(mapping.id)}
                                    className="bg-red-600 hover:bg-red-700 text-white"
                                  >
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </TableCell>
                        </TableRow>
                      ))}
                      {filteredMappings.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center py-12 text-muted-foreground">
                            <div className="flex flex-col items-center gap-2">
                              <MapPin className="w-12 h-12 text-muted-foreground/50" />
                              <p className="text-lg font-medium">
                                {searchQuery || (filterAccount !== "all") ? "No matching mappings found" : "No IO mappings found"}
                              </p>
                              <p className="text-sm">
                                {searchQuery || (filterAccount !== "all") ? "Try adjusting your search or filter" : "Add your first mapping to get started."}
                              </p>
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
      </main>
    </div>
  );
}
