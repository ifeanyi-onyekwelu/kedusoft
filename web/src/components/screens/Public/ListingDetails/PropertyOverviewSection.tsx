import { IconDoorEnter, IconBuilding, IconCalendar } from "@tabler/icons-react";

interface PropertyOverviewSectionProps {
  property: any;
}

export default function PropertyOverviewSection({
  property,
}: PropertyOverviewSectionProps) {
  const availableFrom = property.available_from
    ? new Date(property.available_from).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Flexible";

  const minLeaseDuration = property.minimum_lease_duration || "1 year";

  return (
    <section className="py-8">
      <h3 className="text-2xl font-bold text-[#008CDB] mb-6">
        About this property
      </h3>

      {/* Description */}
      <div className="mb-8 p-6 bg-white border border-gray-200 rounded-lg">
        <p className="text-gray-700 leading-relaxed text-base">
          {property.description ||
            "No detailed description available for this property. Contact the landlord to learn more about what this property has to offer."}
        </p>
      </div>

      {/* Key Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Available From */}
        <div className="p-5 bg-white border border-gray-200 rounded-lg hover:border-[#CF8205] transition-all">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 bg-[#008CDB]/10 rounded-lg">
              <IconCalendar size={20} color="#008CDB" stroke={2} />
            </div>
            <span className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
              Available From
            </span>
          </div>
          <p className="text-lg font-bold text-[#008CDB] pl-12">
            {availableFrom}
          </p>
        </div>

        {/* Minimum Lease */}
        <div className="p-5 bg-white border border-gray-200 rounded-lg hover:border-[#CF8205] transition-all">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 bg-[#008CDB]/10 rounded-lg">
              <IconDoorEnter size={20} color="#008CDB" stroke={2} />
            </div>
            <span className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
              Min. Lease
            </span>
          </div>
          <p className="text-lg font-bold text-[#008CDB] pl-12">
            {minLeaseDuration}
          </p>
        </div>

        {/* Status */}
        <div className="p-5 bg-white border border-gray-200 rounded-lg hover:border-[#CF8205] transition-all">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 bg-[#008CDB]/10 rounded-lg">
              <IconBuilding size={20} color="#008CDB" stroke={2} />
            </div>
            <span className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
              Property Status
            </span>
          </div>
          <p className="text-lg font-bold text-[#008CDB] pl-12 capitalize">
            {property.status || "Available"}
          </p>
        </div>
      </div>

      {/* Additional Details */}
      {property.water_source && (
        <div className="mt-8 p-6 bg-[#008CDB]/5 border border-[#008CDB]/20 rounded-lg">
          <h4 className="font-semibold text-[#008CDB] mb-3">
            Additional Details
          </h4>
          <ul className="space-y-2 text-gray-700">
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 bg-[#CF8205] rounded-full"></span>
              <span>
                Water Source:{" "}
                <strong className="text-gray-900">
                  {property.water_source}
                </strong>
              </span>
            </li>
            {property.has_water_heater && (
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-[#CF8205] rounded-full"></span>
                <span>Hot water system available</span>
              </li>
            )}
            {property.year_built && (
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-[#CF8205] rounded-full"></span>
                <span>
                  Year Built:{" "}
                  <strong className="text-gray-900">
                    {property.year_built}
                  </strong>
                </span>
              </li>
            )}
          </ul>
        </div>
      )}
    </section>
  );
}
