<!--
  AboutView.vue - Displays application information and author details
  This is a static informational view that doesn't require any JavaScript logic
-->
<template>
  <!-- Main container with responsive padding, max width, and card styling -->
  <div class="p-6 max-w-3xl mx-auto bg-white rounded-lg shadow-md">
    <!-- Page title with purple accent color -->
    <h1 class="text-3xl font-bold text-fuchsia-500 mb-4">À propos</h1>

    <!-- Information list with semantic HTML structure -->
    <ul class="list-disc pl-6 space-y-2 text-gray-700">
      <!-- Author information -->
      <li>
        <span class="font-semibold">Auteur :</span>
        ilias KOUIMEN LAMARTI (61258)
      </li>

      <!-- Academic year -->
      <li>
        <span class="font-semibold">Année scolaire :</span>
        2024 - 2025
      </li>

      <!-- Technology stack with nested list -->
      <li>
        <span class="font-semibold">Technologies utilisées :</span>
        <ul class="list-disc pl-6">
          <li>Vue 3 - Progressive JavaScript framework</li>
          <li>Pinia - State management library</li>
          <li>Vue Router - Official routing for Vue.js</li>
          <li>TailwindCSS - Utility-first CSS framework</li>
          <li>Vite - Next generation frontend tooling</li>
        </ul>
      </li>

      <!-- Project description -->
      <li>
        <span class="font-semibold">Projet :</span>
        Application de prise de présence pour l'ÉSI
      </li>

      <!-- Future improvement notes -->
      <li>
        <span class="font-semibold">Remarque :</span>
        Ce projet peut être amélioré avec la gestion des rôles, des affectations profs,
        et la détection de doublons de présence.
      </li>
    </ul>
  </div>
</template>
