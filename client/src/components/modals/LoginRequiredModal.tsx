import { IconExclamationMark, IconXboxX } from "@tabler/icons-react";
import { Modal } from "@mantine/core";
import { Button } from "@mantine/core";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

interface LoginRequiredModalProps {
  opened: boolean;
  close: () => void;
}

function LoginRequiredModal({ opened, close }: LoginRequiredModalProps) {
  const navigate = useNavigate();

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
        <div className="flex items-center justify-center w-fit h-34 rounded-full p-3 border-primary border bg-hover">
          <div className="flex items-center justify-center w-full h-full rounded-full p-3 bg-primary">
            <IconExclamationMark className="text-white text-2xl" stroke={2} />
          </div>
        </div>
        <h2 className="text-3xl font-medium text-center">Sign up required!</h2>
        <p className="text-sm">Please signup on Homies to contact the owner</p>
        <div className="flex gap-2 items-center">
          <Button
            onClick={() => navigate("/auth?authAction=register&role=tenant")}
            variant="filled"
          >
            Sign up
          </Button>
          <Button
            onClick={() => navigate("/auth?authType=login")}
            variant="outline"
          >
            Login
          </Button>
        </div>
      </div>
    </Modal>
  );
}

export default LoginRequiredModal;
