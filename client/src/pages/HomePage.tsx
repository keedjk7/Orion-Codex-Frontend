import React, { useState } from 'react';
import { useKeycloak } from '@/contexts/KeycloakContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import DashboardSidebar from '@/components/DashboardSidebar';
import DashboardHeader from '@/components/DashboardHeader';
import { useLocation } from 'wouter';

// Custom CSS for scrollbar
const customScrollbarStyles = `
  .custom-scrollbar::-webkit-scrollbar {
    width: 6px;
  }
  
  .custom-scrollbar::-webkit-scrollbar-track {
    background: #f1f5f9;
    border-radius: 3px;
  }
  
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 3px;
  }
  
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: #94a3b8;
  }
`;
import {
  TrendingUp,
  Users,
  DollarSign,
  Target,
  BarChart3,
  Search,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart
} from 'recharts';
import { Progress } from '@/components/ui/progress';

// Sample data for charts - showing realistic trends based on percentages
const salesData = [
  { month: 'Q1', actual: 1740, budget: 1740, forecast: 1680 },
  { month: 'Q2', actual: 1695, budget: 1740, forecast: 1750 },
  { month: 'Q3', actual: 1650, budget: 1740, forecast: 1720 },
  { month: 'Q4', actual: 1625, budget: 1740, forecast: 1730 },
];

const customerData = [
  { month: 'Q1', new: 1640, retention: 88 },
  { month: 'Q2', new: 1650, retention: 90 },
  { month: 'Q3', new: 1665, retention: 89 },
  { month: 'Q4', new: 1680, retention: 91 },
];

const profitData = [
  { month: 'Q1', grossProfit: 1620, operatingExpenses: 1740 },
  { month: 'Q2', grossProfit: 1625, operatingExpenses: 1720 },
  { month: 'Q3', grossProfit: 1635, operatingExpenses: 1690 },
  { month: 'Q4', grossProfit: 1640, operatingExpenses: 1640 },
];

// LOB Growth Data with detailed insights
const lobGrowthData = [
  {
    name: 'Enterprise Software',
    growth: '+15%',
    revenue: '$245M',
    color: 'green',
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
    color: 'green',
    reason: 'Rapid cloud adoption and subscription model preference',
    details: [
      { segment: 'Cloud Infrastructure', growth: '+30%', driver: 'Remote work infrastructure' },
      { segment: 'SaaS Applications', growth: '+22%', driver: 'Scalability requirements' },
      { segment: 'API Services', growth: '+25%', driver: 'Integration demands' }
    ]
  },
  {
    name: 'Professional Services',
    growth: '+20%',
    revenue: '$180M',
    color: 'green',
    reason: 'High demand for digital transformation consulting',
    details: [
      { segment: 'Digital Transformation', growth: '+25%', driver: 'Post-pandemic digitization' },
      { segment: 'System Integration', growth: '+18%', driver: 'Legacy system modernization' },
      { segment: 'Training Services', growth: '+17%', driver: 'Skill gap bridging' }
    ]
  },
  {
    name: 'Legacy Systems',
    growth: '-8%',
    revenue: '$85M',
    color: 'red',
    reason: 'Declining demand due to cloud migration and modernization trends',
    details: [
      { segment: 'On-premise Servers', growth: '-12%', driver: 'Cloud migration' },
      { segment: 'Legacy Software', growth: '-6%', driver: 'Modern alternatives' },
      { segment: 'Hardware Maintenance', growth: '-10%', driver: 'End-of-life systems' }
    ]
  },
  {
    name: 'Mobile Solutions',
    growth: '+35%',
    revenue: '$280M',
    color: 'green',
    reason: 'Mobile-first strategy and app development boom',
    details: [
      { segment: 'iOS Development', growth: '+32%', driver: 'Enterprise iOS adoption' },
      { segment: 'Android Development', growth: '+38%', driver: 'Market penetration' },
      { segment: 'Cross-platform', growth: '+35%', driver: 'Cost optimization' }
    ]
  },
  {
    name: 'Emerging Technologies',
    growth: '+45%',
    revenue: '$125M',
    color: 'green',
    reason: 'Early adoption of AI, ML, and blockchain technologies',
    details: [
      { segment: 'AI/ML Services', growth: '+50%', driver: 'Automation and insights' },
      { segment: 'Blockchain Solutions', growth: '+40%', driver: 'Security and transparency' },
      { segment: 'IoT Platforms', growth: '+45%', driver: 'Connected device growth' }
    ]
  }
];

const tasksData = [
  {
    task: 'Load Actual Data',
    owner: '',
    startDate: '',
    endDate: '',
    status: 'In Progress',
    comment: ''
  },
  {
    task: 'Input Sales Forecast',
    owner: '',
    startDate: '',
    endDate: '',
    status: 'Complete',
    comment: ''
  }
];

const kpiData = [
  {
    title: 'Net Sales',
    value: '267M',
    change: '+8.2%',
    trend: 'up',
    icon: DollarSign,
    color: 'blue',
    chartType: 'bar',
    chartData: [
      { period: 'Q1', value: 30 },
      { period: 'Q2', value: 40 },
      { period: 'Q3', value: 45 },
      { period: 'Q4', value: 50 }
    ]
  },
  {
    title: 'New Customer',
    value: '85.4M',
    change: '+12.5%',
    trend: 'up',
    icon: Users,
    color: 'green',
    chartType: 'line',
    chartData: [
      { period: 'Q1', value: 18 },
      { period: 'Q2', value: 22 },
      { period: 'Q3', value: 26 },
      { period: 'Q4', value: 30 }
    ]
  },
  {
    title: 'Gross Profit',
    value: '65.8M',
    change: '+0.2%',
    trend: 'up',
    icon: Target,
    color: 'purple',
    chartType: 'dot',
    chartData: [
      { period: 'Q1', value: 16.4 },
      { period: 'Q2', value: 16.4 },
      { period: 'Q3', value: 16.4 },
      { period: 'Q4', value: 16.4 }
    ]
  },
  {
    title: 'Operating Expenses',
    value: '267M',
    change: '+15.8%',
    trend: 'up',
    icon: TrendingUp,
    color: 'red',
    chartType: 'bar',
    chartData: [
      { period: 'Q1', value: 35 },
      { period: 'Q2', value: 42 },
      { period: 'Q3', value: 48 },
      { period: 'Q4', value: 55 }
    ]
  }
];

// Updated detailed data to match the image
const detailedData = [
  {
    category: 'Net Sales',
    actual: '$1,625.00',
    le: '$1,740.00',
    percentLE: '-13%',
    budget: '$123.00',
    percentBudget: '1.2%'
  },
  {
    category: 'New Customer',
    actual: '$1,680.00',
    le: '$1,740.00',
    percentLE: '2%',
    budget: '$55.00',
    percentBudget: '3.1%'
  },
  {
    category: 'Gross Profit',
    actual: '$1,640.00',
    le: '$1,740.00',
    percentLE: '1%',
    budget: '$97.00',
    percentBudget: '5.8%'
  },
  {
    category: 'Operating Expenses',
    actual: '$1,640.00',
    le: '$1,740.00',
    percentLE: '-6%',
    budget: '$97.00',
    percentBudget: '5.8%'
  }
];

