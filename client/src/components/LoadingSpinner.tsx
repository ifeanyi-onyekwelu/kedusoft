import React from "react";

export function BrandedLoader({ fullScreen = true }) {
  return (
    <div
      className={`${
        fullScreen ? "fixed inset-0" : "w-full py-12"
      } flex items-center justify-center bg-white z-50`}
    >
      <div className="flex flex-col items-center max-w-xs w-full px-6">
        {/* Step 1: Soft Logo Animation */}
        <div className="relative mb-8 animate-pulse transition-transform duration-1000 ease-in-out hover:scale-105">
          {/* We use the full logo but keep it centered and clean */}
          <img
            src="/images/brand/logo.png"
            alt="Letsten Logo"
            className="h-12 w-auto object-contain"
          />
        </div>

        {/* Step 2: Minimalist Progress Bar */}
        <div className="w-full h-[2px] bg-gray-100 rounded-full overflow-hidden relative">
          <div
            className="absolute h-full bg-gradient-to-r from-[#008CDB] to-[#FF7676] animate-shimmer"
            style={{ width: "40%" }} // This creates a moving "loading" chunk
          />
        </div>

        {/* Step 3: Subtle Status Text */}
        <span className="mt-4 text-[10px] uppercase tracking-[0.2em] text-gray-400 font-semibold">
          Opening the doors...{" "}
        </span>
      </div>

      <style>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(250%);
          }
        }
        .animate-shimmer {
          animation: shimmer 1.5s infinite cubic-bezier(0.4, 0, 0.2, 1);
        }
      `}</style>
    </div>
  );
}
