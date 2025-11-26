import { useNavigate } from "react-router-dom";
import { useOnboarding } from "../../../context/OnboardingContext";
import { useState, useRef } from "react";
import {
  IconUpload,
  IconCheck,
  IconX,
  IconShieldCheck,
  IconArrowLeft,
  IconArrowRight,
  IconLicense,
  IconReceipt,
  IconBuildingBank,
  IconUserCheck,
} from "@tabler/icons-react";
import { FaIdCard, FaPassport } from "react-icons/fa6";

const DOCUMENT_TYPES = [
  {
    id: "national_id",
    label: "National ID",
    description: "Government issued identification card",
    icon: FaIdCard,
    required: true,
    examples: ["National ID card", "Voter's card", "NIN slip"],
  },
  {
    id: "driver_license",
    label: "Driver's License",
    description: "Valid driver's license",
    icon: IconLicense,
    required: false,
    examples: ["Driver's license front and back"],
  },
  {
    id: "passport",
    label: "International Passport",
    description: "Valid passport with photo page",
    icon: FaPassport,
    required: false,
    examples: ["Passport photo page", "Bio-data page"],
  },
  {
    id: "proof_of_income",
    label: "Proof of Income",
    description: "Recent salary slips or bank statements",
    icon: IconReceipt,
    required: true,
    examples: ["3 months bank statements", "Salary slips", "Employment letter"],
  },
  {
    id: "utility_bill",
    label: "Utility Bill",
    description: "Recent utility bill for address verification",
    icon: IconBuildingBank,
    required: true,
    examples: ["PHCN bill", "Water bill", "Waste bill"],
  },
  {
    id: "reference_letter",
    label: "Reference Letter",
    description: "Character or employment reference",
    icon: IconUserCheck,
    required: false,
    examples: ["Employer reference", "Previous landlord reference"],
  },
];

