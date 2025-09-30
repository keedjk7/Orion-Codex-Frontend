import React from 'react';
import { DetailModal, DetailSectionGroup } from './ui/DetailModal';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, Target, Users } from 'lucide-react';

interface LOBDetail {
  segment: string;
  growth: string;
  driver: string;
}

interface LOBData {
  name: string;
  growth: string;
  revenue: string;
  color: 'green' | 'red';
  reason: string;
  details: LOBDetail[];
}

interface LOBDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  lob: LOBData | null;
}

// Generate mock historical data
const generateHistoricalData = (name: string, isGrowing: boolean) => {
  const baseValue = Math.random() * 100 + 50;
  const trend = isGrowing ? 1 : -1;
  
  return [
    { month: 'Jan', revenue: baseValue, target: baseValue + 5 },
    { month: 'Feb', revenue: baseValue + (trend * 5), target: baseValue + 10 },
    { month: 'Mar', revenue: baseValue + (trend * 10), target: baseValue + 15 },
    { month: 'Apr', revenue: baseValue + (trend * 15), target: baseValue + 20 },
    { month: 'May', revenue: baseValue + (trend * 20), target: baseValue + 25 },
    { month: 'Jun', revenue: baseValue + (trend * 25), target: baseValue + 30 },
  ];
};

const generateSegmentData = (details: LOBDetail[]) => {
  return details.map(detail => ({
    name: detail.segment,
    value: parseFloat(detail.growth.replace('%', '').replace('+', '').replace('-', '')),
    growth: detail.growth
  }));
};

export function LOBDetailModal({ isOpen, onClose, lob }: LOBDetailModalProps) {
  if (!lob) return null;

  const isGrowing = lob.color === 'green';
  const historicalData = generateHistoricalData(lob.name, isGrowing);
  const segmentData = generateSegmentData(lob.details);

  const Icon = isGrowing ? TrendingUp : TrendingDown;
  const iconColor = isGrowing ? 'text-green-600' : 'text-red-600';
  const bgColor = isGrowing ? 'bg-green-50' : 'bg-red-50';

  return (
    <DetailModal isOpen={isOpen} onClose={onClose} title={`${lob.name} - Detailed Analysis`}>
      <div className="space-y-6">
        {/* Overview Card */}
        <div className={`${bgColor} rounded-xl p-6 border ${isGrowing ? 'border-green-200' : 'border-red-200'}`}>
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-full ${isGrowing ? 'bg-green-100' : 'bg-red-100'}`}>
                <Icon className={`w-8 h-8 ${iconColor}`} />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">{lob.name}</h3>
                <p className="text-sm text-gray-600 mt-1">{lob.reason}</p>
              </div>
            </div>
            <div className="text-right">
              <div className={`text-3xl font-bold ${iconColor} mb-1`}>{lob.growth}</div>
              <div className="text-sm text-gray-600">Growth Rate</div>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-4 mt-4">
            <div className="bg-white rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-medium text-gray-600">Revenue</span>
              </div>
              <div className="text-2xl font-bold text-gray-900">{lob.revenue}</div>
            </div>
            <div className="bg-white rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-5 h-5 text-purple-600" />
                <span className="text-sm font-medium text-gray-600">Target</span>
              </div>
              <div className="text-2xl font-bold text-gray-900">{parseInt(lob.revenue.replace('$', '').replace('M', '')) + 10}M</div>
            </div>
            <div className="bg-white rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-5 h-5 text-orange-600" />
                <span className="text-sm font-medium text-gray-600">Team Size</span>
              </div>
              <div className="text-2xl font-bold text-gray-900">{Math.floor(Math.random() * 200) + 50}</div>
            </div>
          </div>
        </div>

        {/* Historical Trend */}
        <div className="bg-gray-50 rounded-xl p-6">
          <h4 className="text-lg font-bold text-gray-900 mb-4">6-Month Revenue Trend</h4>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={historicalData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px'
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke={isGrowing ? '#10b981' : '#ef4444'}
                strokeWidth={3}
                dot={{ fill: isGrowing ? '#10b981' : '#ef4444', r: 5 }}
                name="Actual Revenue"
              />
              <Line
                type="monotone"
                dataKey="target"
                stroke="#8b5cf6"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={{ fill: '#8b5cf6', r: 4 }}
                name="Target"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Segment Performance */}
        <div className="bg-gray-50 rounded-xl p-6">
          <h4 className="text-lg font-bold text-gray-900 mb-4">Segment Performance</h4>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={segmentData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} angle={-15} textAnchor="end" height={80} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px'
                }}
                formatter={(value: any) => [`${value}%`, 'Growth']}
              />
              <Bar dataKey="value" fill={isGrowing ? '#10b981' : '#ef4444'} radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Key Drivers Details */}
        <DetailSectionGroup
          title="Key Growth Drivers"
          items={lob.details.map(detail => ({
            label: detail.segment,
            value: detail.growth,
            trend: isGrowing ? 'up' : 'down',
            color: isGrowing ? 'text-green-700' : 'text-red-700'
          }))}
        />

        {/* Market Insights */}
        <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
          <h4 className="text-lg font-bold text-gray-900 mb-3">Market Insights</h4>
          <div className="space-y-2">
            {lob.details.map((detail, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div>
                  <div className="font-semibold text-gray-900 text-sm">{detail.segment}</div>
                  <div className="text-sm text-gray-600">{detail.driver}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
          >
            Close
          </button>
          <button
            onClick={() => alert('Export functionality coming soon!')}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Export Report
          </button>
        </div>
      </div>
    </DetailModal>
  );
}
