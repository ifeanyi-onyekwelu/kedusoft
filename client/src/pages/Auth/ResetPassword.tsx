import { useState, useEffect, FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { resetPasswordApi, verifyResetTokenApi } from "../../apis/authApi";
import {
  IconLock,
  IconEye,
  IconEyeOff,
  IconArrowLeft,
  IconAlertCircle,
  IconCheck,
} from "@tabler/icons-react";
import { useLoading } from "../../hooks/useLoading";
import { BrandedLoader } from "../../components/LoadingSpinner";

function ResetPassword() {
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(window.location.search);
  const token = queryParams.get("token");

  const [errorMsg, setErrorMsg] = useState<string>("");
  const [isTokenValid, setIsTokenValid] = useState<boolean | null>(null);
  const [showPassword1, setShowPassword1] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);
  const { loading, withLoading } = useLoading();

  const [formData, setFormData] = useState({
    password1: "",
    password2: "",
  });

  const [errors, setErrors] = useState({
    password1: "",
    password2: "",
  });

  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setIsTokenValid(false);
        setErrorMsg("No reset token provided.");
        return;
      }

      try {
        await verifyResetTokenApi({ token });
        setIsTokenValid(true);
      } catch (error) {
        setIsTokenValid(false);
        setErrorMsg(
          "This password reset link is invalid or has expired. Please request a new one."
        );
      }
    };

    verifyToken();
  }, [token]);

  const validatePassword = (password: string) => {
    const passwordRegex =
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{6,}$/;
    return passwordRegex.test(password);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
    if (errorMsg) setErrorMsg("");
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    // Validate
    const newErrors = {
      password1: !validatePassword(formData.password1)
        ? "Password must be 6+ characters with uppercase, lowercase, number, and symbol"
        : "",
      password2:
        formData.password1 !== formData.password2
          ? "Passwords do not match"
          : "",
    };

    setErrors(newErrors);

    if (Object.values(newErrors).some((error) => error)) {
      return;
    }

    try {
      await withLoading(
        resetPasswordApi({
          password: formData.password1,
          token: token || "",
        })
      );
      setSuccessMsg(true);
      setTimeout(() => {
        navigate("/auth/login");
      }, 3000);
    } catch (error: any) {
      setErrorMsg(
        error?.message || "Failed to reset password. Please try again."
      );
    }
  };

  // Loading state
  if (isTokenValid === null) {
    return <BrandedLoader fullScreen label="Verifying reset link..." />;
  }

  // Invalid token state
  if (isTokenValid === false) {
    return (
      <div className="w-full">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-red-600 mb-2">
            Invalid Reset Link
          </h2>
        </div>

        <div className="p-6 bg-red-50 border border-red-200 rounded-lg mb-6">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
              <IconAlertCircle size={20} className="text-red-600" />
            </div>
            <div>
              <h3 className="font-semibold text-red-900 mb-1">
                Link Expired or Invalid
              </h3>
              <p className="text-sm text-red-800">{errorMsg}</p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <Link
            to="/auth/forgot-password"
            className="block w-full px-4 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors text-center"
          >
            Request New Reset Link
          </Link>
          <Link
            to="/auth/login"
            className="flex items-center justify-center gap-2 text-gray-600 hover:text-blue-600 transition-colors font-medium"
          >
            <IconArrowLeft size={18} />
            <span>Back to login</span>
          </Link>
        </div>
      </div>
    );
  }

  // Success state
  if (successMsg) {
    return (
      <div className="w-full">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-green-600 mb-2">
            Password Reset Successfully!
          </h2>
        </div>

        <div className="p-6 bg-green-50 border border-green-200 rounded-lg mb-6">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
              <IconCheck size={20} className="text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-green-900 mb-1">All Set!</h3>
              <p className="text-sm text-green-800">
                Your password has been changed successfully. Redirecting you to
                login...
              </p>
            </div>
          </div>
        </div>

        <Link
          to="/auth/login"
          className="block w-full px-4 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors text-center"
        >
          Continue to Login
        </Link>
      </div>
    );
  }

  if (loading) {
    return <BrandedLoader fullScreen label="Resetting password..." />;
  }

  // Reset form
  return (
    <div className="w-full">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Create new password
        </h2>
        <p className="text-gray-600">
          Your new password must be different from previously used passwords.
        </p>
      </div>

      {errorMsg && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-800">{errorMsg}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* New Password */}
        <div>
          <label
            htmlFor="password1"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            New Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <IconLock size={20} className="text-gray-400" />
            </div>
            <input
              id="password1"
              type={showPassword1 ? "text" : "password"}
              value={formData.password1}
              onChange={(e) => handleInputChange("password1", e.target.value)}
              className={`w-full pl-10 pr-12 py-3 border ${
                errors.password1 ? "border-red-300" : "border-gray-300"
              } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors`}
              placeholder="Create a strong password"
              autoFocus
            />
            <button
              type="button"
              onClick={() => setShowPassword1(!showPassword1)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              {showPassword1 ? (
                <IconEyeOff
                  size={20}
                  className="text-gray-400 hover:text-gray-600"
                />
              ) : (
                <IconEye
                  size={20}
                  className="text-gray-400 hover:text-gray-600"
                />
              )}
            </button>
          </div>
          {errors.password1 && (
            <p className="mt-1 text-sm text-red-600">{errors.password1}</p>
          )}
          <p className="mt-1 text-xs text-gray-500">
            Must be at least 6 characters with uppercase, lowercase, number, and
            symbol
          </p>
        </div>

        {/* Confirm Password */}
        <div>
          <label
            htmlFor="password2"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Confirm New Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <IconLock size={20} className="text-gray-400" />
            </div>
            <input
              id="password2"
              type={showPassword2 ? "text" : "password"}
              value={formData.password2}
              onChange={(e) => handleInputChange("password2", e.target.value)}
              className={`w-full pl-10 pr-12 py-3 border ${
                errors.password2 ? "border-red-300" : "border-gray-300"
              } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors`}
              placeholder="Re-enter your password"
            />
            <button
              type="button"
              onClick={() => setShowPassword2(!showPassword2)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              {showPassword2 ? (
                <IconEyeOff
                  size={20}
                  className="text-gray-400 hover:text-gray-600"
                />
              ) : (
                <IconEye
                  size={20}
                  className="text-gray-400 hover:text-gray-600"
                />
              )}
            </button>
          </div>
          {errors.password2 && (
            <p className="mt-1 text-sm text-red-600">{errors.password2}</p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Reset Password
        </button>

        {/* Back to Login */}
        <Link
          to="/auth/login"
          className="flex items-center justify-center gap-2 text-gray-600 hover:text-blue-600 transition-colors font-medium"
        >
          <IconArrowLeft size={18} />
          <span>Back to login</span>
        </Link>
      </form>
    </div>
  );
}

export default ResetPassword;
