interface Application {
  application_id: string;
  property_id: string;
  property: Property;
  landlord: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone_number?: string;
  };
  // Missing fields from your SQLAlchemy model
  employment_status: "employed" | "student" | "self-employed" | "unemployed";
  number_of_occupants: string;
  move_in_date: string | null;
  message: string;

  status:
      | "received"
      | "under-review"
      | "tour_scheduled"
      | "accepted"
      | "rejected";

  viewed: "viewed" | "not yet";
  date_applied: string;
  date_viewed: string | null;
  result: "approved" | "rejected" | "received";
}