import { Autocomplete, OptionsDropdown, Select } from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";

function TenantTableMenu() {
    return (
        <div className="bg-white rounded-sm p-2">
            <div className="flex items-center justify-between">
                <Autocomplete
                    className="w-1/2"
                    placeholder="Search for tenants"
                    leftSection={<IconSearch size={16} />}
                />
                <Select
                    placeholder="Sort"
                    data={["Alphabetical", "Descending", "Vue", "Svelte"]}
                />
            </div>
        </div>
    );
}

export default TenantTableMenu;
