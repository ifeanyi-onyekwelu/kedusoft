import {
  Menu,
  Select,
  Group,
  TextInput,
  ActionIcon,
  Badge,
} from "@mantine/core";
import {
  IconDotsVertical,
  IconEye,
  IconSearch,
  IconFilter,
  IconMessage,
  IconTrash,
  IconCloudDownload,
  IconClock,
  IconInbox,
  IconFileSearch,
  IconMailForward,
  IconChecklist,
  IconCircleCheck,
  IconSend,
  IconSignature,
  IconX,
} from "@tabler/icons-react";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { formatDate } from "../../../../utils/helpers";
import { useMediaQuery } from "@mantine/hooks";

const Th: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
  <th className="text-md p-3 text-start font-medium text-gray-600">
    {children}
  </th>
);

const Td: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <td className="p-3 text-sm">{children}</td>
);

const StatusBadge = ({ status }: { status: Application["status"] }) => {
  const statusConfig = {
    received: {
      color: "gray",
      text: "Received",
      icon: <IconInbox size={14} />,
    },
    "under-review": {
      color: "blue",
      text: "Under Review",
      icon: <IconFileSearch size={14} />,
    },
    "screening-requested": {
      color: "orange",
      text: "Screening Requested",
      icon: <IconMailForward size={14} />,
    },
    "screening-in-progress": {
      color: "yellow",
      text: "Screening in Progress",
      icon: <IconClock size={14} />,
    },
    "screening-completed": {
      color: "indigo",
      text: "Screening Completed",
      icon: <IconChecklist size={14} />,
    },
    approved: {
      color: "green",
      text: "Approved",
      icon: <IconCircleCheck size={14} />,
    },
    "lease-sent": {
      color: "teal",
      text: "Lease Sent",
      icon: <IconSend size={14} />,
    },
    "lease-signed": {
      color: "violet",
      text: "Lease Signed",
      icon: <IconSignature size={14} />,
    },
    rejected: {
      color: "red",
      text: "Rejected",
      icon: <IconX size={14} />,
    },
  };

  const config = statusConfig[status];

  return (
    <Badge
      leftSection={config?.icon}
      variant="light"
      color={config?.color}
      className="capitalize"
    >
      {config?.text}
    </Badge>
  );
};

interface ApplicationTableProps {
  applications: Application[];
}

