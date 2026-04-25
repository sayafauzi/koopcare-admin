import React from 'react';

const SkeletonLoader = ({ type = 'table', rows = 5 }) => {
  if (type === 'table') {
    return (
      <div className="w-full">
        {}
        <div className="flex bg-gray-800 text-white text-xs uppercase tracking-wider p-4 rounded-t-2xl">
          <div className="flex-1 h-4 bg-gray-700 rounded animate-pulse"></div>
          <div className="flex-1 h-4 bg-gray-700 rounded animate-pulse ml-4"></div>
          <div className="flex-1 h-4 bg-gray-700 rounded animate-pulse ml-4"></div>
          <div className="flex-1 h-4 bg-gray-700 rounded animate-pulse ml-4"></div>
          <div className="flex-1 h-4 bg-gray-700 rounded animate-pulse ml-4"></div>
        </div>
        {/* Table Rows */}
        {Array.from({ length: rows }).map((_, index) => (
          <div key={index} className="flex items-center p-4 border-b border-gray-100">
            <div className="flex-1 h-4 bg-gray-200 rounded animate-pulse"></div>
            <div className="flex-1 h-4 bg-gray-200 rounded animate-pulse ml-4"></div>
            <div className="flex-1 h-4 bg-gray-200 rounded animate-pulse ml-4"></div>
            <div className="flex-1 h-4 bg-gray-200 rounded animate-pulse ml-4"></div>
            <div className="flex-1 h-4 bg-gray-200 rounded animate-pulse ml-4"></div>
          </div>
        ))}
      </div>
    );
  }

  if (type === 'card') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: rows }).map((_, index) => (
          <div key={index} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <div className="h-2 w-20 bg-gray-200 rounded animate-pulse mb-4"></div>
            <div className="h-8 w-32 bg-gray-200 rounded animate-pulse mb-2"></div>
            <div className="h-3 w-24 bg-gray-200 rounded animate-pulse"></div>
          </div>
        ))}
      </div>
    );
  }

  if (type === 'form') {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="h-6 w-40 bg-gray-200 rounded animate-pulse mb-6"></div>
          <div className="space-y-4">
            <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-10 w-full bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-10 w-full bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-10 w-full bg-gray-200 rounded animate-pulse"></div>
            <div className="h-12 w-full bg-gray-200 rounded animate-pulse mt-4"></div>
          </div>
        </div>
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden p-6">
          <div className="h-6 w-48 bg-gray-200 rounded animate-pulse mb-6"></div>
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="flex items-center gap-4 p-4 border-b border-gray-100">
                <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 w-20 bg-gray-200 rounded animate-pulse ml-auto"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 p-6">
      {Array.from({ length: rows }).map((_, index) => (
        <div key={index} className="h-16 w-full bg-gray-200 rounded animate-pulse"></div>
      ))}
    </div>
  );
};

export default SkeletonLoader;