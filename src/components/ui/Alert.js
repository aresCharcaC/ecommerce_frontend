import React from 'react';

export const Alert = ({ children, variant = 'default' }) => {
  const variants = {
    default: 'bg-gray-100 border-gray-300 text-gray-900',
    destructive: 'bg-red-100 border-red-300 text-red-900'
  };

  return (
    <div className={`p-4 border rounded-md ${variants[variant]}`}>
      {children}
    </div>
  );
};

export const AlertDescription = ({ children }) => {
  return <div className="text-sm">{children}</div>;
};