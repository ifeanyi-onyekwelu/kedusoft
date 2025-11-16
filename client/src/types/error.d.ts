interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
  loading: boolean;
}
