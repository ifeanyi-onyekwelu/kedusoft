import { IconArrowUp, IconPlus } from "@tabler/icons-react";
import { Button } from "@mantine/core";
import StatsCard from "../StatsCard";
import DoughnutChart from "../DoughnutChart";
import PropertiesRentedChart from "./PropertiesRentedChart";
import ApplicationsAnalysisChart from "./ApplicationAnalysisChart";
import AdminRightSidebar from "./AdminRightSidebar";
import AdminRecentListings from "./RecentListings";

function Dashboard() {
  return (
    <div className="flex md:flex-row flex-col">
      <div className="space-y-4 w-full md:w-[80%] h-screen overflow-y-auto p-4 scrollable">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <StatsCard title="New Users">
            <div className="flex items-center gap-1 text-sm mt-2">
              <DoughnutChart
                labels={["Tenants", "Property Owners"]}
                data={[10, 20]}
                colors={["#4AD795", "#509CF5"]}
              />
              <div className="flex flex-col space-y-3 w-3/4">
                <div className="flex space-x-2 items-center">
                  <div className="w-2 h-2 rounded-full bg-[#509CF5]"></div>
                  <div className="space-y-1">
                    <h4 className="font-bold text-sm">10</h4>
                    <p className="text-xs">Tenants</p>
                  </div>
                </div>
                <div className="flex space-x-2 items-center">
                  <div className="w-2 h-2 rounded-full bg-[#4AD795]"></div>
                  <div className="space-y-1">
                    <h4 className="font-bold text-sm">20</h4>
                    <p className="text-xs">Property Owners</p>
                  </div>
                </div>
              </div>
            </div>
          </StatsCard>

          <StatsCard title="Total Revenue">
            <div className="flex items-center justify-between mt-5 gap-5">
              <div className="flex space-x-2 w-1/2 items-center">
                <div className="w-2 rounded-full py-10 bg-blue-900"></div>
                <p className="text-md font-bold">N 750,000</p>
              </div>
              <div className="space-y-1 flex flex-col items-center justify-center w-1/2">
                <p className="text-lg text-[#05CE49] flex items-center">
                  <IconArrowUp /> <span>+5.5%</span>
                </p>
                <p className="text-xs">since last week</p>
              </div>
            </div>
          </StatsCard>

          <StatsCard title="New Properties">
            <div className="flex items-center justify-between mt-5 gap-5">
              <div className="flex space-x-2 w-3/5 items-center">
                <div className="w-2 rounded-full py-10 bg-[#A9513D]"></div>
                <p className="text-xl font-bold">
                  24 <span className="text-xs">properties</span>
                </p>
              </div>
              <div className="flex flex-col space-y-3 w-1/2">
                <div className="flex space-x-2 items-center">
                  <div className="w-2 h-2 rounded-full bg-[#BD5D47]"></div>
                  <div>
                    <h4 className="font-bold text-sm">20</h4>
                    <p className="text-xs">Bedrooms</p>
                  </div>
                </div>
                <div className="flex space-x-2 items-center">
                  <div className="w-2 h-2 rounded-full bg-[#BD5D47]"></div>
                  <div>
                    <h4 className="font-bold text-sm">4</h4>
                    <p className="text-xs">Mini Flat</p>
                  </div>
                </div>
              </div>
            </div>
          </StatsCard>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatsCard title="Total Revenue">
            <div className="flex items-center justify-between mt-5 gap-5">
              <div className="flex space-x-2 w-1/2 items-center">
                <div className="w-2 rounded-full py-10 bg-[#A9513D]"></div>
                <p className="text-xl font-bold">
                  14 <span className="text-xs">Applications</span>
                </p>
              </div>
              <div className="space-y-1 flex flex-col items-center justify-center w-1/2">
                <p className="text-md text-[#05CE49] flex items-center">
                  <IconArrowUp /> <span>+5.5%</span>
                </p>
                <p className="text-xs">since last week</p>
              </div>
            </div>
          </StatsCard>

          <div className="col-span-2">
            <StatsCard title="Application Analysis">
              <ApplicationsAnalysisChart />
            </StatsCard>
          </div>
        </div>

        <StatsCard title="Properties Rented (Monthly)">
          <PropertiesRentedChart />
        </StatsCard>

        <div className="flex space-x-5 items-center py-2">
          <h3 className="text-lg font-semibold">Recent Listings</h3>
          <Button
            label="View Pending Listings"
            to="properties/pending"
            radius="xl"
          />
        </div>

        <AdminRecentListings />
      </div>

      <AdminRightSidebar />
    </div>
  );
}

export default Dashboard;
