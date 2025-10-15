<template>
  <!-- Main container with padding and vertical spacing -->
  <div class="p-6 space-y-6">
    <!-- Breadcrumb navigation component -->
    <Breadcrumb />

    <!-- Page title showing current room -->
    <h1 class="text-2xl font-bold mb-4">
      Prise de présence du local {{ roomLabel }} par TNI
    </h1>

    <!-- Supervisor selection section -->
    <div class="flex gap-4 items-center">
      <!-- Teacher dropdown selector -->
      <select v-model="selectedSupervisor" class="border px-2 py-1 rounded">
        <option disabled value="">Choisir/modifier le surveillant</option>
        <option v-for="teacher in teachers" :key="teacher.acro" :value="teacher.acro">
          {{ teacher.names }} ({{ teacher.acro }})
        </option>
      </select>

      <!-- Button to assign supervisor -->
      <button
        @click="defineSupervisor"
        class="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Définir le surveillant
      </button>
    </div>

    <!-- Students attendance table -->
    <table class="w-full border mt-6">
      <thead>
        <tr class="bg-gray-200">
          <th class="p-2 border">MATRICULE</th>
          <th class="p-2 border">GROUP</th>
          <th class="p-2 border">NOM</th>
          <th class="p-2 border">PRÉNOM</th>
        </tr>
      </thead>
      <tbody>
        <!-- Student rows - clickable to toggle presence -->
        <tr
          v-for="student in students"
          :key="student.student_id"
          @click="togglePresence(student.student_id)"
          :class="isPresent(student.student_id) ? 'bg-blue-100' : ''"
          class="cursor-pointer hover:bg-gray-100"
        >
          <td class="p-2 border">{{ student.student_id }}</td>
          <td class="p-2 border">{{ student.group }}</td>
          <td class="p-2 border">{{ student.lastname }}</td>
          <td class="p-2 border">{{ student.firstname }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { supabase } from '@/lib/supabase'
import Breadcrumb from '@/components/AppBreadcrumb.vue'

// Get route parameters
const route = useRoute()
const {
  ue: ue,
  roomId
} = route.params

// Reactive data
const students = ref([]) // List of students
const presentStudents = ref(new Set()) // Set of present student IDs
const teachers = ref([]) // List of teachers
const selectedSupervisor = ref('') // Currently selected supervisor
const roomLabel = ref('') // Room label/name

/**
 * Load students enrolled in the current UE
 */
const loadStudents = async () => {
  const { data } = await supabase
    .from('pae')
    .select('student:student_id(student_id, firstname, lastname), group')
    .eq('ue', ue)

  students.value = (data || []).map(item => ({
    student_id: item.student.student_id,
    firstname: item.student.firstname,
    lastname: item.student.lastname,
    group: item.group
  }))
}

/**
 * Load all available teachers
 */
const loadTeachers = async () => {
  const { data } = await supabase.from('teacher').select('acro, names')
  teachers.value = data || []
}

/**
 * Load the label/name of the current room
 */
const loadRoomLabel = async () => {
  const { data } = await supabase
    .from('examination_room')
    .select('room(label)')
    .eq('id', roomId)
    .single()

  roomLabel.value = data?.room?.label || ''
}

/**
 * Load initially present students
 */
const loadPresentStudents = async () => {
  const { data } = await supabase
    .from('examination')
    .select('student')
    .eq('examination_room', roomId)

  presentStudents.value = new Set(data?.map(item => item.student) || [])
}

/**
 * Toggle student presence status
 * @param {string} studentId - ID of the student to toggle
 */
const togglePresence = async (studentId) => {
  if (presentStudents.value.has(studentId)) {
    // Student is present → remove from attendance
    const { error } = await supabase
      .from('examination')
      .delete()
      .eq('student', studentId)
      .eq('examination_room', roomId)

    if (!error) {
      presentStudents.value.delete(studentId)
    } else {
      console.error('Erreur en retirant la présence:', error)
    }
  } else {
    // Student is absent → add to attendance
    const { error } = await supabase
      .from('examination')
      .insert([{ student: studentId, examination_room: roomId }])

    if (!error) {
      presentStudents.value.add(studentId)
    } else {
      console.error('Erreur en ajoutant la présence:', error)
    }
  }
}

/**
 * Check if a student is marked as present
 * @param {string} studentId - ID of the student to check
 * @returns {boolean} True if student is present
 */
const isPresent = (studentId) => {
  return presentStudents.value.has(studentId)
}

/**
 * Assign selected teacher as supervisor for this room
 */
const defineSupervisor = async () => {
  if (!selectedSupervisor.value) return

  const { error } = await supabase
    .from('examination_room')
    .update({ supervisor: selectedSupervisor.value })
    .eq('id', roomId)

  if (error) {
    console.error('Erreur pour définir le surveillant:', error)
  } else {
    alert('Surveillant défini avec succès !')
  }
}

// Load initial data when component mounts
onMounted(async () => {
  await loadStudents()
  await loadTeachers()
  await loadRoomLabel()
  await loadPresentStudents()
})
</script>
