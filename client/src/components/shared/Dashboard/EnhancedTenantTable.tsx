import React, { useState } from "react";
import {
  Menu,
  Badge,
  ActionIcon,
  Group,
  Text,
  Progress,
  Avatar,
  Tooltip,
  Alert,
} from "@mantine/core";
import {
  IconDotsVertical,
  IconFileDownload,
  IconEye,
  IconMessage,
  IconPhone,
  IconMail,
  IconCalendarDue,
  IconTrendingUp,
  IconTrendingDown,
  IconHome,
  IconCurrencyNaira,
  IconAlertTriangle,
  IconClock,
} from "@tabler/icons-react";
import { Link } from "react-router-dom";
import StatusBadge from "../../StatusBadge";
import { formatDate } from "../../../utils/helpers";

interface EnhancedTenant extends Tenant {
  move_in_date?: string;
  rent_amount?: number;
  property_type?: string;
  lease_end_date?: string;
  days_until_lease_end?: number;
  payment_history?: Array<{
    date: string;
    amount: number;
    status: string;
  }>;
}

const Th = ({
  children,
  sortable = false,
  onClick,
}: {
  children: React.ReactNode;
  sortable?: boolean;
  onClick?: () => void;
}) => (
  <th
    className={`text-xs p-3 font-medium text-left ${
      sortable ? "cursor-pointer hover:bg-gray-100" : ""
    }`}
    onClick={onClick}
  >
    {children}
  </th>
);

const Td = ({ children }: { children: React.ReactNode }) => (
  <td className="p-3 text-sm">{children}</td>
);

interface EnhancedTenantTableProps {
  data: EnhancedTenant[];
  onSort?: (field: string) => void;
  sortField?: string;
  sortDirection?: "asc" | "desc";
  showAdvancedInfo?: boolean;
}

