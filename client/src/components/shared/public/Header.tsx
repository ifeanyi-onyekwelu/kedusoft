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
  SimpleGrid,
} from "@mantine/core";
import { useState } from "react";
import {
  IconBell,
  IconFileText,
  IconHome,
  IconHeartFilled,
  IconStar,
  IconBuilding,
  IconMapPin,
  IconTrendingUp,
  IconBed,
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

// Enhanced dropdown components with grid layout
const BuyDropdown = () => (
  <div className="w-[800px] p-6">
    <SimpleGrid cols={3} spacing="lg">
      {/* Property Types */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <IconHome size={16} className="text-blue-600" />
          Property Types
        </h3>
        <div className="space-y-2">
          {[
            {
              label: "Apartments",
              path: "/listings?purpose=sale&type=apartment",
              icon: IconBuilding,
            },
            {
              label: "Houses",
              path: "/listings?purpose=sale&type=house",
              icon: IconHome,
            },
            {
              label: "Duplex",
              path: "/listings?purpose=sale&type=duplex",
              icon: IconBuilding,
            },
            {
              label: "Lands",
              path: "/listings?purpose=sale&type=land",
              icon: IconMapPin,
            },
            {
              label: "Commercial",
              path: "/listings?purpose=sale&type=commercial",
              icon: IconBuilding,
            },
          ].map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors group"
            >
              <item.icon
                size={18}
                className="text-gray-400 group-hover:text-blue-600"
              />
              <span className="text-sm text-gray-700 group-hover:text-blue-600">
                {item.label}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* Popular Features */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <IconStar size={16} className="text-amber-500" />
          Popular Features
        </h3>
        <div className="space-y-2">
          {[
            {
              label: "Swimming Pool",
              path: "/listings?purpose=sale&amenities=pool",
            },
            { label: "4+ Bedrooms", path: "/listings?purpose=sale&bedrooms=4" },
            {
              label: "Gated Estate",
              path: "/listings?purpose=sale&amenities=gated",
            },
            {
              label: "New Construction",
              path: "/listings?purpose=sale&new=true",
            },
            {
              label: "Waterfront",
              path: "/listings?purpose=sale&amenities=waterfront",
            },
          ].map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="block p-2 rounded-lg hover:bg-gray-50 transition-colors text-sm text-gray-700 hover:text-blue-600"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Price Range & Locations */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <IconMapPin size={16} className="text-green-600" />
          Popular Locations
        </h3>
        <div className="space-y-2">
          {[
            {
              label: "Lagos Mainland",
              path: "/listings?purpose=sale&location=lagos-mainland",
            },
            {
              label: "Lagos Island",
              path: "/listings?purpose=sale&location=lagos-island",
            },
            {
              label: "Abuja Central",
              path: "/listings?purpose=sale&location=abuja-central",
            },
            {
              label: "Port Harcourt",
              path: "/listings?purpose=sale&location=port-harcourt",
            },
            { label: "Ibadan", path: "/listings?purpose=sale&location=ibadan" },
          ].map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="block p-2 rounded-lg hover:bg-gray-50 transition-colors text-sm text-gray-700 hover:text-blue-600"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </SimpleGrid>

    {/* Bottom Section */}
    <div className="mt-6 pt-6 border-t border-gray-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            to="/listings?purpose=sale&featured=true"
            className="text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            🔥 Featured Properties
          </Link>
          <Link
            to="/listings?purpose=sale&discount=true"
            className="text-sm font-medium text-green-600 hover:text-green-700"
          >
            💰 Great Deals
          </Link>
        </div>
        <Link
          to="/listings?purpose=sale"
          className="text-sm font-semibold text-gray-900 hover:text-blue-600"
        >
          View All Properties →
        </Link>
      </div>
    </div>
  </div>
);

const RentDropdown = () => (
  <div className="w-[800px] p-6">
    <SimpleGrid cols={3} spacing="lg">
      {/* Rental Types */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <IconBed size={16} className="text-purple-600" />
          Rental Types
        </h3>
        <div className="space-y-2">
          {[
            {
              label: "Studio Apartments",
              path: "/listings?purpose=rent&type=studio",
            },
            {
              label: "1-2 Bedrooms",
              path: "/listings?purpose=rent&bedrooms=1-2",
            },
            { label: "3+ Bedrooms", path: "/listings?purpose=rent&bedrooms=3" },
            { label: "Shortlets", path: "/shortlet" },
            {
              label: "Serviced Apartments",
              path: "/listings?purpose=rent&type=serviced",
            },
          ].map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="block p-2 rounded-lg hover:bg-gray-50 transition-colors text-sm text-gray-700 hover:text-blue-600"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Budget Range */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <IconTrendingUp size={16} className="text-green-600" />
          Budget Range
        </h3>
        <div className="space-y-2">
          {[
            {
              label: "Under ₦500k/year",
              path: "/listings?purpose=rent&maxPrice=500000",
            },
            {
              label: "₦500k - ₦1M/year",
              path: "/listings?purpose=rent&minPrice=500000&maxPrice=1000000",
            },
            {
              label: "₦1M - ₦2M/year",
              path: "/listings?purpose=rent&minPrice=1000000&maxPrice=2000000",
            },
            {
              label: "₦2M+/year",
              path: "/listings?purpose=rent&minPrice=2000000",
            },
            {
              label: "Flexible Payment",
              path: "/listings?purpose=rent&payment=flexible",
            },
          ].map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="block p-2 rounded-lg hover:bg-gray-50 transition-colors text-sm text-gray-700 hover:text-blue-600"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Popular Areas */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <IconMapPin size={16} className="text-red-600" />
          Hot Locations
        </h3>
        <div className="space-y-2">
          {[
            {
              label: "Lekki, Lagos",
              path: "/listings?purpose=rent&location=lekki",
            },
            {
              label: "Victoria Island",
              path: "/listings?purpose=rent&location=victoria-island",
            },
            {
              label: "Maitama, Abuja",
              path: "/listings?purpose=rent&location=maitama",
            },
            {
              label: "GRA Port Harcourt",
              path: "/listings?purpose=rent&location=gra-ph",
            },
            {
              label: "Bodija, Ibadan",
              path: "/listings?purpose=rent&location=bodija",
            },
          ].map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="block p-2 rounded-lg hover:bg-gray-50 transition-colors text-sm text-gray-700 hover:text-blue-600"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </SimpleGrid>

    {/* Bottom Section */}
    <div className="mt-6 pt-6 border-t border-gray-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            to="/listings?purpose=rent&furnished=true"
            className="text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            🛋️ Furnished Apartments
          </Link>
          <Link
            to="/listings?purpose=rent&utilities=included"
            className="text-sm font-medium text-green-600 hover:text-green-700"
          >
            💡 Utilities Included
          </Link>
        </div>
        <Link
          to="/listings?purpose=rent"
          className="text-sm font-semibold text-gray-900 hover:text-blue-600"
        >
          Browse All Rentals →
        </Link>
      </div>
    </div>
  </div>
);

const LocationsDropdown = () => (
  <div className="w-[600px] p-6">
    <SimpleGrid cols={2} spacing="lg">
      {/* Major Cities */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-3">
          🏙️ Major Cities
        </h3>
        <div className="space-y-2">
          {[
            { label: "Lagos", path: "/locations/lagos", count: "2.4K" },
            { label: "Abuja", path: "/locations/abuja", count: "1.8K" },
            {
              label: "Port Harcourt",
              path: "/locations/port-harcourt",
              count: "890",
            },
            { label: "Ibadan", path: "/locations/ibadan", count: "760" },
            { label: "Kano", path: "/locations/kano", count: "540" },
          ].map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors group"
            >
              <span className="text-sm text-gray-700 group-hover:text-blue-600">
                {item.label}
              </span>
              <span className="text-xs text-gray-400">
                {item.count} properties
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* Emerging Areas */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-3">
          🚀 Emerging Areas
        </h3>
        <div className="space-y-2">
          {[
            { label: "Epe, Lagos", path: "/locations/epe" },
            { label: "Lugbe, Abuja", path: "/locations/lugbe" },
            { label: "Elelenwo, PH", path: "/locations/elelenwo" },
            { label: "Akobo, Ibadan", path: "/locations/akobo" },
            { label: "View All Locations", path: "/locations" },
          ].map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="block p-2 rounded-lg hover:bg-gray-50 transition-colors text-sm text-gray-700 hover:text-blue-600"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </SimpleGrid>
  </div>
);

const navLinks = [
  {
    label: "Buy",
    component: BuyDropdown,
  },
  {
    label: "Rent",
    component: RentDropdown,
  },
  {
    label: "Shortlet",
    path: "/shortlet",
  },
  {
    label: "Commercial",
    path: "/commercial",
  },
  {
    label: "Locations",
    component: LocationsDropdown,
  },
  {
    label: "Agents",
    path: "/agents",
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
      <Box className="max-w-window  mx-auto px-4 sm:px-6 lg:px-8">
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
          <Group gap={2} visibleFrom="lg" className="flex-1 justify-center">
            {navLinks.map((link) => {
              if (link.component) {
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
                      <div
                        className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
                          pathname.includes(link.label.toLowerCase())
                            ? "text-primary bg-primary/5"
                            : "text-gray-700 hover:text-primary hover:bg-gray-50"
                        }`}
                      >
                        <span>{link.label}</span>
                        <IconChevronDown size={14} className="opacity-60" />
                      </div>
                    </Menu.Target>
                    <Menu.Dropdown className="rounded-2xl shadow-xl border border-gray-200 overflow-hidden p-0">
                      <link.component />
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
            <div className="flex items-center gap-2">
              <motion.img
                src="/images/brand/logo_cropped.png"
                alt="PropConnect Logo"
                className="h-10 w-auto object-contain"
              />
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
