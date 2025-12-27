import {
  IconBed,
  IconBath,
  IconMaximize,
  IconParking,
  IconChefHat,
  IconParkingCircle,
} from "@tabler/icons-react";

interface PropertyFeaturesProps {
  property: any;
}

export default function PropertyFeatures({ property }: PropertyFeaturesProps) {
  const features = [
    {
      label: `${property.bedrooms || 0}`,
      sublabel: "Bedroom" + (property.bedrooms !== 1 ? "s" : ""),
      icon: <IconBed size={22} color="#008CDB" stroke={2} />,
      value: property.bedrooms,
    },
    {
      label: `${property.bathrooms || 0}`,
      sublabel: "Bathroom" + (property.bathrooms !== 1 ? "s" : ""),
      icon: <IconBath size={22} color="#008CDB" stroke={2} />,
      value: property.bathrooms,
    },
    {
      label: property.size_sqft
        ? `${property.size_sqft.toLocaleString()}`
        : "N/A",
      sublabel: "Square Feet",
      icon: <IconMaximize size={22} color="#008CDB" stroke={2} />,
      value: property.size_sqft,
    },
    {
      label: `${property.parking_spaces || 0}`,
      sublabel: "Parking Space" + (property.parking_spaces !== 1 ? "s" : ""),
      icon: <IconParking size={22} color="#008CDB" stroke={2} />,
      value: property.parking_spaces,
    },
    {
      label: `${property.kitchens || 0}`,
      sublabel: "Kitchen" + (property.kitchens !== 1 ? "s" : ""),
      icon: <IconChefHat size={22} color="#008CDB" stroke={2} />,
      value: property.kitchens,
    },
    {
      label: property.furnished ? "Yes" : "No",
      sublabel: "Furnished",
      icon: <IconParkingCircle size={22} color="#008CDB" stroke={2} />,
      value: property.furnished,
    },
  ];

  return (
    <div className="py-8 border-b border-gray-200">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {features.map((feature, idx) => (
          <div
            key={idx}
            className="p-4 border border-gray-200 rounded-xl hover:border-[#CF8205] hover:bg-[#CF8205]/5 transition-all duration-200"
          >
            <div className="flex flex-col items-center text-center gap-2">
              <div className="p-3 bg-[#008CDB]/5 rounded-lg">
                {feature.icon}
              </div>
              <div>
                <div className="text-lg font-bold text-[#008CDB]">
                  {feature.label}
                </div>
                <div className="text-xs text-gray-600 font-medium">
                  {feature.sublabel}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
