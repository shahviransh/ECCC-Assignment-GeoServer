<!-- src/components/MapComponent.vue -->
<template>
    <div id="map" class="h-screen w-full"></div>
</template>

<script>
import { onMounted } from 'vue';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';  // Ensure Leaflet CSS is imported

export default {
    name: 'MapComponent',
    setup() {
        onMounted(() => {
            // Initialize the map
            const map = L.map('map').setView([0, 0], 2);

            // Add the base tile layer
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; OpenStreetMap contributors'
            }).addTo(map);

            // Add GeoServer WMS layer
            const wmsLayer = L.tileLayer.wms('http://localhost:9090/geoserver/ECCCGeoServer/wms', {
                layers: 'ECCCGeoServer:basin',
                styles: 'polygon',
                format: 'image/png',
                version: '1.3.0',
                request: 'GetMap',
                srs: 'EPSG:4326'
            }).addTo(map);
        });
    }
};
</script>

<style scoped>
#map {
    height: 100%;
}
</style>