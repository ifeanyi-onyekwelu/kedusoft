export default function PropertyOverviewSection({
  property,
}: {
  property: Property;
}) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-800 mb-3">Overview</h3>
      <p className="text-gray-700 leading-relaxed">
        {property.description || "No description provided for this property."}
      </p>
    </div>
  );
}
