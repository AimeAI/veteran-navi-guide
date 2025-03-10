
// Types for the mentorship service
export interface MentorshipProfile {
  id: string;
  user_id: string;
  is_mentor: boolean;
  years_experience?: number;
  max_mentees?: number;
  created_at: string;
  updated_at: string;
  industry?: string;
  mentor_bio?: string;
  mentoring_topics?: string[];
  availability?: string;
  user_name?: string;
  user_avatar?: string;
  military_branch?: string;
}

export interface MentorshipConnection {
  id: string;
  mentor_id: string;
  mentee_id: string;
  status: 'pending' | 'active' | 'declined' | 'completed';
  created_at: string;
  updated_at: string;
  mentor?: MentorshipProfile;
  mentee?: MentorshipProfile;
}

export interface MentorshipMessage {
  id: string;
  connection_id: string;
  sender_id: string;
  content: string;
  read: boolean;
  created_at: string;
  sender_name?: string;
  sender_avatar?: string;
}

export interface MentorshipMeeting {
  id: string;
  connection_id: string;
  title: string;
  description?: string;
  meeting_time: string;
  duration: number;
  meeting_link?: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  created_at: string;
  updated_at: string;
}
