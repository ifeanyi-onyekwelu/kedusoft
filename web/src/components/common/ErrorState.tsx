import { IconAlertCircle } from "@tabler/icons-react";
import { Button } from "@mantine/core";

export function ErrorState({ message, loading, onRetry }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center min-h-full">
      <div className="text-red-500 text-6xl mb-4">⚠️</div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">{message}</h3>
      <p className="text-gray-600 mb-4">
        We couldn't load the tenant details. Please try again.
      </p>
      {onRetry && (
        <Button
          variant="outline"
          onClick={onRetry}
          className="mt-4"
          loading={loading}
        >
          Retry
        </Button>
      )}
    </div>
  );
}
