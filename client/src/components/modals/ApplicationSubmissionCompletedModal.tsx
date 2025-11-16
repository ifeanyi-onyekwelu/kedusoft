import { Modal } from "@mantine/core";
import { IconXboxX } from "@tabler/icons-react";
import { Button } from "../Button";

interface ApplicationSubmissionCompletedModalProps {
  opened: boolean;
  close: () => void;
}

function ApplicationSubmissionCompletedModal({
  opened,
  close,
}: ApplicationSubmissionCompletedModalProps) {
  return (
    <Modal
      opened={opened}
      onClose={close}
      closeButtonProps={{
        icon: <IconXboxX size={20} stroke={1.5} />,
      }}
      centered
    >
      <div className="flex items-center flex-col space-y-3 pb-10">
        <h2 className="text-3xl">Submission Successful</h2>
        <p className="text-sm text-center">
          Your Application is successful. Kindly await a response from the
          owner.
        </p>
        <Button label="Proceed to Dashboard" to="/tenants" radius="lg" />
      </div>
    </Modal>
  );
}

export default ApplicationSubmissionCompletedModal;
