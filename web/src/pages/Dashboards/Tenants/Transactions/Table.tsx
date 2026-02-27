import { Menu, ActionIcon, Badge, Group, Button, Paper } from "@mantine/core";
import {
  IconDotsVertical,
  IconEye,
  IconDownload,
  IconMessage,
  IconPhone,
  IconUser,
  IconCheck,
  IconClock,
} from "@tabler/icons-react";
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

type Transactions = {
  propertyName: string;
  propertyAddress: string;
  paymentDate: string;
  status: "Unpaid" | "Paid";
};

interface TableProps {
  transactions: Transactions[];
  formatDate: (date: string) => string;
}

// Enhanced Status Badge Component
const StatusBadge: React.FC<{ status: Transactions["status"] }> = ({
  status,
}) => {
  const statusConfig = {
    Paid: {
      color: "green",
      icon: <IconCheck size={14} />,
      label: "Paid",
    },
    Unpaid: {
      color: "orange",
      icon: <IconClock size={14} />,
      label: "Unpaid",
    },
  };

  const config = statusConfig[status];

  return (
    <Badge
      leftSection={config.icon}
      color={config.color}
      variant="light"
      size="md"
      radius="sm"
    >
      {config.label}
    </Badge>
  );
};

// Transaction Card for Mobile
const TransactionCard = ({
  transaction,
  formatDate,
}: {
  transaction: Transactions;
  formatDate: (date: string) => string;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white p-4 rounded-lg border border-gray-200 hover:border-blue-300 transition-colors"
  >
    <div className="flex justify-between items-start mb-3">
      <div className="flex-1">
        <h3 className="font-semibold text-gray-900 text-base mb-1">
          {transaction.propertyName}
        </h3>
        <p className="text-gray-600 text-sm mb-2">
          {transaction.propertyAddress}
        </p>
        <p className="text-gray-500 text-xs">
          {formatDate(transaction.paymentDate)}
        </p>
      </div>
      <Menu position="bottom-end" withArrow>
        <Menu.Target>
          <ActionIcon variant="subtle">
            <IconDotsVertical size={16} />
          </ActionIcon>
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Label>Actions</Menu.Label>
          <Menu.Item
            leftSection={<IconEye size={16} />}
            component="a"
            href={`#`}
          >
            View Details
          </Menu.Item>
          <Menu.Item leftSection={<IconDownload size={16} />}>
            Download Receipt
          </Menu.Item>

          <Menu.Divider />

          <Menu.Label>Contact</Menu.Label>
          <Menu.Item leftSection={<IconMessage size={16} />}>
            Send Message
          </Menu.Item>
          <Menu.Item leftSection={<IconPhone size={16} />}>
            Call Owner
          </Menu.Item>
          <Menu.Item leftSection={<IconUser size={16} />}>
            View Owner Profile
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </div>

    <div className="border-t pt-3 flex justify-between items-center">
      <StatusBadge status={transaction.status} />
      <Button size="xs" variant="light" component="a" href={`#`}>
        View Details
      </Button>
    </div>
  </motion.div>
);

const Table = ({ transactions, formatDate }: TableProps) => {
  const navigate = useNavigate();

  return (
    <div className="space-y-4">
      {/* Desktop Table */}
      <div className="hidden md:block">
        <Paper withBorder className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-6 py-4 font-semibold text-gray-900">
                    Property
                  </th>
                  <th className="text-left px-6 py-4 font-semibold text-gray-900">
                    Address
                  </th>
                  <th className="text-left px-6 py-4 font-semibold text-gray-900">
                    Payment Date
                  </th>
                  <th className="text-left px-6 py-4 font-semibold text-gray-900">
                    Status
                  </th>
                  <th className="text-right px-6 py-4 font-semibold text-gray-900">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {transactions.map((transaction, index) => (
                    <motion.tr
                      key={transaction.propertyName}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <Link
                          to={`#`}
                          className="font-semibold text-gray-900 hover:text-blue-600 transition-colors"
                        >
                          {transaction.propertyName}
                        </Link>
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {transaction.propertyAddress}
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {formatDate(transaction.paymentDate)}
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={transaction.status} />
                      </td>
                      <td className="px-6 py-4">
                        <Group justify="flex-end" gap="xs">
                          <Button
                            size="xs"
                            variant="light"
                            component="a"
                            href={`#`}
                          >
                            View Details
                          </Button>
                          <Menu position="bottom-end" withArrow>
                            <Menu.Target>
                              <ActionIcon variant="subtle">
                                <IconDotsVertical size={16} />
                              </ActionIcon>
                            </Menu.Target>
                            <Menu.Dropdown>
                              <Menu.Label>Actions</Menu.Label>
                              <Menu.Item
                                leftSection={<IconEye size={16} />}
                                component="a"
                                href={`#`}
                              >
                                View Details
                              </Menu.Item>
                              <Menu.Item
                                leftSection={<IconDownload size={16} />}
                              >
                                Download Receipt
                              </Menu.Item>

                              <Menu.Divider />

                              <Menu.Label>Contact</Menu.Label>
                              <Menu.Item
                                leftSection={<IconMessage size={16} />}
                              >
                                Send Message
                              </Menu.Item>
                              <Menu.Item leftSection={<IconPhone size={16} />}>
                                Call Owner
                              </Menu.Item>
                              <Menu.Item leftSection={<IconUser size={16} />}>
                                View Owner Profile
                              </Menu.Item>
                            </Menu.Dropdown>
                          </Menu>
                        </Group>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </Paper>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden">
        <div className="space-y-4">
          <AnimatePresence>
            {transactions.map((transaction) => (
              <TransactionCard
                key={transaction.propertyName}
                transaction={transaction}
                formatDate={formatDate}
              />
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Table;
