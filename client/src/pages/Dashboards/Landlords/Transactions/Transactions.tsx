import { useState, useEffect } from "react";
import {
  Paper,
  Title,
  Text,
  Button,
  Group,
  Table,
  Badge,
  Modal,
  TextInput,
  Select,
  NumberInput,
  Textarea,
  Stack,
  Grid,
  Card,
} from "@mantine/core";
import {
  IconPlus,
  IconCurrencyNaira,
  IconReceipt,
  IconDownload,
  IconFilter,
} from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";
import { useLandlordOperations } from "../../../../apis/landlordApi";
import { BrandedLoader } from "../../../../components/LoadingSpinner";
import EmptyState from "../../../../components/EmptyState";

interface Transaction {
  id: string;
  tenant_name: string;
  property_name: string;
  amount: number;
  purpose: string;
  status: string;
  payment_date: string;
  reference?: string;
}

interface Property {
  id: string;
  name: string;
  address: string;
  rent_amount: number;
  tenant_id?: string;
}

interface Tenant {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  properties?: any[];
}

function Transactions() {
  const { getTransactionStatistics, getListedProperties, getTenants } =
    useLandlordOperations();

  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [opened, setOpened] = useState(false);
  const [stats, setStats] = useState<any>(null);
  const [properties, setProperties] = useState<Property[]>([]);
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(
    null
  );

  // Form state for recording payment
  const [formData, setFormData] = useState({
    tenant: "",
    property: "",
    amount: 0,
    purpose: "",
    paymentDate: new Date().toISOString().split("T")[0],
    reference: "",
    notes: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Get last 30 days stats
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 30);

      const [transactionStats, propertiesData, tenantsData] = await Promise.all(
        [
          getTransactionStatistics({
            start_date: startDate.toISOString().split("T")[0],
            end_date: endDate.toISOString().split("T")[0],
          }),
          getListedProperties(),
          getTenants({}),
        ]
      );

      setStats(transactionStats);
      setProperties(propertiesData || []);
      setTenants(tenantsData?.tenants || []);

      // TODO: Fetch actual transactions from backend when endpoint is available
      setTransactions([]);
    } catch (error) {
      console.error("Error fetching data:", error);
      notifications.show({
        title: "Error",
        message: "Failed to load data",
        color: "red",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePropertyChange = (propertyId: string | null) => {
    const property = properties.find((p) => p.id === propertyId);
    setSelectedProperty(property || null);
    setFormData({
      ...formData,
      property: propertyId || "",
      amount: property?.rent_amount || 0,
    });
  };

  const handleRecordPayment = async () => {
    // TODO: Implement actual API call when endpoint is available
    notifications.show({
      title: "Payment Recorded",
      message: "Transaction has been recorded successfully",
      color: "green",
    });
    setOpened(false);
    setFormData({
      tenant: "",
      property: "",
      amount: 0,
      purpose: "",
      paymentDate: new Date().toISOString().split("T")[0],
      reference: "",
      notes: "",
    });
    setSelectedProperty(null);
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "completed":
      case "success":
        return "green";
      case "pending":
        return "yellow";
      case "failed":
        return "red";
      default:
        return "gray";
    }
  };

  if (loading) {
    return <BrandedLoader fullScreen />;
  }

  return (
    <div className="p-6">
      {/* Header */}
      <Group justify="space-between" mb="xl">
        <div>
          <Title order={2}>Transactions</Title>
          <Text size="sm" c="dimmed" mt={4}>
            Record and manage rent payments and transactions
          </Text>
          {(properties.length === 0 || tenants.length === 0) && (
            <Text size="xs" c="orange" mt={4} fw={500}>
              {properties.length === 0 && tenants.length === 0
                ? "⚠ Add properties and tenants to start recording transactions"
                : properties.length === 0
                ? "⚠ Add properties to record transactions"
                : "⚠ Add tenants with active leases to record transactions"}
            </Text>
          )}
        </div>
        <Group>
          <Button
            leftSection={<IconPlus size={18} />}
            onClick={() => setOpened(true)}
            disabled={properties.length === 0 && tenants.length === 0}
          >
            Record Payment
          </Button>
          <Button
            variant="light"
            leftSection={<IconDownload size={18} />}
            disabled={transactions.length === 0}
          >
            Export
          </Button>
        </Group>
      </Group>

      {/* Summary Cards */}
      <Grid mb="xl">
        <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
          <Card shadow="sm" p="lg" radius="md" withBorder>
            <Group justify="space-between" mb="xs">
              <Text size="sm" c="dimmed" fw={500}>
                Total Balance
              </Text>
              <IconCurrencyNaira size={20} color="#2f9e44" />
            </Group>
            <Text size="xl" fw={700}>
              ₦{(stats?.total_balance || 0).toLocaleString()}
            </Text>
            <Text size="xs" c="dimmed" mt={4}>
              Last 30 days
            </Text>
          </Card>
        </Grid.Col>

        <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
          <Card shadow="sm" p="lg" radius="md" withBorder>
            <Group justify="space-between" mb="xs">
              <Text size="sm" c="dimmed" fw={500}>
                Total Transactions
              </Text>
              <IconReceipt size={20} color="#1971c2" />
            </Group>
            <Text size="xl" fw={700}>
              {stats?.total_transactions || 0}
            </Text>
            <Text size="xs" c="dimmed" mt={4}>
              Last 30 days
            </Text>
          </Card>
        </Grid.Col>

        <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
          <Card shadow="sm" p="lg" radius="md" withBorder>
            <Group justify="space-between" mb="xs">
              <Text size="sm" c="dimmed" fw={500}>
                Pending Payments
              </Text>
              <IconReceipt size={20} color="#f08c00" />
            </Group>
            <Text size="xl" fw={700}>
              0
            </Text>
            <Text size="xs" c="dimmed" mt={4}>
              Awaiting confirmation
            </Text>
          </Card>
        </Grid.Col>

        <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
          <Card shadow="sm" p="lg" radius="md" withBorder>
            <Group justify="space-between" mb="xs">
              <Text size="sm" c="dimmed" fw={500}>
                This Month
              </Text>
              <IconCurrencyNaira size={20} color="#7950f2" />
            </Group>
            <Text size="xl" fw={700}>
              ₦0
            </Text>
            <Text size="xs" c="dimmed" mt={4}>
              Current month total
            </Text>
          </Card>
        </Grid.Col>
      </Grid>

      {/* Transactions Table */}
      <Paper shadow="sm" p="lg" radius="md" withBorder>
        <Group justify="space-between" mb="md">
          <Title order={3}>Recent Transactions</Title>
          <Button variant="subtle" leftSection={<IconFilter size={18} />}>
            Filter
          </Button>
        </Group>

        {transactions.length > 0 ? (
          <Table striped highlightOnHover>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Date</Table.Th>
                <Table.Th>Tenant</Table.Th>
                <Table.Th>Property</Table.Th>
                <Table.Th>Purpose</Table.Th>
                <Table.Th>Amount</Table.Th>
                <Table.Th>Status</Table.Th>
                <Table.Th>Reference</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {transactions.map((transaction) => (
                <Table.Tr key={transaction.id}>
                  <Table.Td>
                    <Text size="sm">
                      {new Date(transaction.payment_date).toLocaleDateString()}
                    </Text>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm" fw={500}>
                      {transaction.tenant_name}
                    </Text>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm">{transaction.property_name}</Text>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm" tt="capitalize">
                      {transaction.purpose?.replace(/_/g, " ")}
                    </Text>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm" fw={600}>
                      ₦{transaction.amount.toLocaleString()}
                    </Text>
                  </Table.Td>
                  <Table.Td>
                    <Badge color={getStatusColor(transaction.status)}>
                      {transaction.status}
                    </Badge>
                  </Table.Td>
                  <Table.Td>
                    <Text size="xs" c="dimmed">
                      {transaction.reference || "N/A"}
                    </Text>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        ) : (
          <EmptyState>
            <IconReceipt size={48} className="text-gray-400 mb-4" />
            <Text size="lg" fw={600} mb="xs">
              No Transactions Yet
            </Text>
            <Text size="sm" c="dimmed" mb="lg">
              Record your first payment to get started
            </Text>
            <Button
              leftSection={<IconPlus size={18} />}
              onClick={() => setOpened(true)}
            >
              Record Payment
            </Button>
          </EmptyState>
        )}
      </Paper>

      {/* Record Payment Modal */}
      <Modal
        opened={opened}
        onClose={() => {
          setOpened(false);
          setSelectedProperty(null);
        }}
        title={
          <div>
            <Text fw={600} size="lg">
              Record Payment
            </Text>
            <Text size="xs" c="dimmed" mt={4}>
              Select a property to automatically populate the rent amount
            </Text>
          </div>
        }
        size="lg"
      >
        <Stack gap="md">
          <Select
            label="Property"
            placeholder={
              properties.length > 0
                ? "Select property"
                : "No properties available"
            }
            data={properties.map((property) => ({
              value: property.id,
              label: `${property.name} - ${property.address}`,
            }))}
            searchable
            required
            value={formData.property}
            onChange={handlePropertyChange}
            description={
              selectedProperty
                ? `✓ Rent Amount: ₦${selectedProperty.rent_amount.toLocaleString()} (auto-filled below)`
                : properties.length === 0
                ? "Add properties first to record transactions"
                : "Select a property to auto-fill the rent amount"
            }
            disabled={properties.length === 0}
            styles={{
              description: {
                color: selectedProperty
                  ? "var(--mantine-color-green-6)"
                  : undefined,
                fontWeight: selectedProperty ? 500 : undefined,
              },
            }}
          />

          <Select
            label="Tenant"
            placeholder={
              tenants.length > 0 ? "Select tenant" : "No tenants available"
            }
            data={tenants.map((tenant) => ({
              value: tenant.id,
              label: `${tenant.firstName} ${tenant.lastName} (${tenant.email})`,
            }))}
            searchable
            required
            value={formData.tenant}
            onChange={(value) =>
              setFormData({ ...formData, tenant: value || "" })
            }
            description={
              tenants.length === 0
                ? "Tenants with active leases will appear here"
                : `${tenants.length} tenant(s) available`
            }
            disabled={tenants.length === 0}
          />

          <NumberInput
            label="Amount"
            placeholder="Enter amount"
            prefix="₦"
            thousandSeparator=","
            required
            min={0}
            value={formData.amount}
            onChange={(value) =>
              setFormData({ ...formData, amount: Number(value) || 0 })
            }
            description={
              selectedProperty &&
              formData.amount === selectedProperty.rent_amount
                ? "✓ Auto-filled from property rent amount"
                : "You can modify the amount as needed"
            }
            styles={{
              description: {
                color:
                  selectedProperty &&
                  formData.amount === selectedProperty.rent_amount
                    ? "var(--mantine-color-green-6)"
                    : undefined,
                fontWeight:
                  selectedProperty &&
                  formData.amount === selectedProperty.rent_amount
                    ? 500
                    : undefined,
              },
            }}
          />

          <Select
            label="Payment Purpose"
            placeholder="Select purpose"
            data={[
              { value: "rent", label: "Rent Payment" },
              { value: "deposit", label: "Security Deposit" },
              { value: "maintenance", label: "Maintenance Fee" },
              { value: "utilities", label: "Utilities" },
              { value: "other", label: "Other" },
            ]}
            required
            value={formData.purpose}
            onChange={(value) =>
              setFormData({ ...formData, purpose: value || "" })
            }
          />

          <TextInput
            label="Payment Date"
            type="date"
            required
            value={formData.paymentDate}
            onChange={(e) =>
              setFormData({ ...formData, paymentDate: e.target.value })
            }
          />

          <TextInput
            label="Payment Reference"
            placeholder="Transaction reference number"
            value={formData.reference}
            onChange={(e) =>
              setFormData({ ...formData, reference: e.target.value })
            }
          />

          <Textarea
            label="Notes"
            placeholder="Additional notes (optional)"
            rows={3}
            value={formData.notes}
            onChange={(e) =>
              setFormData({ ...formData, notes: e.target.value })
            }
          />

          <Group justify="flex-end" mt="md">
            <Button
              variant="subtle"
              onClick={() => {
                setOpened(false);
                setSelectedProperty(null);
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleRecordPayment}
              disabled={
                !formData.property ||
                !formData.tenant ||
                !formData.amount ||
                !formData.purpose
              }
            >
              Record Payment
            </Button>
          </Group>
        </Stack>
      </Modal>
    </div>
  );
}

export default Transactions;
