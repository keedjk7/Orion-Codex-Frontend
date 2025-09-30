import React, { useState } from 'react';
import { TrendingUp, TrendingDown, ExternalLink, Info } from 'lucide-react';
import { LOBDetailModal } from './LOBDetailModal';

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

interface InteractiveLOBCardProps {
  lob: LOBData;
  index: number;
}

export function InteractiveLOBCard({ lob, index }: InteractiveLOBCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const bgColor = lob.color === 'green' 
    ? 'from-green-50 to-emerald-50 border-green-200' 
    : 'from-red-50 to-rose-50 border-red-200';
  
  const textColor = lob.color === 'green' 
    ? 'text-green-900' 
    : 'text-red-900';
  
  const badgeColor = lob.color === 'green' 
    ? 'bg-green-600' 
    : 'bg-red-600';

  const Icon = lob.color === 'green' ? TrendingUp : TrendingDown;

  return (
    <>
      <div 
        className={`group relative p-5 bg-gradient-to-br ${bgColor} rounded-xl border cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1`}
        onClick={() => setIsModalOpen(true)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Hover Effect Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/5 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
        
        {/* Click to View Badge */}
        {isHovered && (
          <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-semibold text-gray-700 shadow-lg animate-in fade-in zoom-in-95">
            <Info className="w-3 h-3" />
            Click for details
          </div>
        )}

        <div className="relative z-10">
          {/* Header */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className={`p-2 rounded-lg ${lob.color === 'green' ? 'bg-green-100' : 'bg-red-100'} group-hover:scale-110 transition-transform duration-300`}>
                <Icon className={`w-5 h-5 ${lob.color === 'green' ? 'text-green-600' : 'text-red-600'}`} />
              </div>
              <div className={`font-bold text-lg ${textColor} group-hover:text-opacity-80 transition-colors`}>
                {lob.name}
              </div>
            </div>
            <ExternalLink className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>

          {/* Growth Badge */}
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-gray-600 font-medium">Growth Rate:</span>
            <span className={`px-4 py-1.5 ${badgeColor} text-white text-base rounded-full font-bold shadow-md group-hover:shadow-lg transition-shadow`}>
              {lob.growth}
            </span>
          </div>

          {/* Revenue */}
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-200">
            <span className="text-sm text-gray-600 font-medium">Revenue:</span>
            <span className="text-lg font-bold text-gray-900">{lob.revenue}</span>
          </div>

          {/* Reason */}
          <p className="text-sm text-gray-700 mb-4 leading-relaxed line-clamp-2 group-hover:line-clamp-none transition-all">
            {lob.reason}
          </p>

          {/* Key Drivers */}
          <div className="space-y-1.5">
            <div className="text-xs font-semibold text-gray-600 mb-2 flex items-center gap-1">
              <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
              Key Drivers:
            </div>
            {lob.details.slice(0, 2).map((detail, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs bg-white/50 rounded-lg px-2 py-1.5">
                <span className="text-gray-600 truncate flex-1">{detail.segment}</span>
                <span className={`font-semibold ml-2 ${
                  lob.color === 'green' ? 'text-green-700' : 'text-red-700'
                }`}>
                  {detail.growth}
                </span>
              </div>
            ))}
            {lob.details.length > 2 && (
              <div className="text-xs text-gray-500 text-center pt-1">
                +{lob.details.length - 2} more drivers
              </div>
            )}
          </div>

          {/* View More Button */}
          <div className="mt-4 pt-3 border-t border-gray-200">
            <div className="text-xs text-center font-semibold text-gray-500 group-hover:text-gray-700 transition-colors">
              Click to view full analysis →
            </div>
          </div>
        </div>

        {/* Animated Border Gradient on Hover */}
        <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          <div className={`absolute inset-0 rounded-xl border-2 ${lob.color === 'green' ? 'border-green-400' : 'border-red-400'} animate-pulse`}></div>
        </div>
      </div>

      {/* Detail Modal */}
      <LOBDetailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        lob={lob}
      />
    </>
  );
}
