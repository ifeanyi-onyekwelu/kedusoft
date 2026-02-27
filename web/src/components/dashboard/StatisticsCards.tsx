import { Card, Text, Group, Box, Grid, Stack } from "@mantine/core";
import {
  IconTrendingUp,
  IconTrendingDown,
  IconChevronRight,
} from "@tabler/icons-react";
import { FaNairaSign } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";

interface Statistic {
  title: string;
  value: number;
  icon: any;
  trend?: "up" | "down" | "neutral";
  link?: string;
  change?: string;
}

interface StatisticsCardsProps {
  statistics: Statistic[];
}

const StatisticsCard = ({
  title,
  value,
  icon: Icon,
  trend = "neutral",
  link,
  change,
}: Statistic) => {
  const navigate = useNavigate();

  return (
    <Card
      padding="xl"
      radius="md"
      onClick={() => link && navigate(link)}
      style={{
        backgroundColor: "white",
        height: "100%",
        cursor: link ? "pointer" : "default",
        boxShadow:
          "0 1px 3px rgba(0,0,0,0.05), 0 10px 15px -5px rgba(0,0,0,0.05)",
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
      }}
      className={link ? "hover:shadow-lg hover:-translate-y-0.5" : ""}
    >
      <Stack gap="xs">
        <Group justify="space-between" wrap="nowrap">
          <Text size="xs" c="dimmed" fw={600} tt="uppercase" lts="1px">
            {title}
          </Text>
          <Box c="#290665" style={{ opacity: 0.6 }}>
            <Icon size={20} stroke={1.5} />
          </Box>
        </Group>

        <Group align="flex-end" justify="space-between" mt="sm">
          <Stack gap={0}>
            <Text
              size="xl"
              fw={800}
              style={{ fontSize: "1.85rem", color: "#111", lineHeight: 1.2 }}
            >
              {title.toLowerCase().includes("balance") ||
              title.toLowerCase().includes("revenue")
                ? `₦${value.toLocaleString()}`
                : value.toLocaleString()}
            </Text>

            {change && (
              <Group gap={4} mt={4}>
                {trend === "up" ? (
                  <IconTrendingUp size={14} color="#059669" />
                ) : (
                  <IconTrendingDown size={14} color="#dc2626" />
                )}
                <Text
                  size="xs"
                  fw={700}
                  c={trend === "up" ? "#059669" : "#dc2626"}
                >
                  {change}{" "}
                  <span style={{ fontWeight: 400, color: "#888" }}>
                    this month
                  </span>
                </Text>
              </Group>
            )}
          </Stack>

          {link && <IconChevronRight size={18} color="#dee2e6" />}
        </Group>
      </Stack>
    </Card>
  );
};

export const LandlordStatisticsGrid = ({
  statistics,
}: StatisticsCardsProps) => {
  return (
    <Grid gutter="lg">
      {statistics.map((stat, index) => (
        <Grid.Col key={index} span={{ base: 12, sm: 6, lg: 3 }}>
          <StatisticsCard {...stat} />
        </Grid.Col>
      ))}
    </Grid>
  );
};

export default LandlordStatisticsGrid;
