import {
  IconUserCircle,
  IconPhone,
  IconMessageCircle,
  IconCheck,
} from "@tabler/icons-react";
import { Button, Text, Stack, Avatar, Badge } from "@mantine/core";
import { useState } from "react";

interface SidebarProps {
  property: any;
  openContactOwnerModal: () => void;
}

export default function Sidebar({
  property,
  openContactOwnerModal,
}: SidebarProps) {
  const [isVerified] = useState(true); // Can be dynamic from property data

  return (
    <aside className="sticky top-24 space-y-5">
      {/* Landlord Card */}
      <div className="p-6 border border-gray-200 rounded-xl bg-white shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between mb-5">
          <div>
            <Text
              size="xs"
              fw={700}
              c="#CF8205"
              tt="uppercase"
              letter-spacing={0.5}
            >
              Property Owner
            </Text>
          </div>
          {isVerified && (
            <Badge
              size="sm"
              bg="green"
              variant="light"
              color="white"
              leftSection={<IconCheck size={12} />}
            >
              Verified
            </Badge>
          )}
        </div>

        {/* Owner Profile */}
        <div className="flex items-center gap-3 mb-6 pb-5 border-b border-gray-100">
          <Avatar
            size="lg"
            radius="md"
            src={property.landlord?.avatar}
            color="#008CDB"
          >
            {property.landlord?.firstName?.[0]}
          </Avatar>
          <div className="flex-1 min-w-0">
            <Text fw={600} size="sm" c="#008CDB" truncate>
              {property.landlord?.firstName} {property.landlord?.lastName}
            </Text>
            <Text size="xs" c="dimmed">
              Active on Letsten
            </Text>
          </div>
        </div>

        {/* Action Buttons */}
        <Stack gap="sm">
          <Button
            fullWidth
            size="md"
            bg="#008CDB"
            onClick={openContactOwnerModal}
            leftSection={<IconPhone size={16} />}
            className="font-semibold"
            radius="md"
          >
            Schedule Tour
          </Button>
          <Button
            fullWidth
            variant="light"
            color="gray"
            size="md"
            leftSection={<IconMessageCircle size={16} />}
            className="font-semibold"
            radius="md"
          >
            Send Message
          </Button>
        </Stack>
      </div>

      {/* Quick Info Card */}
      <div className="p-5 bg-white border border-gray-200 rounded-xl">
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-4 border-b border-gray-100">
            <span className="text-sm text-gray-600">Listing ID</span>
            <code className="text-xs bg-gray-50 px-2.5 py-1 rounded text-gray-700 font-mono font-medium">
              {property.id?.toString().slice(0, 8).toUpperCase()}
            </code>
          </div>
          <div className="flex items-center justify-between pb-4 border-b border-gray-100">
            <span className="text-sm text-gray-600">Type</span>
            <span className="text-sm font-semibold text-gray-900 capitalize">
              {property.listing_type || "Rent"}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Posted</span>
            <span className="text-sm font-semibold text-gray-900">
              {property.created_at
                ? new Date(property.created_at).toLocaleDateString()
                : "Recently"}
            </span>
          </div>
        </div>
      </div>

      {/* Helpful Info */}
      <div className="p-4 bg-[#008CDB]/5 border border-[#008CDB]/20 rounded-lg">
        <p className="text-xs text-gray-700 leading-relaxed">
          💡 Tip: Landlord verification gives you peace of mind. Always verify
          property details before committing.
        </p>
      </div>
    </aside>
  );
}
