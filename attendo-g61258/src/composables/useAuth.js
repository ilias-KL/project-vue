import { ref, onMounted } from 'vue'
import { supabase } from '@/lib/supabase'

// Reactive reference to store the current user
const user = ref(null)

/**
 * Composable function for handling authentication state
 * Provides reactive user state and handles auth state changes
 * @returns {Object} An object containing the reactive user reference
 */
export function useAuth() {
  // When component mounts, fetch the current user
  onMounted(async () => {
    // Get the current authenticated user from Supabase
    const { data: { user: currentUser } } = await supabase.auth.getUser()
    user.value = currentUser
  })

  // Set up auth state change listener
  supabase.auth.onAuthStateChange((_, session) => {
    // Update user state when auth state changes (login/logout)
    user.value = session?.user ?? null
  })

  // Return the reactive user reference for components to use
  return { user }
}
