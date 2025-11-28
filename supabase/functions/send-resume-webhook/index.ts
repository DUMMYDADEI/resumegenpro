import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log('Starting automated webhook send process...');

    // Get current time in HH:MM format
    const now = new Date();
    const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:00`;
    
    console.log(`Current time: ${currentTime}`);

    // Get all enabled automation settings that match the current time
    const { data: automationSettings, error: settingsError } = await supabase
      .from('automation_settings')
      .select('*')
      .eq('is_enabled', true)
      .eq('scheduled_time', currentTime);

    if (settingsError) {
      console.error('Error fetching automation settings:', settingsError);
      throw settingsError;
    }

    console.log(`Found ${automationSettings?.length || 0} enabled automations`);

    const results = [];

    for (const setting of automationSettings || []) {
      try {
        if (!setting.selected_resume_id) {
          console.log(`Skipping user ${setting.user_id}: No resume selected`);
          continue;
        }

        // Get resume details
        const { data: resume, error: resumeError } = await supabase
          .from('resumes')
          .select('*')
          .eq('id', setting.selected_resume_id)
          .single();

        if (resumeError || !resume) {
          console.error(`Error fetching resume for user ${setting.user_id}:`, resumeError);
          continue;
        }

        // Get WhatsApp number
        const { data: socialMedia } = await supabase
          .from('social_media_details')
          .select('whatsapp_number')
          .eq('user_id', setting.user_id)
          .single();

        // Get RSS feeds
        const { data: rssFeeds } = await supabase
          .from('rss_feeds')
          .select('feed_url')
          .eq('user_id', setting.user_id);

        // Download resume file
        const { data: fileData, error: downloadError } = await supabase
          .storage
          .from('resumes')
          .download(resume.file_path);

        if (downloadError || !fileData) {
          console.error(`Error downloading resume for user ${setting.user_id}:`, downloadError);
          continue;
        }

        // Prepare form data
        const formData = new FormData();
        formData.append('resume', new Blob([fileData], { type: 'application/pdf' }), resume.file_name);
        formData.append('whatsapp_number', socialMedia?.whatsapp_number || '');
        formData.append('rss_feeds', JSON.stringify(rssFeeds?.map(f => f.feed_url) || []));

        // Send to webhook
        const webhookResponse = await fetch('https://n8n.techverseinfo.tech/webhook/resume-intake', {
          method: 'POST',
          body: formData,
        });

        if (!webhookResponse.ok) {
          throw new Error(`Webhook failed: ${webhookResponse.statusText}`);
        }

        console.log(`Successfully sent resume for user ${setting.user_id}`);
        results.push({
          user_id: setting.user_id,
          status: 'success',
          message: 'Resume sent successfully'
        });

      } catch (error: any) {
        console.error(`Error processing automation for user ${setting.user_id}:`, error);
        results.push({
          user_id: setting.user_id,
          status: 'error',
          message: error.message
        });
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        processed: results.length,
        results 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error: any) {
    console.error('Error in send-resume-webhook function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});