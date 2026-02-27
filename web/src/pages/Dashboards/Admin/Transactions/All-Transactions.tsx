import { IconArrowLeft } from "@tabler/icons-react";
import { Link } from "react-router-dom";
import ApplicationsTable from "../../../../components/screens/Dashboards/Admin/ApplicationsTable";
import { Tabs } from "@mantine/core";
import TransactionsTable from "../../../../components/screens/Dashboards/Admin/TransactionTable";

function AllTransactions() {
  const transactions = [
    {
      id: "0101001",
      from: "Helen Paul",
      type: "rent",
      date: "12 - 03 -24",
      status: "Paid",
      amount: 75000,
    },

    {
      id: "0101001",
      from: "Helen Paul",
      type: "screening",
      date: "12 - 03 -24",
      status: "Paid",
      amount: 75000,
    },

    {
      id: "0101001",
      from: "Helen Paul",
      type: "maintenance",
      date: "12 - 03 -24",
      status: "Paid",
      amount: 75000,
    },
  ];

  return (
    <>
      <Link
        to="/admin/transactions"
        className="flex items-center space-x-2 mb-5"
      >
        <IconArrowLeft className="w-5 h-5 p-1 bg-primary rounded-md text-white stroke-2" />
        <span>All Transactions</span>
      </Link>

      <Tabs defaultValue="all">
        <Tabs.List>
          <Tabs.Tab value="all">All</Tabs.Tab>
          <Tabs.Tab value="pending">Pending</Tabs.Tab>
          <Tabs.Tab value="refunded">Refunded</Tabs.Tab>
          <Tabs.Tab value="overdue">Overdue</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="all">
          <TransactionsTable data={transactions} />
        </Tabs.Panel>
        <Tabs.Panel value="pending">
          <TransactionsTable data={transactions} />
        </Tabs.Panel>
        <Tabs.Panel value="refunded">
          <TransactionsTable data={transactions} />
        </Tabs.Panel>
        <Tabs.Panel value="overdue">
          <TransactionsTable data={transactions} />
        </Tabs.Panel>
      </Tabs>
    </>
  );
}

export default AllTransactions;
