import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/shared/Dashboard/Sidebar";
import Header from "../components/shared/Dashboard/Navbar";
import Footer from "../components/shared/Dashboard/Footer";
import { useDisclosure } from "@mantine/hooks";
import { useUser } from "../context/UserContext";
import { BrandedLoader } from "../components/LoadingSpinner";

type LayoutProps = {
  role: "tenant" | "landlord" | "admin";
};

const DashboardLayout: React.FC<LayoutProps> = ({ role }) => {
  const [opened, { toggle }] = useDisclosure(false); // Default to false for mobile
  const [collapsed, setCollapsed] = React.useState(false);
  const { user } = useUser();

  if (!user) {
    return <BrandedLoader fullScreen />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header role={role} opened={opened} toggle={toggle} />
      <div className="flex flex-1">
        <Sidebar
          role={role}
          opened={opened}
          collapsed={collapsed}
          setCollapsed={setCollapsed}
        />
        <div
          className={`flex flex-col flex-1 transition-all duration-300 ${
            collapsed
              ? "ml-0 md:ml-[70px] w-full md:w-[calc(100%-70px)]"
              : "ml-0 md:ml-[260px] w-full md:w-[calc(100%-260px)]"
          }`}
        >
          <main className="flex-1 bg-[#F5F5F5] pt-[60px]">
            <Outlet context={user} />
          </main>
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
