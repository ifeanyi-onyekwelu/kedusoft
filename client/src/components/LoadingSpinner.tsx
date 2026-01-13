import React from "react";

interface BrandedLoaderProps {
  fullScreen?: boolean;
  label?: string;
  inDashboard?: boolean; // Better naming
}

export function BrandedLoader({
                                fullScreen = true,
                                label = "Opening the doors",
                                inDashboard = false
                              }: BrandedLoaderProps) {
  return (
      <div
          className={`${
              inDashboard
                  ? "fixed top-[60px] left-0 md:left-[260px] right-0 bottom-0"
                  : fullScreen
                      ? "fixed inset-0"
                      : "w-full py-12"
          } flex items-center justify-center bg-white z-40`} // z-40 instead of z-50
      >
        <div className="flex flex-col items-center max-w-6xl px-6">
          {/* Step 1: Soft Logo Animation */}
          <div className="relative mb-8 animate-pulse transition-transform duration-1000 ease-in-out hover:scale-105">
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
                style={{ width: "40%" }}
            />
          </div>

          {/* Step 3: Subtle Status Text */}
          <span className="mt-4 text-xs uppercase tracking-[0.2em] text-gray-400 font-semibold text-center">
          {label}
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