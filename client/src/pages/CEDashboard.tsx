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
      {/* Header Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">CE Dashboard</h1>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Live Data</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4" />
                <span>Last updated: 20/12/26 12:07</span>
              </div>
            </div>
          </div>
          <Badge variant="secondary" className="bg-gray-100 text-gray-700 border border-gray-200">
            Version: 2024.1.6
          </Badge>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiData.map((kpi, index) => {
          const Icon = kpi.icon;
          const isPositive = kpi.trend === 'up';
          
          const iconBgClasses = {
            blue: 'bg-blue-500',
            green: 'bg-green-500',
            purple: 'bg-purple-500',
            teal: 'bg-teal-500',
            orange: 'bg-orange-500'
          };

          const borderClasses = {
            blue: 'border-blue-100',
            green: 'border-green-100',
            purple: 'border-purple-100',
            teal: 'border-teal-100',
            orange: 'border-orange-100'
          };

          return (
            <Card key={index} className={borderClasses[kpi.color as keyof typeof borderClasses]}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-gray-600">{kpi.title}</p>
                    <p className="text-3xl font-bold text-gray-900 my-1">{kpi.unit}{kpi.value}</p>
                    {kpi.change && (
                      <div className={`text-sm flex items-center font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                        {isPositive ? <ArrowUpRight className="h-3 w-3 mr-1" /> : <ArrowDownRight className="h-3 w-3 mr-1" />}
                        {kpi.change}
                      </div>
                    )}
                    <p className="text-xs text-gray-500 mt-1">{kpi.period}</p>
                  </div>
                  <div className={`h-12 w-12 rounded-full flex items-center justify-center flex-shrink-0 ${iconBgClasses[kpi.color as keyof typeof iconBgClasses]}`}>
                    <Icon className="h-6 w-6 text-white" />
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
        <Card>
          <CardHeader className="border-b">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold">LE Achievement</CardTitle>
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

        {/* Ask AI Section */}
        <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-purple-50 hover:shadow-2xl transition-all duration-300">
          <CardHeader className="bg-gradient-to-r from-purple-50 to-indigo-50 border-b">
            <CardTitle className="text-base font-bold text-gray-900 flex items-center">
              <span className="text-xl mr-2">✨</span>
              Ask AI
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              {/* Total Revenue Card */}
              <div className="bg-gradient-to-br from-purple-50 to-indigo-100 rounded-xl p-6 text-center">
                <div className="text-sm font-semibold text-purple-600 mb-2">Total Revenue</div>
                <div className="text-4xl font-bold text-gray-900 mb-3">฿3,000,000</div>
                <div className="w-16 h-16 mx-auto bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg">
                  <DollarSign className="w-8 h-8 text-white" />
                </div>
              </div>

              {/* Monthly Breakdown */}
              <div className="grid grid-cols-3 gap-2">
                <div className="bg-white border border-purple-200 rounded-lg p-3 text-center hover:border-purple-300 transition-colors">
                  <div className="text-xs font-medium text-gray-500 mb-1">Jan, 2025</div>
                  <div className="text-lg font-bold text-gray-900">฿1,000,000</div>
                </div>
                <div className="bg-white border border-purple-200 rounded-lg p-3 text-center hover:border-purple-300 transition-colors">
                  <div className="text-xs font-medium text-gray-500 mb-1">Feb, 2025</div>
                  <div className="text-lg font-bold text-gray-900">฿1,000,000</div>
                </div>
                <div className="bg-white border border-purple-200 rounded-lg p-3 text-center hover:border-purple-300 transition-colors">
                  <div className="text-xs font-medium text-gray-500 mb-1">Mar, 2025</div>
                  <div className="text-lg font-bold text-gray-900">฿1,000,000</div>
                </div>
              </div>

              {/* Ask AI Input */}
              <form onSubmit={handleAiInsightSubmit} className="relative">
                <input
                  type="text"
                  value={aiInsightQuery}
                  onChange={(e) => setAiInsightQuery(e.target.value)}
                  placeholder="Ask AI..."
                  className="w-full px-4 py-3 pr-12 bg-white border border-purple-200 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-sm hover:border-purple-300 transition-colors"
                />
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex space-x-1">
                  <button type="button" className="p-1.5 hover:bg-purple-50 rounded transition-colors" title="Attach">
                    <span className="text-gray-400 text-sm font-bold">+</span>
                  </button>
                  <button type="button" className="p-1.5 hover:bg-purple-50 rounded transition-colors" title="Image">
                    <span className="text-gray-400 text-sm">🖼</span>
                  </button>
                  <button type="button" className="p-1.5 hover:bg-purple-50 rounded transition-colors" title="Voice">
                    <span className="text-gray-400 text-sm">🎤</span>
                  </button>
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
