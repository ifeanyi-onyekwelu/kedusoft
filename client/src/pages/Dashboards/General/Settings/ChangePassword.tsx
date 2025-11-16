import { Button, Stack, Divider, PasswordInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useState } from "react";
import { changePasswordApi } from "../../../../apis/profileApi";
import { upperFirst } from "lodash";
import { useLoading } from "../../../../hooks/useLoading";
import { showNotification } from "../../../../utils/helpers";

function ChangePasswordComponent() {
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
      placeholder: "Enter your current password",
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
      await changePasswordApi(values);

      showNotification("success", "Success", "Password changed successfully!");
      form.reset();
    } catch (err: any) {
      showNotification(
        "error",
        "Error",
        err.response.data.message || "Error changing password!"
      );
    } finally {
      stopLoading();
    }
  };

  return (
    <div className="space-y-2 w-full md:w-3/4">
      <h2 className="text-xl font-medium">Change your password</h2>
      <div className="bg-white p-10 rounded space-y-10">
        <form onSubmit={form.onSubmit(handleSubmit)} className="space-y-6">
          <p className="text-md text-gray-500">
            Enter current password to make changes
          </p>
          <Divider />

          <Stack>
            {fields.map((field) => (
              <PasswordInput
                key={field.name}
                label={field.label}
                placeholder={field.placeholder}
                required={field.required}
                value={form.values[field.name]}
                onChange={(event) =>
                  form.setFieldValue(field.name, event.currentTarget.value)
                }
                error={form.errors[field.name]}
                radius="sm"
                style={{ flex: 1 }}
              />
            ))}
          </Stack>

          <Button type="submit" radius="md" color="#290665" loading={loading}>
            Change password
          </Button>
        </form>
      </div>
    </div>
  );
}

export default ChangePasswordComponent;
