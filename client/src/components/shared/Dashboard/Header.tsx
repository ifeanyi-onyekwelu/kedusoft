import { Text, Group, Box } from "@mantine/core";
import { IconCalendar, IconSun } from "@tabler/icons-react";

const Header = ({ name }: { name: string }) => {
  const getGreeting = () => {
    const currentHour = new Date().getHours();
    if (currentHour < 12) return "Good Morning";
    if (currentHour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  const getCurrentDate = () => {
    const today = new Date();
    return today.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <Box mb="lg">
      <Group align="center" gap="xs" mb={4}>
        <IconSun size={20} style={{ color: "#FF6B35" }} />
        <Text size="xl" fw={700} c="dark">
          {getGreeting()}, {name}!
        </Text>
      </Group>

      <Group align="center" gap="xs">
        <IconCalendar size={16} style={{ color: "#666" }} />
        <Text size="sm" c="dimmed">
          {getCurrentDate()}
        </Text>
        <Text size="sm" c="dimmed" style={{ marginLeft: 8 }}>
          • Welcome to your rental dashboard
        </Text>
      </Group>
    </Box>
  );
};

export default Header;