const DOCUMENT_CATEGORIES = [
  { id: "all", label: "All Documents" },
  { id: "required", label: "Required Only" },
  { id: "optional", label: "Optional" },
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
  const [activeCategory, setActiveCategory] = useState("all");

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
      navigate("/onboarding/completion");
    }
  };

  // Filter documents based on category
  const filteredDocuments = DOCUMENT_TYPES.filter((doc) => {
    if (activeCategory === "required") return doc.required;
    if (activeCategory === "optional") return !doc.required;
    return true; // "all"
  });

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-2 h-8 bg-blue-900 rounded-full"></div>
            <h2 className="text-xl font-semibold text-slate-700">
              Step 6 of 6
            </h2>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-3">
            Identity Verification
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Upload required documents to complete your profile and speed up
            rental applications
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-8">
            {/* Progress and Summary */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
              {/* Progress Section */}
              <div className="lg:col-span-2">
                <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-slate-800">
                      Verification Progress
                    </h3>
                    <span className="text-sm font-medium bg-blue-100 text-blue-900 px-3 py-1 rounded-full">
                      {getUploadedRequiredDocsCount()}/{getRequiredDocsCount()}{" "}
                      required
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-3 mb-3">
                    <div
                      className="bg-blue-900 h-3 rounded-full transition-all duration-500"
                      style={{
                        width: `${
                          (getUploadedRequiredDocsCount() /
                            getRequiredDocsCount()) *
                          100
                        }%`,
                      }}
                    ></div>
                  </div>
                  {isVerificationComplete ? (
                    <div className="flex items-center gap-2 text-green-600 text-sm">
                      <IconCheck size={18} />
                      <span className="font-medium">
                        All required documents uploaded!
                      </span>
                    </div>
                  ) : (
                    <p className="text-sm text-slate-600">
                      Upload all required documents to complete verification
                    </p>
                  )}
                </div>
              </div>

              {/* Summary Card */}
              <div className="bg-blue-50 p-6 rounded-xl border border-blue-200">
                <h3 className="text-lg font-semibold text-slate-800 mb-3 flex items-center gap-2">
                  <IconShieldCheck size={20} className="text-blue-900" />
                  Verification Benefits
                </h3>
                <ul className="space-y-2 text-sm text-slate-700">
                  <li className="flex items-center gap-2">
                    <IconCheck size={16} className="text-green-600" />
                    Faster application processing
                  </li>
                  <li className="flex items-center gap-2">
                    <IconCheck size={16} className="text-green-600" />
                    Higher trust with landlords
                  </li>
                  <li className="flex items-center gap-2">
                    <IconCheck size={16} className="text-green-600" />
                    Priority property viewing
                  </li>
                  <li className="flex items-center gap-2">
                    <IconCheck size={16} className="text-green-600" />
                    Secure document storage
                  </li>
                </ul>
              </div>
            </div>

            {/* Category Filter */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-slate-700 mb-3">
                Filter documents:
              </h3>
              <div className="flex flex-wrap gap-2">
                {DOCUMENT_CATEGORIES.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      activeCategory === category.id
                        ? "bg-blue-900 text-white shadow-sm"
                        : "bg-white text-slate-700 border border-slate-300 hover:bg-slate-50"
                    }`}
                  >
                    {category.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Documents Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {filteredDocuments.map((doc) => {
                const IconComponent = doc.icon;
                const isUploaded = uploadedDocs[doc.id];
                const isUploading = currentUpload === doc.id;

                return (
                  <div
                    key={doc.id}
                    className={`border-2 rounded-xl p-6 transition-all ${
                      isUploaded
                        ? "border-green-500 bg-green-50"
                        : "border-slate-200 bg-white hover:border-slate-300"
                    } ${doc.required ? "ring-1 ring-blue-200" : ""}`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                          <IconComponent size={24} className="text-blue-900" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-slate-800">
                              {doc.label}
                            </h3>
                            {doc.required && (
                              <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full font-medium">
                                Required
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-slate-600 mb-2">
                            {doc.description}
                          </p>
                          <div className="text-xs text-slate-500">
                            <span className="font-medium">Examples:</span>{" "}
                            {doc.examples.join(", ")}
                          </div>
                        </div>
                      </div>
                      {isUploaded && (
                        <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                          <IconCheck size={14} className="text-white" />
                        </div>
                      )}
                    </div>

                    {!isUploaded ? (
                      <button
                        type="button"
                        onClick={() => handleFileSelect(doc.id)}
                        disabled={isUploading}
                        className={`w-full py-3 px-4 border-2 border-dashed rounded-lg transition-all flex flex-col items-center justify-center
                          ${
                            isUploading
                              ? "border-blue-400 bg-blue-50"
                              : "border-slate-300 hover:border-blue-400 hover:bg-blue-50"
                          }`}
                      >
                        {isUploading ? (
                          <>
                            <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mb-2"></div>
                            <span className="text-sm text-blue-700">
                              Uploading... {uploadProgress[doc.id]}%
                            </span>
                          </>
                        ) : (
                          <>
                            <IconUpload
                              size={20}
                              className="text-slate-400 mb-2"
                            />
                            <span className="text-sm text-slate-600">
                              Click to upload
                            </span>
                            <span className="text-xs text-slate-500 mt-1">
                              PDF, JPG, PNG up to 10MB
                            </span>
                          </>
                        )}
                      </button>
                    ) : (
                      <div className="flex items-center justify-between bg-white p-4 rounded-lg border border-slate-200">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                            <IconCheck size={20} className="text-green-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-slate-800">
                              {uploadedDocs[doc.id].name}
                            </p>
                            <p className="text-xs text-slate-500">
                              {(
                                uploadedDocs[doc.id].size /
                                1024 /
                                1024
                              ).toFixed(2)}{" "}
                              MB
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeDocument(doc.id)}
                          className="text-slate-400 hover:text-red-500 transition-colors p-2"
                        >
                          <IconX size={18} />
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Security Notice */}
            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 mb-8">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <IconShieldCheck size={20} className="text-blue-900" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-800 mb-2">
                    Your Documents Are Secure
                  </h4>
                  <p className="text-sm text-slate-600">
                    All uploaded documents are encrypted and stored securely
                    using bank-level security. We only use this information for
                    verification purposes and never share it with third parties
                    without your explicit consent. Documents are automatically
                    deleted after the verification process is complete.
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
                className="flex-1 bg-white text-slate-700 px-6 py-4 rounded-lg border border-slate-300 hover:bg-slate-50 transition-all duration-200 font-medium flex items-center justify-center"
              >
                <IconArrowLeft size={20} className="mr-2" />
                Back to Budget
              </button>

              <button
                onClick={handleNext}
                disabled={!isVerificationComplete}
                className={`flex-1 px-6 py-4 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center
                  ${
                    !isVerificationComplete
                      ? "bg-slate-300 text-slate-500 cursor-not-allowed"
                      : "bg-blue-900 text-white hover:bg-blue-800 hover:shadow-lg"
                  }`}
              >
                Complete Verification
                <IconArrowRight size={20} className="ml-2" />
              </button>
            </div>

            {!isVerificationComplete && (
              <div className="mt-4 text-center text-slate-500 text-sm">
                Please upload all required documents to continue
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
