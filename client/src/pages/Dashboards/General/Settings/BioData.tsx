import { Button, TextInput, Stack, Divider, NativeSelect } from "@mantine/core";
import { DateInput, DateInputProps } from "@mantine/dates";
import { IconPencil, IconTrash, IconUpload } from "@tabler/icons-react";
import { useForm } from "@mantine/form";
import { useUser } from "../../../../context/UserContext";
import { useEffect, useState } from "react";
import { chunk, upperFirst } from "lodash";
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
    <div className="flex md:flex-row flex-col gap-5 justify-center items-center">
      {/* Image Preview Box */}
      <div className="relative group">
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
      </div>

      {/* Hidden File Input */}
      <input
        id="file-upload"
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        disabled={loading}
        style={{ display: "none" }}
      />

      {/* Upload Button */}
      <Button
        variant="filled"
        leftSection={<IconUpload size={16} />}
        color="#290665"
        size="sm"
        onClick={() => document.getElementById("file-upload")?.click()}
        loading={loading}
        disabled={loading}
      >
        {image ? "Change" : "Upload"}
      </Button>
    </div>
  );
};

function BioDataComponent() {
  const { updateUser, user } = useUser();
  const [loading, setLoading] = useState(false);
  const { updateProfile } = useProfileOperations();

  const form = useForm({
    initialValues: {
      firstName: "",
      middleName: "",
      lastName: "",
      marital_status: "",
      date_of_birth: "",
      occupation: "",
      employment_status: "",
      email: "",
      street: "",
      apartment_or_suite: "",
      city: "",
      country: "",
      phone_number: "",
    },
  });

  useEffect(() => {
    if (user) {
      form.setValues({
        firstName: user.firstName || "",
        middleName: user.middleName || "",
        lastName: user.lastName || "",
        marital_status: user.marital_status || "",
        date_of_birth: user.date_of_birth,
        occupation: user.occupation || "",
        employment_status: user.employment_status || "",
        email: user.email || "",
        street: user.street || "",
        apartment_or_suite: user.apartment_or_suite || "",
        city: user.city || "",
        country: user.country || "",
        phone_number: user.phone_number || "",
      });
    }
  }, [user]);

  if (!user) {
    return <LoadingSpinner />;
  }

  if (loading) return <LoadingSpinner />;

  type FormFields = keyof typeof form.values;

  const fields: {
    name: FormFields;
    label: string;
    placeholder: string;
    required?: boolean;
    readOnly?: boolean;
    type: string;
  }[] = [
    {
      name: "firstName",
      label: "First Name",
      placeholder: "Enter your first name",
      required: true,
      type: "text",
    },
    {
      name: "middleName",
      label: "Middle Name",
      placeholder: "Enter your middle name",
      type: "text",
    },
    {
      name: "lastName",
      label: "Last Name",
      placeholder: "Enter your last name",
      required: true,
      type: "text",
    },
    {
      name: "marital_status",
      label: "Marital Status",
      placeholder: "Enter your marital status",
      required: true,
      type: "select",
    },
    {
      name: "occupation",
      label: "Occupation",
      placeholder: "Enter your occupation",
      required: true,
      type: "text",
    },
    {
      name: "employment_status",
      label: "Employment Status",
      placeholder: "Enter your employment status",
      required: true,
      type: "select",
    },
    {
      name: "date_of_birth",
      label: "Date of Birth",
      placeholder: "Enter your date of birth",
      required: true,
      type: "date",
    },
    {
      name: "email",
      label: "Email Address",
      placeholder: "Enter your email address",
      required: true,
      type: "text",
      readOnly: true,
    },
    {
      name: "street",
      label: "Street Address",
      placeholder: "Enter your street address",
      required: true,
      type: "text",
    },
    {
      name: "apartment_or_suite",
      label: "Apt, Suite, etc (Optional)",
      placeholder: "Enter your apt, suite, etc (optional)",
      type: "text",
    },
    {
      name: "city",
      label: "City",
      placeholder: "Enter your city",
      required: true,
      type: "text",
    },
    {
      name: "country",
      label: "Country",
      placeholder: "Enter your country",
      required: true,
      type: "text",
    },
    {
      name: "phone_number",
      label: "Phone Number",
      placeholder: "Enter your phone number",
      required: true,
      type: "number",
    },
  ];

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      const response = await updateProfile(values);

      const { updated_user } = response;
      updateUser(updated_user);

      showNotification(
        "success",
        "Success!",
        "Profile information updated successfully"
      );
    } catch (err) {
      showNotification(
        "error",
        "Update Failed",
        "Failed to update profile information. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const dateParser: DateInputProps["dateParser"] = (input) => {
    return dayjs(input, "DD/MM/YYYY").toDate();
  };

  const handleUploadSuccess = (imageUrl: string) => {
    console.log("Image uploaded successfully:", imageUrl);
    updateUser({ ...user, profile_picture: imageUrl });
  };

  return (
    <div className="space-y-2 w-full md:w-3/4 py-6">
      <h2 className="text-xl font-medium">Biodata Information</h2>
      <div className="bg-white p-10 rounded space-y-10">
        <UploadImage
          firstName={user.firstName!}
          lastName={user.lastName!}
          profile_picture={user.profile_picture!}
          onUploadSuccess={handleUploadSuccess}
        />

        <form onSubmit={form.onSubmit(handleSubmit)} className="space-y-6">
          <h1 className="text-2xl font-semibold">Personal Details</h1>
          <Divider />

          <Stack>
            {chunk(fields, 3).map((fieldGroup, groupIndex) => (
              <div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
                key={groupIndex}
              >
                {fieldGroup.map((field) => (
                  <>
                    {field.type === "select" &&
                    field.name === "marital_status" ? (
                      <NativeSelect
                        label="Marital Status"
                        value={form.values[field.name]}
                        data={["Single", "Married", "Divorced", "Widowed"]}
                        style={{ flex: 1 }}
                        key={field.name} // <-- use field.name, not the value
                        onChange={(event) =>
                          form.setFieldValue(
                            field.name,
                            event.currentTarget.value
                          )
                        }
                      />
                    ) : field.type === "select" &&
                      field.name === "employment_status" ? (
                      <NativeSelect
                        label="Employment Status"
                        value={form.values[field.name]}
                        data={[
                          "Employed (Full-time)",
                          "Employed (Part-time)",
                          "Self-Employed",
                          "Unemployed",
                          "Student",
                          "Retired",
                          "Military Service",
                          "Freelancer/Contractor",
                        ]}
                        style={{ flex: 1 }}
                        key={field.name} // <-- use field.name, not the value
                        onChange={(event) =>
                          form.setFieldValue(
                            field.name,
                            event.currentTarget.value
                          )
                        }
                      />
                    ) : field.type === "number" ? (
                      <TextInput
                        key={field.name}
                        label={field.label}
                        placeholder={field.placeholder}
                        required={field.required}
                        value={form.values[field.name]}
                        onChange={(event) =>
                          form.setFieldValue(
                            field.name,
                            event.currentTarget.value
                          )
                        }
                        error={form.errors[field.name]}
                        radius="sm"
                        style={{ flex: 1 }}
                      />
                    ) : field.type === "date" ? (
                      <DateInput
                        dateParser={dateParser}
                        valueFormat="DD/MM/YYYY"
                        label={field.label}
                        value={
                          form.values[field.name]
                            ? dayjs(form.values[field.name]).toDate()
                            : null
                        }
                        placeholder={field.placeholder}
                        onChange={(value) =>
                          form.setFieldValue(
                            "date_of_birth",
                            value ? value?.toString() : ""
                          )
                        }
                        clearable
                        key={field.name}
                      />
                    ) : (
                      <TextInput
                        key={field.name}
                        label={field.label}
                        placeholder={field.placeholder}
                        required={field.required}
                        readOnly={field.readOnly}
                        value={form.values[field.name]}
                        onChange={(event) =>
                          form.setFieldValue(
                            field.name,
                            event.currentTarget.value
                          )
                        }
                        error={form.errors[field.name]}
                        radius="sm"
                        style={{ flex: 1 }}
                      />
                    )}
                  </>
                ))}
              </div>
            ))}
          </Stack>

          <Button type="submit" radius="md" color="#290665">
            {upperFirst("Save Changes")}
          </Button>
        </form>
      </div>
    </div>
  );
}

export default BioDataComponent;
