import { useState, FormEvent } from "react";
import { Link } from "react-router-dom";
import { forgotPasswordApi } from "../../apis/authApi";
import { IconAt, IconArrowLeft, IconCheck } from "@tabler/icons-react";
import { useLoading } from "../../hooks/useLoading";
import { BrandedLoader } from "../../components/LoadingSpinner";

function ForgotPassword() {
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [successMsg, setSuccessMsg] = useState<string>("");
  const { loading, withLoading } = useLoading();
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");

  const validateEmail = (email: string) => {
    return /^\S+@\S+\.\S+$/.test(email);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");
    setEmailError("");

    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address");
      return;
    }

    try {
      await withLoading(forgotPasswordApi({ email }));
      setSuccessMsg(
        "Password reset link has been sent to your email. Please check your inbox and spam folder."
      );
      setEmail("");
    } catch (error: any) {
      setErrorMsg(
        error?.message || "Failed to send reset link. Please try again."
      );
    }
  };

  if (loading) {
    return <BrandedLoader fullScreen label="Sending reset link..." />;
  }

  return (
    <div className="w-full">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Forgot password?
        </h2>
        <p className="text-gray-600">
          No worries! Enter your email and we'll send you reset instructions.
        </p>
      </div>

      {successMsg ? (
        <div className="space-y-6">
          {/* Success State */}
          <div className="p-6 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <IconCheck size={20} className="text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-green-900 mb-1">
                  Email Sent!
                </h3>
                <p className="text-sm text-green-800">{successMsg}</p>
              </div>
            </div>
          </div>

          {/* Helpful Tips */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-2">
              Didn't receive the email?
            </h4>
            <ul className="space-y-1 text-sm text-blue-800">
              <li>• Check your spam or junk folder</li>
              <li>• Make sure you entered the correct email</li>
              <li>• Wait a few minutes and check again</li>
            </ul>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => {
                setSuccessMsg("");
                setErrorMsg("");
              }}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
            >
              Try Different Email
            </button>
            <Link
              to="/auth/login"
              className="flex-1 px-4 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors text-center"
            >
              Back to Login
            </Link>
          </div>
        </div>
      ) : (
        <>
          {errorMsg && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-800">{errorMsg}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Input */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <IconAt size={20} className="text-gray-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (emailError) setEmailError("");
                    if (errorMsg) setErrorMsg("");
                  }}
                  className={`w-full pl-10 pr-4 py-3 border ${
                    emailError ? "border-red-300" : "border-gray-300"
                  } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors`}
                  placeholder="you@example.com"
                  autoFocus
                />
              </div>
              {emailError && (
                <p className="mt-1 text-sm text-red-600">{emailError}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Send Reset Link
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
        </>
      )}
    </div>
  );
}

export default ForgotPassword;
