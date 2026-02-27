import { useState, useEffect } from "react";
import UsersTab from "./UserTabs";
import { IconArrowLeft } from "@tabler/icons-react";
import { Link } from "react-router-dom";
import { getAllUsers } from "../../../../apis/adminApi";

function AllUsers() {
  const [users, setUsers] = useState<any>([]);

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
    <>
      <Link to="/admin/users" className="flex items-center space-x-2 mb-5">
        <IconArrowLeft className="w-5 h-5 p-1 bg-primary rounded-md text-white stroke-2" />
        <span>All Users</span>
      </Link>
      <UsersTab users={users} />
    </>
  );
}

export default AllUsers;
