
export interface LinkedInProfile {
  id: string;
  firstName: string;
  lastName: string;
  profilePicture?: string;
  headline?: string;
  email?: string;
}

export interface LinkedInSkill {
  name: string;
  proficiency?: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';
}

export interface LinkedInExperience {
  companyName: string;
  title: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  location?: string;
}

export interface LinkedInEducation {
  schoolName: string;
  degreeName?: string;
  fieldOfStudy?: string;
  startDate?: string;
  endDate?: string;
}

export interface LinkedInImportData {
  profile: LinkedInProfile;
  skills?: LinkedInSkill[];
  experience?: LinkedInExperience[];
  education?: LinkedInEducation[];
}

export interface IntegrationStatus {
  provider: 'linkedin' | 'indeed' | 'usajobs' | 'veteranorg';
  connected: boolean;
  lastImported?: Date;
  accessToken?: string;
  refreshToken?: string;
  expiresAt?: Date;
}
