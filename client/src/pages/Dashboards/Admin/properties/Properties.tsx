import StatsCard from "../StatsCard";
import DoughnutChart from "../DoughnutChart";
import { Tabs } from "@mantine/core";
import PropertiesTable from "../../../../components/screens/Dashboards/Admin/PropertiesTable";
import { useState, useEffect } from "react";

interface Property {
  id: string;
  address: string;
  verification_status: string;
  type: string;
  owner: string;
  price: number;
}

function Properties() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [propertiesData, setPropertiesData] = useState<{
    occupied: number;
    available: number;
    underMaintenance: number;
    verified: number;
    pendingVerification: number;
    notVerified: number;
  }>({
    occupied: 0,
    available: 0,
    underMaintenance: 0,
    verified: 0,
    pendingVerification: 0,
    notVerified: 0,
  });

  useEffect(() => {
    const fetchAllProperties = async () => {
      try {
        // const response = await getAllProperties();
        // console.log("FETCH ALL PROPERTIES RESPONSE", response);
        // setProperties(response["properties"]);
      } catch (error) {
        console.log("FETCH ALL PROPERTIES ERROR: ", error);
      }
    };

    fetchAllProperties();
  }, []);

  return (
    <div className="space-y-5">
      <div className="flex space-x-5 items-center">
        <h3 className="font-semibold text-2xl text-black">Properties</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatsCard title="Total Properties">
          <div className="flex items-center justify-between text-sm mt-1">
            <DoughnutChart
              labels={["Occupied", "Available", "Under Maintenance"]}
              data={[
                propertiesData.occupied,
                propertiesData.available,
                propertiesData.underMaintenance,
              ]}
              colors={["#4AD795", "#509CF5"]}
            />
            <div className="flex flex-col">
              <div className="flex space-x-2 items-center">
                <div className="w-2 h-2 rounded-full bg-[#509CF5]"></div>
                <div className="">
                  <h4 className="font-bold text-sm">
                    {propertiesData.occupied}
                  </h4>
                  <p className="text-[10px]">Occupied</p>
                </div>
              </div>
              <div className="flex space-x-2 items-center">
                <div className="w-2 h-2 rounded-full bg-[#4AD795]"></div>
                <div className="">
                  <h4 className="font-bold text-sm">
                    {propertiesData.available}
                  </h4>
                  <p className="text-[10px]">Available</p>
                </div>
              </div>
              <div className="flex space-x-2 items-center">
                <div className="w-2 h-2 rounded-full bg-[#4AD795]"></div>
                <div className="">
                  <h4 className="font-bold text-sm">
                    {propertiesData.underMaintenance}
                  </h4>
                  <p className="text-[10px]">Under Maintenance</p>
                </div>
              </div>
            </div>
          </div>
        </StatsCard>
        <StatsCard title="Property Verification">
          <div className="flex items-center justify-between text-sm mt-1">
            <DoughnutChart
              labels={["Verified", "Pending Verification", "Not Verified"]}
              data={[
                propertiesData.verified,
                propertiesData.pendingVerification,
                propertiesData.notVerified,
              ]}
              colors={["#4AD795", "#f5a623", "#ff3b30"]}
            />

            <div className="flex flex-col">
              <div className="flex space-x-2 items-center">
                <div className="w-2 h-2 rounded-full bg-[#509CF5]"></div>
                <div className="">
                  <h4 className="font-bold text-sm">
                    {propertiesData.verified}
                  </h4>
                  <p className="text-[10px]">Verified</p>
                </div>
              </div>
              <div className="flex space-x-2 items-center">
                <div className="w-2 h-2 rounded-full bg-[#509CF5]"></div>
                <div className="">
                  <h4 className="font-bold text-sm">
                    {propertiesData.pendingVerification}
                  </h4>
                  <p className="text-[10px]">Pending Verification</p>
                </div>
              </div>
              <div className="flex space-x-2 items-center">
                <div className="w-2 h-2 rounded-full bg-[#4AD795]"></div>
                <div className="">
                  <h4 className="font-bold text-sm">
                    {propertiesData.notVerified}
                  </h4>
                  <p className="text-[10px]">Not Verified</p>
                </div>
              </div>
            </div>
          </div>
        </StatsCard>
      </div>

      <Tabs defaultValue="all">
        <Tabs.List>
          <Tabs.Tab value="all">All</Tabs.Tab>
          <Tabs.Tab value="verified">Verified</Tabs.Tab>
          <Tabs.Tab value="pending">Pending</Tabs.Tab>
          <Tabs.Tab value="not-verified">Not Verified</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="all">
          <PropertiesTable data={properties} price showMenu />
        </Tabs.Panel>
        <Tabs.Panel value="verified">
          <PropertiesTable
            data={properties.filter(
              (property) => property.verification_status === "verified"
            )}
            price
            showMenu
          />
        </Tabs.Panel>
        <Tabs.Panel value="pending">
          <PropertiesTable
            data={properties.filter(
              (property) => property.verification_status === "pending"
            )}
            price
            showMenu
          />
        </Tabs.Panel>
        <Tabs.Panel value="not-verified">
          <PropertiesTable
            data={properties.filter(
              (property) => property.verification_status === "not-verified"
            )}
            price
            showMenu
          />
        </Tabs.Panel>
      </Tabs>
    </div>
  );
}

export default Properties;
