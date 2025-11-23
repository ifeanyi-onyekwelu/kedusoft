import { Text } from "@mantine/core";

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
    <header className="mb-6">
      <Text size="xl" fw={600} c="dark">
        {getGreeting()}, {name}! 👋
      </Text>
      <Text size="sm" c="dimmed" mt="xs">
        {getCurrentDate()} • Welcome back to your rental journey
      </Text>
    </header>
  );
};

export default Header;
