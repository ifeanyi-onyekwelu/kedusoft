import {
  Button,
  Stack,
  FileInput,
  Divider,
  Group,
  Text,
  Badge,
  Alert,
  Progress,
} from "@mantine/core";
import {
  IconUpload,
  IconFile,
  IconCheck,
  IconTrendingUp,
} from "@tabler/icons-react";
import { useState } from "react";
import { useLoading } from "../../../../hooks/useLoading";
import { showNotification } from "../../../../utils/helpers";

interface ScreeningStatus {
  name: string;
  status: "completed" | "pending" | "in-progress";
  score?: number;
  date?: string;
}

function TenantScreening() {
  const { loading, startLoading, stopLoading } = useLoading();
  const [screeningStatus, setScreeningStatus] = useState<ScreeningStatus[]>([
    {
      name: "Background Check",
      status: "completed",
      score: 95,
      date: "2024-02-15",
    },
    {
      name: "Credit Check",
      status: "in-progress",
    },
    {
      name: "Employment Verification",
      status: "pending",
    },
    {
      name: "Reference Check",
      status: "pending",
    },
  ]);

  const handleFileUpload = async (file: File | null) => {
    if (!file) return;

    try {
      startLoading();
      // TODO: Implement actual file upload API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      showNotification(
        "success",
        "Success!",
        "Document uploaded for screening"
      );
    } catch (error) {
      showNotification("error", "Error", "Failed to upload document");
    } finally {
      stopLoading();
    }
  };

  const getStatusColor = (status: string) => {
    if (status === "completed") return "green";
    if (status === "in-progress") return "blue";
    return "gray";
  };

  const getStatusIcon = (status: string) => {
    if (status === "completed")
      return <IconCheck size={16} className="text-green-600" />;
    return null;
  };

  const completedScreenings = screeningStatus.filter(
    (s) => s.status === "completed"
  ).length;
  const completionPercentage =
    (completedScreenings / screeningStatus.length) * 100;

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">Tenant Screening</h2>

      <Stack gap="xl">
        <Alert
          icon={<IconTrendingUp size={18} />}
          title="Screening Process"
          color="blue"
          variant="light"
        >
          Complete the screening process to improve your chances of getting
          approved by landlords and access premium properties.
        </Alert>

        <div>
          <h3 className="font-semibold mb-4 text-gray-800">
            Screening Progress
          </h3>
          <Group justify="space-between" mb="xs">
            <Text size="sm">
              {completedScreenings} of {screeningStatus.length} completed
            </Text>
            <Text size="sm" fw={500}>
              {Math.round(completionPercentage)}%
            </Text>
          </Group>
          <Progress value={completionPercentage} />
        </div>

        <div>
          <h3 className="font-semibold mb-4 text-gray-800">Screening Status</h3>

          <Stack gap="md">
            {screeningStatus.map((item) => (
              <Group
                justify="space-between"
                key={item.name}
                p="md"
                className="border border-gray-200 rounded-lg"
              >
                <Group gap="sm">
                  {getStatusIcon(item.status)}
                  <div>
                    <Text fw={500}>{item.name}</Text>
                    {item.date && (
                      <Text size="sm" c="dimmed">
                        Completed on {new Date(item.date).toLocaleDateString()}
                      </Text>
                    )}
                  </div>
                </Group>
                <Group gap="sm">
                  {item.score && (
                    <Badge color="green" variant="light">
                      Score: {item.score}%
                    </Badge>
                  )}
                  <Badge color={getStatusColor(item.status)} variant="light">
                    {item.status}
                  </Badge>
                </Group>
              </Group>
            ))}
          </Stack>
        </div>

        <Divider />

        <div>
          <h3 className="font-semibold mb-4 text-gray-800">
            Upload Supporting Documents
          </h3>
          <Stack gap="md">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">
                Employment Verification Letter
              </label>
              <FileInput
                placeholder="Upload employment letter"
                accept=".pdf,.doc,.docx"
                onChange={(file) => handleFileUpload(file)}
                leftSection={<IconUpload size={14} />}
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">
                Payslips or Income Proof
              </label>
              <FileInput
                placeholder="Upload recent payslips"
                accept=".pdf,.jpg,.png"
                onChange={(file) => handleFileUpload(file)}
                leftSection={<IconUpload size={14} />}
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">
                References
              </label>
              <FileInput
                placeholder="Upload reference letters"
                accept=".pdf,.doc,.docx"
                onChange={(file) => handleFileUpload(file)}
                leftSection={<IconUpload size={14} />}
              />
            </div>
          </Stack>
        </div>
      </Stack>
    </div>
  );
}

export default TenantScreening;
