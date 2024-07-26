<template>
  <div id="map" class="h-screen w-full"></div>
</template>

<script>
import { onMounted, onBeforeUnmount, ref } from 'vue';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import '../public/Tween.js';

export default {
  name: 'LeafletMap',
  setup() {
    const map = ref(null);

    onMounted(() => {
      map.value = L.map('map').setView([25.5, 118.88], 11);

      const customPane = map.value.createPane('customPane');
      customPane.style.zIndex = 399; // Put just behind the standard overlay pane which is at 400

      // Add the base tile layer
      L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map.value);

      // Add GeoServer WMS layer
      L.tileLayer.wms('http://localhost:9090/geoserver/ECCCGeoServer/wms', {
        layers: 'ECCCGeoServer:basin',
        styles: 'polygon',
        format: 'image/png',
        version: '1.3.0',
        request: 'GetMap',
        bbox: '118.74541666666667,25.406249999999996,119.01208333333334,25.603749999999998',
        transparent: false,
      }).addTo(map.value);
    });

    onBeforeUnmount(() => {
      if (map.value) {
        map.value.remove();
      }
    });

    return {
      map,
    };
  },
};
</script>

<style scoped>
#map {
  width: 100vw;
  height: 100vh;
}
</style>
