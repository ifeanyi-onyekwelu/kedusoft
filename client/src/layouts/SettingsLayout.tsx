import {
  IconBell,
  IconLock,
  IconUser,
  IconUserScan,
} from "@tabler/icons-react";
import { Link, Outlet, useLocation, useResolvedPath } from "react-router-dom";
import Sidebar, { RoleLinks } from "../components/shared/Dashboard/Sidebar";
import { useUser } from "../context/UserContext";
import { useDisclosure } from "@mantine/hooks";
import Header from "../components/shared/Dashboard/Navbar";
import Loader from "../components/Loader";

const ListItem = ({ link, isActive }: any) => {
  const resolvedPath = useResolvedPath(link.path);

  return (
    <Link
      to={resolvedPath}
      className={`px-3 py-2 rounded border-r-4 flex space-x-1 ${
        isActive
          ? "bg-hover text-primary border-primary"
          : "border-primary hover:bg-hover text-primary"
      }`}
      key={link}
    >
      <link.icon stroke={1.5} />
      <span>{link.name}</span>
    </Link>
  );
};

const NavigationBox = ({ links }: any) => {
  const location = useLocation();

  return (
    <div className="p-5 rounded shadow-lg md:w-1/4 bg-white h-fit">
      <div className="space-y-2">
        {links.map((link: any) => (
          <ListItem
            link={link}
            isActive={location.pathname.startsWith(link.path)}
          />
        ))}
      </div>
    </div>
  );
};

function SettingsLayout() {
  const links = [
    {
      name: "Profile Settings",
      path: "/settings/profile",
      icon: IconUser,
    },
    {
      name: "Verification",
      path: "/settings/verification",
      icon: IconUserScan,
    },
    {
      name: "Security",
      path: "/settings/change-password",
      icon: IconLock,
    },
    {
      name: "Notification",
      path: "/settings/notifications",
      icon: IconBell,
    },
  ];

  const [opened, { toggle }] = useDisclosure(true);
  const { user } = useUser();

  if (!user) {
    return <Loader loading={!user} />;
  }

  const role = user.role as keyof RoleLinks;

  return (
    <div>
      <Header role={user?.role!} opened={opened} toggle={toggle} />
      <div className="flex">
        <Sidebar role={role} opened={opened} />
        <div className="p-5 ml-0 md:ml-[15%] w-full md:w-[85%] bg-[#F5F5F5] pt-[80px] flex gap-10 md:flex-row flex-col h-screen">
          <NavigationBox links={links} />

          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default SettingsLayout;
