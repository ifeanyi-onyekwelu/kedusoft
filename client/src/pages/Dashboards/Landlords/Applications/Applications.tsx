import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Group,
  Pagination,
  TextInput,
  Select,
  Badge,
  ActionIcon,
  Card,
  Grid,
  Text,
  Title,
  Button,
  Menu,
  Tabs,
  Tooltip,
  Progress,
  Stack,
  ThemeIcon,
  Box,
  useMatches,
  Modal,
  Textarea,
} from "@mantine/core";
import {
  IconSearch,
  IconDownload,
  IconRefresh,
  IconEye,
  IconMessage,
  IconChecks,
  IconClock,
  IconX,
  IconUsers,
  IconClipboardCheck,
  IconFileText,
  IconDotsVertical,
  IconMail,
  IconSend,
} from "@tabler/icons-react";
import EmptyState from "../../../../components/EmptyState";
import { LoadingSpinner } from "../../../../components/LoadingSpinner";
import ConfirmationModal from "../../../../components/modals/ConfirmationModal";
import { useLandlordOperations } from "../../../../apis/landlordApi";
import { formatDate } from "../../../../utils/helpers";
import { useLoading } from "../../../../hooks/useLoading";
import { notifications } from "@mantine/notifications";

// Email Templates
const emailTemplates = {
  screening_invitation: {
    subject: "Invitation for Property Screening - {propertyName}",
    body: `Dear {tenantName},

Thank you for your application for {propertyName}. We would like to invite you for a screening process.

Please let us know your availability for the next few days so we can schedule a convenient time.

Best regards,
Property Management Team`,
  },
  application_update: {
    subject: "Application Status Update - {propertyName}",
    body: `Dear {tenantName},

We wanted to update you regarding your application for {propertyName}.

{customMessage}

If you have any questions, please don't hesitate to contact us.

Best regards,
Property Management Team`,
  },
  general_inquiry: {
    subject: "Regarding your application for {propertyName}",
    body: `Dear {tenantName},

I hope this message finds you well.

{customMessage}

Best regards,
Property Management Team`,
  },
};

