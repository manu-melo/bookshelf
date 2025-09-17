import React from "react";

interface StatsCardProps {
  title: string;
  value: string;
  subtitle: string;
  rating?: string;
  icon: React.ReactNode;
}

export default function StatsCard({
  title,
  value,
  subtitle,
  rating,
  icon,
}: StatsCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <div className="text-gray-500">{icon}</div>
      </div>
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
        <div className="flex items-baseline space-x-2">
          <span className="text-2xl font-bold text-gray-900">{value}</span>
          {subtitle && (
            <span className="text-sm text-gray-500">{subtitle}</span>
          )}
        </div>
        {rating && <p className="text-xs text-gray-400">{rating}</p>}
      </div>
    </div>
  );
}
