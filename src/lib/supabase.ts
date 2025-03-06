
import { createClient } from '@supabase/supabase-js';
import { toast } from 'sonner';

// Get the environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Create a function that creates and returns the Supabase client
export const createSupabaseClient = () => {
  // Check if the necessary environment variables are present
  if (!supabaseUrl || !supabaseKey) {
    console.error('Supabase URL or Anon Key is missing. Check your environment variables.');
    // Return a dummy client that won't crash but will log errors
    return {
      auth: {
        signUp: () => {
          console.error('Supabase client not properly initialized');
          toast.error('API configuration issue', { 
            description: 'Please check the console for more details.' 
          });
          return Promise.resolve({ error: new Error('Supabase not initialized') });
        },
        signIn: () => {
          console.error('Supabase client not properly initialized');
          toast.error('API configuration issue', { 
            description: 'Please check the console for more details.' 
          });
          return Promise.resolve({ error: new Error('Supabase not initialized') });
        },
        exchangeCodeForSession: () => {
          console.error('Supabase client not properly initialized');
          return Promise.resolve({ error: new Error('Supabase not initialized') });
        },
        // Add other methods as needed
      },
      // Add other objects/methods as needed
    };
  }

  // Create and return the real Supabase client
  return createClient(supabaseUrl, supabaseKey);
};

// Export a default client instance for convenience
export const supabase = createSupabaseClient();
