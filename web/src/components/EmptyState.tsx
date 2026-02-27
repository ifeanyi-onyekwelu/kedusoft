import React from "react";
import { Box } from "@mantine/core";

interface EmptyStateProps {
  children: React.ReactNode;
}

const EmptyState: React.FC<EmptyStateProps> = ({ children }) => {
  return (
    <Box
      className="flex flex-col items-center justify-center py-24 px-6 relative overflow-hidden"
      style={{
        backgroundColor: "#ffffff",
        border: "2px dashed #e9ecef",
        borderRadius: "40px", // Professional soft rounded corner
      }}
    >
      {/* Subtle background decorative element */}
      <div
        className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(#495057 1px, transparent 1px)`,
          backgroundSize: "20px 20px",
        }}
      />

      <div className="relative z-10 w-full flex flex-col items-center">
        {children}
      </div>
    </Box>
  );
};

export default EmptyState;
