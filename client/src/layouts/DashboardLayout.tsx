// layouts/DashboardLayout.tsx
import React, { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
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
  const [opened, { toggle }] = useDisclosure(false);
  const [collapsed, setCollapsed] = React.useState(false);
  const [welcomeMessage, setWelcomeMessage] = React.useState("");

  const { user } = useUser();
  const location = useLocation();

  console.log(
      user, location
  )

  useEffect(() => {
    // Check if we have welcome state from navigation
    if (location.state?.showWelcome) {
      const now = new Date();
      const hour = now.getHours();

      const firstName = location.state.firstName || user?.firstName;
      const action = location.state.userAction || "login";

      let message = "";

      if (action === "signup") {
        message = `🎉 Welcome to Letsten${firstName ? `, ${firstName}` : ""}!`;
      } else {
        if (hour < 12) {
          message = `Good Morning${firstName ? `, ${firstName}` : ""}!`;
        } else if (hour < 18) {
          message = `Good Afternoon${firstName ? `, ${firstName}` : ""}!`;
        } else {
          message = `Good Evening${firstName ? `, ${firstName}` : ""}!`;
        }

        // Add role-specific continuation
        if (role === "tenant") {
          message += " Hope you find your dream property today.";
        } else if (role === "landlord") {
          message += " Manage your properties efficiently.";
        } else if (role === "admin") {
          message += " Monitor platform activity.";
        }
      }

      setWelcomeMessage(message);

      window.history.replaceState({}, document.title);
    }
  }, [location.state, user, role]);

  if (!user) {
    return <BrandedLoader fullScreen label={welcomeMessage} />;
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