import {
  Modal,
  Button,
  TextInput,
  Textarea,
  Group,
  Checkbox,
} from "@mantine/core";
import { DateTimePicker } from "@mantine/dates";
import { useState } from "react";
import dayjs from "dayjs";

interface ScheduleTourModalProps {
  opened: boolean;
  close: () => void;
  property: Property;
}

export function ScheduleTourModal({
  opened,
  close,
  property,
}: ScheduleTourModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [date, setDate] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [agree, setAgree] = useState(false);

  const handleSubmit = () => {
    if (!name || !email || !phone || !date || !agree) {
      alert("Please fill all required fields.");
      return;
    }

    // API request goes here
    console.log({
      name,
      email,
      phone,
      date,
      message,
    });

    alert("Tour request sent successfully!");
    close();
  };

  return (
    <Modal
      opened={opened}
      onClose={close}
      title="Schedule a Tour"
      centered
      size="lg"
      overlayProps={{ backgroundOpacity: 0.45, blur: 2 }}
    >
      <div className="space-y-4">
        {/* Property Summary */}
        <div className="flex items-center gap-3 border rounded-lg p-3">
          <img
            src={property.gallery?.[0]}
            alt={property.name}
            className="w-16 h-16 object-cover rounded-md"
          />
          <div>
            <h3 className="font-semibold text-gray-900">{property.name}</h3>
            <p className="text-sm text-gray-600">{property.address}</p>
          </div>
        </div>

        {/* Form */}
        <TextInput
          label="Full Name"
          placeholder="Enter your full name"
          required
          value={name}
          onChange={(e) => setName(e.currentTarget.value)}
        />
        <TextInput
          label="Email"
          placeholder="Enter your email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.currentTarget.value)}
        />
        <TextInput
          label="Phone Number"
          placeholder="+234..."
          required
          value={phone}
          onChange={(e) => setPhone(e.currentTarget.value)}
        />

        <DateTimePicker
          label="Pick date and time"
          placeholder="Pick date and time"
          value={date}
          onChange={setDate}
          clearable
          presets={[
            {
              value: dayjs().subtract(1, "day").format("YYYY-MM-DD HH:mm:ss"),
              label: "Yesterday",
            },
            { value: dayjs().format("YYYY-MM-DD HH:mm:ss"), label: "Today" },
            {
              value: dayjs().add(1, "day").format("YYYY-MM-DD HH:mm:ss"),
              label: "Tomorrow",
            },
            {
              value: dayjs().add(1, "month").format("YYYY-MM-DD HH:mm:ss"),
              label: "Next month",
            },
            {
              value: dayjs().add(1, "year").format("YYYY-MM-DD HH:mm:ss"),
              label: "Next year",
            },
            {
              value: dayjs().subtract(1, "month").format("YYYY-MM-DD HH:mm:ss"),
              label: "Last month",
            },
            {
              value: dayjs().subtract(1, "year").format("YYYY-MM-DD HH:mm:ss"),
              label: "Last year",
            },
          ]}
        />

        <Textarea
          label="Message (Optional)"
          placeholder="Any notes for the landlord?"
          minRows={3}
          value={message}
          onChange={(e) => setMessage(e.currentTarget.value)}
        />

        <Checkbox
          label="I agree to be contacted by the landlord regarding this tour."
          checked={agree}
          onChange={(event) => setAgree(event.currentTarget.checked)}
        />

        {/* Actions */}
        <Group mt="md">
          <Button variant="outline" color="gray" onClick={close}>
            Cancel
          </Button>
          <Button color="indigo" onClick={handleSubmit}>
            Request Tour
          </Button>
        </Group>
      </div>
    </Modal>
  );
}
