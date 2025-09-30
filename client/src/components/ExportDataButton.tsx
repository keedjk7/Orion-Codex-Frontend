import React, { useState } from 'react';
import { Download, FileText, FileSpreadsheet, FileJson, CheckCircle } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from './ui/dropdown-menu';
import { Button } from './ui/button';
import { useToast } from '@/hooks/use-toast';

interface ExportDataButtonProps {
  data: any;
  filename?: string;
  className?: string;
}

export function ExportDataButton({ data, filename = 'data', className = '' }: ExportDataButtonProps) {
  const { toast } = useToast();
  const [isExporting, setIsExporting] = useState(false);

  const exportToCSV = () => {
    setIsExporting(true);
    setTimeout(() => {
      try {
        // Convert data to CSV format
        const headers = Object.keys(data[0] || {});
        const csvContent = [
          headers.join(','),
          ...data.map((row: any) => headers.map(h => row[h]).join(','))
        ].join('\n');

        // Create blob and download
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${filename}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);

        toast({
          title: 'Export Successful!',
          description: `Data exported as ${filename}.csv`,
        });
      } catch (error) {
        toast({
          title: 'Export Failed',
          description: 'Unable to export data. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setIsExporting(false);
      }
    }, 500);
  };

  const exportToJSON = () => {
    setIsExporting(true);
    setTimeout(() => {
      try {
        const jsonContent = JSON.stringify(data, null, 2);
        const blob = new Blob([jsonContent], { type: 'application/json' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${filename}.json`;
        a.click();
        window.URL.revokeObjectURL(url);

        toast({
          title: 'Export Successful!',
          description: `Data exported as ${filename}.json`,
        });
      } catch (error) {
        toast({
          title: 'Export Failed',
          description: 'Unable to export data. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setIsExporting(false);
      }
    }, 500);
  };

  const exportToPDF = () => {
    setIsExporting(true);
    setTimeout(() => {
      toast({
        title: 'PDF Export',
        description: 'PDF export feature coming soon!',
      });
      setIsExporting(false);
    }, 500);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={`gap-2 ${className}`}
          disabled={isExporting}
        >
          {isExporting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-400 border-t-transparent"></div>
              <span>Exporting...</span>
            </>
          ) : (
            <>
              <Download className="w-4 h-4" />
              <span>Export</span>
            </>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel className="flex items-center gap-2">
          <FileSpreadsheet className="w-4 h-4" />
          Export Data
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={exportToCSV} className="cursor-pointer">
          <FileSpreadsheet className="w-4 h-4 mr-2" />
          Export as CSV
        </DropdownMenuItem>
        <DropdownMenuItem onClick={exportToJSON} className="cursor-pointer">
          <FileJson className="w-4 h-4 mr-2" />
          Export as JSON
        </DropdownMenuItem>
        <DropdownMenuItem onClick={exportToPDF} className="cursor-pointer">
          <FileText className="w-4 h-4 mr-2" />
          Export as PDF
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
