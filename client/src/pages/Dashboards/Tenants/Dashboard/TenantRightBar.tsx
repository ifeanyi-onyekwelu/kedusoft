import { Autocomplete, Divider, Badge, List } from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";
import React from "react";

interface PropertyItemProps {
    address: string;
    status: string;
    condition: string;
    tenant: string;
}

const PropertyItem: React.FC<PropertyItemProps> = ({
    address,
    status,
    condition,
    tenant,
}) => {
    return (
        <div className="space-y-1">
            <h4 className="text-xs">{address}</h4>
            <Badge
                color={status === "Occupied" ? "teal" : "red"}
                size="sm"
                radius="xs"
            >
                {status}
            </Badge>
            <List className="text-gray-700" fz="11px">
                <List.Item>Condition: {condition}</List.Item>
                <List.Item>Tenant: {tenant}</List.Item>
            </List>
        </div>
    );
};

const properties = [
    {
        address: "Plot 25, Andrews Avenue, Ikeja Lagos",
        status: "Occupied",
        condition: "Perfect",
        tenant: "Mark Odeh",
    },
    {
        address: "Plot 25, Andrews Avenue, Ikeja Lagos",
        status: "For Rent",
        condition: "Perfect",
        tenant: "Mark Odeh",
    },
    {
        address: "Plot 25, Andrews Avenue, Ikeja Lagos",
        status: "For Rent",
        condition: "Perfect",
        tenant: "Mark Odeh",
    },
    {
        address: "Plot 25, Andrews Avenue, Ikeja Lagos",
        status: "For Rent",
        condition: "Perfect",
        tenant: "Mark Odeh",
    },
    {
        address: "Plot 25, Andrews Avenue, Ikeja Lagos",
        status: "Occupied",
        condition: "Perfect",
        tenant: "Mark Odeh",
    },
    {
        address: "Plot 25, Andrews Avenue, Ikeja Lagos",
        status: "Occupied",
        condition: "Perfect",
        tenant: "Mark Odeh",
    },
    {
        address: "Plot 25, Andrews Avenue, Ikeja Lagos",
        status: "For Rent",
        condition: "Perfect",
        tenant: "Mark Odeh",
    },
];

function TenantRightBar() {
    return (
        <div
            className="p-3 space-y-4 h-fit" // Adjust width as needed
        >
            <Autocomplete
                placeholder="Search"
                leftSection={<IconSearch size={16} stroke={1.5} />}
                className="w-full"
            />

            <h3 className="font-medium text-md">Properties (45)</h3>
            <Divider />
            <div className="space-y-5">
                {properties.map((property, index) => (
                    <React.Fragment key={index}>
                        <PropertyItem {...property} />
                        <Divider size="sm" />
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
}

export default TenantRightBar;
