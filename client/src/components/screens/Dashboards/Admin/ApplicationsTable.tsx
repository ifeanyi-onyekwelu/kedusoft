import { Menu } from "@mantine/core";
import { IconDotsVertical, IconDownload, IconEye } from "@tabler/icons-react";
import React from "react";
import { Link } from "react-router-dom";
import { truncateText } from "../../../../utils/helpers";
import { Button } from "@mantine/core";
import EmptyState from "../../../EmptyState";

// Reusable <Th> Component
const Th: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
  <th className="text-[12px] p-3 font-medium">{children}</th>
);

// Reusable <Td> Component
const Td: React.FC<{ children: React.ReactNode; truncate?: boolean }> = ({
  children,
  truncate = false,
}) => {
  const content =
    truncate && typeof children === "string"
      ? truncateText(children, 3)
      : children;

  return (
    <td className="p-3 text-[12px] break-words max-w-[200px]">{content}</td>
  );
};

const StatusBadge = ({
  status,
  statusColors,
}: {
  status: string;
  statusColors: { [key: string]: string };
}) => {
  return (
    <span
      className={`px-2 rounded-full text-[10px] py-[2px] font-semibold ${statusColors[status]}`}
    >
      {status}
    </span>
  );
};

const ApplicationsTable = ({
  data,
  all = false,
}: {
  data: any[];
  all?: boolean;
}) => {
  const statusColors = {
    Approved: "bg-[#C3FBE1] text-green-800",
    Pending: "bg-[#008CDB] text-white",
    Rejected: "bg-[#DD1C12] text-white",
  };

  return (
    <>
      {data && data.length ? (
        <div className="bg-white">
          <div className="flex items-center justify-between px-7 py-3">
            <h3 className="text-lg font-semibold">Applications List</h3>

            <div className="flex items-center space-x-2">
              <Button leftSection={<IconDownload />} radius="lg">
                Download
              </Button>
              {all && (
                <Link
                  to="/admin/applications/all"
                  className="text-primary font-semibold text-sm "
                >
                  View All
                </Link>
              )}
            </div>
          </div>
          <div>
            <table className="w-full border-separate border-spacing-y-3">
              <thead>
                <tr className="text-start">
                  <Th>Application ID</Th>
                  <Th>Applicant Name</Th>
                  <Th>Property Applied For</Th>
                  <Th>Date Applied</Th>
                  <Th>Status</Th>
                  <Th>Result</Th>
                  <Th></Th>
                </tr>
              </thead>
              <tbody className="relative">
                {data.map((application: any) => (
                  <tr className="text-center rounded-md transition duration-300 bg-white w-full border-separate border-spacing-y-3">
                    <Td truncate>{application.id}</Td>
                    <Td truncate>{application.applicant}</Td>
                    <Td>{application.property}</Td>
                    <Td>{application.date}</Td>
                    <Td>
                      {application.status === "completed"
                        ? "Completed"
                        : "In-Progress"}
                    </Td>
                    <Td>
                      <StatusBadge
                        status={application.result}
                        statusColors={statusColors as any}
                      />
                    </Td>
                    <Td>
                      <div className="flex space-x-2 justify-center">
                        <Link to="/admin/applications/id">
                          <IconEye size={20} stroke={2} />
                        </Link>
                        <button className="text-gray-500 hover:underline">
                          <Menu shadow="md" width={200}>
                            <Menu.Target>
                              <IconDotsVertical size={20} stroke={1} />
                            </Menu.Target>
                            <Menu.Dropdown>
                              <Menu.Item>Delete</Menu.Item>
                              <Menu.Item>Message</Menu.Item>
                              <Menu.Item>View Details</Menu.Item>
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
      ) : (
        <EmptyState>
          <div className="space-y-4 flex flex-col justify-center items-center">
            <h2 className="text-4xl font-semibold text-gray-800">
              No applications made
            </h2>
            <p className="text-sm text-gray-500">
              Looks like no user has made an application
            </p>
          </div>
        </EmptyState>
      )}
    </>
  );
};

export default ApplicationsTable;
