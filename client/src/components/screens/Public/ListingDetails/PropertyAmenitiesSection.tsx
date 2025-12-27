import { IconCircleCheckFilled, IconAlertCircle } from "@tabler/icons-react";

interface PropertyAmenitiesSectionProps {
  property: any;
}

export default function PropertyAmenitiesSection({
  property,
}: PropertyAmenitiesSectionProps) {
  const amenitiesArray = property?.amenities
    ? Object.entries(property.amenities).filter(([_, v]) => v === true)
    : [];

  if (amenitiesArray.length === 0) {
    return (
      <section className="py-8">
        <h3 className="text-xl font-bold text-[#290665] mb-6">
          Amenities & Facilities
        </h3>
        <div className="p-6 bg-gray-50 border border-gray-200 rounded-lg flex items-center gap-3">
          <IconAlertCircle size={20} color="#CF8205" />
          <p className="text-gray-600 font-medium">
            No amenities listed for this property
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-8">
      <h3 className="text-xl font-bold text-[#290665] mb-6">
        Amenities & Facilities
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {amenitiesArray.map(([key], idx) => (
          <div
            key={idx}
            className="flex items-center gap-4 p-4 bg-white border border-gray-200 rounded-lg hover:border-[#CF8205] hover:bg-[#CF8205]/5 transition-all duration-200"
          >
            <div className="flex-shrink-0 p-2 bg-[#290665]/10 rounded-lg">
              <IconCircleCheckFilled size={20} color="#290665" />
            </div>
            <span className="text-gray-700 capitalize font-medium">
              {key.replace(/_/g, " ")}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
