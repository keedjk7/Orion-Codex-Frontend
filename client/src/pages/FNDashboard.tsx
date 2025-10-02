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
  Info,
  Percent
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

// Sample data for FN Dashboard based on Figma design
const kpiData = [
  {
    title: 'Revenue',
    value: '5,000,000',
    unit: '',
    change: '+1 (%)',
    trend: 'up',
    period: 'Latest data: 20/12/26 12:07',
    icon: DollarSign,
    color: 'blue'
  },
  {
    title: 'Gross Profit - 1 (%)',
    value: '92.8%',
    unit: '',
    change: '+1 (%)',
    trend: 'up', 
    period: 'Latest data: 20/12/26 12:07',
    icon: TrendingUp,
    color: 'green'
  },
  {
    title: 'Gross Profit - 2 (%)',
    value: '98.7%',
    unit: '',
    change: '+1 (%)',
    trend: 'up',
    period: 'Latest data: 20/12/26 12:07',
    icon: BarChart3,
    color: 'purple'
  },
  {
    title: 'EBIT (%)',
    value: '85%',
    unit: '',
    change: '+1 (%)',
    trend: 'up',
    period: 'Latest data: 20/12/26 12:07',
    icon: Target,
    color: 'teal'
  },
  {
    title: 'Net Profit Margin (%)',
    value: '20.5%',
    unit: '',
    change: '+1 (%)',
    trend: 'up',
    period: 'Latest data: 20/12/26 12:07',
    icon: Percent,
    color: 'orange'
  }
];

// LE Achievement data for FN Dashboard
const leAchievementData = [
  { name: 'Category 1', value: 50000000, color: '#3b82f6' },
  { name: 'Category 2', value: 25000000, color: '#f97316' },
  { name: 'Category 3', value: 15000000, color: '#10b981' },
  { name: 'Category 4', value: 7000000, color: '#8b5cf6' },
  { name: 'Category 5', value: 3000000, color: '#ef4444' }
];

const COLORS = ['#3b82f6', '#f97316', '#10b981', '#8b5cf6', '#ef4444'];

// YTD Actual by CE data for FN Dashboard - Multi-line chart
const ytdActualData = [
  { month: 'Jan', Technology: 42000, Marketing: 28000, Operations: 22000, Sales: 32000 },
  { month: 'Feb', Technology: 45000, Marketing: 30000, Operations: 25000, Sales: 35000 },
  { month: 'Mar', Technology: 48000, Marketing: 32000, Operations: 27000, Sales: 38000 },
  { month: 'Apr', Technology: 43000, Marketing: 26000, Operations: 29000, Sales: 36000 },
  { month: 'May', Technology: 47000, Marketing: 35000, Operations: 32000, Sales: 42000 },
  { month: 'Jun', Technology: 52000, Marketing: 39000, Operations: 35000, Sales: 45000 },
  { month: 'Jul', Technology: 55000, Marketing: 42000, Operations: 37000, Sales: 48000 },
  { month: 'Aug', Technology: 58000, Marketing: 45000, Operations: 39000, Sales: 52000 },
  { month: 'Sep', Technology: 56000, Marketing: 43000, Operations: 42000, Sales: 55000 },
  { month: 'Oct', Technology: 62000, Marketing: 47000, Operations: 45000, Sales: 57000 },
  { month: 'Nov', Technology: 65000, Marketing: 49000, Operations: 47000, Sales: 59000 },
  { month: 'Dec', Technology: 67000, Marketing: 52000, Operations: 49000, Sales: 62000 }
];

// Sales Target by Month data for FN Dashboard
const salesTargetData = [
  { month: 'Jan', target: 50000, actual: 45000 },
  { month: 'Feb', target: 55000, actual: 52000 },
  { month: 'Mar', target: 60000, actual: 58000 },
  { month: 'Apr', target: 65000, actual: 62000 },
  { month: 'May', target: 70000, actual: 68000 },
  { month: 'Jun', target: 75000, actual: 72000 },
  { month: 'Jul', target: 80000, actual: 78000 },
  { month: 'Aug', target: 85000, actual: 82000 }
];

// Total Revenue data for Q1 2025 - FN Dashboard
const totalRevenueData = [
  { period: 'Q1 2024', value: 3000000 },
  { period: 'Q2 2024', value: 3200000 },
  { period: 'Q3 2024', value: 3100000 },
  { period: 'Q4 2024', value: 3400000 },
  { period: 'Q1 2025', value: 3600000 }
];

