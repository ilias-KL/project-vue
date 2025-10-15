<template>
  <div class="p-4">
    <!-- Breadcrumb navigation component -->
    <Breadcrumb />

    <!-- Session title -->
    <h2 class="text-xl font-bold mb-4">Session <i>{{ nomSession }}</i></h2>

    <!-- Table showing UEs in this session -->
    <TableComponent
      :headers="['UE']"
      :items="uesDansSession"
      :attributes="['ue']"
      @row-click="goToUe"
    />

    <!-- Add UE section -->
    <div class="mt-6">
      <label for="ue-select" class="mr-2">Ajouter une UE dans la session</label>
      <!-- UE selection dropdown -->
      <select
        v-model="ueAajouter"
        id="ue-select"
        class="border rounded px-2 py-1"
      >
        <option disabled value="">Choisissez une ue</option>
        <option
          v-for="ue in uesDisponibles"
          :key="ue"
          :value="ue"
        >
          {{ ue }}
        </option>
      </select>
      <!-- Add button -->
      <button
        @click="ajouterUE"
        class="ml-2 px-4 py-1 bg-gray-200 rounded hover:bg-gray-300"
      >
        Ajouter l'UE
      </button>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import TableComponent from '@/components/TableComponent.vue'
import { supabase } from '@/lib/supabase'
import Breadcrumb from '@/components/AppBreadcrumb.vue'

// Router and route setup
const route = useRoute()
const router = useRouter()
const sessionId = route.params.id // Get session ID from route params

// Reactive data
const nomSession = ref('') // Session name
const uesDansSession = ref([]) // UEs already in this session
const toutesLesUes = ref([]) // All available UEs in system
const ueAajouter = ref('') // Currently selected UE to add

/**
 * Load UEs already assigned to this session
 */
const chargerUesDansSession = async () => {
  const { data, error } = await supabase
    .from('session_compo')
    .select('ue')
    .eq('session', sessionId)

  if (error) console.error('Error loading session UEs:', error)
  uesDansSession.value = data || []
}

/**
 * Navigate to UE detail view when row clicked
 * @param {Object} item - The clicked UE item
 */
const goToUe = async (item) => {
  // Get the session_compo ID for this UE
  const { data, error } = await supabase
    .from('session_compo')
    .select('id')
    .eq('session', sessionId)
    .eq('ue', item.ue)
    .single()

  if (error) {
    console.error('Error finding session_compo:', error)
    return
  }

  const sessionCompoId = data.id
  const ueName = item.ue
  // Navigate to UE detail view
  router.push(`/sessions/${sessionId}/ue/${sessionCompoId}/${ueName}`)
}

/**
 * Load all available UEs in the system
 */
const chargerToutesLesUes = async () => {
  const { data, error } = await supabase.from('ue').select('ue')
  if (error) console.error('Error loading all UEs:', error)
  toutesLesUes.value = data?.map(d => d.ue) || []
}

/**
 * Add selected UE to current session
 */
const ajouterUE = async () => {
  if (!ueAajouter.value) return

  const { error } = await supabase
    .from('session_compo')
    .insert([{ ue: ueAajouter.value, session: sessionId }])

  if (error) {
    console.error('Error adding UE:', error)
  } else {
    // Reset selection and reload data
    ueAajouter.value = ''
    await chargerUesDansSession()
  }
}

/**
 * Computed property of UEs not yet in this session
 */
const uesDisponibles = computed(() => {
  const existantes = new Set(uesDansSession.value.map(u => u.ue))
  return toutesLesUes.value.filter(ue => !existantes.has(ue))
})

/**
 * Load the name of the current session
 */
const chargerNomSession = async () => {
  const { data } = await supabase
    .from('sessions')
    .select('label')
    .eq('id', sessionId)
    .single()
  nomSession.value = data?.label || ''
}

// Load initial data when component mounts
onMounted(async () => {
  await chargerNomSession()
  await chargerUesDansSession()
  await chargerToutesLesUes()
})
</script>
