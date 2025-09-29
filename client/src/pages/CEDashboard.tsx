import React from 'react';
import { useKeycloak } from '@/contexts/KeycloakContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  DollarSign, 
  Target, 
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  Users,
  Calendar,
  Info
} from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

// Sample data for CE Dashboard based on Figma design
const kpiData = [
  {
    title: 'Year Target',
    value: '100,000',
    unit: '$',
    change: '',
    trend: 'up',
    period: 'Latest data: 20/12/26 12:07',
    icon: DollarSign,
    color: 'blue'
  },
  {
    title: 'LE Target',
    value: '127',
    unit: '',
    change: '',
    trend: 'up', 
    period: 'Latest data: 20/12/26 12:07',
    icon: TrendingUp,
    color: 'purple'
  },
  {
    title: 'YTD Actual',
    value: '20',
    unit: '',
    change: '',
    trend: 'up',
    period: 'Latest data: 20/12/26 12:07',
    icon: BarChart3,
    color: 'teal'
  },
  {
    title: 'Sales Target',
    value: '50',
    unit: '',
    change: '',
    trend: 'up',
    period: 'Latest data: 20/12/26 12:07',
    icon: Users,
    color: 'orange'
  }
];

// YTD Actual by CE data - Multi-line chart
const ytdActualData = [
  { month: 'Jan', Technology: 45000, Marketing: 30000, Operations: 25000, Sales: 35000 },
  { month: 'Feb', Technology: 48000, Marketing: 32000, Operations: 28000, Sales: 38000 },
  { month: 'Mar', Technology: 52000, Marketing: 35000, Operations: 30000, Sales: 42000 },
  { month: 'Apr', Technology: 46000, Marketing: 28000, Operations: 32000, Sales: 40000 },
  { month: 'May', Technology: 50000, Marketing: 38000, Operations: 35000, Sales: 45000 },
  { month: 'Jun', Technology: 55000, Marketing: 42000, Operations: 38000, Sales: 48000 },
  { month: 'Jul', Technology: 58000, Marketing: 45000, Operations: 40000, Sales: 52000 },
  { month: 'Aug', Technology: 62000, Marketing: 48000, Operations: 42000, Sales: 55000 },
  { month: 'Sep', Technology: 60000, Marketing: 46000, Operations: 45000, Sales: 58000 },
  { month: 'Oct', Technology: 65000, Marketing: 50000, Operations: 48000, Sales: 60000 },
  { month: 'Nov', Technology: 68000, Marketing: 52000, Operations: 50000, Sales: 62000 },
  { month: 'Dec', Technology: 70000, Marketing: 55000, Operations: 52000, Sales: 65000 }
];

// Sales Target by Month data
const salesTargetData = [
  { month: 'Jan', target: 40000, actual: 35000 },
  { month: 'Feb', target: 45000, actual: 42000 },
  { month: 'Mar', target: 50000, actual: 48000 },
  { month: 'Apr', target: 55000, actual: 52000 },
  { month: 'May', target: 60000, actual: 58000 },
  { month: 'Jun', target: 65000, actual: 62000 },
  { month: 'Jul', target: 70000, actual: 68000 },
  { month: 'Aug', target: 75000, actual: 72000 }
];

// LE Achievement data
const leAchievementData = [
  { name: 'Category 1', value: 50000000, color: '#3b82f6' },
  { name: 'Category 2', value: 25000000, color: '#f97316' },
  { name: 'Category 3', value: 15000000, color: '#10b981' },
  { name: 'Category 4', value: 7000000, color: '#8b5cf6' },
  { name: 'Category 5', value: 3000000, color: '#ef4444' }
];

const COLORS = ['#3b82f6', '#f97316', '#10b981', '#8b5cf6', '#ef4444'];

// Total Revenue data for Q1 2025
const totalRevenueData = [
  { period: 'Q1 2024', value: 8000000 },
  { period: 'Q2 2024', value: 8500000 },
  { period: 'Q3 2024', value: 8200000 },
  { period: 'Q4 2024', value: 8800000 },
  { period: 'Q1 2025', value: 9000000 }
];

