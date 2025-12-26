import { Button, TextInput, Stack, Divider, NativeSelect } from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { IconPencil, IconUpload } from "@tabler/icons-react";
import { useForm } from "@mantine/form";
import { useUser } from "../../../../context/UserContext";
import { useEffect, useState } from "react";
import { useProfileOperations } from "../../../../apis/profileApi";
import dayjs from "dayjs";
import { LoadingSpinner } from "../../../../components/LoadingSpinner";
import { ErrorState } from "../../../../components/ErrorState";
import { showNotification } from "../../../../utils/helpers";

const UploadImage = ({
  firstName,
  lastName,
  profile_picture,
  onUploadSuccess,
}: {
  firstName: string;
  lastName: string;
  profile_picture: string;
  onUploadSuccess?: (imageUrl: string) => void;
}) => {
  const [image, setImage] = useState<string | null>(profile_picture || null);
  const [loading, setLoading] = useState(false);
  const { uploadProfileImage } = useProfileOperations();

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setLoading(true);

    try {
      // 1. First show preview
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);

      // 2. Upload to backend
      const formData = new FormData();
      formData.append("profile_picture", file);

      const response = await uploadProfileImage(formData);
      const imageUrl = response.updated_user.profile_picture;

      setImage(imageUrl);
      onUploadSuccess?.(imageUrl);

      showNotification(
        "success",
        "Success!",
        "Profile picture updated successfully"
      );
    } catch (error) {
      console.error("Upload failed:", error);
      setImage(null);
      showNotification(
        "error",
        "Upload Failed",
        "Failed to update profile picture. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-5 justify-center md:justify-start items-center md:items-start">
      {/* Image Preview Box */}
      <div className="relative group shrink-0">
        <div className="p-1 rounded-full w-32 h-32 border-2 border-badge relative overflow-hidden">
          <div
            className="rounded-full w-full h-full bg-cover bg-center"
            style={{
              backgroundImage: `url(${
                image ||
                `https://placehold.co/600x400?text=${firstName?.charAt(
                  0
                )}+${lastName?.charAt(0)}`
              })`,
            }}
          ></div>

          {/* Edit Icon Overlay */}
          {!loading && (
            <div
              className="absolute inset-0 bg-black bg-opacity-30 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer"
              onClick={() => document.getElementById("file-upload")?.click()}
            >
              <IconPencil size={20} color="white" />
            </div>
          )}
        </div>

        {/* Hidden File Input */}
        <input
          id="file-upload"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageUpload}
          disabled={loading}
        />
      </div>

      {/* Upload Info */}
      <div className="flex flex-col gap-3 justify-center md:justify-start w-full md:w-auto">
        <h4 className="font-semibold text-gray-800 text-center md:text-left">
          {firstName} {lastName}
        </h4>
        <p className="text-sm text-gray-500 text-center md:text-left">
          Supported formats: JPG, PNG, GIF. Max size 5MB
        </p>
        <Button
          variant="light"
          size="sm"
          leftSection={<IconUpload size={16} />}
          onClick={() => document.getElementById("file-upload")?.click()}
          loading={loading}
          fullWidth={false}
        >
          Upload Photo
        </Button>
      </div>
    </div>
  );
};

function AdminBioData() {
  const { user, refreshUser } = useUser();
  const { updateProfile } = useProfileOperations();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone_number: "",
      date_of_birth: new Date(),
    },
    validate: {
      firstName: (val) =>
        !val ? "First name is required" : val.length < 2 ? "Too short" : null,
      lastName: (val) =>
        !val ? "Last name is required" : val.length < 2 ? "Too short" : null,
      email: (val) =>
        !val
          ? "Email is required"
          : /^\S+@\S+$/.test(val)
          ? null
          : "Invalid email",
      phone_number: (val) => (!val ? "Phone is required" : null),
    },
  });

  const handleSubmit = async (values: any) => {
    try {
      setIsLoading(true);
      const payload = {
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        phone_number: values.phone_number,
        date_of_birth: dayjs(values.date_of_birth).format("YYYY-MM-DD"),
      };

      const response = await updateProfile(payload);
      await refreshUser();

      showNotification("success", "Success!", "Profile updated successfully");
    } catch (err) {
      showNotification(
        "error",
        "Error",
        "Failed to update profile. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      form.setValues({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        phone_number: user.phone_number || "",
        date_of_birth: user.date_of_birth
          ? new Date(user.date_of_birth)
          : new Date(),
      });
    }
  }, [user]);

  if (!user) return <LoadingSpinner loading={true} />;

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">General Settings</h2>

      <Stack gap="xl">
        {/* Profile Picture Section */}
        <div>
          <h3 className="font-semibold mb-4 text-gray-800">Profile Picture</h3>
          <UploadImage
            firstName={user.firstName || ""}
            lastName={user.lastName || ""}
            profile_picture={user.profile_picture || ""}
            onUploadSuccess={() => refreshUser()}
          />
          <Divider my="xl" />
        </div>

        {/* Personal Information */}
        <div>
          <h3 className="font-semibold mb-4 text-gray-800">
            Personal Information
          </h3>
          <form onSubmit={form.onSubmit(handleSubmit)}>
            <Stack gap="md">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <TextInput
                  label="First Name"
                  placeholder="Enter your first name"
                  {...form.getInputProps("firstName")}
                />
                <TextInput
                  label="Last Name"
                  placeholder="Enter your last name"
                  {...form.getInputProps("lastName")}
                />
              </div>

              <TextInput
                label="Email Address"
                placeholder="your.email@example.com"
                {...form.getInputProps("email")}
              />

              <TextInput
                label="Phone Number"
                placeholder="+1 (555) 000-0000"
                {...form.getInputProps("phone_number")}
              />

              <DateInput
                label="Date of Birth"
                placeholder="Select your date of birth"
                {...form.getInputProps("date_of_birth")}
              />

              <Button type="submit" loading={isLoading}>
                Save Changes
              </Button>
            </Stack>
          </form>
        </div>
      </Stack>
    </div>
  );
}

export default AdminBioData;
