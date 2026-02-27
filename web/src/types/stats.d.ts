interface ApplicationStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  screening: number;
}

interface TenantStats {
  total: number;
  active: number;
  paid: number;
  unpaid: number;
  overdue: number;
}
