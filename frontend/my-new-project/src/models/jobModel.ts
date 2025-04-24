// models/jobModel.ts

export interface Job {
    id: string;
    business_id: string;
    title: string;
    industry: string;
    description: string;
    tags: string[];
    experience_required: string;
    skills_needed: string[];
    location_lat: number;
    location_lng: number;
    salary_min: number;
    salary_max: number;
    is_active: boolean;
    applicants: string[];
    matches: string[];
    rejected: { [userId: string]: boolean };
    created_at: any; // Firestore Timestamp or string
    business_name?: string; // Optional field for business name
    logo_url?: string; // Optional field for business logo URL
    minimum_age?: number; // Optional field for minimum age requirement
    employee_distance?: number; // Optional field for distance from the business location
    availablity?: string; // Optional field for availability (e.g., "full-time", "part-time")
    imageUrls?: string[];
  }
  