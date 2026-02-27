import { Select, Button } from "@mantine/core";

function SearchFilter() {
    return (
        <div className="h-fit">
            <h3 className="font-bold text-3xl">Filter Search</h3>

            {/* Location */}
            <Select
                label="Location"
                placeholder="Select"
                data={["New York", "Los Angeles", "Chicago", "Houston"]}
                mt={7}
                size="sm"
            />

            {/* Category */}
            <Select
                label="Category"
                placeholder="Select"
                data={["Apartment", "House", "Condo", "Studio"]}
                mt={7}
                size="sm"
            />

            {/* Bedroom */}
            <Select
                label="Bedroom"
                placeholder="Select"
                data={["1", "2", "3", "4", "5+"]}
                mt={7}
                size="sm"
            />

            {/* Search Button */}
            <Button fullWidth color="indigo" mt="xl">
                Search
            </Button>
        </div>
    );
}

export default SearchFilter;
