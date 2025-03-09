
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ApplicationUpdate {
  application_id: string;
  old_status: string;
  new_status: string;
}

serve(async (req) => {
  // CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Handle notifications that haven't been processed yet
  try {
    // Connect to Supabase
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Get unprocessed notifications
    const { data: notifications, error: fetchError } = await supabaseClient
      .from("application_notifications")
      .select(`
        id,
        application_id,
        old_status,
        new_status,
        created_at,
        applications(
          id,
          job_id,
          applicant_id,
          jobs(title, company),
          profiles:applicant_id(full_name)
        )
      `)
      .eq("processed", false)
      .limit(10);

    if (fetchError) {
      throw fetchError;
    }

    // Process each notification
    for (const notification of notifications) {
      try {
        const application = notification.applications;
        if (!application) continue;

        const jobTitle = application.jobs?.title || "a job";
        const company = application.jobs?.company || "a company";
        const applicantName = application.profiles?.full_name || "Applicant";
        const applicantId = application.applicant_id;
        const newStatus = notification.new_status;
        
        // In a real implementation, you would:
        // 1. Send an email using a service like Resend, SendGrid, etc.
        // 2. Create an in-app notification
        
        // For now, just log what would be sent
        console.log(`
          Notification to ${applicantName} (${applicantId}):
          Your application for ${jobTitle} at ${company} has been updated.
          Status: ${notification.old_status} -> ${notification.new_status}
        `);
        
        // Mark notification as processed
        await supabaseClient
          .from("application_notifications")
          .update({ processed: true })
          .eq("id", notification.id);
      } catch (err) {
        console.error("Error processing notification:", err);
      }
    }

    return new Response(
      JSON.stringify({ 
        processed: notifications.length,
        message: "Notifications processed" 
      }),
      { 
        headers: { 
          "Content-Type": "application/json",
          ...corsHeaders 
        } 
      }
    );
  } catch (err: any) {
    console.error("Error in application status notification function:", err);
    
    return new Response(
      JSON.stringify({ error: err.message }),
      { 
        status: 500, 
        headers: { 
          "Content-Type": "application/json",
          ...corsHeaders 
        } 
      }
    );
  }
});
