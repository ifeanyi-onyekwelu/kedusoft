import { useNavigate } from "react-router-dom";
import { useOnboarding } from "../../../context/OnboardingContext";
import { useState, useRef } from "react";
import { FaIdCard, FaCloudUploadAlt, FaCheckCircle } from "react-icons/fa";

const DOCUMENT_TYPES = [
  {
    id: "national_id",
    label: "National ID",
    description: "Government issued identification",
    required: true,
  },
  {
    id: "driver_license",
    label: "Driver's License",
    description: "Valid driving license",
    required: false,
  },
  {
    id: "passport",
    label: "Passport",
    description: "International passport",
    required: false,
  },
  {
    id: "proof_of_income",
    label: "Proof of Income",
    description: "Salary slips or bank statements",
    required: true,
  },
  {
    id: "utility_bill",
    label: "Utility Bill",
    description: "Proof of address",
    required: true,
  },
];

export default function VerificationPage() {
  const navigate = useNavigate();
  const { updatePreference } = useOnboarding();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [uploadedDocs, setUploadedDocs] = useState<{ [key: string]: File }>({});
  const [uploadProgress, setUploadProgress] = useState<{
    [key: string]: number;
  }>({});
  const [currentUpload, setCurrentUpload] = useState<string | null>(null);

  const handleFileSelect = (docType: string) => {
    if (fileInputRef.current) {
      fileInputRef.current.setAttribute("data-doc-type", docType);
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    const docType = event.target.getAttribute("data-doc-type");

    if (file && docType) {
      // Simulate upload progress
      setCurrentUpload(docType);
      setUploadProgress((prev) => ({ ...prev, [docType]: 0 }));

      const interval = setInterval(() => {
        setUploadProgress((prev) => {
          const newProgress = (prev[docType] || 0) + 10;
          if (newProgress >= 100) {
            clearInterval(interval);
            setUploadedDocs((prev) => ({ ...prev, [docType]: file }));
            setCurrentUpload(null);
            return { ...prev, [docType]: 100 };
          }
          return { ...prev, [docType]: newProgress };
        });
      }, 100);
    }
  };

  const removeDocument = (docType: string) => {
    setUploadedDocs((prev) => {
      const newDocs = { ...prev };
      delete newDocs[docType];
      return newDocs;
    });
    setUploadProgress((prev) => {
      const newProgress = { ...prev };
      delete newProgress[docType];
      return newProgress;
    });
  };

  const getRequiredDocsCount = () => {
    return DOCUMENT_TYPES.filter((doc) => doc.required).length;
  };

  const getUploadedRequiredDocsCount = () => {
    return DOCUMENT_TYPES.filter((doc) => doc.required && uploadedDocs[doc.id])
      .length;
  };

  const isVerificationComplete =
    getUploadedRequiredDocsCount() === getRequiredDocsCount();

  const handleNext = () => {
    if (isVerificationComplete) {
      updatePreference("verificationDocuments", uploadedDocs);
      navigate("/onboarding/summary");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white flex flex-col items-center justify-center p-4">
      <div className="max-w-4xl w-full bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 md:p-8 text-white relative overflow-hidden">
          <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-indigo-500 opacity-20"></div>
          <div className="absolute -bottom-20 -left-20 w-60 h-60 rounded-full bg-purple-500 opacity-20"></div>

          <div className="relative z-10">
            <h1 className="text-3xl md:text-4xl font-bold mb-2 flex items-center gap-3">
              <FaIdCard className="text-yellow-300" />
              Identity Verification
            </h1>
            <p className="opacity-90 max-w-lg">
              Secure your account and speed up rental applications
            </p>
          </div>
        </div>

        <div className="p-6 md:p-8">
          {/* Progress Indicator */}
          <div className="mb-8 bg-indigo-50 p-5 rounded-xl border border-indigo-100">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-gray-700">
                Verification Progress
              </span>
              <span className="text-sm font-medium text-indigo-600">
                {getUploadedRequiredDocsCount()} of {getRequiredDocsCount()}{" "}
                required documents
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-green-500 h-3 rounded-full transition-all duration-500"
                style={{
                  width: `${
                    (getUploadedRequiredDocsCount() / getRequiredDocsCount()) *
                    100
                  }%`,
                }}
              ></div>
            </div>
            {isVerificationComplete && (
              <div className="mt-3 flex items-center gap-2 text-green-600">
                <FaCheckCircle />
                <span className="text-sm font-medium">
                  All required documents uploaded!
                </span>
              </div>
            )}
          </div>

          {/* Documents Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {DOCUMENT_TYPES.map((doc) => (
              <div
                key={doc.id}
                className={`border-2 rounded-xl p-4 transition-all ${
                  uploadedDocs[doc.id]
                    ? "border-green-500 bg-green-50"
                    : "border-gray-200 bg-white hover:border-indigo-300"
                } ${doc.required ? "ring-1 ring-indigo-200" : ""}`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                      {doc.label}
                      {doc.required && (
                        <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full">
                          Required
                        </span>
                      )}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {doc.description}
                    </p>
                  </div>
                  {uploadedDocs[doc.id] && (
                    <FaCheckCircle className="text-green-500 text-xl flex-shrink-0" />
                  )}
                </div>

                {!uploadedDocs[doc.id] ? (
                  <button
                    type="button"
                    onClick={() => handleFileSelect(doc.id)}
                    disabled={currentUpload === doc.id}
                    className={`w-full py-3 px-4 border-2 border-dashed rounded-lg transition-all flex flex-col items-center justify-center
                      ${
                        currentUpload === doc.id
                          ? "border-indigo-400 bg-indigo-50"
                          : "border-gray-300 hover:border-indigo-400 hover:bg-indigo-50"
                      }
                    `}
                  >
                    {currentUpload === doc.id ? (
                      <>
                        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-2"></div>
                        <span className="text-sm text-indigo-600">
                          Uploading... {uploadProgress[doc.id]}%
                        </span>
                      </>
                    ) : (
                      <>
                        <FaCloudUploadAlt className="text-gray-400 text-xl mb-2" />
                        <span className="text-sm text-gray-600">
                          Click to upload
                        </span>
                      </>
                    )}
                  </button>
                ) : (
                  <div className="flex items-center justify-between bg-white p-3 rounded-lg border">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <FaCheckCircle className="text-green-500" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-800">
                          {uploadedDocs[doc.id].name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {(uploadedDocs[doc.id].size / 1024 / 1024).toFixed(2)}{" "}
                          MB
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeDocument(doc.id)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Security Notice */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-8">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg
                  className="w-3 h-3 text-blue-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div>
                <h4 className="font-medium text-blue-800 mb-1">
                  Your Data is Secure
                </h4>
                <p className="text-sm text-blue-700">
                  All documents are encrypted and stored securely. We only use
                  this information for verification purposes and never share it
                  with third parties without your consent.
                </p>
              </div>
            </div>
          </div>

          {/* Hidden file input */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
          />

          {/* Navigation Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex-1 bg-gray-100 text-gray-700 px-6 py-4 rounded-xl hover:bg-gray-200 transition font-medium flex items-center justify-center"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Back
            </button>

            <button
              onClick={handleNext}
              disabled={!isVerificationComplete}
              className={`flex-1 px-6 py-4 rounded-xl font-semibold transition-all flex items-center justify-center
                ${
                  !isVerificationComplete
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-green-600 text-white hover:bg-green-700 hover:shadow-lg transform hover:-translate-y-0.5"
                }
              `}
            >
              Complete Verification
              <FaCheckCircle className="w-5 h-5 ml-2" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
