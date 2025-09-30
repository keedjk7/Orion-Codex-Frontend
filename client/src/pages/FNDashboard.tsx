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
      {/* Header Section with Enhanced Gradient Background */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-700 p-8 text-white shadow-2xl">
        <div className="absolute inset-0 bg-black/10"></div>
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-20 h-20 border-2 border-white rounded-full animate-ping"></div>
          <div className="absolute bottom-20 right-20 w-16 h-16 border-2 border-white rounded-full animate-ping" style={{ animationDelay: '1s' }}></div>
        </div>
        
        <div className="relative z-10 flex items-center justify-between">
        <div>
            <h1 className="text-5xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-white to-emerald-100">
              FN Dashboard
            </h1>
            <p className="text-emerald-100 text-xl mb-4">Welcome back, {getUserDisplayName()}</p>
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-white">Live Data</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                <Calendar className="w-4 h-4 text-emerald-200" />
                <span className="text-sm font-medium text-white">Last updated: 20/12/26 12:07</span>
              </div>
            </div>
        </div>
          <div className="flex flex-col items-end space-y-3">
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30 backdrop-blur-md hover:bg-white/30 transition-all">
              Version: 2024.1.6
          </Badge>
            <div className="flex space-x-2">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm hover:bg-white/30 transition-all cursor-pointer">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm hover:bg-white/30 transition-all cursor-pointer">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
            </div>
        </div>
        </div>
        
        {/* Enhanced Decorative Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-white/5 to-transparent rounded-full -translate-y-48 translate-x-48 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-gradient-to-tr from-white/5 to-transparent rounded-full translate-y-36 -translate-x-36 blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-white/3 rounded-full -translate-x-1/2 -translate-y-1/2 blur-2xl"></div>
      </div>

      {/* KPI Cards Row - 5 cards for FN Dashboard */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 lg:gap-6">
        {kpiData.map((kpi, index) => {
          const Icon = kpi.icon;
          const isPositive = kpi.trend === 'up';
          
          return (
            <Card key={index} className="group hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 bg-white border-0 shadow-lg overflow-hidden relative">
              <CardContent className="p-0">
                {/* Animated Gradient Header */}
                <div className={`h-2 relative overflow-hidden ${
                  kpi.color === 'blue' ? 'bg-gradient-to-r from-blue-500 to-blue-600' :
                  kpi.color === 'green' ? 'bg-gradient-to-r from-green-500 to-green-600' :
                  kpi.color === 'purple' ? 'bg-gradient-to-r from-purple-500 to-purple-600' :
                  kpi.color === 'teal' ? 'bg-gradient-to-r from-teal-500 to-teal-600' :
                  'bg-gradient-to-r from-orange-500 to-orange-600'
                }`}>
                  <div className="absolute inset-0 bg-white/30 animate-pulse"></div>
                </div>
                
                {/* Background Pattern */}
                <div className="absolute top-0 right-0 w-32 h-32 opacity-5 transform rotate-12 group-hover:scale-110 transition-transform duration-500">
                  <Icon className="w-full h-full" />
                </div>
                
                <div className="p-6 relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-xs font-bold text-gray-600 uppercase tracking-wider">
                      {kpi.title}
                    </div>
                    <div className={`p-3 rounded-2xl shadow-lg ${
                      kpi.color === 'blue' ? 'bg-gradient-to-br from-blue-50 to-blue-100 text-blue-600' :
                      kpi.color === 'green' ? 'bg-gradient-to-br from-green-50 to-green-100 text-green-600' :
                      kpi.color === 'purple' ? 'bg-gradient-to-br from-purple-50 to-purple-100 text-purple-600' :
                      kpi.color === 'teal' ? 'bg-gradient-to-br from-teal-50 to-teal-100 text-teal-600' :
                      'bg-gradient-to-br from-orange-50 to-orange-100 text-orange-600'
                    } group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                      <Icon className="h-5 w-5" />
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="text-4xl font-bold text-gray-900 group-hover:scale-105 transition-transform duration-200">
                      {kpi.value}
                    </div>
                    
                    {kpi.change && (
                      <div className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg font-semibold text-xs ${
                        isPositive 
                          ? 'text-green-700 bg-green-100 border border-green-200' 
                          : 'text-red-700 bg-red-100 border border-red-200'
                      }`}>
                        {isPositive ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
                        <span>{kpi.change}</span>
                      </div>
                    )}
                    
                    {/* Mini Progress Bar */}
                    <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full animate-pulse ${
                        kpi.color === 'blue' ? 'bg-gradient-to-r from-blue-500 to-blue-600' :
                        kpi.color === 'green' ? 'bg-gradient-to-r from-green-500 to-green-600' :
                        kpi.color === 'purple' ? 'bg-gradient-to-r from-purple-500 to-purple-600' :
                        kpi.color === 'teal' ? 'bg-gradient-to-r from-teal-500 to-teal-600' :
                        'bg-gradient-to-r from-orange-500 to-orange-600'
                      }`} style={{ width: '75%' }}></div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="text-xs text-gray-500 font-medium">
                        {kpi.period}
                      </div>
                      <div className={`text-xs font-semibold ${
                        kpi.color === 'blue' ? 'text-blue-600' :
                        kpi.color === 'green' ? 'text-green-600' :
                        kpi.color === 'purple' ? 'text-purple-600' :
                        kpi.color === 'teal' ? 'text-teal-600' :
                        'text-orange-600'
                      }`}>
                        75%
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts Row - 3 Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
        {/* YTD Actual vs Budget */}
        <Card className="shadow-xl border-0 bg-white hover:shadow-2xl transition-all duration-300">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
            <CardTitle className="text-base font-bold text-gray-900">YTD Actual vs Budget</CardTitle>
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
        <Card className="shadow-xl border-0 bg-white hover:shadow-2xl transition-all duration-300">
          <CardHeader className="bg-gradient-to-r from-emerald-50 to-teal-50 border-b">
            <CardTitle className="text-base font-bold text-gray-900">Budget Achievement</CardTitle>
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
        <Card className="shadow-xl border-0 bg-white hover:shadow-2xl transition-all duration-300">
          <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 border-b">
            <CardTitle className="text-base font-bold text-gray-900">Change (%)</CardTitle>
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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
        {/* Ask AI Section */}
        <Card className="shadow-xl border-0 bg-gradient-to-br from-white via-emerald-50/30 to-teal-50/50 hover:shadow-2xl transition-all duration-300 group relative overflow-hidden">
          {/* Decorative gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-teal-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          
          <CardHeader className="bg-gradient-to-r from-emerald-50 via-teal-50 to-cyan-50 border-b border-emerald-100 relative">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-bold text-gray-900 flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-md">
                  <span className="text-lg">✨</span>
                </div>
                <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">Ask AI</span>
              </CardTitle>
              <div className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-semibold rounded-full">Q1 2025</div>
            </div>
          </CardHeader>
          
          <CardContent className="pt-6 relative z-10">
            <div className="space-y-5">
              {/* Total Revenue Card - Enhanced */}
              <div className="relative rounded-xl overflow-hidden group/card">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-500 opacity-90"></div>
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLW9wYWNpdHk9IjAuMSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-30"></div>
                
                <div className="relative p-6 text-center">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full mb-3">
                    <div className="w-2 h-2 rounded-full bg-white animate-pulse"></div>
                    <span className="text-xs font-semibold text-white">Total Revenue</span>
                  </div>
                  <div className="text-5xl font-bold text-white mb-4 tracking-tight drop-shadow-lg">฿3,000,000</div>
                  <div className="flex items-center justify-center gap-2 text-white/90">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center shadow-lg group-hover/card:scale-110 transition-transform duration-300">
                      <DollarSign className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Monthly Breakdown - Enhanced */}
              <div className="grid grid-cols-3 gap-2.5">
                {[
                  { month: 'Jan', amount: '1,000,000', color: 'from-emerald-400 to-emerald-500' },
                  { month: 'Feb', amount: '1,000,000', color: 'from-teal-400 to-teal-500' },
                  { month: 'Mar', amount: '1,000,000', color: 'from-cyan-400 to-cyan-500' }
                ].map((item, idx) => (
                  <div key={idx} className="bg-white border-2 border-emerald-100 rounded-xl p-3 text-center hover:border-emerald-300 hover:shadow-lg transition-all duration-200 group/month">
                    <div className="text-xs font-semibold text-emerald-600 mb-1.5">{item.month}, 2025</div>
                    <div className="text-base font-bold text-gray-900 mb-2">฿{item.amount}</div>
                    <div className={`h-1.5 bg-gradient-to-r ${item.color} rounded-full transform group-hover/month:scale-x-105 transition-transform duration-200`}></div>
                  </div>
                ))}
              </div>

              {/* Ask AI Input - Enhanced */}
              <form onSubmit={handleAiInsightSubmit} className="relative">
                <div className="relative">
                  <input
                    type="text"
                    value={aiInsightQuery}
                    onChange={(e) => setAiInsightQuery(e.target.value)}
                    placeholder="Ask AI about your finances..."
                    className="w-full px-4 py-3.5 pr-14 bg-white border-2 border-emerald-200 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 shadow-sm hover:border-emerald-300 transition-all"
                  />
                  <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
                    <button type="button" className="p-2 hover:bg-emerald-50 rounded-lg transition-colors group/btn" title="Attach">
                      <span className="text-gray-400 group-hover/btn:text-emerald-600 text-xs font-bold">+</span>
                    </button>
                    <button type="button" className="p-2 hover:bg-emerald-50 rounded-lg transition-colors group/btn" title="Image">
                      <span className="text-gray-400 group-hover/btn:text-emerald-600 text-xs">🖼</span>
                    </button>
                    <button type="button" className="p-2 hover:bg-emerald-50 rounded-lg transition-colors group/btn" title="Voice">
                      <span className="text-gray-400 group-hover/btn:text-emerald-600 text-xs">🎤</span>
                    </button>
                  </div>
                </div>
              </form>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-2 pt-2">
                <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-lg p-3 border border-emerald-100">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                    <span className="text-xs font-medium text-gray-600">Avg/Month</span>
                  </div>
                  <div className="text-lg font-bold text-gray-900">฿1.0M</div>
                </div>
                <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-lg p-3 border border-teal-100">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-teal-500"></div>
                    <span className="text-xs font-medium text-gray-600">Growth</span>
                  </div>
                  <div className="text-lg font-bold text-green-600">+12%</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

         {/* Performance by Month - Spans 2 columns */}
         <Card className="lg:col-span-2 shadow-xl border-0 bg-white hover:shadow-2xl transition-all duration-300 group">
           <CardHeader className="bg-gradient-to-r from-purple-50 via-pink-50 to-purple-50 border-b relative overflow-hidden">
             {/* Animated background */}
             <div className="absolute inset-0 bg-gradient-to-r from-purple-100/0 via-purple-100/50 to-purple-100/0 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
             
             <div className="flex items-center justify-between relative z-10">
               <div className="flex items-center gap-3">
                 <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg shadow-lg">
                   <BarChart3 className="w-5 h-5 text-white" />
      </div>
              <div>
                   <CardTitle className="text-base font-bold text-gray-900 flex items-center gap-2">
                     Performance by Month ({selectedQuarter})
                     <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 text-xs">Live</Badge>
                   </CardTitle>
                   <CardDescription className="text-xs text-gray-600 mt-1">Comparison of Actual, Latest Estimate, and Budget</CardDescription>
                 </div>
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
             
             {/* Summary Stats with Animation */}
             <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-200">
               <div className="group text-center p-5 bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105 relative overflow-hidden">
                 <div className="absolute inset-0 bg-gradient-to-br from-indigo-400/0 to-indigo-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                 <div className="relative z-10">
                   <div className="flex items-center justify-center gap-1 mb-2">
                     <Target className="w-3 h-3 text-indigo-600" />
                     <div className="text-xs font-semibold text-indigo-600">Total Actual</div>
                   </div>
                   <div className="text-3xl font-bold text-gray-900 mb-1">฿{(totalActual / 1000000).toFixed(2)}M</div>
                   <div className={`flex items-center justify-center gap-1 text-xs font-semibold ${parseFloat(actualVsBudgetPercent) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                     {parseFloat(actualVsBudgetPercent) >= 0 ? (
                       <ArrowUpRight className="w-3 h-3" />
                     ) : (
                       <ArrowDownRight className="w-3 h-3" />
                     )}
                     {actualVsBudgetPercent}% vs Budget
                   </div>
                 </div>
               </div>
               
               <div className="group text-center p-5 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105 relative overflow-hidden">
                 <div className="absolute inset-0 bg-gradient-to-br from-purple-400/0 to-purple-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                 <div className="relative z-10">
                   <div className="flex items-center justify-center gap-1 mb-2">
                     <TrendingUp className="w-3 h-3 text-purple-600" />
                     <div className="text-xs font-semibold text-purple-600">Total LE</div>
                   </div>
                   <div className="text-3xl font-bold text-gray-900 mb-1">฿{(totalLE / 1000000).toFixed(2)}M</div>
                   <div className={`flex items-center justify-center gap-1 text-xs font-semibold ${parseFloat(leVsBudgetPercent) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                     {parseFloat(leVsBudgetPercent) >= 0 ? (
                       <ArrowUpRight className="w-3 h-3" />
                     ) : (
                       <ArrowDownRight className="w-3 h-3" />
                     )}
                     {leVsBudgetPercent}% vs Budget
                   </div>
                 </div>
               </div>
               
               <div className="group text-center p-5 bg-gradient-to-br from-cyan-50 to-cyan-100 rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105 relative overflow-hidden">
                 <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/0 to-cyan-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                 <div className="relative z-10">
                   <div className="flex items-center justify-center gap-1 mb-2">
                     <DollarSign className="w-3 h-3 text-cyan-600" />
                     <div className="text-xs font-semibold text-cyan-600">Total Budget</div>
                   </div>
                   <div className="text-3xl font-bold text-gray-900 mb-1">฿{(totalBudget / 1000000).toFixed(2)}M</div>
                   <div className="flex items-center justify-center gap-1 text-xs text-gray-600 font-semibold">
                     <div className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse"></div>
                     Baseline Target
                   </div>
                 </div>
               </div>
             </div>
             
             {/* Trend Indicator */}
             <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
               <div className="flex items-center justify-between">
                 <div className="flex items-center gap-3">
                   <div className="p-2 bg-green-500 rounded-lg">
                     <TrendingUp className="w-5 h-5 text-white" />
                   </div>
                   <div>
                     <div className="text-sm font-bold text-gray-900">Performance Trend</div>
                     <div className="text-xs text-gray-600">Quarter-over-Quarter Growth</div>
                   </div>
                 </div>
                 <div className="text-right">
                   <div className="text-2xl font-bold text-green-600">
                     {selectedQuarter === 'Q1 2025' ? '+8.2%' : 
                      selectedQuarter === 'Q4 2024' ? '+6.5%' : 
                      selectedQuarter === 'Q3 2024' ? '+4.1%' : 
                      '+2.8%'}
                   </div>
                   <div className="text-xs text-gray-600">vs Previous Quarter</div>
                 </div>
               </div>
             </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
