
-- This file contains the SQL schema for the badges system in Supabase
-- You would run these commands in your Supabase SQL Editor

-- Create a table to store badge definitions
CREATE TABLE public.badge_definitions (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL,
  level INTEGER DEFAULT 1
);

-- Create a table to store user badges
CREATE TABLE public.veteran_badges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  badge_id TEXT NOT NULL REFERENCES public.badge_definitions(id),
  earned_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
  
  -- Enforce unique badge per user
  UNIQUE(user_id, badge_id)
);

-- Add RLS policies for badge_definitions
ALTER TABLE public.badge_definitions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Badge definitions are viewable by everyone" 
  ON public.badge_definitions FOR SELECT 
  USING (true);

-- Add RLS policies for veteran_badges
ALTER TABLE public.veteran_badges ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own badges" 
  ON public.veteran_badges FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Only admins can insert badges" 
  ON public.veteran_badges FOR INSERT 
  USING (
    -- Checks if the user has an admin role in another table
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Create a function to award badges automatically based on criteria
CREATE OR REPLACE FUNCTION public.check_and_award_badges()
RETURNS TRIGGER AS $$
BEGIN
  -- Example: Award "Profile Complete" badge when profile is completed
  IF TG_TABLE_NAME = 'profiles' AND NEW.name IS NOT NULL AND NEW.email IS NOT NULL 
     AND NEW.phone IS NOT NULL AND NEW.location IS NOT NULL AND NEW.bio IS NOT NULL 
     AND NEW.military_branch IS NOT NULL AND NEW.years_of_service IS NOT NULL 
     AND NEW.rank IS NOT NULL AND NEW.profile_picture IS NOT NULL THEN
    
    INSERT INTO public.veteran_badges (user_id, badge_id)
    VALUES (NEW.id, 'profile-complete')
    ON CONFLICT (user_id, badge_id) DO NOTHING;
  END IF;
  
  -- Example: Award "First Application" badge when first job application is submitted
  IF TG_TABLE_NAME = 'job_applications' THEN
    -- Count existing applications for this user
    IF (SELECT COUNT(*) FROM public.job_applications WHERE user_id = NEW.user_id) = 1 THEN
      INSERT INTO public.veteran_badges (user_id, badge_id)
      VALUES (NEW.user_id, 'first-application')
      ON CONFLICT (user_id, badge_id) DO NOTHING;
    END IF;
    
    -- Check for "Job Seeker" badge (5+ applications)
    IF (SELECT COUNT(*) FROM public.job_applications WHERE user_id = NEW.user_id) = 5 THEN
      INSERT INTO public.veteran_badges (user_id, badge_id)
      VALUES (NEW.user_id, 'job-seeker')
      ON CONFLICT (user_id, badge_id) DO NOTHING;
    END IF;
  END IF;
  
  -- More badge triggers can be added here for other actions
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create triggers to check for badges on relevant actions
CREATE TRIGGER check_profile_complete_badge
  AFTER INSERT OR UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.check_and_award_badges();
  
CREATE TRIGGER check_application_badges
  AFTER INSERT ON public.job_applications
  FOR EACH ROW
  EXECUTE FUNCTION public.check_and_award_badges();

-- Insert the predefined badges
INSERT INTO public.badge_definitions (id, type, name, description, icon, level) VALUES
  ('profile-complete', 'profile-complete', 'Profile Complete', 'Completed your veteran profile with all necessary information', 'badge', 1),
  ('first-application', 'first-application', 'First Application', 'Submitted your first job application', 'briefcase', 1),
  ('community-contributor', 'community-contributor', 'Community Contributor', 'Made your first post in the veteran community forums', 'star', 1),
  ('interview-ace', 'interview-ace', 'Interview Ace', 'Completed interview preparation resources', 'trophy', 1),
  ('resume-master', 'resume-master', 'Resume Master', 'Uploaded your resume and completed the resume review process', 'medal', 1),
  ('job-seeker', 'job-seeker', 'Job Seeker', 'Applied to 5 or more jobs', 'check', 1),
  ('network-builder', 'network-builder', 'Network Builder', 'Connected with 3 or more veterans or employers', 'award', 1),
  ('skill-certified', 'skill-certified', 'Skill Certified', 'Added verified military skills to your profile', 'book', 1);
