import React, { ReactNode } from "react";
import { Box, Text, Button, Group, ThemeIcon, Paper } from "@mantine/core";
import {
  IconFileSearch,
  IconMoodEmpty,
  IconFolderOpen,
  IconSearch,
  IconPlus,
  IconInfoCircle,
} from "@tabler/icons-react";

interface EmptyStateProps {
  children?: ReactNode;
  title?: string;
  description?: string;
  icon?: ReactNode;
  iconColor?: string;
  action?: {
    label: string;
    onClick: () => void;
    icon?: ReactNode;
  };
  variant?: "default" | "search" | "data" | "dashboard" | "custom";
  compact?: boolean;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  children,
  title,
  description,
  icon,
  iconColor = "#6B7280",
  action,
  variant = "default",
  compact = false,
}) => {
  // Default icons based on variant
  const getDefaultIcon = () => {
    switch (variant) {
      case "search":
        return <IconSearch size={compact ? 24 : 32} />;
      case "data":
        return <IconFolderOpen size={compact ? 24 : 32} />;
      case "dashboard":
        return <IconInfoCircle size={compact ? 24 : 32} />;
      default:
        return <IconMoodEmpty size={compact ? 24 : 32} />;
    }
  };

  // Default titles based on variant
  const getDefaultTitle = () => {
    switch (variant) {
      case "search":
        return "No Results Found";
      case "data":
        return "No Data Available";
      case "dashboard":
        return "Nothing to Show Yet";
      default:
        return "Nothing Here";
    }
  };

  // Default descriptions based on variant
  const getDefaultDescription = () => {
    switch (variant) {
      case "search":
        return "Try adjusting your search or filters to find what you're looking for.";
      case "data":
        return "Add some data to get started. This area will populate once information is available.";
      case "dashboard":
        return "Your dashboard will display relevant information as you start using the platform.";
      default:
        return "This area is empty. Add content to get started.";
    }
  };

  return (
    <Paper
      withBorder
      radius="md"
      p={compact ? "lg" : "xl"}
      style={{
        backgroundColor: "white",
        border: "1px solid #E5E7EB",
        maxWidth: compact ? 400 : 500,
        margin: "0 auto",
      }}
    >
      <Box
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          gap: compact ? "md" : "lg",
        }}
      >
        {/* Icon Section */}
        <Box
          style={{
            width: compact ? 64 : 80,
            height: compact ? 64 : 80,
            borderRadius: "50%",
            backgroundColor: `${iconColor}10`,
            border: `1px solid ${iconColor}20`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: compact ? 4 : 8,
          }}
        >
          <ThemeIcon
            size={compact ? 32 : 40}
            radius="xl"
            variant="light"
            color={iconColor}
            style={{
              backgroundColor: `${iconColor}10`,
              border: `1px solid ${iconColor}30`,
            }}
          >
            {icon || getDefaultIcon()}
          </ThemeIcon>
        </Box>

        {/* Title and Description */}
        <Box style={{ width: "100%" }}>
          <Text
            size={compact ? "md" : "lg"}
            fw={600}
            mb={compact ? "xs" : "sm"}
            style={{ color: "#111827" }}
          >
            {title || getDefaultTitle()}
          </Text>

          <Text
            size={compact ? "sm" : "md"}
            c="dimmed"
            mb={compact ? "md" : "lg"}
            style={{
              lineHeight: 1.5,
              color: "#6B7280",
              maxWidth: compact ? 280 : 360,
              margin: "0 auto",
            }}
          >
            {description || getDefaultDescription()}
          </Text>
        </Box>

        {/* Children Content */}
        {children && (
          <Box
            style={{
              width: "100%",
              paddingTop: compact ? "md" : "lg",
              borderTop: "1px solid #F3F4F6",
            }}
          >
            {children}
          </Box>
        )}

        {/* Action Button */}
        {action && (
          <Button
            variant="light"
            color={iconColor}
            size={compact ? "sm" : "md"}
            leftSection={action.icon || <IconPlus size={16} />}
            onClick={action.onClick}
            style={{
              fontWeight: 500,
              backgroundColor: `${iconColor}10`,
              border: `1px solid ${iconColor}30`,
              marginTop: children ? "md" : 0,
            }}
          >
            {action.label}
          </Button>
        )}
      </Box>
    </Paper>
  );
};

// Pre-built variations for common use cases
export const SearchEmptyState: React.FC<Partial<EmptyStateProps>> = (props) => (
  <EmptyState
    variant="search"
    iconColor="#4F46E5"
    title="No Properties Found"
    description="Try adjusting your search criteria or explore different neighborhoods."
    {...props}
  />
);

export const DataEmptyState: React.FC<Partial<EmptyStateProps>> = (props) => (
  <EmptyState
    variant="data"
    iconColor="#059669"
    title="No Data Available"
    description="This section will populate once you start using the feature."
    {...props}
  />
);

export const DashboardEmptyState: React.FC<Partial<EmptyStateProps>> = (
  props
) => (
  <EmptyState
    variant="dashboard"
    iconColor="#7C3AED"
    title="Dashboard Empty"
    description="Your dashboard will display relevant information as you interact with the platform."
    {...props}
  />
);

export const ApplicationsEmptyState: React.FC<Partial<EmptyStateProps>> = (
  props
) => (
  <EmptyState
    variant="custom"
    icon={<IconFileSearch size={32} />}
    iconColor="#DC2626"
    title="No Applications Yet"
    description="Start applying to properties to track your application progress here."
    {...props}
  />
);

export default EmptyState;
