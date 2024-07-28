<template>
    <!-- This div will hold the Leaflet map -->
    <div id="map" class="h-screen w-full"></div>
</template>

<script>
import { onMounted, onBeforeUnmount, ref } from 'vue';
import 'leaflet/dist/leaflet.css'; // Import Leaflet CSS
import L from 'leaflet'; // Import Leaflet library

export default {
    name: 'LeafletMap',
    setup() {
        const map = ref(null); // Create a reactive reference for the map

        onMounted(() => {
            // Initialize the map when the component is mounted
            map.value = L.map('map').setView([25.5, 118.88], 12);

            // Add the base tile layer from OpenStreetMap
            L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
            }).addTo(map.value);

            // Add GeoServer WMS layer with the provided link
            L.tileLayer.wms('http://localhost:9090/geoserver/ECCCGeoServer/wms', {
                layers: 'ECCCGeoServer:basin',
                format: 'image/png',
                transparent: true,
                version: '1.3.0',
                request: 'GetMap',
                srs: 'EPSG:4326',
                styles: '',
            }).addTo(map.value);
        });

        onBeforeUnmount(() => {
            // Clean up the map instance when the component is unmounted
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
/* Style for the map container */
#map {
    width: 99vw;
    height: 97vh;
}
</style>