import { Divider, Group } from "@mantine/core";
import { GoogleButton } from "./buttons/GoogleButton";
import { AppleButton } from "./buttons/AppleButton";
import { gapi } from "gapi-script";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useAuthOperations } from "../apis/authApi";
import { useUser } from "../context/UserContext";

interface SocialAuthButtonsProps {
  authType: "login" | "signup";
}

export function SocialAuthButtons({ authType }: SocialAuthButtonsProps) {
  const navigate = useNavigate();
  const clientId =
    "934996510684-hnpm51g4fl1mbpi0fpr43frfp8u1865n.apps.googleusercontent.com";
  const { login } = useUser();
  const { googleLogin, googleSignup, appleLogin, appleSignup } =
    useAuthOperations();

  const initializeGoogleAuth = () => {
    gapi.load("auth2", () => {
      gapi.auth2.init({
        client_id: clientId,
        scope: "profile email",
      });
    });
  };

  useEffect(() => {
    initializeGoogleAuth();
  }, []);

  const handleGoogleSuccess = async (googleUser: any) => {
    try {
      const token = googleUser.getAuthResponse().id_token;

      let res;
      if (authType === "login") {
        res = await googleLogin(token);
      } else {
        res = await googleSignup(token);
      }

      login(res.accessToken, res.user.role);

      // Redirect based on onboarding status if login
      if (authType === "login") {
        navigate(res.is_onboarded ? "/tenants" : "/onboarding/welcome");
      } else {
        navigate("/onboarding/welcome");
      }
    } catch (error: any) {
      console.log("Error occurred during login!", error);
    }
  };

  const handleGoogleFailure = (error: any) => {
    console.log("Error occurred during login", error);
  };

  const handleAppleClick = async () => {
    try {
      // Apple Sign-In implementation using Apple's JS SDK
      console.log("Initiating Apple Sign-In...");

      // Check if Apple Sign-In is available
      if (typeof window !== "undefined" && (window as any).AppleID) {
        const appleAuthConfig = {
          clientId: "your-apple-service-id", // Replace with your Apple Service ID
          scope: "name email",
          redirectURI: window.location.origin,
          state: "apple-signin",
          nonce: Math.random().toString(36).substring(2, 15),
          usePopup: true,
        };

        const appleResponse = await (window as any).AppleID.auth.signIn(
          appleAuthConfig
        );
        const token = appleResponse.authorization.id_token;

        let res;
        if (authType === "login") {
          res = await appleLogin(token);
        } else {
          res = await appleSignup(token);
        }

        login(res.accessToken, res.user.role);

        // Redirect based on onboarding status if login
        if (authType === "login") {
          navigate(res.is_onboarded ? "/tenants" : "/onboarding/welcome");
        } else {
          navigate("/onboarding/welcome");
        }
      } else {
        console.log(
          "Apple Sign-In SDK not loaded. Please include the Apple JS SDK."
        );
        // Fallback: Show message to user or redirect to manual signin
        alert(
          "Apple Sign-In is currently unavailable. Please use Google or email signup."
        );
      }
    } catch (error: any) {
      console.log("Error occurred during Apple login!", error);
      // Handle specific Apple Sign-In errors
      if (error.error === "popup_closed_by_user") {
        console.log("User cancelled Apple Sign-In");
      } else {
        console.log("Apple Sign-In error:", error);
      }
    }
  };

  const handleGoogleClick = () => {
    const auth2 = gapi.auth2.getAuthInstance();

    auth2.signIn().then(
      (googleUser: any) => handleGoogleSuccess(googleUser),
      (error: any) => handleGoogleFailure(error)
    );
  };

  return (
    <>
      <Group grow mb="md" mt="md">
        <GoogleButton radius="xl" onClick={handleGoogleClick}>
          Google
        </GoogleButton>
        <AppleButton radius="xl" onClick={handleAppleClick}>
          Apple
        </AppleButton>
      </Group>

      <Divider label={`Or continue with`} labelPosition="center" my="lg" />
    </>
  );
}
