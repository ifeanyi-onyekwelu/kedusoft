interface Application {
  application_id: string;
  property_id: string;
  property: Property;
  tenant_id: string;
  tenant: User;
  status:
    | "received" // Application submitted but not viewed
    | "under-review" // Landlord is reviewing application
    | "screening-requested" // Landlord requests screening (background/credit check)
    | "screening-in-progress" // Tenant has started screening process
    | "screening-completed" // Screening reports received
    | "approved" // Application approved but lease not signed
    | "lease-sent" // Lease documents sent to tenant
    | "lease-signed" // Lease fully executed
    | "rejected"; // Application denied at any stage
  created_at: string;
  updated_at: string;
  screening?: Screening;
  lease?: Lease;
}
