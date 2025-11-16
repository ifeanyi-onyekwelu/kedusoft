interface User {
  email: string;
  firstName?: string;
  lastName?: string;
  middleName?: string;
  marital_status?: string;
  apartment_or_suite?: string;
  city?: string;
  country?: string;
  state?: string;
  date_of_birth?: any;
  identity_card?: string;
  national_id_card?: string;
  occupation?: string;
  employment_status?: string;
  phone_number?: string;
  profile_picture?: string;
  street?: string;
  joined_at?: string;
  is_onboarded?: boolean;
  is_email_verified?: boolean;
  is_verified?: boolean;
  isPendingVerification?: boolean; // Add this field
  is_active?: string;
  is_deleted?: string;
  role?: string;
}