const planningTasksData = [
  {
    task: 'Load newly added GL Segments',
    owner: 'James, Leroy',
    notify: 'Email Owner',
    complete: true,
    startDate: '4/1/21',
    endDate: '4/1/21'
  },
  {
    task: 'Load Actuals from Ledger',
    owner: 'James, Leroy',
    notify: 'Email Owner',
    complete: true,
    startDate: '4/1/21',
    endDate: '4/1/21'
  },
  {
    task: 'Update Currency Rate Assumptions',
    owner: 'James, Leroy',
    notify: 'Email Owner',
    complete: true,
    startDate: '4/2/21',
    endDate: '4/2/21'
  }
];

const operationalTasksData = [
  {
    task: 'Approve/Reject Workforce Plan',
    owner: 'Geyer, Les',
    notify: 'Email Owner',
    complete: false,
    startDate: '4/9/21',
    endDate: '4/12/21'
  },
  {
    task: 'Approve/Reject Capital Plan',
    owner: 'Geyer, Les',
    notify: 'Email Owner',
    complete: false,
    startDate: '4/9/21',
    endDate: '4/12/21'
  },
  {
    task: 'Approve/Reject G&A Plan',
    owner: 'Geyer, Les',
    notify: 'Email Owner',
    complete: false,
    startDate: '4/9/21',
    endDate: '4/12/21'
  }
];

