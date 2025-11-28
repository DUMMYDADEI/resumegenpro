-- Ensure the update_updated_at function exists
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create social_media_details table
CREATE TABLE public.social_media_details (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  whatsapp_number TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.social_media_details ENABLE ROW LEVEL SECURITY;

-- Create policies for social_media_details
CREATE POLICY "Users can view their own social media details"
ON public.social_media_details
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own social media details"
ON public.social_media_details
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own social media details"
ON public.social_media_details
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own social media details"
ON public.social_media_details
FOR DELETE
USING (auth.uid() = user_id);

-- Create rss_feeds table
CREATE TABLE public.rss_feeds (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  feed_url TEXT NOT NULL,
  feed_name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.rss_feeds ENABLE ROW LEVEL SECURITY;

-- Create policies for rss_feeds
CREATE POLICY "Users can view their own rss feeds"
ON public.rss_feeds
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own rss feeds"
ON public.rss_feeds
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own rss feeds"
ON public.rss_feeds
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own rss feeds"
ON public.rss_feeds
FOR DELETE
USING (auth.uid() = user_id);

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_social_media_details_updated_at
BEFORE UPDATE ON public.social_media_details
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_rss_feeds_updated_at
BEFORE UPDATE ON public.rss_feeds
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();