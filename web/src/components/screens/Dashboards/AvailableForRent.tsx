import { useEffect, useState } from "react";
import PropertyCard from "../../shared/Dashboard/PropertyCard";
import { Card, Text, Group, Badge, Button } from "@mantine/core";
import { IconArrowRight, IconHeart, IconMapPin } from "@tabler/icons-react";
import { useLoading } from "../../../hooks/useLoading";
import { useNavigate } from "react-router-dom";

function AvailableForRent() {
  const [propertiesAvailable, setPropertiesAvailable] = useState<Property[]>(
    []
  );
  const { loading, withLoading } = useLoading();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProperties = async () => {
      try {
      } catch (error) {
        console.log("FETCH ALL PROPERTIES ERROR: ", error);
      }
    };

    fetchProperties();
  }, []);

  if (loading) {
    return (
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Text size="lg" fw={600} mb="md">
          Recommended Properties
        </Text>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="h-64 bg-gray-100 rounded-md animate-pulse"
            ></div>
          ))}
        </div>
      </Card>
    );
  }

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Group justify="space-between" mb="md">
        <div>
          <Text size="lg" fw={600}>
            Recommended Properties
          </Text>
          <Text size="sm" c="dimmed">
            Properties that match your preferences
          </Text>
        </div>
        <Button
          variant="filled"
          rightSection={<IconArrowRight size={16} />}
          onClick={() => navigate("/listings")}
        >
          View All
        </Button>
      </Group>

      {propertiesAvailable.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            {propertiesAvailable.map((property, index) => (
              <PropertyCard propertyData={property} key={index} />
            ))}
          </div>

          {/* Quick filters for better discovery */}
          <div className="border-t pt-4">
            <Text size="sm" fw={500} mb="xs">
              Quick Filters
            </Text>
            <Group gap="xs">
              <Badge
                variant="light"
                color="blue"
                className="cursor-pointer hover:bg-blue-100"
              >
                <IconMapPin size={12} className="mr-1" />
                Near Me
              </Badge>
              <Badge
                variant="light"
                color="green"
                className="cursor-pointer hover:bg-green-100"
              >
                Under ₦200k
              </Badge>
              <Badge
                variant="light"
                color="violet"
                className="cursor-pointer hover:bg-violet-100"
              >
                <IconHeart size={12} className="mr-1" />
                Saved
              </Badge>
              <Badge
                variant="light"
                color="orange"
                className="cursor-pointer hover:bg-orange-100"
              >
                New Listings
              </Badge>
            </Group>
          </div>
        </>
      ) : (
        <div className="text-center py-12">
          <Text size="lg" fw={500} mb="xs">
            No properties found
          </Text>
          <Text size="sm" c="dimmed" mb="lg">
            We couldn't find any properties matching your preferences right now.
          </Text>
          <Button component="a" href="/listings">
            Browse All Properties
          </Button>
        </div>
      )}
    </Card>
  );
}

export default AvailableForRent;
