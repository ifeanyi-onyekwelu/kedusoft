import { Card, Group, Skeleton, Grid } from "@mantine/core";

// Statistics Card Skeleton
export const StatCardSkeleton = () => (
  <Card shadow="sm" padding="lg" radius="md" className="h-full">
    <div className="flex items-center justify-between mb-3">
      <Skeleton height={40} width={40} radius="lg" />
      <Skeleton height={20} width={60} radius="xl" />
    </div>
    <Skeleton height={12} width="60%" mb={8} />
    <Skeleton height={28} width="80%" mb={4} />
    <Skeleton height={10} width="70%" />
  </Card>
);

// Quick Action Card Skeleton
export const QuickActionSkeleton = () => (
  <Card
    padding="md"
    radius="md"
    withBorder
    className="bg-gradient-to-br from-white to-gray-50"
  >
    <Group gap="sm" mb="xs">
      <Skeleton height={24} width={24} radius="sm" />
      <Skeleton height={16} width="60%" />
    </Group>
    <Skeleton height={12} width="80%" />
  </Card>
);

// Activity Item Skeleton
export const ActivityItemSkeleton = () => (
  <Group justify="space-between" className="p-3 bg-gray-50 rounded-md">
    <div className="flex-1">
      <Skeleton height={14} width="70%" mb={6} />
      <Skeleton height={12} width="50%" />
    </div>
    <div className="text-right">
      <Skeleton height={20} width={60} mb={4} />
      <Skeleton height={10} width={80} />
    </div>
  </Group>
);

// Task Card Skeleton
export const TaskCardSkeleton = () => (
  <div className="p-3 border border-gray-200 rounded-md">
    <Group justify="space-between" mb="xs">
      <Skeleton height={16} width={50} radius="xl" />
      <Skeleton height={10} width={60} />
    </Group>
    <Skeleton height={14} width="90%" />
  </div>
);

// Property Card Skeleton
export const PropertyCardSkeleton = () => (
  <Card shadow="sm" padding="lg" radius="md" withBorder>
    <Skeleton height={200} radius="md" mb="md" />
    <Skeleton height={20} width="70%" mb={8} />
    <Skeleton height={16} width="50%" mb={12} />
    <Group justify="apart" mb={8}>
      <Skeleton height={14} width={80} />
      <Skeleton height={14} width={80} />
    </Group>
    <Skeleton height={36} radius="md" />
  </Card>
);

// Application Item Skeleton
export const ApplicationItemSkeleton = () => (
  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
    <div className="flex items-center gap-3 flex-1">
      <Skeleton height={40} width={40} radius="xl" />
      <div className="flex-1">
        <Skeleton height={14} width="60%" mb={6} />
        <Skeleton height={12} width="40%" />
      </div>
    </div>
    <div className="text-right">
      <Skeleton height={20} width={60} mb={4} />
      <Skeleton height={10} width={80} />
    </div>
  </div>
);

// Timeline Item Skeleton
export const TimelineItemSkeleton = () => (
  <div className="flex items-start gap-3 mb-4">
    <Skeleton height={24} width={24} radius="xl" />
    <div className="flex-1">
      <Skeleton height={14} width="85%" mb={6} />
      <Skeleton height={12} width="40%" />
    </div>
  </div>
);

// Progress Section Skeleton
export const ProgressSectionSkeleton = () => (
  <Card shadow="sm" padding="lg" radius="md" withBorder>
    <Skeleton height={20} width="50%" mb="lg" />
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {[1, 2, 3].map((index) => (
        <div key={index}>
          <Skeleton height={12} width="60%" mb={8} />
          <Skeleton height={24} radius="md" mb={4} />
          <Skeleton height={10} width="80%" />
        </div>
      ))}
    </div>
  </Card>
);

// Property Performance Skeleton
export const PropertyPerformanceSkeleton = () => (
  <div className="p-4 border rounded-lg">
    <div className="flex items-start justify-between mb-3">
      <div>
        <Skeleton height={16} width="60%" mb={8} />
        <Skeleton height={20} width={80} />
      </div>
      <Skeleton height={16} width="40%" />
    </div>
    <Grid>
      <Grid.Col span={4}>
        <Skeleton height={12} width="100%" mb={4} />
        <Skeleton height={14} width="60%" />
      </Grid.Col>
      <Grid.Col span={4}>
        <Skeleton height={12} width="100%" mb={4} />
        <Skeleton height={14} width="60%" />
      </Grid.Col>
      <Grid.Col span={4}>
        <Skeleton height={12} width="100%" mb={4} />
        <Skeleton height={8} width="100%" mb={2} />
        <Skeleton height={12} width="40%" />
      </Grid.Col>
    </Grid>
  </div>
);

// Pending Task Skeleton
export const PendingTaskSkeleton = () => (
  <div className="p-3 rounded-lg border-l-4 border-gray-200 bg-gray-50">
    <div className="flex items-start gap-3">
      <Skeleton height={24} width={24} radius="sm" />
      <div className="flex-1">
        <Skeleton height={14} width="80%" mb={8} />
        <Skeleton height={12} width="60%" mb={8} />
        <Skeleton height={24} width={100} />
      </div>
    </div>
  </div>
);
