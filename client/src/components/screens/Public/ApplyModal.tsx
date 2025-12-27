import { Modal, Button } from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { IconCheck, IconX, IconAlertCircle } from "@tabler/icons-react";
import { useState } from "react";
import { useUser } from "../../../context/UserContext";
import { useTenantOperations } from "../../../apis/tenantApi";
import { useLoading } from "../../../hooks/useLoading";
import { toast } from "react-hot-toast";
import formatAmount from "@/utils/helpers";

interface ApplyModalProps {
  opened: boolean;
  close: () => void;
  property: Property;
  onApplySuccess: (status: string, customMessage?: string) => void;
}

export function ApplyModal({
  opened,
  close,
  property,
  onApplySuccess,
}: ApplyModalProps) {
  const { user } = useUser();
  const { applyForProperty } = useTenantOperations();
  const { loading, withLoading } = useLoading();

  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    phone: user?.phone_number || "",
    employmentStatus: "",
    monthlyIncome: "",
    employerOrSchool: "",
    reasonForMoving: "",
    livingArrangement: "",
    numberOfOccupants: 1,
    hasPets: false,
    petDetails: "",
    message: "",
    preferredMoveIn: null as Date | null,
  });

  const updateField = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.email ||
      !formData.phone
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      const payload = {
        propertyId: property.id,
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        employment_status: formData.employmentStatus,
        monthly_income: formData.monthlyIncome,
        employer_or_school: formData.employerOrSchool,
        reason_for_moving: formData.reasonForMoving,
        living_arrangement: formData.livingArrangement,
        number_of_occupants: formData.numberOfOccupants,
        has_pets: formData.hasPets,
        pet_details: formData.petDetails,
        message: formData.message,
        preferred_move_in: formData.preferredMoveIn?.toISOString(),
      };

      await withLoading(applyForProperty(payload));
      onApplySuccess("success");
      close();
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message || "Failed to submit application";
      onApplySuccess("error", errorMessage);
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={close}
      size="xl"
      centered
      overlayProps={{ backgroundOpacity: 0.5, blur: 3 }}
      classNames={{
        content: "!bg-white !shadow-2xl",
        header: "!bg-white !border-b !border-gray-200 !px-8 !py-6",
        title: "!font-black !text-2xl !text-[#290665]",
        close: "!text-gray-400 hover:!text-gray-600",
      }}
      title="Rental Application"
    >
      <div className="px-8 pb-8 space-y-8">
        {/* Property Summary Card */}
        <div className="flex gap-4 p-4 bg-gradient-to-br from-[#290665]/5 to-[#CF8205]/5 border border-gray-200 rounded-xl">
          <img
            src={property?.gallery?.[0]}
            alt={property.name}
            className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
          />
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-gray-900 text-base mb-1 truncate">
              {property.name}
            </h3>
            <p className="text-sm text-gray-600 truncate mb-2">
              {property.address}
            </p>
            <p className="text-lg font-black text-[#290665]">
              {formatAmount(property.rent_amount)}{" "}
              <span className="text-xs font-normal text-gray-500">/year</span>
            </p>
          </div>
        </div>

        {/* Form Sections */}
        <div className="space-y-6">
          {/* Personal Details Section */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-[#290665] uppercase tracking-wide">
              Personal Information
            </h4>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-semibold text-[#290665] mb-2">
                  First Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="John"
                  value={formData.firstName}
                  onChange={(e) => updateField("firstName", e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#CF8205] focus:ring-1 focus:ring-[#CF8205]/50 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#290665] mb-2">
                  Last Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Doe"
                  value={formData.lastName}
                  onChange={(e) => updateField("lastName", e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#CF8205] focus:ring-1 focus:ring-[#CF8205]/50 transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-semibold text-[#290665] mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={(e) => updateField("email", e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#CF8205] focus:ring-1 focus:ring-[#CF8205]/50 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#290665] mb-2">
                  Phone <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  placeholder="+234 (0) 80 0000 0000"
                  value={formData.phone}
                  onChange={(e) => updateField("phone", e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#CF8205] focus:ring-1 focus:ring-[#CF8205]/50 transition-all"
                />
              </div>
            </div>
          </div>

          {/* Employment & Living Section */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-[#290665] uppercase tracking-wide">
              Employment & Lifestyle
            </h4>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-semibold text-[#290665] mb-2">
                  Employment Status
                </label>
                <select
                  value={formData.employmentStatus}
                  onChange={(e) =>
                    updateField("employmentStatus", e.target.value)
                  }
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#CF8205] focus:ring-1 focus:ring-[#CF8205]/50 transition-all bg-white"
                >
                  <option value="">Select...</option>
                  <option value="employed">Employed</option>
                  <option value="student">Student</option>
                  <option value="self-employed">Self-Employed</option>
                  <option value="unemployed">Unemployed</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#290665] mb-2">
                  Number of Occupants
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.numberOfOccupants}
                  onChange={(e) =>
                    updateField(
                      "numberOfOccupants",
                      parseInt(e.target.value) || 1
                    )
                  }
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#CF8205] focus:ring-1 focus:ring-[#CF8205]/50 transition-all"
                />
              </div>
            </div>

            {/* Pets Section */}
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.hasPets}
                  onChange={(e) => updateField("hasPets", e.target.checked)}
                  className="w-5 h-5 accent-[#290665] cursor-pointer rounded border-gray-300"
                />
                <span className="text-sm font-semibold text-gray-900">
                  I have pets
                </span>
              </label>
              {formData.hasPets && (
                <input
                  type="text"
                  placeholder="What kind of pets? (e.g., 2 dogs, 1 cat)"
                  value={formData.petDetails}
                  onChange={(e) => updateField("petDetails", e.target.value)}
                  className="w-full mt-3 px-4 py-3 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#CF8205] focus:ring-1 focus:ring-[#CF8205]/50 transition-all"
                />
              )}
            </div>
          </div>

          {/* Move-in Details Section */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-[#290665] uppercase tracking-wide">
              Move-in Details
            </h4>
            <div>
              <label className="block text-sm font-semibold text-[#290665] mb-2">
                Preferred Move-in Date
              </label>
              <DatePickerInput
                placeholder="Select date"
                value={formData.preferredMoveIn}
                onChange={(val) => updateField("preferredMoveIn", val)}
                classNames={{
                  input:
                    "!px-4 !py-3 !border-gray-200 focus:!border-[#CF8205] focus:!ring-[#CF8205]/50",
                }}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#290665] mb-2">
                Message to Landlord
              </label>
              <textarea
                placeholder="Briefly introduce yourself and tell the landlord about yourself..."
                value={formData.message}
                onChange={(e) => updateField("message", e.target.value)}
                rows={4}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#CF8205] focus:ring-1 focus:ring-[#CF8205]/50 transition-all resize-none"
              />
            </div>
          </div>

          {/* Disclaimer */}
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg flex gap-3">
            <IconAlertCircle
              size={20}
              className="text-amber-600 flex-shrink-0 mt-0.5"
              stroke={2.5}
            />
            <p className="text-sm text-amber-900 leading-relaxed">
              By submitting this application, you agree to provide accurate
              information. Landlords may contact you for verification.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <Button
            variant="light"
            color="gray"
            onClick={close}
            leftSection={<IconX size={18} />}
            className="flex-1 !h-12 !font-semibold !text-gray-600"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            loading={loading}
            leftSection={<IconCheck size={18} />}
            className="flex-1 !h-12 !bg-[#290665] !font-semibold hover:!bg-[#1e054a] !text-white transition-all"
          >
            Submit Application
          </Button>
        </div>
      </div>
    </Modal>
  );
}
