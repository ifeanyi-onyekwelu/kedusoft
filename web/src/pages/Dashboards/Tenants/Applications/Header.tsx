import { Menu, rem } from "@mantine/core";
import {
    IconAdjustments,
    IconChevronDown,
    IconMessageCircle,
    IconSettings,
} from "@tabler/icons-react";

function ApplicationsHeader() {
    return (
        <div className="flex justify-between">
            <h3 className="text-lg">Applications</h3>

            <Menu shadow="md" width={200}>
                <Menu.Target>
                    <button className="bg-none flex items-center text-sm gap-1">
                        Filter <IconAdjustments size={18} />
                    </button>
                </Menu.Target>

                <Menu.Dropdown>
                    <Menu.Item
                        leftSection={
                            <IconSettings
                                style={{ width: rem(14), height: rem(14) }}
                            />
                        }
                    >
                        Settings
                    </Menu.Item>
                    <Menu.Item
                        leftSection={
                            <IconMessageCircle
                                style={{ width: rem(14), height: rem(14) }}
                            />
                        }
                    >
                        Messages
                    </Menu.Item>
                </Menu.Dropdown>
            </Menu>
        </div>
    );
}

export default ApplicationsHeader;
