import { Divider, Group, Alert } from "@mantine/core";
import { GoogleButton } from "./buttons/GoogleButton";
import { AppleButton } from "./buttons/AppleButton";
import { useNavigate } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import { useAuthOperations } from "../apis/authApi";
import { useUser } from "../context/UserContext";
import { toast } from "react-hot-toast";
import { IconAlertCircle } from "@tabler/icons-react";

interface SocialAuthButtonsProps {
  authType: "login" | "signup";
  role?: string; // Optional role passed from the Signup page
}

export function SocialAuthButtons({ authType, role }: SocialAuthButtonsProps) {
  const navigate = useNavigate();
  const { login } = useUser();
  const { googleLogin, googleSignup } = useAuthOperations();

  // Check if Google Client ID is available
  const googleClientIdAvailable = !!(
    import.meta.env.VITE_GOOGLE_OAUTH_CLIENT_ID ||
    (window as any).__GOOGLE_CLIENT_ID__
  );

  const handleGoogleLoginTrigger = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const token = tokenResponse.access_token;
        let res;

        if (authType === "login") {
          res = await googleLogin(token);
          toast.success("Logged in successfully");
        } else {
          // Pass the role (tenant/landlord) to the backend for signup
          res = await googleSignup(token, role || "tenant");
          toast.success("Welcome to Letsten!");
        }

        login(res.accessToken, res.user.role);

        // Navigation logic
        if (authType === "login") {
          navigate(res.is_onboarded ? "/tenants" : "/onboarding/welcome");
        } else {
          navigate("/onboarding/welcome");
        }
      } catch (error: any) {
        console.log("Full Error Object:", error); // Debugging

        // Axios usually puts the backend response in error.response
        const status = error.response?.status;

        // Try to find the message in different places depending on your API structure
        const message =
          error.response?.data?.message || error.message || "An error occurred";

        if (status === 404) {
          toast.error("Account not found. Redirecting to signup...");
          setTimeout(() => navigate("/auth/register"), 2000); // Give user time to read toast
        } else if (status === 409) {
          toast.error("You already have an account. Please sign in.");
          navigate("/auth/login");
        } else {
          toast.error(message);
        }
      }
    },
    onError: (error) => {
      console.error("Google Login Error:", error);
      toast.error("Failed to connect to Google. Please try again.");
    },
  });

  if (!googleClientIdAvailable) {
    return (
      <Alert
        icon={<IconAlertCircle size={16} />}
        title="Social Login Unavailable"
        color="yellow"
        mb="md"
      >
        Google authentication is not configured. Please use email and password
        to sign {authType === "login" ? "in" : "up"}.
      </Alert>
    );
  }

  return (
    <>
      <Group grow mb="md" mt="md">
        <GoogleButton radius="xl" onClick={() => handleGoogleLoginTrigger()}>
          Google
        </GoogleButton>
        <AppleButton radius="xl" onClick={() => {}}>
          Apple
        </AppleButton>
      </Group>
      <Divider label="Or continue with" labelPosition="center" my="lg" />
    </>
  );
}
