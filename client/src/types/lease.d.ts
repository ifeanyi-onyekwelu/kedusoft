export interface Lease {
  id: string;
  start_date: string;
  end_date: string;
  monthly_rent: number;
  security_deposit: number;
  status: "pending-signature" | "active" | "terminated";
  landlord_signed_at?: string;
  tenant_signed_at?: string;
}
