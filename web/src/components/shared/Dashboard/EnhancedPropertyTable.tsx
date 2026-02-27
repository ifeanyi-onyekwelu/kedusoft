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
  Image,
} from "@mantine/core";
import {
  IconDotsVertical,
  IconFileDownload,
  IconEye,
  IconEdit,
  IconTrash,
  IconHome,
  IconCurrencyNaira,
  IconMapPin,
  IconCalendar,
  IconUsers,
  IconBed,
  IconBath,
  IconRuler,
  IconAlertTriangle,
  IconStar,
  IconTrendingUp,
  IconTrendingDown,
} from "@tabler/icons-react";
import { Link } from "react-router-dom";
import StatusBadge from "../../StatusBadge";
import { formatDate } from "../../../utils/helpers";

interface EnhancedProperty {
  id: string;
  name: string;
  description: string;
  bedrooms: number;
  bathrooms: number;
  size_sqft?: number;
  address: string;
  city: string;
  state: string;
  rent_amount: number;
  is_available: boolean;
  verification_status: string;
  cover_image?: string;
  gallery: string[];
  occupancy_rate?: number;
  revenue_trend?: { direction: "up" | "down"; percentage: number };
  views_count?: number;
  applications_count?: number;
  avg_rating?: number;
  days_on_market?: number;
  last_maintenance_date?: string;
  tenant_info?: {
    name: string;
    move_in_date: string;
    lease_end_date: string;
  };
  status: string;
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

interface EnhancedPropertyTableProps {
  data: EnhancedProperty[];
  onSort?: (field: string) => void;
  sortField?: string;
  sortDirection?: "asc" | "desc";
  showAdvancedInfo?: boolean;
  viewMode?: "table" | "grid";
}

const EnhancedPropertyTable: React.FC<EnhancedPropertyTableProps> = ({
  data,
  onSort,
  sortField,
  sortDirection,
  showAdvancedInfo = true,
  viewMode = "table",
}) => {
  const [selectedProperties, setSelectedProperties] = useState<string[]>([]);

  const handleSort = (field: string) => {
    onSort?.(field);
  };

  const getSortIcon = (field: string) => {
    if (sortField !== field) return null;
    return sortDirection === "asc" ? "↑" : "↓";
  };

  const getOccupancyColor = (rate?: number) => {
    if (!rate) return "gray";
    if (rate >= 90) return "green";
    if (rate >= 70) return "yellow";
    return "red";
  };

  const getMarketTimeColor = (days?: number) => {
    if (!days) return "gray";
    if (days > 90) return "red";
    if (days > 30) return "yellow";
    return "green";
  };

  const renderPropertyRow = (property: EnhancedProperty) => {
    const occupancyColor = getOccupancyColor(property.occupancy_rate);
    const marketTimeColor = getMarketTimeColor(property.days_on_market);

    return (
      <tr
        key={property.id}
        className="bg-white hover:bg-gray-50 transition-colors duration-200 border-b border-gray-100"
      >
        {/* Property Info */}
        <Td>
          <div className="flex items-center space-x-3">
            {property.cover_image && (
              <Image
                src={property.cover_image}
                alt={property.name}
                width={60}
                height={45}
                className="rounded-lg object-cover"
                fallbackSrc="/images/property-placeholder.jpg"
              />
            )}
            <div className="flex-1">
              <Link
                to={`/property-owner/properties/${property.id}`}
                className="font-medium text-blue-600 hover:underline"
              >
                {property.name}
              </Link>
              <div className="text-xs text-gray-500 flex items-center gap-3 mt-1">
                <span className="flex items-center gap-1">
                  <IconBed size={12} />
                  {property.bedrooms} beds
                </span>
                <span className="flex items-center gap-1">
                  <IconBath size={12} />
                  {property.bathrooms} baths
                </span>
                {property.size_sqft && (
                  <span className="flex items-center gap-1">
                    <IconRuler size={12} />
                    {property.size_sqft} sqft
                  </span>
                )}
              </div>
              {showAdvancedInfo && property.avg_rating && (
                <div className="flex items-center gap-1 mt-1">
                  <IconStar size={12} className="text-yellow-500" />
                  <span className="text-xs text-gray-600">
                    {property.avg_rating}/5
                  </span>
                </div>
              )}
            </div>
          </div>
        </Td>

        {/* Location */}
        <Td>
          <div className="flex items-start gap-1">
            <IconMapPin size={14} className="text-gray-400 mt-0.5" />
            <div>
              <div className="text-sm">{property.address}</div>
              <div className="text-xs text-gray-500">
                {property.city}, {property.state}
              </div>
            </div>
          </div>
        </Td>

        {/* Rent & Revenue */}
        <Td>
          <div>
            <div className="font-medium flex items-center gap-1">
              <IconCurrencyNaira size={14} />₦
              {property.rent_amount.toLocaleString()}
            </div>
            <div className="text-xs text-gray-500">per month</div>
            {showAdvancedInfo && property.revenue_trend && (
              <div className="flex items-center gap-1 mt-1">
                {property.revenue_trend.direction === "up" ? (
                  <IconTrendingUp size={12} className="text-green-600" />
                ) : (
                  <IconTrendingDown size={12} className="text-red-600" />
                )}
                <span
                  className={`text-xs ${
                    property.revenue_trend.direction === "up"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {property.revenue_trend.percentage}%
                </span>
              </div>
            )}
          </div>
        </Td>

        {/* Status */}
        <Td>
          <div className="space-y-2">
            <StatusBadge
              status={
                (property.status as "available" | "rented") ||
                (property.is_available ? "available" : "rented")
              }
              variant="lease"
            />
            {showAdvancedInfo && property.tenant_info && (
              <div className="text-xs text-gray-600">
                <div>Tenant: {property.tenant_info.name}</div>
                <div>
                  Until: {formatDate(property.tenant_info.lease_end_date)}
                </div>
              </div>
            )}
            {showAdvancedInfo &&
              property.days_on_market &&
              property.is_available && (
                <Badge size="xs" color={marketTimeColor} variant="light">
                  {property.days_on_market} days on market
                </Badge>
              )}
          </div>
        </Td>

        {/* Performance Metrics */}
        {showAdvancedInfo && (
          <Td>
            <div className="space-y-2">
              {property.occupancy_rate !== undefined && (
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-gray-600">Occupancy</span>
                    <span className="text-xs font-medium">
                      {property.occupancy_rate}%
                    </span>
                  </div>
                  <Progress
                    value={property.occupancy_rate}
                    color={occupancyColor}
                    size="xs"
                  />
                </div>
              )}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-gray-500">Views:</span>
                  <span className="font-medium ml-1">
                    {property.views_count || 0}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500">Apps:</span>
                  <span className="font-medium ml-1">
                    {property.applications_count || 0}
                  </span>
                </div>
              </div>
            </div>
          </Td>
        )}

        {/* Verification */}
        <Td>
          <StatusBadge
            status={
              (property.verification_status as
                | "verified"
                | "pending"
                | "rejected") || "pending"
            }
            variant="verification"
          />
        </Td>

        {/* Actions */}
        <Td>
          <div className="flex items-center space-x-1">
            <Tooltip label="View property">
              <ActionIcon
                variant="subtle"
                size="sm"
                component={Link}
                to={`/property-owner/properties/${property.id}`}
              >
                <IconEye size={16} />
              </ActionIcon>
            </Tooltip>

            <Tooltip label="Edit property">
              <ActionIcon variant="subtle" size="sm" color="blue">
                <IconEdit size={16} />
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
                  to={`/property-owner/properties/${property.id}`}
                >
                  View Details
                </Menu.Item>
                <Menu.Item leftSection={<IconEdit size={16} />}>
                  Edit Property
                </Menu.Item>
                <Menu.Item leftSection={<IconUsers size={16} />}>
                  View Applications
                </Menu.Item>
                <Menu.Divider />
                <Menu.Item leftSection={<IconFileDownload size={16} />}>
                  Download Report
                </Menu.Item>
                <Menu.Item leftSection={<IconCalendar size={16} />}>
                  Schedule Maintenance
                </Menu.Item>
                <Menu.Divider />
                <Menu.Item color="red" leftSection={<IconTrash size={16} />}>
                  Delete Property
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </div>
        </Td>
      </tr>
    );
  };

  // Get properties needing attention
  const propertiesNeedingAttention = data.filter(
    (property) =>
      (property.days_on_market &&
        property.days_on_market > 60 &&
        property.is_available) ||
      (property.occupancy_rate && property.occupancy_rate < 70) ||
      property.verification_status === "rejected"
  );

  if (viewMode === "grid") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.map((property) => (
          <div
            key={property.id}
            className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow"
          >
            {property.cover_image && (
              <Image
                src={property.cover_image}
                alt={property.name}
                height={200}
                className="rounded-t-lg object-cover w-full"
                fallbackSrc="/images/property-placeholder.jpg"
              />
            )}
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <Link
                  to={`/property-owner/properties/${property.id}`}
                  className="font-semibold text-lg text-blue-600 hover:underline"
                >
                  {property.name}
                </Link>
                <StatusBadge
                  status={
                    (property.status as "available" | "rented") ||
                    (property.is_available ? "available" : "rented")
                  }
                  variant="lease"
                />
              </div>

              <div className="flex items-center gap-1 text-gray-600 mb-2">
                <IconMapPin size={14} />
                <span className="text-sm">{property.address}</span>
              </div>

              <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                <span className="flex items-center gap-1">
                  <IconBed size={14} />
                  {property.bedrooms} beds
                </span>
                <span className="flex items-center gap-1">
                  <IconBath size={14} />
                  {property.bathrooms} baths
                </span>
                {property.size_sqft && (
                  <span className="flex items-center gap-1">
                    <IconRuler size={14} />
                    {property.size_sqft} sqft
                  </span>
                )}
              </div>

              <div className="flex justify-between items-center">
                <div className="font-bold text-lg flex items-center gap-1">
                  <IconCurrencyNaira size={18} />₦
                  {property.rent_amount.toLocaleString()}
                </div>
                <div className="flex gap-1">
                  <ActionIcon
                    variant="subtle"
                    size="sm"
                    component={Link}
                    to={`/property-owner/properties/${property.id}`}
                  >
                    <IconEye size={16} />
                  </ActionIcon>
                  <ActionIcon variant="subtle" size="sm">
                    <IconEdit size={16} />
                  </ActionIcon>
                </div>
              </div>

              {showAdvancedInfo && (
                <div className="mt-3 pt-3 border-t">
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>Views: {property.views_count || 0}</div>
                    <div>Apps: {property.applications_count || 0}</div>
                  </div>
                  {property.occupancy_rate !== undefined && (
                    <div className="mt-2">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs text-gray-600">Occupancy</span>
                        <span className="text-xs font-medium">
                          {property.occupancy_rate}%
                        </span>
                      </div>
                      <Progress
                        value={property.occupancy_rate}
                        color={getOccupancyColor(property.occupancy_rate)}
                        size="xs"
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Alerts for properties needing attention */}
      {propertiesNeedingAttention.length > 0 && (
        <Alert
          icon={<IconAlertTriangle size={16} />}
          title="Properties Need Attention"
          color="orange"
          variant="light"
        >
          <div className="text-sm">
            {propertiesNeedingAttention.length} propert
            {propertiesNeedingAttention.length > 1
              ? "ies need"
              : "y needs"}{" "}
            attention.
            <div className="mt-1 flex flex-wrap gap-1">
              {propertiesNeedingAttention.slice(0, 3).map((property) => (
                <Badge
                  key={property.id}
                  size="xs"
                  variant="outline"
                  color="orange"
                >
                  {property.name}
                </Badge>
              ))}
              {propertiesNeedingAttention.length > 3 && (
                <Badge size="xs" variant="outline" color="gray">
                  +{propertiesNeedingAttention.length - 3} more
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
                  Property {getSortIcon("name")}
                </Th>
                <Th sortable onClick={() => handleSort("address")}>
                  Location {getSortIcon("address")}
                </Th>
                <Th sortable onClick={() => handleSort("rent_amount")}>
                  Rent {getSortIcon("rent_amount")}
                </Th>
                <Th>Status</Th>
                {showAdvancedInfo && <Th>Performance</Th>}
                <Th>Verification</Th>
                <Th>Actions</Th>
              </tr>
            </thead>
            <tbody>
              {data.length > 0 ? (
                data.map(renderPropertyRow)
              ) : (
                <tr>
                  <td
                    colSpan={showAdvancedInfo ? 7 : 6}
                    className="text-center py-8 text-gray-500"
                  >
                    <div className="flex flex-col items-center space-y-2">
                      <IconHome size={48} className="text-gray-300" />
                      <div>
                        <p className="font-medium">No properties found</p>
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

export default EnhancedPropertyTable;
