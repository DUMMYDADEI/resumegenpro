-- Add applied column to job_recommendations table
ALTER TABLE public.job_recommendations
ADD COLUMN applied boolean NOT NULL DEFAULT false;

-- Add index for better performance when filtering applied jobs
CREATE INDEX idx_job_recommendations_applied ON public.job_recommendations(applied);