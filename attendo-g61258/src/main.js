// Import global CSS styles
import './assets/main.css'

// Vue framework imports
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// Authentication and state management imports
import { supabase } from '@/lib/supabase'
import { createPinia } from 'pinia'

// Create Vue application instance
const app = createApp(App)

// Initialize global user property
app.config.globalProperties.$user = null

/**
 * Check current authentication state when app starts
 * Sets the global user property if user is logged in
 */
supabase.auth.getUser().then(({ data: { user } }) => {
  app.config.globalProperties.$user = user
})

/**
 * Listen for authentication state changes
 * Updates global user property on login/logout
 */
supabase.auth.onAuthStateChange((event, session) => {
  app.config.globalProperties.$user = session?.user || null
})

// Register Pinia for state management
app.use(createPinia())

// Register Vue Router
app.use(router)

// Mount the app to the DOM
app.mount('#app')
