import {
  Button,
  Stack,
  FileInput,
  Divider,
  Group,
  Text,
  Badge,
  Alert,
} from "@mantine/core";
import { IconUpload, IconFile, IconCheck } from "@tabler/icons-react";
import { useState } from "react";
import { useLoading } from "../../../../hooks/useLoading";
import { showNotification } from "../../../../utils/helpers";

interface Document {
  name: string;
  type: string;
  uploadedDate: string;
  status: "verified" | "pending" | "rejected";
}

function LandlordDocuments() {
  const { loading, startLoading, stopLoading } = useLoading();
  const [documents, setDocuments] = useState<Document[]>([
    {
      name: "Government ID",
      type: "identity",
      uploadedDate: "2024-01-15",
      status: "verified",
    },
    {
      name: "Business License",
      type: "business",
      uploadedDate: "2024-01-20",
      status: "verified",
    },
    {
      name: "Property Deed",
      type: "property",
      uploadedDate: "2024-02-01",
      status: "pending",
    },
  ]);

  const handleFileUpload = async (file: File | null, docType: string) => {
    if (!file) return;

    try {
      startLoading();
      // TODO: Implement actual file upload API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      showNotification(
        "success",
        "Success!",
        `${docType} uploaded successfully`
      );
    } catch (error) {
      showNotification("error", "Error", "Failed to upload document");
    } finally {
      stopLoading();
    }
  };

  const getStatusColor = (status: string) => {
    if (status === "verified") return "green";
    if (status === "pending") return "orange";
    return "red";
  };

  const getStatusIcon = (status: string) => {
    if (status === "verified")
      return <IconCheck size={16} className="text-green-600" />;
    return null;
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">Documents</h2>

      <Stack gap="xl">
        <Alert
          icon={<IconFile size={18} />}
          title="Important Documents"
          color="blue"
          variant="light"
        >
          Upload and maintain verified documents to improve your profile
          credibility and unlock advanced features.
        </Alert>

        <div>
          <h3 className="font-semibold mb-4 text-gray-800">Upload Documents</h3>

          <Stack gap="md">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">
                Government ID
              </label>
              <FileInput
                placeholder="Upload your government ID"
                accept="image/*,.pdf"
                onChange={(file) => handleFileUpload(file, "Government ID")}
                leftSection={<IconUpload size={14} />}
              />
              <Text size="xs" c="dimmed" mt="xs">
                Accepted: PDF, JPG, PNG (Max 10MB)
              </Text>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">
                Business License / Tax ID
              </label>
              <FileInput
                placeholder="Upload business license"
                accept="image/*,.pdf"
                onChange={(file) => handleFileUpload(file, "Business License")}
                leftSection={<IconUpload size={14} />}
              />
              <Text size="xs" c="dimmed" mt="xs">
                Accepted: PDF, JPG, PNG (Max 10MB)
              </Text>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">
                Property Deed / Ownership Proof
              </label>
              <FileInput
                placeholder="Upload property deed"
                accept="image/*,.pdf"
                onChange={(file) => handleFileUpload(file, "Property Deed")}
                leftSection={<IconUpload size={14} />}
              />
              <Text size="xs" c="dimmed" mt="xs">
                Accepted: PDF, JPG, PNG (Max 10MB)
              </Text>
            </div>
          </Stack>
        </div>

        <Divider />

        <div>
          <h3 className="font-semibold mb-4 text-gray-800">
            Uploaded Documents
          </h3>

          <Stack gap="md">
            {documents.map((doc) => (
              <Group
                justify="space-between"
                key={doc.name}
                p="md"
                className="border border-gray-200 rounded-lg"
              >
                <Group gap="sm">
                  <IconFile size={20} className="text-gray-400" />
                  <div>
                    <Text fw={500}>{doc.name}</Text>
                    <Text size="sm" c="dimmed">
                      Uploaded {new Date(doc.uploadedDate).toLocaleDateString()}
                    </Text>
                  </div>
                </Group>
                <Group gap="sm">
                  {getStatusIcon(doc.status)}
                  <Badge color={getStatusColor(doc.status)} variant="light">
                    {doc.status}
                  </Badge>
                </Group>
              </Group>
            ))}
          </Stack>
        </div>
      </Stack>
    </div>
  );
}

export default LandlordDocuments;
