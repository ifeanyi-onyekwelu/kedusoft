import {
  Box,
  Burger,
  Drawer,
  Group,
  Menu,
  Flex,
  Collapse,
  rem,
  Button,
  Divider,
  ScrollArea,
} from "@mantine/core";
import { useState } from "react";
import {
  IconBell,
  IconFileText,
  IconHome,
  IconHeartFilled,
  IconStar,
} from "@tabler/icons-react";
import { BiPlusCircle } from "react-icons/bi";
import { useDisclosure } from "@mantine/hooks";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  IconUser,
  IconDashboard,
  IconInfoCircle,
  IconChevronDown,
  IconChevronRight,
  IconLogout,
  IconMapPin,
} from "@tabler/icons-react";
import useAuth from "../../../hooks/useAuth";
import { useUser } from "../../../context/UserContext";
import { motion } from "framer-motion";

type Role = "tenant" | "landlord" | "admin";

// Update the AuthLinks component
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

  const navigateBasedOnRole = (role: Role) => {
    const routes = {
      tenant: "/tenants",
      landlord: "/property-owner",
      admin: "/admin",
    };
    navigate((routes[role] as string) || "/");
  };

  if (!isAuthenticated) {
    return (
      <Group gap="sm">
        <Link
          to="/auth/login"
          className="px-4 py-2 rounded-lg text-sm font-medium text-gray-700 hover:text-primary hover:bg-gray-50 transition-all"
        >
          Sign In
        </Link>

        <Button
          variant="filled"
          color="#0ea5e9"
          onClick={() => navigate("/auth/register")}
          size="sm"
          className="ml-2"
        >
          Sign Up
        </Button>

        <Button
          variant="filled"
          color="#fb7185"
          onClick={() => navigate("/auth/register?role=landlord")}
          size="sm"
          className="ml-2"
        >
          List Property
        </Button>
      </Group>
    );
  }

  return (
    <div className="relative">
      <button
        className="flex items-center gap-3 focus:outline-none hover:bg-gray-50 px-3 py-2 rounded-lg transition-all"
        onClick={() => setUserMenuOpened(!userMenuOpened)}
      >
        {/* Profile Photo or Initials */}
        {user?.profile_picture ? (
          <img
            src={user.profile_picture}
            alt="Profile"
            className="h-9 w-9 rounded-full object-cover ring-2 ring-gray-200"
          />
        ) : (
          <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm ring-2 ring-primary/20">
            {user?.firstName?.[0]}
            {user?.lastName?.[0]}
          </div>
        )}

        <div className="hidden lg:block text-left">
          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold text-gray-900">
              {user?.firstName} {user?.lastName}
            </p>
            {!user?.is_verified && (
              <span className="px-2 py-0.5 text-xs bg-amber-100 text-amber-700 rounded-full font-medium">
                Unverified
              </span>
            )}
          </div>
          <p className="text-xs text-gray-500 capitalize">{role}</p>
        </div>
        <IconChevronDown
          className={`text-gray-400 hidden lg:block transition-transform ${
            userMenuOpened ? "rotate-180" : ""
          }`}
          size={16}
        />
      </button>

      {/* Enhanced Dropdown Menu */}
      {userMenuOpened && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setUserMenuOpened(false)}
          />

          {/* Dropdown */}
          <div className="absolute right-0 mt-3 w-[400px] origin-top-right rounded-xl bg-white shadow-2xl ring-1 ring-gray-200 focus:outline-none z-20 animate-in fade-in slide-in-from-top-2 duration-200">
            {/* Verification Alert for unverified users */}
            {!user?.is_verified && (
              <div className="px-5 py-3 bg-gradient-to-r from-amber-50 to-orange-50 border-b border-amber-100 rounded-t-xl">
                <div className="flex items-start gap-3">
                  <IconInfoCircle
                    className="text-amber-600 mt-0.5 flex-shrink-0"
                    size={18}
                  />
                  <div>
                    <p className="text-sm font-semibold text-amber-900">
                      Account Not Verified
                    </p>
                    <p className="text-xs text-amber-700 mt-0.5">
                      Verify your email to access all features
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Main Content */}
            <div className="p-5">
              <div className="grid grid-cols-2 gap-8">
                {/* Left Column - Role-based Navigation */}
                <div className="space-y-0.5">
                  <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 px-2">
                    Quick Access
                  </h3>

                  {/* Dashboard Link */}
                  <button
                    onClick={() => {
                      navigateBasedOnRole(role);
                      setUserMenuOpened(false);
                    }}
                    className="flex w-full items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-700 hover:text-primary hover:bg-primary/5 rounded-lg transition-all group"
                  >
                    <IconDashboard
                      size={18}
                      className="text-gray-400 group-hover:text-primary transition-colors"
                    />
                    <span>Dashboard</span>
                  </button>

                  {/* Role-specific Links */}
                  {role === "tenant" && (
                    <>
                      <Link
                        to="/tenants/liked"
                        className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-700 hover:text-primary hover:bg-primary/5 rounded-lg transition-all group"
                        onClick={() => setUserMenuOpened(false)}
                      >
                        <IconHeartFilled
                          size={18}
                          className="text-gray-400 group-hover:text-primary transition-colors"
                        />
                        <span>Favorites</span>
                      </Link>
                      <Link
                        to="/listings"
                        className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-700 hover:text-primary hover:bg-primary/5 rounded-lg transition-all group"
                        onClick={() => setUserMenuOpened(false)}
                      >
                        <IconMapPin
                          size={18}
                          className="text-gray-400 group-hover:text-primary transition-colors"
                        />
                        <span>Browse Properties</span>
                      </Link>
                      <Link
                        to="#"
                        className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-700 hover:text-primary hover:bg-primary/5 rounded-lg transition-all group"
                        onClick={() => setUserMenuOpened(false)}
                      >
                        <IconFileText
                          size={18}
                          className="text-gray-400 group-hover:text-primary transition-colors"
                        />
                        <span>My Applications</span>
                      </Link>
                    </>
                  )}

                  {role === "landlord" && (
                    <>
                      <Link
                        to="/property-owner/properties"
                        className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-700 hover:text-primary hover:bg-primary/5 rounded-lg transition-all group"
                        onClick={() => setUserMenuOpened(false)}
                      >
                        <IconHome
                          size={18}
                          className="text-gray-400 group-hover:text-primary transition-colors"
                        />
                        <span>My Properties</span>
                      </Link>
                      <Link
                        to="/property-owner/properties/create"
                        className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-700 hover:text-primary hover:bg-primary/5 rounded-lg transition-all group"
                        onClick={() => setUserMenuOpened(false)}
                      >
                        <BiPlusCircle
                          size={18}
                          className="text-gray-400 group-hover:text-primary transition-colors"
                        />
                        <span>Add Property</span>
                      </Link>
                      <Link
                        to="#"
                        className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-700 hover:text-primary hover:bg-primary/5 rounded-lg transition-all group"
                        onClick={() => setUserMenuOpened(false)}
                      >
                        <IconFileText
                          size={18}
                          className="text-gray-400 group-hover:text-primary transition-colors"
                        />
                        <span>Applications</span>
                      </Link>
                    </>
                  )}

                  {role === "admin" && (
                    <>
                      <Link
                        to="/admin/users"
                        className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-700 hover:text-primary hover:bg-primary/5 rounded-lg transition-all group"
                        onClick={() => setUserMenuOpened(false)}
                      >
                        <IconUser
                          size={18}
                          className="text-gray-400 group-hover:text-primary transition-colors"
                        />
                        <span>Manage Users</span>
                      </Link>
                      <Link
                        to="/admin/properties"
                        className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-700 hover:text-primary hover:bg-primary/5 rounded-lg transition-all group"
                        onClick={() => setUserMenuOpened(false)}
                      >
                        <IconHome
                          size={18}
                          className="text-gray-400 group-hover:text-primary transition-colors"
                        />
                        <span>Manage Properties</span>
                      </Link>
                      <Link
                        to="/admin/analytics"
                        className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-700 hover:text-primary hover:bg-primary/5 rounded-lg transition-all group"
                        onClick={() => setUserMenuOpened(false)}
                      >
                        <IconStar
                          size={18}
                          className="text-gray-400 group-hover:text-primary transition-colors"
                        />
                        <span>Analytics</span>
                      </Link>
                    </>
                  )}
                </div>

                {/* Right Column - Settings & Account */}
                <div className="space-y-0.5">
                  <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 px-2">
                    Account
                  </h3>

                  <Link
                    to="/profile"
                    className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-700 hover:text-primary hover:bg-primary/5 rounded-lg transition-all group"
                    onClick={() => setUserMenuOpened(false)}
                  >
                    <IconUser
                      size={18}
                      className="text-gray-400 group-hover:text-primary transition-colors"
                    />
                    <span>Profile Settings</span>
                  </Link>

                  <Link
                    to="#"
                    className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-700 hover:text-primary hover:bg-primary/5 rounded-lg transition-all group"
                    onClick={() => setUserMenuOpened(false)}
                  >
                    <IconBell
                      size={18}
                      className="text-gray-400 group-hover:text-primary transition-colors"
                    />
                    <span>Notifications</span>
                  </Link>

                  <Link
                    to="/help"
                    className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-700 hover:text-primary hover:bg-primary/5 rounded-lg transition-all group"
                    onClick={() => setUserMenuOpened(false)}
                  >
                    <IconInfoCircle
                      size={18}
                      className="text-gray-400 group-hover:text-primary transition-colors"
                    />
                    <span>Help & Support</span>
                  </Link>

                  <div className="border-t border-gray-200 my-3"></div>

                  <button
                    onClick={() => {
                      setUserMenuOpened(false);
                      handleLogout();
                    }}
                    className="flex w-full items-center gap-3 px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-all group"
                  >
                    <IconLogout
                      size={18}
                      className="text-red-500 group-hover:text-red-600 transition-colors"
                    />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

const MobileNavItem = ({
  link,
  onClick,
}: {
  link: any;
  onClick: () => void;
}) => {
  const [opened, { toggle }] = useDisclosure(false);
  const { pathname } = useLocation();

  if (link.children) {
    return (
      <Box>
        {/* Main link - if it has a path, show it as a link */}
        {link.path && (
          <Link
            to={link.path}
            onClick={onClick}
            className={`block w-full px-4 py-2 text-left font-medium border-b border-gray-100 mb-1 ${
              pathname === link.path
                ? "text-secondary bg-blue-50"
                : "text-gray-800 hover:bg-gray-50"
            }`}
          >
            {link.label}
          </Link>
        )}

        {/* Dropdown trigger */}
        <Group
          className="w-full px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md flex items-center justify-between cursor-pointer text-sm"
          onClick={toggle}
        >
          <span>Browse {link.label.toLowerCase()}</span>

          {opened ? (
            <IconChevronDown size={14} />
          ) : (
            <IconChevronRight size={14} />
          )}
        </Group>

        <Collapse in={opened}>
          <Box pl={rem(16)} className="max-h-48 overflow-y-auto">
            {link.children.slice(0, 15).map((child: any) => (
              <MobileNavItem key={child.path} link={child} onClick={onClick} />
            ))}
            {link.children.length > 15 && (
              <Link
                to={link.path || "/browse-locations"}
                onClick={onClick}
                className="block w-full px-4 py-2 text-xs text-gray-500 hover:bg-gray-50 border-t border-gray-100 mt-1"
              >
                View all {link.children.length} locations →
              </Link>
            )}
          </Box>
        </Collapse>
      </Box>
    );
  }

  return (
    <Link
      to={link.path}
      onClick={onClick}
      className={`px-4 py-3 rounded-md flex items-center gap-3 ${
        pathname === link.path
          ? "bg-blue-50 text-primary font-medium"
          : "text-gray-700 hover:bg-gray-100"
      }`}
    >
      <span>{link.label}</span>
    </Link>
  );
};

const navLinks = [
  {
    path: "/listings?purpose=sale",
    label: "Buy",
    children: [
      { path: "/listings?purpose=sale", label: "All Properties for Sale" },
      { path: "/listings?purpose=sale&type=apartment", label: "Apartments" },
      { path: "/listings?purpose=sale&type=house", label: "Houses" },
      { path: "/listings?purpose=sale&type=duplex", label: "Duplex" },
      { path: "/listings?purpose=sale&featured=true", label: "Featured" },
    ],
  },
  {
    path: "/listings?purpose=rent",
    label: "Rent",
    children: [
      { path: "/listings?purpose=rent", label: "All Properties for Rent" },
      { path: "/listings?purpose=rent&type=apartment", label: "Apartments" },
      { path: "/listings?purpose=rent&type=house", label: "Houses" },
      { path: "/listings?purpose=rent&type=duplex", label: "Duplex" },
      {
        path: "/listings?purpose=rent&type=self-contain",
        label: "Self-Contain",
      },
      { path: "/listings?purpose=rent&featured=true", label: "Featured" },
    ],
  },
  {
    path: "/shortlet",
    label: "Shortlet",
  },
  {
    path: "/services",
    label: "Services",
  },
  {
    path: "/agents",
    label: "Agents",
  },
];

function Header() {
  const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] =
    useDisclosure(false);
  const { pathname } = useLocation();

  return (
    <Box
      component="header"
      className="sticky top-0 w-full z-50 bg-white border-b border-gray-100 shadow-sm"
    >
      <Box className="max-max-window mx-auto px-4 sm:px-6 lg:px-8">
        <Flex justify="space-between" align="center" h={rem(70)}>
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center"
            >
              <motion.img
                src="/images/brand/logo_cropped.png"
                alt="PropConnect Logo"
                className="h-14 w-auto object-contain"
              />
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <Group gap={2} visibleFrom="md">
            {navLinks.map((link) => {
              if (link.children) {
                return (
                  <Menu
                    key={link.label}
                    trigger="hover"
                    transitionProps={{
                      transition: "fade-down",
                      duration: 150,
                    }}
                    withinPortal
                    offset={8}
                  >
                    <Menu.Target>
                      <Link
                        to={link.path!}
                        className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-1.5 transition-all ${
                          pathname.includes(link.path!)
                            ? "text-primary bg-primary/5"
                            : "text-gray-700 hover:text-primary hover:bg-gray-50"
                        }`}
                      >
                        <span>{link.label}</span>
                        <IconChevronDown size={14} className="opacity-60" />
                      </Link>
                    </Menu.Target>
                    <Menu.Dropdown className="min-w-[220px] rounded-xl shadow-lg border border-gray-100 p-2">
                      {link.children.map((child, index) => (
                        <Menu.Item
                          key={child.path}
                          component={Link}
                          to={child.path}
                          className={`text-sm rounded-lg px-3 py-2.5 text-gray-700 hover:text-primary hover:bg-primary/5 transition-colors ${
                            index === 0
                              ? "font-medium border-b border-gray-100 mb-1 pb-3"
                              : ""
                          }`}
                        >
                          {child.label}
                        </Menu.Item>
                      ))}
                    </Menu.Dropdown>
                  </Menu>
                );
              } else {
                return (
                  <Link
                    key={link.path}
                    to={link.path!}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      pathname === link.path
                        ? "text-primary bg-primary/5"
                        : "text-gray-700 hover:text-primary hover:bg-gray-50"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              }
            })}
          </Group>

          {/* Desktop Auth Links */}
          <Group gap="md" visibleFrom="md">
            <AuthLinks />
          </Group>

          {/* Mobile menu button */}
          <Burger
            opened={drawerOpened}
            onClick={toggleDrawer}
            hiddenFrom="md"
            size="sm"
            color={"dark"}
          />
        </Flex>
      </Box>

      {/* Mobile Drawer */}
      <Drawer
        opened={drawerOpened}
        onClose={closeDrawer}
        size="100%"
        padding="md"
        hiddenFrom="md"
        zIndex={1000000}
        title={
          <Link to="/" onClick={closeDrawer}>
            <div className="w-fit py-1 rounded-lg flex items-center justify-center font-bold">
              Rentify
            </div>
          </Link>
        }
        overlayProps={{ backgroundOpacity: 0.5, blur: 4 }}
      >
        <ScrollArea h={`calc(100vh - ${rem(80)})`} mx="-md">
          <Divider my="sm" />

          <div className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <MobileNavItem
                key={link.label}
                link={link}
                onClick={closeDrawer}
              />
            ))}

            <div className="mt-4 pt-4 border-t border-gray-200">
              <AuthLinks />
            </div>
          </div>
        </ScrollArea>
      </Drawer>
    </Box>
  );
}

export default Header;
