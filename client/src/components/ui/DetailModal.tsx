import React from 'react';
import { X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { Button } from './button';

interface DetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export function DetailModal({ isOpen, onClose, title, children }: DetailModalProps) {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-4xl max-h-[90vh] overflow-auto m-4 animate-in zoom-in-95 slide-in-from-bottom-4"
        onClick={(e) => e.stopPropagation()}
      >
        <Card className="shadow-2xl border-0">
          <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50 border-b sticky top-0 z-10">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-bold text-gray-900">{title}</CardTitle>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onClose}
                className="h-8 w-8 p-0 hover:bg-white/50"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            {children}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

interface DetailSection {
  label: string;
  value: string | number;
  trend?: 'up' | 'down';
  color?: string;
}

interface DetailSectionProps {
  title: string;
  items: DetailSection[];
}

export function DetailSectionGroup({ title, items }: DetailSectionProps) {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider border-b pb-2">
        {title}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {items.map((item, idx) => (
          <div key={idx} className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">{item.label}</span>
              <span className={`text-lg font-bold ${item.color || 'text-gray-900'}`}>
                {item.value}
                {item.trend && (
                  <span className={`ml-2 text-xs ${item.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                    {item.trend === 'up' ? '↗' : '↘'}
                  </span>
                )}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
