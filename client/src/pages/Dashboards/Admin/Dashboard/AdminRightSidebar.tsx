import { Autocomplete, Divider, Badge, List } from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";
import React from "react";

interface PropertyItemProps {
  tenantName: string;
  status: string;
  address: string;
  phoneNumber: string;
  paymentDate: string;
  dueDate: string;
}

const Activity: React.FC<PropertyItemProps> = ({
  tenantName,
  status,
  address,
  phoneNumber,
  paymentDate,
  dueDate,
}) => {
  return (
    <div className="space-y-2">
      <div className="flex space-x-3 items-center">
        <div
          className={`w-3 h-3 rounded-full ${
            status === "Paid" ? "bg-green-600" : "bg-red-600"
          }`}
        ></div>
        <Badge color={status === "Paid" ? "teal" : "red"} size="sm" radius="sm">
          {status}
        </Badge>
      </div>
      <h4 className="text-xs font-medium">{tenantName}</h4>
      <ul className="text-[10px]">
        <li className="text-gray-800">{address}</li>
        <li className="text-gray-600">Phone Number: {phoneNumber}</li>
        <li className="text-gray-600">Payment Date: {paymentDate}</li>
        <li className="text-gray-600">Due Date: {dueDate}</li>
      </ul>
    </div>
  );
};

const tenants = [
  {
    tenantName: "Mark Odeh",
    status: "Paid",
    address: "Plot 25, Andrews Avenue, Ikeja Lagos",
    phoneNumber: "+234 803 222 1111",
    paymentDate: "2024-02-01",
    dueDate: "2024-08-01",
  },
  {
    tenantName: "John Emeka",
    status: "Paid",
    address: "Flat 7, Unity Estate, Lekki Phase 1, Lagos",
    phoneNumber: "+234 805 999 1234",
    paymentDate: "2024-01-15",
    dueDate: "2024-07-15",
  },
  {
    tenantName: "Chioma Okechukwu",
    status: "Paid",
    address: "House 10, Queens Drive, Ikoyi, Lagos",
    phoneNumber: "+234 809 444 8888",
    paymentDate: "2024-03-10",
    dueDate: "2024-09-10",
  },
  {
    tenantName: "Samuel Akpan",
    status: "Paid",
    address: "Plot 18, Oluwa Street, Surulere, Lagos",
    phoneNumber: "+234 706 555 4321",
    paymentDate: "2024-02-20",
    dueDate: "2024-08-20",
  },
  {
    tenantName: "Emefiele",
    status: "Unpaid",
    address: "Plot 18, Oluwa Street, Surulere, Lagos",
    phoneNumber: "+234 706 555 4321",
    paymentDate: "2024-02-20",
    dueDate: "2024-08-20",
  },
  {
    tenantName: "Miriam Onu",
    status: "Paid",
    address: "House 32, Freedom Avenue, Yaba, Lagos",
    phoneNumber: "+234 701 777 6666",
    paymentDate: "2024-04-01",
    dueDate: "2024-10-01",
  },
  {
    tenantName: "Ahmed Bello",
    status: "Paid",
    address: "Flat 9, Crescent Apartments, Maryland, Lagos",
    phoneNumber: "+234 802 333 4444",
    paymentDate: "2024-03-25",
    dueDate: "2024-09-25",
  },
  {
    tenantName: "Rita Omoruyi",
    status: "Paid",
    address: "Block A, Sunrise Estate, Ogudu, Lagos",
    phoneNumber: "+234 810 555 9876",
    paymentDate: "2024-01-05",
    dueDate: "2024-07-05",
  },
  {
    tenantName: "James Iroko",
    status: "Paid",
    address: "Duplex 2, Royal Gardens, Ajah, Lagos",
    phoneNumber: "+234 803 888 2222",
    paymentDate: "2024-02-12",
    dueDate: "2024-08-12",
  },
];

function AdminRightSidebar() {
  return (
    <div className="hidden md:block md:w-[20%] h-screen overflow-y-auto p-3 space-y-4 scrollable">
      <Autocomplete
        placeholder="Search"
        leftSection={<IconSearch size={16} stroke={1.5} />}
        className="w-full"
      />

      <h3 className="text-xs text-gray-700">Active Tenants (15)</h3>
      <Divider />
      <div className="space-y-5">
        {tenants.map((property, index) => (
          <React.Fragment key={index}>
            <Activity {...property} />
            <Divider size="sm" />
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

export default AdminRightSidebar;
