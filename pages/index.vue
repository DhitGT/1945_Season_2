<template>
  <div class="flex flex-col items-center justify-center h-screen bg-gray-100">
    <h1 class="text-4xl font-bold mb-8 text-center">Game Menu</h1>

    <!-- Level Selection -->
    <div class="mb-6">
      <label for="level-select" class="block text-lg font-medium text-gray-700"
        >Select Level:</label
      >
      <select
        id="level-select"
        v-model="selectedLevel"
        class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
      >
        <option v-for="level in levels" :key="level.level" :value="level.level">
          Level {{ level.level }}
        </option>
      </select>
    </div>

    <button
      @click="startGame"
      class="mb-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none"
    >
      Play
    </button>

    <!-- Shop and Character Settings Buttons -->
    <div>
      <div class="flex space-x-4">
        <button
          @click="openShop"
          class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none"
        >
          Shop
        </button>
        <button
          @click="openCharacterSettings"
          class="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none"
        >
          Character Settings
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      selectedLevel: null,
      levels: [
        { level: 1 },
        { level: 2 },
        { level: 3 },
        // Add more levels as needed
      ],
    }
  },
  methods: {
    startGame() {
      window.location.href = '/game'
      if (this.selectedLevel) {
        // Logic to start the game at the selected level
        console.log(`Starting Level ${this.selectedLevel}`)
      } else {
        alert('Please select a level to play.')
      }
    },
    openShop() {
      // Logic to open the shop
      console.log('Opening Shop')
    },
    openCharacterSettings() {
      // Logic to open character settings
      console.log('Opening Character Settings')
    },
  },
}
</script>

<style scoped>
/* Additional styles if needed */
</style>
