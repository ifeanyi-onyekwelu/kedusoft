import { MapPin } from "lucide-react";
import InteractivePropertyMap from "../../../maps/InteractivePropertyMap";

export default function PropertyLocationSection({
  property,
  nearbyProperties = [],
}: {
  property: Property;
  nearbyProperties?: Property[];
}) {
  const allProperties = [property, ...nearbyProperties];

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 space-y-4">
      <h3 className="text-lg font-semibold text-gray-800 mb-3">Location</h3>
      <div className="flex items-center text-gray-700">
        <MapPin size={20} className="mr-2 text-blue-600" />
        {property.address}, {property.city}, Nigeria
      </div>

      <div className="mt-4 w-full rounded-lg overflow-hidden relative">
        <InteractivePropertyMap
          properties={allProperties}
          selectedProperty={property}
          onPropertySelect={() => {}}
          onPropertyHover={() => {}}
          onMapBoundsChange={() => {}}
          zoom={15}
        />
      </div>
    </div>
  );
}
