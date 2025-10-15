import { createRouter, createWebHistory } from 'vue-router'
// Import all view components
import AccueilView from '../views/AccueilView.vue'
import SessionView from '../views/SessionView.vue'
import AProposView from '../views/AProposView.vue'
import SessionDetailView from '../views/SessionDetailView.vue'
import UeDetailView from '../views/UeDetailView.vue'
import EventDetailView from '../views/EventDetailView.vue'

/**
 * Application routes configuration
 * Each route defines path, component and metadata for breadcrumbs
 */
const routes = [
  // Home route
  {
    path: '/',
    name: 'Accueil',
    component: AccueilView,
    meta: { breadcrumb: 'Accueil' }, // Breadcrumb display text
  },
  // Sessions list route
  {
    path: '/sessions',
    name: 'Sessions',
    component: SessionView,
    meta: { breadcrumb: 'Sessions' },
  },
  // Single session detail route
  {
    path: '/sessions/:id',
    name: 'SessionDetail',
    component: SessionDetailView,
    meta: { breadcrumb: 'Session' },
  },
  // About page route
  {
    path: '/a-propos',
    name: 'APropos',
    component: AProposView,
    meta: { breadcrumb: 'À propos' },
  },
  // Teaching Unit (UE) detail route
  {
    path: '/sessions/:sessionId/ue/:sessionCompoId/:ue',
    name: 'ueDetail',
    component: UeDetailView,
    meta: { breadcrumb: 'UE' },
  },
  // Exam event detail route
  {
    path: '/sessions/:sessionId/ue/:sessionCompoId/:ue/event/:eventId',
    name: 'EventDetail',
    component: EventDetailView,
    meta: { breadcrumb: 'épreuve' }
  },
  // Attendance view route (lazy-loaded)
  {
    path: '/sessions/:sessionId/ue/:sessionCompoId/:ue/event/:eventId/room/:roomId',
    name: 'AttendanceView',
    // Lazy-loaded component for better performance
    component: () => import('@/views/AttendanceView.vue'),
    meta: { breadcrumb: 'local' }
  }
]

/**
 * Create and configure the Vue Router instance
 */
const router = createRouter({
  // Use HTML5 history mode for clean URLs
  history: createWebHistory(import.meta.env.BASE_URL),
  // Register all routes
  routes,
})

export default router
