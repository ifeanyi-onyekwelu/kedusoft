import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  IconDownload,
  IconPencil,
  IconTrash,
  IconArrowLeft,
  IconCircleCheck,
  IconAlertCircle,
  IconDotsVertical,
} from "@tabler/icons-react";
import { useLandlordOperations } from "../../../../apis/landlordApi";
import { ErrorState } from "../../../../components/ErrorState";
import formatAmount, { formatDate } from "../../../../utils/helpers";
import { Menu, ActionIcon } from "@mantine/core";
import { LoadingSpinner } from "../../../../components/LoadingSpinner";

function TenantDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [tenant, setTenant] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { getTenantById } = useLandlordOperations();

  const fetchTenantDetails = async () => {
    try {
      setLoading(true);

      if (!id) {
        throw new Error("Tenant ID is missing");
      }

      const response = await getTenantById(id);
      console.log("Tenant details response:", response);

      setTenant(response);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch tenant details"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTenantDetails();
  }, [id]);

  const handleEdit = () => navigate(`/dashboard/tenants/${id}/edit`);
  const handleDelete = async () => {
    // Implement delete logic
  };
  const handleDownload = () => {
    // Implement download logic
  };
  const handleBack = () => navigate(-1);

  if (loading) return <LoadingSpinner />;
  if (error)
    return (
      <ErrorState
        message={error}
        loading={loading}
        onRetry={fetchTenantDetails}
      />
    );
  if (!tenant)
    return <ErrorState message="Tenant not found" loading={loading} />;

  const primaryProperty = tenant.properties[0];
  const statusColor =
    tenant.payment_status === "paid"
      ? "text-green-600 bg-green-50"
      : tenant.payment_status === "overdue"
      ? "text-red-600 bg-red-50"
      : "text-yellow-600 bg-yellow-50";

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-sm">
      <div className="flex justify-between items-start mb-8">
        <button
          onClick={handleBack}
          className="flex items-center text-gray-600 hover:text-primary"
        >
          <IconArrowLeft size={20} className="mr-2" />
          Back to Tenants
        </button>

        <div className="flex space-x-2">
          <ActionIcon
            variant="subtle"
            color="blue"
            onClick={handleDownload}
            aria-label="Download"
          >
            <IconDownload size={20} />
          </ActionIcon>

          <Menu shadow="md" width={200}>
            <Menu.Target>
              <ActionIcon
                variant="subtle"
                color="gray"
                aria-label="More options"
              >
                <IconDotsVertical size={20} />
              </ActionIcon>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item
                leftSection={<IconPencil size={16} />}
                onClick={handleEdit}
              >
                Edit Tenant
              </Menu.Item>
              <Menu.Item
                leftSection={<IconTrash size={16} />}
                color="red"
                onClick={handleDelete}
              >
                Delete Tenant
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </div>
      </div>

      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {tenant.first_name} {tenant.last_name}
            </h1>
            <p className="text-gray-600">{tenant.email}</p>
          </div>

          <div
            className={`mt-4 md:mt-0 px-4 py-2 rounded-full ${statusColor} flex items-center`}
          >
            {tenant.payment_status === "paid" ? (
              <IconCircleCheck size={16} className="mr-2" />
            ) : (
              <IconAlertCircle size={16} className="mr-2" />
            )}
            <span className="font-medium capitalize">
              {tenant.payment_status}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h2 className="text-lg font-semibold border-b pb-2">
              Personal Information
            </h2>
            <DetailItem label="Email" value={tenant.email} />
            <DetailItem label="Phone" value={tenant.phone} />
            <DetailItem label="Address" value={tenant.address} />
            <DetailItem
              label="Member Since"
              value={formatDate(tenant.created_at)}
            />
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-semibold border-b pb-2">
              Lease Information
            </h2>
            {primaryProperty ? (
              <>
                <DetailItem
                  label="Property"
                  value={
                    <Link
                      to={`/dashboard/properties/${primaryProperty.id}`}
                      className="text-blue-600 hover:underline"
                    >
                      {primaryProperty.address}
                    </Link>
                  }
                />
                <DetailItem
                  label="Move-in Date"
                  value={formatDate(primaryProperty.move_in_date)}
                />
                <DetailItem
                  label="Lease Term"
                  value={`${formatDate(
                    primaryProperty.lease.start_date
                  )} - ${formatDate(primaryProperty.lease.end_date)}`}
                />
                <DetailItem
                  label="Payment Structure"
                  value={primaryProperty.lease.payment_structure}
                />
                <DetailItem
                  label="Rent Amount"
                  value={formatAmount(primaryProperty.lease.rent_amount)}
                />
              </>
            ) : (
              <p className="text-gray-500">No lease information available</p>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-semibold border-b pb-2">
            Payment Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <DetailItem
              label="Payment Status"
              value={
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${statusColor}`}
                >
                  {tenant.payment_status}
                </span>
              }
            />
            {tenant.last_payment ? (
              <>
                <DetailItem
                  label="Last Payment Amount"
                  value={formatAmount(tenant.last_payment.amount)}
                />
                <DetailItem
                  label="Last Payment Date"
                  value={formatDate(tenant.last_payment.date)}
                />
              </>
            ) : (
              <DetailItem label="Last Payment" value="No payments yet" />
            )}
            {tenant.next_payment_date && (
              <DetailItem
                label="Next Payment Due"
                value={formatDate(tenant.next_payment_date)}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Reusable DetailItem component
const DetailItem = ({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) => (
  <div className="flex justify-between">
    <span className="text-gray-600">{label}:</span>
    <span className="font-medium text-right max-w-[60%]">{value}</span>
  </div>
);

export default TenantDetails;
