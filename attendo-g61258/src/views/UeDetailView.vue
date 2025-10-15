<!-- UeDetailView.vue - Displays and manages exams for a specific UE -->
<template>
  <div class="p-4 space-y-6">
    <!-- Breadcrumb navigation -->
    <Breadcrumb />

    <!-- Page title showing UE and session info -->
    <h1 class="text-2xl font-bold mb-4">
      Liste des épreuves de {{ ueName }} (session : {{ sessionLabel }})
    </h1>

    <!-- List of exams as clickable cards -->
    <div class="flex space-x-4">
      <router-link
        v-for="event in events"
        :key="event.id"
        :to="{
          name: 'EventDetail',
          params: {
            sessionId: route.params.sessionId,
            sessionCompoId: route.params.sessionCompoId,
            ue: route.params.ue,
            eventId: event.id
          }
        }"
        class="border rounded p-4 shadow-md hover:bg-gray-100 transition-colors"
      >
        {{ event.label }}
      </router-link>
    </div>

    <!-- Add new exam form -->
    <div class="mt-6">
      <h2 class="text-xl font-semibold mb-2">Ajouter une épreuve</h2>
      <div class="flex items-center">
        <input
          v-model="newEventLabel"
          type="text"
          placeholder="bilan, projet, examen..."
          class="border rounded px-3 py-1 flex-grow max-w-md"
        />
        <button
          @click="addEvent"
          class="ml-2 px-4 py-1 bg-gray-200 rounded hover:bg-gray-300 transition-colors"
        >
          Créer
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import Breadcrumb from '@/components/AppBreadcrumb.vue'
import { fetchEvents, addEvent as createEvent } from '@/service/eventService'
import { supabase } from '@/lib/supabase'

const route = useRoute()

// Reactive data
const ueName = ref('')          // Current UE name
const sessionLabel = ref('')    // Current session label
const events = ref([])          // List of exams
const sessionCompoId = ref(null) // Current session component ID
const newEventLabel = ref('')    // New exam name input

/**
 * Load exams and related information
 */
const chargerEvents = async () => {
  // Get UE name from route params
  ueName.value = route.params.ue

  // Get session component ID from route params
  sessionCompoId.value = route.params.sessionCompoId

  // Fetch exams for this UE
  events.value = await fetchEvents(sessionCompoId.value)

  // Fetch session label using a join query
  const { data, error } = await supabase
    .from('session_compo')
    .select('session(label)')
    .eq('id', sessionCompoId.value)
    .single()

  if (error) {
    console.error('Error loading session label:', error)
  } else {
    sessionLabel.value = data?.session?.label || 'Session inconnue'
  }
}

/**
 * Create a new exam
 */
const addEvent = async () => {
  // Validate input
  if (!newEventLabel.value.trim()) return

  // Create exam through service
  await createEvent(sessionCompoId.value, newEventLabel.value.trim())

  // Reset input and refresh list
  newEventLabel.value = ''
  await chargerEvents()
}

// Load data when component mounts
onMounted(chargerEvents)
</script>
