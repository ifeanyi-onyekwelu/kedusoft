import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { MantineProvider } from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
import "@mantine/core/styles.css";
import "@mantine/carousel/styles.css";
import { UserProvider } from "./context/UserContext.tsx";
import { NavigationProgress } from "@mantine/nprogress";
import { OnboardingProvider } from "./context/OnboardingContext.tsx";
import { GoogleOAuthProvider } from "@react-oauth/google";

const clientId = import.meta.env.VITE_GOOGLE_OAUTH_CLIENT_ID;

// Log for debugging (remove in production if needed)
if (!clientId) {
  console.warn(
    "⚠️ Google OAuth Client ID not found. Social authentication will not work. " +
      "Make sure VITE_GOOGLE_OAUTH_CLIENT_ID is set in your environment variables."
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <MantineProvider>
      <GoogleOAuthProvider clientId={clientId || "dummy-client-id"}>
        <ModalsProvider>
          <UserProvider>
            <OnboardingProvider>
              <NavigationProgress />
              <App />
            </OnboardingProvider>
          </UserProvider>
        </ModalsProvider>
      </GoogleOAuthProvider>
    </MantineProvider>
  </StrictMode>
);
