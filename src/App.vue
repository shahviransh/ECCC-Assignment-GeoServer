<template>
  <div id="map" class="h-screen w-full"></div>
</template>

<script>
import { onMounted, onBeforeUnmount, ref } from 'vue';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import './Tween.js';

export default {
  name: 'LeafletMap',
  setup() {
    const map = ref(null);

    onMounted(() => {
      map.value = L.map('map').setView([25.5, 118.88], 12);

      // Add the base tile layer
      L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map.value);

      // Add GeoServer WMS layer with the provided link
      L.tileLayer.wms('http://localhost:9090/geoserver/ECCCGeoServer/wms', {
        layers: 'ECCCGeoServer:basin',
        format: 'image/png',
        transparent: true,
        version: '1.1.0',
        request: 'GetMap',
        srs: 'EPSG:4326',
        styles: '',
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
  width: 99vw;
  height: 97vh;
}
</style>
