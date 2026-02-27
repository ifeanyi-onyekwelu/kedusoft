import { Title, Button, Text, Skeleton } from "@mantine/core";
import { IconChevronRight, IconFileText } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";

interface Application {
  id: string;
  tenant?: {
    firstName?: string;
    lastName?: string;
  };
  property?: {
    name?: string;
  };
  status: string;
  created_at: string;
  property_id: string;
}

interface RecentApplicationsProps {
  applications: Application[];
  loading: boolean;
}

export const RecentApplications = ({
  applications,
  loading,
}: RecentApplicationsProps) => {
  const navigate = useNavigate();

  const getStatusConfig = (status: string) => {
    const configs: Record<
      string,
      { color: string; bg: string; label: string }
    > = {
      approved: { color: "#2f9e44", bg: "#ebfbee", label: "Approved" },
      rejected: { color: "#fa5252", bg: "#fff5f5", label: "Rejected" },
      screening: { color: "#f08c00", bg: "#fff4e6", label: "Screening" },
      pending: { color: "#1971c2", bg: "#e7f5ff", label: "Pending" },
    };
    return configs[status] || configs.pending;
  };

  return (
    <div className="p-6 rounded-xl bg-white shadow-sm">
      <div className="flex items-center justify-between mb-5">
        <div>
          <Title order={4} className="mb-1">
            Recent Applications
          </Title>
          <Text size="xs" c="dimmed">
            Review tenant applications
          </Text>
        </div>
        <Button
          variant="light"
          size="sm"
          rightSection={<IconChevronRight size={14} />}
          onClick={() => navigate("/property-owner/applications")}
        >
          View All
        </Button>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((index) => (
            <div key={index} className="p-4 border rounded-xl">
              <div className="flex items-center gap-3">
                <Skeleton height={48} width={48} radius="xl" />
                <div className="flex-1">
                  <Skeleton height={16} width="70%" mb={8} />
                  <Skeleton height={12} width="50%" />
                </div>
                <div>
                  <Skeleton height={24} width={80} radius="md" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : applications.length > 0 ? (
        <div className="space-y-3">
          {applications.slice(0, 4).map((application) => {
            const statusConfig = getStatusConfig(application.status);
            return (
              <div
                key={application.id}
                className="p-4 bg-gray-50 rounded-xl hover:bg-blue-50 hover:shadow-sm cursor-pointer transition-all"
                onClick={() =>
                  navigate(
                    `/property-owner/applications/${application.id}/${application.property_id}`
                  )
                }
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div
                      className="flex items-center justify-center w-12 h-12 rounded-xl text-white font-semibold text-sm"
                      style={{ backgroundColor: statusConfig.color }}
                    >
                      {application.tenant?.firstName?.[0]?.toUpperCase() || "?"}
                      {application.tenant?.lastName?.[0]?.toUpperCase() || ""}
                    </div>
                    <div className="flex-1 min-w-0">
                      <Text size="sm" fw={600} className="mb-1 truncate">
                        {application.tenant?.firstName}{" "}
                        {application.tenant?.lastName}
                      </Text>
                      <Text size="xs" c="dimmed" className="truncate">
                        {application.property?.name || "Unknown Property"}
                      </Text>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <div
                      className="px-3 py-1 rounded-lg text-xs font-semibold"
                      style={{
                        backgroundColor: statusConfig.bg,
                        color: statusConfig.color,
                      }}
                    >
                      {statusConfig.label}
                    </div>
                    <Text size="xs" c="dimmed">
                      {new Date(application.created_at).toLocaleDateString(
                        "en-US",
                        { month: "short", day: "numeric" }
                      )}
                    </Text>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-xl">
          <div
            className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
            style={{ backgroundColor: "#e9ecef" }}
          >
            <IconFileText size={32} className="text-gray-400" />
          </div>
          <Text size="sm" fw={500} className="mb-2">
            No Applications Yet
          </Text>
          <Text size="xs" c="dimmed" className="mb-4">
            Applications will appear here when tenants apply
          </Text>
          <Button
            variant="light"
            size="xs"
            onClick={() => navigate("/property-owner/properties")}
          >
            Manage Properties
          </Button>
        </div>
      )}
    </div>
  );
};
