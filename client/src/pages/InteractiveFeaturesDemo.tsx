import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { InteractiveLOBCard } from '@/components/InteractiveLOBCard';
import { ExportDataButton } from '@/components/ExportDataButton';
import { DashboardFilters, FilterOptions } from '@/components/DashboardFilters';
import { EnhancedDashboardTools } from '@/components/EnhancedDashboardTools';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Sparkles, CheckCircle, TrendingUp, BarChart3 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Mock Data
const mockLOBData = [
  {
    name: 'Enterprise Software',
    growth: '+15%',
    revenue: '$245M',
    color: 'green' as const,
    reason: 'Digital transformation initiatives driving demand for ERP and CRM solutions',
    details: [
      { segment: 'ERP Systems', growth: '+18%', driver: 'Cloud migration projects' },
      { segment: 'CRM Platforms', growth: '+12%', driver: 'Sales automation demand' },
      { segment: 'Analytics Tools', growth: '+15%', driver: 'Data-driven decision making' }
    ]
  },
  {
    name: 'SaaS Solutions',
    growth: '+25%',
    revenue: '$320M',
    color: 'green' as const,
    reason: 'Rapid cloud adoption and subscription model preference',
    details: [
      { segment: 'Cloud Infrastructure', growth: '+30%', driver: 'Remote work infrastructure' },
      { segment: 'SaaS Applications', growth: '+22%', driver: 'Scalability requirements' },
      { segment: 'API Services', growth: '+25%', driver: 'Integration demands' }
    ]
  },
  {
    name: 'Legacy Systems',
    growth: '-8%',
    revenue: '$85M',
    color: 'red' as const,
    reason: 'Declining demand due to cloud migration and modernization trends',
    details: [
      { segment: 'On-premise Servers', growth: '-12%', driver: 'Cloud migration' },
      { segment: 'Legacy Software', growth: '-6%', driver: 'Modern alternatives' },
      { segment: 'Hardware Maintenance', growth: '-10%', driver: 'End-of-life systems' }
    ]
  }
];

const mockChartData = [
  { month: 'Jan', value: 45000 },
  { month: 'Feb', value: 52000 },
  { month: 'Mar', value: 48000 },
  { month: 'Apr', value: 61000 },
  { month: 'May', value: 58000 },
  { month: 'Jun', value: 65000 }
];

const mockTableData = [
  { category: 'Revenue', actual: '$1,625M', le: '$1,740M', budget: '$1,500M' },
  { category: 'Expenses', actual: '$980M', le: '$950M', budget: '$1,000M' },
  { category: 'Profit', actual: '$645M', le: '$790M', budget: '$500M' }
];

