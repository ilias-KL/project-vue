// Import the configured Supabase client instance
import { supabase } from '@/lib/supabase.js'

/**
 * Fetches all sessions from the database
 * @returns {Promise<Array>} Array of session objects
 * @throws {Error} If the Supabase query fails
 */
export async function fetchSessions() {
  // Execute Supabase query to get all sessions
  const { data, error } = await supabase
    .from('session')  // Select the 'session' table
    .select('*')      // Select all columns

  if (error) {
    console.error('Error fetching sessions:', error)
    throw error // Propagate the error to the caller
  }

  return data // Return the array of sessions
}

/**
 * Creates a new session in the database
 * @param {string} label - The name/label of the new session
 * @returns {Promise<Object>} The created session data
 * @throws {Error} If the Supabase insertion fails
 */
export async function addSession(label) {
  // Execute Supabase query to insert a new session
  const { data, error } = await supabase
    .from('session')  // Select the 'session' table
    .insert([{        // Insert a new row with:
      label           // The session name/label
    }])

  if (error) {
    console.error('Error adding session:', error)
    throw error // Propagate the error to the caller
  }

  return data // Return the created session data
}
