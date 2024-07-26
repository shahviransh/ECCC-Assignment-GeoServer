<!-- src/App.vue -->
<template>
  <div id="app">
    <MapComponent />
  </div>
</template>

<script>
import MapComponent from './components/MapComponent.vue';

export default {
  name: 'App',
  components: {
    MapComponent
  }
};
</script>

<style>
@import 'tailwindcss/tailwind.css';
</style>
