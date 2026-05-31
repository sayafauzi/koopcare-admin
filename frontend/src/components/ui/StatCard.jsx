import React from 'react';

const StatCard = ({ title, value, icon, change, changeType = 'up' }) => {
  return (
    <div className="bg-white rounded-lg shadow p-6 border-l-4 border-primary-700">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-neutral-500">{title}</p>
          <p className="text-2xl font-bold text-neutral-800">{value}</p>
        </div>
        {icon && <div className="text-primary-700">{icon}</div>}
      </div>
      {change && (
        <p className={`text-xs mt-2 ${changeType === 'up' ? 'text-success' : 'text-error'}`}>
          {change}
        </p>
      )}
    </div>
  );
};

export default StatCard;