export default function CEDashboard() {
  const { user } = useKeycloak();
  const [aiInsightQuery, setAiInsightQuery] = React.useState('');
  
  const getUserDisplayName = () => {
    if (user?.name) return user.name;
    if (user?.preferred_username) return user.preferred_username;
    if (user?.given_name && user?.family_name) return `${user.given_name} ${user.family_name}`;
    if (user?.email) return user.email.split('@')[0];
    return 'User';
  };

  const handleAiInsightSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (aiInsightQuery.trim()) {
      // TODO: Implement AI insight functionality
      console.log('AI Insight Query:', aiInsightQuery);
      // For now, just clear the input
      setAiInsightQuery('');
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Section with Gradient Background */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 p-8 text-white">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">CE Dashboard</h1>
            <p className="text-blue-100 text-lg">Welcome back, {getUserDisplayName()}</p>
            <div className="mt-4 flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm text-blue-100">Live Data</span>
              </div>
              <div className="text-sm text-blue-100">
                Last updated: 20/12/26 12:07
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30 backdrop-blur-sm">
              Version: 2024.1.6
            </Badge>
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24"></div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {kpiData.map((kpi, index) => {
          const Icon = kpi.icon;
          const isPositive = kpi.trend === 'up';
          
          return (
            <Card key={index} className="group hover:shadow-xl hover:-translate-y-1 transition-all duration-300 bg-white border-0 shadow-lg overflow-hidden">
              <CardContent className="p-0">
                {/* Gradient Header */}
                <div className={`h-2 ${
                  kpi.color === 'blue' ? 'bg-gradient-to-r from-blue-500 to-blue-600' :
                  kpi.color === 'green' ? 'bg-gradient-to-r from-green-500 to-green-600' :
                  kpi.color === 'purple' ? 'bg-gradient-to-r from-purple-500 to-purple-600' :
                  kpi.color === 'teal' ? 'bg-gradient-to-r from-teal-500 to-teal-600' :
                  'bg-gradient-to-r from-orange-500 to-orange-600'
                }`}></div>
                
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                      {kpi.title}
                    </div>
                    <div className={`p-2 rounded-xl ${
                      kpi.color === 'blue' ? 'bg-blue-50 text-blue-600' :
                      kpi.color === 'green' ? 'bg-green-50 text-green-600' :
                      kpi.color === 'purple' ? 'bg-purple-50 text-purple-600' :
                      kpi.color === 'teal' ? 'bg-teal-50 text-teal-600' :
                      'bg-orange-50 text-orange-600'
                    } group-hover:scale-110 transition-transform duration-200`}>
                      <Icon className="h-5 w-5" />
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-baseline space-x-2">
                      <div className="text-3xl font-bold text-gray-900">
                        {kpi.unit}{kpi.value}
                      </div>
                      {kpi.change && (
                        <div className={`flex items-center text-sm px-2 py-1 rounded-full ${
                          isPositive ? 'text-green-700 bg-green-100' : 'text-red-700 bg-red-100'
                        }`}>
                          {isPositive ? <ArrowUpRight className="h-3 w-3 mr-1" /> : <ArrowDownRight className="h-3 w-3 mr-1" />}
                          {kpi.change}
                        </div>
                      )}
                    </div>
                    
                    <div className="text-xs text-gray-500 font-medium">
                      {kpi.period}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 lg:gap-6">
        {/* LE Achievement */}
        <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-gray-50 hover:shadow-2xl transition-all duration-300">
          <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center space-x-3 text-gray-800">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <BarChart3 className="h-5 w-5 text-purple-600" />
                  </div>
                  <span className="text-lg font-bold">LE Achievement</span>
                  <Info className="h-4 w-4 text-gray-400 hover:text-gray-600 transition-colors" />
                </CardTitle>
              </div>
              <div className="flex space-x-2">
                <select className="text-sm border border-gray-300 rounded-lg px-3 py-2 bg-white shadow-sm hover:border-purple-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all">
                  <option>All</option>
                </select>
                <select className="text-sm border border-gray-300 rounded-lg px-3 py-2 bg-white shadow-sm hover:border-purple-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all">
                  <option>Today</option>
                </select>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex items-center space-x-8">
              {/* Donut Chart Container */}
              <div className="relative flex-shrink-0" style={{ width: '200px', height: '200px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={leAchievementData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={2}
                      dataKey="value"
                      startAngle={0}
                      endAngle={360}
                    >
                      {leAchievementData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                {/* Center Text - Perfectly Centered */}
                <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center pointer-events-none">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-gray-900 leading-none">98%</div>
                  </div>
                </div>
              </div>

              {/* Legend */}
              <div className="flex-1 space-y-3">
                {leAchievementData.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-3 h-3 rounded-full flex-shrink-0" 
                        style={{ backgroundColor: COLORS[index] }}
                      ></div>
                      <span className="text-sm font-medium text-gray-700">{item.name}</span>
                    </div>
                    <span className="text-sm font-semibold text-gray-900">
                      ${(item.value / 1000000).toFixed(0)},000,000
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Total Revenue for Q1 2025 */}
        <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-blue-50 hover:shadow-2xl transition-all duration-300">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-100 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center space-x-3 text-gray-800">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <DollarSign className="h-5 w-5 text-blue-600" />
                  </div>
                  <span className="text-lg font-bold">Total Revenue for Q1, 2025</span>
                </CardTitle>
              </div>
              <div className="flex space-x-2">
                <select className="text-sm border border-gray-300 rounded-lg px-3 py-2 bg-white shadow-sm hover:border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all">
                  <option>Q1/2025</option>
                </select>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-6">
              {/* Total Revenue Display with Icon */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-semibold text-blue-600 mb-2 uppercase tracking-wide">Total Revenue</div>
                    <div className="text-4xl font-bold text-gray-900">฿3,000,000</div>
                  </div>
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <DollarSign className="w-8 h-8 text-white" />
                  </div>
                </div>
              </div>

              {/* Revenue Breakdown */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-white border border-gray-200 rounded-xl p-5 text-center shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
                  <div className="text-sm font-medium text-gray-500 mb-2">Jan, 2025</div>
                  <div className="text-2xl font-bold text-gray-900">฿1,000,000</div>
                  <div className="mt-2 w-full h-1 bg-gradient-to-r from-blue-400 to-blue-500 rounded-full"></div>
                </div>
                <div className="bg-white border border-gray-200 rounded-xl p-5 text-center shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
                  <div className="text-sm font-medium text-gray-500 mb-2">Feb, 2025</div>
                  <div className="text-2xl font-bold text-gray-900">฿1,000,000</div>
                  <div className="mt-2 w-full h-1 bg-gradient-to-r from-purple-400 to-purple-500 rounded-full"></div>
                </div>
                <div className="bg-white border border-gray-200 rounded-xl p-5 text-center shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
                  <div className="text-sm font-medium text-gray-500 mb-2">Mar, 2025</div>
                  <div className="text-2xl font-bold text-gray-900">฿1,000,000</div>
                  <div className="mt-2 w-full h-1 bg-gradient-to-r from-indigo-400 to-indigo-500 rounded-full"></div>
                </div>
              </div>

              {/* AI Insight Input */}
              <form onSubmit={handleAiInsightSubmit} className="relative">
                <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-1 border border-gray-200">
                  <input
                    type="text"
                    value={aiInsightQuery}
                    onChange={(e) => setAiInsightQuery(e.target.value)}
                    placeholder="Ask AI for insights..."
                    className="w-full px-4 py-3 pr-24 bg-white border-0 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition-all"
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex space-x-1">
                    <button 
                      type="button"
                      className="p-2 hover:bg-blue-50 rounded-lg transition-colors group"
                      title="Add attachment"
                    >
                      <span className="text-gray-400 group-hover:text-blue-600 text-sm font-bold">+</span>
                    </button>
                    <button 
                      type="button"
                      className="p-2 hover:bg-blue-50 rounded-lg transition-colors group"
                      title="View charts"
                    >
                      <BarChart3 className="w-4 h-4 text-gray-400 group-hover:text-blue-600" />
                    </button>
                    <button 
                      type="submit"
                      className="p-2 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors"
                      title="Send query"
                    >
                      <ArrowUpRight className="w-4 h-4 text-white" />
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 lg:gap-6">
        {/* YTD Actual by CE */}
        <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-green-50 hover:shadow-2xl transition-all duration-300">
          <CardHeader className="bg-gradient-to-r from-green-50 to-teal-50 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center space-x-3 text-gray-800">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <span className="text-lg font-bold">YTD Actual by CE</span>
                    <CardDescription className="text-sm text-gray-600 mt-1">Year-to-date performance by cost element</CardDescription>
                  </div>
                </CardTitle>
              </div>
              <div className="flex space-x-2">
                <select className="text-sm border border-gray-300 rounded-lg px-3 py-2 bg-white shadow-sm hover:border-green-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all">
                  <option>All</option>
                </select>
                <select className="text-sm border border-gray-300 rounded-lg px-3 py-2 bg-white shadow-sm hover:border-green-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all">
                  <option>Today</option>
                </select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={ytdActualData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
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
                  tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                  formatter={(value) => [`$${(value as number / 1000).toFixed(0)}K`]}
                />
                <Legend 
                  verticalAlign="bottom" 
                  height={36}
                  iconType="circle"
                  wrapperStyle={{ paddingTop: '20px' }}
                />
                <Line
                  type="monotone"
                  dataKey="Technology"
                  stroke="#8b5cf6"
                  strokeWidth={2}
                  dot={false}
                  name="Technology"
                />
                <Line
                  type="monotone"
                  dataKey="Marketing"
                  stroke="#06d6a0"
                  strokeWidth={2}
                  dot={false}
                  name="Marketing"
                />
                <Line
                  type="monotone"
                  dataKey="Operations"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={false}
                  name="Operations"
                />
                <Line
                  type="monotone"
                  dataKey="Sales"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  dot={false}
                  name="Sales"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Sales Target by Month */}
        <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-orange-50 hover:shadow-2xl transition-all duration-300">
          <CardHeader className="bg-gradient-to-r from-orange-50 to-red-50 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center space-x-3 text-gray-800">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <Target className="h-5 w-5 text-orange-600" />
                  </div>
                  <div>
                    <span className="text-lg font-bold">Sales Target by Month</span>
                    <CardDescription className="text-sm text-gray-600 mt-1">Monthly target vs actual performance</CardDescription>
                  </div>
                </CardTitle>
              </div>
              <div className="flex space-x-2">
                <select className="text-sm border border-gray-300 rounded-lg px-3 py-2 bg-white shadow-sm hover:border-orange-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all">
                  <option>All</option>
                </select>
                <select className="text-sm border border-gray-300 rounded-lg px-3 py-2 bg-white shadow-sm hover:border-orange-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all">
                  <option>Month</option>
                </select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={salesTargetData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
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
                  tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                  formatter={(value) => [`$${(value as number / 1000).toFixed(0)}K`, '']}
                />
                <Bar dataKey="target" fill="#8b5cf6" name="Target" />
                <Bar dataKey="actual" fill="#06d6a0" name="Actual" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
