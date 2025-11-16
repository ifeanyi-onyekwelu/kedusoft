import { Bed, Bath, Square } from "lucide-react";

export default function PropertyFeatures({ property }: { property: Property }) {
  const features = [
    { label: `${property.bedrooms} Bedrooms`, icon: <Bed size={18} /> },
    { label: `${property.bathrooms} Bathrooms`, icon: <Bath size={18} /> },
    { label: `${property.size_sqft} sqft`, icon: <Square size={18} /> },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
      <h3 className="text-lg font-semibold mb-4">Property Features</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {features.map((f, idx) => (
          <div key={idx} className="flex items-center space-x-2 text-gray-700">
            {f.icon}
            <span>{f.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
