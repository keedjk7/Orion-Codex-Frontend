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
import { Plus, Edit, Trash2, Shield, Database } from "lucide-react";
import Navigation from "@/components/Navigation";

interface PlAccount {
  id: string;
  plAccount: string;
  createdAt: string;
  updatedAt: string;
}

export default function Admin() {
  const [plAccounts, setPlAccounts] = useState<PlAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<PlAccount | null>(null);
  const [formData, setFormData] = useState({ plAccount: "" });
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  // Mock data for demonstration
  useEffect(() => {
    const mockData: PlAccount[] = [
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
    
    setTimeout(() => {
      setPlAccounts(mockData);
      setLoading(false);
    }, 1000);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.plAccount.trim()) {
      toast({
        title: "Error",
        description: "PL Account name is required",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (editingAccount) {
        // Update existing account
        setPlAccounts(prev => prev.map(account => 
          account.id === editingAccount.id 
            ? { ...account, plAccount: formData.plAccount, updatedAt: new Date().toISOString() }
            : account
        ));
        toast({
          title: "Success",
          description: "PL Account updated successfully",
        });
      } else {
        // Add new account
        const newAccount: PlAccount = {
          id: Date.now().toString(),
          plAccount: formData.plAccount,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        setPlAccounts(prev => [...prev, newAccount]);
        toast({
          title: "Success",
          description: "PL Account added successfully",
        });
      }
      
      setDialogOpen(false);
      setFormData({ plAccount: "" });
      setEditingAccount(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save PL Account",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (account: PlAccount) => {
    setEditingAccount(account);
    setFormData({ plAccount: account.plAccount });
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setPlAccounts(prev => prev.filter(account => account.id !== id));
      toast({
        title: "Success",
        description: "PL Account deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete PL Account",
        variant: "destructive",
      });
    }
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setFormData({ plAccount: "" });
    setEditingAccount(null);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <Navigation />
      
      <div className="container mx-auto px-6 py-8 mt-20">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg">
              <Shield className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-slate-900 dark:text-white">
                PL Account
              </h1>
              <p className="text-slate-600 dark:text-slate-400 text-lg">
                Manage profit and loss account categories
              </p>
            </div>
          </div>
          
          <div className="flex justify-center mb-8">
            <Card className="border-0 shadow-xl bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-800 dark:to-slate-900 max-w-md w-full">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto p-4 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg mb-4 w-fit">
                  <Database className="h-8 w-8" />
                </div>
                <CardTitle className="text-xl font-bold text-slate-900 dark:text-white">Total PL Accounts</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="text-5xl font-bold text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text mb-2">
                  {plAccounts.length}
                </div>
                <p className="text-slate-600 dark:text-slate-400 text-base">
                  Active account entries
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* PL Accounts Section */}
        <Card className="border-0 shadow-xl bg-white dark:bg-slate-900">
          <CardHeader className="border-b border-slate-200 dark:border-slate-700">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-2xl font-bold text-slate-900 dark:text-white">
                  PL Account Management
                </CardTitle>
                <CardDescription className="text-slate-600 dark:text-slate-400 text-base mt-2">
                  Manage profit and loss account categories for financial reporting
                </CardDescription>
              </div>
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button 
                    onClick={() => handleDialogClose()}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add PL Account
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <form onSubmit={handleSubmit}>
                    <DialogHeader>
                      <DialogTitle className="text-xl font-semibold">
                        {editingAccount ? "Edit PL Account" : "Add New PL Account"}
                      </DialogTitle>
                      <DialogDescription className="text-slate-600 dark:text-slate-400">
                        {editingAccount 
                          ? "Update the PL account information below."
                          : "Enter the details for the new PL account."
                        }
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="plAccount" className="text-right font-medium">
                          PL Account
                        </Label>
                        <Input
                          id="plAccount"
                          value={formData.plAccount}
                          onChange={(e) => setFormData({ plAccount: e.target.value })}
                          className="col-span-3 border-slate-300 dark:border-slate-600"
                          placeholder="Enter PL account name"
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
                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                      >
                        {submitting ? "Saving..." : (editingAccount ? "Update" : "Add")}
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <div className="overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-50 dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800">
                      <TableHead className="font-semibold text-slate-900 dark:text-white py-4">PL Account</TableHead>
                      <TableHead className="font-semibold text-slate-900 dark:text-white py-4">Updated At</TableHead>
                      <TableHead className="text-right font-semibold text-slate-900 dark:text-white py-4">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {plAccounts.map((account, index) => (
                      <TableRow 
                        key={account.id}
                        className={`hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors ${
                          index % 2 === 0 ? 'bg-white dark:bg-slate-900' : 'bg-slate-50/50 dark:bg-slate-800/50'
                        }`}
                      >
                        <TableCell className="font-medium text-slate-900 dark:text-white py-4">
                          {account.plAccount}
                        </TableCell>
                        <TableCell className="text-slate-600 dark:text-slate-400 py-4">
                          {formatDate(account.updatedAt)}
                        </TableCell>
                        <TableCell className="text-right py-4">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEdit(account)}
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
                                    PL account "{account.plAccount}" from the system.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDelete(account.id)}
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
                    {plAccounts.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={3} className="text-center py-12 text-slate-500 dark:text-slate-400">
                          <div className="flex flex-col items-center gap-2">
                            <Database className="w-12 h-12 text-slate-300 dark:text-slate-600" />
                            <p className="text-lg font-medium">No PL accounts found</p>
                            <p className="text-sm">Add your first account to get started.</p>
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
