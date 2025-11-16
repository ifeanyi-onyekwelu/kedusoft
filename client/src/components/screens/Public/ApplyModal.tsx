import {
  Modal,
  Button,
  TextInput,
  Textarea,
  Divider,
  Select,
  NumberInput,
  Checkbox,
} from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import { useState } from "react";
import { useUser } from "../../../context/UserContext";
import { useTenantOperations } from "../../../apis/tenantApi";
import { useLoading } from "../../../hooks/useLoading";
import { toast } from "react-hot-toast";

interface ApplyModalProps {
  opened: boolean;
  close: () => void;
  property: Property;
  onApplySuccess: (status: string, customMessage?: string) => void; // callback for successful application
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
      // Transform camelCase to snake_case for backend
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
      console.log("Error!: ", error);
      const errorMessage =
        error?.response?.data?.message ||
        error?.processedError?.message ||
        error?.message ||
        "Failed to submit application";
      onApplySuccess("error", errorMessage);
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={close}
      title={
        <div className="text-xl font-bold text-gray-900">
          Apply for this Property
        </div>
      }
      size="lg"
      padding="xl"
    >
      <div className="space-y-8">
        {/* SECTION: Personal Information */}
        <div className="space-y-4">
          <div>
            <h3 className="text-base font-semibold text-gray-900 mb-3">
              Personal Information
            </h3>
            <Divider className="mb-4" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <TextInput
              label="First Name"
              value={formData.firstName}
              onChange={(e) => updateField("firstName", e.currentTarget.value)}
              required
              size="md"
            />
            <TextInput
              label="Last Name"
              value={formData.lastName}
              onChange={(e) => updateField("lastName", e.currentTarget.value)}
              required
              size="md"
            />
          </div>
          <TextInput
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) => updateField("email", e.currentTarget.value)}
            required
            size="md"
          />
          <TextInput
            label="Phone Number"
            value={formData.phone}
            onChange={(e) => updateField("phone", e.currentTarget.value)}
            required
            size="md"
          />
        </div>

        {/* SECTION: Employment & Income */}
        <div className="space-y-4">
          <div>
            <h3 className="text-base font-semibold text-gray-900 mb-3">
              Employment & Income
            </h3>
            <Divider className="mb-4" />
          </div>
          <Select
            label="Employment Status"
            data={["Employed", "Self-employed", "Student", "Unemployed"]}
            value={formData.employmentStatus}
            onChange={(value) => updateField("employmentStatus", value)}
            required
            size="md"
          />
          <NumberInput
            label="Monthly Income (₦)"
            placeholder="Optional"
            value={formData.monthlyIncome}
            onChange={(value) => updateField("monthlyIncome", value)}
            size="md"
            hideControls
          />
          <TextInput
            label="Employer / School"
            placeholder="Optional"
            value={formData.employerOrSchool}
            onChange={(e) =>
              updateField("employerOrSchool", e.currentTarget.value)
            }
            size="md"
          />
        </div>

        {/* SECTION: Rental Preferences */}
        <div className="space-y-4">
          <div>
            <h3 className="text-base font-semibold text-gray-900 mb-3">
              Rental & Lifestyle Information
            </h3>
            <Divider className="mb-4" />
          </div>

          <Select
            label="Living Arrangement"
            data={[
              "Living alone",
              "With partner",
              "With family",
              "With friends",
            ]}
            value={formData.livingArrangement}
            onChange={(value) => updateField("livingArrangement", value)}
            size="md"
          />

          <NumberInput
            label="Number of Occupants"
            value={formData.numberOfOccupants}
            min={1}
            onChange={(value) => updateField("numberOfOccupants", value)}
            size="md"
          />

          <Textarea
            label="Reason for Moving"
            placeholder="Optional but helpful"
            value={formData.reasonForMoving}
            onChange={(e) =>
              updateField("reasonForMoving", e.currentTarget.value)
            }
            minRows={3}
            size="md"
          />

          <div className="pt-2">
            <Checkbox
              label="Do you have pets?"
              checked={formData.hasPets}
              onChange={(e) => updateField("hasPets", e.currentTarget.checked)}
              size="md"
            />
          </div>

          {formData.hasPets && (
            <TextInput
              label="Pet Details"
              placeholder="Type, breed, size"
              value={formData.petDetails}
              onChange={(e) => updateField("petDetails", e.currentTarget.value)}
              size="md"
            />
          )}
        </div>

        {/* SECTION: Move-In & Message */}
        <div className="space-y-4">
          <div>
            <h3 className="text-base font-semibold text-gray-900 mb-3">
              Move-In & Message
            </h3>
            <Divider className="mb-4" />
          </div>

          <p className="font-bold">Preferred Move-In Date</p>
          <DatePicker
            value={formData.preferredMoveIn}
            onChange={(date) => updateField("preferredMoveIn", date)}
            minDate={new Date()}
            size="md"
          />
          <Textarea
            label="Message to Landlord"
            placeholder="Introduce yourself and explain why you'd be a great tenant..."
            value={formData.message}
            onChange={(e) => updateField("message", e.currentTarget.value)}
            minRows={10}
            size="md"
            resize="vertical"
          />
        </div>

        <div className="pt-4">
          <Button
            fullWidth
            onClick={handleSubmit}
            loading={loading}
            className="bg-blue-600 hover:bg-blue-700"
            size="lg"
          >
            Submit Application
          </Button>
        </div>
      </div>
    </Modal>
  );
}
