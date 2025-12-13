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
  IconBuilding,
  IconMapPin,
  IconBed,
  IconDoor,
  IconBuildingSkyscraper,
  IconTrees,
  IconBuildingStore,
  IconBuildingWarehouse,
  IconHomeEco,
  IconMap2,
  IconCurrencyNaira,
  IconChevronUp,
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

const nigerianStates = [
  "Abia",
  "Akwa Ibom",
  "Anambra",
  "Delta",
  "Ebonyi",
  "Edo",
  "Ekiti",
  "Enugu",
  "Imo",
  "Kwara",
  "Lagos",
  "Niger",
  "Oyo",
];

const categories = [
  { name: "Apartment", icon: IconBuilding },
  { name: "Self-Contained / Studio / Mini-Flat", icon: IconDoor },
  { name: "Duplex", icon: IconHome },
  { name: "Bungalow", icon: IconHomeEco },
  { name: "Detached / Semi-Detached", icon: IconBuilding },
  { name: "Serviced Apartment / Condo", icon: IconBuildingSkyscraper },
  { name: "Boys' Quarters (BQ)", icon: IconHome },
  { name: "Shared Apartment / Co-Living", icon: IconBed },
  { name: "Hostel / Student Housing", icon: IconBed },
  { name: "Short-Let", icon: IconDoor },
  { name: "Office Space", icon: IconBuildingSkyscraper },
  { name: "Shop / Store", icon: IconBuildingStore },
  { name: "Co-Office Space", icon: IconBuilding },
  { name: "Warehouse / Industrial Space", icon: IconBuildingWarehouse },
  { name: "Lodge / Guest House", icon: IconHome },
  { name: "Land (Residential / Commercial / Agricultural)", icon: IconTrees },
];

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

