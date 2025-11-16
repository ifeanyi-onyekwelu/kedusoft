import { Group, Text, Title, Select } from "@mantine/core";
import { IconCalendar } from "@tabler/icons-react";

interface DashboardHeaderProps {
  dateRange: "today" | "week" | "month" | "year";
  onDateRangeChange: (value: "today" | "week" | "month" | "year") => void;
}

export const DashboardHeader = ({
  dateRange,
  onDateRangeChange,
}: DashboardHeaderProps) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      <div>
        <Title order={2} className="mb-1">
          Dashboard Overview
        </Title>
        <Text size="sm" c="dimmed">
          Monitor your property portfolio performance
        </Text>
      </div>
      <Group gap="xs">
        <IconCalendar size={16} className="text-gray-500" />
        <Select
          value={dateRange}
          onChange={(value) => onDateRangeChange(value as any)}
          data={[
            { value: "today", label: "Today" },
            { value: "week", label: "This Week" },
            { value: "month", label: "This Month" },
            { value: "year", label: "This Year" },
          ]}
          size="sm"
          w={120}
          variant="filled"
        />
      </Group>
    </div>
  );
};
