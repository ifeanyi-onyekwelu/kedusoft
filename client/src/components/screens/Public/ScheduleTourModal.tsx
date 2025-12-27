import { Modal, Button } from "@mantine/core";
import { DateTimePicker } from "@mantine/dates";
import {
  IconCalendarEvent,
  IconMapPin,
  IconX,
  IconCheck,
} from "@tabler/icons-react";
import { useState } from "react";
import dayjs from "dayjs";
import { toast } from "react-hot-toast";

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
  const [date, setDate] = useState<Date | null>(null);
  const [message, setMessage] = useState("");
  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!name.trim() || !email.trim() || !phone.trim() || !date || !agree) {
      toast.error("Please fill all required fields");
      return;
    }

    setLoading(true);
    try {
      // API request here
      console.log({
        property_id: property.id,
        name,
        email,
        phone,
        date: dayjs(date).format("YYYY-MM-DD HH:mm:ss"),
        message,
      });

      toast.success("Tour request sent successfully!");
      resetForm();
      close();
    } catch (error) {
      toast.error("Failed to schedule tour. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setName("");
    setEmail("");
    setPhone("");
    setDate(null);
    setMessage("");
    setAgree(false);
  };

  return (
    <Modal
      opened={opened}
      onClose={close}
      centered
      size="lg"
      overlayProps={{ backgroundOpacity: 0.5, blur: 3 }}
      classNames={{
        content: "!bg-white !shadow-2xl",
        header: "!bg-white !border-b !border-gray-200 !px-8 !py-6",
        title: "!font-black !text-2xl !text-[#290665]",
        close: "!text-gray-400 hover:!text-gray-600",
      }}
      title="Schedule a Property Tour"
    >
      <div className="px-8 pb-8 space-y-6">
        {/* Property Summary Card */}
        <div className="flex gap-4 p-4 bg-gradient-to-br from-[#290665]/5 to-[#CF8205]/5 border border-gray-200 rounded-xl">
          <div className="relative flex-shrink-0">
            <img
              src={property.gallery?.[0]}
              alt={property.name}
              className="w-20 h-20 object-cover rounded-lg"
            />
            <div className="absolute -bottom-1 -right-1 bg-[#CF8205] text-white rounded-full p-1">
              <IconCalendarEvent size={14} stroke={2.5} />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-gray-900 text-base mb-1 truncate">
              {property.name}
            </h3>
            <div className="flex items-start gap-2 text-sm text-gray-600">
              <IconMapPin
                size={16}
                className="flex-shrink-0 mt-0.5 text-[#CF8205]"
              />
              <span className="truncate">{property.address}</span>
            </div>
          </div>
        </div>

        {/* Form Fields */}
        <div className="space-y-4">
          {/* Name Field */}
          <div>
            <label className="block text-sm font-semibold text-[#290665] mb-2">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#CF8205] focus:ring-1 focus:ring-[#CF8205]/50 transition-all"
            />
          </div>

          {/* Email Field */}
          <div>
            <label className="block text-sm font-semibold text-[#290665] mb-2">
              Email Address <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#CF8205] focus:ring-1 focus:ring-[#CF8205]/50 transition-all"
            />
          </div>

          {/* Phone Field */}
          <div>
            <label className="block text-sm font-semibold text-[#290665] mb-2">
              Phone Number <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              placeholder="+234 (0) 80 0000 0000"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#CF8205] focus:ring-1 focus:ring-[#CF8205]/50 transition-all"
            />
          </div>

          {/* Date Time Picker */}
          <div>
            <label className="block text-sm font-semibold text-[#290665] mb-2">
              Preferred Date & Time <span className="text-red-500">*</span>
            </label>
            <DateTimePicker
              value={date}
              clearable
              placeholder="Select date and time"
              className="w-full"
              classNames={{
                input:
                  "!px-4 !py-3 !border-gray-200 focus:!border-[#CF8205] focus:!ring-[#CF8205]/50",
              }}
            />
          </div>

          {/* Message Field */}
          <div>
            <label className="block text-sm font-semibold text-[#290665] mb-2">
              Additional Message
            </label>
            <textarea
              placeholder="Tell the landlord about your tour preferences..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#CF8205] focus:ring-1 focus:ring-[#CF8205]/50 transition-all resize-none"
            />
          </div>

          {/* Agreement Checkbox */}
          <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-100 rounded-lg">
            <input
              type="checkbox"
              id="agree"
              checked={agree}
              onChange={(e) => setAgree(e.target.checked)}
              className="mt-1 w-5 h-5 accent-[#290665] cursor-pointer rounded border-gray-300"
            />
            <label
              htmlFor="agree"
              className="text-sm text-gray-700 cursor-pointer leading-relaxed"
            >
              I agree to be contacted by the landlord regarding this tour
              request.
            </label>
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
            Schedule Tour
          </Button>
        </div>
      </div>
    </Modal>
  );
}
