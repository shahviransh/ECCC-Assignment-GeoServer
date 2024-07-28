<template>
  <div id="app">
    <!-- Use the LeafletMap component -->
    <LeafletMap />
  </div>
</template>

<script>
import LeafletMap from './components/LeafletMap.vue'; // Import the LeafletMap component

export default {
  name: 'App',
  components: {
    LeafletMap, // Register the LeafletMap component
  },
};
</script>
