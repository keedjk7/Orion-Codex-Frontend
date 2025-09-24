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
  { month: 'Jan', Engineering: 45000, Marketing: 32000, Operations: 28000, Sales: 15000 },
  { month: 'Feb', Engineering: 52000, Marketing: 28000, Operations: 35000, Sales: 22000 },
  { month: 'Mar', Engineering: 48000, Marketing: 42000, Operations: 31000, Sales: 28000 },
  { month: 'Apr', Engineering: 61000, Marketing: 35000, Operations: 38000, Sales: 35000 },
  { month: 'May', Engineering: 55000, Marketing: 48000, Operations: 42000, Sales: 45000 },
  { month: 'Jun', Engineering: 58000, Marketing: 52000, Operations: 45000, Sales: 38000 },
  { month: 'Jul', Engineering: 62000, Marketing: 45000, Operations: 48000, Sales: 42000 },
  { month: 'Aug', Engineering: 59000, Marketing: 58000, Operations: 52000, Sales: 48000 },
  { month: 'Sep', Engineering: 65000, Marketing: 55000, Operations: 55000, Sales: 52000 },
  { month: 'Oct', Engineering: 68000, Marketing: 62000, Operations: 58000, Sales: 55000 },
  { month: 'Nov', Engineering: 72000, Marketing: 65000, Operations: 62000, Sales: 58000 },
  { month: 'Dec', Engineering: 75000, Marketing: 68000, Operations: 65000, Sales: 62000 },
];

const departmentData = [
  { name: 'Sales', value: 35, color: '#06d6a0' },
  { name: 'Marketing', value: 25, color: '#8b5cf6' },
  { name: 'Operations', value: 20, color: '#ec4899' },
  { name: 'R&D', value: 15, color: '#3b82f6' },
  { name: 'Other', value: 5, color: '#f59e0b' },
];

