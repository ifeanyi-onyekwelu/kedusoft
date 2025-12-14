import React, { ReactNode, useState, useEffect } from "react";
import {
  IconBed,
  IconCreditCard,
  IconFile,
  IconFilePlus,
  IconHome,
  IconLogout,
  IconMessage,
  IconSettings,
  IconUsers,
  IconChevronDown,
  IconChevronLeft,
  IconChevronRight,
  IconBrain,
  IconUser,
} from "@tabler/icons-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Tooltip, Collapse } from "@mantine/core";
import { useUser } from "../../../context/UserContext";
import { logoutApi } from "../../../apis/authApi";
import { useLandlordOperations } from "../../../apis/landlordApi";

type LinkItem = {
  name: string;
  path: string;
  icon: ReactNode;
  badge?: string;
  subItems?: {
    name: string;
    path: string;
  }[];
};

export type RoleLinks = {
  tenant: LinkItem[];
  admin: LinkItem[];
  landlord: LinkItem[];
};

type SidebarProps = {
  role: keyof RoleLinks | undefined;
  opened: any;
  collapsed?: boolean;
  setCollapsed?: (value: boolean) => void;
};

const StyledIcon = ({ icon: Icon }: any) => {
  return <Icon stroke={1.5} />;
};

const BottomLinks = ({
  to,
  onClick,
  children,
}: {
  to: string;
  onClick?: any;
  children: ReactNode;
}) => {
  return (
    <Link
      to={to}
      onClick={onClick}
      className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-100 text-gray-700 text-sm mb-2 transition-all"
    >
      {children}
    </Link>
  );
};

