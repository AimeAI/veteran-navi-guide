// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://ykperxxuwqolbfvhuqig.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlrcGVyeHh1d3FvbGJmdmh1cWlnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzgwODE3OTIsImV4cCI6MjA1MzY1Nzc5Mn0.-WvuM5Xtfo4Q2oFwWQrXiJm5UTxnUqupOPsDRQ2DDOU";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);