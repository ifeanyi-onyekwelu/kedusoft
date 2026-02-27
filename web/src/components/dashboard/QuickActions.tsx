import { Card, SimpleGrid, Text, UnstyledButton } from "@mantine/core";
import {
  IconHome,
  IconCash,
  IconTool,
  IconMessage,
  IconCalendar,
  IconFileText,
} from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";

interface QuickAction {
  title: string;
  description: string;
  icon: any;
  color: string;
  bgColor: string;
  route: string;
}

const QuickActions = () => {
  const navigate = useNavigate();

  const actions: QuickAction[] = [
    {
      title: "Add New Property",
      description: "List a new property",
      icon: IconHome,
      color: "#1971c2",
      bgColor: "#e7f5ff",
      route: "/property-owner/properties/add",
    },
    {
      title: "Collect Rent",
      description: "Record payment",
      icon: IconCash,
      color: "#2f9e44",
      bgColor: "#ebfbee",
      route: "/property-owner/transactions",
    },
    {
      title: "Maintenance",
      description: "Post update",
      icon: IconTool,
      color: "#f08c00",
      bgColor: "#fff4e6",
      route: "/property-owner/maintenance",
    },
    {
      title: "Message Tenants",
      description: "Send message",
      icon: IconMessage,
      color: "#7950f2",
      bgColor: "#f3f0ff",
      route: "/property-owner/messages",
    },
    {
      title: "Schedule Inspection",
      description: "Book inspection",
      icon: IconCalendar,
      color: "#e64980",
      bgColor: "#fff0f6",
      route: "/property-owner/inspections",
    },
    {
      title: "Generate Report",
      description: "Export data",
      icon: IconFileText,
      color: "#0c8599",
      bgColor: "#e3fafc",
      route: "/property-owner/reports",
    },
  ];

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Text size="lg" fw={600} mb="md">
        Quick Actions
      </Text>
      <SimpleGrid cols={{ base: 2, sm: 3, lg: 6 }} spacing="md">
        {actions.map((action, index) => (
          <UnstyledButton
            key={index}
            onClick={() => navigate(action.route)}
            className="transition-all duration-200"
          >
            <div
              className="flex flex-col items-center text-center p-4 rounded-xl border-2 hover:shadow-md transition-all"
              style={{
                backgroundColor: action.bgColor,
                borderColor: action.color + "30",
              }}
            >
              <div className="p-3 rounded-lg mb-3 bg-white">
                <action.icon size={24} style={{ color: action.color }} />
              </div>
              <Text size="sm" fw={600} mb={4} style={{ color: action.color }}>
                {action.title}
              </Text>
              <Text size="xs" c="dimmed">
                {action.description}
              </Text>
            </div>
          </UnstyledButton>
        ))}
      </SimpleGrid>
    </Card>
  );
};

export default QuickActions;
