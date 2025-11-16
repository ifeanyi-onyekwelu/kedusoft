import { Grid, Badge, Group, Text } from "@mantine/core";
import { IconArrowUpRight, IconArrowDownRight } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";

interface Statistic {
  title: string;
  value: number;
  icon: any;
  color: "blue" | "green" | "orange" | "violet";
  change: string;
  trend: "up" | "down" | "neutral";
  link?: string; // Optional link for navigation
}

interface StatisticsCardsProps {
  statistics: Statistic[];
  dateRange: "today" | "week" | "month" | "year";
}

export const StatisticsCards = ({
  statistics,
  dateRange,
}: StatisticsCardsProps) => {
  const navigate = useNavigate();

  const colorMap: Record<
    string,
    { bg: string; border: string; iconBg: string; text: string }
  > = {
    blue: {
      bg: "#e7f5ff",
      border: "#74c0fc",
      iconBg: "white",
      text: "#1971c2",
    },
    green: {
      bg: "#ebfbee",
      border: "#69db7c",
      iconBg: "white",
      text: "#2f9e44",
    },
    orange: {
      bg: "#fff4e6",
      border: "#ffc078",
      iconBg: "white",
      text: "#f08c00",
    },
    violet: {
      bg: "#f3f0ff",
      border: "#b197fc",
      iconBg: "white",
      text: "#7950f2",
    },
  };

  return (
    <Grid>
      {statistics.map((stat, index) => {
        const colors = colorMap[stat.color] || colorMap.blue;

        return (
          <Grid.Col key={index} span={{ base: 12, sm: 6, lg: 3 }}>
            <div
              className={`h-full p-5 rounded-xl border-2 hover:shadow-lg transition-all ${
                stat.link ? "cursor-pointer hover:scale-105" : "cursor-default"
              }`}
              style={{
                backgroundColor: colors.bg,
                borderColor: colors.border,
              }}
              onClick={() => stat.link && navigate(stat.link)}
            >
              <Group justify="space-between" mb="md">
                <div
                  className="flex items-center justify-center w-12 h-12 rounded-xl"
                  style={{ backgroundColor: colors.iconBg }}
                >
                  <stat.icon size={24} style={{ color: colors.text }} />
                </div>
                <Badge
                  variant="filled"
                  size="sm"
                  style={{
                    backgroundColor:
                      stat.trend === "up"
                        ? "#2f9e44"
                        : stat.trend === "down"
                        ? "#fa5252"
                        : "#868e96",
                    color: "white",
                  }}
                  leftSection={
                    stat.trend === "up" ? (
                      <IconArrowUpRight size={12} />
                    ) : stat.trend === "down" ? (
                      <IconArrowDownRight size={12} />
                    ) : null
                  }
                >
                  {stat.change}
                </Badge>
              </Group>
              <Text size="xs" fw={500} c="dimmed" mb={6}>
                {stat.title}
              </Text>
              <Text size="xl" fw={700} mb={4} style={{ color: colors.text }}>
                {typeof stat.value === "number" &&
                stat.title.includes("Balance")
                  ? `₦${stat.value.toLocaleString()}`
                  : stat.value.toLocaleString()}
              </Text>
              <Text size="xs" c="dimmed">
                vs. previous{" "}
                {dateRange === "today"
                  ? "day"
                  : dateRange === "week"
                  ? "week"
                  : dateRange === "month"
                  ? "month"
                  : "year"}
              </Text>
            </div>
          </Grid.Col>
        );
      })}
    </Grid>
  );
};
