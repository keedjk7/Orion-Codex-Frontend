import React from 'react';
import { useKeycloak } from '@/contexts/KeycloakContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  TrendingUp, 
  DollarSign, 
  Target, 
  BarChart3, 
  Search
} from 'lucide-react';
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

// Sample data for charts
const revenueData = [
  { month: 'Jan', Revenue: 450000, Expenses: 320000, Profit: 130000 },
  { month: 'Feb', Revenue: 520000, Expenses: 380000, Profit: 140000 },
  { month: 'Mar', Revenue: 480000, Expenses: 350000, Profit: 130000 },
  { month: 'Apr', Revenue: 610000, Expenses: 420000, Profit: 190000 },
  { month: 'May', Revenue: 550000, Expenses: 400000, Profit: 150000 },
  { month: 'Jun', Revenue: 580000, Expenses: 430000, Profit: 150000 },
  { month: 'Jul', Revenue: 620000, Expenses: 450000, Profit: 170000 },
  { month: 'Aug', Revenue: 590000, Expenses: 420000, Profit: 170000 },
  { month: 'Sep', Revenue: 650000, Expenses: 480000, Profit: 170000 },
  { month: 'Oct', Revenue: 680000, Expenses: 500000, Profit: 180000 },
  { month: 'Nov', Revenue: 720000, Expenses: 520000, Profit: 200000 },
  { month: 'Dec', Revenue: 750000, Expenses: 540000, Profit: 210000 },
];

const expenseCategoryData = [
  { name: 'Cost of Goods Sold', value: 35, color: '#06d6a0' },
  { name: 'Operating Expenses', value: 25, color: '#8b5cf6' },
  { name: 'Marketing & Sales', value: 20, color: '#ec4899' },
  { name: 'Research & Development', value: 15, color: '#3b82f6' },
  { name: 'Administrative', value: 5, color: '#f59e0b' },
];

const kpiData = [
  {
    title: 'Total Revenue',
    value: '3,000,000',
    change: '+15.2%',
    trend: 'up',
    icon: DollarSign,
    description: 'Total revenue for Q1, 2025',
    color: 'blue'
  },
  {
    title: 'Total Expenses',
    value: '2,100,000',
    change: '+8.7%',
    trend: 'up',
    icon: TrendingUp,
    description: 'Total expenses for Q1, 2025',
    color: 'red'
  },
  {
    title: 'Net Profit',
    value: '900,000',
    change: '+28.5%',
    trend: 'up',
    icon: Target,
    description: 'Net profit margin: 30%',
    color: 'green'
  },
  {
    title: 'Cash Flow',
    value: '750,000',
    change: '+22.1%',
    trend: 'up',
    icon: BarChart3,
    description: 'Operating cash flow Q1, 2025',
    color: 'purple'
  }
];


