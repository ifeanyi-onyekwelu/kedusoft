import { useState, FormEvent, useRef, KeyboardEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { IconArrowLeft, IconMail } from "@tabler/icons-react";
import { BrandedLoader } from "../../components/LoadingSpinner";
import { useAuthOperations } from "../../apis/authApi";
import { useUser } from "../../context/UserContext";
import { useLoading } from "../../hooks/useLoading";

function VerifyEmail() {
  const [errorMsg, setErrorMsg] = useState<string>("");
  const { loading, withLoading } = useLoading();
  const [pin, setPin] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const { user, refreshUser } = useUser();
  const navigate = useNavigate();
  const { verifyEmail } = useAuthOperations();

  type Role = "tenant" | "landlord" | "admin";

  const navigateBasedOnRole = (role: Role) => {
    // After email verification, redirect to role-specific onboarding
    const routes = {
      tenant: "/onboarding/tenant/welcome",
      landlord: "/onboarding/landlord/welcome",
      admin: "/admin",
    };
    navigate((routes[role] as string) || "/");
  };

  const handlePinChange = (index: number, value: string) => {
    // Only allow numbers
    if (value && !/^\d$/.test(value)) return;

    const newPin = [...pin];
    newPin[index] = value;
    setPin(newPin);

    if (errorMsg) setErrorMsg("");

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !pin[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6);
    if (!/^\d+$/.test(pastedData)) return;

    const newPin = [...pin];
    for (let i = 0; i < pastedData.length; i++) {
      newPin[i] = pastedData[i];
    }
    setPin(newPin);

    // Focus last filled input
    const lastIndex = Math.min(pastedData.length, 5);
    inputRefs.current[lastIndex]?.focus();
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    const code = pin.join("");
    if (code.length !== 6) {
      setErrorMsg("Please enter the complete 6-digit code");
      return;
    }

    try {
      await withLoading(verifyEmail(user?.email!, code));
      await refreshUser();
      navigateBasedOnRole(user?.role as Role);
    } catch (error: any) {
      setErrorMsg(error?.message || "Verification failed. Please try again.");
      // Clear pin on error
      setPin(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    }
  };

  const handleResend = () => {
    setErrorMsg("");
    alert(
      "Please check your email or contact support if you didn't receive the code."
    );
  };

  if (loading) {
    return <BrandedLoader fullScreen />;
  }

  return (
    <div className="w-full">
      <div className="mb-8 text-center">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <IconMail size={32} className="text-blue-600" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Verify your email
        </h2>
        <p className="text-gray-600">We sent a verification code to</p>
        <p className="text-gray-900 font-semibold mt-1">
          {user?.email || "your email"}
        </p>
      </div>

      {errorMsg && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-800">{errorMsg}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* PIN Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3 text-center">
            Enter 6-digit code
          </label>
          <div className="flex gap-2 justify-center" onPaste={handlePaste}>
            {pin.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handlePinChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-12 h-14 text-center text-2xl font-bold border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                autoFocus={index === 0}
              />
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || pin.join("").length !== 6}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Verify Email
        </button>

        {/* Resend Code */}
        <div className="text-center">
          <p className="text-sm text-gray-600 mb-2">Didn't receive the code?</p>
          <button
            type="button"
            onClick={handleResend}
            disabled={loading}
            className="text-sm text-blue-600 hover:text-blue-700 font-semibold transition-colors disabled:opacity-50"
          >
            Resend Code
          </button>
        </div>

        {/* Back Link */}
        <div className="pt-4 border-t border-gray-200">
          <Link
            to="/auth/login"
            className="flex items-center justify-center gap-2 text-gray-600 hover:text-blue-600 transition-colors font-medium"
          >
            <IconArrowLeft size={18} />
            <span>Back to login</span>
          </Link>
        </div>
      </form>

      {/* Help Text */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-800 font-medium mb-1">
          Can't find the email?
        </p>
        <ul className="text-xs text-blue-700 space-y-1">
          <li>• Check your spam or junk folder</li>
          <li>• Make sure {user?.email} is correct</li>
          <li>• Wait a few minutes for the email to arrive</li>
        </ul>
      </div>
    </div>
  );
}

export default VerifyEmail;