const EnhancedTenantTable: React.FC<EnhancedTenantTableProps> = ({
  data,
  onSort,
  sortField,
  sortDirection,
  showAdvancedInfo = true,
}) => {
  const [selectedTenants, setSelectedTenants] = useState<string[]>([]);

  const handleSort = (field: string) => {
    onSort?.(field);
  };

  const getSortIcon = (field: string) => {
    if (sortField !== field) return null;
    return sortDirection === "asc" ? "↑" : "↓";
  };

  const getLeaseStatusColor = (daysUntilEnd?: number) => {
    if (!daysUntilEnd) return "gray";
    if (daysUntilEnd < 30) return "red";
    if (daysUntilEnd < 90) return "yellow";
    return "green";
  };

  const getPaymentTrend = (tenant: EnhancedTenant) => {
    // Mock payment trend - in real app this would come from payment history
    const isUpward = Math.random() > 0.5;
    const percentage = Math.floor(Math.random() * 20) + 1;

    return {
      direction: isUpward ? "up" : "down",
      percentage,
      icon: isUpward ? (
        <IconTrendingUp size={14} />
      ) : (
        <IconTrendingDown size={14} />
      ),
      color: isUpward ? "green" : "red",
    };
  };

  const renderTenantRow = (tenant: EnhancedTenant) => {
    const trend = getPaymentTrend(tenant);
    const leaseEndColor = getLeaseStatusColor(tenant.days_until_lease_end);

    return (
      <tr
        key={tenant.id}
        className="bg-white hover:bg-gray-50 transition-colors duration-200 border-b border-gray-100"
      >
        {/* Tenant Info */}
        <Td>
          <div className="flex items-center space-x-3">
            <Avatar size="sm" radius="xl">
              {tenant.name?.charAt(0).toUpperCase()}
            </Avatar>
            <div>
              <Link
                to={`/property-owner/tenants/${tenant.id}`}
                className="font-medium text-blue-600 hover:underline"
              >
                {tenant.name}
              </Link>
              <div className="text-xs text-gray-500 flex items-center gap-2">
                <IconMail size={12} />
                {tenant.email}
              </div>
              {showAdvancedInfo && tenant.phone && (
                <div className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                  <IconPhone size={12} />
                  {tenant.phone}
                </div>
              )}
            </div>
          </div>
        </Td>

        {/* Property Info */}
        <Td>
          <div>
            <div className="font-medium text-sm">
              {tenant.properties?.[0]?.address || "N/A"}
            </div>
            {tenant.properties && tenant.properties.length > 1 && (
              <div className="text-xs text-gray-500">
                +{tenant.properties.length - 1} more properties
              </div>
            )}
            {showAdvancedInfo && tenant.property_type && (
              <Badge size="xs" variant="light" color="blue" mt={2}>
                {tenant.property_type}
              </Badge>
            )}
          </div>
        </Td>

        {/* Lease Status */}
        <Td>
          <div className="space-y-1">
            <StatusBadge
              status={tenant.properties?.[0]?.lease?.status || "none"}
              variant="lease"
            />
            {showAdvancedInfo && tenant.days_until_lease_end && (
              <div className="flex items-center gap-1">
                <IconCalendarDue
                  size={12}
                  className={`text-${leaseEndColor}-600`}
                />
                <span className={`text-xs text-${leaseEndColor}-600`}>
                  {tenant.days_until_lease_end} days left
                </span>
              </div>
            )}
          </div>
        </Td>

        {/* Payment Status */}
        <Td>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <StatusBadge status={tenant.payment_status} variant="payment" />
              {showAdvancedInfo && (
                <Tooltip
                  label={`Payment trend: ${trend.direction} ${trend.percentage}%`}
                >
                  <ActionIcon size="xs" variant="subtle" color={trend.color}>
                    {trend.icon}
                  </ActionIcon>
                </Tooltip>
              )}
            </div>
            {showAdvancedInfo && tenant.rent_amount && (
              <div className="text-xs text-gray-600 flex items-center gap-1">
                <IconCurrencyNaira size={12} />₦
                {tenant.rent_amount.toLocaleString()}/month
              </div>
            )}
          </div>
        </Td>

        {/* Last Payment */}
        <Td>
          <div>
            {tenant.last_payment_date ? (
              <div>
                <div className="text-sm">
                  {formatDate(tenant.last_payment_date)}
                </div>
                {showAdvancedInfo && (
                  <div className="text-xs text-gray-500">
                    {Math.floor(
                      (new Date().getTime() -
                        new Date(tenant.last_payment_date).getTime()) /
                        (1000 * 60 * 60 * 24)
                    )}{" "}
                    days ago
                  </div>
                )}
              </div>
            ) : (
              <Badge color="gray" variant="light" size="sm">
                No payment
              </Badge>
            )}
          </div>
        </Td>

        {/* Move-in Date & Tenure */}
        {showAdvancedInfo && (
          <Td>
            <div>
              {tenant.move_in_date ? (
                <div>
                  <div className="text-sm">
                    {formatDate(tenant.move_in_date)}
                  </div>
                  <div className="text-xs text-gray-500">
                    {Math.floor(
                      (new Date().getTime() -
                        new Date(tenant.move_in_date).getTime()) /
                        (1000 * 60 * 60 * 24 * 30)
                    )}{" "}
                    months
                  </div>
                </div>
              ) : (
                "N/A"
              )}
            </div>
          </Td>
        )}

        {/* Actions */}
        <Td>
          <div className="flex items-center space-x-2">
            <Tooltip label="Download tenant report">
              <ActionIcon variant="subtle" size="sm">
                <IconFileDownload size={16} />
              </ActionIcon>
            </Tooltip>

            <Tooltip label="Send message">
              <ActionIcon variant="subtle" size="sm" color="blue">
                <IconMessage size={16} />
              </ActionIcon>
            </Tooltip>

            <Menu shadow="md" width={220}>
              <Menu.Target>
                <ActionIcon variant="subtle" size="sm">
                  <IconDotsVertical size={16} />
                </ActionIcon>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Item
                  leftSection={<IconEye size={16} />}
                  component={Link}
                  to={`/property-owner/tenants/${tenant.id}`}
                >
                  View Details
                </Menu.Item>
                <Menu.Item leftSection={<IconMessage size={16} />}>
                  Send Message
                </Menu.Item>
                <Menu.Item leftSection={<IconPhone size={16} />}>
                  Call Tenant
                </Menu.Item>
                <Menu.Divider />
                <Menu.Item leftSection={<IconCurrencyNaira size={16} />}>
                  Payment History
                </Menu.Item>
                <Menu.Item leftSection={<IconHome size={16} />}>
                  Property Details
                </Menu.Item>
                <Menu.Divider />
                <Menu.Item leftSection={<IconFileDownload size={16} />}>
                  Download Report
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </div>
        </Td>
      </tr>
    );
  };

  // Get tenants with lease ending soon
  const tenantsWithLeasesEndingSoon = data.filter(
    (tenant) => tenant.days_until_lease_end && tenant.days_until_lease_end < 60
  );

  return (
    <div className="space-y-4">
      {/* Alerts for leases ending soon */}
      {tenantsWithLeasesEndingSoon.length > 0 && (
        <Alert
          icon={<IconAlertTriangle size={16} />}
          title="Leases Ending Soon"
          color="orange"
          variant="light"
        >
          <div className="text-sm">
            {tenantsWithLeasesEndingSoon.length} tenant
            {tenantsWithLeasesEndingSoon.length > 1 ? "s have" : " has"} lease
            {tenantsWithLeasesEndingSoon.length > 1 ? "s" : ""} ending within 60
            days.
            <div className="mt-1 flex flex-wrap gap-1">
              {tenantsWithLeasesEndingSoon.slice(0, 3).map((tenant) => (
                <Badge
                  key={tenant.id}
                  size="xs"
                  variant="outline"
                  color="orange"
                >
                  {tenant.name} ({tenant.days_until_lease_end} days)
                </Badge>
              ))}
              {tenantsWithLeasesEndingSoon.length > 3 && (
                <Badge size="xs" variant="outline" color="gray">
                  +{tenantsWithLeasesEndingSoon.length - 3} more
                </Badge>
              )}
            </div>
          </div>
        </Alert>
      )}

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <Th sortable onClick={() => handleSort("name")}>
                  Tenant {getSortIcon("name")}
                </Th>
                <Th sortable onClick={() => handleSort("property")}>
                  Property {getSortIcon("property")}
                </Th>
                <Th>Lease Status</Th>
                <Th sortable onClick={() => handleSort("payment_status")}>
                  Payment Status {getSortIcon("payment_status")}
                </Th>
                <Th sortable onClick={() => handleSort("last_payment")}>
                  Last Payment {getSortIcon("last_payment")}
                </Th>
                {showAdvancedInfo && (
                  <Th sortable onClick={() => handleSort("move_in_date")}>
                    Move-in / Tenure {getSortIcon("move_in_date")}
                  </Th>
                )}
                <Th>Actions</Th>
              </tr>
            </thead>
            <tbody>
              {data.length > 0 ? (
                data.map(renderTenantRow)
              ) : (
                <tr>
                  <td
                    colSpan={showAdvancedInfo ? 7 : 6}
                    className="text-center py-8 text-gray-500"
                  >
                    <div className="flex flex-col items-center space-y-2">
                      <IconHome size={48} className="text-gray-300" />
                      <div>
                        <p className="font-medium">No tenants found</p>
                        <p className="text-sm">
                          Try adjusting your filters or search criteria
                        </p>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default EnhancedTenantTable;
