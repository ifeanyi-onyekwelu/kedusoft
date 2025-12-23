import React from "react";
import { Paper, Group } from "@mantine/core";
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
      style={{ cursor: onClick ? "pointer" : "default" }}
    >
      <Paper
        p="md"
        withBorder
        className="border-l-4 transition-all duration-300 hover:shadow-lg"
        style={{
          borderLeftColor: color,
          backgroundColor: "white",
          height: "100%",
        }}
      >
        <Group justify="space-between" align="flex-start">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
            <div className="flex items-center gap-2">
              <p className="text-2xl font-bold text-gray-900">
                {typeof value === "number" ? value.toLocaleString() : value}
              </p>
              {trend !== undefined && (
                <span
                  className={`text-xs font-semibold ${
                    trend > 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {trend > 0 ? "+" : ""}
                  {trend}%
                </span>
              )}
            </div>
            {subtitle && (
              <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
            )}
          </div>
          <div
            className="p-3 rounded-full flex-shrink-0"
            style={{ backgroundColor: `${color}15` }}
          >
            <div style={{ color }}>{icon}</div>
          </div>
        </Group>
      </Paper>
    </motion.div>
  );
};

export default UniversalStatCard;
