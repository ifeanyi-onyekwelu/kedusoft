import {
  IconBell,
  IconLock,
  IconUser,
  IconUserScan,
  IconSettings,
  IconCreditCard,
  IconShieldCheck,
} from "@tabler/icons-react";
import { Link, Outlet, useLocation } from "react-router-dom";
import Sidebar, { RoleLinks } from "../components/shared/Dashboard/Sidebar";
import { useUser } from "../context/UserContext";
import { useDisclosure } from "@mantine/hooks";
import Header from "../components/shared/Dashboard/Navbar";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import {
  Box,
  Text,
  Container,
  UnstyledButton,
  Group,
  Divider,
  Badge,
} from "@mantine/core";

const SettingsTab = ({ link, isActive }: { link: any; isActive: boolean }) => (
  <UnstyledButton
    component={Link}
    to={link.path}
    className={`relative pb-4 transition-all duration-200 ${
      isActive ? "text-black" : "text-gray-400 hover:text-gray-600"
    }`}
  >
    <Group gap={8} wrap="nowrap">
      <link.icon size={18} stroke={isActive ? 2 : 1.5} />
      <Text size="sm" fw={isActive ? 600 : 500}>
        {link.name}
      </Text>
    </Group>
    {isActive && (
      <Box
        component="span"
        className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-600 rounded-full"
      />
    )}
  </UnstyledButton>
);

function TenantSettingsLayout() {
  const location = useLocation();
  const [opened, { toggle, close }] = useDisclosure(false);
  const { user } = useUser();

  const links = [
    { name: "General", path: "/tenant/settings/profile", icon: IconUser },
    {
      name: "Verification",
      path: "/tenant/settings/verification",
      icon: IconUserScan,
    },
    {
      name: "Security",
      path: "/tenant/settings/change-password",
      icon: IconLock,
    },
    {
      name: "Notifications",
      path: "/tenant/settings/notifications",
      icon: IconBell,
    },
    {
      name: "Payment",
      path: "/tenant/settings/payment",
      icon: IconCreditCard,
    },
    {
      name: "Screening",
      path: "/tenant/settings/screening",
      icon: IconShieldCheck,
    },
  ];

  if (!user) return <LoadingSpinner loading={!user} />;
  const role = user.role as keyof RoleLinks;

  return (
    <div className="min-h-screen bg-white">
      <Header role={user?.role!} opened={opened} toggle={toggle} />

      <div className="flex">
        <Sidebar role={role} opened={opened} />

        <main
          className={`flex-1 transition-all duration-300 ml-0 md:ml-[15%] pt-[80px]`}
          onClick={() => opened && close()}
        >
          {/* Section Header */}
          <Box className="border-b border-gray-100 bg-white sticky top-[80px] z-20">
            <Container size="lg">
              <div className="pt-10 pb-2 px-4 md:px-0">
                <Group
                  justify="space-between"
                  align="center"
                  mb="xl"
                  wrap="wrap"
                >
                  <Box className="flex-1">
                    <Group gap="xs" mb={4}>
                      <IconSettings size={16} className="text-orange-600" />
                      <Text
                        size="xs"
                        fw={700}
                        tt="uppercase"
                        c="dimmed"
                        lts="1px"
                      >
                        Tenant Settings
                      </Text>
                    </Group>
                    <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                      Your Preferences
                    </h1>
                  </Box>
                  <Badge
                    variant="dot"
                    color="orange"
                    size="lg"
                    className="shrink-0"
                  >
                    {user.role} Account
                  </Badge>
                </Group>

                {/* Horizontal Modern Tabs */}
                <Group
                  gap={30}
                  className="overflow-x-auto flex-nowrap scrollbar-hide px-0 md:px-0 pb-4 md:pb-0"
                >
                  {links.map((link) => (
                    <SettingsTab
                      key={link.path}
                      link={link}
                      isActive={location.pathname.startsWith(link.path)}
                    />
                  ))}
                </Group>
              </div>
            </Container>
          </Box>

          {/* Centered Content Area */}
          <Container size="lg" py={40}>
            <div className="max-w-[800px] px-4 md:px-0">
              <Outlet />
            </div>
          </Container>
        </main>
      </div>
    </div>
  );
}

export default TenantSettingsLayout;
