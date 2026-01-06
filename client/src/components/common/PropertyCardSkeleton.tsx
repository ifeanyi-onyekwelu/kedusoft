import { Skeleton, Group, Stack } from "@mantine/core";

export function PropertyCardSkeleton() {
  return (
    <div className="w-full overflow-hidden rounded-2xl bg-white border border-gray-200 h-full flex flex-col">
      {/* Image Area Skeleton */}
      <div className="relative h-64">
        <Skeleton height="100%" radius={0} />

        {/* Floating Price Tag Skeleton */}
        <div className="absolute bottom-4 left-4 z-10">
          <Skeleton height={35} width={100} radius="md" />
        </div>
      </div>

      <div className="p-5 flex-1 flex flex-col">
        {/* Title Skeleton */}
        <Skeleton height={24} width="70%" mb="sm" />

        {/* Address Skeleton */}
        <Group gap="xs" mb="xl">
          <Skeleton height={18} width={18} circle />
          <Skeleton height={14} width="80%" />
        </Group>

        <div className="flex items-center justify-between border-t border-gray-100 pt-4">
          {/* Icons/Stats Skeleton */}
          <Group gap="md">
            <Stack gap={4} align="center">
              <Skeleton height={12} width={25} />
              <Skeleton height={10} width={20} />
            </Stack>
            <Stack gap={4} align="center">
              <Skeleton height={12} width={25} />
              <Skeleton height={10} width={20} />
            </Stack>
            <Stack gap={4} align="center">
              <Skeleton height={12} width={25} />
              <Skeleton height={10} width={20} />
            </Stack>
          </Group>

          {/* Button Skeleton */}
          <Skeleton height={32} width={80} radius="sm" />
        </div>
      </div>
    </div>
  );
}
