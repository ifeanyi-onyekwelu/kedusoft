import { Menu, Select, Group, TextInput, ActionIcon } from "@mantine/core";
import {
  IconDotsVertical,
  IconEye,
  IconHome,
  IconSearch,
  IconFilter,
  IconMessage,
  IconTrash,
} from "@tabler/icons-react";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { formatDate } from "../../../../utils/helpers";
import { useMediaQuery } from "@mantine/hooks";

const Th: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
  <th className="text-sm text-start p-3 font-semibold text-gray-600">
    {children}
  </th>
);

const Td: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <td className="p-3 text-md">{children}</td>
);

const StatusBadge = ({ status }: { status: string }) => {
  const statusConfig: Record<string, { color: string; text: string }> = {
    // Application processing statuses
    pending: { color: "bg-gray-100 text-gray-800", text: "Pending Review" },
    "in-progress": {
      color: "bg-yellow-100 text-yellow-800",
      text: "In Progress",
    },

    // Final decision statuses
    accepted: { color: "bg-green-100 text-green-800", text: "Approved" },
    rejected: { color: "bg-red-100 text-red-800", text: "Rejected" },

    // Screening statuses
    screened: { color: "bg-blue-100 text-blue-800", text: "Screened" },
    unscreened: {
      color: "bg-purple-100 text-purple-800",
      text: "Not Screened",
    },
  };

  const config = statusConfig[status.toLowerCase()] || {
    color: "bg-gray-100 text-gray-800",
    text: status,
  };

  return (
    <span
      className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}
    >
      {config.text}
    </span>
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

  const filteredApplications = applications.filter((app) => {
    const matchesSearch =
      app.property.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.property.address.toLowerCase().includes(searchTerm.toLowerCase());

    // Handle screening status filter
    const isScreened = [
      "screening-completed",
      "screening-in-progress",
    ].includes(app.status);
    const matchesScreening =
      statusFilter === "screened"
        ? isScreened
        : statusFilter === "unscreened"
        ? !isScreened
        : true;

    // Handle application status filter
    const matchesStatus = [
      "pending",
      "in-progress",
      "accepted",
      "rejected",
    ].includes(statusFilter!)
      ? app.status === statusFilter
      : true;

    return matchesSearch && matchesScreening && matchesStatus;
  });

  const statusOptions = [
    { value: "unscreened", label: "Not Screened" },
    { value: "screened", label: "Screened" },
    { value: "pending", label: "Pending Review" },
    { value: "in-progress", label: "In Progress" },
    { value: "accepted", label: "Approved" },
    { value: "rejected", label: "Rejected" },
  ];

  console.log("Filtered Applications:", filteredApplications);

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      {/* Filter Controls */}
      <div className="p-4 border-b">
        <Group>
          <TextInput
            placeholder="Search properties..."
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
              className="w-full"
            />
          </div>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-separate border-spacing-0">
          <thead className="bg-gray-50">
            <tr>
              <Th>Property</Th>
              {!isMobile && (
                <>
                  <Th>Address</Th>
                  <Th>Date Applied</Th>
                  <Th>Last Updated</Th>
                  <Th>Status</Th>
                  <Th>Result</Th>
                </>
              )}
              <Th>Actions</Th>
            </tr>
          </thead>
          <tbody>
            {filteredApplications.length > 0 ? (
              filteredApplications.map((application) => (
                <tr
                  key={application?.application_id}
                  className="hover:bg-gray-50 border-b border-gray-100"
                >
                  <Td>
                    <div className="flex items-center space-x-2 py-3">
                      <div className="flex-shrink-0">
                        <IconHome className="text-primary" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">
                          <Link
                            to={`/properties/${application.property?.id}`}
                            className="hover:underline text-primary"
                          >
                            {application.property.name}
                          </Link>
                        </div>
                        {isMobile && (
                          <div className="text-xs text-gray-500 mt-1">
                            {formatDate(application.created_at)}
                          </div>
                        )}
                        {isMobile && (
                          <div className="mt-1">
                            <StatusBadge status={application.status} />
                          </div>
                        )}
                      </div>
                    </div>
                  </Td>

                  {!isMobile && (
                    <>
                      <Td>
                        <div className="text-gray-700">
                          {application.property.address}
                        </div>
                      </Td>
                      <Td>{formatDate(application.created_at)}</Td>
                      <Td>
                        {application.updated_at
                          ? formatDate(application.updated_at)
                          : "Not updated"}
                      </Td>
                      <Td>
                        <StatusBadge status={application.status} />
                      </Td>
                      <Td>
                        <div className="flex flex-col gap-1">
                          <span className="text-sm">
                            {application.status === "approved"
                              ? "✅ Approved"
                              : application.status === "rejected"
                              ? "❌ Rejected"
                              : application.status === "under-review"
                              ? "🔄 Under Review"
                              : application.status === "screening-in-progress"
                              ? "📋 Screening in Progress"
                              : application.status === "screening-completed"
                              ? "✓ Screening Complete"
                              : application.status === "lease-sent"
                              ? "📄 Lease Sent"
                              : application.status === "lease-signed"
                              ? "✅ Lease Signed"
                              : "⏳ Received"}
                          </span>
                          {application.status === "screening-requested" && (
                            <span className="text-xs text-violet-600">
                              Screening required
                            </span>
                          )}
                        </div>
                      </Td>
                    </>
                  )}

                  <Td>
                    <div className="flex justify-end space-x-1">
                      <Link to={`${application.application_id}`}>
                        <ActionIcon variant="subtle" color="blue" size="sm">
                          <IconEye size={18} />
                        </ActionIcon>
                      </Link>
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
                            to={`/tenants/applications/${application.application_id}`}
                          >
                            View Details
                          </Menu.Item>
                          <Menu.Item leftSection={<IconMessage size={14} />}>
                            Message Landlord
                          </Menu.Item>
                          <Menu.Divider />
                          <Menu.Item
                            color="red"
                            leftSection={<IconTrash size={14} />}
                          >
                            Cancel Application
                          </Menu.Item>
                        </Menu.Dropdown>
                      </Menu>
                    </div>
                  </Td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="py-8 text-center text-gray-500">
                  No applications found matching your criteria
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Table;