export default function InteractiveFeaturesDemo() {
  const [filters, setFilters] = useState<FilterOptions>({
    dateRange: 'month',
    category: 'all',
    status: 'all'
  });

  const [refreshCount, setRefreshCount] = useState(0);

  const handleFilterChange = (newFilters: FilterOptions) => {
    setFilters(newFilters);
  };

  const handleRefresh = () => {
    setRefreshCount(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 p-12 text-white shadow-2xl">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full mb-4">
              <Sparkles className="w-5 h-5 animate-pulse" />
              <span className="font-semibold">Interactive Features Demo</span>
            </div>
            <h1 className="text-5xl font-bold mb-4">
              OrionCodex Dashboard Features
            </h1>
            <p className="text-xl text-blue-100 mb-6 max-w-3xl mx-auto">
              ลูกเล่นและ mock ข้อมูลครบถ้วน พร้อมใช้งานทันที
            </p>
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <Badge className="bg-white/20 text-white border-white/30">
                <CheckCircle className="w-3 h-3 mr-1" />
                Interactive LOB Cards
              </Badge>
              <Badge className="bg-white/20 text-white border-white/30">
                <CheckCircle className="w-3 h-3 mr-1" />
                Export Data
              </Badge>
              <Badge className="bg-white/20 text-white border-white/30">
                <CheckCircle className="w-3 h-3 mr-1" />
                Advanced Filters
              </Badge>
              <Badge className="bg-white/20 text-white border-white/30">
                <CheckCircle className="w-3 h-3 mr-1" />
                Animations & Tooltips
              </Badge>
            </div>
          </div>
        </div>

        {/* Feature 1: Interactive LOB Cards */}
        <Card className="shadow-xl border-0">
          <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                  Interactive LOB Cards
                </CardTitle>
                <CardDescription className="mt-2">
                  คลิกที่ card เพื่อดูรายละเอียดเต็มใน modal พร้อม charts และ insights
                </CardDescription>
              </div>
              <Badge variant="secondary" className="text-sm">
                Feature #1
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {mockLOBData.map((lob, index) => (
                <InteractiveLOBCard key={index} lob={lob} index={index} />
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Feature 2: Export & Filters */}
        <Card className="shadow-xl border-0">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <BarChart3 className="w-6 h-6 text-blue-600" />
                  Dashboard Tools - Export & Filters
                </CardTitle>
                <CardDescription className="mt-2">
                  Export ข้อมูลเป็น CSV/JSON และกรองข้อมูลตามความต้องการ
                </CardDescription>
              </div>
              <EnhancedDashboardTools
                data={mockTableData}
                filename="demo-dashboard-data"
                onFilterChange={handleFilterChange}
                onRefresh={handleRefresh}
                showFilters={true}
                lastUpdated={new Date().toISOString()}
              />
            </div>
          </CardHeader>
          <CardContent className="p-6">
            {/* Active Filters Display */}
            <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="font-semibold text-gray-900 mb-3">Active Filters:</h4>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <span className="text-sm text-gray-600">Date Range:</span>
                  <div className="text-base font-bold text-blue-700 capitalize">{filters.dateRange}</div>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Category:</span>
                  <div className="text-base font-bold text-green-700 capitalize">{filters.category}</div>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Status:</span>
                  <div className="text-base font-bold text-purple-700 capitalize">{filters.status}</div>
                </div>
              </div>
              <div className="mt-3 text-sm text-gray-600">
                Refreshed {refreshCount} time(s)
              </div>
            </div>

            {/* Sample Chart */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h4 className="text-lg font-bold text-gray-900 mb-4">Sample Chart with Interactive Tooltips</h4>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={mockChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(0, 0, 0, 0.9)',
                      border: 'none',
                      borderRadius: '8px',
                      color: 'white',
                      padding: '8px 12px'
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#3b82f6"
                    strokeWidth={3}
                    dot={{ fill: '#3b82f6', r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Feature 3: Data Table with Export */}
        <Card className="shadow-xl border-0">
          <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 border-b">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl">Data Table with Export</CardTitle>
                <CardDescription className="mt-2">
                  Export ข้อมูลจาก table เป็นไฟล์ต่างๆ
                </CardDescription>
              </div>
              <ExportDataButton data={mockTableData} filename="financial-summary" />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-200 bg-gray-50">
                    <th className="text-left py-4 px-6 font-bold text-gray-700">Category</th>
                    <th className="text-center py-4 px-6 font-bold text-gray-700">Actual</th>
                    <th className="text-center py-4 px-6 font-bold text-gray-700">Latest Estimate</th>
                    <th className="text-center py-4 px-6 font-bold text-gray-700">Budget</th>
                  </tr>
                </thead>
                <tbody>
                  {mockTableData.map((row, idx) => (
                    <tr key={idx} className="border-b border-gray-100 hover:bg-blue-50 transition-colors">
                      <td className="py-4 px-6 font-semibold text-gray-900">{row.category}</td>
                      <td className="py-4 px-6 text-center text-gray-900">{row.actual}</td>
                      <td className="py-4 px-6 text-center text-blue-700 font-medium">{row.le}</td>
                      <td className="py-4 px-6 text-center text-purple-700 font-medium">{row.budget}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Implementation Guide */}
        <Card className="shadow-xl border-0 bg-gradient-to-br from-amber-50 to-orange-50">
          <CardHeader>
            <CardTitle className="text-2xl">📚 Implementation Guide</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-white rounded-lg">
                <h4 className="font-bold text-gray-900 mb-2">1. Interactive LOB Cards</h4>
                <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                  &lt;InteractiveLOBCard lob=&#123;lobData&#125; index=&#123;0&#125; /&gt;
                </code>
              </div>
              <div className="p-4 bg-white rounded-lg">
                <h4 className="font-bold text-gray-900 mb-2">2. Export Button</h4>
                <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                  &lt;ExportDataButton data=&#123;data&#125; filename="export" /&gt;
                </code>
              </div>
              <div className="p-4 bg-white rounded-lg">
                <h4 className="font-bold text-gray-900 mb-2">3. Dashboard Filters</h4>
                <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                  &lt;DashboardFilters onFilterChange=&#123;handleChange&#125; /&gt;
                </code>
              </div>
              <div className="p-4 bg-white rounded-lg">
                <h4 className="font-bold text-gray-900 mb-2">4. All-in-One Toolbar</h4>
                <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                  &lt;EnhancedDashboardTools data=&#123;data&#125; filename="data" /&gt;
                </code>
              </div>
            </div>
            <div className="mt-6 p-4 bg-blue-100 rounded-lg">
              <p className="text-sm text-gray-700">
                📖 ดูเอกสารเพิ่มเติมได้ที่: <code className="font-mono">client/src/components/INTERACTIVE_FEATURES_GUIDE.md</code>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-gray-600 py-8">
          <p className="text-sm">
            Created by OrionCodex Team • Version 1.0.0 • September 30, 2025
          </p>
        </div>
      </div>
    </div>
  );
}
