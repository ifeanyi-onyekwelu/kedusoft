import { Menu } from "@mantine/core";
import { IconDotsVertical, IconFileDownload } from "@tabler/icons-react";
import { Link } from "react-router-dom";
import StatusBadge from "../../../../components/StatusBadge";

const Th = ({ children }: { children: React.ReactNode }) => (
  <th className="text-xs p-3 font-medium text-left">{children}</th>
);

const Td = ({ children }: { children: React.ReactNode }) => (
  <td className="p-3 text-xs">{children}</td>
);

const TenantTable = ({ data }: { data: Tenant[] }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-separate border-spacing-y-2">
        <thead className="bg-gray-50">
          <tr>
            <Th>Tenant</Th>
            <Th>Property</Th>
            <Th>Lease Status</Th>
            <Th>Payment Status</Th>
            <Th>Last Payment</Th>
            <Th>Actions</Th>
          </tr>
        </thead>
        <tbody>
          {data.map((tenant) => (
            <tr
              key={tenant.id}
              className="bg-white hover:shadow-md transition duration-300 rounded-lg"
            >
              <Td>
                <Link
                  to={`/dashboard/tenants/${tenant.id}`}
                  className="font-medium text-blue-600 hover:underline"
                >
                  {tenant.name}
                </Link>
                <div className="text-gray-500 text-xs">{tenant.email}</div>
              </Td>
              <Td>
                {tenant.properties[0]?.address || "N/A"}
                {tenant.properties.length > 1 && (
                  <div className="text-xs text-gray-500">
                    +{tenant.properties.length - 1} more
                  </div>
                )}
              </Td>
              <Td>
                <StatusBadge
                  status={tenant.properties[0]?.lease?.status || "none"}
                  variant="lease"
                />
              </Td>
              <Td>
                <StatusBadge status={tenant.payment_status} variant="payment" />
              </Td>
              <Td>
                {tenant.last_payment_date
                  ? new Date(tenant.last_payment_date).toLocaleDateString()
                  : "N/A"}
              </Td>
              <Td>
                <div className="flex space-x-2">
                  <button className="text-gray-500 hover:text-blue-600">
                    <IconFileDownload size={18} />
                  </button>
                  <Menu shadow="md" width={200}>
                    <Menu.Target>
                      <button className="text-gray-500 hover:text-blue-600">
                        <IconDotsVertical size={18} />
                      </button>
                    </Menu.Target>
                    <Menu.Dropdown>
                      <Menu.Item
                        component={Link}
                        to={`/dashboard/tenants/${tenant.id}`}
                      >
                        View Details
                      </Menu.Item>
                      <Menu.Item>Send Message</Menu.Item>
                      <Menu.Item>Payment History</Menu.Item>
                    </Menu.Dropdown>
                  </Menu>
                </div>
              </Td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TenantTable;
