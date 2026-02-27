import { Box, Burger, Drawer, Group, Button } from "@mantine/core";
import { useState } from "react";
import {
  IconUser,
  IconLogout,
  IconHome,
  IconChevronDown,
} from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../../../hooks/useAuth";
import { useUser } from "@/context/UserContext.tsx";

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
      </Group>
    );
  }

  return (
      <div className="relative">
        <button
            className="flex items-center gap-2 hover:bg-gray-100 px-2 py-1.5 rounded-lg transition-colors"
            onClick={() => setUserMenuOpened(!userMenuOpened)}
        >
          <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm border border-blue-200">
            {user?.firstName?.[0] || "U"}
          </div>
          <div className="text-left hidden lg:block">
            <IconChevronDown size={14} className={`text-gray-500 transition-transform ${userMenuOpened ? 'rotate-180' : ''}`} />
          </div>

          {userMenuOpened && (
              <div
                  className="fixed inset-0 z-10 cursor-default"
                  onClick={(e) => {
                    e.stopPropagation();
                    setUserMenuOpened(false);
                  }}
              />
          )}

          {userMenuOpened && (
              /* FIX: Changed mt-2 to top-full and added a specific pt-2 to create a gap */
              <div className="absolute right-0 top-full pt-2 w-56 z-20 animate-in fade-in zoom-in-95 duration-100">
                <div className="bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden">
                  <div className="p-4 border-b bg-gray-50/50">
                    <p className="text-sm font-bold text-gray-900 truncate">
                      {user?.firstName} {user?.lastName}
                    </p>
                    <p className="text-xs text-gray-500 capitalize flex items-center gap-1 mt-0.5">
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-500"></span>
                      {role} Account
                    </p>
                  </div>

                  <div className="p-1.5">
                    <Link
                        to={role === "tenant" ? "/tenants" : "/property-owner"}
                        className="flex items-center gap-3 px-3 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-lg transition-colors"
                        onClick={() => setUserMenuOpened(false)}
                    >
                      <IconHome size={18} stroke={1.5} />
                      Dashboard
                    </Link>

                    <Link
                        to="/profile"
                        className="flex items-center gap-3 px-3 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-lg transition-colors"
                        onClick={() => setUserMenuOpened(false)}
                    >
                      <IconUser size={18} stroke={1.5} />
                      My Profile
                    </Link>

                    <div className="my-1 border-t border-gray-100" />

                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-lg w-full transition-colors font-medium"
                    >
                      <IconLogout size={18} stroke={1.5} />
                      Sign Out
                    </button>
                  </div>
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

  // Access auth state for the mobile drawer
  const { isAuthenticated, role } = useAuth();
  const { logout, user } = useUser();

  const handleLogout = () => {
    logout();
    closeDrawer();
    navigate("/");
  };

  const navLinks = [
    { label: "Sellers", path: "/listings?type=sale" },
    { label: "Rentals", path: "/listings?type=rent" },
    { label: "Shortlet", path: "/listings?type=shortlet" },
    { label: "Services", path: "/services" },
    { label: "How It Works", path: "/how-it-works" },
    { label: "About", path: "/about-us" },
    { label: "Contact", path: "/contact-us" },
  ];

  return (
      <Box component="header" className="sticky top-0 w-full z-50 bg-white shadow-sm">
        <Box className="w-full px-4 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center">
              <img src="/images/brand/logo.png" alt="Logo" className="h-8 w-auto" />
            </Link>

            <Group gap="md" visibleFrom="md">
              {navLinks.map((link) => (
                  <Link key={link.path} to={link.path} className="text-sm font-medium text-gray-700 hover:text-blue-600 px-3 py-2 transition-colors">
                    {link.label}
                  </Link>
              ))}
            </Group>

            <Group gap="sm" visibleFrom="md">
              <AuthLinks />
            </Group>

            <Burger opened={drawerOpened} onClick={toggleDrawer} hiddenFrom="md" size="sm" />
          </div>
        </Box>

        <Drawer
            opened={drawerOpened}
            onClose={closeDrawer}
            size="85%"
            padding="md"
            hiddenFrom="md"
            title={
              <Link to="/" onClick={closeDrawer}>
                <img src="/images/brand/logo.png" alt="Logo" className="h-7 w-auto" />
              </Link>
            }
        >
          <div className="flex flex-col h-full">
            {/* Main Navigation Links */}
            <div className="flex flex-col space-y-1">
              {navLinks.map((link) => (
                  <Link
                      key={link.path}
                      to={link.path}
                      onClick={closeDrawer}
                      className="px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg font-medium"
                  >
                    {link.label}
                  </Link>
              ))}
            </div>

            {/* Conditional Auth Section for Mobile */}
            <div className="mt-auto pb-10 pt-6 border-t">
              {isAuthenticated ? (
                  <div className="space-y-4">
                    {/* User Info Header */}
                    <div className="flex items-center gap-3 px-4 mb-6">
                      <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-lg border border-blue-200">
                        {user?.firstName?.[0] || "U"}
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">{user?.firstName} {user?.lastName}</p>
                        <p className="text-xs text-gray-500 capitalize">{role} Account</p>
                      </div>
                    </div>

                    {/* Logged In Mobile Links */}
                    <div className="flex flex-col space-y-1">
                      <Link
                          to={role === "tenant" ? "/tenants" : "/property-owner"}
                          onClick={closeDrawer}
                          className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg"
                      >
                        <IconHome size={20} className="text-gray-400" />
                        Dashboard
                      </Link>
                      <Link
                          to="/profile"
                          onClick={closeDrawer}
                          className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg"
                      >
                        <IconUser size={20} className="text-gray-400" />
                        My Profile
                      </Link>
                      <button
                          onClick={handleLogout}
                          className="flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg w-full text-left"
                      >
                        <IconLogout size={20} />
                        Sign Out
                      </button>
                    </div>
                  </div>
              ) : (
                  /* Logged Out Mobile Buttons */
                  <div className="space-y-2 px-2">
                    <Button
                        fullWidth
                        variant="light"
                        size="md"
                        radius="md"
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
                        size="md"
                        radius="md"
                        onClick={() => {
                          closeDrawer();
                          navigate("/auth/register");
                        }}
                    >
                      Sign Up
                    </Button>
                  </div>
              )}
            </div>
          </div>
        </Drawer>
      </Box>
  );
}
export default Header;