// Enhanced dropdown components with full-width grid layouts
const BuyDropdown = () => (
  <div className="w-screen max-w-full px-6 py-8">
    <div className="grid grid-cols-4 gap-8">
      {/* All Property Categories */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2 pb-2 border-b border-gray-200">
          <IconHome size={18} className="text-blue-600" />
          All Property Types
        </h3>
        <div className="space-y-2">
          {categories.slice(0, 8).map((category) => (
            <Link
              key={category.name}
              to={`/listings?type=sale&category=${encodeURIComponent(
                category.name
              )}`}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-blue-50 transition-colors group"
            >
              <category.icon
                size={16}
                className="text-gray-500 group-hover:text-blue-600 flex-shrink-0"
              />
              <span className="text-sm text-gray-700 group-hover:text-blue-600 leading-tight">
                {category.name}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* More Categories */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2 pb-2 border-b border-gray-200">
          <IconBuilding size={18} className="text-blue-600" />
          More Property Types
        </h3>
        <div className="space-y-2">
          {categories.slice(8).map((category) => (
            <Link
              key={category.name}
              to={`/listings?type=sale&category=${encodeURIComponent(
                category.name
              )}`}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-blue-50 transition-colors group"
            >
              <category.icon
                size={16}
                className="text-gray-500 group-hover:text-blue-600 flex-shrink-0"
              />
              <span className="text-sm text-gray-700 group-hover:text-blue-600 leading-tight">
                {category.name}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* Popular Features & Price Range */}
      <div className="space-y-6">
        <div>
          <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <IconStar size={16} className="text-amber-500" />
            Popular Features
          </h3>
          <div className="grid grid-cols-1 gap-1">
            {[
              { label: "Swimming Pool", param: "pool" },
              { label: "4+ Bedrooms", param: "bedrooms=4" },
              { label: "Gated Estate", param: "gated" },
              { label: "New Construction", param: "new=true" },
              { label: "Waterfront", param: "waterfront" },
              { label: "Fully Furnished", param: "furnished=true" },
            ].map((item) => (
              <Link
                key={item.param}
                to={`/listings?type=sale&${item.param}`}
                className="block p-2 rounded-lg hover:bg-blue-50 transition-colors text-sm text-gray-700 hover:text-blue-600"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <IconCurrencyNaira size={16} className="text-green-600" />
            Price Range
          </h3>
          <div className="grid grid-cols-1 gap-1">
            {[
              { label: "Under ₦10M", param: "maxPrice=10000000" },
              {
                label: "₦10M - ₦30M",
                param: "minPrice=10000000&maxPrice=30000000",
              },
              {
                label: "₦30M - ₦50M",
                param: "minPrice=30000000&maxPrice=50000000",
              },
              {
                label: "₦50M - ₦100M",
                param: "minPrice=50000000&maxPrice=100000000",
              },
              { label: "₦100M+", param: "minPrice=100000000" },
            ].map((item) => (
              <Link
                key={item.param}
                to={`/listings?type=sale&${item.param}`}
                className="block p-2 rounded-lg hover:bg-blue-50 transition-colors text-sm text-gray-700 hover:text-blue-600"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* States & Locations */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2 pb-2 border-b border-gray-200">
          <IconMapPin size={18} className="text-red-600" />
          Locations by State
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {nigerianStates.map((state) => (
            <Link
              key={state}
              to={`/listings?type=sale&state=${encodeURIComponent(state)}`}
              className="flex items-center gap-2 p-2 rounded-lg hover:bg-blue-50 transition-colors group"
            >
              <IconMap2
                size={14}
                className="text-gray-500 group-hover:text-red-600"
              />
              <span className="text-sm text-gray-700 group-hover:text-blue-600">
                {state}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  </div>
);

const RentDropdown = () => (
  <div className="w-screen max-w-full px-6 py-8">
    <div className="grid grid-cols-4 gap-8">
      {/* All Rental Categories */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2 pb-2 border-b border-gray-200">
          <IconBed size={18} className="text-purple-600" />
          All Rental Types
        </h3>
        <div className="space-y-2">
          {categories.slice(0, 8).map((category) => (
            <Link
              key={category.name}
              to={`/listings?type=rent&category=${encodeURIComponent(
                category.name
              )}`}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-purple-50 transition-colors group"
            >
              <category.icon
                size={16}
                className="text-gray-500 group-hover:text-purple-600 flex-shrink-0"
              />
              <span className="text-sm text-gray-700 group-hover:text-purple-600 leading-tight">
                {category.name}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* More Rental Categories */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2 pb-2 border-b border-gray-200">
          <IconBuilding size={18} className="text-purple-600" />
          More Rental Types
        </h3>
        <div className="space-y-2">
          {categories.slice(8).map((category) => (
            <Link
              key={category.name}
              to={`/listings?type=rent&category=${encodeURIComponent(
                category.name
              )}`}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-purple-50 transition-colors group"
            >
              <category.icon
                size={16}
                className="text-gray-500 group-hover:text-purple-600 flex-shrink-0"
              />
              <span className="text-sm text-gray-700 group-hover:text-purple-600 leading-tight">
                {category.name}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* Budget Range & Features */}
      <div className="space-y-6">
        <div>
          <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <IconCurrencyNaira size={16} className="text-green-600" />
            Budget Range
          </h3>
          <div className="grid grid-cols-1 gap-1">
            {[
              { label: "Under ₦500k/year", param: "maxPrice=500000" },
              {
                label: "₦500k - ₦1M/year",
                param: "minPrice=500000&maxPrice=1000000",
              },
              {
                label: "₦1M - ₦2M/year",
                param: "minPrice=1000000&maxPrice=2000000",
              },
              {
                label: "₦2M - ₦5M/year",
                param: "minPrice=2000000&maxPrice=5000000",
              },
              { label: "₦5M+/year", param: "minPrice=5000000" },
            ].map((item) => (
              <Link
                key={item.param}
                to={`/listings?type=rent&${item.param}`}
                className="block p-2 rounded-lg hover:bg-purple-50 transition-colors text-sm text-gray-700 hover:text-purple-600"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <IconStar size={16} className="text-amber-500" />
            Rental Features
          </h3>
          <div className="grid grid-cols-1 gap-1">
            {[
              { label: "Fully Furnished", param: "furnished=true" },
              { label: "Utilities Included", param: "utilities=included" },
              { label: "24/7 Security", param: "security" },
              { label: "Generator", param: "generator" },
              { label: "Pool & Gym", param: "amenities=pool,gym" },
            ].map((item) => (
              <Link
                key={item.param}
                to={`/listings?type=rent&${item.param}`}
                className="block p-2 rounded-lg hover:bg-purple-50 transition-colors text-sm text-gray-700 hover:text-purple-600"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* States & Locations */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2 pb-2 border-b border-gray-200">
          <IconMapPin size={18} className="text-red-600" />
          Locations by State
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {nigerianStates.map((state) => (
            <Link
              key={state}
              to={`/listings?type=rent&state=${encodeURIComponent(state)}`}
              className="flex items-center gap-2 p-2 rounded-lg hover:bg-purple-50 transition-colors group"
            >
              <IconMap2
                size={14}
                className="text-gray-500 group-hover:text-red-600"
              />
              <span className="text-sm text-gray-700 group-hover:text-purple-600">
                {state}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  </div>
);

const ShortletDropdown = () => (
  <div className="w-screen max-w-full px-6 py-8">
    <div className="grid grid-cols-4 gap-8">
      {/* Shortlet Types */}
      <div className="col-span-2">
        <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2 pb-2 border-b border-gray-200">
          <IconDoor size={18} className="text-orange-600" />
          Shortlet Types
        </h3>
        <div className="grid grid-cols-2 gap-4">
          {[
            {
              name: "Serviced Apartment",
              icon: IconBuildingSkyscraper,
              count: "234",
            },
            { name: "Studio Apartment", icon: IconDoor, count: "189" },
            { name: "Luxury Apartment", icon: IconHome, count: "156" },
            { name: "Beach House", icon: IconHomeEco, count: "67" },
            { name: "Guest House", icon: IconBuilding, count: "89" },
            { name: "Vacation Home", icon: IconHome, count: "112" },
            {
              name: "Executive Suite",
              icon: IconBuildingSkyscraper,
              count: "78",
            },
            { name: "Boutique Hotel", icon: IconHome, count: "45" },
          ].map((item) => (
            <Link
              key={item.name}
              to={`/listings?type=shortlet&category=${encodeURIComponent(
                item.name
              )}`}
              className="flex items-center justify-between p-3 rounded-lg hover:bg-orange-50 transition-colors group border border-gray-100"
            >
              <div className="flex items-center gap-3">
                <item.icon
                  size={16}
                  className="text-gray-500 group-hover:text-orange-600"
                />
                <span className="text-sm font-medium text-gray-700 group-hover:text-orange-600">
                  {item.name}
                </span>
              </div>
              <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">
                {item.count}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* Popular Locations */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2 pb-2 border-b border-gray-200">
          <IconMapPin size={18} className="text-red-600" />
          Popular Cities
        </h3>
        <div className="grid grid-cols-1 gap-2">
          {[
            { city: "Lagos", count: "456" },
            { city: "Abuja", count: "289" },
            { city: "Port Harcourt", count: "134" },
            { city: "Calabar", count: "89" },
            { city: "Uyo", count: "67" },
            { city: "Enugu", count: "78" },
            { city: "Ibadan", count: "92" },
            { city: "Kano", count: "45" },
          ].map((location) => (
            <Link
              key={location.city}
              to={`/listings?type=shortlet&state=${encodeURIComponent(
                location.city
              )}`}
              className="flex items-center justify-between p-2 rounded-lg hover:bg-orange-50 transition-colors group"
            >
              <span className="text-sm text-gray-700 group-hover:text-orange-600">
                {location.city}
              </span>
              <span className="text-xs text-gray-400">{location.count}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Features & Amenities */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2 pb-2 border-b border-gray-200">
          <IconStar size={18} className="text-amber-500" />
          Popular Features
        </h3>
        <div className="grid grid-cols-1 gap-2">
          {[
            "Daily Cleaning",
            "Free WiFi",
            "Swimming Pool",
            "Gym Access",
            "24/7 Security",
            "Netflix & TV",
            "Free Parking",
            "Kitchenette",
            "Air Conditioning",
            "Laundry Service",
          ].map((feature) => (
            <div
              key={feature}
              className="flex items-center gap-2 p-2 text-sm text-gray-600"
            >
              <div className="w-1.5 h-1.5 bg-orange-400 rounded-full"></div>
              {feature}
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

const CommercialDropdown = () => (
  <div className="w-screen max-w-full px-6 py-8">
    <div className="grid grid-cols-4 gap-8">
      {/* Commercial Types */}
      <div className="col-span-2">
        <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2 pb-2 border-b border-gray-200">
          <IconBuildingStore size={18} className="text-indigo-600" />
          Commercial Properties
        </h3>
        <div className="grid grid-cols-2 gap-4">
          {categories
            .filter(
              (cat) =>
                cat.name.includes("Office") ||
                cat.name.includes("Shop") ||
                cat.name.includes("Warehouse") ||
                cat.name.includes("Commercial") ||
                cat.name.includes("Land")
            )
            .map((category) => (
              <Link
                key={category.name}
                to={`/listings?type=sale&category=${encodeURIComponent(
                  category.name
                )}`}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-indigo-50 transition-colors group border border-gray-100"
              >
                <category.icon
                  size={16}
                  className="text-gray-500 group-hover:text-indigo-600"
                />
                <span className="text-sm font-medium text-gray-700 group-hover:text-indigo-600">
                  {category.name}
                </span>
              </Link>
            ))}
        </div>
      </div>

      {/* Business Hubs */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2 pb-2 border-b border-gray-200">
          <IconMapPin size={18} className="text-red-600" />
          Business Hubs
        </h3>
        <div className="grid grid-cols-1 gap-2">
          {[
            "Lagos Island",
            "Victoria Island",
            "Ikeja",
            "Apapa",
            "Central Business District, Abuja",
            "Port Harcourt GRA",
            "Kano CBD",
            "Ibadan Central",
            "Enugu GRA",
            "Calabar MM",
          ].map((area) => (
            <Link
              key={area}
              to={`/listings?type=sale&location=${encodeURIComponent(area)}`}
              className="block p-2 rounded-lg hover:bg-indigo-50 transition-colors text-sm text-gray-700 hover:text-indigo-600"
            >
              {area}
            </Link>
          ))}
        </div>
      </div>

      {/* Commercial Features */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2 pb-2 border-b border-gray-200">
          <IconStar size={18} className="text-amber-500" />
          Business Features
        </h3>
        <div className="grid grid-cols-1 gap-2">
          {[
            "High Foot Traffic",
            "Ample Parking",
            "24/7 Security",
            "Air Conditioning",
            "Renovated Space",
            "Flexible Layout",
            "Storage Space",
            "Loading Bay",
            "Professional Setting",
            "Accessibility",
          ].map((feature) => (
            <div
              key={feature}
              className="flex items-center gap-2 p-2 text-sm text-gray-600"
            >
              <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full"></div>
              {feature}
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

const LocationsDropdown = () => (
  <div className="w-screen max-w-full px-6 py-8">
    <div className="grid grid-cols-6 gap-6">
      {/* All States in 6 columns */}
      {nigerianStates.map((state) => (
        <Link
          key={state}
          to={`/listings?state=${encodeURIComponent(state)}`}
          className="flex items-center gap-3 p-3 rounded-lg hover:bg-blue-50 transition-colors group border border-gray-100"
        >
          <IconMapPin
            size={16}
            className="text-gray-500 group-hover:text-blue-600"
          />
          <span className="text-sm font-medium text-gray-700 group-hover:text-blue-600">
            {state}
          </span>
        </Link>
      ))}
    </div>

    {/* Popular Cities Section */}
    <div className="mt-8 pt-6 border-t border-gray-200">
      <h3 className="text-sm font-semibold text-gray-900 mb-4">
        🏙️ Major Cities
      </h3>
      <div className="grid grid-cols-4 gap-4">
        {[
          {
            city: "Lagos",
            areas: [
              "Victoria Island",
              "Lekki",
              "Ikeja",
              "Surulere",
              "Yaba",
              "Gbagada",
            ],
          },
          {
            city: "Abuja",
            areas: ["Maitama", "Asokoro", "Wuse", "Gwarinpa", "Jabi", "Utako"],
          },
          {
            city: "Port Harcourt",
            areas: ["GRA", "Trans-Amadi", "Rumuola", "Rumuokoro", "Old GRA"],
          },
          {
            city: "Ibadan",
            areas: [
              "Bodija",
              "Jericho",
              "Mokola",
              "Iwo Road",
              "Challenge",
              "Apata",
            ],
          },
        ].map((location) => (
          <div key={location.city} className="bg-gray-50 rounded-lg p-4">
            <Link
              to={`/listings?state=${encodeURIComponent(location.city)}`}
              className="text-sm font-semibold text-gray-900 hover:text-blue-600 block mb-3"
            >
              {location.city}
            </Link>
            <div className="space-y-1">
              {location.areas.map((area) => (
                <Link
                  key={area}
                  to={`/listings?city=${encodeURIComponent(area)}`}
                  className="block text-xs text-gray-600 hover:text-blue-600 py-1 px-2 hover:bg-white rounded"
                >
                  {area}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// Update navLinks to include all dropdowns
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
    component: ShortletDropdown,
  },
  {
    label: "Commercial",
    component: CommercialDropdown,
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

// Keep your existing MobileNavItem and Header components exactly as they are
// ... (your existing MobileNavItem and Header components)

function Header() {
  const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] =
    useDisclosure(false);
  const { pathname } = useLocation();

  return (
    <Box
      component="header"
      className="sticky top-0 w-full z-50 bg-white border-b border-gray-100 shadow-sm"
    >
      {/* Remove max-w-window to allow full width */}
      <Box className="w-full px-4 sm:px-6 lg:px-8">
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

          {/* Desktop Navigation - Full width */}
          <Group
            gap={2}
            visibleFrom="lg"
            className="flex-1 justify-center mx-8"
          >
            {navLinks.map((link) => {
              if (link.component) {
                // eslint-disable-next-line react-hooks/rules-of-hooks
                const [dropdownOpened, setDropdownOpened] = useState(false);

                return (
                  <Menu
                    key={link.label}
                    trigger="hover"
                    transitionProps={{
                      transition: "fade",
                      duration: 0,
                    }}
                    withinPortal={false}
                    offset={0}
                    openDelay={0}
                    closeDelay={100}
                    opened={dropdownOpened}
                    onChange={setDropdownOpened}
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
                        {dropdownOpened ? (
                          <IconChevronUp size={14} className="opacity-60" />
                        ) : (
                          <IconChevronDown size={14} className="opacity-60" />
                        )}
                      </div>
                    </Menu.Target>
                    <Menu.Dropdown
                      className="rounded-2xl shadow-xl border border-gray-200 overflow-hidden p-0 w-screen max-w-full fixed left-0 right-0"
                      style={{ top: "70px" }}
                    >
                      <div onClick={() => setDropdownOpened(false)}>
                        <link.component />
                      </div>
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
