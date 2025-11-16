import { Divider, Switch, Stack } from "@mantine/core";
import { useState } from "react";

interface NotificationItemProps {
    title: string;
    description: string;
    value: string;
    checked?: boolean
}

const NotificationItem = ({ title, description, value, checked = false }: NotificationItemProps) => {
    const [isChecked, setIsChecked] = useState(checked);
    const [loading, setLoading] = useState(false);

    const handleToggle = async () => {
        const newValue = !isChecked;
        setIsChecked(newValue); // Optimistically update UI
        setLoading(true);

        // Add the endpoint here
        setLoading(false);
    };

    return (
        <div className="flex justify-between items-center">
            <div>
                <h3>{title}</h3>
                <p className="text-gray-400 text-xs">{description}</p>
            </div>

            <Switch
                value={value}
                onLabel="On"
                offLabel="Off"
                checked={isChecked}
                onChange={handleToggle}
                disabled={loading}
            />
        </div>
    );
};


function NotificationsComponent() {
    const [loading, setLoading] = useState(false);

    const notifications = [
        {
            title: "All Notification",
            description: "Receive instant push notifications for all alerts and updates.",
            value: "all",
            checked: true,
        },
        {
            title: "Property alerts",
            description: "Receive Updates as EMAIL when new property has been uploaded.",
            value: "property__email",
            checked: true,
        },
        {
            title: "Property alerts",
            description: "Receive updates as SMS when new property has been uploaded.",
            value: "sms",
        },
        {
            title: "Screening Updates",
            description: "Stay informed with email updates on your Screening application.",
            value: "screening",
        },
        {
            title: "Payment updates",
            description: "Receive instant push notifications for all payment made.",
            value: "payment",
            checked: true,
        },
        {
            title: "Rental Management Notification",
            description: "Receive instant push notifications for all alerts and updates.",
            value: "rental",
            checked: true,
        },
    ];

    return (
        <div className="space-y-2 w-full md:w-3/4">
            <h2 className="text-xl font-medium">Notification</h2>
            <div className="bg-white p-10 rounded space-y-10">
                <p className="text-md text-gray-500">
                    Select your notification preferences
                </p>
                <Divider />

                <Stack mt="xs">
                    {notifications.map((item, idx) => (
                        <NotificationItem key={idx} {...item} />
                    ))}
                </Stack>
            </div>
        </div>
    );
}

export default NotificationsComponent;
