function ProgressBar({ step, total = 6 }: { step: number; total?: number }) {
  const width = `${(step / total) * 100}%`;
  return (
    <div className="w-3/4 flex flex-col items-center my-6">
      {/* Progress bar container */}
      <div className="relative w-full h-4 bg-gradient-to-r from-indigo-200 via-purple-200 to-pink-200 rounded-full shadow-inner">
        {/* Progress indicator */}
        <div
          className="absolute left-0 top-0 h-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full shadow-lg transition-all duration-700"
          style={{ width }}
        />
        {/* Step markers */}
        <div className="absolute inset-0 flex justify-between items-center px-1">
          {Array.from({ length: total }).map((_, idx) => (
            <div
              key={idx}
              className={`w-4 h-4 rounded-full border-2 ${
                idx + 1 <= step
                  ? "bg-gradient-to-br from-indigo-500 to-pink-500 border-white shadow"
                  : "bg-white border-gray-300"
              } transition-all duration-500`}
              style={{ zIndex: 2 }}
            />
          ))}
        </div>
      </div>
      {/* Step text */}
      <div className="flex justify-between w-full mt-2 px-1 text-xs font-medium text-gray-500">
        <span>
          Step {step} of {total}
        </span>
        <span>{Math.round((step / total) * 100)}%</span>
      </div>
    </div>
  );
}

export default ProgressBar;
