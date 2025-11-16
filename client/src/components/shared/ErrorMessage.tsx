import { IconAlertCircle } from "@tabler/icons-react";
import { Button } from "@mantine/core";

interface ErrorMessageProps {
  message: string;
  className?: string;
  onRetry?: () => void;
  retryLabel?: string;
  description?: string;
}

export function ErrorMessage({
  message,
  className = "",
  onRetry,
  retryLabel = "Retry",
  description = "We couldn't load the requested data. Please try again.",
}: ErrorMessageProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center p-8 text-center ${className}`}
    >
      <IconAlertCircle size={48} className="text-red-500 mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">{message}</h3>
      {description && <p className="text-gray-600 mb-4">{description}</p>}
      {onRetry && (
        <Button variant="outline" onClick={onRetry} className="mt-4">
          {retryLabel}
        </Button>
      )}
    </div>
  );
}
