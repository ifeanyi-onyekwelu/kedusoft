import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../../context/UserContext";
import {
  IconCheck,
  IconHome,
  IconUsers,
  IconKey,
  IconSparkles,
} from "@tabler/icons-react";

interface Step {
  icon: typeof IconCheck;
  label: string;
  duration: number;
}

export default function CompletionPage() {
  const navigate = useNavigate();
  const { user } = useUser();
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const isLandlord = user?.role === "landlord";

  const tenantSteps: Step[] = [
    { icon: IconHome, label: "Setting up your profile", duration: 1000 },
    { icon: IconKey, label: "Preparing property matches", duration: 1200 },
    { icon: IconUsers, label: "Connecting with landlords", duration: 1000 },
    { icon: IconSparkles, label: "Finalizing your dashboard", duration: 800 },
  ];

  const landlordSteps: Step[] = [
    { icon: IconHome, label: "Setting up your profile", duration: 1000 },
    { icon: IconKey, label: "Preparing your dashboard", duration: 1200 },
    { icon: IconUsers, label: "Setting up tenant management", duration: 1000 },
    { icon: IconSparkles, label: "Almost ready...", duration: 800 },
  ];

  const steps = isLandlord ? landlordSteps : tenantSteps;

  useEffect(() => {
    if (currentStep >= steps.length) {
      // All steps completed, redirect to dashboard
      const redirectPath = isLandlord ? "/property-owner" : "/tenant-dashboard";
      setTimeout(() => {
        navigate(redirectPath);
      }, 500);
      return;
    }

    const timer = setTimeout(() => {
      setCompletedSteps((prev) => [...prev, currentStep]);
      setCurrentStep((prev) => prev + 1);
    }, steps[currentStep].duration);

    return () => clearTimeout(timer);
  }, [currentStep, steps, navigate, isLandlord]);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        {/* Success Icon */}
        <div className="mb-8 flex justify-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
            <IconCheck size={40} className="text-green-600" strokeWidth={2.5} />
          </div>
        </div>

        {/* Main Message */}
        <h1 className="text-3xl font-bold text-gray-900 mb-3">
          Welcome Aboard! 🎉
        </h1>
        <p className="text-gray-600 mb-12">
          We're setting up everything for you...
        </p>

        {/* Progress Steps */}
        <div className="space-y-4">
          {steps.map((step, index) => {
            const isCompleted = completedSteps.includes(index);
            const isCurrent = currentStep === index;
            const StepIcon = step.icon;

            return (
              <div
                key={index}
                className={`flex items-center gap-4 p-4 rounded-lg border-2 transition-all duration-300 ${
                  isCompleted
                    ? "border-green-500 bg-green-50"
                    : isCurrent
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 bg-gray-50"
                }`}
              >
                {/* Icon */}
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${
                    isCompleted
                      ? "bg-green-500"
                      : isCurrent
                      ? "bg-blue-500"
                      : "bg-gray-300"
                  }`}
                >
                  {isCompleted ? (
                    <IconCheck size={20} className="text-white" />
                  ) : (
                    <StepIcon
                      size={20}
                      className={isCurrent ? "text-white" : "text-gray-500"}
                    />
                  )}
                </div>

                {/* Label */}
                <div className="flex-1 text-left">
                  <p
                    className={`font-medium transition-colors ${
                      isCompleted
                        ? "text-green-700"
                        : isCurrent
                        ? "text-blue-700"
                        : "text-gray-500"
                    }`}
                  >
                    {step.label}
                  </p>
                </div>

                {/* Loading Spinner for Current */}
                {isCurrent && (
                  <div className="flex-shrink-0">
                    <div className="w-5 h-5 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
                  </div>
                )}

                {/* Checkmark for Completed */}
                {isCompleted && (
                  <div className="flex-shrink-0">
                    <IconCheck size={20} className="text-green-600" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Progress Bar */}
        <div className="mt-8">
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-600 transition-all duration-500 ease-out"
              style={{
                width: `${(completedSteps.length / steps.length) * 100}%`,
              }}
            />
          </div>
          <p className="text-sm text-gray-500 mt-2">
            {completedSteps.length} of {steps.length} steps completed
          </p>
        </div>
      </div>
    </div>
  );
}
