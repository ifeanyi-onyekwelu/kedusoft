import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  IconDownload,
  IconPencil,
  IconTrash,
  IconCheck,
  IconX,
  IconHome,
  IconCalendar,
  IconUser,
  IconMapPin,
  IconCurrencyNaira,
  IconBuildingStore,
  IconBed,
  IconSquare,
  IconArrowLeft,
} from "@tabler/icons-react";
import { useLandlordOperations } from "../../../../apis/landlordApi";
import { useLoading } from "../../../../hooks/useLoading";
import StatusBadge from "../../../../components/StatusBadge";
import {
  Button,
  Card,
  Grid,
  Group,
  Text,
  Badge,
  Paper,
  Stack,
  ActionIcon,
} from "@mantine/core";
import { LoadingSpinner } from "../../../../components/LoadingSpinner";
import { ErrorState } from "../../../../components/ErrorState";
import { notifications } from "@mantine/notifications";

function PropertyDetails() {
  const { id } = useParams();
  const { loading, withLoading } = useLoading();
  const { getProperty, updateProperty } = useLandlordOperations();
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [propertyData, setPropertyData] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPropertyDetails = async () => {
      try {
        setError(null);
        console.log("Fetching property with ID:", id);
        const response = await withLoading(getProperty(id!));
        console.log("Property response:", response);

        // The backend response should contain property, current_lease, tenant, category
        if (response && response.property) {
          setPropertyData(response);
        } else {
          throw new Error("Property not found or invalid response format");
        }
      } catch (err: any) {
        console.error("Error fetching property:", err);
        setError(err.message || "Failed to fetch property details");
        notifications.show({
          title: "Error",
          message: "Failed to load property details",
          color: "red",
        });
      }
    };

    if (id) {
      fetchPropertyDetails();
    }
  }, [id]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setPropertyData((prev: any) => ({
      ...prev,
      property: {
        ...prev.property,
        [name]:
          name === "rent_amount" ||
          name === "service_charge" ||
          name === "security_deposit"
            ? Number(value)
            : value,
      },
    }));
  };

  const handleSubmit = async () => {
    try {
      const response = await withLoading(
        updateProperty(id!, propertyData.property)
      );
      console.log("Update response:", response);
      setIsEditing(false);
      notifications.show({
        title: "Success",
        message: "Property updated successfully",
        color: "green",
      });
    } catch (error: any) {
      setError("Failed to update property");
      notifications.show({
        title: "Error",
        message: error.message || "Failed to update property",
        color: "red",
      });
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  if (loading) return <LoadingSpinner />;
  if (error)
    return (
      <ErrorState
        message={error}
        loading={false}
        onRetry={() => window.location.reload()}
      />
    );
  if (!propertyData || !propertyData.property)
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <IconHome size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No property data found
          </h3>
          <p className="text-gray-500">
            The property you're looking for doesn't exist or couldn't be loaded.
          </p>
        </div>
      </div>
    );

  const { property, category, current_lease, tenant } = propertyData;

  const renderField = (
    label: string,
    fieldName: string,
    isCurrency = false
  ) => (
    <Paper p="sm" bg="gray.0" radius="sm">
      <Group justify="space-between" align="center">
        <Text size="sm" fw={500} c="dimmed">
          {label}
        </Text>
        {isEditing ? (
          <input
            type={isCurrency ? "number" : "text"}
            name={fieldName}
            value={property[fieldName] || ""}
            onChange={handleInputChange}
            className="border rounded px-3 py-2 flex-1 ml-4 max-w-xs"
          />
        ) : (
          <Text size="sm" fw={600}>
            {isCurrency
              ? `₦${Number(property[fieldName])?.toLocaleString()}`
              : property[fieldName]}
          </Text>
        )}
      </Group>
    </Paper>
  );

  const renderSelectField = (
    label: string,
    fieldName: string,
    options: string[]
  ) => (
    <Paper p="sm" bg="gray.0" radius="sm">
      <Group justify="space-between" align="center">
        <Text size="sm" fw={500} c="dimmed">
          {label}
        </Text>
        {isEditing ? (
          <select
            name={fieldName}
            value={property[fieldName]}
            onChange={handleInputChange}
            className="border rounded px-3 py-2 flex-1 ml-4 max-w-xs"
          >
            {options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        ) : (
          <Badge variant="light" size="md">
            {property[fieldName]}
          </Badge>
        )}
      </Group>
    </Paper>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      {/* Breadcrumb/Back Navigation */}
      <div className="max-w-7xl mx-auto mb-6">
        <Button
          variant="subtle"
          leftSection={<IconArrowLeft size={18} />}
          onClick={() => navigate("/property-owner/properties")}
          className="mb-4"
        >
          Back to Properties
        </Button>
      </div>

      <div className="max-w-7xl mx-auto">
        {/* Header Card */}
        <Card shadow="sm" padding="lg" radius="md" withBorder className="mb-6">
          <Group justify="space-between" align="flex-start">
            <div className="flex-1">
              <Group gap="md" mb="sm">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <IconHome size={28} className="text-blue-600" />
                </div>
                <div>
                  <Text size="xl" fw={700} className="text-gray-900">
                    {property.name}
                  </Text>
                  <Group gap={8} mt={4}>
                    <IconMapPin size={16} className="text-gray-500" />
                    <Text size="sm" c="dimmed">
                      {property.address}, {property.city}, {property.state}
                    </Text>
                  </Group>
                </div>
              </Group>

              {/* Quick Stats */}
              <Group gap="xl" mt="md">
                <Group gap={8}>
                  <IconBed size={18} className="text-gray-600" />
                  <Text size="sm" fw={500}>
                    {property.bedrooms} Beds
                  </Text>
                </Group>
                <Group gap={8}>
                  <IconBuildingStore size={18} className="text-gray-600" />
                  <Text size="sm" fw={500}>
                    {property.bathrooms} Baths
                  </Text>
                </Group>
                <Group gap={8}>
                  <IconSquare size={18} className="text-gray-600" />
                  <Text size="sm" fw={500}>
                    {property.size_sqft} sqft
                  </Text>
                </Group>
                <Group gap={8}>
                  <IconCurrencyNaira size={18} className="text-green-600" />
                  <Text size="sm" fw={700} c="blue">
                    ₦{Number(property.rent_amount)?.toLocaleString()}/mo
                  </Text>
                </Group>
              </Group>
            </div>

            {/* Action Buttons */}
            <Group gap="sm">
              {isEditing ? (
                <>
                  <Button
                    onClick={handleSubmit}
                    color="green"
                    leftSection={<IconCheck size={18} />}
                  >
                    Save Changes
                  </Button>
                  <Button
                    onClick={handleCancelEdit}
                    variant="light"
                    color="red"
                    leftSection={<IconX size={18} />}
                  >
                    Cancel
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    onClick={() => setIsEditing(true)}
                    variant="filled"
                    leftSection={<IconPencil size={18} />}
                  >
                    Edit Property
                  </Button>
                  <ActionIcon
                    variant="light"
                    color="red"
                    size="lg"
                    title="Delete property"
                  >
                    <IconTrash size={20} />
                  </ActionIcon>
                </>
              )}
            </Group>
          </Group>
        </Card>

        <Grid gutter="lg">
          {/* Main Property Details */}
          <Grid.Col span={{ base: 12, lg: 8 }}>
            <Stack gap="lg">
              {/* Property Information */}
              <Card shadow="sm" padding="lg" radius="md" withBorder>
                <Text size="lg" fw={700} mb="md" className="text-gray-900">
                  Property Information
                </Text>
                <Stack gap="md">
                  {renderField("Property Name", "name")}
                  <Paper p="sm" bg="gray.0" radius="sm">
                    <Group justify="space-between">
                      <Text size="sm" fw={500} c="dimmed">
                        Category
                      </Text>
                      <Badge variant="light" size="lg">
                        {category?.name || "Not specified"}
                      </Badge>
                    </Group>
                  </Paper>
                  {renderField("Description", "description")}
                  {renderField("Address", "address")}
                  <Group grow>
                    {renderField("City", "city")}
                    {renderField("State", "state")}
                  </Group>
                  {renderField("Zip Code", "zipcode")}
                </Stack>
              </Card>

              {/* Specifications */}
              <Card shadow="sm" padding="lg" radius="md" withBorder>
                <Text size="lg" fw={700} mb="md" className="text-gray-900">
                  Property Specifications
                </Text>
                <Grid gutter="md">
                  <Grid.Col span={{ base: 12, sm: 6 }}>
                    <Stack gap="md">
                      {renderField("Bedrooms", "bedrooms")}
                      {renderField("Bathrooms", "bathrooms")}
                      {renderField("Parking Spaces", "parking_space")}
                      {renderSelectField("Furnished", "furnished", [
                        "Yes",
                        "No",
                      ])}
                    </Stack>
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, sm: 6 }}>
                    <Stack gap="md">
                      {renderField("Size (sqft)", "size_sqft")}
                      {renderField("Year Built", "year_built")}
                      {renderSelectField("Pets Allowed", "pets", [
                        "Allowed",
                        "Not Allowed",
                      ])}
                      {renderField("Floors", "floors_no")}
                    </Stack>
                  </Grid.Col>
                </Grid>
              </Card>
            </Stack>
          </Grid.Col>

          {/* Sidebar with Financial and Status Info */}
          <Grid.Col span={{ base: 12, lg: 4 }}>
            <Stack gap="lg">
              {/* Financial Details */}
              <Card shadow="sm" padding="lg" radius="md" withBorder>
                <Group gap="xs" mb="md">
                  <IconCurrencyNaira size={20} className="text-green-600" />
                  <Text size="lg" fw={700} className="text-gray-900">
                    Financial Details
                  </Text>
                </Group>
                <Stack gap="md">
                  <Paper p="md" bg="blue.0" radius="sm">
                    <Text size="xs" c="dimmed" mb={4}>
                      Monthly Rent
                    </Text>
                    <Text size="xl" fw={700} c="blue">
                      ₦{Number(property.rent_amount)?.toLocaleString()}
                    </Text>
                  </Paper>
                  {renderSelectField("Payment Structure", "payment_structure", [
                    "Monthly",
                    "Quarterly",
                    "Yearly",
                  ])}
                  {renderField("Service Charge", "service_charge", true)}
                  {renderField("Security Deposit", "security_deposit", true)}
                  {renderField("Available From", "available_from")}
                  {renderSelectField(
                    "Minimum Lease Duration",
                    "minimum_lease_duration",
                    ["6 Months", "1 Year", "2 Years"]
                  )}
                </Stack>
              </Card>

              {/* Status & Verification */}
              <Card shadow="sm" padding="lg" radius="md" withBorder>
                <Text size="lg" fw={700} mb="md" className="text-gray-900">
                  Status & Verification
                </Text>
                <Stack gap="md">
                  <Paper p="md" bg="gray.0" radius="sm">
                    <Text size="sm" fw={500} c="dimmed" mb="sm">
                      Availability
                    </Text>
                    <StatusBadge
                      status={
                        property.status ||
                        (property.is_available ? "available" : "rented")
                      }
                      variant="lease"
                    />
                  </Paper>
                  <Paper p="md" bg="gray.0" radius="sm">
                    <Text size="sm" fw={500} c="dimmed" mb="sm">
                      Verification Status
                    </Text>
                    <StatusBadge
                      status={property.verification_status.toLowerCase()}
                      variant="verification"
                    />
                  </Paper>
                </Stack>
              </Card>

              {/* Lease Information */}
              {current_lease && (
                <Card shadow="sm" padding="lg" radius="md" withBorder>
                  <Group gap="xs" mb="md">
                    <IconCalendar size={20} className="text-purple-600" />
                    <Text size="lg" fw={700} className="text-gray-900">
                      Current Lease
                    </Text>
                  </Group>
                  <Stack gap="md">
                    <Paper p="sm" bg="gray.0" radius="sm">
                      <Group justify="space-between">
                        <Text size="sm" fw={500} c="dimmed">
                          Start Date
                        </Text>
                        <Text size="sm" fw={600}>
                          {new Date(
                            current_lease.start_date
                          ).toLocaleDateString()}
                        </Text>
                      </Group>
                    </Paper>
                    <Paper p="sm" bg="gray.0" radius="sm">
                      <Group justify="space-between">
                        <Text size="sm" fw={500} c="dimmed">
                          End Date
                        </Text>
                        <Text size="sm" fw={600}>
                          {new Date(
                            current_lease.end_date
                          ).toLocaleDateString()}
                        </Text>
                      </Group>
                    </Paper>
                    <Paper p="sm" bg="gray.0" radius="sm">
                      <Group justify="space-between">
                        <Text size="sm" fw={500} c="dimmed">
                          Status
                        </Text>
                        <StatusBadge
                          status={current_lease.status.toLowerCase()}
                          variant="lease"
                        />
                      </Group>
                    </Paper>
                  </Stack>
                </Card>
              )}

              {/* Tenant Information */}
              {tenant && (
                <Card shadow="sm" padding="lg" radius="md" withBorder>
                  <Group gap="xs" mb="md">
                    <div className="p-2 bg-blue-50 rounded-lg">
                      <IconUser size={18} className="text-blue-600" />
                    </div>
                    <Text size="lg" fw={700} className="text-gray-900">
                      Current Tenant
                    </Text>
                  </Group>
                  <Stack gap="md">
                    <div>
                      <Text size="xs" c="dimmed" mb={4}>
                        Full Name
                      </Text>
                      <Text size="md" fw={600}>
                        {tenant.full_name}
                      </Text>
                    </div>
                    <div>
                      <Text size="xs" c="dimmed" mb={4}>
                        Email Address
                      </Text>
                      <Text size="sm" c="blue">
                        {tenant.email}
                      </Text>
                    </div>
                    <div>
                      <Text size="xs" c="dimmed" mb={4}>
                        Phone Number
                      </Text>
                      <Text size="sm">{tenant.phone_number}</Text>
                    </div>
                  </Stack>
                </Card>
              )}
            </Stack>
          </Grid.Col>
        </Grid>
      </div>
    </div>
  );
}

export default PropertyDetails;
