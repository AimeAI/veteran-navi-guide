
export interface LmsConnection {
  id: string;
  user_id: string;
  lms_type: 'canvas' | 'moodle' | 'blackboard' | 'other';
  access_token: string;
  refresh_token?: string;
  instance_url: string;
  connected_at: string;
  expires_at?: string;
  is_active: boolean;
}

export interface LmsCourse {
  id: string;
  lms_connection_id: string;
  course_id: string;
  name: string;
  description?: string;
  start_date?: string;
  end_date?: string;
  enrollment_status: 'active' | 'completed' | 'invited';
  course_code?: string;
  image_url?: string;
}

export interface LmsCertification {
  id: string;
  user_id: string;
  name: string;
  issuer: string;
  issue_date: string;
  expiry_date?: string;
  credential_id?: string;
  credential_url?: string;
  description?: string;
  skills: string[];
}

export interface CanvasTokenResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
}
