<script setup>
import { useRoute } from 'vue-router'
import { computed } from 'vue'

// Get current route information
const route = useRoute()

/**
 * Computed property that generates breadcrumbs based on the current route
 * Determines the navigation path hierarchy and which items should be links
 */
const crumbs = computed(() => {
  // Extract relevant path and parameters from the route
  const path = route.path
  const sessionId = route.params.sessionId
  const sessionCompoId = route.params.sessionCompoId
  const ueLabel = route.params.ue
  const eventId = route.params.eventId

  // Specific case: AttendanceView (attendance taking in a room)
  if (
    path.startsWith('/sessions/') &&
    path.includes('/ue/') &&
    path.includes('/event/') &&
    path.includes('/room/')
  ) {
    return [
      { label: 'Accueil', to: '/' },
      { label: 'Sessions', to: '/sessions' },
      { label: 'Session', to: `/sessions/${sessionId}` },
      { label: 'UE', to: `/sessions/${sessionId}/ue/${sessionCompoId}/${ueLabel}` },
      { label: 'Épreuve', to: `/sessions/${sessionId}/ue/${sessionCompoId}/${ueLabel}/event/${eventId}` },
      { label: 'Local', to: null } // Current page (no link)
    ]
  }

  // Case when we're on an exam page (EventDetailView)
  if (path.startsWith('/sessions/') && path.includes('/ue/') && path.includes('/event/')) {
    return [
      { label: 'Accueil', to: '/' },
      { label: 'Sessions', to: '/sessions' },
      { label: 'Session', to: `/sessions/${sessionId}` },
      { label: 'UE', to: `/sessions/${sessionId}/ue/${sessionCompoId}/${ueLabel}` },
      { label: 'Épreuve', to: null } // Current page (no link)
    ]
  }

  // Case when we're in a UE (Teaching Unit)
  if (path.startsWith('/sessions/') && path.includes('/ue/')) {
    return [
      { label: 'Accueil', to: '/' },
      { label: 'Sessions', to: '/sessions' },
      { label: 'Session', to: `/sessions/${sessionId}` },
      { label: 'UE', to: null } // Current page (no link)
    ]
  }

  // Case when we're in a Session
  if (path.startsWith('/sessions/') && !path.includes('/ue/')) {
    return [
      { label: 'Accueil', to: '/' },
      { label: 'Sessions', to: '/sessions' },
      { label: 'Session', to: null } // Current page (no link)
    ]
  }

  // General case for sessions
  if (path.startsWith('/sessions')) {
    return [
      { label: 'Accueil', to: '/' },
      { label: 'Sessions', to: null } // Current page (no link)
    ]
  }

  // Default case (Home)
  return [
    { label: 'Accueil', to: null } // Current page (no link)
  ]
})
</script>

<template>
  <!-- Breadcrumb navigation -->
  <nav class="text-gray-600 text-sm mb-4">
    <!-- Loop through each breadcrumb item -->
    <span v-for="(crumb, index) in crumbs" :key="index">
      <!-- Render as link if 'to' property exists -->
      <router-link v-if="crumb.to" :to="crumb.to" class="hover:underline">
        {{ crumb.label }}
      </router-link>
      <!-- Render as plain text if current page -->
      <span v-else class="font-bold">{{ crumb.label }}</span>

      <!-- Add separator between items (except last one) -->
      <span v-if="index < crumbs.length - 1" class="mx-1">&gt;</span>
    </span>
  </nav>
</template>
