import React from "react";
import {
  IconUsers,
  IconHome,
  IconCurrencyNaira,
  IconAlertTriangle,
  IconTrendingUp,
  IconTrendingDown,
  IconMinus,
} from "@tabler/icons-react";

interface StatChange {
  value: number;
  percentage: number;
  direction: "up" | "down" | "neutral";
}

interface EnhancedStatisticsCardProps {
  title: string;
  value: number;
  icon?: React.ReactNode;
  change?: StatChange;
  period?: string;
  variant?: "default" | "success" | "warning" | "danger";
  subtitle?: string;
}

const EnhancedStatisticsCard: React.FC<EnhancedStatisticsCardProps> = ({
  title,
  value,
  icon,
  change,
  period = "vs last month",
  variant = "default",
  subtitle,
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case "success":
        return "bg-green-50 border-green-200 text-green-800";
      case "warning":
        return "bg-yellow-50 border-yellow-200 text-yellow-800";
      case "danger":
        return "bg-red-50 border-red-200 text-red-800";
      default:
        return "bg-white border-gray-200 text-gray-800";
    }
  };

  const getIconColor = () => {
    switch (variant) {
      case "success":
        return "text-green-600";
      case "warning":
        return "text-yellow-600";
      case "danger":
        return "text-red-600";
      default:
        return "text-primary";
    }
  };

  const getTrendIcon = () => {
    if (!change) return null;

    switch (change.direction) {
      case "up":
        return <IconTrendingUp size={16} className="text-green-600" />;
      case "down":
        return <IconTrendingDown size={16} className="text-red-600" />;
      default:
        return <IconMinus size={16} className="text-gray-600" />;
    }
  };

  const getTrendColor = () => {
    if (!change) return "";

    switch (change.direction) {
      case "up":
        return "text-green-600";
      case "down":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <div
      className={`p-6 rounded-lg border shadow-sm transition-all duration-200 hover:shadow-md ${getVariantStyles()}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            {icon && (
              <div className={`p-2 rounded-lg bg-white/50 ${getIconColor()}`}>
                {icon}
              </div>
            )}
            <div>
              <p className="text-sm font-medium text-gray-600">{title}</p>
              {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
            </div>
          </div>

          <div className="flex items-end gap-2">
            <span className="text-2xl font-bold">{value.toLocaleString()}</span>
            {change && (
              <div className="flex items-center gap-1">
                {getTrendIcon()}
                <span className={`text-sm font-medium ${getTrendColor()}`}>
                  {Math.abs(change.percentage)}%
                </span>
              </div>
            )}
          </div>

          {change && (
            <div className="mt-2">
              <p className="text-xs text-gray-500">
                <span className={getTrendColor()}>
                  {change.direction === "up"
                    ? "+"
                    : change.direction === "down"
                    ? "-"
                    : ""}
                  {Math.abs(change.value)} {period}
                </span>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EnhancedStatisticsCard;
