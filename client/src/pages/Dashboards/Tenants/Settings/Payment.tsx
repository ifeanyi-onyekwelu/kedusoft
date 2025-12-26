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

function TenantPayment() {
  const { loading, startLoading, stopLoading } = useLoading();

  const form = useForm({
    initialValues: {
      cardName: "",
      cardNumber: "",
      expiryMonth: "",
      expiryYear: "",
      cvv: "",
    },
    validate: {
      cardName: (val) => (!val ? "Cardholder name is required" : null),
      cardNumber: (val) =>
        !val
          ? "Card number is required"
          : val.length < 13
          ? "Invalid card number"
          : null,
      cvv: (val) =>
        !val ? "CVV is required" : val.length < 3 ? "Invalid CVV" : null,
    },
  });

  const handleSubmit = async (values: any) => {
    try {
      startLoading();
      // TODO: Implement actual API call to save payment information
      await new Promise((resolve) => setTimeout(resolve, 1000));

      showNotification(
        "success",
        "Success!",
        "Payment method added successfully"
      );
      form.reset();
    } catch (error) {
      showNotification("error", "Error", "Failed to add payment method");
    } finally {
      stopLoading();
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">Payment Methods</h2>

      <Stack gap="xl">
        <div>
          <h3 className="font-semibold mb-4 text-gray-800">
            Add Payment Method
          </h3>
          <p className="text-sm text-gray-600 mb-6">
            Add a payment method to easily pay rent and other fees.
          </p>

          <form onSubmit={form.onSubmit(handleSubmit)}>
            <Stack gap="md">
              <TextInput
                label="Cardholder Name"
                placeholder="Name on card"
                {...form.getInputProps("cardName")}
              />

              <TextInput
                label="Card Number"
                placeholder="1234 5678 9101 1121"
                {...form.getInputProps("cardNumber")}
              />

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <Select
                  label="Month"
                  placeholder="MM"
                  data={[
                    "01",
                    "02",
                    "03",
                    "04",
                    "05",
                    "06",
                    "07",
                    "08",
                    "09",
                    "10",
                    "11",
                    "12",
                  ]}
                  {...form.getInputProps("expiryMonth")}
                />
                <Select
                  label="Year"
                  placeholder="YY"
                  data={["24", "25", "26", "27", "28", "29", "30"]}
                  {...form.getInputProps("expiryYear")}
                />
                <TextInput
                  label="CVV"
                  placeholder="123"
                  {...form.getInputProps("cvv")}
                />
              </div>

              <Button type="submit" loading={loading}>
                Add Card
              </Button>
            </Stack>
          </form>
        </div>

        <Divider />

        <div>
          <h3 className="font-semibold mb-4 text-gray-800">Payment Security</h3>
          <p className="text-sm text-gray-700 mb-3">
            Your payment information is encrypted and securely stored.
          </p>
          <ul className="text-sm text-gray-700 space-y-2">
            <li>• We use industry-standard PCI DSS compliance</li>
            <li>• Your card data is never stored on our servers</li>
            <li>• All transactions are secure and encrypted</li>
          </ul>
        </div>
      </Stack>
    </div>
  );
}

export default TenantPayment;
