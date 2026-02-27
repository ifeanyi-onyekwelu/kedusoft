import { IconXboxX } from "@tabler/icons-react";
import { Button, Modal, TextInput } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import ApplicationSubmissionCompletedModal from "./ApplicationSubmissionCompletedModal";

interface Landlord {
  id: string;
  firstName: string;
  lastName: string;
  phone_number?: string;
  email?: string;
}

interface PropertyDetails {
  name: string;
  rent_amount: number;
  payment_structure: string;
  address: string;
  street: string;
  city: string;
  state: string;
  bedrooms: number;
}

interface ContactPropertyOwnerModalProps {
  opened: boolean;
  close: () => void;
  landlord?: Landlord;
  property?: PropertyDetails;
}

function ContactPropertyOwnerModal({
  opened,
  close,
  landlord,
  property,
}: ContactPropertyOwnerModalProps) {
  const [
    applicationSubmittedModalOpened,
    {
      open: openApplicationSubmittedModal,
      close: closeApplicationSubmittedModal,
    },
  ] = useDisclosure(false);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    try {
      openApplicationSubmittedModal();
      close();
      console.log("Application submitted successfully");
      // Here you would typically make an API call to submit the contact request
    } catch (error) {
      console.error(error);
    }
  };

  const formatPrice = () => {
    if (!property) return "N/A";
    return `N${property.rent_amount.toLocaleString()} ${
      property.payment_structure === "yearly"
        ? "per annum"
        : property.payment_structure === "monthly"
        ? "per month"
        : ""
    }`;
  };

  const formatAddress = () => {
    if (!property) return "N/A";
    return `${property.street}, ${property.city}, ${property.state}`;
  };

  return (
    <>
      <Modal
        opened={opened}
        onClose={close}
        closeButtonProps={{
          icon: <IconXboxX size={20} stroke={1.5} />,
        }}
        title={
          <h1 className="text-2xl font-semibold">
            Contact {landlord?.firstName || "Owner"}
          </h1>
        }
        centered
      >
        <div className="flex items-start flex-col space-y-3 pb-10">
          <p className="text-xs">
            Note: Please kindly confirm the apartment details and take note of
            the details before submission. Track your application via the
            Application ID on your dashboard.
          </p>

          <h2 className="text-sm text-start">Owner Contact</h2>
          <div className="space-y-2 w-full">
            <TextInput
              description="Name"
              value={
                landlord ? `${landlord.firstName} ${landlord.lastName}` : "N/A"
              }
              readOnly
            />
            <TextInput
              description="Phone"
              value={landlord?.phone_number || "N/A"}
              readOnly
            />
            <TextInput
              description="Email"
              value={landlord?.email || "N/A"}
              readOnly
            />
          </div>

          <h2 className="text-sm text-start mt-4">Apartment Details</h2>
          <form className="space-y-3 w-full" onSubmit={handleSubmit}>
            <TextInput
              description="Apartment Type"
              value={
                property
                  ? `${property.bedrooms} Bedroom ${property.name}`
                  : "N/A"
              }
              readOnly
            />
            <TextInput description="Price" value={formatPrice()} readOnly />
            <TextInput description="Address" value={formatAddress()} readOnly />
            <Button color="#008CDB" type="submit" fullWidth>
              Submit Contact Request
            </Button>
          </form>
        </div>
      </Modal>

      <ApplicationSubmissionCompletedModal
        opened={applicationSubmittedModalOpened}
        close={closeApplicationSubmittedModal}
      />
    </>
  );
}

export default ContactPropertyOwnerModal;
