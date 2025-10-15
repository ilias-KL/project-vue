<template>
  <!-- Welcome message container with top margin -->
  <div class="text-center mt-8">
    <!-- Display welcome message if user is authenticated -->
    <h2 v-if="user" class="text-xl">
      Bienvenue, {{ user.email }}  <!-- Show user's email -->
    </h2>

    <!-- Display login prompt if user is not authenticated -->
    <p v-else>
      Veuillez vous connecter pour utiliser l'application.
    </p>
  </div>
</template>

<script setup>
// Import authentication composable
import { useAuth } from '@/composables/useAuth'

// Destructure the user ref from useAuth composable
// This will be reactive and update when auth state changes
const { user } = useAuth()
</script>