export default function DashboardOverview() {
  const { user } = useKeycloak();
  
  const getUserDisplayName = () => {
    if (user?.name) return user.name;
    if (user?.preferred_username) return user.preferred_username;
    if (user?.given_name && user?.family_name) return `${user.given_name} ${user.family_name}`;
    if (user?.email) return user.email.split('@')[0];
    return 'User';
  };

  return (
    <div className="space-y-6">
      {/* Hero Section with Greeting */}
      <div className="relative bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 rounded-2xl p-8 text-white overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-transparent"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24"></div>
        
        <div className="relative z-10">
          {/* Greeting */}
          <div className="text-center mb-8">
            <h1 className="text-3xl lg:text-4xl font-bold mb-2">
              Hello, {getUserDisplayName()}
            </h1>
            <p className="text-blue-100 text-lg">
              Welcome back to your dashboard
            </p>
          </div>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Ask AI..."
                className="w-full pl-12 pr-16 py-4 bg-white rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/50 shadow-lg"
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex space-x-2">
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <span className="text-gray-400">⌘</span>
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <span className="text-gray-400">↵</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {kpiData.map((kpi, index) => {
          const Icon = kpi.icon;
          const colorClasses = {
            blue: 'text-blue-600',
            purple: 'text-purple-600', 
            green: 'text-green-600',
            orange: 'text-orange-600'
          };
          
          return (
            <Card key={index} className="hover:shadow-lg transition-shadow bg-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-sm font-medium text-gray-600">
                    {kpi.title}
                  </div>
                  <Icon className={`h-5 w-5 ${colorClasses[kpi.color as keyof typeof colorClasses]}`} />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-baseline space-x-2">
                    <div className="text-2xl font-bold text-gray-900">
                      {kpi.value}
                    </div>
                    <div className="text-sm text-gray-500">$</div>
                  </div>
                  
                  <div className="text-xs text-gray-500">
                    {kpi.description}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 lg:gap-6">
        {/* P&L Trends Chart */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Profit & Loss Trends</CardTitle>
                <CardDescription>Monthly P&L performance for 2025</CardDescription>
              </div>
              <div className="flex space-x-2">
                <select className="text-sm border border-gray-200 rounded px-2 py-1">
                  <option>Annual</option>
                </select>
                <select className="text-sm border border-gray-200 rounded px-2 py-1">
                  <option>Q1 2025</option>
                </select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={revenueData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
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
                <Legend
                  wrapperStyle={{ paddingTop: '20px' }}
                  iconType="circle"
                />
                <Line
                  type="monotone"
                  dataKey="Revenue"
                  stroke="#10b981"
                  strokeWidth={3}
                  dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: '#10b981', strokeWidth: 2 }}
                  name="Revenue"
                />
                <Line
                  type="monotone"
                  dataKey="Expenses"
                  stroke="#ef4444"
                  strokeWidth={3}
                  dot={{ fill: '#ef4444', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: '#ef4444', strokeWidth: 2 }}
                  name="Expenses"
                />
                <Line
                  type="monotone"
                  dataKey="Profit"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2 }}
                  name="Net Profit"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Expense Categories */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Expense Categories</CardTitle>
                <CardDescription>Breakdown by expense category</CardDescription>
              </div>
              <div className="flex space-x-2">
                <select className="text-sm border border-gray-200 rounded px-2 py-1">
                  <option>Q1 2025</option>
                </select>
                <select className="text-sm border border-gray-200 rounded px-2 py-1">
                  <option>Budget vs Actual</option>
                </select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="max-h-80 overflow-y-auto pr-2">
              <div className="grid grid-cols-1 gap-4">
                {/* Cost of Goods Sold */}
                <div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Cost of Goods Sold</span>
                    <span className="px-2 py-1 bg-green-500 text-white text-xs rounded">On Track</span>
                  </div>
                  <p className="text-xs text-gray-500 mb-3">
                    COGS tracking well against budget. Raw material costs stable with 2% decrease from Q4. Manufacturing efficiency improved by 5% through process optimization.
                  </p>
                  <div className="text-xs text-gray-400 mb-2">Updated 1 hour ago</div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-green-600 font-medium">Budget: $1.05M</span>
                    <span className="text-blue-600 font-medium">Actual: $1.02M</span>
                    <span className="text-green-600 font-medium">Variance: +2.8%</span>
                  </div>
                </div>

                {/* Operating Expenses */}
                <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Operating Expenses</span>
                    <span className="px-2 py-1 bg-blue-500 text-white text-xs rounded">Under Budget</span>
                  </div>
                  <p className="text-xs text-gray-500 mb-3">
                    Operating expenses 8% below budget due to successful cost control measures. Office utilities reduced by 15% through energy efficiency initiatives.
                  </p>
                  <div className="text-xs text-gray-400 mb-2">Updated 2 hours ago</div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-blue-600 font-medium">Budget: $525K</span>
                    <span className="text-green-600 font-medium">Actual: $483K</span>
                    <span className="text-green-600 font-medium">Variance: +8.0%</span>
                  </div>
                </div>

                {/* Marketing & Sales */}
                <div className="p-4 bg-orange-50 rounded-lg border-l-4 border-orange-500">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Marketing & Sales</span>
                    <span className="px-2 py-1 bg-orange-500 text-white text-xs rounded">Overspend</span>
                  </div>
                  <p className="text-xs text-gray-500 mb-3">
                    Marketing spend exceeded budget by 12% due to Q1 campaign launches. Sales team expanded headcount driving higher commission expenses.
                  </p>
                  <div className="text-xs text-gray-400 mb-2">Updated 3 hours ago</div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-orange-600 font-medium">Budget: $420K</span>
                    <span className="text-red-600 font-medium">Actual: $470K</span>
                    <span className="text-red-600 font-medium">Variance: -12%</span>
                  </div>
                </div>

                {/* Research & Development */}
                <div className="p-4 bg-purple-50 rounded-lg border-l-4 border-purple-500">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Research & Development</span>
                    <span className="px-2 py-1 bg-purple-500 text-white text-xs rounded">On Track</span>
                  </div>
                  <p className="text-xs text-gray-500 mb-3">
                    R&D investment aligned with strategic plan. Two new product prototypes completed. Patent applications filed for 3 innovations this quarter.
                  </p>
                  <div className="text-xs text-gray-400 mb-2">Updated 4 hours ago</div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-purple-600 font-medium">Budget: $315K</span>
                    <span className="text-blue-600 font-medium">Actual: $308K</span>
                    <span className="text-green-600 font-medium">Variance: +2.2%</span>
                  </div>
                </div>

                {/* Administrative */}
                <div className="p-4 bg-gray-50 rounded-lg border-l-4 border-gray-500">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Administrative</span>
                    <span className="px-2 py-1 bg-gray-500 text-white text-xs rounded">Under Budget</span>
                  </div>
                  <p className="text-xs text-gray-500 mb-3">
                    Administrative costs well managed. Professional services fees reduced by 20% through vendor negotiations. Insurance premiums stable for the quarter.
                  </p>
                  <div className="text-xs text-gray-400 mb-2">Updated 5 hours ago</div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-600 font-medium">Budget: $105K</span>
                    <span className="text-green-600 font-medium">Actual: $89K</span>
                    <span className="text-green-600 font-medium">Variance: +15.2%</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        {/* Financial Initiatives */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Financial Initiatives</CardTitle>
              <button className="text-gray-400 hover:text-gray-600">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                </svg>
              </button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="max-h-80 overflow-y-auto pr-2">
              <div className="space-y-4">
                {/* Cost Optimization Program */}
                <div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-gray-900">Cost Optimization Program</h4>
                    <span className="px-2 py-1 bg-green-500 text-white text-xs rounded">On Track</span>
                  </div>
                  <p className="text-xs text-gray-600 mb-3">
                    Comprehensive cost reduction initiative targeting 15% savings across all departments. Supply chain optimization and vendor consolidation showing early success.
                  </p>
                  <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-3">
                    <div>
                      <span className="text-blue-600 font-medium">Progress</span>
                      <div className="text-gray-900 font-semibold">65%</div>
                    </div>
                    <div>
                      <span className="text-green-600 font-medium">Savings</span>
                      <div className="text-gray-900 font-semibold">$180K</div>
                    </div>
                    <div>
                      <span className="text-purple-600 font-medium">Budget</span>
                      <div className="text-gray-900 font-semibold">$50K</div>
                    </div>
                    <div>
                      <span className="text-orange-600 font-medium">Timeline</span>
                      <div className="text-gray-900 font-semibold">Q2 2025</div>
                    </div>
                  </div>
                  <div className="text-xs text-gray-400">Last updated: 1 hour ago</div>
                </div>

                {/* Working Capital Improvement */}
                <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-gray-900">Working Capital Optimization</h4>
                    <span className="px-2 py-1 bg-blue-500 text-white text-xs rounded">In Progress</span>
                  </div>
                  <p className="text-xs text-gray-600 mb-3">
                    Initiative to improve cash flow through better inventory management, accounts receivable optimization, and strategic payment terms negotiation.
                  </p>
                  <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-3">
                    <div>
                      <span className="text-blue-600 font-medium">Progress</span>
                      <div className="text-gray-900 font-semibold">40%</div>
                    </div>
                    <div>
                      <span className="text-green-600 font-medium">Improvement</span>
                      <div className="text-gray-900 font-semibold">$250K</div>
                    </div>
                    <div>
                      <span className="text-purple-600 font-medium">Budget</span>
                      <div className="text-gray-900 font-semibold">$30K</div>
                    </div>
                    <div>
                      <span className="text-orange-600 font-medium">Timeline</span>
                      <div className="text-gray-900 font-semibold">Q1 2025</div>
                    </div>
                  </div>
                  <div className="text-xs text-gray-400">Last updated: 2 hours ago</div>
                </div>

                {/* ERP System Implementation */}
                <div className="p-4 bg-purple-50 rounded-lg border-l-4 border-purple-500">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-gray-900">ERP System Upgrade</h4>
                    <span className="px-2 py-1 bg-purple-500 text-white text-xs rounded">Planning</span>
                  </div>
                  <p className="text-xs text-gray-600 mb-3">
                    Upgrade to modern ERP system for improved financial reporting, automation, and real-time analytics. Phase 1 requirements gathering completed.
                  </p>
                  <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-3">
                    <div>
                      <span className="text-blue-600 font-medium">Progress</span>
                      <div className="text-gray-900 font-semibold">25%</div>
                    </div>
                    <div>
                      <span className="text-green-600 font-medium">Investment</span>
                      <div className="text-gray-900 font-semibold">$500K</div>
                    </div>
                    <div>
                      <span className="text-purple-600 font-medium">Budget</span>
                      <div className="text-gray-900 font-semibold">$600K</div>
                    </div>
                    <div>
                      <span className="text-orange-600 font-medium">Timeline</span>
                      <div className="text-gray-900 font-semibold">12 months</div>
                    </div>
                  </div>
                  <div className="text-xs text-gray-400">Last updated: 4 hours ago</div>
                </div>

                {/* Tax Planning & Compliance */}
                <div className="p-4 bg-orange-50 rounded-lg border-l-4 border-orange-500">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-gray-900">Tax Strategy Optimization</h4>
                    <span className="px-2 py-1 bg-orange-500 text-white text-xs rounded">Review</span>
                  </div>
                  <p className="text-xs text-gray-600 mb-3">
                    Comprehensive tax planning initiative focusing on R&D credits, international tax optimization, and transfer pricing strategies for 2025.
                  </p>
                  <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-3">
                    <div>
                      <span className="text-blue-600 font-medium">Progress</span>
                      <div className="text-gray-900 font-semibold">80%</div>
                    </div>
                    <div>
                      <span className="text-green-600 font-medium">Savings</span>
                      <div className="text-gray-900 font-semibold">$120K</div>
                    </div>
                    <div>
                      <span className="text-purple-600 font-medium">Budget</span>
                      <div className="text-gray-900 font-semibold">$25K</div>
                    </div>
                    <div>
                      <span className="text-orange-600 font-medium">Timeline</span>
                      <div className="text-gray-900 font-semibold">Q2 2025</div>
                    </div>
                  </div>
                  <div className="text-xs text-gray-400">Last updated: 6 hours ago</div>
                </div>

                {/* Financial Risk Assessment */}
                <div className="p-4 bg-red-50 rounded-lg border-l-4 border-red-500">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-gray-900">Risk Management Framework</h4>
                    <span className="px-2 py-1 bg-red-500 text-white text-xs rounded">Critical</span>
                  </div>
                  <p className="text-xs text-gray-600 mb-3">
                    Enterprise risk management system implementation including financial risk modeling, stress testing, and compliance monitoring frameworks.
                  </p>
                  <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-3">
                    <div>
                      <span className="text-blue-600 font-medium">Progress</span>
                      <div className="text-gray-900 font-semibold">55%</div>
                    </div>
                    <div>
                      <span className="text-green-600 font-medium">Investment</span>
                      <div className="text-gray-900 font-semibold">$200K</div>
                    </div>
                    <div>
                      <span className="text-purple-600 font-medium">Budget</span>
                      <div className="text-gray-900 font-semibold">$180K</div>
                    </div>
                    <div>
                      <span className="text-orange-600 font-medium">Timeline</span>
                      <div className="text-gray-900 font-semibold">Q3 2025</div>
                    </div>
                  </div>
                  <div className="text-xs text-gray-400">Last updated: 8 hours ago</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Budget vs Actual by Category */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Budget vs Actual by Category</CardTitle>
              <div className="flex space-x-2">
                <select className="text-sm border border-gray-200 rounded px-2 py-1">
                  <option>Q1 2025</option>
                </select>
                <select className="text-sm border border-gray-200 rounded px-2 py-1">
                  <option>Percentage</option>
                </select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={expenseCategoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {expenseCategoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>

              {/* Legend */}
              <div className="mt-4 grid grid-cols-1 gap-2 text-sm">
                {expenseCategoryData.map((item, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <span className="text-gray-600">{item.name}</span>
                    <span className="text-gray-900 font-medium ml-auto">
                      ${item.name === 'Cost of Goods Sold' ? '1.05M' :
                        item.name === 'Operating Expenses' ? '525K' :
                        item.name === 'Marketing & Sales' ? '420K' :
                        item.name === 'Research & Development' ? '315K' : '105K'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Financial Tables Section */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 lg:gap-6">
        {/* Revenue Breakdown Table */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue Breakdown by Product Line</CardTitle>
            <CardDescription>Detailed revenue analysis for Q1 2025</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 font-medium text-gray-900">Product Line</th>
                    <th className="text-right py-2 font-medium text-gray-900">Jan</th>
                    <th className="text-right py-2 font-medium text-gray-900">Feb</th>
                    <th className="text-right py-2 font-medium text-gray-900">Mar</th>
                    <th className="text-right py-2 font-medium text-gray-900">Q1 Total</th>
                    <th className="text-right py-2 font-medium text-gray-900">Growth</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="py-2 text-gray-900">Enterprise Software</td>
                    <td className="py-2 text-right text-gray-600">$180K</td>
                    <td className="py-2 text-right text-gray-600">$210K</td>
                    <td className="py-2 text-right text-gray-600">$195K</td>
                    <td className="py-2 text-right text-gray-900 font-medium">$585K</td>
                    <td className="py-2 text-right text-green-600">+8.3%</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 text-gray-900">SaaS Subscriptions</td>
                    <td className="py-2 text-right text-gray-600">$120K</td>
                    <td className="py-2 text-right text-gray-600">$135K</td>
                    <td className="py-2 text-right text-gray-600">$150K</td>
                    <td className="py-2 text-right text-gray-900 font-medium">$405K</td>
                    <td className="py-2 text-right text-green-600">+25.0%</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 text-gray-900">Professional Services</td>
                    <td className="py-2 text-right text-gray-600">$85K</td>
                    <td className="py-2 text-right text-gray-600">$95K</td>
                    <td className="py-2 text-right text-gray-600">$110K</td>
                    <td className="py-2 text-right text-gray-900 font-medium">$290K</td>
                    <td className="py-2 text-right text-green-600">+29.4%</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 text-gray-900">Support & Maintenance</td>
                    <td className="py-2 text-right text-gray-600">$65K</td>
                    <td className="py-2 text-right text-gray-600">$80K</td>
                    <td className="py-2 text-right text-gray-600">$75K</td>
                    <td className="py-2 text-right text-gray-900 font-medium">$220K</td>
                    <td className="py-2 text-right text-green-600">+15.4%</td>
                  </tr>
                  <tr className="border-b font-medium">
                    <td className="py-2 text-gray-900">Total Revenue</td>
                    <td className="py-2 text-right text-gray-900">$450K</td>
                    <td className="py-2 text-right text-gray-900">$520K</td>
                    <td className="py-2 text-right text-gray-900">$530K</td>
                    <td className="py-2 text-right text-gray-900">$1.5M</td>
                    <td className="py-2 text-right text-green-600">+17.6%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Cash Flow Summary Table */}
        <Card>
          <CardHeader>
            <CardTitle>Cash Flow Summary</CardTitle>
            <CardDescription>Operating cash flow analysis for Q1 2025</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 font-medium text-gray-900">Category</th>
                      <th className="text-right py-2 font-medium text-gray-900">Budget</th>
                      <th className="text-right py-2 font-medium text-gray-900">Actual</th>
                      <th className="text-right py-2 font-medium text-gray-900">Variance</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="py-2 text-gray-900">Cash from Operations</td>
                      <td className="py-2 text-right text-gray-600">$680K</td>
                      <td className="py-2 text-right text-green-600 font-medium">$750K</td>
                      <td className="py-2 text-right text-green-600">+$70K</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 text-gray-900">Cash from Investing</td>
                      <td className="py-2 text-right text-gray-600">-$150K</td>
                      <td className="py-2 text-right text-red-600 font-medium">-$180K</td>
                      <td className="py-2 text-right text-red-600">-$30K</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 text-gray-900">Cash from Financing</td>
                      <td className="py-2 text-right text-gray-600">-$50K</td>
                      <td className="py-2 text-right text-green-600 font-medium">-$25K</td>
                      <td className="py-2 text-right text-green-600">+$25K</td>
                    </tr>
                    <tr className="border-b font-medium bg-gray-50">
                      <td className="py-2 text-gray-900">Net Cash Flow</td>
                      <td className="py-2 text-right text-gray-900">$480K</td>
                      <td className="py-2 text-right text-green-600 font-bold">$545K</td>
                      <td className="py-2 text-right text-green-600">+$65K</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Cash Position Indicators */}
              <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                <div className="text-center">
                  <div className="text-lg font-bold text-gray-900">$2.3M</div>
                  <div className="text-xs text-gray-500">Opening Balance</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-green-600">$545K</div>
                  <div className="text-xs text-gray-500">Net Cash Flow</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-blue-600">$2.8M</div>
                  <div className="text-xs text-gray-500">Closing Balance</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Financial Ratios Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">30.0%</div>
              <div className="text-sm text-gray-500">Net Profit Margin</div>
              <div className="text-xs text-green-600 mt-1">+2.1% vs Q4</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">2.8x</div>
              <div className="text-sm text-gray-500">Current Ratio</div>
              <div className="text-xs text-green-600 mt-1">+0.2 vs Q4</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">45 days</div>
              <div className="text-sm text-gray-500">DSO</div>
              <div className="text-xs text-red-600 mt-1">+5 days vs Q4</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">1.2x</div>
              <div className="text-sm text-gray-500">Debt-to-Equity</div>
              <div className="text-xs text-green-600 mt-1">-0.1 vs Q4</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Forecasting Section */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 lg:gap-6">
        {/* Revenue Forecast */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue Forecast</CardTitle>
            <CardDescription>12-month revenue projection with confidence intervals</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="h-48 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">$4.2M</div>
                  <div className="text-sm text-gray-500">Projected Q4 Revenue</div>
                  <div className="text-xs text-green-600 mt-1">+18% vs Q3</div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">Conservative Scenario</span>
                  <span className="font-medium">$3.8M</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">Base Case</span>
                  <span className="font-medium text-blue-600">$4.2M</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">Optimistic Scenario</span>
                  <span className="font-medium">$4.8M</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Key Financial Metrics Forecast */}
        <Card>
          <CardHeader>
            <CardTitle>Financial Metrics Forecast</CardTitle>
            <CardDescription>Key performance indicators for next quarter</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-lg font-bold text-green-600">32.5%</div>
                  <div className="text-xs text-gray-500">Net Margin</div>
                  <div className="text-xs text-green-600">+1.5%</div>
                </div>
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-lg font-bold text-blue-600">2.9x</div>
                  <div className="text-xs text-gray-500">Current Ratio</div>
                  <div className="text-xs text-green-600">+0.1x</div>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <div className="text-lg font-bold text-purple-600">38 days</div>
                  <div className="text-xs text-gray-500">DSO</div>
                  <div className="text-xs text-red-600">+3 days</div>
                </div>
                <div className="text-center p-3 bg-orange-50 rounded-lg">
                  <div className="text-lg font-bold text-orange-600">1.1x</div>
                  <div className="text-xs text-gray-500">Debt-to-Equity</div>
                  <div className="text-xs text-green-600">-0.1x</div>
                </div>
              </div>

              <div className="text-xs text-gray-500 border-t pt-3">
                <div className="flex justify-between">
                  <span>Risk Level:</span>
                  <span className="text-green-600 font-medium">Low</span>
                </div>
                <div className="flex justify-between mt-1">
                  <span>Confidence:</span>
                  <span className="text-blue-600 font-medium">85%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
