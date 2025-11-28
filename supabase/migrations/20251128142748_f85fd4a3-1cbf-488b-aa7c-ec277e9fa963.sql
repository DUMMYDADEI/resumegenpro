-- Schedule automated resume webhook sending to run every minute
SELECT cron.schedule(
  'automated-resume-webhook-sender',
  '* * * * *',
  $$
  SELECT
    net.http_post(
        url:='https://gxkiapuogvreuhcsjwbi.supabase.co/functions/v1/send-resume-webhook',
        headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd4a2lhcHVvZ3ZyZXVoY3Nqd2JpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEzMjA2NzAsImV4cCI6MjA3Njg5NjY3MH0.a2AgAXKIUUKniCmK7M8qzy4iZb_YvoKX5A3KKGqg0LI"}'::jsonb
    ) as request_id;
  $$
);