const Table: React.FC<ApplicationTableProps> = ({ applications }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");

  const filteredApplications = applications?.filter((app) => {
    const matchesSearch =
      app.property?.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.tenant?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.tenant?.lastName?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter ? app.status === statusFilter : true;

    return matchesSearch && matchesStatus;
  });

  const statusOptions = [
    {
      group: "Application Status",
      items: [
        { value: "received", label: "Received" },
        { value: "under-review", label: "Under Review" },
      ],
    },
    {
      group: "Screening Process",
      items: [
        { value: "screening-requested", label: "Screening Requested" },
        { value: "screening-in-progress", label: "Screening In Progress" },
        { value: "screening-completed", label: "Screening Completed" },
      ],
    },
    {
      group: "Final Status",
      items: [
        { value: "approved", label: "Approved" },
        { value: "lease-sent", label: "Lease Sent" },
        { value: "lease-signed", label: "Lease Signed" },
        { value: "rejected", label: "Rejected" },
      ],
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      {/* Filter Controls */}
      <div className="p-4 border-b">
        <Group>
          <TextInput
            placeholder="Search properties or applicants..."
            leftSection={<IconSearch size={16} />}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.currentTarget.value)}
            className="w-full md:w-64"
          />

          {isMobile ? (
            <ActionIcon
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
            >
              <IconFilter size={18} />
            </ActionIcon>
          ) : (
            <Select
              placeholder="Filter by status"
              data={statusOptions}
              value={statusFilter}
              onChange={setStatusFilter}
              clearable
              className="w-48"
            />
          )}
        </Group>

        {showFilters && isMobile && (
          <div className="mt-3">
            <Select
              placeholder="Filter by status"
              data={statusOptions}
              value={statusFilter}
              onChange={setStatusFilter}
              clearable
              className="w-48"
            />
          </div>
        )}
      </div>

      {/* Desktop Table */}
      {!isMobile && (
        <div className="overflow-x-auto">
          <table className="w-full border-separate border-spacing-0">
            <thead className="bg-gray-50">
              <tr>
                <Th>Property</Th>
                <Th>Applicant</Th>
                <Th>Date Applied</Th>
                <Th>Status</Th>
                <Th>Actions</Th>
              </tr>
            </thead>
            <tbody>
              {filteredApplications.length > 0 ? (
                filteredApplications.map((application) => (
                  <tr
                    key={application.application_id}
                    className="hover:bg-gray-50 border-b border-gray-100"
                  >
                    <Td>
                      <Link
                        to={`/property-owner/properties/${application.property_id}`}
                        className="font-medium text-blue-600 hover:underline"
                      >
                        {application.property?.address || "N/A"}
                      </Link>
                    </Td>
                    <Td>
                      <Link
                        to={`/property-owner/applications/applicants/${application.tenant_id}`}
                        className="font-medium text-blue-600 hover:underline"
                      >
                        {`${application.tenant?.firstName} ${application.tenant?.lastName}` ||
                          "N/A"}
                      </Link>
                    </Td>
                    <Td>
                      {application.created_at
                        ? formatDate(application.created_at)
                        : "N/A"}
                    </Td>
                    <Td>
                      <StatusBadge status={application.status} />
                    </Td>
                    <Td>
                      <Group gap="xs" justify="flex-start">
                        <ActionIcon
                          variant="subtle"
                          color="blue"
                          size="sm"
                          title="Download documents"
                        >
                          <IconCloudDownload size={18} />
                        </ActionIcon>
                        <Menu position="bottom-end" shadow="md" width={200}>
                          <Menu.Target>
                            <ActionIcon variant="subtle" size="sm">
                              <IconDotsVertical size={18} />
                            </ActionIcon>
                          </Menu.Target>
                          <Menu.Dropdown>
                            <Menu.Item
                              leftSection={<IconEye size={14} />}
                              component={Link}
                              to={`/property-owner/applications/${application.application_id}`}
                            >
                              View Details
                            </Menu.Item>
                            <Menu.Item leftSection={<IconMessage size={14} />}>
                              Message Applicant
                            </Menu.Item>
                            {application.status === "screening-requested" && (
                              <Menu.Item leftSection={<IconClock size={14} />}>
                                Invite to Screening
                              </Menu.Item>
                            )}
                            <Menu.Divider />
                            <Menu.Item
                              color="red"
                              leftSection={<IconTrash size={14} />}
                            >
                              Reject Application
                            </Menu.Item>
                          </Menu.Dropdown>
                        </Menu>
                      </Group>
                    </Td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-gray-500">
                    No applications found matching your criteria
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Mobile Card View */}
      {isMobile && (
        <div className="p-4 space-y-4">
          {filteredApplications.length > 0 ? (
            filteredApplications.map((application) => (
              <div
                key={application.application_id}
                className="border rounded-lg p-4 hover:shadow-sm transition-shadow"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <Link
                      to={`/property-owner/properties/${application.property_id}`}
                      className="font-medium text-blue-600 hover:underline"
                    >
                      {application.property?.address || "N/A"}
                    </Link>
                    <div className="mt-1 text-sm text-gray-600">
                      Applied:{" "}
                      {application.created_at
                        ? formatDate(application.created_at)
                        : "N/A"}
                    </div>
                  </div>
                  <StatusBadge status={application.status} />
                </div>

                <div className="mt-3">
                  <div className="text-sm font-medium">Applicant</div>
                  <Link
                    to={`/property-owner/applications/applicants/${application.tenant_id}`}
                    className="text-blue-600 hover:underline"
                  >
                    {`${application.tenant?.firstName} ${application.tenant?.lastName}` ||
                      "N/A"}
                  </Link>
                </div>

                <div className="mt-3 flex justify-between items-center">
                  <Group gap="xs">
                    <ActionIcon
                      variant="subtle"
                      color="blue"
                      size="sm"
                      title="Download documents"
                    >
                      <IconCloudDownload size={18} />
                    </ActionIcon>
                    <Menu position="bottom-end" shadow="md" width={200}>
                      <Menu.Target>
                        <ActionIcon variant="subtle" size="sm">
                          <IconDotsVertical size={18} />
                        </ActionIcon>
                      </Menu.Target>
                      <Menu.Dropdown>
                        <Menu.Item
                          leftSection={<IconEye size={14} />}
                          component={Link}
                          to={`/property-owner/applications/${application.application_id}`}
                        >
                          View Details
                        </Menu.Item>
                        <Menu.Item leftSection={<IconMessage size={14} />}>
                          Message Applicant
                        </Menu.Item>
                        {application.status === "screening-requested" && (
                          <Menu.Item leftSection={<IconClock size={14} />}>
                            Send Screening Reminder
                          </Menu.Item>
                        )}
                        <Menu.Divider />
                        <Menu.Item
                          color="red"
                          leftSection={<IconTrash size={14} />}
                        >
                          Reject Application
                        </Menu.Item>
                      </Menu.Dropdown>
                    </Menu>
                  </Group>
                </div>
              </div>
            ))
          ) : (
            <div className="py-8 text-center text-gray-500">
              No applications found matching your criteria
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Table;
