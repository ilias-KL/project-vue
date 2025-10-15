<!-- SessionView.vue - Displays and manages exam sessions -->
<template>
  <div class="p-4 space-y-6">
    <!-- Only show content if user is authenticated -->
    <div v-if="user">
      <!-- Breadcrumb navigation -->
      <Breadcrumb />

      <!-- Page title -->
      <h1 class="text-2xl font-bold mb-4">Sessions</h1>

      <!-- Sessions table with click handler -->
      <TableComponent
        :headers="['Sessions']"
        :items="sessions"
        :attributes="['label']"
        @row-click="goToSession"
      />

      <!-- New session creation form -->
      <div class="mt-6">
        <label for="newSession" class="mr-2 font-semibold">
          Nouvelle session 🗓️
        </label>
        <input
          v-model="nouvelleSession"
          id="newSession"
          type="text"
          placeholder="juin"
          class="border rounded px-3 py-1"
        />
        <button
          @click="ajouterSession"
          class="ml-2 px-4 py-1 bg-gray-200 rounded hover:bg-gray-300"
        >
          Ajouter
        </button>
      </div>
    </div>

    <!-- Message shown when user is not authenticated -->
    <p v-else class="text-center py-8 text-gray-600">
      Veuillez vous connecter pour accéder aux sessions.
    </p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import { fetchSessions, addSession } from '@/service/listSessionsService'
import TableComponent from '@/components/TableComponent.vue'
import Breadcrumb from '@/components/AppBreadcrumb.vue'

// Authentication state
const { user } = useAuth()

// Router instance for navigation
const router = useRouter()

// Reactive data
const sessions = ref([]) // List of sessions
const nouvelleSession = ref('') // New session name input

/**
 * Navigate to session detail view
 * @param {Object} session - The clicked session object
 */
const goToSession = (session) => {
  router.push(`/sessions/${session.id}`)
}

/**
 * Load all sessions from the database
 */
const chargerSessions = async () => {
  const result = await fetchSessions()
  console.log('Sessions loaded:', result)
  sessions.value = result
}

/**
 * Add a new session to the database
 */
const ajouterSession = async () => {
  // Validate input
  if (!nouvelleSession.value.trim()) return

  // Add session through service
  await addSession(nouvelleSession.value.trim())

  // Reset input and refresh list
  nouvelleSession.value = ''
  await chargerSessions()
}

// Load sessions when component mounts
onMounted(chargerSessions)
</script>