// Email Modal Component
const EmailModal = ({
  opened,
  onClose,
  tenant,
  property,
  onSend,
}: {
  opened: boolean;
  onClose: () => void;
  tenant: any;
  property: any;
  onSend: (emailData: any) => Promise<void>;
}) => {
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (opened && tenant && property) {
      // Set default values when modal opens
      setSubject(`Regarding your application for ${property.name}`);
      setMessage("");
      setSelectedTemplate("");
    }
  }, [opened, tenant, property]);

  const handleTemplateChange = (templateKey: string) => {
    setSelectedTemplate(templateKey);
    if (
      templateKey &&
      emailTemplates[templateKey as keyof typeof emailTemplates]
    ) {
      const template =
        emailTemplates[templateKey as keyof typeof emailTemplates];

      // Replace placeholders
      const processedSubject = template.subject
        .replace("{propertyName}", property?.name || "")
        .replace(
          "{tenantName}",
          `${tenant?.firstName || ""} ${tenant?.lastName || ""}`.trim()
        );

      const processedBody = template.body
        .replace("{propertyName}", property?.name || "")
        .replace(
          "{tenantName}",
          `${tenant?.firstName || ""} ${tenant?.lastName || ""}`.trim()
        )
        .replace("{customMessage}", "");

      setSubject(processedSubject);
      setMessage(processedBody);
    }
  };

  const handleSend = async () => {
    if (!subject.trim() || !message.trim()) {
      notifications.show({
        title: "Validation Error",
        message: "Please fill in both subject and message fields",
        color: "red",
      });
      return;
    }

    setSending(true);
    try {
      await onSend({
        to: tenant.email,
        subject: subject.trim(),
        message: message.trim(),
        tenantId: tenant.id,
        propertyId: property.id,
      });

      notifications.show({
        title: "Email Sent",
        message: `Email sent successfully to ${tenant.firstName} ${tenant.lastName}`,
        color: "green",
      });

      onClose();
    } catch (error) {
      notifications.show({
        title: "Error",
        message: "Failed to send email. Please try again.",
        color: "red",
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Send Email to Tenant"
      size="lg"
    >
      <Stack gap="md">
        <TextInput
          label="To"
          value={tenant?.email || ""}
          disabled
          leftSection={<IconMail size={16} />}
        />

        <Select
          label="Email Template (Optional)"
          placeholder="Choose a template to get started"
          value={selectedTemplate}
          onChange={(value) => handleTemplateChange(value || "")}
          data={[
            { value: "screening_invitation", label: "Screening Invitation" },
            { value: "application_update", label: "Application Update" },
            { value: "general_inquiry", label: "General Inquiry" },
          ]}
          clearable
        />

        <TextInput
          label="Subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="Enter email subject"
          required
        />

        <Textarea
          label="Message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message here..."
          minRows={8}
          required
        />

        <Group justify="flex-end" gap="sm">
          <Button variant="outline" onClick={onClose} disabled={sending}>
            Cancel
          </Button>
          <Button
            leftSection={<IconSend size={16} />}
            onClick={handleSend}
            loading={sending}
          >
            Send Email
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
};

// Bulk Email Modal Component
const BulkEmailModal = ({
  opened,
  onClose,
  selectedApplications,
  onSend,
}: {
  opened: boolean;
  onClose: () => void;
  selectedApplications: any[];
  onSend: (emailData: any) => Promise<void>;
}) => {
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (opened) {
      setSubject("Update regarding your property application");
      setMessage("");
      setSelectedTemplate("");
    }
  }, [opened]);

  const handleTemplateChange = (templateKey: string) => {
    setSelectedTemplate(templateKey);
    if (
      templateKey &&
      emailTemplates[templateKey as keyof typeof emailTemplates]
    ) {
      const template =
        emailTemplates[templateKey as keyof typeof emailTemplates];
      setSubject(template.subject.replace("{propertyName}", "[Property Name]"));
      setMessage(
        template.body
          .replace("{propertyName}", "[Property Name]")
          .replace("{tenantName}", "[Tenant Name]")
          .replace("{customMessage}", "")
      );
    }
  };

  const handleSend = async () => {
    if (!subject.trim() || !message.trim()) {
      notifications.show({
        title: "Validation Error",
        message: "Please fill in both subject and message fields",
        color: "red",
      });
      return;
    }

    setSending(true);
    try {
      await onSend({
        subject: subject.trim(),
        message: message.trim(),
        recipients: selectedApplications,
        template_used: selectedTemplate,
      });

      notifications.show({
        title: "Bulk Email Sent",
        message: `Email sent successfully to ${selectedApplications.length} applicants`,
        color: "green",
      });

      onClose();
    } catch (error) {
      notifications.show({
        title: "Error",
        message: "Failed to send bulk email. Please try again.",
        color: "red",
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={`Send Bulk Email (${selectedApplications.length} recipients)`}
      size="lg"
    >
      <Stack gap="md">
        <div>
          <Text size="sm" fw={500} mb="xs">
            Recipients
          </Text>
          <Box
            p="sm"
            bg="gray.0"
            style={{ borderRadius: 4, maxHeight: 120, overflowY: "auto" }}
          >
            {selectedApplications.map((app, index) => (
              <Text key={index} size="sm">
                {app.tenant?.firstName} {app.tenant?.lastName} (
                {app.tenant?.email})
              </Text>
            ))}
          </Box>
        </div>

        <Select
          label="Email Template (Optional)"
          placeholder="Choose a template to get started"
          value={selectedTemplate}
          onChange={(value) => handleTemplateChange(value || "")}
          data={[
            { value: "screening_invitation", label: "Screening Invitation" },
            { value: "application_update", label: "Application Update" },
            { value: "general_inquiry", label: "General Inquiry" },
          ]}
          clearable
        />

        <TextInput
          label="Subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="Enter email subject"
          required
        />

        <Textarea
          label="Message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message here... Use [Tenant Name] and [Property Name] as placeholders"
          minRows={8}
          required
        />

        <Group justify="flex-end" gap="sm">
          <Button variant="outline" onClick={onClose} disabled={sending}>
            Cancel
          </Button>
          <Button
            leftSection={<IconSend size={16} />}
            onClick={handleSend}
            loading={sending}
          >
            Send to {selectedApplications.length} Recipients
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
};

// Enhanced Statistics Card Component
const StatCard = ({
  icon,
  label,
  value,
  change,
  changeType,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  change?: number;
  changeType?: "increase" | "decrease";
  color: string;
}) => (
  <Card shadow="sm" padding="lg" radius="md" withBorder>
    <Group justify="space-between" mb="xs">
      <ThemeIcon color={color} size={40} radius="md">
        {icon}
      </ThemeIcon>
      {change && (
        <Badge
          color={changeType === "increase" ? "green" : "red"}
          variant="light"
          size="sm"
        >
          {changeType === "increase" ? "+" : "-"}
          {change}%
        </Badge>
      )}
    </Group>
    <Text size="xs" c="dimmed" tt="uppercase" fw={700}>
      {label}
    </Text>
    <Text size="xl" fw={700}>
      {value.toLocaleString()}
    </Text>
  </Card>
);

// Mobile Card Component for Applications
const ApplicationCard = ({
  application,
  onAction,
}: {
  application: any;
  onAction: (action: string, id: string) => void;
}) => {
  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      received: "blue",
      "under-review": "yellow",
      under_review: "yellow",
      screening: "orange",
      approved: "green",
      rejected: "red",
      "lease-created": "teal",
      lease_created: "teal",
    };
    return colors[status] || "gray";
  };

  return (
    <Card shadow="sm" padding="md" radius="md" withBorder mb="md">
      <Stack gap="sm">
        {/* Applicant & Status */}
        <Group justify="space-between" align="flex-start">
          <Box>
            <Text size="sm" fw={600}>
              {application.applicant?.firstName ||
                application.tenant?.firstName}{" "}
              {application.applicant?.lastName || application.tenant?.lastName}
            </Text>
            <Text size="xs" c="dimmed">
              {application.applicant?.email || application.tenant?.email}
            </Text>
          </Box>
          <Badge
            color={getStatusColor(application.status)}
            variant="light"
            size="sm"
          >
            {application.status.replace("-", " ").toUpperCase()}
          </Badge>
        </Group>

        {/* Property Info */}
        <Box>
          <Text size="sm" fw={500}>
            {application.property?.name}
          </Text>
          <Text size="xs" c="dimmed">
            ₦{application.property?.rent_amount?.toLocaleString()}/month
          </Text>
        </Box>

        {/* Date */}
        <Text size="xs" c="dimmed">
          Applied: {formatDate(application.created_at)}
        </Text>

        {/* Actions */}
        <Group gap="xs" mt="xs">
          <Button
            variant="light"
            size="sm"
            leftSection={<IconEye size={16} />}
            onClick={() => onAction("view", application.id)}
            fullWidth
          >
            View Details
          </Button>
          <Button
            variant="light"
            color="green"
            size="sm"
            leftSection={<IconMessage size={16} />}
            onClick={() => onAction("message", application.id)}
            fullWidth
          >
            Message
          </Button>
        </Group>
        <Menu shadow="md" width="100%" position="bottom">
          <Menu.Target>
            <Button
              variant="light"
              color="gray"
              size="sm"
              fullWidth
              rightSection={<IconDotsVertical size={16} />}
            >
              More Actions
            </Button>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Label>Communication</Menu.Label>
            <Menu.Item
              leftSection={<IconMail size={16} />}
              onClick={() => onAction("email", application.id)}
            >
              Send Email
            </Menu.Item>
            <Menu.Divider />
            <Menu.Label>Actions</Menu.Label>
            <Menu.Item
              leftSection={<IconChecks size={16} />}
              color="green"
              onClick={() => onAction("approve", application.id)}
            >
              Approve Application
            </Menu.Item>
            <Menu.Item
              leftSection={<IconX size={16} />}
              color="red"
              onClick={() => onAction("reject", application.id)}
            >
              Reject Application
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Stack>
    </Card>
  );
};

// Desktop Table Row Component
const ApplicationTableRow = ({
  application,
  onAction,
}: {
  application: any;
  onAction: (action: string, id: string) => void;
}) => {
  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      received: "blue",
      "under-review": "yellow",
      under_review: "yellow",
      screening: "orange",
      approved: "green",
      rejected: "red",
      "lease-created": "teal",
      lease_created: "teal",
    };
    return colors[status] || "gray";
  };

  return (
    <tr className="hover:bg-blue-50/30 transition-colors border-b border-gray-100">
      <td className="p-4">
        <Box>
          <Text size="sm" fw={600} className="text-gray-900">
            {application.applicant?.firstName || application.tenant?.firstName}{" "}
            {application.applicant?.lastName || application.tenant?.lastName}
          </Text>
          <Text size="xs" c="dimmed" mt={2}>
            {application.applicant?.email || application.tenant?.email}
          </Text>
        </Box>
      </td>
      <td className="p-4">
        <Text
          size="sm"
          fw={500}
          className="text-gray-900"
          lineClamp={1}
          title={application.property?.name}
        >
          {application.property?.name}
        </Text>
      </td>
      <td className="p-4">
        <Badge
          color={getStatusColor(application.status)}
          variant="light"
          size="md"
          radius="sm"
          style={{ whiteSpace: "nowrap" }}
        >
          {application.status.replace("-", " ").toUpperCase()}
        </Badge>
      </td>
      <td className="p-4">
        <Text size="sm" fw={600} className="text-gray-900">
          ₦{application.property?.rent_amount?.toLocaleString()}
        </Text>
      </td>
      <td className="p-4">
        <Text size="sm" c="dimmed">
          {formatDate(application.created_at)}
        </Text>
      </td>
      <td className="p-4">
        <Group gap="sm" justify="flex-start" wrap="nowrap">
          <Button
            variant="light"
            size="sm"
            leftSection={<IconEye size={16} />}
            onClick={() => onAction("view", application.id)}
          >
            View
          </Button>
          <Button
            variant="light"
            color="green"
            size="sm"
            leftSection={<IconMessage size={16} />}
            onClick={() => onAction("message", application.id)}
          >
            Message
          </Button>
          <Menu shadow="md" width={200} position="bottom-end">
            <Menu.Target>
              <Button
                variant="light"
                color="gray"
                size="sm"
                rightSection={<IconDotsVertical size={16} />}
              >
                More
              </Button>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Label>Communication</Menu.Label>
              <Menu.Item
                leftSection={<IconMail size={16} />}
                onClick={() => onAction("email", application.id)}
              >
                Send Email
              </Menu.Item>
              <Menu.Divider />
              <Menu.Label>Actions</Menu.Label>
              <Menu.Item
                leftSection={<IconChecks size={16} />}
                color="green"
                onClick={() => onAction("approve", application.id)}
              >
                Approve Application
              </Menu.Item>
              <Menu.Item
                leftSection={<IconX size={16} />}
                color="red"
                onClick={() => onAction("reject", application.id)}
              >
                Reject Application
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>
      </td>
    </tr>
  );
};

function Applications() {
  const navigate = useNavigate();
  const [applications, setApplications] = useState<any[]>([]);
  const [filteredApplications, setFilteredApplications] = useState<any[]>([]);
  const [pagination, setPagination] = useState<Record<string, number>>({
    page: 1,
    limit: 10,
    total: 0,
    pages: 1,
  });
  const [stats, setStats] = useState<Record<string, number>>({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    screening: 0,
  });
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<string>("created_at");
  const [activeTab, setActiveTab] = useState<string>("all");
  const [confirmationModal, setConfirmationModal] = useState<{
    opened: boolean;
    title: string;
    message: string;
    type: "danger" | "warning" | "success" | "info";
    confirmText: string;
    action: (() => Promise<void>) | null;
  }>({
    opened: false,
    title: "",
    message: "",
    type: "warning",
    confirmText: "Confirm",
    action: null,
  });
  const [actionLoading, setActionLoading] = useState(false);
  const [emailModal, setEmailModal] = useState<{
    opened: boolean;
    tenant: any;
    property: any;
  }>({
    opened: false,
    tenant: null,
    property: null,
  });
  const [bulkEmailModal, setBulkEmailModal] = useState(false);
  const [selectedApplications, setSelectedApplications] = useState<any[]>([]);
  const { loading, withLoading } = useLoading();

  // Use responsive breakpoint
  const isMobile = useMatches({
    base: true,
    sm: true,
    md: false,
  });

  const {
    getAllApplications,
    getApplicationStats,
    rejectApplication,
    approveApplication,
  } = useLandlordOperations();

  const fetchApplications = async (page = 1) => {
    const { applications } = await withLoading(
      getAllApplications({
        page,
        limit: pagination.limit,
        status: statusFilter || undefined,
      })
    );

    setApplications(applications);
    setFilteredApplications(applications);
    setPagination({
      page,
      limit: pagination.limit,
      total: applications["total"] || 0,
      pages: applications["pages"] || 1,
    });
  };

  const fetchStats = async () => {
    const response = await getApplicationStats();
    setStats(response);
  };

  const fetchAll = async () => {
    await Promise.all([fetchApplications(), fetchStats()]);
  };

  // Filter applications based on search and status
  useEffect(() => {
    let filtered = applications;

    if (searchQuery) {
      filtered = filtered.filter(
        (app) =>
          app.tenant?.firstName
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          app.tenant?.lastName
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          app.tenant?.email
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          app.property?.name?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (statusFilter) {
      filtered = filtered.filter((app) => app.status === statusFilter);
    }

    setFilteredApplications(filtered);
  }, [applications, searchQuery, statusFilter]);

  useEffect(() => {
    fetchAll();
  }, []);

  const handlePageChange = (page: number) => {
    fetchApplications(page);
  };

  const handleSendEmail = async (emailData: any) => {
    try {
      // For now, we'll use a simple approach - open the user's email client
      // This can be enhanced later with a backend email API
      const mailtoLink = `mailto:${emailData.to}?subject=${encodeURIComponent(
        emailData.subject
      )}&body=${encodeURIComponent(emailData.message)}`;
      window.open(mailtoLink);

      // Log the email action for tracking (could be sent to backend)
      console.log("Email composed:", emailData);

      return Promise.resolve();
    } catch (error) {
      console.error("Failed to compose email:", error);
      throw error;
    }
  };

  // Export Applications to CSV
  const handleExportApplications = () => {
    try {
      const csvData = filteredApplications.map((app) => ({
        "Tenant Name": `${app.tenant?.firstName || ""} ${
          app.tenant?.lastName || ""
        }`,
        Email: app.tenant?.email || "",
        Phone: app.tenant?.phone || "",
        Property: app.property?.name || "",
        "Property Address": app.property?.address || "",
        "Rent Amount": app.property?.rent_amount || "",
        "Application Status": app.status || "",
        "Application Date": app.created_at
          ? new Date(app.created_at).toLocaleDateString()
          : "",
        "Viewed Date": app.viewed_at
          ? new Date(app.viewed_at).toLocaleDateString()
          : "Not viewed",
      }));

      // Convert to CSV
      const headers = Object.keys(csvData[0] || {});
      const csvContent = [
        headers.join(","),
        ...csvData.map((row) =>
          headers
            .map((header) => `"${row[header as keyof typeof row] || ""}"`)
            .join(",")
        ),
      ].join("\n");

      // Download CSV
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute(
          "download",
          `applications_export_${new Date().toISOString().split("T")[0]}.csv`
        );
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }

      notifications.show({
        title: "Export Successful",
        message: `Exported ${filteredApplications.length} applications to CSV`,
        color: "green",
      });
    } catch (error) {
      notifications.show({
        title: "Export Failed",
        message: "Failed to export applications. Please try again.",
        color: "red",
      });
    }
  };

  // Handle Bulk Email
  const handleBulkEmail = async (emailData: any) => {
    try {
      // For each recipient, open a mailto link (or implement proper bulk email backend)
      for (const app of emailData.recipients) {
        const personalizedSubject = emailData.subject
          .replace("[Property Name]", app.property?.name || "")
          .replace(
            "[Tenant Name]",
            `${app.tenant?.firstName || ""} ${app.tenant?.lastName || ""}`
          );

        const personalizedMessage = emailData.message
          .replace("[Property Name]", app.property?.name || "")
          .replace(
            "[Tenant Name]",
            `${app.tenant?.firstName || ""} ${app.tenant?.lastName || ""}`
          );

        // For now, we'll log this - in production, you'd send via backend
        console.log(`Email to ${app.tenant?.email}:`, {
          subject: personalizedSubject,
          message: personalizedMessage,
        });
      }

      // In a real implementation, you'd make a single API call to send all emails
      // await landlordApi.sendBulkEmail(emailData);

      return Promise.resolve();
    } catch (error) {
      console.error("Failed to send bulk email:", error);
      throw error;
    }
  };

  // Quick action handlers
  const handleQuickAction = (action: string) => {
    console.log("handleQuickAction called with:", action);
    switch (action) {
      case "export":
        handleExportApplications();
        break;
      case "bulk-email":
        if (filteredApplications.length === 0) {
          notifications.show({
            title: "No Applications",
            message: "No applications available to send bulk email",
            color: "orange",
          });
          return;
        }
        console.log("Setting bulkEmailModal to true");
        setSelectedApplications(filteredApplications);
        setBulkEmailModal(true);
        break;
      default:
        console.log("Unknown action:", action);
    }
  };

  const showConfirmation = (
    title: string,
    message: string,
    type: "danger" | "warning" | "success" | "info",
    confirmText: string,
    action: () => Promise<void>
  ) => {
    setConfirmationModal({
      opened: true,
      title,
      message,
      type,
      confirmText,
      action,
    });
  };

  const handleConfirmAction = async () => {
    if (confirmationModal.action) {
      setActionLoading(true);
      try {
        await confirmationModal.action();
        setConfirmationModal({ ...confirmationModal, opened: false });
        await fetchAll(); // Refresh data
      } catch (error) {
        console.error("Action failed:", error);
      } finally {
        setActionLoading(false);
      }
    }
  };

  const handleAction = async (action: string, applicationId: string) => {
    const application = applications.find((app) => app.id === applicationId);
    if (!application) return;

    switch (action) {
      case "view":
        navigate(
          `/property-owner/applications/${applicationId}/${application.property_id}`
        );
        break;

      case "viewApplicant":
        navigate(
          `/property-owner/applications/applicants/${application.tenant_id}`
        );
        break;

      case "message":
        // Navigate to messaging with tenant
        navigate(`/property-owner/messages?tenant=${application.tenant?.id}`);
        break;

      case "email":
        // Open email modal with tenant and property information
        setEmailModal({
          opened: true,
          tenant: application.tenant,
          property: application.property,
        });
        break;

      case "reject":
        showConfirmation(
          "Reject Application",
          `Are you sure you want to reject ${application.tenant?.firstName} ${application.tenant?.lastName}'s application for ${application.property?.name}? This action cannot be undone.`,
          "warning",
          "Reject Application",
          async () => {
            await rejectApplication(applicationId);
            notifications.show({
              title: "Application Rejected",
              message: `${application.tenant?.firstName} ${application.tenant?.lastName}'s application has been rejected.`,
              color: "green",
            });
          }
        );
        break;

      case "approve":
        showConfirmation(
          "Approve Application & Invite for Screening",
          `Are you sure you want to approve ${application.tenant?.firstName} ${application.tenant?.lastName}'s application for ${application.property?.name}? This will invite them for screening and send them an email notification.`,
          "success",
          "Approve & Invite for Screening",
          async () => {
            try {
              // Approve application and create screening invitation
              await approveApplication(applicationId, {
                notes: "Application approved and tenant invited for screening",
              });

              notifications.show({
                title: "Application Approved",
                message: `${application.tenant?.firstName} ${application.tenant?.lastName} has been invited for screening. They can complete it anytime online.`,
                color: "green",
              });

              // Refresh applications to show updated status
              await fetchApplications(pagination.page);
            } catch (error) {
              notifications.show({
                title: "Error",
                message:
                  "Failed to approve application and create screening. Please try again.",
                color: "red",
              });
              console.error("Error approving application:", error);
            }
          }
        );
        break;

      default:
        console.log(
          `Unknown action: ${action} for application: ${applicationId}`
        );
    }
  };

  const handleTabChange = (value: string | null) => {
    const tabValue = value || "all";
    setActiveTab(tabValue);
    setStatusFilter(tabValue === "all" ? null : tabValue);
  };

  const handleRefresh = () => {
    fetchAll();
  };

  if (loading)
    return <LoadingSpinner fullScreen label="Fetching applications" />;

  return (
    <div className="space-y-6 p-3 sm:p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <Box>
            <Title order={2} className="text-gray-900">
              Applications Management
            </Title>
            <Text size="sm" c="dimmed">
              Manage and track all property applications
            </Text>
          </Box>
          <Group gap="sm">
            <Button
              leftSection={<IconRefresh size={16} />}
              variant="light"
              onClick={handleRefresh}
              loading={loading}
              size={isMobile ? "sm" : "md"}
            >
              {isMobile ? "" : "Refresh"}
            </Button>
          </Group>
        </div>
      </div>

      {/* Statistics Dashboard */}
      <Grid>
        <Grid.Col span={{ base: 12, sm: 6, lg: 3 }}>
          <StatCard
            icon={<IconUsers size={20} />}
            label="Total Applications"
            value={stats.total}
            change={12}
            changeType="increase"
            color="blue"
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, sm: 6, lg: 3 }}>
          <StatCard
            icon={<IconClock size={20} />}
            label="Pending Review"
            value={stats.pending}
            change={5}
            changeType="decrease"
            color="yellow"
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, sm: 6, lg: 3 }}>
          <StatCard
            icon={<IconChecks size={20} />}
            label="Approved"
            value={stats.approved}
            change={8}
            changeType="increase"
            color="green"
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, sm: 6, lg: 3 }}>
          <StatCard
            icon={<IconClipboardCheck size={20} />}
            label="In Screening"
            value={stats.screening}
            change={3}
            changeType="increase"
            color="orange"
          />
        </Grid.Col>
      </Grid>

      {/* Main Content - Full Width */}
      <div>
        <Card shadow="sm" padding="lg" radius="md" withBorder mb="md">
          {/* Filters and Search */}
          <Card shadow="sm" padding="lg" radius="md" withBorder mb="md">
            <Stack gap="md">
              <Group justify="space-between" align="flex-start">
                <Title order={4}>Applications</Title>
              </Group>

              {/* Search and Sort Controls */}
              <Group gap="sm" align="flex-end">
                <TextInput
                  placeholder="Search applications..."
                  leftSection={<IconSearch size={16} />}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ flex: 1, minWidth: 200 }}
                  size={isMobile ? "sm" : "md"}
                />
                <Select
                  placeholder="Sort by"
                  data={[
                    { value: "created_at", label: "Date Created" },
                    { value: "updated_at", label: "Last Updated" },
                    { value: "tenant_name", label: "Tenant Name" },
                    { value: "property_name", label: "Property Name" },
                  ]}
                  value={sortBy}
                  onChange={(value) => setSortBy(value || "created_at")}
                  size={isMobile ? "sm" : "md"}
                  style={{ minWidth: 150 }}
                />
              </Group>

              {/* Status Tabs */}
              <Tabs value={activeTab} onChange={handleTabChange}>
                <Tabs.List>
                  <Tabs.Tab value="all">All ({stats.total})</Tabs.Tab>
                  <Tabs.Tab value="received">
                    Received ({stats.received || stats.total})
                  </Tabs.Tab>
                  <Tabs.Tab value="screening">
                    Screening ({stats.screening})
                  </Tabs.Tab>
                  <Tabs.Tab value="approved">
                    Approved ({stats.approved})
                  </Tabs.Tab>
                  <Tabs.Tab value="rejected">
                    Rejected ({stats.rejected})
                  </Tabs.Tab>
                </Tabs.List>
              </Tabs>
            </Stack>
          </Card>

          {/* Applications Display */}
          {loading ? (
            <LoadingSpinner label="Fetching Applications" />
          ) : filteredApplications.length > 0 ? (
            <>
              {/* Mobile Card View */}
              {isMobile ? (
                <Stack gap="md">
                  {filteredApplications.map((application) => (
                    <ApplicationCard
                      key={application.id}
                      application={application}
                      onAction={handleAction}
                    />
                  ))}
                </Stack>
              ) : (
                /* Desktop Table View */
                <Card shadow="sm" padding={0} radius="md" withBorder>
                  <Box style={{ overflowX: "auto" }}>
                    <table className="w-full min-w-[900px]">
                      <thead className="bg-gray-100 border-b-2 border-gray-200">
                        <tr>
                          <th
                            className="text-left p-4 font-semibold text-gray-700 text-sm uppercase tracking-wide"
                            style={{ width: "20%" }}
                          >
                            Applicant
                          </th>
                          <th
                            className="text-left p-4 font-semibold text-gray-700 text-sm uppercase tracking-wide"
                            style={{ width: "15%" }}
                          >
                            Property
                          </th>
                          <th
                            className="text-left p-4 font-semibold text-gray-700 text-sm uppercase tracking-wide"
                            style={{ width: "12%" }}
                          >
                            Status
                          </th>
                          <th
                            className="text-left p-4 font-semibold text-gray-700 text-sm uppercase tracking-wide"
                            style={{ width: "12%" }}
                          >
                            Rent/Month
                          </th>
                          <th
                            className="text-left p-4 font-semibold text-gray-700 text-sm uppercase tracking-wide"
                            style={{ width: "12%" }}
                          >
                            Date Applied
                          </th>
                          <th
                            className="text-left p-4 font-semibold text-gray-700 text-sm uppercase tracking-wide"
                            style={{ width: "29%", minWidth: 320 }}
                          >
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredApplications.map((application) => (
                          <ApplicationTableRow
                            key={application.id}
                            application={application}
                            onAction={handleAction}
                          />
                        ))}
                      </tbody>
                    </table>
                  </Box>
                </Card>
              )}

              {/* Pagination */}
              <Card padding="lg" radius="md" withBorder mt="md">
                <Pagination.Root
                  total={pagination.pages}
                  onChange={handlePageChange}
                  size={isMobile ? "sm" : "md"}
                >
                  <Group gap={5} justify="center">
                    <Pagination.First />
                    <Pagination.Previous />
                    <Pagination.Items />
                    <Pagination.Next />
                    <Pagination.Last />
                  </Group>
                </Pagination.Root>
              </Card>
            </>
          ) : (
            <EmptyState>
              <div className="text-center py-12">
                <IconFileText
                  size={48}
                  className="mx-auto text-gray-400 mb-4"
                />
                <Title order={3} className="text-gray-700 mb-2">
                  No Applications Found
                </Title>
                <Text c="dimmed" mb="lg">
                  {searchQuery || statusFilter
                    ? "No applications match your current filters"
                    : "You haven't received any applications yet"}
                </Text>
                {(searchQuery || statusFilter) && (
                  <Button
                    variant="light"
                    onClick={() => {
                      setSearchQuery("");
                      setStatusFilter(null);
                      setActiveTab("all");
                    }}
                  >
                    Clear Filters
                  </Button>
                )}
              </div>
            </EmptyState>
          )}
        </Card>
      </div>

      {/* Quick Actions - Below Main Content */}
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Group justify="space-between" mb="md">
          <Title order={4}>Quick Actions</Title>
        </Group>
        <Group gap="sm">
          <Button
            variant="light"
            leftSection={<IconDownload size={16} />}
            onClick={() => handleQuickAction("export")}
          >
            Export Applications
          </Button>
          <Button
            variant="light"
            leftSection={<IconMail size={16} />}
            onClick={() => handleQuickAction("bulk-email")}
          >
            Bulk Email to All
          </Button>
        </Group>
      </Card>

      {/* Confirmation Modal */}
      <ConfirmationModal
        opened={confirmationModal.opened}
        onClose={() =>
          setConfirmationModal({ ...confirmationModal, opened: false })
        }
        onConfirm={handleConfirmAction}
        title={confirmationModal.title}
        message={confirmationModal.message}
        type={confirmationModal.type}
        confirmText={confirmationModal.confirmText}
        loading={actionLoading}
      />

      {/* Email Modal */}
      <EmailModal
        opened={emailModal.opened}
        onClose={() =>
          setEmailModal({ opened: false, tenant: null, property: null })
        }
        tenant={emailModal.tenant}
        property={emailModal.property}
        onSend={handleSendEmail}
      />

      {/* Bulk Email Modal */}
      <BulkEmailModal
        opened={bulkEmailModal}
        onClose={() => setBulkEmailModal(false)}
        selectedApplications={selectedApplications}
        onSend={handleBulkEmail}
      />
    </div>
  );
}

export default Applications;
