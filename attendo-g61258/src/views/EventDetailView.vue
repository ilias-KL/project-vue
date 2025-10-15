<template>
  <!-- Main container with padding and vertical spacing -->
  <div class="p-4 space-y-6">
    <!-- Breadcrumb navigation component -->
    <Breadcrumb />

    <!-- Page title showing current event -->
    <h1 class="text-2xl font-bold mb-4">
      Liste des locaux pour <span class="text-blue-600">{{ eventLabel }}</span>
    </h1>

    <!-- Grid of assigned rooms -->
    <div class="flex flex-wrap gap-4">
      <!-- Room cards - clickable to navigate to attendance view -->
      <router-link
        v-for="room in assignedRooms"
        :key="room.id"
        :to="{
          name: 'AttendanceView',
          params: {
            sessionId: route.params.sessionId,
            sessionCompoId: route.params.sessionCompoId,
            ue: route.params.ue,
            eventId: route.params.eventId,
            roomId: room.id
          }
        }"
        class="border rounded p-4 shadow-md w-40 flex flex-col items-center hover:bg-gray-100"
      >
        <!-- Room label -->
        <div class="text-lg font-bold">{{ room.room_label }}</div>

        <!-- Capacity indicator (current/max) -->
        <div class="border-2 border-blue-400 text-blue-600 rounded-full px-3 py-1 mt-2 text-sm flex items-center justify-center">
          {{ room.studentCount }} / {{ room.capacity }}
        </div>

        <!-- Supervisor information -->
        <div class="mt-2 text-sm text-gray-600">
          <span class="font-bold">Surveillant:</span> {{ room.supervisor_acro }}
        </div>
      </router-link>
    </div>

    <!-- Room assignment section -->
    <div class="mt-6">
      <h2 class="text-xl font-semibold mb-2">Ajouter un local</h2>
      <div class="flex items-center gap-2">
        <!-- Room selection dropdown -->
        <select v-model="selectedRoom" class="border rounded px-2 py-1">
          <option disabled value="">Choisissez un local</option>
          <option
            v-for="room in availableRooms"
            :key="room.label"
            :value="room.label"
          >
            {{ room.label }} ({{ room.capacity }} places)
          </option>
        </select>

        <!-- Add room button -->
        <button
          @click="addRoom"
          class="px-4 py-1 bg-gray-200 rounded hover:bg-gray-300"
        >
          Ajouter
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { supabase } from '@/lib/supabase'
import Breadcrumb from '@/components/AppBreadcrumb.vue'

// Get current route information
const route = useRoute()
const eventId = route.params.eventId

// Reactive data
const eventLabel = ref('') // Label of the current event
const assignedRooms = ref([]) // Rooms already assigned to this event
const allRooms = ref([]) // All available rooms in the system
const selectedRoom = ref('') // Currently selected room for assignment

/**
 * Load the label/name of the current event
 */
const loadEventLabel = async () => {
  const { data } = await supabase
    .from('event')
    .select('label')
    .eq('id', eventId)
    .single()
  eventLabel.value = data?.label || ''
}

/**
 * Load rooms assigned to this event with additional information
 */
const loadAssignedRooms = async () => {
  // Get basic room information
  const { data: rooms } = await supabase
    .from('examination_room')
    .select('id, room:room(label, capacity), supervisor:supervisor(acro)')
    .eq('event', eventId)

  // Enrich each room with student count
  const enrichedRooms = await Promise.all(
    rooms.map(async (room) => {
      const { count } = await supabase
        .from('examination')
        .select('*', { count: 'exact', head: true })
        .eq('examination_room', room.id)

      return {
        id: room.id,
        room_label: room.room.label,
        capacity: room.room.capacity,
        supervisor_acro: room.supervisor?.acro || 'N/A',
        studentCount: count || 0,
      }
    })
  )

  assignedRooms.value = enrichedRooms
}

/**
 * Load all available rooms in the system
 */
const loadAllRooms = async () => {
  const { data } = await supabase.from('room').select('label, capacity')
  allRooms.value = data || []
}

/**
 * Assign a new room to the current event
 */
const addRoom = async () => {
  if (!selectedRoom.value) return

  // Find the selected room in all available rooms
  const room = allRooms.value.find(r => r.label === selectedRoom.value)
  if (!room) return

  // Insert new examination room assignment
  const { error } = await supabase
    .from('examination_room')
    .insert([{ event: eventId, room: room.label }])

  if (error) {
    console.error('Error adding room:', error)
  } else {
    // Reset selection and reload data
    selectedRoom.value = ''
    await loadAssignedRooms()
  }
}

/**
 * Computed property of rooms not yet assigned to this event
 */
const availableRooms = computed(() => {
  const assigned = new Set(assignedRooms.value.map(r => r.room_label))
  return allRooms.value.filter(room => !assigned.has(room.label))
})

// Load initial data when component mounts
onMounted(async () => {
  await loadEventLabel()
  await loadAssignedRooms()
  await loadAllRooms()
})
</script>
