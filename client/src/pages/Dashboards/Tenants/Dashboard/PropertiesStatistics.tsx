import { List, ThemeIcon } from "@mantine/core";
import { useEffect, useState } from "react";
import { getAllApplications } from "../../../../apis/tenantApi";

const ListItem = ({
    count,
    status,
    iconColor,
}: {
    count: number;
    status: string;
    iconColor: string;
}) => (
    <List.Item
        icon={<ThemeIcon color={iconColor} size={6} radius="xl"></ThemeIcon>}
    >
        {count} Properties <span className="text-green-700">(+5)</span>
        <br />
        <span className="text-[10px]">{status}</span>
    </List.Item>
);

interface PropertiesCountProps {
    propertiesCount: {
        viewed: number;
        rejected: number;
        pending: number;
        inProgress: number;
        accepted: number;
        sent: number;
    }
}

const PropertiesStatistics = ({ propertiesCount }: PropertiesCountProps) => {

    return (
        <div className="p-5 bg-white rounded-md shadow space-y-5 h-fit w-full">
            <h3 className="text-md">
                Properties
                <small className="text-[10px] text-gray-500">Month</small>
            </h3>
            <List spacing="xs" size="xs" center>
                <ListItem
                    count={propertiesCount.viewed}
                    status="Viewed"
                    iconColor="teal"
                />
                <ListItem
                    count={propertiesCount.rejected}
                    status="Rejected"
                    iconColor="red"
                />
                <ListItem
                    count={propertiesCount.pending}
                    status="Pending"
                    iconColor="yellow"
                />
                <ListItem
                    count={propertiesCount.inProgress}
                    status="In Progress"
                    iconColor="blue"
                />
                <ListItem
                    count={propertiesCount.accepted}
                    status="Accepted"
                    iconColor="green"
                />
                <ListItem
                    count={propertiesCount.sent}
                    status="Sent"
                    iconColor="purple"
                />
            </List>
        </div>
    );
};

export default PropertiesStatistics;
