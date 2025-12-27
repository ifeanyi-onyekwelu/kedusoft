import useAuth from "../../../hooks/useAuth";
import LoginRequiredModal from "../../modals/LoginRequiredModal";
import { useDisclosure } from "@mantine/hooks";
import ContactPropertyOwnerModal from "../../modals/ContactPropertyOwnerModal";
import { formatDate } from "../../../utils/helpers";

interface Landlord {
  email: string;
  firstName: string;
  id: string;
  joined_at: string;
  lastName: string;
  phone_number: string;
  profile_picture?: string | undefined;
  last_active: string;
}

interface ListedBySectionProps {
  landlord?: Landlord;
  property?: Property;
}

const ListedBySection = ({ landlord, property }: ListedBySectionProps) => {
  const { isAuthenticated } = useAuth();
  const [
    loginRequiredModalOpened,
    { open: openLoginRequiredModal, close: closeLoginRequiredModal },
  ] = useDisclosure(false);
  const [
    contactOwnerOpened,
    { open: openContactOwnerModal, close: closeContactOwnerModal },
  ] = useDisclosure(false);

  const handleContactOwner = () => {
    if (isAuthenticated) {
      openContactOwnerModal();
    } else {
      openLoginRequiredModal();
    }
  };

  if (!landlord) {
    return (
      <div className="text-sm text-gray-500">Landlord info unavailable</div>
    );
  }

  return (
    <div className="space-y-4 border-t border-gray-200 pt-4">
      <h3 className="text-sm text-gray-700 font-medium">Listed By</h3>

      <div className="flex items-center gap-4">
        <img
          src={
            landlord.profile_picture ||
            "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg"
          }
          alt={`${landlord.firstName} ${landlord.lastName}`}
          className="w-28 h-28 rounded-xl border border-gray-300 object-cover"
        />
        <div>
          <h1 className="text-base font-semibold text-gray-800 capitalize">
            {`${landlord.firstName} ${landlord.lastName}`}
          </h1>
          {landlord.joined_at && (
            <p className="text-xs text-gray-600">
              Registered {formatDate(landlord.joined_at)}
            </p>
          )}
          {landlord.last_active && (
            <p className="text-xs text-gray-600">
              Last active {formatDate(landlord.last_active)}
            </p>
          )}
          <button
            onClick={handleContactOwner}
            className="mt-3 px-4 py-2 text-sm rounded-md bg-[#008CDB] text-white hover:opacity-90 transition"
          >
            Contact Owner
          </button>
        </div>
      </div>

      <LoginRequiredModal
        opened={loginRequiredModalOpened}
        close={closeLoginRequiredModal}
      />

      <ContactPropertyOwnerModal
        opened={contactOwnerOpened}
        close={closeContactOwnerModal}
        landlord={landlord}
        property={property}
      />
    </div>
  );
};

export default ListedBySection;
