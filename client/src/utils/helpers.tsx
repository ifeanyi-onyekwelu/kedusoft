import React from "react";
import { notifications } from "@mantine/notifications";
import { IconX, IconCheck } from "@tabler/icons-react";
import { ReactNode } from "react";

function formatAmount(amount: number) {
  return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export const formatPrice = (price: number) => {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};

export const truncateText = (text: React.ReactNode, limit: number): string => {
  if (typeof text === "string") {
    const words = text.split("-");
    if (words.length > limit) {
      return words.slice(0, limit).join(" ") + "...";
    }
    return text;
  }

  // Convert React nodes to string if possible
  if (React.isValidElement(text)) {
    const stringText = React.Children.toArray(text).join("");
    return truncateText(stringText, limit); // Reuse for truncation
  }

  return ""; // Return an empty string if not string or React node
};

export const formatDate = (dateString: string | undefined): string => {
  if (!dateString) return "N/A";

  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

export function showNotification(
  type: "success" | "error",
  title: string,
  message: ReactNode
) {
  notifications.show({
    title,
    message,
    color: type === "error" ? "red" : "teal",
    icon: type === "error" ? <IconX size={18} /> : <IconCheck size={18} />,
    autoClose: 4000,
  });
}

export default formatAmount;
