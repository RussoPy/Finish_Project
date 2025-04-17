// models/jobModel.ts

export interface Job {
    id: string;
    business_id: string;
    title: string;
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
  }
  