// Import the Supabase client instance
import { supabase } from '@/lib/supabase.js'

/**
 * Fetches all events for a specific session component
 * @param {string} sessionCompoId - The ID of the session component
 * @returns {Promise<Array>} Array of event objects
 * @throws {Error} If Supabase query fails
 */
export async function fetchEvents(sessionCompoId) {
  // Execute Supabase query to get all events matching the session component ID
  const { data, error } = await supabase
    .from('event')              // Select the 'event' table
    .select('*')                // Select all columns
    .eq('session_compo', sessionCompoId)  // Filter by session component ID

  if (error) {
    console.error('Error fetching events:', error)
    throw error  // Re-throw the error for the caller to handle
  }

  return data  // Return the array of event data
}

/**
 * Adds a new event to a session component
 * @param {string} sessionCompoId - The ID of the session component
 * @param {string} label - The name/label of the new event
 * @returns {Promise<Object>} The created event data
 * @throws {Error} If Supabase insertion fails
 */
export async function addEvent(sessionCompoId, label) {
  // Execute Supabase query to insert a new event
  const { data, error } = await supabase
    .from('event')  // Select the 'event' table
    .insert([{      // Insert a new row with:
      session_compo: sessionCompoId,  // Reference to session component
      label,                         // Event name/label
      completed: false               // Default completion status
    }])

  if (error) {
    console.error('Error adding event:', error)
    throw error  // Re-throw the error for the caller to handle
  }

  return data  // Return the created event data
}
