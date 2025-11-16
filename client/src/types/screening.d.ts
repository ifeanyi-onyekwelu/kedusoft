interface Screening {
  id: string;
  status: "pending-payment" | "in-progress" | "completed" | "failed";
  screening_date?: string;
  bio_data: Record<string, any>;
}
