
export interface Experience {
  id: string;
  company: string;
  position: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  location: string;
  startDate: string;
  endDate: string;
}

export interface Skill {
  id: string;
  name: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
}

export interface Language {
  id: string;
  name: string;
  level: string; // Ex: C1, B2, Fluente
  percentage: number; // 0-100 para a barra de progresso
}

export interface Course {
  id: string;
  name: string;
  institution: string;
  year: string;
}

export interface ResumeData {
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    website: string;
    linkedin: string;
    jobTitle: string;
    photoUrl?: string;
  };
  summary: string;
  experiences: Experience[];
  education: Education[];
  skills: Skill[];
  languages: Language[];
  courses: Course[];
}

export type TemplateId = 'teal_sidebar' | 'executive_red' | 'corporate_gray' | 'minimal_red_line' | 'modern_blue';
