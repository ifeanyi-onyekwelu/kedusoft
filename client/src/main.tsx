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

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <MantineProvider>
      <GoogleOAuthProvider clientId={clientId}>
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