const kpiData = [
  {
    title: 'Total Revenue',
    value: '100,000',
    change: '+12.5%',
    trend: 'up',
    icon: DollarSign,
    description: 'First time visitors (YTD)',
    color: 'blue'
  },
  {
    title: 'All Reports',
    value: '127',
    change: '+2.1%',
    trend: 'up',
    icon: BarChart3,
    description: 'All reports created (YTD)',
    color: 'purple'
  },
  {
    title: 'Sessions',
    value: '20',
    change: '+3',
    trend: 'up',
    icon: Target,
    description: 'Sessions created (YTD)',
    color: 'green'
  },
  {
    title: 'Bounce Rate',
    value: '50',
    change: '+12',
    trend: 'up',
    icon: TrendingUp,
    description: 'Bounce rate (YTD)',
    color: 'orange'
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
        {/* Revenue Trends Chart */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Revenue Trends</CardTitle>
                <CardDescription>Monthly revenue performance</CardDescription>
              </div>
              <div className="flex space-x-2">
                <select className="text-sm border border-gray-200 rounded px-2 py-1">
                  <option>Category</option>
                </select>
                <select className="text-sm border border-gray-200 rounded px-2 py-1">
                  <option>Today</option>
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
                  dataKey="Engineering" 
                  stroke="#3b82f6" 
                  strokeWidth={3}
                  dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2 }}
                  name="Engineering"
                />
                <Line 
                  type="monotone" 
                  dataKey="Marketing" 
                  stroke="#8b5cf6" 
                  strokeWidth={3}
                  dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: '#8b5cf6', strokeWidth: 2 }}
                  name="Marketing"
                />
                <Line 
                  type="monotone" 
                  dataKey="Operations" 
                  stroke="#ec4899" 
                  strokeWidth={3}
                  dot={{ fill: '#ec4899', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: '#ec4899', strokeWidth: 2 }}
                  name="Operations"
                />
                <Line 
                  type="monotone" 
                  dataKey="Sales" 
                  stroke="#06d6a0" 
                  strokeWidth={3}
                  dot={{ fill: '#06d6a0', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: '#06d6a0', strokeWidth: 2 }}
                  name="Sales"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Department Overview */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Department Overview</CardTitle>
                <CardDescription>Performance by department</CardDescription>
              </div>
              <div className="flex space-x-2">
                <select className="text-sm border border-gray-200 rounded px-2 py-1">
                  <option>All</option>
                </select>
                <select className="text-sm border border-gray-200 rounded px-2 py-1">
                  <option>Today</option>
                </select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="max-h-80 overflow-y-auto pr-2">
              <div className="grid grid-cols-2 gap-4">
                {/* Sales */}
                <div className="p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Sales</span>
                    <span className="px-2 py-1 bg-green-500 text-white text-xs rounded">Active</span>
                  </div>
                  <p className="text-xs text-gray-500 mb-3">
                    Q4 sales performance exceeded expectations with 125% target achievement. Key accounts showing strong growth in enterprise segment. Pipeline value increased by 40% compared to last quarter.
                  </p>
                  <div className="text-xs text-gray-400 mb-2">Updated 2 hours ago</div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-green-600 font-medium">Revenue: $2.4M</span>
                    <span className="text-blue-600 font-medium">Growth: +25%</span>
                  </div>
                </div>

                {/* Marketing */}
                <div className="p-4 bg-red-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Marketing</span>
                    <span className="px-2 py-1 bg-red-500 text-white text-xs rounded">Overdue</span>
                  </div>
                  <p className="text-xs text-gray-500 mb-3">
                    Digital marketing campaigns need immediate attention. Budget allocation review pending for Q1 2024. Social media engagement down 15% this month requiring strategy adjustment.
                  </p>
                  <div className="text-xs text-gray-400 mb-2">Updated 4 hours ago</div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-red-600 font-medium">Budget: $850K</span>
                    <span className="text-orange-600 font-medium">ROI: -8%</span>
                  </div>
                </div>

                {/* Operations */}
                <div className="p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Operations</span>
                    <span className="px-2 py-1 bg-green-500 text-white text-xs rounded">Active</span>
                  </div>
                  <p className="text-xs text-gray-500 mb-3">
                    Supply chain optimization project completed successfully. New warehouse management system deployed. Operational efficiency improved by 18% with reduced processing time.
                  </p>
                  <div className="text-xs text-gray-400 mb-2">Updated 1 hour ago</div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-green-600 font-medium">Cost: $1.2M</span>
                    <span className="text-blue-600 font-medium">Efficiency: +18%</span>
                  </div>
                </div>

                {/* Customer Success */}
                <div className="p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Customer Success</span>
                    <span className="px-2 py-1 bg-green-500 text-white text-xs rounded">Active</span>
                  </div>
                  <p className="text-xs text-gray-500 mb-3">
                    Customer satisfaction scores reached all-time high of 94%. Churn rate decreased to 2.1%. New onboarding process reduced time-to-value by 35% for enterprise clients.
                  </p>
                  <div className="text-xs text-gray-400 mb-2">Updated 3 hours ago</div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-green-600 font-medium">CSAT: 94%</span>
                    <span className="text-blue-600 font-medium">Churn: 2.1%</span>
                  </div>
                </div>

                {/* Finance */}
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Finance</span>
                    <span className="px-2 py-1 bg-blue-500 text-white text-xs rounded">Review</span>
                  </div>
                  <p className="text-xs text-gray-500 mb-3">
                    Monthly financial close completed ahead of schedule. Cash flow positive for 6 consecutive months. Investment portfolio showing 12% YTD returns above benchmark.
                  </p>
                  <div className="text-xs text-gray-400 mb-2">Updated 5 hours ago</div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-green-600 font-medium">Cash: $5.2M</span>
                    <span className="text-blue-600 font-medium">ROI: +12%</span>
                  </div>
                </div>

                {/* HR */}
                <div className="p-4 bg-purple-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Human Resources</span>
                    <span className="px-2 py-1 bg-purple-500 text-white text-xs rounded">Planning</span>
                  </div>
                  <p className="text-xs text-gray-500 mb-3">
                    Q1 2024 hiring plan approved for 25 new positions. Employee engagement survey results show 87% satisfaction. New benefits package implementation scheduled for January.
                  </p>
                  <div className="text-xs text-gray-400 mb-2">Updated 6 hours ago</div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-purple-600 font-medium">Headcount: 245</span>
                    <span className="text-green-600 font-medium">Satisfaction: 87%</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        {/* Active Projects */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Active Projects</CardTitle>
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
                {/* Q4 Product Launch */}
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-gray-900">Q4 Product Launch</h4>
                    <span className="px-2 py-1 bg-green-500 text-white text-xs rounded">Active</span>
                  </div>
                  <p className="text-xs text-gray-600 mb-3">
                    Major product release featuring AI-powered analytics dashboard, enhanced user interface, and advanced reporting capabilities. Currently in final testing phase.
                  </p>
                  <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-3">
                    <div>
                      <span className="text-blue-600 font-medium">Progress</span>
                      <div className="text-gray-900 font-semibold">75%</div>
                    </div>
                    <div>
                      <span className="text-green-600 font-medium">Timeline</span>
                      <div className="text-gray-900 font-semibold">2 weeks</div>
                    </div>
                    <div>
                      <span className="text-purple-600 font-medium">Budget</span>
                      <div className="text-gray-900 font-semibold">$280K</div>
                    </div>
                    <div>
                      <span className="text-orange-600 font-medium">Status</span>
                      <div className="text-gray-900 font-semibold">Planning</div>
                    </div>
                  </div>
                  <div className="text-xs text-gray-400">Last updated: 2 hours ago</div>
                </div>

                {/* Mobile App Redesign */}
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-gray-900">Mobile App Redesign</h4>
                    <span className="px-2 py-1 bg-blue-500 text-white text-xs rounded">In Progress</span>
                  </div>
                  <p className="text-xs text-gray-600 mb-3">
                    Complete overhaul of mobile application with new UX/UI design, improved performance, and offline capabilities. User testing phase completed with positive feedback.
                  </p>
                  <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-3">
                    <div>
                      <span className="text-blue-600 font-medium">Progress</span>
                      <div className="text-gray-900 font-semibold">60%</div>
                    </div>
                    <div>
                      <span className="text-green-600 font-medium">Timeline</span>
                      <div className="text-gray-900 font-semibold">4 weeks</div>
                    </div>
                    <div>
                      <span className="text-purple-600 font-medium">Budget</span>
                      <div className="text-gray-900 font-semibold">$150K</div>
                    </div>
                    <div>
                      <span className="text-orange-600 font-medium">Status</span>
                      <div className="text-gray-900 font-semibold">Development</div>
                    </div>
                  </div>
                  <div className="text-xs text-gray-400">Last updated: 4 hours ago</div>
                </div>

                {/* Cloud Migration */}
                <div className="p-4 bg-yellow-50 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-gray-900">Cloud Migration Project</h4>
                    <span className="px-2 py-1 bg-yellow-500 text-white text-xs rounded">On Hold</span>
                  </div>
                  <p className="text-xs text-gray-600 mb-3">
                    Migration of legacy systems to cloud infrastructure. Waiting for security compliance approval and budget allocation for Q1 2024. Infrastructure planning completed.
                  </p>
                  <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-3">
                    <div>
                      <span className="text-blue-600 font-medium">Progress</span>
                      <div className="text-gray-900 font-semibold">25%</div>
                    </div>
                    <div>
                      <span className="text-green-600 font-medium">Timeline</span>
                      <div className="text-gray-900 font-semibold">8 weeks</div>
                    </div>
                    <div>
                      <span className="text-purple-600 font-medium">Budget</span>
                      <div className="text-gray-900 font-semibold">$450K</div>
                    </div>
                    <div>
                      <span className="text-orange-600 font-medium">Status</span>
                      <div className="text-gray-900 font-semibold">Approval</div>
                    </div>
                  </div>
                  <div className="text-xs text-gray-400">Last updated: 1 day ago</div>
                </div>

                {/* API Integration */}
                <div className="p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-gray-900">Third-party API Integration</h4>
                    <span className="px-2 py-1 bg-green-500 text-white text-xs rounded">Active</span>
                  </div>
                  <p className="text-xs text-gray-600 mb-3">
                    Integration with external payment gateways, CRM systems, and analytics platforms. Phase 1 completed successfully, moving to Phase 2 implementation.
                  </p>
                  <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-3">
                    <div>
                      <span className="text-blue-600 font-medium">Progress</span>
                      <div className="text-gray-900 font-semibold">85%</div>
                    </div>
                    <div>
                      <span className="text-green-600 font-medium">Timeline</span>
                      <div className="text-gray-900 font-semibold">1 week</div>
                    </div>
                    <div>
                      <span className="text-purple-600 font-medium">Budget</span>
                      <div className="text-gray-900 font-semibold">$95K</div>
                    </div>
                    <div>
                      <span className="text-orange-600 font-medium">Status</span>
                      <div className="text-gray-900 font-semibold">Testing</div>
                    </div>
                  </div>
                  <div className="text-xs text-gray-400">Last updated: 30 minutes ago</div>
                </div>

                {/* Security Audit */}
                <div className="p-4 bg-red-50 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-gray-900">Security Audit & Compliance</h4>
                    <span className="px-2 py-1 bg-red-500 text-white text-xs rounded">Critical</span>
                  </div>
                  <p className="text-xs text-gray-600 mb-3">
                    Comprehensive security audit and compliance review for SOC 2 certification. External auditors identified 3 critical issues requiring immediate attention.
                  </p>
                  <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-3">
                    <div>
                      <span className="text-blue-600 font-medium">Progress</span>
                      <div className="text-gray-900 font-semibold">40%</div>
                    </div>
                    <div>
                      <span className="text-green-600 font-medium">Timeline</span>
                      <div className="text-gray-900 font-semibold">3 weeks</div>
                    </div>
                    <div>
                      <span className="text-purple-600 font-medium">Budget</span>
                      <div className="text-gray-900 font-semibold">$75K</div>
                    </div>
                    <div>
                      <span className="text-orange-600 font-medium">Status</span>
                      <div className="text-gray-900 font-semibold">Remediation</div>
                    </div>
                  </div>
                  <div className="text-xs text-gray-400">Last updated: 6 hours ago</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Budget Distribution by Department */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Budget Distribution by Department</CardTitle>
              <div className="flex space-x-2">
                <select className="text-sm border border-gray-200 rounded px-2 py-1">
                  <option>All</option>
                </select>
                <select className="text-sm border border-gray-200 rounded px-2 py-1">
                  <option>Today</option>
                </select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={departmentData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {departmentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              
              {/* Legend */}
              <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                {departmentData.map((item, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <span className="text-gray-600">{item.name}</span>
                    <span className="text-gray-900 font-medium ml-auto">$3.0M</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
