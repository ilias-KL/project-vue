<template>
  <!-- Main app container -->
  <div>
    <!-- App header with logo -->
    <header class="bg-gray-900 text-white py-4 px-6 text-center">
      <h1 class="text-3xl font-bold text-fuchsia-500">Attendo</h1>
    </header>

    <!-- Navigation bar -->
    <nav class="bg-gray-100 text-sm text-gray-700 px-6 py-2 flex items-center justify-between">
      <!-- Main navigation links -->
      <div class="flex gap-6">
        <RouterLink to="/" class="hover:underline">Accueil</RouterLink>
        <RouterLink to="/sessions" class="hover:underline">Sessions</RouterLink>
        <RouterLink to="/a-propos" class="hover:underline">À propos</RouterLink>
      </div>

      <!-- Authentication buttons -->
      <div>
        <!-- Show login button when user is not authenticated -->
        <button
          v-if="!user"
          @click="login"
          class="border border-gray-400 text-gray-800 px-3 py-1 rounded hover:bg-gray-200 text-sm"
        >
          Connexion avec Google
        </button>
        <!-- Show logout button when user is authenticated -->
        <button
          v-else
          @click="logout"
          class="border border-red-400 text-red-800 px-3 py-1 rounded hover:bg-red-100 text-sm"
        >
          Déconnexion
        </button>
      </div>
    </nav>

    <!-- Main content area where router views will be rendered -->
    <main class="p-6">
      <RouterView />
    </main>
  </div>
</template>

<script setup>
// Vue Router imports
import { RouterLink, RouterView, useRouter } from 'vue-router'
// Supabase client import
import { supabase } from '@/lib/supabase.js'
// Authentication composable
import { useAuth } from '@/composables/useAuth.js'

// Get router instance
const router = useRouter()
// Get user state from auth composable
const { user } = useAuth()

/**
 * Handles Google OAuth login
 */
const login = async () => {
  const { error } = await supabase.auth.signInWithOAuth({ provider: 'google' })
  if (error) console.error('Erreur connexion :', error.message)
}

/**
 * Handles user logout
 * Redirects to home page after sign out
 */
const logout = async () => {
  await supabase.auth.signOut()
  router.push('/')
}
</script>
