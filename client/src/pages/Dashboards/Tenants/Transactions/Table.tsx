import { Menu } from "@mantine/core";
import { IconDotsVertical, IconEye } from "@tabler/icons-react";
import React from "react";
import { Link, useNavigate } from "react-router-dom";

type Transactions = {
    propertyName: string;
    propertyAddress: string;
    paymentDate: string;
    status: "Unpaid" | "Paid";
};

// Reusable <Th> Component
const Th: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
    <th className="text-[12px] p-3 font-normal">{children}</th>
);

// Reusable <Td> Component
const Td: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <td className="p-3 text-[12px]">{children}</td>
);

const StatusBadge: React.FC<{ status: Transactions["status"] }> = ({
    status,
}) => {
    const statusColors: Record<Transactions["status"], string> = {
        Paid: "bg-green-200 text-green-800",
        Unpaid: "bg-red-500 text-white",
    };

    return (
        <span
            className={`px-2 rounded-full text-[10px] py-[1px] ${statusColors[status]}`}
        >
            {status}
        </span>
    );
};

const Table = ({ transactions }: { transactions: Transactions[] }) => {
    const navigate = useNavigate();

    return (
        transactions.length && (
            <table className="w-full border-separate border-spacing-y-3">
                <thead className="bg-white">
                    <tr className="text-center">
                        <Th>Property Name</Th>
                        <Th>Property Address</Th>
                        <Th>Payment Date</Th>
                        <Th>Status</Th>
                        <Th></Th>
                    </tr>
                </thead>
                <tbody className="relative">
                    {transactions.map((transaction) => (
                        <tr
                            key={transaction.propertyName}
                            className="p-5 bg-white rounded-xl text-center"
                        >
                            <Td><Link to={transaction.propertyName} className="hover:underline hover:text-primary">{transaction.propertyName}</Link></Td>
                            <Td>{transaction.propertyAddress}</Td>
                            <Td>{transaction.paymentDate}</Td>
                            <Td>
                                <StatusBadge status={transaction.status} />
                            </Td>
                            <Td>
                                <Link to={transaction.propertyName}>
                                    <IconEye size={20} stroke={1} />
                                </Link>
                            </Td>
                        </tr>
                    ))}
                </tbody>
            </table>
        )
    );
};

export default Table;
