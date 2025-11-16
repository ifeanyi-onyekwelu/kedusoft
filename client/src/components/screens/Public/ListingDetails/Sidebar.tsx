import { User, Phone, Home } from "lucide-react";

export default function Sidebar({
  property,
  openContactOwnerModal,
}: {
  property: Property;
  openContactOwnerModal: () => void;
}) {
  return (
    <aside className="w-full space-y-6">
      {/* Listed By */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Listed By</h3>
        <div className="flex items-center space-x-3">
          <User size={20} className="text-gray-600" />
          <div>
            <p className="font-medium text-gray-800">
              {`${property.landlord?.firstName} ${property.landlord?.lastName}` ||
                "Unknown"}
            </p>
            <p className="text-sm text-gray-600">Property Owner</p>
          </div>
        </div>
        <button
          onClick={openContactOwnerModal}
          className="mt-4 w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Contact Owner
        </button>
      </div>

      {/* Similar Properties */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">
          Similar Properties
        </h3>
        <p className="text-gray-600 text-sm">Coming soon...</p>
      </div>
    </aside>
  );
}
