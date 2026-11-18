export type EmployeeCard = {
  id: string;
  slug: string;
  full_name: string;
  job_title: string;
  email: string;
  office_phone: string | null;
  mobile_phone: string | null;
  office_address: string | null;
  linkedin_url: string | null;
  experience: string | null;
  specialties: string[];
  photo_url: string | null;
  photo_path: string | null;
  published: boolean;
  created_at: string;
  updated_at: string;
};

export type EmployeeCardInput = Pick<
  EmployeeCard,
  | "full_name"
  | "job_title"
  | "email"
  | "office_phone"
  | "mobile_phone"
  | "office_address"
  | "linkedin_url"
  | "experience"
  | "specialties"
>;
