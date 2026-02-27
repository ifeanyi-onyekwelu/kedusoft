import { Card, Text, Group, Box } from "@mantine/core";
import {
  IconTrendingUp,
  IconTrendingDown,
  IconChevronRight,
} from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";

interface StatisticsCardProps {
  title: string;
  value: number;
  extraText?: { label: string; value: string; color: string }[];
  icon?: any;
  trend?: "up" | "down" | "neutral";
  href?: string; // Add href for navigation
  onClick?: () => void;
}

const StatisticsCard = ({
  title,
  value,
  extraText,
  icon: Icon,
  trend = "neutral",
  href,
  onClick,
}: StatisticsCardProps) => {
  const navigate = useNavigate();

  const formatValue = (val: number) => {
    if (val >= 1000) return `${(val / 1000).toFixed(1)}k`;
    return val.toString();
  };

  const getTrendIcon = () => {
    if (trend === "up") return <IconTrendingUp size={16} color="#28a745" />;
    if (trend === "down") return <IconTrendingDown size={16} color="#dc3545" />;
    return null;
  };

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (href) {
      navigate(href);
    }
  };

  return (
    <Card
      withBorder
      radius="md"
      p="lg"
      style={{
        backgroundColor: "white",
        height: "100%",
        cursor: href || onClick ? "pointer" : "default",
        border: "1px solid #E0E0E0",
        transition: "all 0.2s ease",
        position: "relative",
      }}
      onClick={handleClick}
      onMouseEnter={(e) => {
        if (href || onClick) {
          e.currentTarget.style.transform = "translateY(-4px)";
          e.currentTarget.style.boxShadow = "0 8px 25px rgba(0, 0, 0, 0.1)";
          e.currentTarget.style.borderColor = "#4285F4";
        }
      }}
      onMouseLeave={(e) => {
        if (href || onClick) {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "none";
          e.currentTarget.style.borderColor = "#E0E0E0";
        }
      }}
    >
      <Group justify="space-between" align="flex-start" mb="xs">
        <div>
          <Text
            size="sm"
            c="dimmed"
            fw={500}
            tt="uppercase"
            style={{ letterSpacing: "0.5px" }}
          >
            {title}
          </Text>
          <Group align="center" gap="xs" mt={4}>
            <Text
              size="xl"
              fw={700}
              style={{ fontSize: "2rem", color: "#1A1A1A" }}
            >
              {formatValue(value)}
            </Text>
            {getTrendIcon()}
          </Group>
        </div>

        <Group gap="xs">
          {Icon && (
            <Box
              style={{
                backgroundColor: "#F0F7FF",
                padding: 10,
                borderRadius: 10,
              }}
            >
              <Icon size={22} color="#4285F4" />
            </Box>
          )}
          {(href || onClick) && (
            <IconChevronRight
              size={16}
              color="#666"
              style={{ marginLeft: 4 }}
            />
          )}
        </Group>
      </Group>

      {extraText && (
        <Group gap="xs" mt="lg">
          {extraText.map((item, index) => (
            <Box
              key={index}
              style={{
                backgroundColor:
                  item.color === "green"
                    ? "#E8F5E9"
                    : item.color === "blue"
                    ? "#E3F2FD"
                    : item.color === "violet"
                    ? "#F3E5F5"
                    : "#FFF3E0",
                padding: "6px 10px",
                borderRadius: 6,
                border: `1px solid ${
                  item.color === "green"
                    ? "#C8E6C9"
                    : item.color === "blue"
                    ? "#BBDEFB"
                    : item.color === "violet"
                    ? "#E1BEE7"
                    : "#FFE0B2"
                }`,
              }}
            >
              <Text size="xs" fw={500} c="dark">
                <span
                  style={{
                    color:
                      item.color === "green"
                        ? "#2E7D32"
                        : item.color === "blue"
                        ? "#1565C0"
                        : item.color === "violet"
                        ? "#7B1FA2"
                        : "#E65100",
                    fontWeight: 600,
                  }}
                >
                  {item.value}
                </span>{" "}
                {item.label}
              </Text>
            </Box>
          ))}
        </Group>
      )}
    </Card>
  );
};

export default StatisticsCard;
