import { Box, Burger, Drawer, Group, Button } from "@mantine/core";
import { useState } from "react";
import {
  IconUser,
  IconLogout,
  IconHome,
  IconMapPin,
} from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../../../hooks/useAuth";
import { useUser } from "../../../context/UserContext";

const AuthLinks = () => {
  const navigate = useNavigate();
  const { isAuthenticated, role } = useAuth();
  const { logout, user } = useUser();
  const [userMenuOpened, setUserMenuOpened] = useState(false);

  const handleLogout = async () => {
    try {
      logout();
      navigate("/");
    } catch (err) {
      console.error("Error logging out", err);
    }
  };

  if (!isAuthenticated) {
    return (
      <Group gap="sm">
        <Button
          variant="subtle"
          onClick={() => navigate("/auth/login")}
          size="sm"
        >
          Sign In
        </Button>

        <Button
          color="blue"
          onClick={() => navigate("/auth/register")}
          size="sm"
        >
          Sign Up
        </Button>

        <Button
          color="red"
          onClick={() => navigate("/auth/register?role=landlord")}
          size="sm"
        >
          List Property
        </Button>
      </Group>
    );
  }

  return (
    <div className="relative">
      <button
        className="flex items-center gap-2 hover:bg-gray-50 px-3 py-2 rounded-lg"
        onClick={() => setUserMenuOpened(!userMenuOpened)}
      >
        {/* Simple profile */}
        <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold text-sm">
          {user?.firstName?.[0] || "U"}
        </div>

        {userMenuOpened && (
          <div
            className="fixed inset-0 z-10"
            onClick={() => setUserMenuOpened(false)}
          />
        )}

        {userMenuOpened && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border z-20">
            <div className="p-3 border-b">
              <p className="text-sm font-medium">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-xs text-gray-500 capitalize">{role}</p>
            </div>

            <div className="p-2">
              <Link
                to={role === "tenant" ? "/tenants" : "/property-owner"}
                className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-50 rounded"
                onClick={() => setUserMenuOpened(false)}
              >
                <IconHome size={16} />
                Dashboard
              </Link>

              <Link
                to="/profile"
                className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-50 rounded"
                onClick={() => setUserMenuOpened(false)}
              >
                <IconUser size={16} />
                Profile
              </Link>

              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded w-full"
              >
                <IconLogout size={16} />
                Sign Out
              </button>
            </div>
          </div>
        )}
      </button>
    </div>
  );
};

function Header() {
  const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] =
    useDisclosure(false);
  const navigate = useNavigate();

  // Simple nav links - MVP focus
  const navLinks = [
    { label: "Rent", path: "/listings?type=rent" },
    { label: "Buy", path: "/listings?type=sale" },
    { label: "Shortlet", path: "/listings?type=shortlet" },
    { label: "List Property", path: "/auth/register?role=landlord" },
  ];

  return (
    <Box
      component="header"
      className="sticky top-0 w-full z-50 bg-white border-b shadow-sm"
    >
      <Box className="w-full px-4 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img
              src="/images/brand/logo.png"
              alt="Logo"
              className="h-8 w-auto"
            />
          </Link>

          {/* Desktop Navigation - SIMPLE */}
          <Group gap="md" visibleFrom="md">
            {navLinks.slice(0, 3).map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="text-sm font-medium text-gray-700 hover:text-blue-600 px-3 py-2"
              >
                {link.label}
              </Link>
            ))}
          </Group>

          {/* Desktop Auth Links */}
          <Group gap="sm" visibleFrom="md">
            <AuthLinks />
          </Group>

          {/* Mobile menu button */}
          <Burger
            opened={drawerOpened}
            onClick={toggleDrawer}
            hiddenFrom="md"
            size="sm"
          />
        </div>
      </Box>

      {/* Mobile Drawer - SIMPLE */}
      <Drawer
        opened={drawerOpened}
        onClose={closeDrawer}
        size="85%"
        padding="md"
        hiddenFrom="md"
        title={
          <Link to="/" onClick={closeDrawer}>
            <img
              src="/images/brand/logo.png"
              alt="Logo"
              className="h-7 w-auto"
            />
          </Link>
        }
      >
        <div className="flex flex-col space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={closeDrawer}
              className="px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg"
            >
              {link.label}
            </Link>
          ))}

          <div className="mt-6 pt-6 border-t">
            <div className="space-y-2">
              <Button
                fullWidth
                variant="light"
                onClick={() => {
                  closeDrawer();
                  navigate("/auth/login");
                }}
              >
                Sign In
              </Button>

              <Button
                fullWidth
                color="blue"
                onClick={() => {
                  closeDrawer();
                  navigate("/auth/register");
                }}
              >
                Sign Up
              </Button>
            </div>
          </div>
        </div>
      </Drawer>
    </Box>
  );
}

export default Header;
