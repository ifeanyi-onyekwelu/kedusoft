import { useState } from "react";
import {
  Paper,
  Title,
  Text,
  Button,
  Group,
  Grid,
  Card,
  Select,
  Stack,
} from "@mantine/core";
import {
  IconFileText,
  IconDownload,
  IconCalendar,
  IconCurrencyNaira,
  IconUsers,
  IconHome,
  IconReceipt,
  IconTrendingUp,
} from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";

interface ReportType {
  id: string;
  title: string;
  description: string;
  icon: any;
  color: string;
  bgColor: string;
}

function PropertyOwnerReports() {
  const [dateRange, setDateRange] = useState<string>("month");

  const reports: ReportType[] = [
    {
      id: "financial",
      title: "Financial Report",
      description: "Income, expenses, and revenue analysis",
      icon: IconCurrencyNaira,
      color: "#2f9e44",
      bgColor: "#ebfbee",
    },
    {
      id: "occupancy",
      title: "Occupancy Report",
      description: "Property occupancy rates and trends",
      icon: IconHome,
      color: "#1971c2",
      bgColor: "#e7f5ff",
    },
    {
      id: "tenant",
      title: "Tenant Report",
      description: "Tenant statistics and payment history",
      icon: IconUsers,
      color: "#7950f2",
      bgColor: "#f3f0ff",
    },
    {
      id: "transaction",
      title: "Transaction Report",
      description: "All payment transactions and records",
      icon: IconReceipt,
      color: "#f08c00",
      bgColor: "#fff4e6",
    },
    {
      id: "property",
      title: "Property Performance",
      description: "Individual property metrics and analytics",
      icon: IconTrendingUp,
      color: "#0c8599",
      bgColor: "#e3fafc",
    },
    {
      id: "maintenance",
      title: "Maintenance Report",
      description: "Maintenance requests and completion rates",
      icon: IconFileText,
      color: "#e64980",
      bgColor: "#fff0f6",
    },
  ];

  const handleGenerateReport = (reportType: string) => {
    notifications.show({
      title: "Generating Report",
      message: `Your ${reportType} report is being prepared...`,
      color: "blue",
    });
    // TODO: Implement actual report generation when backend endpoint is available
  };

  return (
    <div className="p-6">
      {/* Header */}
      <Group justify="space-between" mb="xl">
        <div>
          <Title order={2}>Reports & Analytics</Title>
          <Text size="sm" c="dimmed" mt={4}>
            Generate and export detailed business reports
          </Text>
        </div>
        <Select
          value={dateRange}
          onChange={(value) => setDateRange(value || "month")}
          data={[
            { value: "week", label: "Last 7 Days" },
            { value: "month", label: "Last 30 Days" },
            { value: "quarter", label: "Last 3 Months" },
            { value: "year", label: "Last Year" },
            { value: "custom", label: "Custom Range" },
          ]}
          leftSection={<IconCalendar size={18} />}
          w={180}
        />
      </Group>

      {/* Report Cards */}
      <Grid>
        {reports.map((report) => (
          <Grid.Col key={report.id} span={{ base: 12, sm: 6, md: 4 }}>
            <Card shadow="sm" p="lg" radius="md" withBorder className="h-full">
              <Stack gap="md">
                <Group justify="space-between">
                  <div
                    className="p-3 rounded-lg"
                    style={{ backgroundColor: report.bgColor }}
                  >
                    <report.icon size={28} style={{ color: report.color }} />
                  </div>
                </Group>

                <div>
                  <Text size="lg" fw={600} mb={4}>
                    {report.title}
                  </Text>
                  <Text size="sm" c="dimmed">
                    {report.description}
                  </Text>
                </div>

                <Button
                  variant="light"
                  fullWidth
                  leftSection={<IconDownload size={18} />}
                  onClick={() => handleGenerateReport(report.title)}
                >
                  Generate Report
                </Button>
              </Stack>
            </Card>
          </Grid.Col>
        ))}
      </Grid>

      {/* Quick Export Section */}
      <Paper shadow="sm" p="lg" radius="md" withBorder mt="xl">
        <Title order={3} mb="md">
          Quick Export
        </Title>
        <Text size="sm" c="dimmed" mb="lg">
          Export multiple reports at once for comprehensive analysis
        </Text>
        <Group>
          <Button leftSection={<IconDownload size={18} />}>
            Export All Reports
          </Button>
          <Button variant="light" leftSection={<IconFileText size={18} />}>
            Email Reports
          </Button>
        </Group>
      </Paper>
    </div>
  );
}

export default PropertyOwnerReports;
