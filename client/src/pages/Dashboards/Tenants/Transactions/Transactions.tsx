import AvailableForRent from "../../../../components/screens/Dashboards/AvailableForRent";
import Statistics from "../Statistics";
import Table from "./Table";
import { getAllTransactions } from "../../../../apis/tenantApi";
import { useEffect, useState } from "react";
import EmptyState from "../../../../components/EmptyState";
import { Button } from "@mantine/core";

type Transaction = {
  propertyName: string;
  propertyAddress: string;
  paymentDate: string;
  status: "Unpaid" | "Paid";
};

function Transactions() {
  const [statistics, setStatistics] = useState<
    Array<{ title: string; value: string }>
  >([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    const getTransactions = async () => {
      const response = await getAllTransactions();
      setTransactions(response["applications"]);

      // Calculate statistics
      const totalTransactions = response["applications"].length;
      const totalUnpaidTransactions: number = response["applications"].filter(
        (transaction: Transaction) => transaction.status === "Unpaid"
      ).length;
      const totalPaidTransactions: number = response["applications"].filter(
        (transaction: Transaction) => transaction.status === "Paid"
      ).length;

      setStatistics([
        { title: "Total Transactions", value: `${totalTransactions}` },
        { title: "Transactions Paid", value: `${totalPaidTransactions}` },
        { title: "Transactions Unpaid", value: `${totalUnpaidTransactions}` },
      ]);
    };

    getTransactions();
  });

  return (
    <div className="px-6 py-5 space-y-10">
      <Statistics statistics={statistics} />

      <div>
        {transactions.length ? (
          <Table transactions={transactions} />
        ) : (
          <EmptyState>
            <div className="space-y-4 flex flex-col justify-center items-center">
              <h2 className="text-4xl font-semibold text-gray-800">
                No Transactions Made
              </h2>
              <p className="text-sm text-gray-500">
                Looks like you haven't purchases any property
              </p>

              <Button
                label="Browse Properties"
                to="/properties/search"
                variant="outlined"
              />
            </div>
          </EmptyState>
        )}
      </div>
    </div>
  );
}

export default Transactions;
