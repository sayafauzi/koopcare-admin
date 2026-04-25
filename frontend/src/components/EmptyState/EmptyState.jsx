import React from 'react';
import { FileText, Users, CreditCard, FolderOpen } from 'lucide-react';

const EmptyState = ({ 
  title = "Belum Ada Data", 
  description = "Data akan muncul di sini setelah Anda menambahkan atau menerima data.",
  icon = "default"
}) => {
  const icons = {
    default: <FolderOpen className="w-16 h-16 text-gray-300" />,
    table: <FileText className="w-16 h-16 text-gray-300" />,
    users: <Users className="w-16 h-16 text-gray-300" />,
    transaction: <CreditCard className="w-16 h-16 text-gray-300" />,
  };

  const IconComponent = icons[icon] || icons.default;

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="bg-gray-50 rounded-full p-6 mb-4">
        {IconComponent}
      </div>
      <h3 className="text-lg font-semibold text-gray-700 mb-2">{title}</h3>
      <p className="text-gray-500 text-sm max-w-md">{description}</p>
    </div>
  );
};

export default EmptyState;