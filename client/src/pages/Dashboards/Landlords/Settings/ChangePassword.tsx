import { Button, Stack, Divider, PasswordInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useState } from "react";
import { changePasswordApi } from "../../../../apis/profileApi";
import { useLoading } from "../../../../hooks/useLoading";
import { showNotification } from "../../../../utils/helpers";

function LandlordChangePassword() {
  const { loading, startLoading, stopLoading } = useLoading();

  const form = useForm({
    initialValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    validate: {
      newPassword: (val) => {
        const passwordRegex =
          /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{6,}$/;
        return passwordRegex.test(val)
          ? null
          : "Password must contain at least one uppercase letter, one lowercase letter, one number, and one symbol.";
      },
      confirmPassword: (val, values) =>
        val !== values.newPassword ? "Passwords do not match" : null,
    },
  });

  type FormFields = keyof typeof form.values;

  const fields: {
    name: FormFields;
    label: string;
    placeholder: string;
    required?: boolean;
  }[] = [
    {
      name: "currentPassword",
      label: "Current Password",
      placeholder: "Enter your current password",
      required: true,
    },
    {
      name: "newPassword",
      label: "New Password",
      placeholder: "Enter your new password",
    },
    {
      name: "confirmPassword",
      label: "Confirm Password",
      placeholder: "Re-enter your new password",
      required: true,
    },
  ];

  const handleSubmit = async (values: any) => {
    try {
      startLoading();
      const payload = {
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      };

      const response = await changePasswordApi(payload);

      showNotification("success", "Success!", response.message);
      form.reset();
    } catch (error: any) {
      showNotification(
        "error",
        "Error",
        error?.response?.data?.message || "Failed to change password"
      );
    } finally {
      stopLoading();
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">Security Settings</h2>

      <Stack gap="xl">
        <div>
          <h3 className="font-semibold mb-4 text-gray-800">Change Password</h3>
          <p className="text-sm text-gray-600 mb-6">
            Keep your property owner account secure by updating your password
            regularly.
          </p>

          <form onSubmit={form.onSubmit(handleSubmit)}>
            <Stack gap="md">
              {fields.map((field) => (
                <PasswordInput
                  key={field.name}
                  label={field.label}
                  placeholder={field.placeholder}
                  required={field.required}
                  {...form.getInputProps(field.name)}
                />
              ))}

              <Button type="submit" loading={loading} mt="md">
                Update Password
              </Button>
            </Stack>
          </form>
        </div>

        <Divider />

        <div>
          <h3 className="font-semibold mb-4 text-gray-800">Security Tips</h3>
          <ul className="text-sm text-gray-700 space-y-2">
            <li>
              • Use a strong, unique password combining letters, numbers and
              symbols
            </li>
            <li>• Change your password every 3-6 months</li>
            <li>• Avoid using personal information in your password</li>
            <li>• Never share your password with staff or other users</li>
          </ul>
        </div>
      </Stack>
    </div>
  );
}

export default LandlordChangePassword;
