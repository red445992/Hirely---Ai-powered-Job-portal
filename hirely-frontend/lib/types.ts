export interface Job {
  id: number;
  title: string;
  date?: string;
  location: string;
  applicants_count?: number;
  is_active: boolean;
  company: string;
  description: string;
  category: string;
  level: string;
  salary: string;
}
