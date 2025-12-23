import Table from "./Table";
import { getAllTransactions } from "../../../../apis/tenantApi";
import { useEffect, useState } from "react";
import EmptyState from "../../../../components/EmptyState";
import { Button, Group, TextInput, Select, Paper, Badge } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import {
  IconCurrencyNaira,
  IconCheck,
  IconClock,
  IconSearch,
  IconRefresh,
  IconX,
} from "@tabler/icons-react";
import { motion, AnimatePresence } from "framer-motion";
import UniversalStatCard from "../../../../components/shared/Dashboard/UniversalStatCard";

type Transaction = {
  propertyName: string;
  propertyAddress: string;
  paymentDate: string;
  status: "Unpaid" | "Paid";
};

interface StatisticItem {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
  filterKey?: string | null;
}

function Transactions() {
  const [statistics, setStatistics] = useState<StatisticItem[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<
    Transaction[]
  >([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<string>("newest");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const response = await getAllTransactions();
      const transactionsData = response["applications"] || [];
      setTransactions(transactionsData);

      // Calculate statistics
      const totalTransactions = transactionsData.length;
      const totalPaidTransactions: number = transactionsData.filter(
        (transaction: Transaction) => transaction.status === "Paid"
      ).length;
      const totalUnpaidTransactions: number = transactionsData.filter(
        (transaction: Transaction) => transaction.status === "Unpaid"
      ).length;

      setStatistics([
        {
          title: "Total Transactions",
          value: totalTransactions,
          icon: <IconCurrencyNaira size={24} />,
          color: "#3b82f6",
          filterKey: null,
        },
        {
          title: "Paid",
          value: totalPaidTransactions,
          icon: <IconCheck size={24} />,
          color: "#10b981",
          filterKey: "paid",
        },
        {
          title: "Unpaid",
          value: totalUnpaidTransactions,
          icon: <IconClock size={24} />,
          color: "#f59e0b",
          filterKey: "unpaid",
        },
      ]);
    } catch (error) {
      console.error("Failed to fetch transactions:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  // Filter and sort transactions
  useEffect(() => {
    let filtered = transactions;

    // Apply status filter
    if (filterStatus && filterStatus !== "all") {
      filtered = filtered.filter(
        (transaction) =>
          transaction.status.toLowerCase() === filterStatus.toLowerCase()
      );
    }

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (transaction) =>
          transaction.propertyName
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          transaction.propertyAddress
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return (
            new Date(b.paymentDate).getTime() -
            new Date(a.paymentDate).getTime()
          );
        case "oldest":
          return (
            new Date(a.paymentDate).getTime() -
            new Date(b.paymentDate).getTime()
          );
        case "property":
          return a.propertyName.localeCompare(b.propertyName);
        default:
          return 0;
      }
    });

    setFilteredTransactions(filtered);
  }, [transactions, filterStatus, searchQuery, sortBy]);

  // Handle stat card click to filter
  const handleStatClick = (filterKey: string | null) => {
    if (filterKey === null) {
      // Total Transactions - show all
      setFilterStatus(null);
    } else if (filterKey === filterStatus) {
      // Clicking same filter again - clear it
      setFilterStatus(null);
    } else {
      // Set the filter
      setFilterStatus(filterKey);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="space-y-6 p-6">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
        >
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              Transactions
            </h1>
            <p className="text-gray-600 text-sm mt-2">
              Track and manage your property payment transactions
            </p>
          </div>
          <Button
            leftSection={<IconRefresh size={16} />}
            onClick={fetchTransactions}
            loading={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Refresh
          </Button>
        </motion.div>

        {/* Interactive Statistics Cards */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <AnimatePresence>
            {statistics.map((stat, index) => (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.1, duration: 0.3 }}
              >
                <div onClick={() => handleStatClick(stat.filterKey)}>
                  <UniversalStatCard
                    title={stat.title}
                    value={stat.value}
                    icon={stat.icon}
                    color={stat.color}
                    onClick={() => handleStatClick(stat.filterKey)}
                  />
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Active Filter Badge */}
        <AnimatePresence>
          {filterStatus && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-center gap-2"
            >
              <span className="text-sm text-gray-600">Active Filter:</span>
              <Badge
                size="lg"
                rightSection={
                  <button
                    onClick={() => setFilterStatus(null)}
                    className="ml-2 hover:opacity-70"
                  >
                    <IconX size={14} />
                  </button>
                }
                className="bg-blue-50 text-blue-700 border border-blue-200"
              >
                {filterStatus === "paid" ? "Paid Only" : "Unpaid Only"}
              </Badge>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Filters & Search Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <Paper
            p="md"
            withBorder
            className="bg-white shadow-sm rounded-lg border-gray-200"
          >
            <Group grow>
              <TextInput
                placeholder="Search by property name or address..."
                rightSection={<IconSearch size={16} />}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.currentTarget.value)}
                className="flex-1"
              />

              <Select
                placeholder="Sort by"
                data={[
                  { value: "newest", label: "Newest First" },
                  { value: "oldest", label: "Oldest First" },
                  { value: "property", label: "Property Name" },
                ]}
                value={sortBy}
                onChange={setSortBy}
                className="w-[150px]"
              />
            </Group>
          </Paper>
        </motion.div>

        {/* Transactions Content */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          {filteredTransactions.length > 0 ? (
            <Table
              transactions={filteredTransactions}
              formatDate={formatDate}
            />
          ) : (
            <EmptyState>
              <motion.div
                className="space-y-4 flex flex-col justify-center items-center text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="w-20 h-20 bg-gradient-to-br from-blue-50 to-blue-100 rounded-full flex items-center justify-center">
                  <IconCurrencyNaira size={40} className="text-blue-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">
                    No Transactions Found
                  </h2>
                  <p className="text-gray-500 max-w-md mt-2">
                    {searchQuery || filterStatus
                      ? "Try adjusting your search or filters to find what you're looking for."
                      : "You haven't made any transactions yet. Start by browsing available properties."}
                  </p>
                </div>
                <Group>
                  {(searchQuery || filterStatus) && (
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSearchQuery("");
                        setFilterStatus(null);
                      }}
                    >
                      Clear Filters
                    </Button>
                  )}
                  <Button
                    onClick={() => navigate("/properties/search")}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Browse Properties
                  </Button>
                </Group>
              </motion.div>
            </EmptyState>
          )}
        </motion.div>
      </div>
    </div>
  );
}

export default Transactions;
