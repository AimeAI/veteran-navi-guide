
CREATE OR REPLACE FUNCTION increment_review_helpful_count(review_id UUID)
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
