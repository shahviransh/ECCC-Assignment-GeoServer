<template>
    <div id="map" class="h-screen w-full"></div>
</template>

<script>
import { onMounted, onBeforeUnmount, ref, defineEmits } from 'vue';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import proj4 from 'proj4';
import 'proj4leaflet';

export default {
    name: 'LeafletMap',
    setup(_, { emit }) {
        const map = ref(null);

        onMounted(() => {
            // Define the CRS for the WMS layer
            const crs26917 = new L.Proj.CRS('EPSG:26917',
                '+proj=utm +zone=17 +datum=NAD83 +units=m +no_defs',
                {
                    resolutions: [8192, 4096, 2048, 1024, 512, 256, 128, 64, 32, 16, 8, 4, 2, 1],
                });

            // Convert ESPG:26917 coordinates to EPSG:4326
            const latlng = proj4('EPSG:26917', 'EPSG:4326', [447263.68140, 4829457.64344]);

            map.value = L.map('map').setView([latlng[1], latlng[0]], 14);

            L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
            }).addTo(map.value);

            // Add the WMS layer
            L.tileLayer.wms('http://localhost:9090/geoserver/ECCCGeoServer/wms', {
                layers: 'ECCCGeoServer:subbasin',
                format: 'image/png',
                transparent: true,
                version: '1.3.0',
                crs: crs26917,
                styles: '',
            }).addTo(map.value);

            // Listen for clicks on the map to fetch data for the clicked polygon
            map.value.on('click', function (e) {
                // Convert clicked lat/lng from EPSG:4326 to EPSG:26917
                const coords26917 = proj4('EPSG:4326', 'EPSG:26917', [e.latlng.lng, e.latlng.lat]);
                const x = coords26917[0].toFixed(4);
                const y = coords26917[1].toFixed(4);
                // Define a small bbox around the clicked point
                const buffer = 1;
                const bbox = `${x - buffer},${y - buffer},${x + buffer},${y + buffer}`;
                const url = `http://localhost:9090/geoserver/ECCCGeoServer/wfs?service=WFS&version=1.3.0&request=GetFeature&typename=ECCCGeoServer:subbasin&outputFormat=application/json&BBOX=${bbox}&crs=EPSG:26917`;
                fetch(url)
                    .then(response => response.json())
                    .then(data => {
                        // Organize the fetched data
                        const newData = data.features.map(data => data.properties);
                        const featureData = newData.map(data => cleanObject(extractFeatureData(data, 'OBJECTID')));
                        // Assuming featureData includes a list of IDs
                        // Emit the event with the data
                        if (featureData.length > 1) {
                            emit('polygonClicked', {
                                ids: null,
                                defaultData: featureData, // Replace with default chart data for many ids
                                type: 'line',
                            });
                        } else {
                            emit('polygonClicked', {
                                ids: null,
                                defaultData: featureData[0], // Replace with default chart data for a single id
                                type: 'pie',
                            });
                        }
                    })
                    .catch(error => console.error('Error fetching feature info:', error));
            });

            const extractFeatureData = (data, options) => {
                // Remove the options key from the data object
                return Object.keys(data).filter(objKey =>
                    objKey !== options).reduce((newObj, key) => {
                        newObj[key] = data[key];
                        return newObj;
                    }, {}
                    ) || {};
            }

            const cleanObject = (obj) => {
                // cleanObject function to remove null and empty values from an object
                return Object.fromEntries(
                    Object.entries(obj).filter(([key, value]) => value !== null && value !== '')
                );
            };
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