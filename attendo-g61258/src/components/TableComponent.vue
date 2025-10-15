<template>
  <!-- Container for the table with responsive overflow and styling -->
  <div class="overflow-x-auto rounded-lg shadow">
    <!-- Table element with full width and divided rows -->
    <table class="min-w-full divide-y divide-gray-200 bg-white">
      <!-- Table header with dark background -->
      <thead class="bg-gray-800 text-white">
        <tr>
          <!-- Loop through each header to create table columns -->
          <th
            v-for="header in headers"
            :key="header"
            class="px-4 py-2 text-left text-sm font-bold"
          >
            <!-- Display header text in uppercase -->
            {{ header.toUpperCase() }}
          </th>
        </tr>
      </thead>

      <!-- Table body with alternating row colors -->
      <tbody class="divide-y divide-gray-200">
        <!-- Loop through each item to create table rows -->
        <tr
          v-for="item in items"
          :key="item.id"
          @click="() => $emit('row-click', item)"
          class="cursor-pointer hover:bg-gray-100"
        >
          <!-- Loop through each attribute to create cells for the current row -->
          <td
            v-for="attr in attributes"
            :key="attr"
            class="px-4 py-2 text-sm text-gray-700"
          >
            <!-- Display the item's property value -->
            {{ item[attr] }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
// Define component props
defineProps({
  headers: Array,     // Array of column headers to display
  items: Array,       // Array of data objects to display as rows
  attributes: Array,  // Array of property names to display from each item
})
</script>
