import PulseLoader from "react-spinners/PulseLoader";

interface LoadingSpinnerProps {
  fullScreen?: boolean;
  color?: string;
  size?: number;
  label?: string;
  loading?: boolean;
}

export function LoadingSpinner({
  fullScreen = false,
  color = "#008CDB",
  size = 15,
  label = "Loading",
  loading = true,
}: LoadingSpinnerProps) {
  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
        <div className="flex flex-col items-center space-y-4">
          <PulseLoader color={color} loading={loading} size={size} />
          <p className="text-sm text-gray-600 font-medium">{label}...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-8">
      <PulseLoader color={color} loading={true} size={size} />
    </div>
  );
}
