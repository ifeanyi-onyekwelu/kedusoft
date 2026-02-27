import { Title, Text, Button, Skeleton } from "@mantine/core";
import { IconActivity } from "@tabler/icons-react";

interface Activity {
  id: string;
  type: string;
  message: string;
  time: string;
  icon: any;
  color: string;
}

interface RecentActivitiesProps {
  activities: Activity[];
  loading: boolean;
}

export const RecentActivities = ({
  activities,
  loading,
}: RecentActivitiesProps) => {
  const getActivityColor = (type: string) => {
    const colors: Record<string, string> = {
      property_created: "#2f9e44",
      property_updated: "#1971c2",
      property_published: "#7950f2",
      application_rejected: "#fa5252",
      screening_initiated: "#f08c00",
      lease_created: "#495057",
      lease_signed: "#0ca678",
    };
    return colors[type] || "#868e96";
  };

  return (
    <div className="p-6 rounded-xl bg-white shadow-sm">
      <div className="flex items-center justify-between mb-5">
        <div>
          <Title order={4} className="mb-1">
            Recent Activities
          </Title>
          <Text size="xs" c="dimmed">
            Latest property updates
          </Text>
        </div>
        <div
          className="flex items-center justify-center w-8 h-8 rounded-lg"
          style={{ backgroundColor: "#f1f3f5" }}
        >
          <IconActivity size={16} className="text-gray-600" />
        </div>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3, 4].map((index) => (
            <div
              key={index}
              className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg"
            >
              <Skeleton height={32} width={32} radius="lg" />
              <div className="flex-1">
                <Skeleton height={14} width="85%" mb={6} />
                <Skeleton height={12} width="40%" />
              </div>
            </div>
          ))}
        </div>
      ) : activities.length > 0 ? (
        <div className="space-y-3 mb-4">
          {activities.map((activity) => {
            const activityColor = getActivityColor(activity.type);
            return (
              <div
                key={activity.id}
                className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-blue-50 transition-all"
              >
                <div
                  className="flex items-center justify-center w-8 h-8 rounded-lg flex-shrink-0"
                  style={{ backgroundColor: activityColor }}
                >
                  <activity.icon size={16} style={{ color: "white" }} />
                </div>
                <div className="flex-1 min-w-0">
                  <Text size="sm" fw={500} className="mb-1">
                    {activity.message}
                  </Text>
                  <Text size="xs" c="dimmed">
                    {activity.time}
                  </Text>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-xl mb-4">
          <div
            className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
            style={{ backgroundColor: "#e9ecef" }}
          >
            <IconActivity size={32} className="text-gray-400" />
          </div>
          <Text size="sm" fw={500} className="mb-2">
            No Recent Activities
          </Text>
          <Text size="xs" c="dimmed">
            Activity history will appear here
          </Text>
        </div>
      )}

      <Button variant="light" fullWidth size="sm">
        View All Activities
      </Button>
    </div>
  );
};
