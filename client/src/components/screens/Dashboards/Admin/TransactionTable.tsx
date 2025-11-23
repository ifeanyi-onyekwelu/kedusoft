import { Menu } from "@mantine/core";
import { IconDotsVertical, IconDownload, IconEye } from "@tabler/icons-react";
import React from "react";
import { Link } from "react-router-dom";
import formatAmount, { truncateText } from "../../../../utils/helpers";
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

const TransactionsTable = ({ data, all }: { data: any[]; all?: boolean }) => {
  return (
    <>
      {data && data.length ? (
        <div className="bg-white">
          <div className="flex items-center justify-between px-7 py-3">
            <h3 className="text-lg font-semibold">Property Listings</h3>

            <div className="flex items-center space-x-2">
              <Button
                label="Download"
                icon={<IconDownload />}
                to=""
                radius="lg"
              />
              {all && (
                <Link
                  to="/admin/transactions/all"
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
                  <Th>Transaction ID</Th>
                  <Th>From</Th>
                  <Th>Transaction Type</Th>
                  <Th>Status</Th>
                  <Th>Amount</Th>
                  <Th></Th>
                </tr>
              </thead>
              <tbody className="relative">
                {data.map((transaction: any) => (
                  <tr className="text-center rounded-md transition duration-300 bg-white w-full border-separate border-spacing-y-3">
                    <Td truncate>{transaction.id}</Td>
                    <Td truncate>{transaction.from}</Td>
                    <Td>
                      {transaction.type === "rent"
                        ? "Rent Payment"
                        : transaction.type === "screening"
                        ? "Screening Fee"
                        : transaction.type === "maintenance"
                        ? "Maintenance Fee"
                        : ""}
                    </Td>
                    <Td>{transaction.date}</Td>
                    <Td>{transaction.status}</Td>
                    <Td>{formatAmount(transaction.amount)}</Td>
                    <Td>
                      <div className="flex space-x-2 justify-center">
                        <Link to="/admin/transactions/id">
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
              No Transactions Made
            </h2>
            <p className="text-sm text-gray-500">
              Looks like no user has initiated any transactions yet.
            </p>
          </div>
        </EmptyState>
      )}
    </>
  );
};

export default TransactionsTable;
