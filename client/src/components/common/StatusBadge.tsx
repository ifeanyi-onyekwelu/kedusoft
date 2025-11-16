type StatusVariant = "lease" | "payment" | "verification" | "screening";

type StatusValues = {
  lease: "active" | "expired" | "terminated" | "none" | "available" | "rented";
  payment: "paid" | "unpaid" | "overdue";
  verification: "verified" | "pending" | "rejected";
  screening: "passed" | "failed" | "pending" | "not_started";
};

type StatusColorMap = {
  [V in StatusVariant]: {
    [S in StatusValues[V]]: string;
  };
};

interface StatusBadgeProps<V extends StatusVariant> {
  status: StatusValues[V];
  variant: V;
}

const statusColors: StatusColorMap = {
  lease: {
    active: "bg-green-100 text-green-800",
    expired: "bg-yellow-100 text-yellow-800",
    terminated: "bg-red-100 text-red-800",
    available: "bg-blue-100 text-blue-800",
    rented: "bg-purple-100 text-purple-800",
    none: "bg-gray-100 text-gray-800",
  },
  payment: {
    paid: "bg-green-100 text-green-800",
    unpaid: "bg-yellow-100 text-yellow-800",
    overdue: "bg-red-100 text-red-800",
  },
  verification: {
    verified: "bg-green-100 text-green-800",
    pending: "bg-yellow-100 text-yellow-800",
    rejected: "bg-red-100 text-red-800",
  },
  screening: {
    passed: "bg-green-100 text-green-800",
    failed: "bg-red-100 text-red-800",
    pending: "bg-yellow-100 text-yellow-800",
    not_started: "bg-gray-100 text-gray-800",
  },
};

const StatusBadge = <V extends StatusVariant>({
  status,
  variant,
}: StatusBadgeProps<V>) => {
  // Safely get the color class
  const colorClass =
    statusColors[variant]?.[status] || "bg-gray-100 text-gray-800";

  return (
    <span
      className={`px-2 py-1 rounded-full text-xs font-medium ${colorClass}`}
    >
      {status.charAt(0).toUpperCase() + status.slice(1).replace(/_/g, " ")}
    </span>
  );
};

export default StatusBadge;
