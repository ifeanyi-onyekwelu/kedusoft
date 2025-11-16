import { IconArrowLeft, IconCreditCard } from "@tabler/icons-react";
import { Link } from "react-router-dom";
import { Button, Checkbox, TextInput } from "@mantine/core";
import { IMaskInput } from "react-imask";
import { useForm } from "@mantine/form";

const PaymentForm = () => {
  const form = useForm({
    initialValues: {
      cardNumber: "",
      expiryDate: "",
      cvv: "",
    },
    validate: {
      cardNumber: (value) =>
        /^\d{16}$/.test(value) ? null : "Card number must be 16 digits",
      expiryDate: (value) =>
        /^(0[1-9]|1[0-2])\/?([0-9]{4}|[0-9]{2})$/.test(value)
          ? null
          : "Expiry date must be in MM/YY format",
      cvv: (value) =>
        /^\d{3,4}$/.test(value) ? null : "CVV must be 3 or 4 digits",
    },
  });
  return (
    <form
      onSubmit={form.onSubmit(() => console.log("Form Submitted!!!"))}
      className="w-full space-y-3"
    >
      <h2 className="text-md font-medium">Card Details</h2>
      <TextInput
        placeholder="1234 5678 9012 3456"
        required
        component={IMaskInput}
        value={form.values.cardNumber}
        {...{ mask: "0000 0000 0000 0000" }}
        onChange={(event) =>
          form.setFieldValue("cardNumber", event.currentTarget.value)
        }
        error={form.errors.cardNumber}
        radius="sm"
        style={{ flex: 1 }}
        leftSection={<IconCreditCard />}
      />

      <TextInput
        placeholder="MM/YY"
        required
        component={IMaskInput}
        value={form.values.expiryDate}
        {...{ mask: "00/00" }}
        onChange={(event) =>
          form.setFieldValue("expiryDate", event.currentTarget.value)
        }
        error={form.errors.expiryDate}
        radius="sm"
        style={{ flex: 1 }}
      />

      <TextInput
        placeholder="123"
        required
        component={IMaskInput}
        value={form.values.cvv}
        {...{ mask: "000" }}
        onChange={(event) =>
          form.setFieldValue("cvv", event.currentTarget.value)
        }
        error={form.errors.cvv}
        radius="sm"
        style={{ flex: 1 }}
      />

      <Checkbox label="Save my card information" />

      <Button
        type="submit"
        color="#4B0665"
        radius="sm"
        style={{ flex: 1 }}
        display="block"
        mx="auto"
        mt={40}
        size="md"
      >
        Pay 500,000 Now
      </Button>
    </form>
  );
};

function Payment() {
  const payment = [
    "/images/mastercard.png",
    "/images/visa.png",
    "/images/apple-pay.png",
  ];
  return (
    <div className="relative flex items-center justify-center flex-col">
      <IconArrowLeft size={20} stroke={1} className="absolute top-0 left-0" />

      <div className=" w-full">
        <div className="flex md:flex-row flex-col h-screen w-full mt-14">
          <div className="md:w-1/2 w-full bg-[#562269] h-full py-20 px-10 flex flex-col items-start justify-between">
            <h1 className="text-xl font-semibold text-center text-white">
              How would you like to pay?
            </h1>

            <div className="flex items-center space-x-2 w-full">
              {payment.map((pay) => (
                <img src={pay} width={20} />
              ))}
            </div>

            <img src="/images/card.png" alt="Atm Card" className="w-full" />

            <Link
              to=""
              className="rounded-md py-3 bg-[#4B0665] text-xs text-white font-semibold px-10 hover:bg-primary duration-300 block mx-auto"
            >
              Pay with Bank Transfer
            </Link>
          </div>
          <div className="md:w-1/2 w-full h-full flex items-center justify-center p-5 bg-white">
            <PaymentForm />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Payment;
