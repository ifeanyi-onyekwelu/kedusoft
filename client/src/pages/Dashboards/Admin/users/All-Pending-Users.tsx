import { IconArrowLeft } from "@tabler/icons-react";
import { Link } from "react-router-dom";
import { Button } from "@mantine/core";
import PendingUserCard from "../../../../components/screens/Dashboards/Admin/PendingUserCard";

function AllPendingUsers() {
  const users = [
    {
      id: "0101001",
      firstName: "Davey",
      lastName: "Jones",
      role: "landlord",
      email: "ifeanyi@gmail.com",
      phone: "+234 811 320 8256",
      status: "active",
      file: "international_passport",
    },
  ];
  return (
    <>
      <div className="mb-3">
        <div className="flex items-center justify-between py-2">
          <Link to="/admin/users" className="flex items-center space-x-2">
            <IconArrowLeft className="w-5 h-5 p-1 bg-primary rounded-md text-white stroke-2" />
            <span>Pending User Verification</span>
          </Link>
        </div>
        <p className="text-gray-400 text-xs">
          These are the users which are pending for approval
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {users && users.map((user) => <PendingUserCard user={user} />)}
      </div>
    </>
  );
}

export default AllPendingUsers;
