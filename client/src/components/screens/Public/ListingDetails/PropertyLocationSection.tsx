import { IconMapPin } from "@tabler/icons-react";
import InteractivePropertyMap from "../../../maps/InteractivePropertyMap";
import { useState } from "react";

export default function PropertyLocationSection({
  property,
  nearbyProperties = [],
}: any) {
  const allProperties = [property, ...nearbyProperties];
  const [selectedProperty, setSelectedProperty] = useState(property);

  const handleMapBoundsChange = () => {
    // Bounds change handler - can be used for fetching properties within bounds
    // Currently a no-op since we're displaying static nearby properties
  };

  return (
    <section className="space-y-4">
      <h3 className="text-xl font-bold text-[#290665]">Location</h3>
      <div className="flex items-center gap-2 text-gray-600 mb-4">
        <IconMapPin size={18} color="#CF8205" />
        <span className="font-medium">
          {property.address}, {property.city}
        </span>
      </div>
      <div className="h-[400px] w-full rounded-xl overflow-hidden border border-gray-100 relative z-0">
        <InteractivePropertyMap
          properties={allProperties}
          selectedProperty={selectedProperty}
          onPropertySelect={setSelectedProperty}
          onMapBoundsChange={handleMapBoundsChange}
          zoom={15}
        />
      </div>
    </section>
  );
}