const Sidebar: React.FC<SidebarProps> = ({
  role,
  opened,
  collapsed,
  setCollapsed,
}) => {
  const { logout } = useUser();
  const navigate = useNavigate();
  const location = useLocation();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [pendingApplications, setPendingApplications] = useState<number>(0);
  const { getApplicationStats } = useLandlordOperations();

  // Fetch pending applications count for landlord
  useEffect(() => {
    if (role === "landlord") {
      const fetchApplicationStats = async () => {
        try {
          const stats = await getApplicationStats();
          // Count pending and under review applications
          const pending = stats?.status_breakdown?.pending || 0;
          const underReview = stats?.status_breakdown?.under_review || 0;
          setPendingApplications(pending + underReview);
        } catch (error) {
          console.error("Error fetching application stats:", error);
        }
      };
      fetchApplicationStats();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [role]);

  const data: RoleLinks = {
    tenant: [
      {
        name: "Dashboard",
        path: "/tenants",
        icon: <StyledIcon icon={IconHome} />,
      },
      {
        name: "Recommendations",
        path: "/tenants/recommendations",
        icon: <StyledIcon icon={IconBrain} />,
      },
      {
        name: "Applications",
        path: "/tenants/applications",
        icon: <StyledIcon icon={IconFilePlus} />,
      },
      {
        name: "Transactions",
        path: "/tenants/transactions",
        icon: <StyledIcon icon={IconCreditCard} />,
      },
      {
        name: "Messages",
        path: "/tenants/messages",
        icon: <StyledIcon icon={IconMessage} />,
      },
    ],
    landlord: [
      {
        name: "Dashboard",
        path: "/property-owner",
        icon: <StyledIcon icon={IconHome} />,
      },
      {
        name: "Applications",
        path: "/property-owner/applications",
        icon: <StyledIcon icon={IconFilePlus} />,
        badge:
          pendingApplications > 0 ? String(pendingApplications) : undefined,
      },
      {
        name: "Tenants",
        path: "/property-owner/tenants",
        icon: <StyledIcon icon={IconUsers} />,
      },
      {
        name: "Properties",
        path: "/property-owner/properties",
        icon: <StyledIcon icon={IconBed} />,
        subItems: [
          { name: "All Properties", path: "/property-owner/properties" },
          { name: "Add New", path: "/property-owner/properties/add" },
        ],
      },
      {
        name: "Maintenance",
        path: "/property-owner/maintenance",
        icon: <StyledIcon icon={IconBed} />,
      },
      {
        name: "Transactions",
        path: "/property-owner/transactions",
        icon: <StyledIcon icon={IconCreditCard} />,
      },
      {
        name: "Inspections",
        path: "/property-owner/inspections",
        icon: <StyledIcon icon={IconUser} />,
      },
      {
        name: "Messages",
        path: "/property-owner/messages",
        icon: <StyledIcon icon={IconMessage} />,
      },
      {
        name: "Reports",
        path: "/property-owner/reports",
        icon: <StyledIcon icon={IconFile} />,
        subItems: [
          { name: "Financial", path: "/property-owner/reports/financial" },
          { name: "Occupancy", path: "/property-owner/reports/occupancy" },
        ],
      },
    ],
    admin: [
      {
        name: "Dashboard",
        path: "/admin",
        icon: <StyledIcon icon={IconHome} />,
      },
      {
        name: "Users",
        path: "/admin/users",
        icon: <StyledIcon icon={IconUsers} />,
      },
      {
        name: "Properties",
        path: "/admin/properties",
        icon: <StyledIcon icon={IconBed} />,
      },
      {
        name: "Applications",
        path: "/admin/applications",
        icon: <StyledIcon icon={IconFilePlus} />,
      },
      {
        name: "Transactions",
        path: "/admin/transactions",
        icon: <StyledIcon icon={IconCreditCard} />,
      },
      {
        name: "Reports",
        path: "/admin/reports",
        icon: <StyledIcon icon={IconFile} />,
      },
      {
        name: "Support",
        path: "/admin/support",
        icon: <StyledIcon icon={IconMessage} />,
      },
    ],
  };

  const handleLogout = async () => {
    try {
      logout();
      await logoutApi();
      navigate("/auth/login");
    } catch (err) {
      console.log("Error logging out", err);
    }
  };

  const toggleExpanded = (itemName: string) => {
    setExpandedItems((prev) =>
      prev.includes(itemName)
        ? prev.filter((name) => name !== itemName)
        : [...prev, itemName]
    );
  };

  const isPathActive = (path: string) => {
    // Exact match for the path
    if (location.pathname === path) return true;

    // For dashboard/home paths, only highlight if exact match
    if (
      path === "/property-owner" ||
      path === "/tenants" ||
      path === "/admin"
    ) {
      return location.pathname === path;
    }

    // For other paths, check if current path starts with the menu path
    // but ensure it's not just a prefix (e.g., /property-owner/properties should not activate /property-owner)
    return location.pathname.startsWith(path + "/");
  };

  const renderMenuItem = (item: LinkItem) => {
    const isActive = isPathActive(item.path);
    const hasSubItems = item.subItems && item.subItems.length > 0;
    const isExpanded = expandedItems.includes(item.name);

    if (collapsed) {
      return (
        <Tooltip
          label={item.name}
          position="right"
          offset={10}
          key={item.name}
          withArrow
        >
          <Link
            to={item.path}
            className={`relative flex items-center justify-center p-3 rounded-xl mb-2 transition-all ${
              isActive
                ? "bg-blue-50 text-blue-600"
                : "hover:bg-gray-100 text-gray-700"
            }`}
          >
            {item.icon}
            {item.badge && (
              <span className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-semibold">
                {item.badge}
              </span>
            )}
          </Link>
        </Tooltip>
      );
    }

    return (
      <div key={item.name} className="mb-1">
        <div
          className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all ${
            isActive
              ? "bg-blue-50 text-blue-600"
              : "hover:bg-gray-100 text-gray-700"
          }`}
          onClick={() => {
            if (hasSubItems) {
              toggleExpanded(item.name);
            } else {
              navigate(item.path);
            }
          }}
        >
          <div className="flex items-center gap-3 flex-1">
            {item.icon}
            <span className="text-sm font-medium">{item.name}</span>
            {item.badge && (
              <span className="ml-auto px-2 py-0.5 bg-red-500 text-white text-xs rounded-full font-semibold">
                {item.badge}
              </span>
            )}
          </div>
          {hasSubItems && (
            <IconChevronDown
              size={16}
              className={`transition-transform ${
                isExpanded ? "rotate-180" : ""
              }`}
            />
          )}
        </div>

        {hasSubItems && (
          <Collapse in={isExpanded}>
            <div className="ml-11 mt-1 space-y-1">
              {item.subItems?.map((subItem) => {
                const isSubActive = location.pathname === subItem.path;
                return (
                  <Link
                    key={subItem.path}
                    to={subItem.path}
                    className={`block p-2 rounded-lg text-sm transition-all ${
                      isSubActive
                        ? "bg-blue-50 text-blue-600 font-medium"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    {subItem.name}
                  </Link>
                );
              })}
            </div>
          </Collapse>
        )}
      </div>
    );
  };

  const links = data[role!].map((item) => renderMenuItem(item));

  return (
    <nav
      className={`h-screen flex flex-col justify-between pt-[70px] pb-6 fixed bg-white border-r border-gray-200 z-20 transition-all duration-300 ${
        opened
          ? collapsed
            ? "w-[70px] md:w-[70px]"
            : "w-[70%] md:w-[260px]"
          : collapsed
          ? "hidden md:flex md:w-[70px]"
          : "hidden md:flex md:w-[260px]"
      }`}
    >
      <div className="flex-1 overflow-y-auto px-3">
        {/* Collapse Toggle Button */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden md:flex items-center justify-center w-full p-2 mb-4 rounded-xl hover:bg-gray-100 transition-all"
        >
          {collapsed ? (
            <IconChevronRight size={20} className="text-gray-600" />
          ) : (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <IconChevronLeft size={20} />
              <span>Collapse</span>
            </div>
          )}
        </button>

        <div className="space-y-1">{links}</div>
      </div>

      {/* Bottom Section */}
      <div className="px-3 pt-4 border-t border-gray-200">
        {collapsed ? (
          <>
            <Tooltip label="Settings" position="right" offset={10} withArrow>
              <Link
                to="/settings/profile"
                className="flex items-center justify-center p-3 rounded-xl hover:bg-gray-100 text-gray-700 mb-2 transition-all"
              >
                <StyledIcon icon={IconSettings} />
              </Link>
            </Tooltip>
            <Tooltip label="Logout" position="right" offset={10} withArrow>
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center p-3 rounded-xl hover:bg-red-50 text-gray-700 hover:text-red-600 transition-all"
              >
                <StyledIcon icon={IconLogout} />
              </button>
            </Tooltip>
          </>
        ) : (
          <>
            <BottomLinks to="/settings/profile">
              <StyledIcon icon={IconSettings} />
              <span>Settings</span>
            </BottomLinks>
          </>
        )}
      </div>
    </nav>
  );
};

export default Sidebar;