export default function HomePage() {
  const { user } = useKeycloak();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [, setLocation] = useLocation();

  const getUserDisplayName = () => {
    if (user?.name) return user.name;
    if (user?.preferred_username) return user.preferred_username;
    if (user?.given_name && user?.family_name) return `${user.given_name} ${user.family_name}`;
    if (user?.email) return user.email.split('@')[0];
    return 'User';
  };

  const handleTabChange = (tab: string) => {
    if (tab === 'home') {
      // Already on home page
      return;
    }

    // Navigate to different dashboard routes
    switch (tab) {
      case 'ce-dashboard':
        setLocation('/ce-dashboard');
        break;
      case 'fn-dashboard':
        setLocation('/fn-dashboard');
        break;
      case 'upload':
        setLocation('/upload');
        break;
      default:
        // For other tabs, you can add logic here if needed
        break;
    }
  };

  const handleSidebarCollapse = (collapsed: boolean) => {
    setSidebarCollapsed(collapsed);
  };

  return (
    <>
      {/* Custom Scrollbar Styles */}
      <style dangerouslySetInnerHTML={{ __html: customScrollbarStyles }} />
      
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <DashboardSidebar
        activeTab="home"
        onTabChange={handleTabChange}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        isCollapsed={sidebarCollapsed}
        onCollapseToggle={handleSidebarCollapse}
      />

      {/* Main Content */}
      <div className={cn(
        "flex-1 flex flex-col min-h-screen transition-all duration-300 ease-in-out"
      )}>
        {/* Header */}
        <DashboardHeader
          title="Financial Overview"
          subtitle="Real-time financial insights and key performance indicators"
          onMenuClick={() => setSidebarOpen(true)}
        />

        {/* Content */}
        <main className="flex-1 p-4 lg:p-6 overflow-auto bg-gray-100">
          <div className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {kpiData.map((kpi, index) => {
                const Icon = kpi.icon;
                const iconColorClasses = {
                  blue: 'bg-blue-500',
                  green: 'bg-green-500',
                  purple: 'bg-purple-500',
                  red: 'bg-red-500'
                };

                const borderColorClasses = {
                  blue: 'border-blue-100',
                  green: 'border-green-100',
                  purple: 'border-purple-100',
                  red: 'border-red-100'
                };

                const renderMiniChart = () => {
                  if (kpi.chartType === 'bar') {
                    const barColor = kpi.title === 'Net Sales' ? '#3b82f6' : '#ef4444';
                    return (
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={kpi.chartData} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
                          <XAxis 
                            dataKey="period" 
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 10, fill: '#9ca3af' }}
                            dy={5}
                          />
                          <Tooltip 
                            contentStyle={{
                              backgroundColor: 'rgba(0, 0, 0, 0.8)',
                              border: 'none',
                              borderRadius: '8px',
                              padding: '8px 12px',
                              color: 'white',
                              fontSize: '12px',
                              fontWeight: 'bold'
                            }}
                            cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }}
                            formatter={(value: any) => [value, kpi.title]}
                          />
                          <Bar 
                            dataKey="value" 
                            fill={barColor} 
                            radius={[4, 4, 0, 0]}
                            stroke="none"
                            maxBarSize={40}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    );
                  } else if (kpi.chartType === 'line') {
                    return (
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={kpi.chartData} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
                          <XAxis 
                            dataKey="period" 
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 10, fill: '#9ca3af' }}
                            dy={5}
                          />
                          <Tooltip 
                            contentStyle={{
                              backgroundColor: 'rgba(0, 0, 0, 0.8)',
                              border: 'none',
                              borderRadius: '8px',
                              padding: '8px 12px',
                              color: 'white',
                              fontSize: '12px',
                              fontWeight: 'bold'
                            }}
                            cursor={{ stroke: '#10b981', strokeWidth: 1, strokeDasharray: '3 3' }}
                            formatter={(value: any) => [value, kpi.title]}
                          />
                          <Line 
                            type="monotone" 
                            dataKey="value" 
                            stroke="#10b981" 
                            strokeWidth={2}
                            dot={{ fill: '#10b981', strokeWidth: 0, r: 4 }}
                            activeDot={{ r: 5, stroke: '#10b981', strokeWidth: 2 }}
                            connectNulls={false}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    );
                  } else if (kpi.chartType === 'dot') {
                    return (
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={kpi.chartData} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
                          <XAxis 
                            dataKey="period" 
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 10, fill: '#9ca3af' }}
                            dy={5}
                          />
                          <Tooltip 
                            contentStyle={{
                              backgroundColor: 'rgba(0, 0, 0, 0.8)',
                              border: 'none',
                              borderRadius: '8px',
                              padding: '8px 12px',
                              color: 'white',
                              fontSize: '12px',
                              fontWeight: 'bold'
                            }}
                            cursor={{ stroke: '#8b5cf6', strokeWidth: 1, strokeDasharray: '3 3' }}
                            formatter={(value: any) => [value, kpi.title]}
                          />
                          <Line 
                            type="monotone" 
                            dataKey="value" 
                            stroke="transparent" 
                            strokeWidth={0}
                            dot={{ fill: '#8b5cf6', strokeWidth: 0, r: 6 }}
                            activeDot={{ r: 7, stroke: '#8b5cf6', strokeWidth: 2 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    );
                  }
                  return null;
                };

                return (
                  <Card key={index} className={borderColorClasses[kpi.color as keyof typeof borderColorClasses]}>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs font-medium text-gray-600">{kpi.title}</p>
                          <p className="text-3xl font-bold text-gray-900 my-1">{kpi.value}</p>
                          <div className={`text-sm flex items-center font-medium ${
                            kpi.change.includes('+') ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {kpi.change.includes('+') ? <ArrowUp className="h-3 w-3 mr-1" /> : <ArrowDown className="h-3 w-3 mr-1" />}
                            {kpi.change}
                          </div>
                        </div>
                        <div className={`h-12 w-12 rounded-full flex items-center justify-center flex-shrink-0 ${iconColorClasses[kpi.color as keyof typeof iconColorClasses]}`}>
                          <Icon className="h-6 w-6 text-white" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Financial Performance Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Combined Sales & Customer Chart */}
              <Card>
                <CardHeader className="border-b">
                  <CardTitle className="text-lg font-semibold">Revenue & Customer Analytics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Net Sales */}
                    <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <DollarSign className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">Net Sales</div>
                          <div className="text-sm text-gray-600">Quarterly Performance</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-blue-600">$1,625M</div>
                        <div className="text-sm text-red-600 font-medium">-13%</div>
                      </div>
                    </div>

                    {/* New Customer */}
                    <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                          <Users className="h-4 w-4 text-green-600" />
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">New Customer</div>
                          <div className="text-sm text-gray-600">Acquisition Growth</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-green-600">$1,680M</div>
                        <div className="text-sm text-green-600 font-medium">+2%</div>
                      </div>
                    </div>

                    {/* Combined Chart */}
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={salesData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                          <XAxis
                            dataKey="month"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 12, fill: '#666' }}
                          />
                          <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 12, fill: '#666' }}
                            tickFormatter={(value) => `$${value}`}
                            domain={[1500, 1800]}
                          />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: 'white',
                              border: '1px solid #e5e7eb',
                              borderRadius: '8px',
                              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                            }}
                            formatter={(value, name) => [`$${value}M`, name]}
                          />
                          <Legend />
                          <Line
                            type="monotone"
                            dataKey="actual"
                            stroke="#ef4444"
                            strokeWidth={3}
                            name="Net Sales (Actual)"
                            dot={{ fill: '#ef4444', strokeWidth: 2, r: 5 }}
                            strokeDasharray="0"
                          />
                          <Line
                            type="monotone"
                            dataKey="forecast"
                            stroke="#10b981"
                            strokeWidth={2}
                            name="Latest Estimate"
                            dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                            strokeDasharray="5 5"
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Profitability & Expenses Chart */}
              <Card className="shadow-xl border-0 hover:shadow-2xl transition-shadow duration-300">
                <CardHeader className="border-b bg-gradient-to-r from-purple-50 to-pink-50">
                  <CardTitle className="text-xl font-bold text-gray-900">Profitability Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Gross Profit */}
                    <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                          <Target className="h-4 w-4 text-purple-600" />
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">Gross Profit</div>
                          <div className="text-sm text-gray-600">Margin Analysis</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-purple-600">$1,640M</div>
                        <div className="text-sm text-green-600 font-medium">+1%</div>
                      </div>
                    </div>

                    {/* Operating Expenses */}
                    <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                          <TrendingUp className="h-4 w-4 text-red-600" />
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">Operating Expenses</div>
                          <div className="text-sm text-gray-600">Cost Management</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-red-600">$1,640M</div>
                        <div className="text-sm text-red-600 font-medium">-6%</div>
                      </div>
                    </div>

                    {/* Combined Chart */}
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={profitData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                          <XAxis
                            dataKey="month"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 12, fill: '#666' }}
                          />
                          <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 12, fill: '#666' }}
                            tickFormatter={(value) => `$${value}`}
                            domain={[1500, 1800]}
                          />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: 'white',
                              border: '1px solid #e5e7eb',
                              borderRadius: '8px',
                              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                            }}
                            formatter={(value) => [`$${value}M`, '']}
                          />
                          <Legend />
                          <Bar dataKey="grossProfit" fill="#8b5cf6" name="Gross Profit" radius={[2, 2, 0, 0]} />
                          <Bar dataKey="operatingExpenses" fill="#ef4444" name="Operating Expenses" radius={[2, 2, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Financial Summary Table with AI Insight side by side */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" style={{ minHeight: '600px' }}>
              {/* Main Financial Table */}
              <div className="lg:col-span-2">
                <Card className="h-full flex flex-col shadow-xl border-0">
                  <CardHeader className="flex-shrink-0 border-b bg-gradient-to-r from-slate-50 to-gray-50">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-xl font-bold text-gray-900">Financial Summary</CardTitle>
                        <CardDescription className="text-gray-600 mt-1">Performance comparison across key metrics</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col justify-center p-0">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b-2 border-gray-200">
                            <th className="text-left py-4 px-6 font-bold text-gray-700 text-sm uppercase tracking-wide bg-gray-50">Category</th>
                            <th className="text-center py-4 px-6 font-bold text-gray-700 text-sm uppercase tracking-wide bg-gray-50">Actual</th>
                            <th className="text-center py-4 px-6 font-bold text-gray-700 text-sm uppercase tracking-wide bg-gray-50">Latest Estimate</th>
                            <th className="text-center py-4 px-6 font-bold text-gray-700 text-sm uppercase tracking-wide bg-gray-50">% LE</th>
                            <th className="text-center py-4 px-6 font-bold text-gray-700 text-sm uppercase tracking-wide bg-gray-50">Budget</th>
                            <th className="text-center py-4 px-6 font-bold text-gray-700 text-sm uppercase tracking-wide bg-gray-50">% Budget</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                            <td className="py-5 px-6">
                              <div className="flex items-center">
                                <div className="w-3 h-3 bg-red-500 rounded-full mr-3"></div>
                                <span className="font-semibold text-gray-900">Net Sales</span>
                              </div>
                            </td>
                            <td className="py-5 px-6 text-center">
                              <div className="inline-flex items-center px-4 py-2 bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 text-slate-900 text-sm font-bold rounded-xl shadow-sm hover:shadow-md transition-shadow">
                                <svg className="w-4 h-4 mr-2 text-slate-600" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
                                </svg>
                                <span className="font-mono">$1,625.00</span>
                              </div>
                            </td>
                            <td className="py-5 px-6 text-center">
                              <span className="inline-flex items-center px-4 py-2 bg-blue-50 text-blue-700 text-sm font-semibold rounded-lg border border-blue-200">$1,740.00</span>
                            </td>
                            <td className="py-5 px-6 text-center">
                              <span className="inline-flex items-center px-3 py-1.5 bg-red-50 text-red-700 text-sm font-bold rounded-full border border-red-200">
                                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"/>
                                </svg>
                                -13%
                              </span>
                            </td>
                            <td className="py-5 px-6 text-center">
                              <div className="inline-flex items-center px-4 py-2 bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 text-slate-900 text-sm font-bold rounded-xl shadow-sm hover:shadow-md transition-shadow">
                                <svg className="w-4 h-4 mr-2 text-slate-600" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
                                </svg>
                                <span className="font-mono">$123.00</span>
                              </div>
                            </td>
                            <td className="py-5 px-6 text-center">
                              <span className="inline-flex items-center px-3 py-1.5 bg-green-50 text-green-700 text-sm font-bold rounded-full border border-green-200">
                                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd"/>
                                </svg>
                                1.2%
                              </span>
                            </td>
                          </tr>
                          <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                            <td className="py-5 px-6">
                              <div className="flex items-center">
                                <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                                <span className="font-semibold text-gray-900">New Customer</span>
                              </div>
                            </td>
                            <td className="py-5 px-6 text-center">
                              <div className="inline-flex items-center px-4 py-2 bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 text-slate-900 text-sm font-bold rounded-xl shadow-sm hover:shadow-md transition-shadow">
                                <svg className="w-4 h-4 mr-2 text-slate-600" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
                                </svg>
                                <span className="font-mono">$1,680.00</span>
                              </div>
                            </td>
                            <td className="py-5 px-6 text-center">
                              <span className="inline-flex items-center px-4 py-2 bg-blue-50 text-blue-700 text-sm font-semibold rounded-lg border border-blue-200">$1,740.00</span>
                            </td>
                            <td className="py-5 px-6 text-center">
                              <span className="inline-flex items-center px-3 py-1.5 bg-green-50 text-green-700 text-sm font-bold rounded-full border border-green-200">
                                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd"/>
                                </svg>
                                2%
                              </span>
                            </td>
                            <td className="py-5 px-6 text-center">
                              <div className="inline-flex items-center px-4 py-2 bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 text-slate-900 text-sm font-bold rounded-xl shadow-sm hover:shadow-md transition-shadow">
                                <svg className="w-4 h-4 mr-2 text-slate-600" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
                                </svg>
                                <span className="font-mono">$55.00</span>
                              </div>
                            </td>
                            <td className="py-5 px-6 text-center">
                              <span className="inline-flex items-center px-3 py-1.5 bg-green-50 text-green-700 text-sm font-bold rounded-full border border-green-200">
                                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd"/>
                                </svg>
                                3.1%
                              </span>
                            </td>
                          </tr>
                          <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                            <td className="py-5 px-6">
                              <div className="flex items-center">
                                <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                                <span className="font-semibold text-gray-900">Gross Profit</span>
                              </div>
                            </td>
                            <td className="py-5 px-6 text-center">
                              <div className="inline-flex items-center px-4 py-2 bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 text-slate-900 text-sm font-bold rounded-xl shadow-sm hover:shadow-md transition-shadow">
                                <svg className="w-4 h-4 mr-2 text-slate-600" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
                                </svg>
                                <span className="font-mono">$1,640.00</span>
                              </div>
                            </td>
                            <td className="py-5 px-6 text-center">
                              <span className="inline-flex items-center px-4 py-2 bg-blue-50 text-blue-700 text-sm font-semibold rounded-lg border border-blue-200">$1,740.00</span>
                            </td>
                            <td className="py-5 px-6 text-center">
                              <span className="inline-flex items-center px-3 py-1.5 bg-green-50 text-green-700 text-sm font-bold rounded-full border border-green-200">
                                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd"/>
                                </svg>
                                1%
                              </span>
                            </td>
                            <td className="py-5 px-6 text-center">
                              <div className="inline-flex items-center px-4 py-2 bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 text-slate-900 text-sm font-bold rounded-xl shadow-sm hover:shadow-md transition-shadow">
                                <svg className="w-4 h-4 mr-2 text-slate-600" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
                                </svg>
                                <span className="font-mono">$97.00</span>
                              </div>
                            </td>
                            <td className="py-5 px-6 text-center">
                              <span className="inline-flex items-center px-3 py-1.5 bg-green-50 text-green-700 text-sm font-bold rounded-full border border-green-200">
                                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd"/>
                                </svg>
                                5.8%
                              </span>
                            </td>
                          </tr>
                          <tr className="hover:bg-gray-50 transition-colors">
                            <td className="py-5 px-6">
                              <div className="flex items-center">
                                <div className="w-3 h-3 bg-red-500 rounded-full mr-3"></div>
                                <span className="font-semibold text-gray-900">Operating Expenses</span>
                              </div>
                            </td>
                            <td className="py-5 px-6 text-center">
                              <div className="inline-flex items-center px-4 py-2 bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 text-slate-900 text-sm font-bold rounded-xl shadow-sm hover:shadow-md transition-shadow">
                                <svg className="w-4 h-4 mr-2 text-slate-600" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
                                </svg>
                                <span className="font-mono">$1,640.00</span>
                              </div>
                            </td>
                            <td className="py-5 px-6 text-center">
                              <span className="inline-flex items-center px-4 py-2 bg-blue-50 text-blue-700 text-sm font-semibold rounded-lg border border-blue-200">$1,740.00</span>
                            </td>
                            <td className="py-5 px-6 text-center">
                              <span className="inline-flex items-center px-3 py-1.5 bg-red-50 text-red-700 text-sm font-bold rounded-full border border-red-200">
                                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"/>
                                </svg>
                                -6%
                              </span>
                            </td>
                            <td className="py-5 px-6 text-center">
                              <div className="inline-flex items-center px-4 py-2 bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 text-slate-900 text-sm font-bold rounded-xl shadow-sm hover:shadow-md transition-shadow">
                                <svg className="w-4 h-4 mr-2 text-slate-600" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
                                </svg>
                                <span className="font-mono">$97.00</span>
                              </div>
                            </td>
                            <td className="py-5 px-6 text-center">
                              <span className="inline-flex items-center px-3 py-1.5 bg-green-50 text-green-700 text-sm font-bold rounded-full border border-green-200">
                                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd"/>
                                </svg>
                                5.8%
                              </span>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* AI Insight Sidebar */}
              <div className="lg:col-span-1">
                <Card className="h-full flex flex-col shadow-xl border-0">
                  <CardHeader className="flex-shrink-0 pb-3 border-b bg-gradient-to-r from-green-50 to-emerald-50">
                    <CardTitle className="text-xl font-bold text-gray-900">AI Growth Analysis</CardTitle>
                    <CardDescription className="text-gray-600 mt-1">LOB Performance & Market Insights</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1 overflow-hidden p-0">
                      <div 
                        className="h-full overflow-y-auto px-6 pb-6 space-y-3 custom-scrollbar" 
                        style={{
                          scrollbarWidth: 'thin',
                          scrollbarColor: '#cbd5e1 #f1f5f9',
                          minHeight: '500px'
                        }}
                      >
                      {/* Overall Growth Summary */}
                      <div className="p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                        <div className="flex items-center justify-between mb-2">
                          <div className="font-semibold text-gray-900 text-sm">Overall Growth Rate</div>
                          <span className="px-2 py-1 bg-green-500 text-white text-xs font-bold rounded-full">+22.5%</span>
                        </div>
                        <p className="text-xs text-gray-700 mb-2">
                          Exceptional performance across all LOBs with emerging tech leading growth.
                        </p>
                        <div className="space-y-1">
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-gray-600">Top Performer:</span>
                            <span className="text-xs font-medium text-green-700">Emerging Tech (+45%)</span>
                    </div>
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-gray-600">Total Revenue:</span>
                            <span className="text-xs font-medium text-gray-900">$1,300M</span>
                        </div>
                      </div>
                    </div>

                      {/* Top 3 Growth Drivers */}
                      <div className="space-y-2">
                        <h4 className="font-medium text-gray-900 text-sm">Top Growth Drivers</h4>
                        
                        <div className="p-2 bg-green-50 rounded-lg border-l-3 border-green-400">
                          <div className="flex justify-between items-start mb-1">
                            <span className="text-sm font-medium text-green-900">Emerging Technologies</span>
                            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">+45%</span>
              </div>
                          <p className="text-xs text-green-700">AI/ML adoption driving $125M revenue</p>
            </div>

                        <div className="p-2 bg-green-50 rounded-lg border-l-3 border-green-400">
                          <div className="flex justify-between items-start mb-1">
                            <span className="text-sm font-medium text-green-900">Mobile Solutions</span>
                            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">+35%</span>
                      </div>
                          <p className="text-xs text-green-700">Cross-platform development surge</p>
                    </div>

                        <div className="p-2 bg-green-50 rounded-lg border-l-3 border-green-400">
                          <div className="flex justify-between items-start mb-1">
                            <span className="text-sm font-medium text-green-900">SaaS Solutions</span>
                            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">+25%</span>
                      </div>
                          <p className="text-xs text-green-700">Cloud migration accelerating</p>
                    </div>
                  </div>

                      {/* Market Insights */}
                      <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <div className="font-medium text-amber-900 text-sm">Market Opportunity</div>
                            <div className="text-xs text-amber-700">Q1 2024 Outlook</div>
                          </div>
                          <span className="px-2 py-1 bg-amber-500 text-white text-xs rounded">High</span>
                        </div>
                        <p className="text-xs text-amber-800">
                          Digital transformation spending expected to increase 15% YoY, with AI/ML investments leading.
                        </p>
                  </div>

                      {/* Risk Assessment */}
                      <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <div className="font-medium text-orange-900 text-sm">Risk Factors</div>
                            <div className="text-xs text-orange-700">Monitor closely</div>
                          </div>
                          <span className="px-2 py-1 bg-orange-500 text-white text-xs rounded">Medium</span>
                        </div>
                        <p className="text-xs text-orange-800">
                          Economic headwinds may impact enterprise spending in traditional segments.
                        </p>
                        </div>
                      </div>
                  </CardContent>
                </Card>
                    </div>
                  </div>

            {/* Growth Rate Analysis by LOB */}
            <Card className="shadow-xl border-0">
              <CardHeader className="border-b bg-gradient-to-r from-amber-50 to-orange-50">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl font-bold text-gray-900">Growth Rate Analysis by Line of Business</CardTitle>
                    <CardDescription className="text-gray-600 mt-1">Comprehensive performance across all 6 business segments</CardDescription>
                  </div>
                  <div className="text-right bg-white px-4 py-2 rounded-lg shadow-sm">
                    <div className="text-2xl font-bold text-green-600">+22.5%</div>
                    <div className="text-sm text-gray-500 font-medium">Avg Growth</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {lobGrowthData.map((lob, index) => {
                    const bgColor = lob.color === 'green' 
                      ? 'from-green-50 to-emerald-50 border-green-200' 
                      : 'from-red-50 to-rose-50 border-red-200';
                    const textColor = lob.color === 'green' 
                      ? 'text-green-900' 
                      : 'text-red-900';
                    const badgeColor = lob.color === 'green' 
                      ? 'bg-green-600' 
                      : 'bg-red-600';
                    
                    return (
                      <div key={index} className={`p-4 bg-gradient-to-br ${bgColor} rounded-lg border`}>
                        <div className="flex items-center justify-between mb-3">
                          <div className={`font-semibold ${textColor}`}>{lob.name}</div>
                          <span className={`px-3 py-1 ${badgeColor} text-white text-sm rounded-full font-bold`}>{lob.growth}</span>
                    </div>
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-sm text-gray-600">Revenue:</span>
                          <span className="text-sm font-bold text-gray-900">{lob.revenue}</span>
                    </div>
                        <p className="text-sm text-gray-700 mb-3 leading-relaxed">{lob.reason}</p>
                        <div className="space-y-1">
                          <div className="text-xs font-medium text-gray-600 mb-2">Key Drivers:</div>
                          {lob.details.map((detail, idx) => (
                            <div key={idx} className="flex items-center justify-between text-xs">
                              <span className="text-gray-600">• {detail.segment}:</span>
                              <span className={`font-medium ${
                                lob.color === 'green' 
                                  ? 'text-green-700' 
                                  : 'text-red-700'
                              }`}>{detail.growth}</span>
                  </div>
                          ))}
                    </div>
                        <div className="mt-3 pt-2 border-t border-gray-200">
                          <div className="text-xs text-gray-500">Primary driver: {lob.details[0].driver}</div>
                    </div>
                  </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Project Planning Tasks */}
            <Card className="shadow-xl border-0">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl font-bold text-gray-900 flex items-center">
                      <div className="w-3 h-3 bg-blue-500 rounded-full mr-3 animate-pulse"></div>
                      Project Planning Tasks
                    </CardTitle>
                    <CardDescription className="text-gray-600 mt-1 font-medium">
                      Comprehensive tracking of planning preparation and operational approvals
                    </CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="px-4 py-2 bg-green-500 text-white text-sm font-bold rounded-lg shadow-md">
                      5/11 Completed
                    </div>
                    <div className="px-4 py-2 bg-yellow-500 text-white text-sm font-bold rounded-lg shadow-md">
                      6 In Progress
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b-2 border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
                        <th className="text-left py-4 px-6 font-bold text-gray-800 text-sm uppercase tracking-wide">
                          <div className="flex items-center">
                            <svg className="w-4 h-4 mr-2 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                            </svg>
                            Task
                          </div>
                        </th>
                        <th className="text-left py-4 px-6 font-bold text-gray-800 text-sm uppercase tracking-wide">
                          <div className="flex items-center">
                            <svg className="w-4 h-4 mr-2 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"/>
                            </svg>
                            Owner
                          </div>
                        </th>
                        <th className="text-center py-4 px-6 font-bold text-gray-800 text-sm uppercase tracking-wide">
                          <div className="flex items-center justify-center">
                            <svg className="w-4 h-4 mr-2 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
                              <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
                            </svg>
                            Notify
                          </div>
                        </th>
                        <th className="text-center py-4 px-6 font-bold text-gray-800 text-sm uppercase tracking-wide">
                          <div className="flex items-center justify-center">
                            <svg className="w-4 h-4 mr-2 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                            </svg>
                            Status
                          </div>
                        </th>
                        <th className="text-center py-4 px-6 font-bold text-gray-800 text-sm uppercase tracking-wide">
                          <div className="flex items-center justify-center">
                            <svg className="w-4 h-4 mr-2 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"/>
                            </svg>
                            Start Date
                          </div>
                        </th>
                        <th className="text-center py-4 px-6 font-bold text-gray-800 text-sm uppercase tracking-wide">
                          <div className="flex items-center justify-center">
                            <svg className="w-4 h-4 mr-2 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"/>
                            </svg>
                            End Date
                          </div>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* PLANNING PREPARATION Section */}
                      <tr className="bg-gradient-to-r from-blue-100 to-blue-50 border-l-4 border-blue-500">
                        <td colSpan={6} className="py-3 px-6 font-bold text-blue-900 text-sm uppercase tracking-wide">
                          <div className="flex items-center">
                            <svg className="w-5 h-5 mr-3 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z"/>
                              <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd"/>
                            </svg>
                            📋 Planning Preparation
                          </div>
                        </td>
                      </tr>
                      <tr className="border-b border-gray-200 hover:bg-blue-50 transition-colors duration-200">
                        <td className="py-4 px-6 text-sm font-medium text-gray-900">
                          <div className="flex items-center">
                            <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                            Load newly added GL Segments
                          </div>
                        </td>
                        <td className="py-4 px-6 text-sm">
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                              <span className="text-blue-600 font-semibold text-xs">JL</span>
                            </div>
                            <span className="text-blue-600 font-medium">James, Leroy</span>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-center">
                          <button className="inline-flex items-center px-3 py-1 bg-purple-100 text-purple-700 text-xs font-semibold rounded-full hover:bg-purple-200 transition-colors">
                            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
                              <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
                            </svg>
                            Email Owner
                          </button>
                        </td>
                        <td className="py-4 px-6 text-center">
                          <div className="inline-flex items-center px-2 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">
                            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                            </svg>
                            Completed
                          </div>
                        </td>
                        <td className="py-4 px-6 text-center">
                          <div className="inline-flex items-center px-3 py-2 bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 text-blue-800 text-xs font-semibold rounded-lg shadow-sm">
                            <svg className="w-3 h-3 mr-2 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"/>
                            </svg>
                            <span className="font-mono">4/1/21</span>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-center">
                          <div className="inline-flex items-center px-3 py-2 bg-gradient-to-r from-red-50 to-red-100 border border-red-200 text-red-800 text-xs font-semibold rounded-lg shadow-sm">
                            <svg className="w-3 h-3 mr-2 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"/>
                            </svg>
                            <span className="font-mono">4/1/21</span>
                          </div>
                        </td>
                      </tr>
                      <tr className="border-b border-gray-200 hover:bg-blue-50 transition-colors duration-200">
                        <td className="py-4 px-6 text-sm font-medium text-gray-900">
                          <div className="flex items-center">
                            <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                            Load Actuals from Ledger
                          </div>
                        </td>
                        <td className="py-4 px-6 text-sm">
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                              <span className="text-blue-600 font-semibold text-xs">JL</span>
                            </div>
                            <span className="text-blue-600 font-medium">James, Leroy</span>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-center">
                          <button className="inline-flex items-center px-3 py-1 bg-purple-100 text-purple-700 text-xs font-semibold rounded-full hover:bg-purple-200 transition-colors">
                            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
                              <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
                            </svg>
                            Email Owner
                          </button>
                        </td>
                        <td className="py-4 px-6 text-center">
                          <div className="inline-flex items-center px-2 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">
                            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                            </svg>
                            Completed
                          </div>
                        </td>
                        <td className="py-4 px-6 text-center">
                          <div className="inline-flex items-center px-3 py-2 bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 text-blue-800 text-xs font-semibold rounded-lg shadow-sm">
                            <svg className="w-3 h-3 mr-2 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"/>
                            </svg>
                            <span className="font-mono">4/1/21</span>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-center">
                          <div className="inline-flex items-center px-3 py-2 bg-gradient-to-r from-red-50 to-red-100 border border-red-200 text-red-800 text-xs font-semibold rounded-lg shadow-sm">
                            <svg className="w-3 h-3 mr-2 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"/>
                            </svg>
                            <span className="font-mono">4/1/21</span>
                          </div>
                        </td>
                      </tr>
                      <tr className="border-b border-gray-200 hover:bg-blue-50 transition-colors duration-200">
                        <td className="py-4 px-6 text-sm font-medium text-gray-900">
                          <div className="flex items-center">
                            <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                            Update Currency Rate Assumptions
                          </div>
                        </td>
                        <td className="py-4 px-6 text-sm">
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                              <span className="text-blue-600 font-semibold text-xs">JL</span>
                            </div>
                            <span className="text-blue-600 font-medium">James, Leroy</span>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-center">
                          <button className="inline-flex items-center px-3 py-1 bg-purple-100 text-purple-700 text-xs font-semibold rounded-full hover:bg-purple-200 transition-colors">
                            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
                              <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
                            </svg>
                            Email Owner
                          </button>
                        </td>
                        <td className="py-4 px-6 text-center">
                          <div className="inline-flex items-center px-2 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">
                            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                            </svg>
                            Completed
                          </div>
                        </td>
                        <td className="py-4 px-6 text-center">
                          <div className="inline-flex items-center px-3 py-2 bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 text-blue-800 text-xs font-semibold rounded-lg shadow-sm">
                            <svg className="w-3 h-3 mr-2 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"/>
                            </svg>
                            <span className="font-mono">4/2/21</span>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-center">
                          <div className="inline-flex items-center px-3 py-2 bg-gradient-to-r from-red-50 to-red-100 border border-red-200 text-red-800 text-xs font-semibold rounded-lg shadow-sm">
                            <svg className="w-3 h-3 mr-2 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"/>
                            </svg>
                            <span className="font-mono">4/2/21</span>
                          </div>
                        </td>
                      </tr>
                      <tr className="border-b border-gray-200 hover:bg-blue-50 transition-colors duration-200">
                        <td className="py-4 px-6 text-sm font-medium text-gray-900">
                          <div className="flex items-center">
                            <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                            Update Planning Templates
                          </div>
                        </td>
                        <td className="py-4 px-6 text-sm">
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                              <span className="text-blue-600 font-semibold text-xs">AJ</span>
                            </div>
                            <span className="text-blue-600 font-medium">Adam, James</span>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-center">
                          <button className="inline-flex items-center px-3 py-1 bg-purple-100 text-purple-700 text-xs font-semibold rounded-full hover:bg-purple-200 transition-colors">
                            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
                              <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
                            </svg>
                            Email Owner
                          </button>
                        </td>
                        <td className="py-4 px-6 text-center">
                          <div className="inline-flex items-center px-2 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">
                            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                            </svg>
                            Completed
                          </div>
                        </td>
                        <td className="py-4 px-6 text-center">
                          <div className="inline-flex items-center px-3 py-2 bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 text-blue-800 text-xs font-semibold rounded-lg shadow-sm">
                            <svg className="w-3 h-3 mr-2 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"/>
                            </svg>
                            <span className="font-mono">4/5/21</span>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-center">
                          <div className="inline-flex items-center px-3 py-2 bg-gradient-to-r from-red-50 to-red-100 border border-red-200 text-red-800 text-xs font-semibold rounded-lg shadow-sm">
                            <svg className="w-3 h-3 mr-2 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"/>
                            </svg>
                            <span className="font-mono">4/5/21</span>
                          </div>
                        </td>
                      </tr>
                      <tr className="border-b border-gray-200 hover:bg-blue-50 transition-colors duration-200">
                        <td className="py-4 px-6 text-sm font-medium text-gray-900">
                          <div className="flex items-center">
                            <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                            Open Application for Planners
                          </div>
                        </td>
                        <td className="py-4 px-6 text-sm">
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                              <span className="text-blue-600 font-semibold text-xs">AJ</span>
                            </div>
                            <span className="text-blue-600 font-medium">Adam, James</span>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-center">
                          <button className="inline-flex items-center px-3 py-1 bg-purple-100 text-purple-700 text-xs font-semibold rounded-full hover:bg-purple-200 transition-colors">
                            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
                              <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
                            </svg>
                            Email Owner
                          </button>
                        </td>
                        <td className="py-4 px-6 text-center">
                          <div className="inline-flex items-center px-2 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">
                            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                            </svg>
                            Completed
                          </div>
                        </td>
                        <td className="py-4 px-6 text-center">
                          <div className="inline-flex items-center px-3 py-2 bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 text-blue-800 text-xs font-semibold rounded-lg shadow-sm">
                            <svg className="w-3 h-3 mr-2 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"/>
                            </svg>
                            <span className="font-mono">4/5/21</span>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-center">
                          <div className="inline-flex items-center px-3 py-2 bg-gradient-to-r from-red-50 to-red-100 border border-red-200 text-red-800 text-xs font-semibold rounded-lg shadow-sm">
                            <svg className="w-3 h-3 mr-2 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"/>
                            </svg>
                            <span className="font-mono">4/5/21</span>
                          </div>
                        </td>
                      </tr>
                      <tr className="border-b border-gray-200 hover:bg-blue-50 transition-colors duration-200">
                        <td className="py-4 px-6 text-sm font-medium text-gray-900">
                          <div className="flex items-center">
                            <div className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></div>
                            Plan G&A Expenses
                          </div>
                        </td>
                        <td className="py-4 px-6 text-sm">
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                              <span className="text-blue-600 font-semibold text-xs">AJ</span>
                            </div>
                            <span className="text-blue-600 font-medium">Adam, James</span>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-center">
                          <button className="inline-flex items-center px-3 py-1 bg-purple-100 text-purple-700 text-xs font-semibold rounded-full hover:bg-purple-200 transition-colors">
                            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
                              <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
                            </svg>
                            Email Owner
                          </button>
                        </td>
                        <td className="py-4 px-6 text-center">
                          <div className="inline-flex items-center px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded-full">
                            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"/>
                            </svg>
                            In Progress
                          </div>
                        </td>
                        <td className="py-4 px-6 text-center">
                          <div className="inline-flex items-center px-3 py-2 bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 text-blue-800 text-xs font-semibold rounded-lg shadow-sm">
                            <svg className="w-3 h-3 mr-2 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"/>
                            </svg>
                            <span className="font-mono">4/5/21</span>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-center">
                          <div className="inline-flex items-center px-3 py-2 bg-gradient-to-r from-red-50 to-red-100 border border-red-200 text-red-800 text-xs font-semibold rounded-lg shadow-sm">
                            <svg className="w-3 h-3 mr-2 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"/>
                            </svg>
                            <span className="font-mono">4/7/21</span>
                          </div>
                        </td>
                      </tr>
                      <tr className="border-b border-gray-200 hover:bg-blue-50 transition-colors duration-200">
                        <td className="py-4 px-6 text-sm font-medium text-gray-900">
                          <div className="flex items-center">
                            <div className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></div>
                            Plan Workforce Expenses
                          </div>
                        </td>
                        <td className="py-4 px-6 text-sm">
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                              <span className="text-blue-600 font-semibold text-xs">AJ</span>
                            </div>
                            <span className="text-blue-600 font-medium">Adam, James</span>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-center">
                          <button className="inline-flex items-center px-3 py-1 bg-purple-100 text-purple-700 text-xs font-semibold rounded-full hover:bg-purple-200 transition-colors">
                            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
                              <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
                            </svg>
                            Email Owner
                          </button>
                        </td>
                        <td className="py-4 px-6 text-center">
                          <div className="inline-flex items-center px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded-full">
                            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"/>
                            </svg>
                            In Progress
                          </div>
                        </td>
                        <td className="py-4 px-6 text-center">
                          <div className="inline-flex items-center px-3 py-2 bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 text-blue-800 text-xs font-semibold rounded-lg shadow-sm">
                            <svg className="w-3 h-3 mr-2 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"/>
                            </svg>
                            <span className="font-mono">4/5/21</span>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-center">
                          <div className="inline-flex items-center px-3 py-2 bg-gradient-to-r from-red-50 to-red-100 border border-red-200 text-red-800 text-xs font-semibold rounded-lg shadow-sm">
                            <svg className="w-3 h-3 mr-2 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"/>
                            </svg>
                            <span className="font-mono">4/7/21</span>
                          </div>
                        </td>
                      </tr>
                      <tr className="border-b border-gray-200 hover:bg-blue-50 transition-colors duration-200">
                        <td className="py-4 px-6 text-sm font-medium text-gray-900">
                          <div className="flex items-center">
                            <div className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></div>
                            Plan Capital Expenses
                          </div>
                        </td>
                        <td className="py-4 px-6 text-sm">
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                              <span className="text-blue-600 font-semibold text-xs">AJ</span>
                            </div>
                            <span className="text-blue-600 font-medium">Adam, James</span>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-center">
                          <button className="inline-flex items-center px-3 py-1 bg-purple-100 text-purple-700 text-xs font-semibold rounded-full hover:bg-purple-200 transition-colors">
                            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
                              <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
                            </svg>
                            Email Owner
                          </button>
                        </td>
                        <td className="py-4 px-6 text-center">
                          <div className="inline-flex items-center px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded-full">
                            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"/>
                            </svg>
                            In Progress
                          </div>
                        </td>
                        <td className="py-4 px-6 text-center">
                          <div className="inline-flex items-center px-3 py-2 bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 text-blue-800 text-xs font-semibold rounded-lg shadow-sm">
                            <svg className="w-3 h-3 mr-2 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"/>
                            </svg>
                            <span className="font-mono">4/7/21</span>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-center">
                          <div className="inline-flex items-center px-3 py-2 bg-gradient-to-r from-red-50 to-red-100 border border-red-200 text-red-800 text-xs font-semibold rounded-lg shadow-sm">
                            <svg className="w-3 h-3 mr-2 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"/>
                            </svg>
                            <span className="font-mono">4/9/21</span>
                          </div>
                        </td>
                      </tr>

                      
                      {/* OPERATIONAL PLANNING Section */}
                      <tr className="bg-gradient-to-r from-orange-100 to-orange-50 border-l-4 border-orange-500">
                        <td colSpan={6} className="py-3 px-6 font-bold text-orange-900 text-sm uppercase tracking-wide">
                          <div className="flex items-center">
                            <svg className="w-5 h-5 mr-3 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd"/>
                              <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z"/>
                            </svg>
                            🚀 Operational Planning
                          </div>
                        </td>
                      </tr>
                      <tr className="border-b border-gray-200 hover:bg-orange-50 transition-colors duration-200">
                        <td className="py-4 px-6 text-sm font-medium text-gray-900">
                          <div className="flex items-center">
                            <div className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></div>
                            Approve/Reject Workforce Plan
                          </div>
                        </td>
                        <td className="py-4 px-6 text-sm">
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                              <span className="text-green-600 font-semibold text-xs">GL</span>
                            </div>
                            <span className="text-green-600 font-medium">Geyer, Les</span>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-center">
                          <button className="inline-flex items-center px-3 py-1 bg-purple-100 text-purple-700 text-xs font-semibold rounded-full hover:bg-purple-200 transition-colors">
                            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
                              <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
                            </svg>
                            Email Owner
                          </button>
                        </td>
                        <td className="py-4 px-6 text-center">
                          <div className="inline-flex items-center px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded-full">
                            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"/>
                            </svg>
                            In Progress
                          </div>
                        </td>
                        <td className="py-4 px-6 text-center">
                          <div className="inline-flex items-center px-3 py-2 bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 text-blue-800 text-xs font-semibold rounded-lg shadow-sm">
                            <svg className="w-3 h-3 mr-2 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"/>
                            </svg>
                            <span className="font-mono">4/9/21</span>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-center">
                          <div className="inline-flex items-center px-3 py-2 bg-gradient-to-r from-red-50 to-red-100 border border-red-200 text-red-800 text-xs font-semibold rounded-lg shadow-sm">
                            <svg className="w-3 h-3 mr-2 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"/>
                            </svg>
                            <span className="font-mono">4/12/21</span>
                          </div>
                        </td>
                      </tr>
                      <tr className="border-b border-gray-200 hover:bg-orange-50 transition-colors duration-200">
                        <td className="py-4 px-6 text-sm font-medium text-gray-900">
                          <div className="flex items-center">
                            <div className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></div>
                            Approve/Reject Capital Plan
                          </div>
                        </td>
                        <td className="py-4 px-6 text-sm">
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                              <span className="text-green-600 font-semibold text-xs">GL</span>
                            </div>
                            <span className="text-green-600 font-medium">Geyer, Les</span>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-center">
                          <button className="inline-flex items-center px-3 py-1 bg-purple-100 text-purple-700 text-xs font-semibold rounded-full hover:bg-purple-200 transition-colors">
                            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
                              <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
                            </svg>
                            Email Owner
                          </button>
                        </td>
                        <td className="py-4 px-6 text-center">
                          <div className="inline-flex items-center px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded-full">
                            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"/>
                            </svg>
                            In Progress
                          </div>
                        </td>
                        <td className="py-4 px-6 text-center">
                          <div className="inline-flex items-center px-3 py-2 bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 text-blue-800 text-xs font-semibold rounded-lg shadow-sm">
                            <svg className="w-3 h-3 mr-2 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"/>
                            </svg>
                            <span className="font-mono">4/9/21</span>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-center">
                          <div className="inline-flex items-center px-3 py-2 bg-gradient-to-r from-red-50 to-red-100 border border-red-200 text-red-800 text-xs font-semibold rounded-lg shadow-sm">
                            <svg className="w-3 h-3 mr-2 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"/>
                            </svg>
                            <span className="font-mono">4/12/21</span>
                          </div>
                        </td>
                      </tr>
                      <tr className="border-b border-gray-200 hover:bg-green-50 transition-colors duration-200">
                        <td className="py-4 px-6 text-sm font-medium text-gray-900">
                          <div className="flex items-center">
                            <div className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></div>
                            Approve/Reject G&A Plan
                          </div>
                        </td>
                        <td className="py-4 px-6 text-sm">
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                              <span className="text-green-600 font-semibold text-xs">GL</span>
                            </div>
                            <span className="text-green-600 font-medium">Geyer, Les</span>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-center">
                          <button className="inline-flex items-center px-3 py-1 bg-purple-100 text-purple-700 text-xs font-semibold rounded-full hover:bg-purple-200 transition-colors">
                            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
                              <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
                            </svg>
                            Email Owner
                          </button>
                        </td>
                        <td className="py-4 px-6 text-center">
                          <div className="inline-flex items-center px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded-full">
                            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"/>
                            </svg>
                            In Progress
                          </div>
                        </td>
                        <td className="py-4 px-6 text-center">
                          <div className="inline-flex items-center px-3 py-2 bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 text-blue-800 text-xs font-semibold rounded-lg shadow-sm">
                            <svg className="w-3 h-3 mr-2 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"/>
                            </svg>
                            <span className="font-mono">4/9/21</span>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-center">
                          <div className="inline-flex items-center px-3 py-2 bg-gradient-to-r from-red-50 to-red-100 border border-red-200 text-red-800 text-xs font-semibold rounded-lg shadow-sm">
                            <svg className="w-3 h-3 mr-2 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"/>
                            </svg>
                            <span className="font-mono">4/12/21</span>
                          </div>
                        </td>
                      </tr>
                      
                      {/* OPERATIONAL APPROVALS Section */}
                      <tr className="bg-gradient-to-r from-green-100 to-green-50 border-l-4 border-green-500">
                        <td colSpan={6} className="py-3 px-6 font-bold text-green-900 text-sm uppercase tracking-wide">
                          <div className="flex items-center">
                            <svg className="w-5 h-5 mr-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                            </svg>
                            ✅ Operational Approvals
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
    </>
  );
}