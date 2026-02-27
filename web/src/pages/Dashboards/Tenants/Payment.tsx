import {
  IconArrowLeft,
  IconCreditCard,
  IconLock,
  IconShieldCheck,
  IconBuildingBank,
} from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Checkbox,
  TextInput,
  Paper,
  Text,
  Divider,
  Stack,
  SimpleGrid,
  Box,
  Group,
  UnstyledButton,
  Badge,
} from "@mantine/core";
import { IMaskInput } from "react-imask";
import { useForm } from "@mantine/form";

const PaymentForm = () => {
  const form = useForm({
    initialValues: { cardNumber: "", expiryDate: "", cvv: "", name: "" },
    validate: {
      cardNumber: (value) =>
        value.replace(/\s/g, "").length === 16 ? null : "Invalid card number",
      expiryDate: (value) =>
        /^(0[1-9]|1[0-2])\/([0-9]{2})$/.test(value) ? null : "Use MM/YY",
      cvv: (value) => (/^\d{3,4}$/.test(value) ? null : "Invalid CVV"),
      name: (value) => (value.length < 2 ? "Name is required" : null),
    },
  });

  return (
    <form onSubmit={form.onSubmit((v) => console.log(v))} className="space-y-5">
      <Stack gap={4}>
        <Text size="sm" fw={600} c="gray.8">
          Cardholder Name
        </Text>
        <TextInput
          placeholder="Full Name"
          radius="md"
          size="md"
          {...form.getInputProps("name")}
        />
      </Stack>

      <Stack gap={4}>
        <Text size="sm" fw={600} c="gray.8">
          Card Number
        </Text>
        <TextInput
          component={IMaskInput}
          // @ts-ignore - OR use the casting below
          mask="0000 0000 0000 0000"
          placeholder="0000 0000 0000 0000"
          leftSection={<IconCreditCard size={18} stroke={1.5} />}
          radius="md"
          size="md"
          {...form.getInputProps("cardNumber")}
        />
      </Stack>

      <SimpleGrid cols={2} spacing="md">
        <Stack gap={4}>
          <Text size="sm" fw={600} c="gray.8">
            Expiry Date
          </Text>
          <TextInput
            component={IMaskInput}
            // @ts-ignore
            mask="00/00"
            placeholder="MM/YY"
            radius="md"
            size="md"
            {...form.getInputProps("expiryDate")}
          />
        </Stack>
        <Stack gap={4}>
          <Text size="sm" fw={600} c="gray.8">
            CVV
          </Text>
          <TextInput
            component={IMaskInput}
            // @ts-ignore
            mask="000"
            placeholder="123"
            radius="md"
            size="md"
            {...form.getInputProps("cvv")}
          />
        </Stack>
      </SimpleGrid>

      <Checkbox
        label="Securely save card for future use"
        mt="md"
        color="dark"
        radius="sm"
      />

      <Button
        type="submit"
        fullWidth
        size="lg"
        radius="md"
        color="dark"
        className="bg-gray-900 hover:bg-black transition-all mt-6"
        leftSection={<IconLock size={18} />}
      >
        Pay ₦500,000.00
      </Button>

      <Group justify="center" gap={8} opacity={0.5} mt="sm">
        <IconShieldCheck size={16} />
        <Text size="xs" fw={500}>
          Protected by industry-standard encryption
        </Text>
      </Group>
    </form>
  );
};

function Payment() {
  const navigate = useNavigate();
  const paymentLogos = [
    { src: "/images/mastercard.png", alt: "Mastercard" },
    { src: "/images/visa.png", alt: "Visa" },
    { src: "/images/apple-pay.png", alt: "Apple Pay" },
  ];

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Navigation Header */}
      <Box className="max-w-6xl mx-auto p-6">
        <UnstyledButton
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-500 hover:text-black transition-colors"
        >
          <IconArrowLeft size={18} />
          <Text size="sm" fw={500}>
            Back to listing
          </Text>
        </UnstyledButton>
      </Box>

      <main className="max-w-6xl mx-auto px-6 pb-20">
        <SimpleGrid cols={{ base: 1, md: 2 }} spacing={60}>
          {/* Left Side: Summary and Options */}
          <div className="space-y-8">
            <Box>
              <Badge color="blue" variant="light" mb="xs">
                Secure Checkout
              </Badge>
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                Review and Pay
              </h1>
              <Text c="dimmed" size="sm" mt={4}>
                Complete your transaction securely to finalize your booking.
              </Text>
            </Box>

            <Paper p="xl" radius="lg" withBorder className="bg-white">
              <Text fw={700} size="lg" mb="xl">
                Order Summary
              </Text>

              <Stack gap="md">
                <Group justify="space-between" align="flex-start" wrap="nowrap">
                  <Box>
                    <Text size="sm" fw={600}>
                      Luxury Penthouse #402
                    </Text>
                    <Text size="xs" c="dimmed">
                      Rental Deposit & Service Fee
                    </Text>
                  </Box>
                  <Text fw={600} size="sm">
                    ₦450,000.00
                  </Text>
                </Group>

                <Group justify="space-between">
                  <Text size="sm" c="dimmed">
                    Transaction Fee
                  </Text>
                  <Text fw={600} size="sm">
                    ₦50,000.00
                  </Text>
                </Group>

                <Divider my="sm" />

                <Group justify="space-between">
                  <Text fw={700} size="md">
                    Total Due
                  </Text>
                  <Text fw={800} size="xl" c="blue.8">
                    ₦500,000.00
                  </Text>
                </Group>
              </Stack>
            </Paper>

            <Box>
              <Text
                size="xs"
                fw={700}
                tt="uppercase"
                c="dimmed"
                mb="md"
                lts="1px"
              >
                Other Ways to Pay
              </Text>
              <UnstyledButton className="w-full p-4 border rounded-xl border-gray-200 hover:border-gray-900 transition-colors bg-white group">
                <Group justify="space-between">
                  <Group>
                    <Box className="p-2 bg-gray-100 rounded-lg group-hover:bg-gray-900 group-hover:text-white transition-colors">
                      <IconBuildingBank size={20} />
                    </Box>
                    <Text size="sm" fw={600}>
                      Bank Transfer
                    </Text>
                  </Group>
                  <Text size="xs" c="dimmed">
                    Instant Verification
                  </Text>
                </Group>
              </UnstyledButton>
            </Box>
          </div>

          {/* Right Side: The Form */}
          <Paper
            p={40}
            radius="lg"
            withBorder
            className="bg-white shadow-sm self-start"
          >
            <Group justify="space-between" mb={30}>
              <Text fw={700} size="lg">
                Payment Information
              </Text>
              <Group gap={8}>
                {paymentLogos.map((logo, idx) => (
                  <img
                    key={idx}
                    src={logo.src}
                    alt={logo.alt}
                    className="h-4 w-auto grayscale opacity-50"
                  />
                ))}
              </Group>
            </Group>

            <PaymentForm />

            <Divider my={30} label="Trusted Security" labelPosition="center" />

            <Text size="xs" c="dimmed" ta="center" className="leading-relaxed">
              By clicking "Pay Now", you agree to our terms of service and
              acknowledge that your payment is processed by a secure provider.
            </Text>
          </Paper>
        </SimpleGrid>
      </main>
    </div>
  );
}

export default Payment;
