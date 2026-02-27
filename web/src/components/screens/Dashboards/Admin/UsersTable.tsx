import { Menu } from "@mantine/core";
import { IconDotsVertical, IconEye } from "@tabler/icons-react";
import React from "react";
import { Link } from "react-router-dom";
import { truncateText } from "../../../../utils/helpers";
import TableMenu from "../../../../pages/Dashboards/Admin/users/TableMenu";
import { useNavigate } from "react-router-dom";

// Reusable <Th> Component
const Th: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
  <th className="text-md p-3 font-medium text-start">{children}</th>
);

// Reusable <Td> Component
const Td: React.FC<{ children: React.ReactNode; truncate?: boolean }> = ({
  children,
  truncate = false,
}) => {
  const content =
    truncate && typeof children === "string"
      ? truncateText(children, 1)
      : children;

  return (
    <td className="p-3 text-md break-words text-start max-w-[200px]">
      {content}
    </td>
  );
};

const UsersTable = ({ data, role }: { data: any[]; role?: string }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white">
      <TableMenu />
      <div>
        <table className="w-full border-separate border-spacing-y-3">
          <thead>
            <tr className="text-center">
              <Th>User ID</Th>
              <Th>Full Name</Th>
              <Th>Email Address</Th>
              <Th>Phone Number</Th>
              <Th></Th>
            </tr>
          </thead>
          <tbody className="relative">
            {data.map((user: any) => (
              <tr className="text-center rounded-md bg-white w-full border-separate border-spacing-y-3">
                <Td truncate>{user.id}</Td>
                <Td truncate>
                  {user.firstName} {user.lastName}
                </Td>
                <Td>{user.email}</Td>
                <Td>{user.phone_number}</Td>
                <Td>
                  <div className="flex space-x-2 justify-center">
                    <Link to="/admin/users/id">
                      <IconEye size={25} stroke={2} />
                    </Link>
                    <button className="text-gray-500 hover:underline">
                      <Menu shadow="md" width={200}>
                        <Menu.Target>
                          <IconDotsVertical size={20} stroke={1} />
                        </Menu.Target>
                        <Menu.Dropdown>
                          <Menu.Item>Mark Flagged</Menu.Item>
                          <Menu.Item>Mark Suspended</Menu.Item>
                          <Menu.Item>Mark Fraudulent</Menu.Item>
                          <Menu.Item>Send Feedback</Menu.Item>
                          <Menu.Item
                            onClick={() => navigate(`/admin/users/${user.id}`)}
                          >
                            View Details
                          </Menu.Item>
                        </Menu.Dropdown>
                      </Menu>
                    </button>
                  </div>
                </Td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UsersTable;
