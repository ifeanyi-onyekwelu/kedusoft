import { Button } from "@mantine/core";
import DoughnutChart from "../DoughnutChart";
import StatsCard from "../StatsCard";
import UsersTab from "./UserTabs";
import { getAllUsers } from "../../../../apis/adminApi";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone_number: string;
  role?: string;
  is_active: boolean;
  is_deleted: boolean;
  is_pending?: boolean;
  is_suspended: boolean;
  is_verified: boolean;
}

function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const [usersData, setUsersData] = useState<{
    totalTenants: number;
    totalPropertyOwners: number;
    totalAdmins: number;

    verifiedTenants: number;
    pendingTenant: number;
    notVerifiedTenants: number;

    verifiedLandlords: number;
    pendingLandlords: number;
    notVerifiedLandlords: number;
  }>({
    totalTenants: 0,
    totalPropertyOwners: 0,
    totalAdmins: 0,

    verifiedTenants: 0,
    pendingTenant: 0,
    notVerifiedTenants: 0,

    verifiedLandlords: 0,
    pendingLandlords: 0,
    notVerifiedLandlords: 0,
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        const response = await getAllUsers();
        console.log("FETCH ALL USER RESPONSE", response);
        setUsers(response["users"]);
      } catch (error) {
        console.log("FETCH ALL USER ERROR: ", error);
      }
    };

    fetchAllUsers();
  }, []);

  return (
    <div className="space-y-5">
      <div className="flex space-x-5 items-center">
        <h3 className="font-semibold text-2xl text-black">Users</h3>
        <Button radius="md" onClick={() => navigate("/admin/users/pending")}>
          View Pending Users
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatsCard title="Total Users">
          <div className="flex items-center justify-between w-full text-sm mt-1">
            <DoughnutChart
              labels={["Tenants", "Property Owners", "Adminstrators"]}
              data={[
                usersData?.totalTenants,
                usersData?.totalPropertyOwners,
                usersData?.totalAdmins,
              ]}
              colors={["#4AD795", "#509CF5"]}
            />
            <div className="flex flex-col">
              <div className="flex space-x-2 items-center">
                <div className="w-2 h-2 rounded-full bg-[#509CF5]"></div>
                <div className="">
                  <h4 className="font-bold text-sm">
                    {usersData?.totalTenants}
                  </h4>
                  <p className="text-[10px]">Tenants</p>
                </div>
              </div>
              <div className="flex space-x-2 items-center">
                <div className="w-2 h-2 rounded-full bg-[#4AD795]"></div>
                <div className="">
                  <h4 className="font-bold text-sm">
                    {usersData?.totalPropertyOwners}
                  </h4>
                  <p className="text-[10px]">Property Owners</p>
                </div>
              </div>
              <div className="flex space-x-2 items-center">
                <div className="w-2 h-2 rounded-full bg-[#d7d24a]"></div>
                <div className="">
                  <h4 className="font-bold text-sm">
                    {usersData?.totalAdmins}
                  </h4>
                  <p className="text-[10px]">Adminstrators</p>
                </div>
              </div>
            </div>
          </div>
        </StatsCard>
        <StatsCard title="Total Tenants">
          <div className="flex items-center justify-between w-full text-sm mt-1">
            <DoughnutChart
              labels={["Verified", "Pending Verification", "Not Verified"]}
              data={[
                usersData.verifiedTenants,
                usersData.pendingTenant,
                usersData.notVerifiedTenants,
              ]}
              colors={["#4AD795", "#f5a623", "#ff3b30"]}
            />

            <div className="flex flex-col">
              <div className="flex space-x-2 items-center">
                <div className="w-2 h-2 rounded-full bg-[#509CF5]"></div>
                <div className="">
                  <h4 className="font-bold text-sm">
                    {usersData.verifiedTenants}
                  </h4>
                  <p className="text-[10px]">Verified</p>
                </div>
              </div>
              <div className="flex space-x-2 items-center">
                <div className="w-2 h-2 rounded-full bg-[#509CF5]"></div>
                <div className="">
                  <h4 className="font-bold text-sm">
                    {usersData.pendingTenant}
                  </h4>
                  <p className="text-[10px]">Pending Verification</p>
                </div>
              </div>
              <div className="flex space-x-2 items-center">
                <div className="w-2 h-2 rounded-full bg-[#4AD795]"></div>
                <div className="">
                  <h4 className="font-bold text-sm">
                    {usersData.notVerifiedTenants}
                  </h4>
                  <p className="text-[10px]">Not Verified</p>
                </div>
              </div>
            </div>
          </div>
        </StatsCard>
        <StatsCard title="Total Property Owners">
          <div className="flex items-center justify-between w-full text-sm mt-1">
            <DoughnutChart
              labels={["Verified", "Pending Verification", "Not Screened"]}
              data={[
                usersData.verifiedLandlords,
                usersData.pendingLandlords,
                usersData.notVerifiedLandlords,
              ]}
              colors={["#4AD795", "#f5a623", "#ff3b30"]}
            />
            <div className="flex flex-col">
              <div className="flex space-x-2 items-center">
                <div className="w-2 h-2 rounded-full bg-[#509CF5]"></div>
                <div className="">
                  <h4 className="font-bold text-sm">
                    {usersData.verifiedLandlords}
                  </h4>
                  <p className="text-[10px]">Verified</p>
                </div>
              </div>
              <div className="flex space-x-2 items-center">
                <div className="w-2 h-2 rounded-full bg-[#509CF5]"></div>
                <div className="">
                  <h4 className="font-bold text-sm">
                    {usersData.pendingLandlords}
                  </h4>
                  <p className="text-[10px]">Pending Verification</p>
                </div>
              </div>
              <div className="flex space-x-2 items-center">
                <div className="w-2 h-2 rounded-full bg-[#4AD795]"></div>
                <div className="">
                  <h4 className="font-bold text-sm">
                    {usersData.notVerifiedLandlords}
                  </h4>
                  <p className="text-[10px]">Not Verified</p>
                </div>
              </div>
            </div>
          </div>
        </StatsCard>
      </div>

      <UsersTab users={users} />
    </div>
  );
}

export default Users;
