
-- Function to increment the helpful count for reviews
CREATE OR REPLACE FUNCTION public.increment_review_helpful_count(review_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.employer_reviews
  SET helpful_count = helpful_count + 1
  WHERE id = review_id;
END;
$$;

-- Create the review_reports table for storing reported reviews
CREATE TABLE IF NOT EXISTS public.review_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  review_id UUID NOT NULL REFERENCES public.employer_reviews(id),
  reported_by UUID REFERENCES auth.users(id),
  reason TEXT,
  reported_at TIMESTAMPTZ DEFAULT now(),
  status TEXT DEFAULT 'pending'
);

-- Add RLS to review_reports
ALTER TABLE public.review_reports ENABLE ROW LEVEL SECURITY;

-- Allow users to report reviews
CREATE POLICY "Users can report reviews"
  ON public.review_reports
  FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- Admins can view reports
CREATE POLICY "Admins can view reports"
  ON public.review_reports
  FOR SELECT
  USING (get_user_role(auth.uid()) = 'admin');
