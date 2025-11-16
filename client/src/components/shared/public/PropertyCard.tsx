import {
  ActionIcon,
  Group,
  Tooltip,
  Modal,
  TextInput,
  Button,
  Divider,
  PasswordInput,
} from "@mantine/core";
import { Link, useNavigate } from "react-router-dom";
import formatAmount, { showNotification } from "../../../utils/helpers";
import { motion } from "framer-motion";
import { IconHeart, IconShare } from "@tabler/icons-react";
import useAuth from "../../../hooks/useAuth";
import { useState } from "react";
import { useDisclosure } from "@mantine/hooks";
import { SocialAuthButtons } from "../../SocailAuthButtons";
import { useLoading } from "../../../hooks/useLoading";
import { LoadingSpinner } from "../../LoadingSpinner";
import { loginApi, verifyEmailApi } from "../../../apis/authApi";
import { jwtDecode } from "jwt-decode";
import { useUser } from "../../../context/UserContext";

const PropertyCard = ({ propertyData }: { propertyData: Property }) => {
  const { isAuthenticated, isTenant } = useAuth();
  const [opened, { open, close }] = useDisclosure(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isFavorite, setIsFavorite] = useState(false);
  const { loading, startLoading, stopLoading } = useLoading();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const { login } = useUser();
  const [
    verificationModalOpen,
    { open: openVerificationModal, close: closeVerificationModal },
  ] = useDisclosure(false);
  const [verificationCode, setVerificationCode] = useState("");
  const navigate = useNavigate();

  const handleFavoriteClick = (event: React.MouseEvent) => {
    event.preventDefault();

    if (!isAuthenticated) {
      open();
      return;
    }

    if (!isTenant) {
      // Show error that only tenants can favorite
      return;
    }

    // Toggle favorite state and make API request
    setIsFavorite(!isFavorite);
    toggleFavorite(propertyData.id);
  };

  const toggleFavorite = async (propertyId: string) => {
    try {
      const response = await fetch("/api/favorites", {
        method: isFavorite ? "DELETE" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ propertyId }),
      });

      if (!response.ok) {
        throw new Error("Failed to update favorite");
      }
    } catch (error) {
      console.error("Error:", error);
      setIsFavorite(!isFavorite); // Revert on error
    }
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    startLoading();
    setErrorMsg("");

    e.preventDefault();

    try {
      const response = await loginApi({ email, password });
      const { accessToken, is_email_verified, is_onboarded } = response;

      const decoded: any = jwtDecode(accessToken);
      const { role } = decoded;

      login(accessToken, role);

      if (!is_email_verified) {
        navigate("/auth/email/verify");
        return;
      }

      if (!is_onboarded) {
        navigate("/onboarding/welcome");
        return;
      }

      // If verified, proceed with favoriting
      setIsFavorite(true);
      await toggleFavorite(propertyData.id);
      close();
    } catch (error: any) {
      setErrorMsg(error?.response?.data?.message);
    } finally {
      stopLoading();
    }
  };

  const handleVerifyCode = async () => {
    startLoading();
    try {
      // Call your verification API
      await verifyEmailApi(email, verificationCode);

      // If successful:
      closeVerificationModal();
      setIsFavorite(true);
      await toggleFavorite(propertyData.id);
    } catch (error) {
      setErrorMsg("Invalid verification code");
    } finally {
      stopLoading();
    }
  };

  const resendVerificationCode = async (email: string) => {
    try {
      // await ({ email });
      showNotification(
        "success",
        "Code resent!",
        "Check your email for the new code"
      );
    } catch (error) {
      showNotification("error", "Code resent failed!", "Failed to resend code");
    }
  };

  return (
    <motion.div
      className="group relative w-full overflow-hidden rounded-2xl bg-white border border-gray-200 hover:border-primary/30 transition-all duration-300 h-full flex flex-col"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      {/* Image Section */}
      <Link
        to={`/property/${propertyData.id}`}
        className="relative block overflow-hidden"
      >
        <div className="relative h-64 overflow-hidden">
          <img
            src={propertyData.cover_image}
            alt={propertyData.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-300"></div>

          {/* Status Badge */}
          {propertyData.verification_status === "verified" && (
            <div className="absolute top-4 left-4 bg-green-500 text-white px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1 shadow-lg">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              Verified
            </div>
          )}

          {/* Action Buttons */}
          <div className="absolute top-4 right-4 flex gap-2">
            <Tooltip label="Share listing">
              <ActionIcon
                size="lg"
                onClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                }}
                className="bg-white/90 backdrop-blur-sm hover:bg-white shadow-lg"
                radius="xl"
              >
                <IconShare size={18} className="text-gray-700" />
              </ActionIcon>
            </Tooltip>

            <Tooltip
              label={isFavorite ? "Remove from favorites" : "Add to favorites"}
            >
              <ActionIcon
                size="lg"
                onClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  handleFavoriteClick(event);
                }}
                className={`${
                  isFavorite
                    ? "bg-red-500 hover:bg-red-600"
                    : "bg-white/90 backdrop-blur-sm hover:bg-white"
                } shadow-lg`}
                radius="xl"
              >
                <IconHeart
                  size={18}
                  className={isFavorite ? "text-white" : "text-gray-700"}
                  fill={isFavorite ? "currentColor" : "none"}
                />
              </ActionIcon>
            </Tooltip>
          </div>

          {/* Price Tag */}
          <div className="absolute bottom-4 left-4 bg-white rounded-lg px-3 py-1.5 shadow-lg">
            <div className="flex items-baseline gap-1">
              <span className="text-lg font-bold text-primary">
                ₦{formatAmount(propertyData.rent_amount)}
              </span>
              <span className="text-xs text-gray-500">/month</span>
            </div>
          </div>
        </div>
      </Link>

      {/* Content Section */}
      <div className="p-5 flex-1 flex flex-col">
        <Link to={`/property/${propertyData.id}`} className="no-underline">
          <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-1 group-hover:text-primary transition-colors">
            {propertyData.name}
          </h3>
          <div className="flex items-start gap-2 mb-4">
            <svg
              className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <span className="text-sm text-gray-600 line-clamp-2">
              {propertyData.address}, {propertyData.city}
            </span>
          </div>
        </Link>

        {/* Features Grid */}
        <div className="grid grid-cols-3 gap-3 py-4 border-t border-gray-100">
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1 text-primary mb-1">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
              </svg>
              <span className="font-bold text-gray-900">
                {propertyData.bedrooms}
              </span>
            </div>
            <span className="text-xs text-gray-500">Bedrooms</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1 text-primary mb-1">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="font-bold text-gray-900">
                {propertyData.bathrooms}
              </span>
            </div>
            <span className="text-xs text-gray-500">Bathrooms</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1 text-primary mb-1">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
              </svg>
              <span className="font-bold text-gray-900">
                {formatAmount(propertyData.size_sqft)}
              </span>
            </div>
            <span className="text-xs text-gray-500">Sq Ft</span>
          </div>
        </div>

        {/* Additional Features */}
        <div className="flex flex-wrap gap-2 mt-auto pt-4 border-t border-gray-100">
          {propertyData.furnished && propertyData.furnished !== "no" && (
            <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-medium">
              Furnished
            </span>
          )}
          {propertyData.p && propertyData.pets === "allowed" && (
            <span className="px-3 py-1 bg-green-50 text-green-600 rounded-full text-xs font-medium">
              Pets Allowed
            </span>
          )}
          {propertyData.parking_spaces > 0 && (
            <span className="px-3 py-1 bg-purple-50 text-purple-600 rounded-full text-xs font-medium">
              {propertyData.parking_spaces} Parking
            </span>
          )}
        </div>
      </div>

      {/* Login Modal */}
      <Modal
        opened={opened}
        onClose={close}
        title="Favorite this listing"
        centered
        padding={25}
      >
        <form className="space-y-4" onSubmit={handleLogin}>
          <SocialAuthButtons authType="login" />
          <TextInput
            label="Email"
            placeholder="email@example.com"
            value={email}
            onChange={(e) => setEmail(e.currentTarget.value)}
            required
          />
          <PasswordInput
            label="Password"
            type="password"
            placeholder="Your password"
            value={password}
            onChange={(e) => setPassword(e.currentTarget.value)}
            required
          />
          <Button fullWidth type="submit" color="#290665" loading={loading}>
            Login
          </Button>
          <div className="text-center text-sm">
            Don't have an account?{" "}
            <Link to="/register" className="text-primary hover:underline">
              Sign up
            </Link>
          </div>
        </form>
      </Modal>

      <Modal
        opened={verificationModalOpen}
        onClose={closeVerificationModal}
        title={<h1 className="text-2xl font-bold">Verify Your Email</h1>}
        centered
        padding={25}
      >
        <div className="space-y-4">
          <TextInput
            label="Verification Code"
            placeholder="Enter 6-digit code"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.currentTarget.value)}
            required
          />
          <Button
            fullWidth
            onClick={handleVerifyCode}
            color="#290665"
            loading={loading}
          >
            Verify Code
          </Button>
          <div className="text-center text-sm">
            Didn't receive code?{" "}
            <button
              className="text-primary hover:underline"
              onClick={async () => {
                await resendVerificationCode(email);
                // Show toast message
              }}
            >
              Resend code
            </button>
          </div>
        </div>
      </Modal>
    </motion.div>
  );
};

export default PropertyCard;
