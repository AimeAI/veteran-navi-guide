
import { createClient } from "@supabase/supabase-js";

// The Supabase URL and anon key
const supabaseUrl = "https://ykperxxuwqolbfvhuqig.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlrcGVyeHh1d3FvbGJmdmh1cWlnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzgwODE3OTIsImV4cCI6MjA1MzY1Nzc5Mn0.-WvuM5Xtfo4Q2oFwWQrXiJm5UTxnUqupOPsDRQ2DDOU";

// Create the Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
