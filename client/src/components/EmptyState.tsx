// EmptyState.tsx
import React from "react";

interface EmptyStateProps {
  children: React.ReactNode;
}

const EmptyState: React.FC<EmptyStateProps> = ({ children }) => {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 bg-white border border-dashed border-slate-200 rounded-[32px]">
      {children}
    </div>
  );
};

export default EmptyState;
