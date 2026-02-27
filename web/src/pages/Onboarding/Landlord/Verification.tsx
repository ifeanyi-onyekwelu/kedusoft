import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  IconId,
  IconBuilding,
  IconCreditCard,
  IconShieldCheck,
  IconCheck,
  IconUpload,
} from "@tabler/icons-react";

export default function LandlordVerificationPage() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);

  const [formData, setFormData] = useState({
    // Identity Documents
    identityDocuments: [] as Array<{
      type: string;
      file: File;
      preview: string;
    }>,

    // Business Information
    companyName: "",
    businessRegistrationNumber: "",
    businessType: "",
    yearsAsLandlord: "",

    // Property Ownership
    propertyOwnershipDocs: [] as File[],
    deedOrTitleDocument: null as File | null,
    propertyTaxReceipt: null as File | null,

    // Bank Information
    bankName: "",
    bankAccountNumber: "",
    bankRoutingNumber: "",
    accountHolderName: "",
    bankVerificationDocument: null as File | null,

    // Tax Information
    taxIdentificationNumber: "",
    taxDocument: null as File | null,

    // Additional Verification
    utilityBill: null as File | null,

    // Emergency Contact
    emergencyContactName: "",
    emergencyContactPhone: "",
    emergencyContactRelationship: "",

    // Legal & Compliance
    hasEvictionHistory: false,
    evictionHistoryDetails: "",
    criminalBackground: false,
    criminalBackgroundDetails: "",

    // Insurance
    insuranceProvider: "",
    insurancePolicyNumber: "",
    insuranceExpiryDate: "",
    insuranceDocument: null as File | null,
  });

  const identityDocumentTypes = [
    { id: "national_id", label: "National ID Card", icon: "🆔" },
    { id: "driver_license", label: "Driver's License", icon: "🚗" },
    { id: "passport", label: "International Passport", icon: "🌍" },
    { id: "voter_id", label: "Voter's Card", icon: "🗳️" },
  ];

  const businessTypes = [
    { id: "individual", label: "Individual Landlord" },
    { id: "company", label: "Real Estate Company" },
    { id: "agent", label: "Property Agent" },
    { id: "developer", label: "Property Developer" },
  ];

  const handleFileUpload = (field: string, files: FileList | null) => {
    if (!files || files.length === 0) return;

    const file = files[0];

    if (field === "identityDocuments") {
      const type =
        prompt(
          "Select document type:\n1. National ID\n2. Driver's License\n3. Passport\n4. Voter's Card"
        ) || "national_id";
      const preview = URL.createObjectURL(file);
      setFormData((prev) => ({
        ...prev,
        identityDocuments: [...prev.identityDocuments, { type, file, preview }],
      }));
    } else if (field === "propertyOwnershipDocs") {
      setFormData((prev) => ({
        ...prev,
        propertyOwnershipDocs: [...prev.propertyOwnershipDocs, file],
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [field]: file,
      }));
    }
  };

  const removeDocument = (field: string, index?: number) => {
    if (field === "identityDocuments" && index !== undefined) {
      setFormData((prev) => ({
        ...prev,
        identityDocuments: prev.identityDocuments.filter((_, i) => i !== index),
      }));
    } else if (field === "propertyOwnershipDocs" && index !== undefined) {
      setFormData((prev) => ({
        ...prev,
        propertyOwnershipDocs: prev.propertyOwnershipDocs.filter(
          (_, i) => i !== index
        ),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [field]: null,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Here you would typically upload files and submit to your backend
      console.log("Verification data:", formData);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Navigate to success page
      navigate("/onboarding/verification-success");
    } catch (error) {
      console.error("Verification submission failed:", error);
    }
  };

  const isStepComplete = (step: number) => {
    switch (step) {
      case 1:
        return formData.identityDocuments.length >= 1;
      case 2:
        return (
          formData.companyName &&
          formData.businessType &&
          formData.yearsAsLandlord
        );
      case 3:
        return formData.deedOrTitleDocument && formData.propertyTaxReceipt;
      case 4:
        return (
          formData.bankName &&
          formData.bankAccountNumber &&
          formData.bankVerificationDocument
        );
      case 5:
        return formData.taxIdentificationNumber && formData.taxDocument;
      case 6:
        return formData.emergencyContactName && formData.emergencyContactPhone;
      default:
        return false;
    }
  };

  const stepVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 },
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      <div className="w-full max-w-4xl">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              Verification Step {currentStep} of 6
            </span>
            <span className="text-sm font-medium text-blue-600">
              {Math.round((currentStep / 6) * 100)}%
            </span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-blue-600 to-cyan-600"
              initial={{ width: 0 }}
              animate={{ width: `${(currentStep / 6) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl p-8 md:p-12"
        >
          <form onSubmit={handleSubmit}>
            <AnimatePresence mode="wait">
              {/* Step 1: Identity Verification */}
              {currentStep === 1 && (
                <motion.div
                  key="step1"
                  variants={stepVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <IconId size={24} className="text-blue-600" />
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold text-gray-900">
                        Identity Verification
                      </h2>
                      <p className="text-gray-600 mt-1">
                        Upload government-issued ID documents
                      </p>
                    </div>
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Required Identity Documents *
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      {identityDocumentTypes.map((doc) => (
                        <div
                          key={doc.id}
                          className="p-4 border-2 border-dashed border-gray-300 rounded-lg text-center hover:border-blue-300 transition-colors"
                        >
                          <div className="text-2xl mb-2">{doc.icon}</div>
                          <div className="font-medium text-gray-900">
                            {doc.label}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <IconUpload
                        size={48}
                        className="text-gray-400 mx-auto mb-3"
                      />
                      <p className="text-gray-600 mb-2">
                        Upload your government-issued ID
                      </p>
                      <input
                        type="file"
                        accept=".jpg,.jpeg,.png,.pdf"
                        onChange={(e) =>
                          handleFileUpload("identityDocuments", e.target.files)
                        }
                        className="hidden"
                        id="identity-upload"
                      />
                      <label
                        htmlFor="identity-upload"
                        className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors cursor-pointer"
                      >
                        <IconUpload size={20} />
                        Choose File
                      </label>
                      <p className="text-xs text-gray-500 mt-2">
                        Supported formats: JPG, PNG, PDF (Max 5MB)
                      </p>
                    </div>

                    {/* Uploaded Documents */}
                    {formData.identityDocuments.length > 0 && (
                      <div className="mt-4">
                        <h4 className="font-medium text-gray-900 mb-2">
                          Uploaded Documents:
                        </h4>
                        <div className="space-y-2">
                          {formData.identityDocuments.map((doc, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-white rounded border flex items-center justify-center">
                                  📄
                                </div>
                                <div>
                                  <div className="font-medium text-gray-900">
                                    {doc.type.replace("_", " ").toUpperCase()}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    {doc.file.name}
                                  </div>
                                </div>
                              </div>
                              <button
                                type="button"
                                onClick={() =>
                                  removeDocument("identityDocuments", index)
                                }
                                className="text-red-600 hover:text-red-800"
                              >
                                Remove
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(2)}
                      disabled={!isStepComplete(1)}
                      className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Continue
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Step 2: Business Information */}
              {currentStep === 2 && (
                <motion.div
                  key="step2"
                  variants={stepVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <IconBuilding size={24} className="text-green-600" />
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold text-gray-900">
                        Business Information
                      </h2>
                      <p className="text-gray-600 mt-1">
                        Tell us about your property business
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Business Type *
                      </label>
                      <select
                        value={formData.businessType}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            businessType: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      >
                        <option value="">Select business type</option>
                        {businessTypes.map((type) => (
                          <option key={type.id} value={type.id}>
                            {type.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Years as Landlord *
                      </label>
                      <select
                        value={formData.yearsAsLandlord}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            yearsAsLandlord: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      >
                        <option value="">Select experience</option>
                        <option value="0-1">0-1 years</option>
                        <option value="1-3">1-3 years</option>
                        <option value="3-5">3-5 years</option>
                        <option value="5+">5+ years</option>
                      </select>
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Company Name (if applicable)
                      </label>
                      <input
                        type="text"
                        value={formData.companyName}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            companyName: e.target.value,
                          })
                        }
                        placeholder="Enter your company name"
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Business Registration Number (if applicable)
                      </label>
                      <input
                        type="text"
                        value={formData.businessRegistrationNumber}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            businessRegistrationNumber: e.target.value,
                          })
                        }
                        placeholder="Enter registration number"
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(1)}
                      className="px-6 py-3 border-2 border-gray-300 rounded-lg font-semibold hover:bg-gray-50"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={() => setCurrentStep(3)}
                      disabled={!isStepComplete(2)}
                      className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Continue
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Property Ownership Proof */}
              {currentStep === 3 && (
                <motion.div
                  key="step3"
                  variants={stepVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                      <IconBuilding size={24} className="text-purple-600" />
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold text-gray-900">
                        Property Ownership Proof
                      </h2>
                      <p className="text-gray-600 mt-1">
                        Upload documents proving property ownership
                      </p>
                    </div>
                  </div>

                  <div className="space-y-6 mb-6">
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <IconUpload
                        size={48}
                        className="text-gray-400 mx-auto mb-3"
                      />
                      <p className="text-gray-600 mb-2 font-medium">
                        Deed or Title Document *
                      </p>
                      <input
                        type="file"
                        accept=".jpg,.jpeg,.png,.pdf"
                        onChange={(e) =>
                          handleFileUpload(
                            "deedOrTitleDocument",
                            e.target.files
                          )
                        }
                        className="hidden"
                        id="deed-upload"
                      />
                      <label
                        htmlFor="deed-upload"
                        className="inline-flex items-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors cursor-pointer"
                      >
                        <IconUpload size={20} />
                        Upload Deed/Title
                      </label>
                      {formData.deedOrTitleDocument && (
                        <div className="mt-3 p-3 bg-green-50 rounded-lg">
                          <div className="flex items-center gap-2 text-green-700">
                            <IconCheck size={20} />
                            <span>
                              Uploaded: {formData.deedOrTitleDocument.name}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <IconUpload
                        size={48}
                        className="text-gray-400 mx-auto mb-3"
                      />
                      <p className="text-gray-600 mb-2 font-medium">
                        Property Tax Receipt *
                      </p>
                      <input
                        type="file"
                        accept=".jpg,.jpeg,.png,.pdf"
                        onChange={(e) =>
                          handleFileUpload("propertyTaxReceipt", e.target.files)
                        }
                        className="hidden"
                        id="tax-upload"
                      />
                      <label
                        htmlFor="tax-upload"
                        className="inline-flex items-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors cursor-pointer"
                      >
                        <IconUpload size={20} />
                        Upload Tax Receipt
                      </label>
                      {formData.propertyTaxReceipt && (
                        <div className="mt-3 p-3 bg-green-50 rounded-lg">
                          <div className="flex items-center gap-2 text-green-700">
                            <IconCheck size={20} />
                            <span>
                              Uploaded: {formData.propertyTaxReceipt.name}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <IconUpload
                        size={48}
                        className="text-gray-400 mx-auto mb-3"
                      />
                      <p className="text-gray-600 mb-2">
                        Additional Ownership Documents (Optional)
                      </p>
                      <input
                        type="file"
                        accept=".jpg,.jpeg,.png,.pdf"
                        onChange={(e) =>
                          handleFileUpload(
                            "propertyOwnershipDocs",
                            e.target.files
                          )
                        }
                        className="hidden"
                        id="additional-upload"
                        multiple
                      />
                      <label
                        htmlFor="additional-upload"
                        className="inline-flex items-center gap-2 bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors cursor-pointer"
                      >
                        <IconUpload size={20} />
                        Upload Additional Docs
                      </label>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(2)}
                      className="px-6 py-3 border-2 border-gray-300 rounded-lg font-semibold hover:bg-gray-50"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={() => setCurrentStep(4)}
                      disabled={!isStepComplete(3)}
                      className="flex-1 px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Continue
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Step 4: Bank Information */}
              {currentStep === 4 && (
                <motion.div
                  key="step4"
                  variants={stepVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                      <IconCreditCard size={24} className="text-amber-600" />
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold text-gray-900">
                        Bank Information
                      </h2>
                      <p className="text-gray-600 mt-1">
                        For secure payment processing
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Bank Name *
                      </label>
                      <input
                        type="text"
                        value={formData.bankName}
                        onChange={(e) =>
                          setFormData({ ...formData, bankName: e.target.value })
                        }
                        placeholder="Enter bank name"
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Account Number *
                      </label>
                      <input
                        type="text"
                        value={formData.bankAccountNumber}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            bankAccountNumber: e.target.value,
                          })
                        }
                        placeholder="Enter account number"
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Routing Number *
                      </label>
                      <input
                        type="text"
                        value={formData.bankRoutingNumber}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            bankRoutingNumber: e.target.value,
                          })
                        }
                        placeholder="Enter routing number"
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Account Holder Name *
                      </label>
                      <input
                        type="text"
                        value={formData.accountHolderName}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            accountHolderName: e.target.value,
                          })
                        }
                        placeholder="Enter account holder name"
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                        <IconUpload
                          size={48}
                          className="text-gray-400 mx-auto mb-3"
                        />
                        <p className="text-gray-600 mb-2 font-medium">
                          Bank Verification Document *
                        </p>
                        <input
                          type="file"
                          accept=".jpg,.jpeg,.png,.pdf"
                          onChange={(e) =>
                            handleFileUpload(
                              "bankVerificationDocument",
                              e.target.files
                            )
                          }
                          className="hidden"
                          id="bank-verification-upload"
                        />
                        <label
                          htmlFor="bank-verification-upload"
                          className="inline-flex items-center gap-2 bg-amber-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-amber-700 transition-colors cursor-pointer"
                        >
                          <IconUpload size={20} />
                          Upload Bank Statement
                        </label>
                        {formData.bankVerificationDocument && (
                          <div className="mt-3 p-3 bg-green-50 rounded-lg">
                            <div className="flex items-center gap-2 text-green-700">
                              <IconCheck size={20} />
                              <span>
                                Uploaded:{" "}
                                {formData.bankVerificationDocument.name}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(3)}
                      className="px-6 py-3 border-2 border-gray-300 rounded-lg font-semibold hover:bg-gray-50"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={() => setCurrentStep(5)}
                      disabled={!isStepComplete(4)}
                      className="flex-1 px-6 py-3 bg-amber-600 text-white rounded-lg font-semibold hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Continue
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Step 5: Tax Information */}
              {currentStep === 5 && (
                <motion.div
                  key="step5"
                  variants={stepVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                      <IconCreditCard size={24} className="text-red-600" />
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold text-gray-900">
                        Tax Information
                      </h2>
                      <p className="text-gray-600 mt-1">
                        For tax compliance and reporting
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tax Identification Number (TIN) *
                      </label>
                      <input
                        type="text"
                        value={formData.taxIdentificationNumber}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            taxIdentificationNumber: e.target.value,
                          })
                        }
                        placeholder="Enter your TIN"
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                        <IconUpload
                          size={48}
                          className="text-gray-400 mx-auto mb-3"
                        />
                        <p className="text-gray-600 mb-2 font-medium">
                          Tax Document *
                        </p>
                        <input
                          type="file"
                          accept=".jpg,.jpeg,.png,.pdf"
                          onChange={(e) =>
                            handleFileUpload("taxDocument", e.target.files)
                          }
                          className="hidden"
                          id="tax-doc-upload"
                        />
                        <label
                          htmlFor="tax-doc-upload"
                          className="inline-flex items-center gap-2 bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors cursor-pointer"
                        >
                          <IconUpload size={20} />
                          Upload Tax Document
                        </label>
                        {formData.taxDocument && (
                          <div className="mt-3 p-3 bg-green-50 rounded-lg">
                            <div className="flex items-center gap-2 text-green-700">
                              <IconCheck size={20} />
                              <span>Uploaded: {formData.taxDocument.name}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(4)}
                      className="px-6 py-3 border-2 border-gray-300 rounded-lg font-semibold hover:bg-gray-50"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={() => setCurrentStep(6)}
                      disabled={!isStepComplete(5)}
                      className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Continue
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Step 6: Emergency Contact & Legal */}
              {currentStep === 6 && (
                <motion.div
                  key="step6"
                  variants={stepVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                      <IconShieldCheck size={24} className="text-indigo-600" />
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold text-gray-900">
                        Emergency Contact & Legal
                      </h2>
                      <p className="text-gray-600 mt-1">
                        Final verification steps
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Emergency Contact Name *
                      </label>
                      <input
                        type="text"
                        value={formData.emergencyContactName}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            emergencyContactName: e.target.value,
                          })
                        }
                        placeholder="Full name"
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Emergency Contact Phone *
                      </label>
                      <input
                        type="text"
                        value={formData.emergencyContactPhone}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            emergencyContactPhone: e.target.value,
                          })
                        }
                        placeholder="Phone number"
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Relationship *
                      </label>
                      <input
                        type="text"
                        value={formData.emergencyContactRelationship}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            emergencyContactRelationship: e.target.value,
                          })
                        }
                        placeholder="e.g., Spouse, Parent, Sibling"
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={formData.hasEvictionHistory}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              hasEvictionHistory: e.target.checked,
                            })
                          }
                          className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <span className="text-sm font-medium text-gray-700">
                          I have eviction history
                        </span>
                      </label>
                      {formData.hasEvictionHistory && (
                        <textarea
                          value={formData.evictionHistoryDetails}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              evictionHistoryDetails: e.target.value,
                            })
                          }
                          placeholder="Please provide details..."
                          className="w-full mt-2 px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          rows={3}
                        />
                      )}
                    </div>

                    <div className="md:col-span-2">
                      <label className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={formData.criminalBackground}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              criminalBackground: e.target.checked,
                            })
                          }
                          className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <span className="text-sm font-medium text-gray-700">
                          I have criminal background
                        </span>
                      </label>
                      {formData.criminalBackground && (
                        <textarea
                          value={formData.criminalBackgroundDetails}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              criminalBackgroundDetails: e.target.value,
                            })
                          }
                          placeholder="Please provide details..."
                          className="w-full mt-2 px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          rows={3}
                        />
                      )}
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(5)}
                      className="px-6 py-3 border-2 border-gray-300 rounded-lg font-semibold hover:bg-gray-50"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={!isStepComplete(6)}
                      className="flex-1 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-semibold hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Submit Verification
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        </motion.div>

        {/* Step Indicators */}
        <div className="flex justify-center gap-2 mt-6">
          {[1, 2, 3, 4, 5, 6].map((step) => (
            <div
              key={step}
              className={`h-2 rounded-full transition-all ${
                step === currentStep
                  ? "w-8 bg-blue-600"
                  : isStepComplete(step)
                  ? "w-2 bg-green-600"
                  : "w-2 bg-gray-300"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
