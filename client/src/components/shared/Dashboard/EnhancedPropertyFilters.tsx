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
  NumberInput,
  Stack,
  RangeSlider,
} from "@mantine/core";
import {
  IconSearch,
  IconFilter,
  IconX,
  IconCalendar,
  IconClearAll,
  IconFileExport,
  IconMapPin,
  IconHome,
  IconCurrencyNaira,
} from "@tabler/icons-react";
import { DatePickerInput } from "@mantine/dates";

interface PropertyFilters {
  search: string;
  status: string[];
  verification: string[];
  propertyType: string[];
  bedrooms: string[];
  priceRange: [number, number];
  location: string[];
  dateRange: [Date | null, Date | null];
  sortBy: string;
  sortOrder: "asc" | "desc";
}

interface EnhancedPropertyFiltersProps {
  filters: PropertyFilters;
  onChange: (filters: PropertyFilters) => void;
  onExport?: () => void;
  onClearAll?: () => void;
  resultCount?: number;
}

const EnhancedPropertyFilters: React.FC<EnhancedPropertyFiltersProps> = ({
  filters,
  onChange,
  onExport,
  onClearAll,
  resultCount,
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const updateFilter = (key: keyof PropertyFilters, value: any) => {
    onChange({ ...filters, [key]: value });
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.search) count++;
    if (filters.status.length > 0) count++;
    if (filters.verification.length > 0) count++;
    if (filters.propertyType.length > 0) count++;
    if (filters.bedrooms.length > 0) count++;
    if (filters.priceRange[0] > 0 || filters.priceRange[1] < 10000000) count++;
    if (filters.location.length > 0) count++;
    if (filters.dateRange[0] || filters.dateRange[1]) count++;
    if (filters.sortBy !== "name") count++;
    return count;
  };

  const clearAllFilters = () => {
    onChange({
      search: "",
      status: [],
      verification: [],
      propertyType: [],
      bedrooms: [],
      priceRange: [0, 10000000],
      location: [],
      dateRange: [null, null],
      sortBy: "name",
      sortOrder: "asc",
    });
    setShowAdvanced(false);
    onClearAll?.();
  };

  const statusOptions = [
    { value: "available", label: "Available", color: "green" },
    { value: "rented", label: "Rented", color: "blue" },
    { value: "maintenance", label: "Under Maintenance", color: "orange" },
    { value: "draft", label: "Draft", color: "gray" },
  ];

  const verificationOptions = [
    { value: "verified", label: "Verified", color: "green" },
    { value: "pending", label: "Pending", color: "yellow" },
    { value: "rejected", label: "Rejected", color: "red" },
  ];

  const propertyTypeOptions = [
    { value: "apartment", label: "Apartment" },
    { value: "house", label: "House" },
    { value: "condo", label: "Condo" },
    { value: "studio", label: "Studio" },
    { value: "duplex", label: "Duplex" },
    { value: "villa", label: "Villa" },
  ];

  const bedroomOptions = [
    { value: "1", label: "1 Bedroom" },
    { value: "2", label: "2 Bedrooms" },
    { value: "3", label: "3 Bedrooms" },
    { value: "4", label: "4 Bedrooms" },
    { value: "5+", label: "5+ Bedrooms" },
  ];

  const locationOptions = [
    { value: "lagos", label: "Lagos" },
    { value: "abuja", label: "Abuja" },
    { value: "port-harcourt", label: "Port Harcourt" },
    { value: "kano", label: "Kano" },
    { value: "ibadan", label: "Ibadan" },
  ];

  const sortOptions = [
    { value: "name", label: "Property Name" },
    { value: "rent_amount", label: "Rent Amount" },
    { value: "created_at", label: "Date Added" },
    { value: "bedrooms", label: "Bedrooms" },
    { value: "size_sqft", label: "Size" },
    { value: "year_built", label: "Year Built" },
  ];

  return (
    <Paper className="p-4 bg-white rounded-lg shadow-sm">
      {/* Main Filter Row */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="flex flex-1 gap-3 items-center w-full md:w-auto">
          <TextInput
            placeholder="Search properties..."
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
              {resultCount} properties
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
                label="Property Status"
                placeholder="Select status"
                data={statusOptions}
                value={filters.status}
                onChange={(value) => updateFilter("status", value)}
                clearable
                leftSection={<IconHome size={16} />}
              />

              <MultiSelect
                label="Verification Status"
                placeholder="Select verification"
                data={verificationOptions}
                value={filters.verification}
                onChange={(value) => updateFilter("verification", value)}
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
              <MultiSelect
                label="Bedrooms"
                placeholder="Select bedrooms"
                data={bedroomOptions}
                value={filters.bedrooms}
                onChange={(value) => updateFilter("bedrooms", value)}
                clearable
              />

              <MultiSelect
                label="Location"
                placeholder="Select locations"
                data={locationOptions}
                value={filters.location}
                onChange={(value) => updateFilter("location", value)}
                clearable
                leftSection={<IconMapPin size={16} />}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                  <IconCurrencyNaira size={16} />
                  Price Range (₦)
                </label>
                <RangeSlider
                  value={filters.priceRange}
                  onChange={(value) => updateFilter("priceRange", value)}
                  min={0}
                  max={10000000}
                  step={100000}
                  marks={[
                    { value: 0, label: "₦0" },
                    { value: 2500000, label: "₦2.5M" },
                    { value: 5000000, label: "₦5M" },
                    { value: 7500000, label: "₦7.5M" },
                    { value: 10000000, label: "₦10M+" },
                  ]}
                  className="mt-4"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-2">
                  <span>₦{filters.priceRange[0].toLocaleString()}</span>
                  <span>₦{filters.priceRange[1].toLocaleString()}</span>
                </div>
              </div>

              <DatePickerInput
                type="range"
                label="Date Range"
                placeholder="Select date range"
                value={filters.dateRange}
                onChange={(value) => updateFilter("dateRange", value)}
                clearable
                leftSection={<IconCalendar size={16} />}
              />
            </div>

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
                onChange={(value) => updateFilter("sortOrder", value || "asc")}
                className="w-32"
              />
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

            {filters.status.map((status) => (
              <Badge
                key={status}
                variant="light"
                color={statusOptions.find((opt) => opt.value === status)?.color}
                rightSection={
                  <ActionIcon
                    size="xs"
                    color="blue"
                    radius="xl"
                    variant="transparent"
                    onClick={() =>
                      updateFilter(
                        "status",
                        filters.status.filter((s) => s !== status)
                      )
                    }
                  >
                    <IconX size={10} />
                  </ActionIcon>
                }
              >
                {statusOptions.find((opt) => opt.value === status)?.label}
              </Badge>
            ))}

            {filters.verification.map((verification) => (
              <Badge
                key={verification}
                variant="light"
                color={
                  verificationOptions.find((opt) => opt.value === verification)
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
                        "verification",
                        filters.verification.filter((v) => v !== verification)
                      )
                    }
                  >
                    <IconX size={10} />
                  </ActionIcon>
                }
              >
                {
                  verificationOptions.find((opt) => opt.value === verification)
                    ?.label
                }
              </Badge>
            ))}

            {(filters.priceRange[0] > 0 ||
              filters.priceRange[1] < 10000000) && (
              <Badge
                variant="light"
                rightSection={
                  <ActionIcon
                    size="xs"
                    color="blue"
                    radius="xl"
                    variant="transparent"
                    onClick={() => updateFilter("priceRange", [0, 10000000])}
                  >
                    <IconX size={10} />
                  </ActionIcon>
                }
              >
                ₦{filters.priceRange[0].toLocaleString()} - ₦
                {filters.priceRange[1].toLocaleString()}
              </Badge>
            )}

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

export default EnhancedPropertyFilters;
