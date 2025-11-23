import {
  Button,
  Divider,
  Stack,
  Image,
  Text,
  Card,
  Group,
} from "@mantine/core";
import {
  IconCheck,
  IconClock,
  IconCloudUpload,
  IconX,
} from "@tabler/icons-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { uploadIdentityDocsApi } from "../../../../apis/profileApi";
import { useLoading } from "../../../../hooks/useLoading";
import { toast } from "react-hot-toast";
import { useUser } from "../../../../context/UserContext";

// Component for when documents are pending verification
const PendingVerification = () => (
  <Card shadow="sm" padding="lg" radius="md" withBorder>
    <Group justify="center" mb="md">
      <IconClock size={40} color="orange" />
    </Group>
    <Text fw={500} size="lg" mb="sm">
      Verification in Progress
    </Text>
    <Text color="dimmed" size="sm">
      Your documents have been received and are currently being reviewed. We'll
      notify you once the verification is complete.
    </Text>
  </Card>
);

// Component for when user is already verified
const AlreadyVerified = () => (
  <Card shadow="sm" padding="lg" radius="md" withBorder>
    <Group justify="center" mb="md">
      <IconCheck size={40} color="green" />
    </Group>
    <Text ta="center" fw={500} size="lg" mb="sm">
      Verification Complete
    </Text>
    <Text ta="center" color="dimmed" size="sm">
      Your account has been successfully verified. No further action is
      required.
    </Text>
  </Card>
);

const FileUploadBox = ({
  title,
  id,
  file,
  onFileChange,
  onRemove,
}: {
  title: string;
  id: string;
  file: File | null;
  onFileChange: (file: File) => void;
  onRemove: () => void;
}) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileChange(e.target.files[0]);
    }
  };

  return (
    <div className="w-full p-6 border-dashed border-2 border-gray-300 rounded-md flex flex-col items-center">
      {file ? (
        <div className="relative w-full">
          <button
            onClick={onRemove}
            className="absolute -top-3 -right-3 bg-red-500 rounded-full p-1"
          >
            <IconX size={16} color="white" />
          </button>
          {file.type.startsWith("image/") ? (
            <Image
              src={URL.createObjectURL(file)}
              alt="Preview"
              className="max-h-60 object-contain"
            />
          ) : (
            <div className="p-4 bg-gray-100 rounded text-center">
              <Text size="sm">{file.name}</Text>
              <Text size="xs" color="dimmed">
                {Math.round(file.size / 1024)} KB
              </Text>
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col items-center text-center">
          <IconCloudUpload size={60} stroke={1} />
          <p className="mt-3 text-xs mb-2">
            {title}{" "}
            <label
              htmlFor={id}
              className="text-primary font-semibold underline cursor-pointer"
            >
              Browse
            </label>
          </p>
          <input
            type="file"
            id={id}
            className="hidden"
            accept=".jpeg,.jpg,.png,.pdf,.doc,.docx,.ppt,.pptx"
            onChange={handleFileChange}
          />
          <p className="text-xs text-gray-500 mt-1">
            Supported formats: JPEG, PNG, PDF, Word, PPT
          </p>
        </div>
      )}
    </div>
  );
};

const FileUploadSection = () => {
  const [nationalIdFile, setNationalIdFile] = useState<File | null>(null);
  const [identityFile, setIdentityFile] = useState<File | null>(null);
  const { loading, withLoading } = useLoading();
  const { user, updateUser } = useUser();

  const handleVerify = async () => {
    if (!nationalIdFile || !identityFile) {
      toast.error("Please upload both documents", { icon: <IconX /> });
      return;
    }

    try {
      // Convert files to base64 or FormData as needed by your API
      const formData = new FormData();
      formData.append("national_id_card", nationalIdFile);
      formData.append("identity_card", identityFile);

      const response = await withLoading(
        uploadIdentityDocsApi({
          identity_card: identityFile, // Adjust based on your API requirements
          national_id_card: nationalIdFile, // You might need to convert to base64
        })
      );

      updateUser(response.updated_user);
      toast.success("Documents submitted successfully!");
    } catch (error) {
      console.error("Verification failed:", error);
      toast.error("Verification failed. Please try again.");
    }
  };

  console.log("User in Verification Component:", user);

  // If user is already verified, show verified component
  if (user?.is_verified) {
    return <AlreadyVerified />;
  }

  // If verification is pending, show pending component
  if (user?.isPendingVerification) {
    return <PendingVerification />;
  }

  return (
    <div className="flex items-center justify-center bg-gray-100 w-full py-12">
      <div className="bg-white space-y-6 p-10 rounded-lg shadow-sm">
        <div className="flex md:flex-row flex-col gap-5">
          {/* National ID Upload Box */}
          <FileUploadBox
            title="Upload your National ID card"
            id="national-id-upload"
            file={nationalIdFile}
            onFileChange={setNationalIdFile}
            onRemove={() => setNationalIdFile(null)}
          />

          {/* Identity Document Upload Box */}
          <FileUploadBox
            title="Upload your Passport/Driver's License"
            id="identity-doc-upload"
            file={identityFile}
            onFileChange={setIdentityFile}
            onRemove={() => setIdentityFile(null)}
          />
        </div>

        {/* Verify Button */}
        <div className="flex justify-center">
          <Button
            color="#290665"
            loading={loading}
            onClick={handleVerify}
            disabled={!nationalIdFile || !identityFile}
          >
            Verify Now
          </Button>
        </div>

        <Divider />

        <div className="text-center">
          <p className="text-sm text-gray-600">
            Or verify using your mobile phone{" "}
            <Link to="qr" className="text-primary font-semibold underline">
              Scan QR Code
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

function VerificationComponent() {
  return (
    <div className="space-y-2 w-full md:w-3/4">
      <h2 className="text-xl font-medium">Verification</h2>
      <div className="bg-white p-10 rounded space-y-10">
        <p className="text-md text-gray-500">
          Upload your documents for verification in order to peform more actions
        </p>
        <Divider />

        <Stack>
          <FileUploadSection />
        </Stack>
      </div>
    </div>
  );
}

export default VerificationComponent;
