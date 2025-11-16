interface Tenant {
  id: string;
  name: string;
  email: string;
  phone: string;
  properties: {
    id: string;
    address: string;
    lease?: {
      start_date: string;
      end_date: string;
      status: "active" | "expired" | "terminated";
    };
  }[];
  payment_status: "paid" | "unpaid" | "overdue";
  last_payment_date?: string;
  created_at: string;
}

interface TenantDetails {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  avatar?: string;
  created_at: string;
  properties: {
    id: string;
    address: string;
    lease: {
      id: string;
      start_date: string;
      end_date: string;
      monthly_rent: number;
      security_deposit: number;
      status: "active" | "terminated" | "expired";
    };
  }[];
  payment_status: "paid" | "unpaid" | "overdue";
  last_payment?: {
    amount: number;
    date: string;
  };
}
