import SearchFilter from "../../components/SearchFilter";
import { Property } from "../../components/Property";
import { SimpleGrid, Pagination, Group } from "@mantine/core";

function SearchResults() {
  return (
    <div className="bg-[#F9F9F9] flex max-w-window mx-auto">
      <div className="flex-2 md:block hidden fixed overflow-y-auto p-3 h-screen bg-white">
        <SearchFilter />
      </div>

      <div className="p-2 flex-1 space-y-6 ml-[250px]">
        <SimpleGrid cols={{ base: 2, sm: 3 }}>
          <Property />
          <Property />
          <Property />
          <Property />
          <Property />
          <Property />
        </SimpleGrid>

        <Pagination.Root total={10} autoContrast color="#008CDB">
          <Group gap={5} justify="center">
            <Pagination.First />
            <Pagination.Previous />
            <Pagination.Items />
            <Pagination.Next />
            <Pagination.Last />
          </Group>
        </Pagination.Root>
      </div>
    </div>
  );
}

export default SearchResults;
