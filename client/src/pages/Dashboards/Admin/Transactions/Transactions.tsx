import StatsCard from "../StatsCard";
import DoughnutChart from "../DoughnutChart";
import TransactionsTable from "../../../../components/screens/Dashboards/Admin/TransactionTable";
import { Tabs } from "@mantine/core";
import { useEffect, useState } from "react";
import { getAllTransactions } from "../../../../apis/adminApi";

interface Transaction {
  id: string;
  from: string;
  type: string;
  date: string;
  status: string;
  amount: number;
}

function Transactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [transactionsData, setTransactionsData] = useState<{
    paid: number;
    pending: number;
    refunded: number;
    overdue: number;
    rent: number;
    management: number;
    screening: number;
  }>({
    paid: 0,
    pending: 0,
    refunded: 0,
    overdue: 0,
    rent: 0,
    management: 0,
    screening: 0,
  });

  const filterTransactions = (status: string) => {
    return transactions.filter((transaction) => transaction.status === status);
  };

  useEffect(() => {
    const fetchAllTransactions = async () => {
      try {
        const response = await getAllTransactions();
        console.log("FETCH ALL TRANSACTION RESPONSE", response);
        setTransactions(response["transactions"]);
      } catch (error) {
        console.log("FETCH ALL TRANSACTION ERROR: ", error);
      }
    };

    fetchAllTransactions();
  }, []);

  return (
    <div className="space-y-5">
      <div className="flex space-x-5 items-center">
        <h3 className="font-semibold text-2xl text-black">Transactions</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatsCard title="Total Transactions">
          <div className="flex items-center justify-between text-sm mt-1">
            <DoughnutChart
              labels={["Paid", "Pending", "Refunded", "Overdue"]}
              data={[
                transactionsData.paid,
                transactionsData.pending,
                transactionsData.refunded,
                transactionsData.overdue,
              ]}
              colors={["#4AD795", "#509CF5"]}
            />
            <div className="flex flex-col">
              <div className="flex space-x-2 items-center">
                <div className="w-2 h-2 rounded-full bg-[#509CF5]"></div>
                <div className="">
                  <h4 className="font-bold text-sm">{transactionsData.paid}</h4>
                  <p className="text-[10px]">Paid</p>
                </div>
              </div>
              <div className="flex space-x-2 items-center">
                <div className="w-2 h-2 rounded-full bg-[#4AD795]"></div>
                <div className="">
                  <h4 className="font-bold text-sm">
                    {transactionsData.pending}
                  </h4>
                  <p className="text-[10px]">Pending</p>
                </div>
              </div>
              <div className="flex space-x-2 items-center">
                <div className="w-2 h-2 rounded-full bg-[#4AD795]"></div>
                <div className="">
                  <h4 className="font-bold text-sm">
                    {transactionsData.refunded}
                  </h4>
                  <p className="text-[10px]">Refunded</p>
                </div>
              </div>
              <div className="flex space-x-2 items-center">
                <div className="w-2 h-2 rounded-full bg-[#4AD795]"></div>
                <div className="">
                  <h4 className="font-bold text-sm">
                    {transactionsData.overdue}
                  </h4>
                  <p className="text-[10px]">Overdue</p>
                </div>
              </div>
            </div>
          </div>
        </StatsCard>
        <StatsCard title="Transaction Types">
          <div className="flex items-center justify-between text-sm mt-1">
            <DoughnutChart
              labels={["Rent Payment", "Management Fee", "Screening Fee"]}
              data={[
                transactionsData.rent,
                transactionsData.management,
                transactionsData.screening,
              ]}
              colors={["#4AD795", "#f5a623", "#ff3b30"]}
            />

            <div className="flex flex-col">
              <div className="flex space-x-2 items-center">
                <div className="w-2 h-2 rounded-full bg-[#509CF5]"></div>
                <div className="">
                  <h4 className="font-bold text-sm">{transactionsData.rent}</h4>
                  <p className="text-[10px]">Rent Payment</p>
                </div>
              </div>
              <div className="flex space-x-2 items-center">
                <div className="w-2 h-2 rounded-full bg-[#509CF5]"></div>
                <div className="">
                  <h4 className="font-bold text-sm">
                    {transactionsData.management}
                  </h4>
                  <p className="text-[10px]">Management Fee</p>
                </div>
              </div>
              <div className="flex space-x-2 items-center">
                <div className="w-2 h-2 rounded-full bg-[#4AD795]"></div>
                <div className="">
                  <h4 className="font-bold text-sm">
                    {transactionsData.screening}
                  </h4>
                  <p className="text-[10px]">Screening Fee</p>
                </div>
              </div>
            </div>
          </div>
        </StatsCard>
      </div>

      <Tabs defaultValue="all">
        <Tabs.List>
          <Tabs.Tab value="all">All</Tabs.Tab>
          <Tabs.Tab value="paid">Paid</Tabs.Tab>
          <Tabs.Tab value="pending">Pending</Tabs.Tab>
          <Tabs.Tab value="refunded">Refunded</Tabs.Tab>
          <Tabs.Tab value="overdue">Overdue</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="all">
          <TransactionsTable data={transactions} all />
        </Tabs.Panel>
        <Tabs.Panel value="paid">
          <TransactionsTable data={filterTransactions("paid")} all />
        </Tabs.Panel>
        <Tabs.Panel value="pending">
          <TransactionsTable data={filterTransactions("pending")} all />
        </Tabs.Panel>
        <Tabs.Panel value="refunded">
          <TransactionsTable data={filterTransactions("refunded")} all />
        </Tabs.Panel>
        <Tabs.Panel value="overdue">
          <TransactionsTable data={filterTransactions("overdue")} all />
        </Tabs.Panel>
      </Tabs>
    </div>
  );
}

export default Transactions;
