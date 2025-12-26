import {
  Button,
  TextInput,
  Stack,
  Divider,
  NumberInput,
  Select,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useState } from "react";
import { useLoading } from "../../../../hooks/useLoading";
import { showNotification } from "../../../../utils/helpers";

function LandlordPayments() {
  const { loading, startLoading, stopLoading } = useLoading();

  const form = useForm({
    initialValues: {
      bankName: "",
      accountNumber: "",
      accountHolder: "",
      routingNumber: "",
      accountType: "savings",
    },
    validate: {
      bankName: (val) => (!val ? "Bank name is required" : null),
      accountNumber: (val) => (!val ? "Account number is required" : null),
      accountHolder: (val) => (!val ? "Account holder name is required" : null),
    },
  });

  const handleSubmit = async (values: any) => {
    try {
      startLoading();
      // TODO: Implement actual API call to save payment information
      await new Promise((resolve) => setTimeout(resolve, 1000));

      showNotification("success", "Success!", "Payment information updated");
      form.reset();
    } catch (error) {
      showNotification(
        "error",
        "Error",
        "Failed to update payment information"
      );
    } finally {
      stopLoading();
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">Payment Settings</h2>

      <Stack gap="xl">
        <div>
          <h3 className="font-semibold mb-4 text-gray-800">
            Bank Account Information
          </h3>
          <p className="text-sm text-gray-600 mb-6">
            Add your bank account to receive rental payments and payouts.
          </p>

          <form onSubmit={form.onSubmit(handleSubmit)}>
            <Stack gap="md">
              <TextInput
                label="Bank Name"
                placeholder="Enter your bank name"
                {...form.getInputProps("bankName")}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <TextInput
                  label="Account Number"
                  placeholder="Enter account number"
                  {...form.getInputProps("accountNumber")}
                />
                <TextInput
                  label="Routing Number"
                  placeholder="Enter routing number"
                  {...form.getInputProps("routingNumber")}
                />
              </div>

              <TextInput
                label="Account Holder Name"
                placeholder="Name on the account"
                {...form.getInputProps("accountHolder")}
              />

              <Select
                label="Account Type"
                placeholder="Select account type"
                data={[
                  { value: "savings", label: "Savings" },
                  { value: "checking", label: "Checking" },
                  { value: "money_market", label: "Money Market" },
                ]}
                {...form.getInputProps("accountType")}
              />

              <Button type="submit" loading={loading}>
                Save Bank Account
              </Button>
            </Stack>
          </form>
        </div>

        <Divider />

        <div>
          <h3 className="font-semibold mb-4 text-gray-800">Payment History</h3>
          <p className="text-sm text-gray-600">
            View your recent transactions and payment history.
          </p>
          <Button variant="light" mt="md">
            View Payment History
          </Button>
        </div>
      </Stack>
    </div>
  );
}

export default LandlordPayments;
