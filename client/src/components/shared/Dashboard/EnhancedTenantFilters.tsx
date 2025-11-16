import React, { useState } from "react";
import {
  Group,
  TextInput,
  Select,
  Button,
  ActionIcon,
  Collapse,
  Paper,
  Badge,
  MultiSelect,
  Stack,
} from "@mantine/core";
import {
  IconSearch,
  IconFilter,
  IconX,
  IconCalendar,
  IconClearAll,
  IconDownload,
  IconFileExport,
} from "@tabler/icons-react";
import { DatePickerInput } from "@mantine/dates";

interface TenantFilters {
  search: string;
  paymentStatus: string[];
  leaseStatus: string[];
  dateRange: [Date | null, Date | null];
  sortBy: string;
  sortOrder: "asc" | "desc";
  propertyType: string[];
}

interface EnhancedTenantFiltersProps {
  filters: TenantFilters;
  onChange: (filters: TenantFilters) => void;
  onExport?: () => void;
  onClearAll?: () => void;
  resultCount?: number;
}

const EnhancedTenantFilters: React.FC<EnhancedTenantFiltersProps> = ({
  filters,
  onChange,
  onExport,
  onClearAll,
  resultCount,
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const updateFilter = (key: keyof TenantFilters, value: any) => {
    onChange({ ...filters, [key]: value });
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.search) count++;
    if (filters.paymentStatus.length > 0) count++;
    if (filters.leaseStatus.length > 0) count++;
    if (filters.dateRange[0] || filters.dateRange[1]) count++;
    if (filters.propertyType.length > 0) count++;
    if (filters.sortBy !== "name") count++;
    return count;
  };

  const clearAllFilters = () => {
    onChange({
      search: "",
      paymentStatus: [],
      leaseStatus: [],
      dateRange: [null, null],
      sortBy: "name",
      sortOrder: "asc",
      propertyType: [],
    });
    setShowAdvanced(false);
    onClearAll?.();
  };

  const paymentStatusOptions = [
    { value: "paid", label: "Paid", color: "green" },
    { value: "unpaid", label: "Unpaid", color: "red" },
    { value: "overdue", label: "Overdue", color: "orange" },
    { value: "partial", label: "Partial Payment", color: "yellow" },
  ];

  const leaseStatusOptions = [
    { value: "active", label: "Active", color: "blue" },
    { value: "expired", label: "Expired", color: "red" },
    { value: "terminated", label: "Terminated", color: "gray" },
    { value: "pending", label: "Pending", color: "yellow" },
  ];

  const sortOptions = [
    { value: "name", label: "Name" },
    { value: "move_in_date", label: "Move-in Date" },
    { value: "rent_amount", label: "Rent Amount" },
    { value: "last_payment", label: "Last Payment" },
    { value: "lease_end", label: "Lease End Date" },
  ];

  const propertyTypeOptions = [
    { value: "apartment", label: "Apartment" },
    { value: "house", label: "House" },
    { value: "condo", label: "Condo" },
    { value: "studio", label: "Studio" },
    { value: "duplex", label: "Duplex" },
  ];

  return (
    <Paper className="p-4 bg-white rounded-lg shadow-sm">
      {/* Main Filter Row */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="flex flex-1 gap-3 items-center w-full md:w-auto">
          <TextInput
            placeholder="Search tenants..."
            leftSection={<IconSearch size={16} />}
            value={filters.search}
            onChange={(e) => updateFilter("search", e.currentTarget.value)}
            className="flex-1 md:w-64"
          />

          <ActionIcon
            variant={showAdvanced ? "filled" : "outline"}
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="relative"
          >
            <IconFilter size={16} />
            {getActiveFilterCount() > 0 && (
              <Badge
                size="xs"
                variant="filled"
                color="red"
                className="absolute -top-1 -right-1 min-w-[16px] h-4"
              >
                {getActiveFilterCount()}
              </Badge>
            )}
          </ActionIcon>

          {getActiveFilterCount() > 0 && (
            <ActionIcon
              variant="subtle"
              color="gray"
              onClick={clearAllFilters}
              title="Clear all filters"
            >
              <IconClearAll size={16} />
            </ActionIcon>
          )}
        </div>

        <div className="flex items-center gap-2">
          {resultCount !== undefined && (
            <Badge variant="light" color="blue" size="lg">
              {resultCount} tenants
            </Badge>
          )}

          <Button
            variant="outline"
            leftSection={<IconFileExport size={16} />}
            onClick={onExport}
            size="sm"
          >
            Export
          </Button>
        </div>
      </div>

      {/* Advanced Filters */}
      <Collapse in={showAdvanced}>
        <div className="mt-4 pt-4 border-t">
          <Stack gap="md">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <MultiSelect
                label="Payment Status"
                placeholder="Select statuses"
                data={paymentStatusOptions}
                value={filters.paymentStatus}
                onChange={(value) => updateFilter("paymentStatus", value)}
                clearable
              />

              <MultiSelect
                label="Lease Status"
                placeholder="Select statuses"
                data={leaseStatusOptions}
                value={filters.leaseStatus}
                onChange={(value) => updateFilter("leaseStatus", value)}
                clearable
              />

              <MultiSelect
                label="Property Type"
                placeholder="Select types"
                data={propertyTypeOptions}
                value={filters.propertyType}
                onChange={(value) => updateFilter("propertyType", value)}
                clearable
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <DatePickerInput
                type="range"
                label="Date Range"
                placeholder="Select date range"
                value={filters.dateRange}
                onChange={(value) => updateFilter("dateRange", value)}
                clearable
                leftSection={<IconCalendar size={16} />}
              />

              <div className="flex gap-2">
                <Select
                  label="Sort By"
                  data={sortOptions}
                  value={filters.sortBy}
                  onChange={(value) => updateFilter("sortBy", value || "name")}
                  className="flex-1"
                />
                <Select
                  label="Order"
                  data={[
                    { value: "asc", label: "Ascending" },
                    { value: "desc", label: "Descending" },
                  ]}
                  value={filters.sortOrder}
                  onChange={(value) =>
                    updateFilter("sortOrder", value || "asc")
                  }
                  className="w-32"
                />
              </div>
            </div>
          </Stack>
        </div>
      </Collapse>

      {/* Active Filters Display */}
      {getActiveFilterCount() > 0 && (
        <div className="mt-3 pt-3 border-t">
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-sm text-gray-600 font-medium">
              Active filters:
            </span>

            {filters.search && (
              <Badge
                variant="light"
                rightSection={
                  <ActionIcon
                    size="xs"
                    color="blue"
                    radius="xl"
                    variant="transparent"
                    onClick={() => updateFilter("search", "")}
                  >
                    <IconX size={10} />
                  </ActionIcon>
                }
              >
                Search: {filters.search}
              </Badge>
            )}

            {filters.paymentStatus.map((status) => (
              <Badge
                key={status}
                variant="light"
                color={
                  paymentStatusOptions.find((opt) => opt.value === status)
                    ?.color
                }
                rightSection={
                  <ActionIcon
                    size="xs"
                    color="blue"
                    radius="xl"
                    variant="transparent"
                    onClick={() =>
                      updateFilter(
                        "paymentStatus",
                        filters.paymentStatus.filter((s) => s !== status)
                      )
                    }
                  >
                    <IconX size={10} />
                  </ActionIcon>
                }
              >
                {
                  paymentStatusOptions.find((opt) => opt.value === status)
                    ?.label
                }
              </Badge>
            ))}

            {filters.leaseStatus.map((status) => (
              <Badge
                key={status}
                variant="light"
                color={
                  leaseStatusOptions.find((opt) => opt.value === status)?.color
                }
                rightSection={
                  <ActionIcon
                    size="xs"
                    color="blue"
                    radius="xl"
                    variant="transparent"
                    onClick={() =>
                      updateFilter(
                        "leaseStatus",
                        filters.leaseStatus.filter((s) => s !== status)
                      )
                    }
                  >
                    <IconX size={10} />
                  </ActionIcon>
                }
              >
                {leaseStatusOptions.find((opt) => opt.value === status)?.label}
              </Badge>
            ))}

            {(filters.dateRange[0] || filters.dateRange[1]) && (
              <Badge
                variant="light"
                rightSection={
                  <ActionIcon
                    size="xs"
                    color="blue"
                    radius="xl"
                    variant="transparent"
                    onClick={() => updateFilter("dateRange", [null, null])}
                  >
                    <IconX size={10} />
                  </ActionIcon>
                }
              >
                Date Range
              </Badge>
            )}
          </div>
        </div>
      )}
    </Paper>
  );
};

export default EnhancedTenantFilters;
