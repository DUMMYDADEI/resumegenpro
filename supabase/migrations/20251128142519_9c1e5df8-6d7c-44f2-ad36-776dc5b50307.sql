-- Create automation settings table
CREATE TABLE public.automation_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  is_enabled BOOLEAN NOT NULL DEFAULT false,
  scheduled_time TIME NOT NULL DEFAULT '09:00:00',
  selected_resume_id UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT unique_user_automation UNIQUE (user_id)
);

-- Enable RLS
ALTER TABLE public.automation_settings ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own automation settings"
ON public.automation_settings
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own automation settings"
ON public.automation_settings
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own automation settings"
ON public.automation_settings
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own automation settings"
ON public.automation_settings
FOR DELETE
USING (auth.uid() = user_id);

-- Add trigger for updated_at
CREATE TRIGGER update_automation_settings_updated_at
BEFORE UPDATE ON public.automation_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();