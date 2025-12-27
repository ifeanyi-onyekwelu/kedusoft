import {
  Modal,
  Button,
  TextInput,
  Select,
  Textarea,
  Stack,
  Group,
  Text,
  Image,
} from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { IconCheck, IconX, IconInfoCircle } from "@tabler/icons-react";
import { useState } from "react";
import { useUser } from "../../../context/UserContext";
import { useTenantOperations } from "../../../apis/tenantApi";
import { useLoading } from "../../../hooks/useLoading";
import { toast } from "react-hot-toast";
import formatAmount from "@/utils/helpers";

interface ApplyModalProps {
  opened: boolean;
  close: () => void;
  property: any;
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

  // Form state with only required fields
  const [formData, setFormData] = useState({
    employmentStatus: "",
    numberOfOccupants: "1",
    moveInDate: null as Date | null,
    message: "",
  });

  const updateField = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    try {
      // Validate required fields
      if (!formData.employmentStatus) {
        toast.error("Please select an employment status");
        return;
      }
      if (!formData.numberOfOccupants) {
        toast.error("Please enter number of occupants");
        return;
      }
      if (!formData.moveInDate) {
        toast.error("Please select a move-in date");
        return;
      }

      const payload = {
        propertyId: property.id,
        employment_status: formData.employmentStatus,
        number_of_occupants: formData.numberOfOccupants,
        move_in_date: formData.moveInDate,
        message: formData.message,
      };

      await withLoading(applyForProperty(payload));
      onApplySuccess("success");
      close();
    } catch (error: any) {
      const errorMessage = error?.status || "Failed to submit application";
      onApplySuccess("error", errorMessage);
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={close}
      size="lg"
      centered
      radius="md"
      title={
        <Text fw={900} size="xl" c="#008CDB">
          Apply for this Home
        </Text>
      }
      padding="xl"
    >
      <Stack gap="xl">
        {/* Property Summary - Simplified Style */}
        <Group
          wrap="nowrap"
          p="md"
          className="border border-gray-100 rounded-xl bg-gray-50"
        >
          <Image
            src={property?.gallery?.[0]}
            w={70}
            h={70}
            radius="md"
            alt={property.name}
            fallbackSrc="https://placehold.co/400?text=No+Image"
          />
          <div style={{ flex: 1 }}>
            <Text fw={700} size="sm" c="dark" lineClamp={1}>
              {property.name}
            </Text>
            <Text fw={800} size="md" c="#CF8205">
              {formatAmount(property.rent_amount)}{" "}
              <span className="text-[10px] font-normal text-gray-400">
                /year
              </span>
            </Text>
          </div>
        </Group>

        <form className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Employment Status"
              placeholder="Pick one"
              data={["Employed", "Self-Employed", "Student", "Other"]}
              value={formData.employmentStatus}
              onChange={(val) => updateField("employmentStatus", val)}
              variant="filled"
            />

            <TextInput
              label="Number of Occupants"
              type="number"
              min={1}
              value={formData.numberOfOccupants}
              onChange={(e) => updateField("numberOfOccupants", e.target.value)}
              variant="filled"
            />
          </div>

          <DatePickerInput
            label="Move-in Date"
            placeholder="Select a date"
            value={formData.moveInDate}
            onChange={(val) => updateField("moveInDate", val)}
            variant="filled"
            minDate={new Date()}
          />

          <Textarea
            label="Notes for the Landlord"
            placeholder="Introduce yourself briefly..."
            value={formData.message}
            onChange={(e) => updateField("message", e.target.value)}
            rows={3}
            variant="filled"
          />

          <Group
            gap="xs"
            p="sm"
            className="bg-blue-50/50 rounded-lg border border-blue-100"
          >
            <IconInfoCircle size={16} color="#008CDB" />
            <Text size="xs" c="dimmed">
              We'll use your email (<b>{user?.email}</b>) to send application
              updates.
            </Text>
          </Group>
        </form>

        <Group grow pt="md">
          <Button
            variant="subtle"
            color="gray"
            onClick={close}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            size="md"
            bg="#008CDB"
            onClick={handleSubmit}
            loading={loading}
            leftSection={<IconCheck size={18} />}
            className="hover:!bg-[#1e054a]"
          >
            Send Application
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}
