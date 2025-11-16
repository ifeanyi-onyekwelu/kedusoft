import { nprogress } from "@mantine/nprogress";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export function RouterProgress() {
  const location = useLocation();

  useEffect(() => {
    // Start progress bar when route changes
    nprogress.start();

    // Simulate loading time (adjust as needed)
    const timer = setTimeout(() => {
      nprogress.complete();
    }, 800); // Increased from 300ms to make it visible

    return () => {
      clearTimeout(timer);
      nprogress.complete();
    };
  }, [location.pathname]);

  return null;
}