export default function FNDashboard() {
  const { user } = useKeycloak();
  const [aiInsightQuery, setAiInsightQuery] = React.useState('');
  const [selectedQuarter, setSelectedQuarter] = React.useState('Q1 2025');
  const [selectedCategory, setSelectedCategory] = React.useState('All Categories');
  
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

  // Performance data by quarter
  const performanceDataByQuarter: {[key: string]: any[]} = {
    'Q1 2025': [
      { month: 'Jan 2025', Actual: 950000, LE: 980000, Budget: 1000000 },
      { month: 'Feb 2025', Actual: 1080000, LE: 1050000, Budget: 1000000 },
      { month: 'Mar 2025', Actual: 1120000, LE: 1100000, Budget: 1000000 }
    ],
    'Q4 2024': [
      { month: 'Oct 2024', Actual: 920000, LE: 950000, Budget: 1000000 },
      { month: 'Nov 2024', Actual: 980000, LE: 990000, Budget: 1000000 },
      { month: 'Dec 2024', Actual: 1050000, LE: 1030000, Budget: 1000000 }
    ],
    'Q3 2024': [
      { month: 'Jul 2024', Actual: 880000, LE: 920000, Budget: 1000000 },
      { month: 'Aug 2024', Actual: 940000, LE: 960000, Budget: 1000000 },
      { month: 'Sep 2024', Actual: 990000, LE: 1000000, Budget: 1000000 }
    ],
    'Q2 2024': [
      { month: 'Apr 2024', Actual: 850000, LE: 900000, Budget: 1000000 },
      { month: 'May 2024', Actual: 920000, LE: 940000, Budget: 1000000 },
      { month: 'Jun 2024', Actual: 980000, LE: 990000, Budget: 1000000 }
    ]
  };

  const currentData = performanceDataByQuarter[selectedQuarter] || performanceDataByQuarter['Q1 2025'];
  
  // Calculate totals
  const totalActual = currentData.reduce((sum, item) => sum + item.Actual, 0);
  const totalLE = currentData.reduce((sum, item) => sum + item.LE, 0);
  const totalBudget = currentData.reduce((sum, item) => sum + item.Budget, 0);
  const actualVsBudgetPercent = ((totalActual - totalBudget) / totalBudget * 100).toFixed(1);
  const leVsBudgetPercent = ((totalLE - totalBudget) / totalBudget * 100).toFixed(1);

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">FN Dashboard</h1>
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

      {/* KPI Cards Row - 5 cards for FN Dashboard */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
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

      {/* Charts Row - 3 Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* YTD Actual vs Budget */}
        <Card>
          <CardHeader className="border-b">
            <CardTitle className="text-lg font-semibold">YTD Actual vs Budget</CardTitle>
          </CardHeader>
           <CardContent className="pt-6 pb-8">
             <div className="space-y-2.5">
               {[
                 { name: 'Revenue', actual: 1343, budget: 1357, aboveBudget: false },
                 { name: 'COGS', actual: 1357, budget: 1343, aboveBudget: true },
                 { name: 'Gross Profit - 1', actual: 1276, budget: 1162, aboveBudget: true },
                 { name: 'Unallocated Cost', actual: 1277, budget: 1343, aboveBudget: false },
                 { name: 'Gross Profit - 2', actual: 1317, budget: 1249, aboveBudget: true },
                 { name: 'SG&A', actual: 1277, budget: 1142, aboveBudget: true },
                 { name: 'EBIT', actual: 1307, budget: 1110, aboveBudget: true },
                 { name: 'Net Profit Margin', actual: 1307, budget: 1110, aboveBudget: true }
               ].map((item, index) => {
                 const maxValue = 1500;
                 const percentage = Math.max(item.actual, item.budget) / maxValue * 100;
                 const actualWidth = (item.actual / Math.max(item.actual, item.budget)) * 100;
                 const budgetPosition = (item.budget / Math.max(item.actual, item.budget)) * 100;
                 return (
                   <div key={index} className="py-1.5">
                     <div className="flex items-center gap-3">
                       <div className="w-32 text-right text-xs text-gray-700 font-semibold">{item.name}</div>
                       <div className="flex-1 relative h-6">
                         <div className="absolute inset-0 bg-gray-100"></div>
                         <div 
                           className={`absolute top-0 left-0 h-full transition-all duration-500 ease-out ${
                             item.aboveBudget 
                               ? 'bg-rose-400' 
                               : 'bg-teal-400'
                           }`}
                           style={{ width: `${actualWidth}%` }}
                         >
                         </div>
                         <div 
                           className="absolute top-0 h-full w-0.5 bg-gray-900 z-10"
                           style={{ left: `${budgetPosition}%` }}
                         >
                         </div>
                       </div>
                       <div className="w-14 text-xs text-gray-900 font-bold text-right">{item.actual}</div>
                     </div>
                   </div>
                 );
               })}
              </div>
             <div className="flex items-center justify-center gap-4 pt-4 mt-4 border-t border-gray-200">
               <div className="flex items-center gap-1.5">
                 <div className="w-3 h-3 rounded-sm bg-rose-400"></div>
                 <span className="text-xs font-medium text-gray-600">Above Budget</span>
               </div>
               <div className="flex items-center gap-1.5">
                 <div className="w-3 h-3 rounded-sm bg-teal-400"></div>
                 <span className="text-xs font-medium text-gray-600">Below Budget</span>
               </div>
               <div className="flex items-center gap-1.5">
                 <div className="w-0.5 h-3 bg-gray-900"></div>
                 <span className="text-xs font-medium text-gray-600">Budget</span>
               </div>
             </div>
           </CardContent>
        </Card>

        {/* Budget Achievement */}
        <Card>
          <CardHeader className="border-b">
            <CardTitle className="text-lg font-semibold">Budget Achievement</CardTitle>
          </CardHeader>
           <CardContent className="pt-6 pb-8">
             <div className="space-y-2.5">
               {[
                 { name: 'Revenue', value: -3, isAbove: false },
                 { name: 'COGS', value: -6, isAbove: false },
                 { name: 'Gross Profit - 1', value: 110, isAbove: true },
                 { name: 'Unallocated Cost', value: 95, isAbove: false },
                 { name: 'Gross Profit - 2', value: 105, isAbove: true },
                 { name: 'SG&A', value: 121, isAbove: true },
                 { name: 'EBIT', value: 118, isAbove: true },
                 { name: 'Net Profit Margin', value: 118, isAbove: true }
               ].map((item, index) => {
                 return (
                   <div key={index} className="py-1.5">
                     <div className="flex items-center gap-3">
                       <div className="w-32 text-right text-xs text-gray-700 font-semibold">{item.name}</div>
                       <div className="flex-1 relative h-6">
                         <div className="absolute inset-0 bg-gray-100"></div>
                         <div 
                           className={`absolute top-0 left-0 h-full transition-all duration-500 ease-out ${
                             item.isAbove 
                               ? 'bg-rose-400' 
                               : 'bg-teal-400'
                           }`}
                           style={{ width: `${Math.min(Math.abs(item.value), 100)}%` }}
                         >
                         </div>
                       </div>
                       <div className="w-14 text-xs text-gray-900 font-bold text-right">{item.value}%</div>
                     </div>
                   </div>
                 );
               })}
             </div>
             <div className="flex items-center justify-center gap-4 pt-4 mt-4 border-t border-gray-200">
               <div className="flex items-center gap-1.5">
                 <div className="w-3 h-3 rounded-sm bg-rose-400"></div>
                 <span className="text-xs font-medium text-gray-600">Above Budget</span>
               </div>
               <div className="flex items-center gap-1.5">
                 <div className="w-3 h-3 rounded-sm bg-teal-400"></div>
                 <span className="text-xs font-medium text-gray-600">Below Budget</span>
               </div>
             </div>
           </CardContent>
        </Card>

        {/* Change (%) */}
        <Card>
          <CardHeader className="border-b">
            <CardTitle className="text-lg font-semibold">Change (%)</CardTitle>
          </CardHeader>
           <CardContent className="pt-6 pb-8">
             <div className="space-y-2.5">
               {[
                 { name: 'Revenue', value: 2 },
                 { name: 'COGS', value: -6 },
                 { name: 'Gross Profit - 1', value: 19 },
                 { name: 'Unallocated Cost', value: -17 },
                 { name: 'Gross Profit - 2', value: 16 },
                 { name: 'SG&A', value: 9 },
                 { name: 'EBIT', value: 4 },
                 { name: 'Net Profit Margin', value: 4 }
               ].map((item, index) => {
                 const isPositive = item.value >= 0;
                 return (
                   <div key={index} className="py-1.5">
                     <div className="flex items-center gap-3">
                       <div className="w-32 text-right text-xs text-gray-700 font-semibold">{item.name}</div>
                       <div className="flex-1 flex items-center justify-end pr-4">
                         <div className={`px-6 py-1 rounded font-bold text-xs min-w-[70px] text-center ${
                           isPositive 
                             ? 'bg-green-100 text-green-700' 
                             : 'bg-red-100 text-red-700'
                         }`}>
                           {item.value > 0 ? '+' : ''}{item.value}%
                         </div>
                       </div>
                     </div>
                   </div>
                 );
              })}
            </div>
           </CardContent>
        </Card>
      </div>

      {/* Charts Row 3 - Ask AI & Performance by Month */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Ask AI Section */}
        <Card>
          <CardHeader className="border-b">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <span>✨</span>
                <span>Ask AI</span>
              </CardTitle>
              <Badge variant="secondary" className="text-xs">Q1 2025</Badge>
            </div>
          </CardHeader>
          
          <CardContent className="pt-6">
            <div className="space-y-4">
              {/* Total Revenue Card */}
              <div className="bg-purple-600 rounded-lg p-6 text-center text-white">
                <div className="text-sm font-medium mb-2">Total Revenue</div>
                <div className="text-4xl font-bold mb-3">฿3,000,000</div>
                <div className="w-16 h-16 mx-auto bg-purple-700 rounded-full flex items-center justify-center">
                  <DollarSign className="w-8 h-8" />
                </div>
              </div>

              {/* Monthly Breakdown */}
              <div className="grid grid-cols-3 gap-2">
                {[
                  { month: 'Jan', amount: '1,000,000' },
                  { month: 'Feb', amount: '1,000,000' },
                  { month: 'Mar', amount: '1,000,000' }
                ].map((item, idx) => (
                  <div key={idx} className="bg-white border border-gray-200 rounded-lg p-3 text-center">
                    <div className="text-xs font-medium text-gray-500 mb-1">{item.month}, 2025</div>
                    <div className="text-base font-bold text-gray-900">฿{item.amount}</div>
                  </div>
                ))}
              </div>

              {/* Ask AI Input */}
              <form onSubmit={handleAiInsightSubmit}>
                <input
                  type="text"
                  value={aiInsightQuery}
                  onChange={(e) => setAiInsightQuery(e.target.value)}
                  placeholder="Ask AI..."
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </form>
            </div>
          </CardContent>
        </Card>

         {/* Performance by Month - Spans 2 columns */}
         <Card className="lg:col-span-2">
           <CardHeader className="border-b">
             <div className="flex items-center justify-between">
               <div>
                   <CardTitle className="text-lg font-semibold flex items-center gap-2">
                     Performance by Month ({selectedQuarter})
                   </CardTitle>
                   <CardDescription className="text-sm text-gray-600 mt-1">Comparison of Actual, Latest Estimate, and Budget</CardDescription>
                 </div>
              <div className="flex space-x-2">
                 <select 
                   value={selectedQuarter}
                   onChange={(e) => setSelectedQuarter(e.target.value)}
                   className="text-xs border border-gray-300 rounded-lg px-3 py-1.5 bg-white shadow-sm hover:border-purple-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all cursor-pointer"
                 >
                   <option>Q1 2025</option>
                   <option>Q4 2024</option>
                   <option>Q3 2024</option>
                   <option>Q2 2024</option>
                </select>
                 <select 
                   value={selectedCategory}
                   onChange={(e) => setSelectedCategory(e.target.value)}
                   className="text-xs border border-gray-300 rounded-lg px-3 py-1.5 bg-white shadow-sm hover:border-purple-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all cursor-pointer"
                 >
                   <option>All Categories</option>
                   <option>Revenue Only</option>
                   <option>Cost Only</option>
                </select>
              </div>
            </div>
          </CardHeader>
           <CardContent className="pt-6">
            <ResponsiveContainer width="100%" height={320}>
               <BarChart 
                 data={currentData}
                 margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                 barGap={8}
                 barCategoryGap="20%"
               >
                 <defs>
                   <linearGradient id="actualGradient" x1="0" y1="0" x2="0" y2="1">
                     <stop offset="0%" stopColor="#4f46e5" stopOpacity={0.9}/>
                     <stop offset="100%" stopColor="#4338ca" stopOpacity={0.9}/>
                   </linearGradient>
                   <linearGradient id="leGradient" x1="0" y1="0" x2="0" y2="1">
                     <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.9}/>
                     <stop offset="100%" stopColor="#7c3aed" stopOpacity={0.9}/>
                   </linearGradient>
                   <linearGradient id="budgetGradient" x1="0" y1="0" x2="0" y2="1">
                     <stop offset="0%" stopColor="#06b6d4" stopOpacity={0.9}/>
                     <stop offset="100%" stopColor="#0891b2" stopOpacity={0.9}/>
                   </linearGradient>
                 </defs>
                 <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                   tick={{ fontSize: 11, fill: '#666', fontWeight: 500 }}
                   dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                   tick={{ fontSize: 11, fill: '#666' }}
                   tickFormatter={(value) => `฿${(value / 1000).toFixed(0)}K`}
                   width={60}
                />
                <Tooltip
                  contentStyle={{
                     backgroundColor: 'rgba(0, 0, 0, 0.9)',
                     border: 'none',
                     borderRadius: '12px',
                     padding: '12px 16px',
                     boxShadow: '0 10px 25px rgba(0,0,0,0.3)'
                   }}
                   labelStyle={{ color: 'white', fontWeight: 'bold', marginBottom: '8px' }}
                   itemStyle={{ color: 'white', padding: '4px 0' }}
                   formatter={(value) => [`฿${(value as number).toLocaleString()}`, '']}
                   cursor={{ fill: 'rgba(79, 70, 229, 0.1)' }}
                 />
                 <Legend 
                   verticalAlign="bottom"
                   height={50}
                   iconType="circle"
                   wrapperStyle={{ 
                     fontSize: '12px', 
                     fontWeight: 600,
                     paddingTop: '20px'
                   }}
                   formatter={(value) => {
                     const labels: {[key: string]: string} = {
                       'Actual': '🎯 Actual',
                       'LE': '📊 Latest Estimate',
                       'Budget': '💰 Budget'
                     };
                     return labels[value] || value;
                   }}
                 />
                 <Bar 
                   dataKey="Actual" 
                   fill="url(#actualGradient)" 
                   name="Actual" 
                   radius={[8, 8, 0, 0]}
                   maxBarSize={50}
                 />
                 <Bar 
                   dataKey="LE" 
                   fill="url(#leGradient)" 
                   name="LE" 
                   radius={[8, 8, 0, 0]}
                   maxBarSize={50}
                 />
                 <Bar 
                   dataKey="Budget" 
                   fill="url(#budgetGradient)" 
                   name="Budget" 
                   radius={[8, 8, 0, 0]}
                   maxBarSize={50}
                 />
              </BarChart>
            </ResponsiveContainer>
             
             {/* Summary Stats */}
             <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-200">
               <div className="text-center p-4 bg-gray-50 rounded-lg">
                 <div className="text-xs font-medium text-gray-600 mb-2">Total Actual</div>
                 <div className="text-2xl font-bold text-gray-900 mb-1">฿{(totalActual / 1000000).toFixed(2)}M</div>
                 <div className={`text-xs font-medium ${parseFloat(actualVsBudgetPercent) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                   {actualVsBudgetPercent}% vs Budget
                 </div>
               </div>
               
               <div className="text-center p-4 bg-gray-50 rounded-lg">
                 <div className="text-xs font-medium text-gray-600 mb-2">Total LE</div>
                 <div className="text-2xl font-bold text-gray-900 mb-1">฿{(totalLE / 1000000).toFixed(2)}M</div>
                 <div className={`text-xs font-medium ${parseFloat(leVsBudgetPercent) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                   {leVsBudgetPercent}% vs Budget
                 </div>
               </div>
               
               <div className="text-center p-4 bg-gray-50 rounded-lg">
                 <div className="text-xs font-medium text-gray-600 mb-2">Total Budget</div>
                 <div className="text-2xl font-bold text-gray-900 mb-1">฿{(totalBudget / 1000000).toFixed(2)}M</div>
                 <div className="text-xs text-gray-600">Baseline Target</div>
               </div>
             </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
