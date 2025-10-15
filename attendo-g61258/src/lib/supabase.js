// Import the Supabase client library
import { createClient } from '@supabase/supabase-js'

/**
 * Creates and exports the Supabase client instance
 * Configured with environment variables and PKCE auth flow
 * @type {import('@supabase/supabase-js').SupabaseClient}
 */
export const supabase = createClient(
  // Supabase project URL from environment variables
  import.meta.env.VITE_SUPABASE_URL,

  // Supabase public (anon) key from environment variables
  import.meta.env.VITE_SUPABASE_KEY,

  // Additional client configuration
  {
    auth: {
      // Use PKCE (Proof Key for Code Exchange) flow for authentication
      // This is the recommended flow for client-side applications
      flowType: 'pkce'
    }
  }
)
