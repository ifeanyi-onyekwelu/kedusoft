import React from "react";

interface EmptyStateProps {
  children: React.ReactNode;
}

const EmptyState: React.FC<EmptyStateProps> = ({ children }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-fit text-center p-5 bg-gray-100">
      <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center mb-4">
        <img
          src="/images/empty-state.jpg"
          alt="Empty State"
          className="w-full h-full object-cover rounded-full"
        />
      </div>
      {children}
    </div>
  );
};

export default EmptyState;
