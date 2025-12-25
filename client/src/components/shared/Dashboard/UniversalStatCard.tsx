import React from "react";
import { Paper, Group, Text, Box } from "@mantine/core";
import { motion } from "framer-motion";

interface UniversalStatCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  color: string;
  trend?: number;
  subtitle?: string;
  onClick?: () => void;
}

const UniversalStatCard: React.FC<UniversalStatCardProps> = ({
  title,
  value,
  icon,
  color,
  trend,
  subtitle,
  onClick,
}) => {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      onClick={onClick}
      style={{ cursor: onClick ? "pointer" : "default", height: "100%" }}
    >
      <Paper
        p="lg"
        withBorder
        radius="md"
        className="transition-all duration-300 hover:shadow-lg"
        style={{
          background: `linear-gradient(135deg, #ffffff 0%, #fafafa 100%)`,
          borderColor: "#f1f3f5",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <Group justify="space-between" align="flex-start" wrap="nowrap">
          <div className="flex-1">
            <Text
              size="xs"
              fw={700}
              tt="uppercase"
              c="dimmed"
              lts="0.5px"
              mb={4}
            >
              {title}
            </Text>

            <div className="flex items-baseline gap-2">
              <Text size="xl" fw={800} c="dark">
                {typeof value === "number" ? value.toLocaleString() : value}
              </Text>

              {trend !== undefined && (
                <Text
                  size="xs"
                  fw={700}
                  c={trend > 0 ? "green.6" : "red.6"}
                  className="flex items-center"
                >
                  {trend > 0 ? "+" : ""}
                  {trend}%
                </Text>
              )}
            </div>

            {subtitle && (
              <Text size="xs" c="dimmed" mt={4}>
                {subtitle}
              </Text>
            )}
          </div>

          <Box
            className="flex items-center justify-center rounded-xl flex-shrink-0"
            style={{
              width: 44,
              height: 44,
              backgroundColor: `${color}12`, // 12% opacity of the theme color
              color: color,
            }}
          >
            {/* Ensuring icon scales nicely */}
            {React.isValidElement(icon)
              ? React.cloneElement(icon as React.ReactElement, { size: 22 })
              : icon}
          </Box>
        </Group>

        {/* Subtle accent indicator at the bottom */}
        <Box
          mt="md"
          h={2}
          className="rounded-full opacity-30"
          style={{ backgroundColor: color, width: "20%" }}
        />
      </Paper>
    </motion.div>
  );
};

export default UniversalStatCard;
